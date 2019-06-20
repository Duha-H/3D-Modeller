import { Building } from '../models/building.js';
import * as feedback from '../utils/feedback.js';

/**
 * File reader for uploaded scene models
 */

var gl;
var constructedBuildings;

/**
 * Reads JSON file containing building object attributes and prepares building objects
 * to be imported into scene
 * @param {WebGLRenderingContext} glContext Rendering context
 */
export function fileReader(glContext) {
    gl = glContext;
    var inputForm = document.getElementById('file-upload');
    var reader = new FileReader();
    var file = inputForm.files[0];
    reader.readAsText(file); // set reading mode

    reader.onload = () => {
        // read file content
        parseContents(reader.result);
    }


}

/**
 * Parses content of JSON file and creates building objects based on attributes
 * @param {String} content JSON file content
 */
function parseContents(content) {
    // retreive JSON objects
    var storedBuildings = JSON.parse(content);
    constructedBuildings = []; // array of buildings to add to scene
    storedBuildings.forEach((entry) => {
        var newBuilding = createBuilding(entry);
        constructedBuildings.push(newBuilding);
    });
    console.log(`Loaded ${constructedBuildings.length} buildings.`);
    feedback.showSnackbar(`Uploaded ${constructedBuildings.length} buildings`);
}

/**
 * Returns a building model with the specified attributes
 * @param {Object} attributes Object containing building attributes
 */
function createBuilding(attributes) {
    var building = new Building(gl);
    // set building attributes
    const id = attributes.id;

    // check floor type validity
    const floorType = attributes.floorType;
    const validFloorTypes = [0, 1, 2];
    if(floorType === undefined || !validFloorTypes.includes(floorType)) { 
        console.log(`Error reading floor type of building #${id}, value invalid or undefined: ${floorType}`);
        return;
    }
    building.setType(floorType);

    // check height validity
    //const height = attributes.height;
    //if(height === undefined || typeof(height) !== 'number') {
    //    console.log(`Error reading height of building #${id}, value invalid or undefined: ${height}`);
    //    return;
    //}
    //building.setHeight(height);

    // check scale validity
    const scale = attributes.scale;
    const sx = scale[0];
    const sy = scale[1];
    const sz = scale[2];
    if(scale === undefined || scale.length !== 3 || typeof(sx) !== 'number' || typeof(sy) !== 'number' || typeof(sz) !== 'number') {
        console.log(`Error reading scale of building #${id}, value invalid or undefined: ${scale}`);
        return;
    }
    building.setScale(sx, sy, sz);

    // check position validity
    const position = attributes.position;
    const px = position[0];
    const pz = position[1];
    if(position === undefined || position.length !== 2 || typeof(px) !== 'number' || typeof(pz) !== 'number') {
        console.log(`Error reading position of building #${id}, value invalid or undefined: ${position}`);
        return;
    }
    building.setPosition(px, pz);

    // check color validity
    const color = attributes.color;
    if(color === undefined || color.length !== 3 || typeof(color[0]) !== 'number' || typeof(color[1]) !== 'number' || typeof(color[2]) !== 'number') {
        console.log(`Error reading color of building #${id}, value invalid or undefined: ${color}`);
        return;
    }
    building.setColor(attributes.color);

    return building;
}

/**
 * Draw loaded building models in scene
 * @param {Scene} scene Scene object to load buildings into
 */
export function drawBuildings(scene) {
    if (constructedBuildings === undefined || constructedBuildings.length === 0)
        console.log('Error: no buildings read');
    else {
        if(confirm('Are you sure you would like to load buildings?\nAll existing buildings will be cleared.')) {
            scene.buildings = constructedBuildings;
            scene.currBldg = constructedBuildings.length - 1;
            scene.draw();

            // clear existing uploads
            document.getElementById('upload-label').innerHTML = 'Browse...';
            constructedBuildings = [];
        }
        
        
    }
}
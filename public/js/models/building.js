import '../gl-setup/gl-matrix.js';
import { Cube } from './cube.js';
import { RoundedBlock } from './roundedBlock.js';


/**
 * Defines and creates a building object
 */


const {mat4} = glMatrix; // object destructuring to get mat4

export class Building {

    constructor(gl) {

        this.gl = gl;
        // building dimensions and attributes
        this.height = 1; // number of floors
        this.scaleX = 1;
        this.scaleZ = 1;
        this.posX = 0;
        this.posZ = 0;
        this.color = [0.5, 0.8, 0.5];

        // building cross section type
        this.types = {
            0: new Cube(this.gl),
            1: new RoundedBlock(this.gl)
        };
        this.floorType = 1; // default floor type

    }

    /**
     * Set number of building floors
     * @param {Number} height Number of floors
     */
    setHeight(height) {
        this.height = height <= 0 ? 1 : height;
    }

    /**
     * Set horizontal scale of building (base)
     * @param {Number} scaleX Scale in x direction
     * @param {Number} scaleZ Scale in z direction
     */
    setScale(scaleX, scaleZ) {
        this.scaleX = scaleX;
        this.scaleZ = scaleZ;
    }

    /**
     * Set building color
     * @param {array} color RGB color array
     */
    setColor(color) {
        this.color = color;
    }

    /**
     * Change building cross section shape
     * @param {Number} newType Index of new building type (optional)
     */
    changeType(newType) {
        if (newType)
            this.floorType = newType;
        else {
            const type = this.floorType + 1;
            this.floorType =  type == Object.keys(this.types).length ? 0 : type;
        }
    }

    /**
     * Draw building
     * @param {Object} uniformLocations Renderer uniform locations
     * @param {Object} attribLocations Renderer attribute locations
     * @param {mat4} viewMatrix Scene camera view matrix
     */
    draw(uniformLocations, attribLocations, viewMatrix) {

        let x;
        let floor = this.types[this.floorType];
        let modelMatrix = mat4.create();

        // apply building scale and color (common attributes)
        floor.setHeight(0.5); // reduce default floor height
        floor.setColor(this.color);
        mat4.translate(modelMatrix, modelMatrix, [this.posX, -1, this.posZ]);
        mat4.scale(modelMatrix, modelMatrix, [this.scaleX, 1, this.scaleZ]);
        
        
        for(let i = 0; i < this.height; i++) {
            
            x = i == 0 ? 0 : 1;
            floor.translate([0, floor.height*x, 0], modelMatrix);

            let normalMatrix = mat4.create();
            let modelViewMatrix = mat4.create();
            mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
            mat4.invert(normalMatrix, modelViewMatrix);
            mat4.transpose(normalMatrix, normalMatrix);

            // specify matrix values for shader program uniforms
            this.gl.uniformMatrix4fv(uniformLocations.model, false, modelMatrix);
            this.gl.uniformMatrix4fv(uniformLocations.normal, false, normalMatrix);

            floor.draw(attribLocations);

        }
    }
}
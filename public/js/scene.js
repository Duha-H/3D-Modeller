import { Cube } from './models/cube.js';
import { Square } from './geometry/square.js';
import { Camera } from './scene-objects/camera.js';
import { degToRad } from './utils/utils.js';
import { Line } from './geometry/line.js';
import { Grid } from './geometry/grid.js';
import { Building } from './models/building.js';


/**
 * Defines/creates the scene to be drawn/rendered
 */

const {mat4} = glMatrix; // object destructuring to get mat4
var modelViewMatrix = mat4.create();
var projectionMatrix = mat4.create();
var normalMatrix = mat4.create();

export class Scene {

    constructor(canvas, renderer) {

        this.gl = canvas.getContext('webgl');
        this.canvas = canvas;
        this.renderer = renderer;

        // set up camera
        this.vWidth = canvas.clientWidth;   // viewport width
        this.vHeight = canvas.clientHeight; // viewport height
        this.camera = this.setupCamera();

        // create scene objects
        this.grid = new Grid(this.gl, 100, 100, 2);
        this.showGrid = true;
        this.base = new Cube(this.gl);
        this.cubes = this.createCubes();
        this.buildings = [new Building(this.gl)];
        this.currBldg = 0; // currently active building
    }


    /**
     * Creates and sets up scene "camera"
     */
    setupCamera() {
        
        var camera = new Camera();

        camera.setPerspective(degToRad(60),
            this.vWidth/this.vHeight,
            1,
            150
        );

        camera.setView();

        return camera;
    }

    /**
     * Updates viewing attributes of scene camera and triggers re-draw
     * @param {Number} vAngle vertical viewing angle in degrees
     * @param {Number} hAngle horizontal viewing angle in degrees
     * @param {Number} distance length of viewing vector
     */
    updateCamera(vAngle, hAngle, distance) {
        this.camera.updateView(vAngle, hAngle, distance);
        this.draw();
    }

    /**
     * Toggle displaying grid on and off
     */
    toggleGrid() {
        this.showGrid = !this.showGrid;
        this.draw();
    }


    /**
     * Creates objects used in this particular scene
     */
    createCubes() {
        
        var cubes = [];
        for(var j = 0; j < 16; j++) {
            let newCube = new Cube(this.gl);
            cubes.push(newCube);
        }

        return cubes;
    }

    /**
     * Add new building to scene
     */
    addNewBuilding() {
        var building = new Building(this.gl);
        this.buildings.push(building);
        this.currBldg++;
    }

    /**
     * Apply transformations and draw scene objects
     */
    draw() {

        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

        // update uniforms
        this.gl.uniformMatrix4fv(this.renderer.uniformLocs.view, false, this.camera.viewMatrix);
        this.gl.uniformMatrix4fv(this.renderer.uniformLocs.projection, false, this.camera.projectionMatrix);
        
        // draw base
        let modelMatrix = mat4.create();
        this.base.translate([0, -1, 0], modelMatrix);
        this.base.scale([50, 0.08, 50], modelMatrix);

        mat4.multiply(modelViewMatrix, this.camera.viewMatrix, modelMatrix);
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        this.gl.uniformMatrix4fv(this.renderer.uniformLocs.model, false, modelMatrix);
        this.gl.uniformMatrix4fv(this.renderer.uniformLocs.normal, false, normalMatrix);

        this.base.setColor([1, 1, 1]);
        this.base.draw(this.renderer.attribLocs);

        
        // draw grid
        if (this.showGrid)
            this.grid.draw(this.renderer.uniformLocs, this.renderer.attribLocs);

    
        // draw buildings
        for(var i = 0; i < this.buildings.length; i++) {
            // set color of active building
            if(i == this.currBldg) this.buildings[i].setColor([0.5, 0.8, 0.7]);
            else this.buildings[i].setColor([0.5, 0.8, 0.5]);
            // draw building
            this.buildings[i].draw(this.renderer.uniformLocs, this.renderer.attribLocs, this.camera.viewMatrix);
        }

    }
}
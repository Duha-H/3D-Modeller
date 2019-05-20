import { Cube } from './models/cube.js';
import { Square } from './models/square.js';
import { Camera } from './scene-objects/camera.js';
import { degToRad } from './utils/utils.js';


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
        this.base = new Cube(this.gl);
        this.cubes = this.createCubes();
    }


    /**
     * Creates and sets up scene "camera"
     */
    setupCamera() {
        
        var camera = new Camera();

        camera.setPerspective(degToRad(60),
            this.vWidth/this.vHeight,
            1,
            100
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
     * Creates objects used in this particular scene
     */
    createCubes() {
        //base = new Cube(gl);
        //var cube = new Cube(gl);
        var cubes = [];
        for(var j = 0; j < 16; j++) {
            let newCube = new Cube(this.gl);
            cubes.push(newCube);
        }

        return cubes;
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
        this.base.scale([15, 0.08, 15], modelMatrix);

        mat4.multiply(modelViewMatrix, this.camera.viewMatrix, modelMatrix);
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        this.gl.uniformMatrix4fv(this.renderer.uniformLocs.model, false, modelMatrix);
        this.gl.uniformMatrix4fv(this.renderer.uniformLocs.normal, false, normalMatrix);

        this.base.setColor([1, 1, 1]);
        this.base.draw(this.renderer.attribLocs.position, this.renderer.attribLocs.color, this.renderer.attribLocs.normal);

        // draw blocks
        var currCube = 0;
        for(var i = -1; i < 3; i++) {
            for(var j = -1; j < 3; j++) {
                
                // create model matrix for object
                let modelMatrix = mat4.create(); 
                // apply object transformations
                this.cubes[currCube].translate([i*3, 0, j*3], modelMatrix);
                this.cubes[currCube].scale([1, 1, 1], modelMatrix);
                this.cubes[currCube].setColor([0.5, 0.8, 0.5]);       

                // create normals matrix
                let normalMatrix = mat4.create();
                mat4.multiply(modelViewMatrix, this.camera.viewMatrix, modelMatrix);
                mat4.invert(normalMatrix, modelViewMatrix);
                mat4.transpose(normalMatrix, normalMatrix);

                // specify matrix values for shader program uniforms
                this.gl.uniformMatrix4fv(this.renderer.uniformLocs.model, false, modelMatrix);
                this.gl.uniformMatrix4fv(this.renderer.uniformLocs.normal, false, normalMatrix);

                // draw object
                this.cubes[currCube].draw(this.renderer.attribLocs.position, this.renderer.attribLocs.color, this.renderer.attribLocs.normal);
                currCube++;
            }
        }
    }
}
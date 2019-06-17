import { Cube } from './models/cube.js';
import { Camera } from './scene-objects/camera.js';
import { degToRad } from './utils/utils.js';
import { Grid } from './geometry/grid.js';
import { Building } from './models/building.js';
import { Square } from './geometry/square.js';
import { Scene } from './scene.js';
import { Cylinder } from './models/cylinder.js';

/**
 * Creates and draws 3D Modeller (main canvas)
 */

const {mat4} = glMatrix; // object destructuring to get mat4
var modelViewMatrix = mat4.create();
var normalMatrix = mat4.create();
var modelMatrixX = mat4.create();
var modelMatrixY = mat4.create();
var modelMatrixZ = mat4.create();

var SCALE = [1, 20, 1];

export class Indicator extends Scene {

    constructor(canvas, renderer) {
        super(canvas, renderer);

        this.cube = new Cube(this.gl);
        this.xIndicator = new Cylinder(this.gl, 16);
        this.yIndicator = new Cylinder(this.gl, 16);
        this.zIndicator = new Cylinder(this.gl, 16);
        
    }

    /**
     * Apply transformations and draw scene objects
     */
    draw() {

        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

        // update uniforms
        this.gl.uniformMatrix4fv(this.renderer.uniformLocs.view, false, this.camera.viewMatrix);
        this.gl.uniformMatrix4fv(this.renderer.uniformLocs.projection, false, this.camera.projectionMatrix);
        
        // indicator x
        modelMatrixX = mat4.create();
        this.xIndicator.rotate(degToRad(90), [0, 0, 1], modelMatrixX);
        this.xIndicator.scale(SCALE, modelMatrixX);

        this.updateMatrixUniforms(modelMatrixX);

        this.xIndicator.setColor([1, 0, 0]);
        this.xIndicator.draw(this.renderer.attribLocs);


        // indicator y
        modelMatrixY = mat4.create();
        this.yIndicator.scale(SCALE, modelMatrixY);

        this.updateMatrixUniforms(modelMatrixY);

        this.yIndicator.setColor([1, 1, 0]);
        this.yIndicator.draw(this.renderer.attribLocs);


        // indicator z
        modelMatrixZ = mat4.create();
        this.xIndicator.rotate(degToRad(90), [1, 0, 0], modelMatrixZ);
        this.zIndicator.scale(SCALE, modelMatrixZ);

        this.updateMatrixUniforms(modelMatrixZ);
        
        this.zIndicator.setColor([0, 1, 1]);
        this.zIndicator.draw(this.renderer.attribLocs);


    }

}
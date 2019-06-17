import { Cube } from './models/cube.js';
import { Camera } from './scene-objects/camera.js';
import { degToRad } from './utils/utils.js';
import { Grid } from './geometry/grid.js';
import { Building } from './models/building.js';
import { Square } from './geometry/square.js';


/**
 * Defines/creates the scene to be drawn/rendered
 */

const {mat4} = glMatrix; // object destructuring to get mat4
const FOV = degToRad(60);
const NEAR = 1;
const FAR = 150;
const MODES = {
    DARK: [0.15, 0.15, 0.15],   // DARK
    LIGHT: [0.7, 0.7, 0.7]      // LIGHT
}

var modelViewMatrix = mat4.create();
var normalMatrix = mat4.create();
var modelMatrix = mat4.create();

export class Scene {

    constructor(canvas, renderer) {

        this.gl = canvas.getContext('webgl');
        this.canvas = canvas;
        this.renderer = renderer;
        this.mode = MODES.DARK;

        this.sqX = 0;
        this.sqY = 0;
        this.sqZ = 0;

        // set up camera
        this.vWidth = canvas.clientWidth;   // viewport width
        this.vHeight = canvas.clientHeight; // viewport height
        this.aspectRatio = this.vWidth/this.vHeight;
        this.camera = this.setupCamera();

        this.mv = modelViewMatrix;
    }


    /**
     * Returns a "camera" object viewing the scene
     */
    setupCamera() {
        
        var camera = new Camera();
        camera.setPerspective(FOV, this.vWidth/this.vHeight, NEAR, FAR);
        //camera.setOrthogonal(-30, 30, -30, 30, NEAR, FAR);
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
     * Updates aspect ratio of context viewport
     * @param {Number} aspectRatio New viewport aspect ratio
     */
    updateViewport(aspectRatio) {
        this.camera.setPerspective(FOV, aspectRatio, NEAR, FAR);
        this.draw();
    }

    /**
     * Toggle color theme
     */
    toggleTheme() {
        this.mode = this.mode == MODES.DARK ? MODES.LIGHT : MODES.DARK;
        this.draw();
    }

    /**
     * Updates view, model-view, and projection matrices given updated model matrix
     * and sends updated uniforms to shader program
     * @param {mat4} modeMatrix Modified model matrix
     */
    updateMatrixUniforms(modelMatrix) {
        // perform matrix calculations
        mat4.multiply(modelViewMatrix, this.camera.viewMatrix, modelMatrix);
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        this.mv = modelViewMatrix;

        // send updated uniforms to shader program
        this.gl.uniformMatrix4fv(this.renderer.uniformLocs.model, false, modelMatrix);
        this.gl.uniformMatrix4fv(this.renderer.uniformLocs.normal, false, normalMatrix);
    }

}
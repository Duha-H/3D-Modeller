import '../gl-setup/gl-matrix.js';
import * as utils from '../utils/utils.js';
import { Model } from './model.js';

// Cylinder object definition and functions

const {mat4} = glMatrix; // object destructuring to get mat4
var vertexPositions = [];

export class Cylinder extends Model {

    constructor(gl, slices) {

        vertexPositions = generateVertexPositions(slices);
        super(gl, vertexPositions);
        this.gl = gl;
    }

    /**
     * 
     */
    getBoundingBox() {
        // TODO: implement
    }
}


/**
 * Returns vertex positions of a cylinder's base (circle) with the specified number of slices
 * @param {Number} slices Number of model slices
 */
function generateVertexPositions(slices) {
    let vertexPositions = [];
    let diff = utils.degToRad(360/slices);
    let angle = 0;
    vertexPositions.push([0, 0, 0]);    // center
    for(let i = 0; i < slices; i++) {
        vertexPositions.push([Math.cos(angle), 0, Math.sin(angle)]);
        angle += diff;
    }
    return vertexPositions;
}
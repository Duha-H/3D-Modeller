import '../gl-setup/gl-matrix.js';
import * as utils from '../utils/utils.js';
import { Model } from './model.js';

// Cube object definition and functions

const {mat4} = glMatrix; // object destructuring to get mat4
const vertices = [  // cube transformation origin (0,0,0) is on the bottom face
    // Front
     1,  2,  1,
     1,  0,  1,
    -1,  2,  1,
    -1,  2,  1,
     1,  0,  1,
    -1,  0,  1,
    
    // Left
    -1,  2,  1,
    -1,  0,  1,
    -1,  2, -1,
    -1,  2, -1,
    -1,  0,  1,
    -1,  0, -1,

    // Back
    -1,  2, -1,
    -1,  0, -1,
     1,  2, -1,
     1,  2, -1,
    -1,  0, -1,
     1,  0, -1,

    // Right
     1,  2, -1,
     1,  0, -1,
     1,  2,  1,
     1,  2,  1,
     1,  0,  1,
     1,  0, -1,

    // Top
     1,  2,  1,
     1,  2, -1,
    -1,  2,  1,
    -1,  2,  1,
     1,  2, -1,
    -1,  2, -1,

    // Bottom
     1,  0,  1,
     1,  0, -1,
    -1,  0,  1,
    -1,  0,  1,
     1,  0, -1,
    -1,  0, -1

];

const normals = [
    ...utils.copyArray([ 0,  0,  1], 6),  // FRONT
    ...utils.copyArray([-1,  0,  0], 6),  // LEFT
    ...utils.copyArray([ 0,  0, -1], 6),  // BACK
    ...utils.copyArray([ 1,  0,  0], 6),  // RIGHT
    ...utils.copyArray([ 0,  1,  0], 6),  // TOP
    ...utils.copyArray([ 0, -1,  0], 6),  // BOTTOM
];

export class Cube extends Model {

    constructor(gl) {

        super(gl, vertices, normals);
        this.gl = gl;
        this.vertices = vertices;
        this.normals = normals;
    }

    /**
     * 
     */
    getBoundingBox() {
        // TODO: implement
    }
}
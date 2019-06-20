import '../gl-setup/gl-matrix.js';
import * as utils from '../utils/utils.js';
import { Model } from './model.js';

// Cube object definition and functions

const {mat4} = glMatrix; // object destructuring to get mat4
const vertices1 = [  // cube transformation origin (0,0,0) is on the bottom face
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

const vertexPos = [
    // bottom polygon
    [  1, 0,  1],   // 0
    [  1, 0, -1],   // 1
    [ -1, 0, -1],   // 2
    [ -1, 0,  1],   // 3

    // top polygon
    [  1, 2,  1],   // 4
    [  1, 2, -1],   // 5
    [ -1, 2, -1],   // 6
    [ -1, 2,  1],   // 7
]

const vertices = [
    // FRONT
    ...vertexPos[4],
    ...vertexPos[0],
    ...vertexPos[7],
    ...vertexPos[7],
    ...vertexPos[0],
    ...vertexPos[3],
    // LEFT
    ...vertexPos[7],
    ...vertexPos[3],
    ...vertexPos[6],
    ...vertexPos[6],
    ...vertexPos[3],
    ...vertexPos[2],
    // BACK
    ...vertexPos[6],
    ...vertexPos[2],
    ...vertexPos[5],
    ...vertexPos[5],
    ...vertexPos[2],
    ...vertexPos[1],
    // RIGHT
    ...vertexPos[5],
    ...vertexPos[1],
    ...vertexPos[4],
    ...vertexPos[4],
    ...vertexPos[1],
    ...vertexPos[0],
    // TOP
    ...vertexPos[4],
    ...vertexPos[5],
    ...vertexPos[7],
    ...vertexPos[7],
    ...vertexPos[5],
    ...vertexPos[6],
    // BOTTOM
    ...vertexPos[0],
    ...vertexPos[1],
    ...vertexPos[3],
    ...vertexPos[3],
    ...vertexPos[1],
    ...vertexPos[2]

]

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
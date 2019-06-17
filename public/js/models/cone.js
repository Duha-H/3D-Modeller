import '../gl-setup/gl-matrix.js';
import * as utils from '../utils/utils.js';
import { Model } from './model.js';

// Cylinder object definition and functions

const {mat4} = glMatrix; // object destructuring to get mat4
var vertices = [];
var normals = [];

export class Cone extends Model {

    constructor(gl, slices) {

        vertices = generateVertices(slices);
        normals = generateNormals(slices);
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

function generateVertices(slices) {
    vertices = [];
    var diff = utils.degToRad(360/slices);
    var angle = 0;
    for(let i = 0; i < slices; i++) {
        // BOTTOM TRIANGLE
        vertices.push(...[0, 0, 0]); // center
        vertices.push(...[
            Math.cos(angle), 0, Math.sin(angle)
        ]);
        vertices.push(...[
            Math.cos(angle + diff), 0, Math.sin(angle + diff)
        ]);

        // SIDE TRIANGLE
        vertices.push(...[0, 1, 0]); // center
        vertices.push(...[
            Math.cos(angle), 0, Math.sin(angle)
        ]);
        vertices.push(...[
            Math.cos(angle + diff), 0, Math.sin(angle + diff)
        ]);

        angle += diff;
    }
    return vertices;
}

function generateNormals(slices) {
    normals = [];
    var diff = utils.degToRad(360/slices);
    var angle = diff/2;
    for(let i = 0; i < slices; i++) {
        // BOTTOM
        normals.push(...utils.copyArray([0, -1, 0], 3));
        // SIDE
        normals.push(...utils.copyArray(
            [Math.cos(angle), 0, Math.sin(angle)], 3
        ));

        angle += diff;
    }
    return normals;
}
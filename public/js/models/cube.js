import '../gl-setup/gl-matrix.js';
import * as utils from '../utils/utils.js';
import { Model } from './model.js';

// Cube object definition and functions

const {mat4} = glMatrix; // object destructuring to get mat4
const vertexPositions = [ // vertex positions of base polygon
    // bottom polygon
    [ -1, 0, -1],   // 2
    [  1, 0, -1],   // 1
    [  1, 0,  1],   // 0
    [ -1, 0,  1]    // 3
]


export class Cube extends Model {

    constructor(gl) {

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
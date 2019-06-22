import '../gl-setup/gl-matrix.js';
import * as utils from '../utils/utils.js';
import { Model } from './model.js';

// Cube object definition and functions

const {mat4} = glMatrix; // object destructuring to get mat4
const M_13 = 1.5;       // 1 + 1/3
const M_23 = 1.867;     // 1 + 2/3
const SQRT5 = 2.23607;  // sqrt(5)
const vertexPositions = [
    // bottom polygon
    [     0,  0,     0],   // 0
    [    -1,  0,    -2],   // 1
    [     0,  0,    -2],   // 2
    [     1,  0,    -2],   // 3
    [  M_13,  0, -M_23],   // 4
    [  M_23,  0, -M_13],   // 5
    [     2,  0,    -1],   // 6
    [     2,  0,     0],   // 7
    [     2,  0,     1],   // 8
    [  M_23,  0,  M_13],   // 9
    [  M_13,  0,  M_23],   // 10
    [     1,  0,     2],   // 11
    [     0,  0,     2],   // 12
    [    -1,  0,     2],   // 13
    [ -M_13,  0,  M_23],   // 14
    [ -M_23,  0,  M_13],   // 15
    [    -2,  0,     1],   // 16    
    [    -2,  0,     0],   // 17
    [    -2,  0,    -1],   // 18
    [ -M_23,  0, -M_13],   // 19
    [ -M_13,  0, -M_23]   // 20
];


export class RoundedBlock extends Model {

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

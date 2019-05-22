import '../gl-setup/gl-matrix.js';
import * as utils from '../utils/utils.js';

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
    [ -M_13,  0, -M_23],   // 20
    // top polygon
    [     0,  1,     0],   // 21
    [    -1,  1,    -2],   // 22
    [     0,  1,    -2],   // 23
    [     1,  1,    -2],   // 24
    [  M_13,  1, -M_23],   // 25
    [  M_23,  1, -M_13],   // 26
    [     2,  1,    -1],   // 27
    [     2,  1,     0],   // 28
    [     2,  1,     1],   // 29
    [  M_23,  1,  M_13],   // 30
    [  M_13,  1,  M_23],   // 31
    [     1,  1,     2],   // 32
    [     0,  1,     2],   // 33
    [    -1,  1,     2],   // 34
    [ -M_13,  1,  M_23],   // 35
    [ -M_23,  1,  M_13],   // 36
    [    -2,  1,     1],   // 37  
    [    -2,  1,     0],   // 38
    [    -2,  1,    -1],   // 39
    [ -M_23,  1, -M_13],   // 40
    [ -M_13,  1, -M_23]    // 41
];

const vertices = [  // block transformation origin (0,0,0) is on the bottom face
    // BOTTOM FACE TRIANGLES
    ...vertexPositions[0],
    ...vertexPositions[1],
    ...vertexPositions[2],

    ...vertexPositions[0],
    ...vertexPositions[2],
    ...vertexPositions[3],

    ...vertexPositions[0],
    ...vertexPositions[3],
    ...vertexPositions[4],

    ...vertexPositions[0],
    ...vertexPositions[4],
    ...vertexPositions[5],

    ...vertexPositions[0],
    ...vertexPositions[5],
    ...vertexPositions[6],

    ...vertexPositions[0],
    ...vertexPositions[6],
    ...vertexPositions[7],

    ...vertexPositions[0],
    ...vertexPositions[7],
    ...vertexPositions[8],

    ...vertexPositions[0],
    ...vertexPositions[8],
    ...vertexPositions[9],

    ...vertexPositions[0],
    ...vertexPositions[9],
    ...vertexPositions[10],
    
    ...vertexPositions[0],
    ...vertexPositions[10],
    ...vertexPositions[11],

    ...vertexPositions[0],
    ...vertexPositions[11],
    ...vertexPositions[12],

    ...vertexPositions[0],
    ...vertexPositions[12],
    ...vertexPositions[13],

    ...vertexPositions[0],
    ...vertexPositions[13],
    ...vertexPositions[14],

    ...vertexPositions[0],
    ...vertexPositions[14],
    ...vertexPositions[15],

    ...vertexPositions[0],
    ...vertexPositions[15],
    ...vertexPositions[16],

    ...vertexPositions[0],
    ...vertexPositions[16],
    ...vertexPositions[17],

    ...vertexPositions[0],
    ...vertexPositions[17],
    ...vertexPositions[18],

    ...vertexPositions[0],
    ...vertexPositions[18],
    ...vertexPositions[19],

    ...vertexPositions[0],
    ...vertexPositions[19],
    ...vertexPositions[20],

    ...vertexPositions[0],
    ...vertexPositions[20],
    ...vertexPositions[1],

    // TOP FACE TRIANGLES
    ...vertexPositions[21],
    ...vertexPositions[22],
    ...vertexPositions[23],

    ...vertexPositions[21],
    ...vertexPositions[23],
    ...vertexPositions[24],

    ...vertexPositions[21],
    ...vertexPositions[24],
    ...vertexPositions[25],

    ...vertexPositions[21],
    ...vertexPositions[25],
    ...vertexPositions[26],

    ...vertexPositions[21],
    ...vertexPositions[26],
    ...vertexPositions[27],

    ...vertexPositions[21],
    ...vertexPositions[27],
    ...vertexPositions[28],

    ...vertexPositions[21],
    ...vertexPositions[28],
    ...vertexPositions[29],

    ...vertexPositions[21],
    ...vertexPositions[29],
    ...vertexPositions[30],

    ...vertexPositions[21],
    ...vertexPositions[30],
    ...vertexPositions[31],
    
    ...vertexPositions[21],
    ...vertexPositions[31],
    ...vertexPositions[32],

    ...vertexPositions[21],
    ...vertexPositions[32],
    ...vertexPositions[33],

    ...vertexPositions[21],
    ...vertexPositions[33],
    ...vertexPositions[34],

    ...vertexPositions[21],
    ...vertexPositions[34],
    ...vertexPositions[35],

    ...vertexPositions[21],
    ...vertexPositions[35],
    ...vertexPositions[36],

    ...vertexPositions[21],
    ...vertexPositions[36],
    ...vertexPositions[37],

    ...vertexPositions[21],
    ...vertexPositions[37],
    ...vertexPositions[38],

    ...vertexPositions[21],
    ...vertexPositions[38],
    ...vertexPositions[39],

    ...vertexPositions[21],
    ...vertexPositions[39],
    ...vertexPositions[40],

    ...vertexPositions[21],
    ...vertexPositions[40],
    ...vertexPositions[41],

    ...vertexPositions[21],
    ...vertexPositions[41],
    ...vertexPositions[22],
    // QUADS
    ...vertexPositions[23], // 1
    ...vertexPositions[2],
    ...vertexPositions[1],
    ...vertexPositions[23],
    ...vertexPositions[22],
    ...vertexPositions[1],

    ...vertexPositions[24], // 2
    ...vertexPositions[3],
    ...vertexPositions[2],
    ...vertexPositions[24],
    ...vertexPositions[23],
    ...vertexPositions[2],

    ...vertexPositions[25], // 3
    ...vertexPositions[4],
    ...vertexPositions[3],
    ...vertexPositions[25],
    ...vertexPositions[24],
    ...vertexPositions[3],

    ...vertexPositions[26], // 4
    ...vertexPositions[5],
    ...vertexPositions[4],
    ...vertexPositions[26],
    ...vertexPositions[25],
    ...vertexPositions[4],

    ...vertexPositions[27], // 5
    ...vertexPositions[6],
    ...vertexPositions[5],
    ...vertexPositions[27],
    ...vertexPositions[26],
    ...vertexPositions[5],

    ...vertexPositions[28], // 6
    ...vertexPositions[7],
    ...vertexPositions[6],
    ...vertexPositions[28],
    ...vertexPositions[27],
    ...vertexPositions[6],

    ...vertexPositions[29], // 7
    ...vertexPositions[8],
    ...vertexPositions[7],
    ...vertexPositions[29],
    ...vertexPositions[28],
    ...vertexPositions[7],

    ...vertexPositions[30], // 8
    ...vertexPositions[9],
    ...vertexPositions[8],
    ...vertexPositions[30],
    ...vertexPositions[29],
    ...vertexPositions[8],

    ...vertexPositions[31], // 9
    ...vertexPositions[10],
    ...vertexPositions[9],
    ...vertexPositions[31],
    ...vertexPositions[30],
    ...vertexPositions[9],

    ...vertexPositions[32], // 10
    ...vertexPositions[11],
    ...vertexPositions[10],
    ...vertexPositions[32],
    ...vertexPositions[31],
    ...vertexPositions[10],

    ...vertexPositions[33], // 11
    ...vertexPositions[12],
    ...vertexPositions[11],
    ...vertexPositions[33],
    ...vertexPositions[32],
    ...vertexPositions[11],

    ...vertexPositions[34], // 12
    ...vertexPositions[13],
    ...vertexPositions[12],
    ...vertexPositions[34],
    ...vertexPositions[33],
    ...vertexPositions[12],

    ...vertexPositions[35], // 13
    ...vertexPositions[14],
    ...vertexPositions[13],
    ...vertexPositions[35],
    ...vertexPositions[34],
    ...vertexPositions[13],

    ...vertexPositions[36], // 14
    ...vertexPositions[15],
    ...vertexPositions[14],
    ...vertexPositions[36],
    ...vertexPositions[35],
    ...vertexPositions[14],
    
    ...vertexPositions[37], // 15
    ...vertexPositions[16],
    ...vertexPositions[15],
    ...vertexPositions[37],
    ...vertexPositions[36],
    ...vertexPositions[15],

    ...vertexPositions[38], // 16
    ...vertexPositions[17],
    ...vertexPositions[16],
    ...vertexPositions[38],
    ...vertexPositions[37],
    ...vertexPositions[16],

    ...vertexPositions[39], // 17
    ...vertexPositions[18],
    ...vertexPositions[17],
    ...vertexPositions[39],
    ...vertexPositions[38],
    ...vertexPositions[17],
    
    ...vertexPositions[40], // 18
    ...vertexPositions[19],
    ...vertexPositions[18],
    ...vertexPositions[40],
    ...vertexPositions[39],
    ...vertexPositions[18],

    ...vertexPositions[41], // 19
    ...vertexPositions[20],
    ...vertexPositions[19],
    ...vertexPositions[41],
    ...vertexPositions[40],
    ...vertexPositions[19],

    ...vertexPositions[22], // 20
    ...vertexPositions[1],
    ...vertexPositions[20],
    ...vertexPositions[22],
    ...vertexPositions[41],
    ...vertexPositions[20]

];

const normals = [
    ...utils.copyArray([       0, -1,        0], 20*3),  // BOTTOM
    ...utils.copyArray([       0,  1,        0], 20*3),  // TOP
    ...utils.copyArray([       0,  0,       -1],  6),  // 1
    ...utils.copyArray([       0,  0,       -1],  6),  // 2
    ...utils.copyArray([ 1/SQRT5,  0, -2/SQRT5],  6),  // 3
    ...utils.copyArray([       1,  0,       -1],  6),  // 4
    ...utils.copyArray([ 2/SQRT5,  0, -1/SQRT5],  6),  // 5
    ...utils.copyArray([       1,  0,        0],  6),  // 6
    ...utils.copyArray([       1,  0,        0],  6),  // 7
    ...utils.copyArray([ 2/SQRT5,  0,  1/SQRT5],  6),  // 8
    ...utils.copyArray([       1,  0,        1],  6),  // 9
    ...utils.copyArray([ 1/SQRT5,  0,  2/SQRT5],  6),  // 10
    ...utils.copyArray([       0,  0,        1],  6),  // 11
    ...utils.copyArray([       0,  0,        1],  6),  // 12
    ...utils.copyArray([-1/SQRT5,  0,  2/SQRT5],  6),  // 13
    ...utils.copyArray([      -1,  0,        1],  6),  // 14
    ...utils.copyArray([-2/SQRT5,  0,  1/SQRT5],  6),  // 15
    ...utils.copyArray([      -1,  0,        0],  6),  // 16
    ...utils.copyArray([      -1,  0,        0],  6),  // 17
    ...utils.copyArray([-2/SQRT5,  0, -1/SQRT5],  6),  // 18
    ...utils.copyArray([      -1,  0,       -1],  6),  // 19
    ...utils.copyArray([-1/SQRT5,  0, -2/SQRT5],  6)   // 20

];

export class RoundedBlock {

    constructor(gl) {

        this.gl = gl;
        this.height = 1;
        // assign cube vetices
        this.vertices = vertices;
        // assign vertex normals
        this.normals = normals;
        
        // generate random face colors
        this.color = [];
        let faceColor = [0.5, 0.8, 0.5];
        for (let vertex = 0; vertex < this.vertices.length/3; vertex++) {
            this.color.push(...faceColor);
        }

        // create and bind vertex and color buffers
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color), gl.STATIC_DRAW);
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    
    }

    /**
     * Activates the given vertex attribute arrays, and draws bound vertices
     * @param {*} attribLocations Renderer attribute locations
     */
    draw(attribLocations) {
        var gl = this.gl;
        const posLocation = attribLocations.position;
        const colorLocation = attribLocations.color;
        const normalLocation = attribLocations.normal;

        gl.enableVertexAttribArray(posLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(colorLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(normalLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }

    /**
     * Applies a translation transformation to the cube's model matrix
     * @param {array} transformation Array containing the new [x, y, z] position
     * @param {mat4} modelMatrix Model matrix to apply transformations to
     */
    translate(transformation, modelMatrix) {
        mat4.translate(modelMatrix, modelMatrix, transformation);
    }

    /**
     * Applies a scaling transformation to the cube's model matrix
     * @param {array} transformation Array containing the new [x, y, z] scales
     * @param {mat4} modelMatrix Model matrix to apply transformations to
     */
    scale(transformation, modelMatrix) {
        mat4.scale(modelMatrix, modelMatrix, transformation);
    }

    /**
     * Applies a rotation transformation to the cube's model matrix
     * @param {Number} angle Angle of rotation in radians
     * @param {array} axis Array defining the axis of rotation
     * @param {mat4} modelMatrix Model matrix to apply transformations to
     */
    rotate(angle, axis, modelMatrix) {
        mat4.rotate(modelMatrix, modelMatrix, angle, axis);
    }

    /**
     * Sets a new color attribute to cube vertices
     * @param {array} color Defines the new color attribute
     */
    setColor(color) {
        var gl = this.gl;
        var newColor = [];
        let faceColor = color;
        for (let vertex = 0; vertex < this.vertices.length/3; vertex++) {
            newColor.push(...faceColor);
        }
        this.color = newColor;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color), gl.STATIC_DRAW);
    }

    /**
     * Adjust default block height
     * @param {Number} h New block height
     */
    setHeight(newHeight) {
        this.height = newHeight;
        for(let i = 1; i < this.vertices.length; i+=3) {
            this.vertices[i] = this.vertices[i] > 0 ? newHeight : this.vertices[i];
        }
        // update vertex buffer data
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
    }

    /**
     * 
     */
    getBoundingBox() {

    }
}

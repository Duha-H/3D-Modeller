import '../gl-setup/gl-matrix.js';
import * as utils from '../utils/utils.js';

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

export class Cube {

    constructor(gl) {

        this.gl = gl;
        this.height = 1;
        // assign cube vetices
        this.vertices = vertices;
        // assign vertex normals
        this.normals = normals;
        
        // generate random face colors
        this.color = [];
        let faceColor = utils.randomColor();
        for (let face = 0; face < 6; face++) {
            for (let vertex = 0; vertex < 6; vertex++) {
                this.color.push(...faceColor);
            }
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
        for (let face = 0; face < 6; face++) {
            let faceColor = color;
            for (let vertex = 0; vertex < 6; vertex++) {
                newColor.push(...faceColor);
            }
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







//export { Cube };
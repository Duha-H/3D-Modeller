import '../gl-setup/gl-matrix.js';
import * as utils from '../utils/utils.js';

// Cube object definition and functions
const {mat4} = glMatrix; // object destructuring to get mat4
const vertices = [
    // Front
     1,  1,  1,
     1, -1,  1,
    -1,  1,  1,
    -1,  1,  1,
     1, -1,  1,
    -1, -1,  1,
    
    // Left
    -1,  1,  1,
    -1, -1,  1,
    -1,  1, -1,
    -1,  1, -1,
    -1, -1,  1,
    -1, -1, -1,

    // Back
    -1,  1, -1,
    -1, -1, -1,
     1,  1, -1,
     1,  1, -1,
    -1, -1, -1,
     1, -1, -1,

    // Right
     1,  1, -1,
     1, -1, -1,
     1,  1,  1,
     1,  1,  1,
     1, -1,  1,
     1, -1, -1,

    // Top
     1,  1,  1,
     1,  1, -1,
    -1,  1,  1,
    -1,  1,  1,
     1,  1, -1,
    -1,  1, -1,

    // Bottom
     1, -1,  1,
     1, -1, -1,
    -1, -1,  1,
    -1, -1,  1,
     1, -1, -1,
    -1, -1, -1

];

const normals = [
    ...utils.copyArray([ 0,  0,  1], 6),  // FRONT
    ...utils.copyArray([-1,  0,  0], 6),  // LEFT
    ...utils.copyArray([ 0,  0, -1], 6),  // BACK
    ...utils.copyArray([ 1,  0,  0], 6),  // RIGHT
    ...utils.copyArray([ 0,  1,  0], 6),  // TOP
    ...utils.copyArray([ 0, -1,  0], 6),  // BOTTOM
];

export function Cube(gl) {

    // assign cube vetices
    this.vertices = vertices;
    // assign vertex normals
    this.normals = normals;
    
    // generate random face colors
    this.color = [];
    for(let face = 0; face < 6; face++) {
        let faceColor = utils.randomColor();
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


    this.draw = function(posLocation, colorLocation, normalLocation) {

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

    this.translate = function(transformation, modelMatrix) {
        mat4.translate(modelMatrix, modelMatrix, transformation);
    }

    this.scale = function(transformation, modelMatrix) {
        mat4.scale(modelMatrix, modelMatrix, transformation);
    }

    this.setColor = function(color) {

        var newColor = [];
        for(let face = 0; face < 6; face++) {
            let faceColor = color;
            for (let vertex = 0; vertex < 6; vertex++) {
                newColor.push(...faceColor);
            }
        }
        this.color = newColor;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color), gl.STATIC_DRAW);

    }

    this.getBoundingBox = function() {
        
    }
}


//export { Cube };
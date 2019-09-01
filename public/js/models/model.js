import '../gl-setup/gl-matrix.js';
import * as utils from '../utils/utils.js';
import * as ModelGenerator from '../model-management/modelGenerator.js';
import { ModelController } from '../model-management/modelController.js';

/**
 * Definition of generic 3D Model object
 * Receives object vertices and normals, and handles all drawing and transformations
 */

const {mat4} = glMatrix; // object destructuring to get mat4

export class Model {

    constructor(gl, vertexPositions) {

        this.gl = gl;
        this.height = 10;

        this.vertexPositions = vertexPositions;
        this.controller = new ModelController(vertexPositions, this.height);
        this.vertices = this.controller.modelVertices;
        //this.vertices = ModelGenerator.convertToMesh(this.vertexPositions, this.height, 2);
        this.normals = this.controller.modelNormals;
        
        // generate face colors
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
        //gl.drawArrays(gl.LINES, 0, this.vertices.length / 3);
    }

    /**
     * Applies a translation transformation to the 3d model's model matrix
     * @param {array} transformation Array containing the new [x, y, z] position
     * @param {mat4} modelMatrix Model matrix to apply transformations to
     */
    translate(transformation, modelMatrix) {
        mat4.translate(modelMatrix, modelMatrix, transformation);
    }

    /**
     * Applies a scaling transformation to the 3d model's model matrix
     * @param {array} transformation Array containing the new [x, y, z] scales
     * @param {mat4} modelMatrix Model matrix to apply transformations to
     */
    scale(transformation, modelMatrix) {
        mat4.scale(modelMatrix, modelMatrix, transformation);
    }

    /**
     * Applies a rotation transformation to the 3d model's model matrix
     * @param {Number} angle Angle of rotation in radians
     * @param {array} axis Array defining the axis of rotation
     * @param {mat4} modelMatrix Model matrix to apply transformations to
     */
    rotate(angle, axis, modelMatrix) {
        mat4.rotate(modelMatrix, modelMatrix, angle, axis);
    }

    /**
     * Sets a new color attribute to model vertices
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
     * Adjust default model height
     * @param {Number} newHeight New model height
     */
    setHeight(newHeight) {
        // THIS IS BROKEN
        this.height = newHeight;
        this.controller.updateHeight(this.height);
        // update vertex buffer data
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
    }

    convertToMesh(controlPoints) {
        this.controller.updateMeshSections(controlPoints);
        //console.log(this.vertices.length, 'vertices');
        this.vertices = this.controller.modelVertices;
        this.normals = this.controller.modelNormals;
        // update vertex buffer data
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW);
    }

    resetMesh() {
        this.controller.resetMeshSections();
        this.vertices = this.controller.modelVertices;
        this.normals = this.controller.modelNormals;
        // update vertex buffer data
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW);
    }

}

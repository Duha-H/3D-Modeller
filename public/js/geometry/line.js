import '../gl-setup/gl-matrix.js';
import * as utils from '../utils/utils.js';

/**
 * Line definition and functions
 */

const {mat4} = glMatrix; // object destructuring to get mat4
const vertices = [
     0,  0,  1,     // START
     0,  0, -1      // END
];

const normals = [
    ...utils.copyArray([ 0,  1,  0], 2)  // FRONT
];

export class Line {

    constructor(gl) {

        this.gl = gl;
        // assign start and end vertices
        this.vertices = vertices;
        // assign normal (probably not necessary?)
        this.normals = normals;

        this.color = [0, 0.1, 0.8,
                      0, 0.1, 0.8];

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
     * @param {*} attribLocations renderer attribute locations
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

        gl.drawArrays(gl.LINES, 0, this.vertices.length / 3);
    }

    /**
     * Applies a translation transformation to the line's model matrix
     * @param {array} transformation Array containing the new [x, y, z] position
     * @param {mat4} modelMatrix Model matrix to apply transformations to
     */
    translate(transformation, modelMatrix) {
        mat4.translate(modelMatrix, modelMatrix, transformation);
    }

    /**
     * Applies a scaling transformation to the line's model matrix
     * @param {array} transformation Array containing the new [x, y, z] scales
     * @param {mat4} modelMatrix Model matrix to apply transformations to
     */
    scale(transformation, modelMatrix) {
        mat4.scale(modelMatrix, modelMatrix, transformation);
    }

    /**
     * Applies a rotation transformation to the line's model matrix
     * @param {Number} angle Angle of rotation in radians
     * @param {array} axis Array defining the axis of rotation
     * @param {mat4} modelMatrix Model matrix to apply transformations to
     */
    rotate(angle, axis, modelMatrix) {
        mat4.rotate(modelMatrix, modelMatrix, angle, axis);
    }

    /**
     * Sets a new color attribute to line vertices
     * @param {array} color Defines the new color attribute
     */
    setColor(color) {
        var gl = this.gl;
        var newColor = [];
        let faceColor = color;
        for (let vertex = 0; vertex < 2; vertex++) {
            newColor.push(...faceColor);
        }
        this.color = newColor;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color), gl.STATIC_DRAW);
    }
}
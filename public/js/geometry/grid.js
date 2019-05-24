import '../gl-setup/gl-matrix.js';
import { Line } from './line.js';
import { degToRad } from '../utils/utils.js';

/**
 * Defines and creates a square grid area
 */


const {mat4} = glMatrix; // object destructuring to get mat4


export class Grid {

    constructor(gl, width, length, spacing) {
        
        this.gl = gl;
        // assign grid dimensions
        this.width = width;
        this.length = length;
        this.spacing = spacing;

        // create lines
        this.hLines = [];
        this.hLinesNum = length / spacing;
        this.vLines = [];
        this.vLinesNum = width / spacing;
        this.createLines();

    }

    /**
     * Creates grid lines
     */
    createLines() {

        // create horizontal lines
        let horizontalLine = new Line(this.gl);
        for(let i = 0; i < this.hLinesNum; i++) {
            this.hLines.push(horizontalLine);
        }

        // create vertical lines
        let verticalLine = new Line(this.gl);
        for(let i = 0; i < this.vLinesNum; i++) {
            this.vLines.push(verticalLine);
        }
    }

    /**
     * Draws grid lines
     * @param {*} uniformLocations Renderer uniform locations
     * @param {*} attribLocations Renderer attribute locations
     */
    draw(uniformLocations, attribLocations) {

        this.drawLines(this.hLines, this.hLinesNum, this.width/2, uniformLocations.model, attribLocations, false);

        this.drawLines(this.vLines, this.vLinesNum, this.length/2, uniformLocations.model, attribLocations, true);
    }

    /**
     * Draws a list of grid lines given their attributes (horizontal/vertical)
     * @param {array} lines List of lines to draw
     * @param {Number} linesNum Number of lines to draw
     * @param {Length} length Length of each line
     * @param {*} modelLocation Location of renderer's model matrix
     * @param {*} attribLocations Location of renderer attributes
     * @param {Boolean} rotate Rotation of lines
     */
    drawLines(lines, linesNum, length, modelLocation, attribLocations, rotate) {
        
        // set direction
        var rotation = rotate ? 90 : 0;
        
        var currSpacing = this.spacing;
        const hStart = - linesNum / 2;
        const hEnd = linesNum / 2;

        var curr = 0;
        for(let i = hStart; i < hEnd; i++) {
            //console.log(this.vLines[curr]);
            currSpacing = this.spacing * i;
            let modelMatrix = mat4.create();

            lines[curr].rotate(degToRad(rotation), [0, 1, 0], modelMatrix);
            lines[curr].translate([currSpacing, -1, 0], modelMatrix);
            lines[curr].scale([0, 0, length], modelMatrix);

            this.gl.uniformMatrix4fv(modelLocation, false, modelMatrix);
            lines[curr].draw(attribLocations);

            curr++;
        }
    }

}
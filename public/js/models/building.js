import '../gl-setup/gl-matrix.js';
import { Cube } from './cube.js';


/**
 * Defines and creates a building object
 */


const {mat4} = glMatrix; // object destructuring to get mat4


export class Building {

    constructor(gl) {

        this.gl = gl;
        // building dimensions and attributes
        this.height = 1; // number of floors
        this.scaleX = 1;
        this.scaleZ = 1;
        this.posX = 0;
        this.posZ = 0;
        this.color = [0.5, 0.8, 0.5];

    }

    /**
     * Set number of building floors
     * @param {Number} height Number of floors
     */
    setHeight(height) {

        this.height = height <= 0 ? 1 : height;
    }

    /**
     * Set horizontal scale of building (base)
     * @param {Number} scaleX Scale in x direction
     * @param {Number} scaleZ Scale in z direction
     */
    setScale(scaleX, scaleZ) {
        
        this.scaleX = scaleX;
        this.scaleZ = scaleZ;
    }

    /**
     * Set building color
     * @param {array} color RGB color array
     */
    setColor(color) {

        this.color = color;
    }

    /**
     * Draw building
     * @param {Object} uniformLocations Renderer uniform locations
     * @param {Object} attribLocations Renderer attribute locations
     * @param {mat4} viewMatrix Scene camera view matrix
     */
    draw(uniformLocations, attribLocations, viewMatrix) {

        let x;
        let floor = new Cube(this.gl);
        let modelMatrix = mat4.create();

        // apply building scale and color (common attributes)
        mat4.scale(modelMatrix, modelMatrix, [this.scaleX, 1, this.scaleZ]);
        mat4.translate(modelMatrix, modelMatrix, [this.posX, -0.5, this.posZ]);
        floor.setColor(this.color);
        
        for(let i = 0; i < this.height; i++) {
            
            x = i == 0 ? 0 : 1;
            floor.translate([0, 1*x, 0], modelMatrix);

            let normalMatrix = mat4.create();
            let modelViewMatrix = mat4.create();
            mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
            mat4.invert(normalMatrix, modelViewMatrix);
            mat4.transpose(normalMatrix, normalMatrix);

            // specify matrix values for shader program uniforms
            this.gl.uniformMatrix4fv(uniformLocations.model, false, modelMatrix);
            this.gl.uniformMatrix4fv(uniformLocations.normal, false, normalMatrix);

            floor.draw(attribLocations);

        }
    }
}
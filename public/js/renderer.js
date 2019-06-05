import { ShaderProgram } from './gl-setup/shaderProgram.js';

/**
 * WebGL scene/program renderer
 */


/**
 * Sets up a rendering context for a given scene
 * Creates and binds a shader program for rendering
 * @param {HTMLCanvasElement} canvas 
 */
export function Renderer(canvas) {

    // get rendering context
    const gl = canvas.getContext('webgl');

    if (!gl) {
        throw new Error('You do not have support for WebGL');
    }
    this.gl = gl;

    this.program = null;
    this.programTypes = {};
    this.currProgramType = '';

    this.attribLocs = {};
    this.uniformLocs = {};

    /**
     * Creates and stores a new shader program
     */
    this.newShaderProgram = (vertexShaderCode, fragmentShaderCode, type) => {
        
        let shaderProgram = ShaderProgram(this.gl, vertexShaderCode, fragmentShaderCode);
        this.program = shaderProgram;
        this.programTypes[type] = shaderProgram;
    }

    /**
     * Activates shader program of specified type (link, use, and set uniform locations)
     */
    this.setActiveProgram = (type) => {
        // check if program type is available
        if (!this.programTypes.hasOwnProperty(type)) {
            console.log('Error: Renderer does not contain a shader program of type: ', type);
            return;
        }

        this.program = this.programTypes[type];
        this.currProgramType = type;

        //this.gl.linkProgram(this.program); // tie everything together
        this.gl.useProgram(this.program);  // create executable program on graphics card and use it to draw

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.SCISSOR_TEST);

        // set uniform and attrib locations
        this.attribLocs = {
            position:   this.gl.getAttribLocation(this.program, "position"),
            color:      this.gl.getAttribLocation(this.program, "color"),
            normal:     this.gl.getAttribLocation(this.program, "normal")
        };
    
        this.uniformLocs = {
            model:      this.gl.getUniformLocation(this.program, "modelMtx"),
            view:       this.gl.getUniformLocation(this.program, "viewMtx"),
            projection: this.gl.getUniformLocation(this.program, "projectionMtx"),
            normal:     this.gl.getUniformLocation(this.program, "normalMtx")
        };
        // since the same vertex shader code is being used, attribute and uniform location definitions (names) are fixed

    }

}


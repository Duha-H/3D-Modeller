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
    this.programs = []; // maintain a list of shader programs to use

    // set up default shader program
    this.program = ShaderProgram(gl);
    this.programs.push(this.program);

    gl.linkProgram(this.program); // tie everything together
    gl.useProgram(this.program);  // create executable program on graphics card and use it to draw

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.SCISSOR_TEST);

    // define shader program attribute/uniform locations
    this.attribLocs = {
        position:   gl.getAttribLocation(this.program, "position"),
        color:      gl.getAttribLocation(this.program, "color"),
        normal:     gl.getAttribLocation(this.program, "normal")
    };

    this.uniformLocs = {
        model:      gl.getUniformLocation(this.program, "modelMtx"),
        view:       gl.getUniformLocation(this.program, "viewMtx"),
        projection: gl.getUniformLocation(this.program, "projectionMtx"),
        normal:     gl.getUniformLocation(this.program, "normalMtx")
    };


}

/**
 * Creates and links a new shader program
 */
Renderer.prototype.newShaderProgram = (vertexShaderCode, fragmentShaderCode) => {
    console.log("TESTING RENDERER");
    // TODO: implement
}

Renderer.prototype.soup = () => {
    return 42;
}

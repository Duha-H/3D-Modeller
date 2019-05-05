/**
 * Creates Shader Program for gl context
 */

var vertexShader;
var fragmentShader;
var program;
var gl;

/**
 * Creates and returns a shader program
 * @param {WebGLRenderingContext} renderingContext 
 */
export function ShaderProgram(renderingContext) {

    gl = renderingContext;
    
    // create shaders
    createShaders();
    
    // create program
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    return program;
}

/**
 * Defines fragment and vertex shader programs from shader code
 */
function createShaders() {
    
    // create shaders
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let vertexShaderCode = document.getElementById("vertex-shader").firstChild.nodeValue;
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    let fragmentShaderCode = document.getElementById("fragment-shader").firstChild.nodeValue;
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

}
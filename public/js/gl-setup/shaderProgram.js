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
export function ShaderProgram(renderingContext, vertexShaderCode, fragmentShaderCode) {

    gl = renderingContext;
    
    // create shaders
    vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderCode);
    fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderCode);
    
    // create program
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    return program;
}

/**
 * Returns a compiled shader program from given source code
 * @param {GLenum} type shader program type, gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @param {DOMString} shaderCode source code of shader program
 */
function createShader(type, shaderCode) {

    // create shader
    let shader;
    const shaderType = type === gl.VERTEX_SHADER ? "vertex" : "shader";
    shader = gl.createShader(type);
    gl.shaderSource(shader, shaderCode);
    gl.compileShader(shader);

    // check for syntax/compilation errors
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var info = gl.getShaderInfoLog(shader);
        throw 'Could not compile ' + shaderType + ' shader program: \n\n' + info;
    }

    return shader;
}
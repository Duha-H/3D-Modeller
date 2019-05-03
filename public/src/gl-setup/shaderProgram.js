/**
 * Creates Shader Program for gl context
 */

var vertexShader;
var fragmentShader;
var program;
var gl;

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

    /*
    // create program
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    */
}

//export { ShaderProgram };
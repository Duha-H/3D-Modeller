const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
var test = 3;

if (!gl) {
    throw new Error('You do not have support for WebGL');
}

// create shaders
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
let vertexShaderCode = document.getElementById("vertex-shader").firstChild.nodeValue;
gl.shaderSource(vertexShader, vertexShaderCode);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
let fragmentShaderCode = document.getElementById("fragment-shader").firstChild.nodeValue;
gl.shaderSource(fragmentShader, fragmentShaderCode);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program); // tie everything together
gl.useProgram(program); // creates executable program on graphics card and use it to draw

// define which attributes to enable 
const posLocation = gl.getAttribLocation(program, "position");

const colorLocation = gl.getAttribLocation(program, "color");

gl.enable(gl.DEPTH_TEST);
gl.enable(gl.SCISSOR_TEST);

const uniformLocations = {
    model: gl.getUniformLocation(program, "modelMtx"),
    view: gl.getUniformLocation(program, "viewMtx"),
    projection: gl.getUniformLocation(program, "projectionMtx")
};

const {mat4} = glMatrix; // object destructuring to get mat4
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, 
    90 * Math.PI / 180, 
    1, 
    0.0001,
    10000
);

const modelViewMatrix = mat4.create();
const finalMatrix = mat4.create();

var theta = 0;
var phi = 0;
var diff = 1;

var drag = false;
var oldX, oldY;
var dx = 0, dy = 0;

// camera position parameters
var camDistance = 15;
var cameraX = 4, cameraY = 5, cameraZ = 7;
var refX = 0, refY = 0, refZ = 0;
var upX = 0, upY = 1, upZ = 0; 

var base = new Cube(gl);
var cube = new Cube(gl);

function render() {
    // update cam position
    cameraY = camDistance * Math.sin(phi * Math.PI / 180);
    cameraX = camDistance * Math.cos(phi * Math.PI / 180) * Math.cos(theta * Math.PI / 180);
    cameraZ = camDistance * Math.cos(phi * Math.PI / 180) * Math.sin(theta * Math.PI / 180);

    mat4.lookAt(viewMatrix, [cameraX, cameraY, cameraZ], [refX, refY, refZ], [upX, upY, upZ]);    
    
    // update uniforms
    gl.uniformMatrix4fv(uniformLocations.view, false, viewMatrix);
    gl.uniformMatrix4fv(uniformLocations.projection, false, projectionMatrix);
    
    // draw
    base.applyTransformations(uniformLocations.model, [0, -1, 0], [15, 0.08, 15]);   
    base.setColor([1, 0, 0], colorLocation);
    base.draw(posLocation, colorLocation);
    for(var i = -1; i < 3; i++) {
        for(var j = -1; j < 3; j++) {
            cube.applyTransformations(uniformLocations.model, [i*3, 0, j*3], [1, 1, 1]);
            cube.draw(posLocation, colorLocation);
        }
    }
}

render();

// mouse events
function mouseDown(e) {
    drag = true;
    oldX = e.pageX, oldY = e.pageY;
    e.preventDefault();
    return false;
}

function mouseUp(e) {
    drag = false;
}

function mouseMove(e) {
    if (!drag) return false;

    dx = (e.pageX - oldX);
    dy = (e.pageY - oldY);
    theta += dx * diff;
    phi += dy * diff;
    oldX = e.pageX;
    oldY = e.pageY;
    e.preventDefault();
    render();
}

function keyboardHandler(e) {
    var keyCode = e.keyCode;
    if (keyCode == 38) // Up Arrow
        camDistance -= 0.5; // zoom in
    if (keyCode == 40) // Down Arrow
        camDistance += 0.5; // zoom out
    e.preventDefault();
    render();
}


canvas.addEventListener("mousedown", mouseDown, false);
canvas.addEventListener("mouseup", mouseUp, false);
canvas.addEventListener("mousemove", mouseMove, false);
canvas.addEventListener("mouseout", mouseUp, false);
window.addEventListener("keydown", keyboardHandler, false);
// set up gl context
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('You do not have support for WebGL');
}

// VARIABLE DEFINITIONS

// shader program
let program;
let vertexShader;
let fragmentShader;

// shader program attributes, define which attributes to enable 
let posLocation;
let colorLocation;
let normalLocation;
let uniformLocations;

// context matrices
const {mat4} = glMatrix; // object destructuring to get mat4
let viewMatrix;
let modelViewMatrix;
let finalMatrix;
let projectionMatrix;
let normalMatrix;

// camera position parameters
var drag = false;
var oldX, oldY;
var dx = 0, dy = 0;

var camDistance = 15;
var cameraX = 4, cameraY = 5, cameraZ = 7;
var refX = 0, refY = 0, refZ = 0;
var upX = 0, upY = 1, upZ = 0;
var theta = 45; // horizontal angle
var phi = 25;   // vertical angle
var diff = 1;

// scene objects
let base;
let cube;
let cubes;


function createShaderProgram() {
    // create shaders
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let vertexShaderCode = document.getElementById("vertex-shader").firstChild.nodeValue;
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    let fragmentShaderCode = document.getElementById("fragment-shader").firstChild.nodeValue;
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    // create program
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
}

function run() {
    // run GL set up code and render
    createShaderProgram();

    gl.linkProgram(program); // tie everything together
    gl.useProgram(program);  // creates executable program on graphics card and use it to draw

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.SCISSOR_TEST);

    // define shader program attributes and their locations
    posLocation = gl.getAttribLocation(program, "position");
    colorLocation = gl.getAttribLocation(program, "color");
    normalLocation = gl.getAttribLocation(program, "normal");

    uniformLocations = {
        model: gl.getUniformLocation(program, "modelMtx"),
        view: gl.getUniformLocation(program, "viewMtx"),
        projection: gl.getUniformLocation(program, "projectionMtx"),
        normal: gl.getUniformLocation(program, "normalMtx")
    };

    setupContextMatrices();

    createCubes();

    // render scene
    render();
}

function setupContextMatrices() {
    // define transformation and projection matrices
    viewMatrix = mat4.create();
    modelViewMatrix = mat4.create();
    finalMatrix = mat4.create();
    projectionMatrix = mat4.create();
    normalMatrix = mat4.create();

    // set up perspective
    mat4.perspective(projectionMatrix, 
        90 * Math.PI / 180, 
        1, 
        0.0001,
        10000
    );
}

function createCubes() {
    base = new Cube(gl);
    cube = new Cube(gl);
    cubes = [];
    for(var j = 0; j < 16; j++) {
        let newCube = new Cube(gl);
        cubes.push(newCube);
    }
}

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
    const modelMatrix = base.applyTransformations(uniformLocations.model, [0, -1, 0], [15, 0.08, 15]);   
    gl.uniformMatrix4fv(uniformLocations.model, false, modelMatrix);
    const modelViewMtx = mat4.create();
    mat4.multiply(modelViewMtx, viewMatrix, modelMatrix);
    mat4.invert(normalMatrix, modelViewMtx);
    mat4.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix4fv(uniformLocations.normal, false, modelMatrix);
    base.setColor([1, 1, 1]);
    base.draw(posLocation, colorLocation, normalLocation);
    var currCube = 0;
    for(var i = -1; i < 3; i++) {
        for(var j = -1; j < 3; j++) {
            
            const modelMatrix = cubes[currCube].applyTransformations(uniformLocations.model, [i*3, 0, j*3], [1, 1, 1]);
            const normalMatrix = mat4.create();
            gl.uniformMatrix4fv(uniformLocations.model, false, modelMatrix);
            mat4.multiply(modelViewMtx, viewMatrix, modelMatrix);
            mat4.invert(normalMatrix, modelViewMtx);
            mat4.transpose(normalMatrix, normalMatrix);
            gl.uniformMatrix4fv(uniformLocations.normal, false, normalMatrix);
            cubes[currCube].setColor([0, 1, 1]);       
            cubes[currCube].draw(posLocation, colorLocation, normalLocation);
            currCube++;
        }
    }
}

// event handlers
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

// create scene
run();
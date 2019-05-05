import { Cube } from './js/models/cube.js';
import { ShaderProgram } from './js/gl-setup/shaderProgram.js';
import { degToRad } from './js/utils/utils.js';
import { Camera } from './js/scene-objects/camera.js';

// set up gl context
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('You do not have support for WebGL');
}

// VARIABLE DEFINITIONS

// shader program
var program;

// shader program attributes, define which attributes to enable 
var attribLocations;
var uniformLocations;

// context matrices
const {mat4} = glMatrix; // object destructuring to get mat4
var viewMatrix = mat4.create();
var modelViewMatrix = mat4.create();
var finalMatrix = mat4.create();
var projectionMatrix = mat4.create();
var normalMatrix = mat4.create();

// camera position parameters
var camera;
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
var base;
var cube;
var cubes;

function main() {
    // run GL set up code and render
    program = ShaderProgram(gl);

    gl.linkProgram(program); // tie everything together
    gl.useProgram(program);  // create executable program on graphics card and use it to draw

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.SCISSOR_TEST);

    attribLocations = {
        position: gl.getAttribLocation(program, "position"),
        color: gl.getAttribLocation(program, "color"),
        normal: gl.getAttribLocation(program, "normal")
    };

    uniformLocations = {
        model: gl.getUniformLocation(program, "modelMtx"),
        view: gl.getUniformLocation(program, "viewMtx"),
        projection: gl.getUniformLocation(program, "projectionMtx"),
        normal: gl.getUniformLocation(program, "normalMtx")
    };

    setupCamera();

    createCubes();

    // create scene
    drawScene();
}


function setupCamera() {
    // define camera position, reference, and up vector
    // prepare projection matrix
    camera = new Camera([cameraX, cameraY, cameraZ],
        [refX, refY, refZ],
        [upX, upY, upZ],
        true);

    camera.setPerspective(projectionMatrix, degToRad(90),
        1,
        0.0001,
        10000
    );
}

function createCubes() {
    // creates block objects used in scene
    base = new Cube(gl);
    cube = new Cube(gl);
    cubes = [];
    for(var j = 0; j < 16; j++) {
        let newCube = new Cube(gl);
        cubes.push(newCube);
    }
}

function drawScene() {
    // update cam position
    cameraY = camDistance * Math.sin(degToRad(phi));
    cameraX = camDistance * Math.cos(degToRad(phi)) * Math.cos(degToRad(theta));
    cameraZ = camDistance * Math.cos(degToRad(phi)) * Math.sin(degToRad(theta));

    camera.updatePosition(viewMatrix, [cameraX, cameraY, cameraZ]);

    // update uniforms
    gl.uniformMatrix4fv(uniformLocations.view, false, viewMatrix);
    gl.uniformMatrix4fv(uniformLocations.projection, false, projectionMatrix);
    
    // draw base
    let modelMatrix = mat4.create();
    base.translate([0, -1, 0], modelMatrix);
    base.scale([15, 0.08, 15], modelMatrix);

    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    gl.uniformMatrix4fv(uniformLocations.model, false, modelMatrix);
    gl.uniformMatrix4fv(uniformLocations.normal, false, normalMatrix);

    base.setColor([1, 0.5, 0.5]);
    base.draw(attribLocations.position, attribLocations.color, attribLocations.normal);

    // draw blocks
    var currCube = 0;
    for(var i = -1; i < 3; i++) {
        for(var j = -1; j < 3; j++) {
            
            // create model matrix for object
            let modelMatrix = mat4.create(); 
            // apply object transformations
            cubes[currCube].translate([i*3, 0, j*3], modelMatrix);
            cubes[currCube].scale([1, 1, 1], modelMatrix);
            cubes[currCube].setColor([0, 1, 1]);       

            // create normals matrix
            let normalMatrix = mat4.create();
            mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
            mat4.invert(normalMatrix, modelViewMatrix);
            mat4.transpose(normalMatrix, normalMatrix);

            // specify matrix values for shader program uniforms
            gl.uniformMatrix4fv(uniformLocations.model, false, modelMatrix);
            gl.uniformMatrix4fv(uniformLocations.normal, false, normalMatrix);

            // draw object
            cubes[currCube].draw(attribLocations.position, attribLocations.color, attribLocations.normal);
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
    drawScene();
}

function keyboardHandler(e) {
    var keyCode = e.keyCode;
    if (keyCode == 38) // Up Arrow
        camDistance -= 0.5; // zoom in
    if (keyCode == 40) // Down Arrow
        camDistance += 0.5; // zoom out
    e.preventDefault();
    drawScene();
}


canvas.addEventListener("mousedown", mouseDown, false);
canvas.addEventListener("mouseup", mouseUp, false);
canvas.addEventListener("mousemove", mouseMove, false);
canvas.addEventListener("mouseout", mouseUp, false);
window.addEventListener("keydown", keyboardHandler, false);

// create scene
main();
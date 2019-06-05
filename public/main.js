import { Renderer } from './js/renderer.js';
import { Scene } from './js/scene.js';
import { EventHandler } from './js/eventHandler.js';


const canvas = document.querySelector('canvas');
var renderer;
var scene;
var eventHandler;



function main() {
    // create renderer and shader programs
    renderer = new Renderer(canvas);
    // DISPLAY shader program code
    let vertexShaderCode = document.getElementById("vertex-shader").firstChild.nodeValue;
    let fragmentShaderCode = document.getElementById("fragment-shader").firstChild.nodeValue;
    renderer.newShaderProgram(vertexShaderCode, fragmentShaderCode, 'DISPLAY');
    // SELECT shader program code
    vertexShaderCode = document.getElementById("vertex-shader").firstChild.nodeValue;
    fragmentShaderCode = document.getElementById("selection-shader").firstChild.nodeValue;
    renderer.newShaderProgram(vertexShaderCode, fragmentShaderCode, 'SELECT');
    
    // activate DISPLAY program
    renderer.setActiveProgram('DISPLAY');
    
    // create scene and bind render
    scene = new Scene(canvas, renderer);
    // create scene event handler
    eventHandler = new EventHandler(scene);

    scene.draw();

}

main();
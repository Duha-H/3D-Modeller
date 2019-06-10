import { Renderer } from './js/renderer.js';
import { Scene } from './js/scene.js';
import { EventHandler } from './js/event-handlers/sceneListeners.js';
import { PageEventHandler } from './js/event-handlers/pageListeners.js';


const canvas = document.querySelector('canvas');
var renderer;
var scene;
var sceneEventHandler;
var docEventHandler;



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
    
    // create scene and bind renderer
    scene = new Scene(canvas, renderer);
    // set up event handlers
    sceneEventHandler = new EventHandler(scene);
    docEventHandler = new PageEventHandler(scene);

    // draw scene
    scene.draw();

}

main();
import { Renderer } from './js/renderer.js';
import { Scene } from './js/scene.js';
import { EventHandler } from './js/eventHandler.js';


const canvas = document.querySelector('canvas');
var renderer;
var scene;
var eventHandler;



function main() {
    // run GL set up code
    renderer = new Renderer(canvas);
    
    // create scene and render
    scene = new Scene(canvas, renderer);
    eventHandler = new EventHandler(scene);

    scene.draw();

}

main();
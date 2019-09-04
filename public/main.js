import { Renderer } from './js/renderer.js';
import { EventHandler } from './js/event-handlers/sceneListeners.js';
import { PageEventHandler } from './js/event-handlers/pageListeners.js';
import { Modeller } from './js/modeller.js';
import { Indicator } from './js/coordinateIndicator.js';
import { ProfileCustomizer } from './js/model-management/profileCustomizer.js';
import { CustomizationHandler } from './js/event-handlers/customizationListeners.js';


const canvas = document.getElementById('main-canvas');
//const navigatorCanvas = document.getElementById('navigator-canvas');
const profileCanvas = document.getElementById('profile-canvas');
var renderer;
var otherRenderer;
var scene;
var navigator;
var profileCustomizer;
var sceneEventHandler;
var docEventHandler;
var customizationHandler;



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
    scene = new Modeller(renderer);
    profileCustomizer = new ProfileCustomizer(profileCanvas);
    //scene.linkProfileCustomizer(profileCustomizer); // I don't like this very much (2-way link)
    profileCustomizer.linkScene(scene);
    
    // set up event handlers
    sceneEventHandler = new EventHandler(scene);
    customizationHandler = new CustomizationHandler(profileCustomizer);
    docEventHandler = new PageEventHandler(scene, profileCustomizer);

    // draw scene
    scene.draw();

}

main();
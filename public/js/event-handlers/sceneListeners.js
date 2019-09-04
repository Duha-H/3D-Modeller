import * as utils from '../utils/utils.js';
import * as feedback from '../utils/feedback.js';
import '../gl-setup/gl-matrix.js';

/**
 * Event handling module for scene-related events (limisted to canvas)
 */

var canvas;
var linkedScene;
// camera position parameters
const MAX_CAM_DIST = 100;
const MIN_CAM_DIST = 0.5;
const MOUSE_DRAG_RATE = 0.0016;
var drag = false;
var oldX, oldY;
var dx = 0, dy = 0;
var camDistance;
var navigator;
var hAngle; // horizontal angle
var vAngle;   // vertical angle
var diff;
var zoomSlider;
var sliderValue;
// scene control modes
var mouseCtrldModes = { // mouse-controlled modeller modes
    translate:  86,
    scale:      83,
    extrude:    69,
    orbit:      79,
    pan:        80  
};
var keyboardCtrldModes = {  // keyboard-controlled modeller modes
    zoom:       90
};
var activeMouseMode = mouseCtrldModes.orbit;
var activeKeyboardMode = keyboardCtrldModes.zoom;
var gridState = {
    code: 71,
    active: true
}

/**
 * Sets up window and canvas event listeners and applies events to target scene
 * @param {Scene} scene Target to which event handling is applied
 */
export function EventHandler(scene, indicator) {
    canvas = scene.canvas;
    linkedScene = scene;
    if(indicator)   // check that indicator isn't null
        navigator = indicator;

    // set initial scene attributes
    camDistance = linkedScene.camera.distance;
    hAngle = linkedScene.camera.hAngle;
    vAngle = linkedScene.camera.vAngle;
    diff = linkedScene.camera.rate;

    // set up event listeners
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("mouseout", mouseUp, false);
    //canvas.addEventListener("click", onClick2, false);
    window.addEventListener("keydown", (e) => {
        keyboardHandler(e.keyCode)
    }, false);
    window.addEventListener("resize", resizeViewport, false);
    
    handleControlButtons(); // assign event listeners and set active/inactive UI elements

    zoomSlider = document.getElementById('zoom-slider');
    sliderValue = zoomSlider.value;
    zoomSlider.addEventListener("input", () => {
        var newVal = zoomSlider.value;
        camDistance -= (sliderValue - newVal);
        linkedScene.updateCamera(vAngle, hAngle, camDistance);
        sliderValue = newVal;
    }, false);
}


/**
 * Handles mouse down event
 * @param {Event} e mouse down event
 */
function mouseDown(e) {
    drag = true;
    oldX = e.pageX, oldY = e.pageY;
    e.preventDefault();
    return false;
}

/**
 * Handles mouse up event
 * @param {Event} e mouse up evenet
 */
function mouseUp(e) {
    drag = false;
}

/**
 * Handles mouse motion, updating scene attributes accordingly
 * @param {Event} e mouse move event
 */
function mouseMove(e) {
    if (!drag) return false;

    dx = (e.pageX - oldX);
    dy = (e.pageY - oldY);
    oldX = e.pageX;
    oldY = e.pageY;

    if (activeMouseMode === mouseCtrldModes.orbit) { // check if camera orbit mode is activated
        hAngle += dx * diff;
        vAngle = utils.clamp(vAngle + diff * dy, 1, 89); // maintain angle between 1 and 89 degrees
        // update scene
        linkedScene.updateCamera(vAngle, hAngle, camDistance);
        if(navigator)   // update navigator view if not null
            navigator.updateCamera(vAngle, hAngle, 30);
    }
    else if (activeMouseMode === mouseCtrldModes.pan) {
        // update scene
        linkedScene.camera.panCamera(dx * 0.1, dy * 0.1);
        linkedScene.draw();
    }
    else if (activeMouseMode === mouseCtrldModes.extrude) {
        // update scene
        linkedScene.buildings[linkedScene.currBldg].scaleY -= (dy * MOUSE_DRAG_RATE * camDistance);
        linkedScene.draw();
    }
    else if (activeMouseMode === mouseCtrldModes.translate) {
        let v = Math.sqrt( (dx ** 2) + (dy ** 2) );
        let theta = v != 0 ? Math.asin(dx / v) : 1;
        let flagx = ((dx < 0 && dy > 0) || (dx > 0 && dy < 0)) ? -1 : 1;
        let flagz = dy < 0 ? -1 : 1;
        linkedScene.buildings[linkedScene.currBldg].posX += MOUSE_DRAG_RATE * camDistance * v * (Math.sin(theta + utils.degToRad(90 - hAngle)) ) * flagx;
        linkedScene.buildings[linkedScene.currBldg].posZ += MOUSE_DRAG_RATE * camDistance * v * (Math.cos(theta + utils.degToRad(90 - hAngle)) ) * flagz;
        linkedScene.updateBase();
        linkedScene.draw();
    }
    else if (activeMouseMode === mouseCtrldModes.scale) {
        let mag = Math.sqrt( (dx ** 2) + (dy ** 2) );
        let theta = mag != 0 ? Math.asin(dx / mag) : 1;
        linkedScene.buildings[linkedScene.currBldg].scaleX += MOUSE_DRAG_RATE * camDistance * mag * (Math.sin(theta + utils.degToRad(90 - hAngle)) );
        linkedScene.buildings[linkedScene.currBldg].scaleZ += MOUSE_DRAG_RATE * camDistance * mag * (Math.cos(theta + utils.degToRad(90 - hAngle)) );
        linkedScene.draw();
    }
    else {
        return false;
    }
    
}

/**
 * Hanldes all keyboard events
 * @param {Event} e keyboard event
 */
function keyboardHandler(keyCode) {

    switch (keyCode) {
        // TODO: REMOVE ARROW CONTROLS
        case 37:    // Left Arrow
            // TEMP
            if (activeMouseMode === mouseCtrldModes.translate) { // translate mode
                linkedScene.buildings[linkedScene.currBldg].posX--;
                linkedScene.updateBase();
                linkedScene.draw();
            }
            if (activeMouseMode === mouseCtrldModes.scale && linkedScene.buildings[linkedScene.currBldg].scaleX > 0.5) {    // scale mode
                linkedScene.buildings[linkedScene.currBldg].scaleX -= 0.5;
                linkedScene.draw();
            }
            break;

        case 38:    // Up Arrow
            // TEMP
            if (activeMouseMode === mouseCtrldModes.extrude) {  // extrude mode
                linkedScene.buildings[linkedScene.currBldg].scaleY++;
                linkedScene.draw();
            }
            if (activeMouseMode === mouseCtrldModes.translate) { // translate mode
                linkedScene.buildings[linkedScene.currBldg].posZ--;
                linkedScene.updateBase();
                linkedScene.draw();
            }
            if (activeMouseMode === mouseCtrldModes.scale) {    // scale mode
                linkedScene.buildings[linkedScene.currBldg].scaleZ += 0.5;
                linkedScene.draw();
            }
            break;
        
        case 39:    // Right Arrow
            if (activeMouseMode === mouseCtrldModes.translate) { // translate mode
                linkedScene.buildings[linkedScene.currBldg].posX++;
                linkedScene.updateBase();
                linkedScene.draw();
            }
            if (activeMouseMode === mouseCtrldModes.scale) {    // scale mode
                linkedScene.buildings[linkedScene.currBldg].scaleX += 0.5;
                linkedScene.draw();
            }
            break;

        case 40:    // Down Arrow
            if (activeMouseMode === mouseCtrldModes.extrude && linkedScene.buildings[linkedScene.currBldg].scaleY > 1) {  // extrude mode
                linkedScene.buildings[linkedScene.currBldg].scaleY--;
                linkedScene.draw();
            }
            if (activeMouseMode === mouseCtrldModes.translate) { // translate mode
                linkedScene.buildings[linkedScene.currBldg].posZ++;
                linkedScene.updateBase();
                linkedScene.draw();
            }
            if (activeMouseMode === mouseCtrldModes.scale && linkedScene.buildings[linkedScene.currBldg].scaleZ > 0.5) { // scale mode
                linkedScene.buildings[linkedScene.currBldg].scaleZ -= 0.5;
                linkedScene.draw();
            }
            break;

        case 61:    // '+'
            if (activeKeyboardMode === keyboardCtrldModes.zoom && camDistance > MIN_CAM_DIST) {
                camDistance -= 0.5; // zoom in
                zoomSlider.value -= 0.5;
                linkedScene.updateCamera(vAngle, hAngle, camDistance);
            }
            break;

        case 173:   // '-' 
            if (activeKeyboardMode === keyboardCtrldModes.zoom && camDistance < MAX_CAM_DIST) {
                camDistance += 0.5; // zoom out
                zoomSlider.value += 0.5;
                linkedScene.updateCamera(vAngle, hAngle, camDistance);
            }            
            break;

        case 67:    // 'c'
            if ( confirm('Are you sure you would like to clear all buildings?') ) {
                linkedScene.buildings = []; // clear buildings
                linkedScene.currBldg = -1;
                linkedScene.draw();
            }
            break;
        
        case 69:    // 'e'
            setInactive(activeMouseMode); // deactivate currently-active mode in UI
            setActive(mouseCtrldModes.extrude);
            activeMouseMode = mouseCtrldModes.extrude;
            feedback.showSnackbar("Extrude Mode");
            break;

        case 70:    // 'f'
            linkedScene.buildings[linkedScene.currBldg].setType();
            linkedScene.draw();
            break;

        case 71:    // 'g'
            linkedScene.toggleGrid();   // show/hide scene grid
            toggleActive(gridState.code);
            break;

        case 78:    // 'n'
            linkedScene.addNewBuilding();
            linkedScene.draw();
            break;
        
        case 79:    // 'o'
            setInactive(activeMouseMode); // deactivate currently-active mode in UI
            setActive(mouseCtrldModes.orbit);
            activeMouseMode = mouseCtrldModes.orbit;
            feedback.showSnackbar("Orbit Mode");
            break;
        
        case 80:    // 'p'
            setInactive(activeMouseMode); // deactivate currently-active mode in UI
            setActive(mouseCtrldModes.pan);
            activeMouseMode = mouseCtrldModes.pan;
            feedback.showSnackbar("Pan Mode");
            break;

        case 83:    // 's'
            setInactive(activeMouseMode); // deactivate currently-active mode in UI
            setActive(mouseCtrldModes.scale);
            activeMouseMode = mouseCtrldModes.scale;
            feedback.showSnackbar("Scale Mode");
            break;

        case 86:    // 'v'
            setInactive(activeMouseMode); // deactivate currently-active mode in UI
            setActive(mouseCtrldModes.translate);
            activeMouseMode = mouseCtrldModes.translate;
            feedback.showSnackbar("Translate Mode");
            break;
        
        case 90:    // 'z'
            setInactive(activeKeyboardMode); // deactivate currently-active mode in UI
            setActive(keyboardCtrldModes.zoom);
            activeKeyboardMode = keyboardCtrldModes.zoom;
            feedback.showSnackbar("Zoom Mode");
            break;
        
        default:
            break;
    }
}


/**
 * Handles resizing canvas on window resize event
 */
function resizeViewport() {
    linkedScene.vWidth = canvas.clientWidth;
    linkedScene.vHeight = canvas.clientHeight;
    var ratio = linkedScene.vWidth / linkedScene.vHeight;
    linkedScene.updateViewport(ratio);
}


/**
 * Adds event listeners to all control panel buttons
 * Set active button styles
 */
function handleControlButtons() {
    // get control buttons
    const ctrlButtons = document.querySelectorAll('.ctrl-key');
    // bind event listeners
    ctrlButtons.forEach( (element) => {
        let id = element.id.substring(5);
        let code = parseInt(id);
        element.addEventListener('click', () => {
            keyboardHandler(code);
        }, false);
    });
    // set styles of active buttons
    setActive(activeMouseMode);
    setActive(activeKeyboardMode);

    // set grid style
    if (gridState.active) {
        let id = gridState.code;
        document.getElementById('ctrl-' + id).className += ' active';
    }
}

/**
 * Sets a button class to 'active'
 * @param {Number} id ID number of button to activate
 */
function setActive(id) {
    let button = document.getElementById(`ctrl-${id}`);
    button.className += ' active';
}

/**
 * Sets button classes to inactive
 * @param {array} modes List of control modes to deactivate
 */
function setInactive(id) {
    let button = document.getElementById(`ctrl-${id}`);
    button.className = 'ctrl-key';
}

/**
 * Toggles the activity class of a button
 * @param {Number} id ID number of button to toggle 
 */
function toggleActive(id) {
    var button = document.getElementById(`ctrl-${id}`);
    if (button.className.includes('active'))
        button.className = 'ctrl-key';
    else
        button.className += ' active';
}
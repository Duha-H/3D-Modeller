import * as utils from '../utils/utils.js';
import '../gl-setup/gl-matrix.js';

/**
 * Event handling module for scene-related events (limisted to canvas)
 */

var canvas;
const {mat4} = glMatrix;
const {vec3} = glMatrix;
// camera position parameters
const MAX_CAM_DIST = 100;
const MIN_CAM_DIST = 0.5;
var drag = false;
var oldX, oldY;
var dx = 0, dy = 0;
var linkedScene;
var camDistance;
var hAngle; // horizontal angle
var vAngle;   // vertical angle
var diff;
// scene control modes
const modes = {
    scale: [83, false],
    translate: [86, false],
    extrude: [69, false],
    zoom: [90, true],
    pan: [80, false],
    orbit: [79, true],
    grid: [71, true]
};

/**
 * Sets up window and canvas event listeners and applies events to target scene
 * @param {Scene} scene Target to which event handling is applied
 */
export function EventHandler(scene) {
    canvas = scene.canvas;
    linkedScene = scene;

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
    window.addEventListener("keydown", (e) => {keyboardHandler(e.keyCode)}, false);
    window.addEventListener("resize", resizeViewport, false);
    document.querySelector('input').addEventListener('change', toggleTheme, false);
    
    handleControlButtons();
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

    if (modes.orbit[1]) { // check if camera orbit mode is activated
        dx = (e.pageX - oldX);
        dy = (e.pageY - oldY);
        hAngle += dx * diff;
        vAngle = utils.clamp(vAngle + diff * dy, 1, 89); // maintain angle between 1 and 89 degrees
        oldX = e.pageX;
        oldY = e.pageY;
        // update scene
        linkedScene.updateCamera(vAngle, hAngle, camDistance);
    }
    if (modes.pan[1]) {
        dx = (e.pageX - oldX);
        dy = (e.pageY - oldY);
        oldX = e.pageX;
        oldY = e.pageY;
        // update scene
        linkedScene.camera.panCamera(dx * 0.1, dy * 0.1);
        linkedScene.draw();
    }
    
}

/**
 * Hanldes all keyboard events
 * @param {Event} e keyboard event
 */
function keyboardHandler(keyCode) {

    switch (keyCode) {
        case 37:    // Left Arrow
            if (modes.translate[1]) { // translate mode
                linkedScene.buildings[linkedScene.currBldg].posX--;
                linkedScene.draw();
            }
            if (modes.scale[1] && linkedScene.buildings[linkedScene.currBldg].scaleX > 0.5) {    // scale mode
                linkedScene.buildings[linkedScene.currBldg].scaleX-=0.5;
                linkedScene.draw();
            }
            break;

        case 38:    // Up Arrow
            if (modes.zoom[1] && camDistance > MIN_CAM_DIST) {     // zoom mode
                camDistance -= 0.5; // zoom in
                linkedScene.updateCamera(vAngle, hAngle, camDistance);
            }
            if (modes.extrude[1]) {  // extrude mode
                linkedScene.buildings[linkedScene.currBldg].height++;
                linkedScene.draw();
            }
            if (modes.translate[1]) { // translate mode
                linkedScene.buildings[linkedScene.currBldg].posZ--;
                linkedScene.draw();
            }
            if (modes.scale[1]) {    // scale mode
                linkedScene.buildings[linkedScene.currBldg].scaleZ += 0.5;
                linkedScene.draw();
            }
            break;
        
        case 39:    // Right Arrow
            if (modes.translate[1]) { // translate mode
                linkedScene.buildings[linkedScene.currBldg].posX++;
                linkedScene.draw();
            }
            if (modes.scale[1]) {    // scale mode
                linkedScene.buildings[linkedScene.currBldg].scaleX += 0.5;
                linkedScene.draw();
            }
            break;

        case 40:    // Down Arrow
            if (modes.zoom[1] && camDistance <= MAX_CAM_DIST) {     // zoom mode
                camDistance += 0.5; // zoom out
                linkedScene.updateCamera(vAngle, hAngle, camDistance);
            }
            if (modes.extrude[1] && linkedScene.buildings[linkedScene.currBldg].height > 1) {  // extrude mode
                linkedScene.buildings[linkedScene.currBldg].height--;
                linkedScene.draw();
            }
            if (modes.translate[1]) { // translate mode
                linkedScene.buildings[linkedScene.currBldg].posZ++;
                linkedScene.draw();
            }
            if (modes.scale[1] && linkedScene.buildings[linkedScene.currBldg].scaleZ > 0.5) { // scale mode
                linkedScene.buildings[linkedScene.currBldg].scaleZ -= 0.5;
                linkedScene.draw();
            }
            break;

        case 67:    // 'c'
            if(confirm('Are you sure you would like to clear all buildings?')) {
                linkedScene.buildings = []; // clear buildings
                linkedScene.currBldg = -1;
                linkedScene.draw();
            }
            break;
        
        case 69:    // 'e'
            modes.extrude[1] = true;
            modes.zoom[1] = modes.translate[1] = modes.scale[1] = false;
            showSnackbar("Extrude Mode");
            setInactive([modes.zoom[0], modes.translate[0], modes.scale[0]]);
            setActive(69);
            break;

        case 70:    // 'f'
            linkedScene.buildings[linkedScene.currBldg].setType();
            linkedScene.draw();
            break;

        case 71:    // 'g'
            linkedScene.toggleGrid();   // show/hide scene grid
            toggleActive(71);
            break;

        case 78:    // 'n'
            linkedScene.addNewBuilding();
            linkedScene.draw();
            break;
        
        case 79:    // 'o'
            modes.orbit[1] = !modes.orbit[1]; // toggle camera orbitting on/off
            if (modes.orbit[1]) toggleOrbitPan('Orbit');
            else showSnackbar('Orbit Mode off');
            break;
        
        case 80:    // 'p'
            modes.pan[1] = !modes.pan[1]; // toggle camera pan on/off
            if (modes.pan[1]) toggleOrbitPan('Pan');
            else showSnackbar('Pan Mode off');
            break;

        case 83:    // 's'
            modes.scale[1] = true;
            modes.zoom[1] = modes.extrude[1] = modes.translate[1] = false;
            showSnackbar('Scale Mode');
            setInactive([modes.zoom[0], modes.translate[0], modes.extrude[0]]);
            setActive(83);
            break;

        case 86:    // 'v'
            modes.translate[1] = true;
            modes.zoom[1] = modes.extrude[1] = modes.scale[1] = false;
            showSnackbar('Translate Mode');
            setInactive([modes.zoom[0], modes.extrude[0], modes.scale[0]]);
            setActive(86);
            break;
        
        case 90:    // 'z'
            modes.zoom[1] = true;
            modes.extrude[1] = modes.translate[1] = modes.scale[1] = false;
            showSnackbar('Zoom Mode');
            setInactive([modes.extrude[0], modes.translate[0], modes.scale[0]]);
            setActive(90);
            break;

        default:
            break;
    }
}

/**
 * Displays a temporary snackbar message
 * @param {String} message snackbar message
 */
function showSnackbar(message) {
    snackbar = document.getElementById("snackbar");
    snackbar.innerText = message;
    snackbar.className = "show";

    // remove snackbar after 3 seconds
    setTimeout(() => { snackbar.className = "" }, 3000);
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
 * Adjusts graphical components based on orbit/pan mode state (modes are mutually exclusive)
 * @param {String} activeMode Name of active mode 'Orbit'/'Pan'
 */
function toggleOrbitPan(activeMode) {
    if (activeMode === 'Orbit') {
        toggleActive(79); // activate orbit graphical icon
        setInactive([80]);
        modes.pan[1] = false;
    }
    else {
        toggleActive(80);  // activate pan graphical icon
        setInactive([79]);
        modes.orbit[1] = false;
    }
    showSnackbar(`${activeMode} Mode on`);
}

/**
 * Toggle color theme of the page
 */
function toggleTheme() {
    // adjust styling theme
    var container = document.querySelector('body');
    var newTheme = container.className.includes('dark') ? 'light' : 'dark';
    container.className = `container ${newTheme}`;
    //adjust canvas theme
    linkedScene.toggleTheme();
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
    var sceneModes = Object.values(modes);
    sceneModes.forEach((state) => {
        if (state[1]) {
            setActive(state[0]);
        }
    })
}

/**
 * Sets a button class to 'active'
 * @param {Number} id ID number of button to activate
 */
function setActive(id) {
    document.getElementById('ctrl-' + id).className += ' active';
}

/**
 * Sets button classes to inactive
 * @param {array} idList List of IDs of buttons to deactivate
 */
function setInactive(idList) {
    idList.forEach((id) => {
        var button = document.getElementById(`ctrl-${id}`);
        button.className = 'ctrl-key';
    })
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
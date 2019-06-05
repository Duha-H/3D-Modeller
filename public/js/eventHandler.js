import * as utils from './utils/utils.js';
import './gl-setup/gl-matrix.js';

/**
 * Event handling module for canvas-related events
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
        
        case 69:    // 'e'
            modes.extrude[1] = true;
            modes.zoom[1] = modes.translate[1] = modes.scale[1] = false;
            showSnackbar("Extrude Mode");
            setInactive([modes.zoom[0], modes.translate[0], modes.scale[0]]);
            setActive(69);
            break;

        case 70:    // 'f'
            linkedScene.buildings[linkedScene.currBldg].changeType();
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

/**
 * Handles a mouse click event
 * @param {Event} e on click event
 */
/* TODO: fix implementation for object mouse selection
function onClick(e) {
    // convert screen coordinates to world coordinates
    if (modes.orbit[1]) return;
    // canvas position
    var rect = canvas.getBoundingClientRect();
    var left = parseInt(rect.left);
    var top  = parseInt(rect.top);

    var mouseX = e.pageX - left;
    var mouseY = e.pageY - top;
    var mouseZ = 0.5;
    console.log(mouseX + " " + mouseY + " " + mouseZ);
    // convert to normalized device coordinates?
    //var posX = (mouseX / canvas.width) * 2 - 1;
    var posX = (2 * mouseX) / canvas.width - 1.0;
    //var posY = -(mouseY / canvas.height) * 2 + 1;
    var posY = 1.0 - (2 * mouseY) / canvas.height;
    var posZ = 1.0;
    var rayNDC = [posX, posY, posZ];
    //var rayCLIP = [posX, posY, -1.0, 1.0];
    var rayCLIP = [posX, posY, -1.0, 0.0];
    //console.log(rayCLIP);
    var projectionInverse = mat4.invert(mat4.create(), camera.projectionMatrix);
    //console.log(mat4.str(camera.projectionMatrix));
    //console.log(rayEYE);
    var viewProjection = mat4.multiply(mat4.create(), camera.projectionMatrix, camera.viewMatrix);
    var viewProjectionInverse = mat4.invert(mat4.create(), viewProjection);
    var viewInverse = mat4.invert(mat4.create(), camera.viewMatrix);
    var rayEYE = utilsmultMatVec4(viewInverse, vec4.fromValues(rayCLIP[0], rayCLIP[1], rayCLIP[2], 0.0));
    //var rayWOR = multiply(projectionInverse, rayEYE);
    var rayWOR = utils.multMatVec4(viewProjectionInverse, rayCLIP);
    rayWOR = rayWOR.slice(0, 3);
    //rayWOR = vec3.normalize(vec3.create(), rayWOR);
    console.log(rayWOR);
    sqX = rayWOR[0];
    sqY = rayWOR[1];
    sqZ = -rayWOR[2];
    console.log([sqX, sqY, sqZ]);
    //console.log(vec3.normalize(vec3.create(), rayWOR));

    var viewport = gl.getParameter(gl.VIEWPORT);
    //var mm = gl.getParameter();
    var temp = mat4.create();
    mat4.identity(temp);
    //mat4.set(temp, modelViewMatrix);
    //console.log(temp);
    mat4.multiply(temp, temp, projectionMatrix);
    //console.log(temp);
    mat4.invert(temp, temp);
    //console.log(temp);

    //drawScene();
}

*/

/**
 * Converts screen coordinates to world coordinates
 * Implementation based on OpenGL's glUnproject
 * @param {Event} e Mouse click event
 */
function onClick(e) {
    if(modes.orbit[1])
        return;
    // canvas position
    var rect = canvas.getBoundingClientRect();
    var left = parseInt(rect.left);
    var top  = parseInt(rect.top);
    // mouse click position relative to canvas position (canvas top-left -> (0, 0))
    const mouse_x = e.pageX - left;
    const mouse_y = e.pageY - top;
    console.log(mouse_x, mouse_y);

    var out = mat4.create();
    mat4.identity(out);
    //mat4.multiply(out, linkedScene.camera.projectionMatrix, linkedScene.camera.viewMatrix);
    mat4.multiply(out, linkedScene.camera.projectionMatrix, linkedScene.mv); //mvp
    mat4.invert(out, out);
    var viewport = [0, 0, linkedScene.vWidth, linkedScene.vHeight];
    console.log(viewport);

    var in1 = (mouse_x - viewport[0]) / viewport[2] * 2.0 - 1.0;
    var in2 = (mouse_y - viewport[1]) / viewport[3] * 2.0 - 1.0;
    var in3 = 2.0 * 1 - 1.0;
    var in4 = 1.0;
    var inv = [in1, in2, in3, in4];

    var vec = utils.multMatVec4(out, inv);
    if(vec[3] == 0.0) {
        console.log('nope');
        return;
    }
    vec[3] = 1.0 / out[3];
    console.log(vec);
    var result = [];
    result.push(vec[0] * vec[3]);
    result.push(vec[1] * vec[3]);
    result.push(vec[2] * vec[3]);
    console.log(result);

    var oldX = linkedScene.sqX;

    linkedScene.sqX = result[0];
    linkedScene.sqY = result[1];
    linkedScene.sqZ = result[2];

    linkedScene.draw();
}

function onClick1(e) {
    let gl = linkedScene.gl;
    let pixel = new Uint8Array(4);

    // canvas position
    var rect = event.target.getBoundingClientRect();
    var left = parseInt(rect.left);
    var top  = parseInt(rect.top);
    var bottom = parseInt(rect.bottom);
    //const mouse_x = e.pageX - left;
    //const mouse_y = linkedScene.vHeight - (e.pageY - top);
    const mouse_x = e.offsetX;
    const mouse_y = linkedScene.vHeight - e.offsetY;
    console.log(mouse_x, mouse_y);

    linkedScene.draw();
    linkedScene.gl.readPixels(mouse_x, mouse_y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

    console.log(pixel);
}

function onClick2(e) {

    // canvas position
    var rect = canvas.getBoundingClientRect();
    var left = parseInt(rect.left);
    var top  = parseInt(rect.top);
    // mouse click position relative to canvas position (canvas top-left -> (0, 0))
    const mouse_x = e.pageX - left;
    const mouse_y = e.pageY - top;
    console.log(mouse_x, mouse_y);

    //normalized position
    var normalizedPos = [
        (mouse_x * 2) / 1000 - 1,
        (1 - mouse_y) / 1000 * 2
    ];
    var homogeneousClipCoords = [normalizedPos[0], normalizedPos[1], -1, 1];
    //console.log(homogeneousClipCoords);

    var invViewMatrix = mat4.invert(mat4.create(), linkedScene.camera.viewMatrix);
    var invProjMatrix = mat4.invert(mat4.create(), linkedScene.camera.projectionMatrix);

    var camCoords = utils.multMatVec4(invProjMatrix, homogeneousClipCoords);
    //console.log(camCoords);
    var direction = [camCoords[0], camCoords[1], -1, 0];

    var worldCoords = utils.multMatVec4(invViewMatrix, direction);
    worldCoords = [worldCoords[0], worldCoords[1], worldCoords[2]];
    console.log(worldCoords);

    var normalizedWorldCoords = vec3.normalize([], worldCoords);
    //console.log(normalizedWorldCoords);

}
import * as utils from './utils/utils.js';

/**
 * Event handling module
 */

var canvas;
// camera position parameters
var drag = false;
var oldX, oldY;
var dx = 0, dy = 0;
var linkedScene;
var camDistance;
var hAngle; // horizontal angle
var vAngle;   // vertical angle
var diff;
var refX, refY, refZ;
var orbit = true;
var extrude = false;
var zoom = true;
var pan = false;
var translate = false;
var scale = false;

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
    refX = linkedScene.camera.reference[0];
    refY = linkedScene.camera.reference[1];
    refZ = linkedScene.camera.reference[2];

    // set up event listeners
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("mouseout", mouseUp, false);
    //window.addEventListener("click", onClick, false);
    window.addEventListener("keydown", keyboardHandler, false);
    window.addEventListener("resize", resizeViewport, false);
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
    if (orbit) { // check if camera orbit mode is activated
        if (!drag) return false;

        dx = (e.pageX - oldX);
        dy = (e.pageY - oldY);
        hAngle += dx * diff;
        vAngle = utils.clamp(vAngle + diff * dy, 5, 85); // maintain angle between 5 and 85 degrees
        oldX = e.pageX;
        oldY = e.pageY;
        // update scene
        linkedScene.updateCamera(vAngle, hAngle, camDistance);
    }
    
}

/**
 * Hanldes all keyboard events
 * @param {Event} e keyboard event
 */
function keyboardHandler(e) {
    var keyCode = e.keyCode;

    switch (keyCode) {
        case 37:    // Left Arrow
            if (translate) { // translate mode
                linkedScene.buildings[linkedScene.currBldg].posX--;
                linkedScene.draw();
            }
            if (scale && linkedScene.buildings[linkedScene.currBldg].scaleX > 0.5) {    // scale mode
                linkedScene.buildings[linkedScene.currBldg].scaleX-=0.5;
                linkedScene.draw();
            }
            if (pan) {  // camera panning mode
                linkedScene.camera.panCamera('z', 1);
                linkedScene.draw();
            }
            break;

        case 38:    // Up Arrow
            if (zoom) {     // zoom mode
                camDistance -= 0.5; // zoom in
                linkedScene.updateCamera(vAngle, hAngle, camDistance);
            }
            if (extrude) {  // extrude mode
                linkedScene.buildings[linkedScene.currBldg].height++;
                linkedScene.draw();
            }
            if (translate) { // translate mode
                linkedScene.buildings[linkedScene.currBldg].posZ--;
                linkedScene.draw();
            }
            if (scale) {    // scale mode
                linkedScene.buildings[linkedScene.currBldg].scaleZ+=0.5;
                linkedScene.draw();
            }
            break;
        
        case 39:    // Right Arrow
            if (translate) { // translate mode
                linkedScene.buildings[linkedScene.currBldg].posX++;
                linkedScene.draw();
            }
            if (scale) {    // scale mode
                linkedScene.buildings[linkedScene.currBldg].scaleX+=0.5;
                linkedScene.draw();
            }
            if (pan) {  // camera panning mode
                linkedScene.camera.panCamera('z', -1);
                linkedScene.draw();
            }
            break;

        case 40:    // Down Arrow
            if (zoom) {     // zoom mode
                camDistance += 0.5; // zoom out
                linkedScene.updateCamera(vAngle, hAngle, camDistance);
            }
            if (extrude && linkedScene.buildings[linkedScene.currBldg].height > 1) {  // extrude mode
                linkedScene.buildings[linkedScene.currBldg].height--;
                linkedScene.draw();
            }
            if (translate) { // translate mode
                linkedScene.buildings[linkedScene.currBldg].posZ++;
                linkedScene.draw();
            }
            if (scale && linkedScene.buildings[linkedScene.currBldg].scaleZ > 0.5) { // scale mode
                linkedScene.buildings[linkedScene.currBldg].scaleZ-=0.5;
                linkedScene.draw();
            }
            break;
        
        case 69:    // 'e'
            extrude = true;
            zoom = translate = scale = pan = false;
            showSnackbar("Extrude mode");
            break;

        case 70:    // 'f'
            linkedScene.buildings[linkedScene.currBldg].changeType();
            linkedScene.draw();
            break;

        case 71:    // 'g'
            linkedScene.toggleGrid();   // show/hide scene grid
            break;

        case 78:    // 'n'
            linkedScene.addNewBuilding();
            linkedScene.draw();
            break;
        
        case 79:    // 'o'
            orbit = !orbit; // toggle camera orbitting on/off 
            var state = orbit ? "on" : "off";
            showSnackbar(`orbit ${state}!`);
            break;
        
        case 80:
            pan = true;
            zoom = extrude = translate = scale = false;
            showSnackbar("Camera Pan mode");
            break;

        case 83:    // 's'
            scale = true;
            zoom = extrude = translate = pan = false;
            showSnackbar("Scale mode");
            break;

        case 86:    // 'v'
            translate = true;
            zoom = extrude = scale = pan = false;
            showSnackbar("Translate mode");
            break;
        
        case 90:    // 'z'
            zoom = true;
            extrude = translate = scale = pan = false;
            showSnackbar("Zoom mode");
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
 * Handles a mouse click event
 * @param {Event} e on click event
 */
/* TODO: fix implementation for object mouse selection
function onClick(e) {
    // convert screen coordinates to world coordinates
    if (orbit) return;
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
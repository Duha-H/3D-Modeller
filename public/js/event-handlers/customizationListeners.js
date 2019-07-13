var linkedController;
var canvasX;    // canvas x position (top left corner)
var canvasY;    // canvas y position (top left corner)
// mouse handling variables
var drag = false;
var oldX, oldY;
var dx = 0, dy = 0;
var selectedIdx = -1;

export function CustomizationHandler(profileController) {
    linkedController = profileController;
    this.canvas = linkedController.canvas;
    // get canvas position
    var rect = this.canvas.getBoundingClientRect();
    canvasX = parseInt(rect.left);
    canvasY = parseInt(rect.top);

    this.canvas.addEventListener("mousedown", mouseDown, false);
    this.canvas.addEventListener("mouseup", mouseUp, false);
    this.canvas.addEventListener("mouseout", mouseUp, false);
    this.canvas.addEventListener("mousemove", mouseMove, false);

    // Bind control point lock events
    const cp2lock = document.getElementById('cp2-lock');
    cp2lock.addEventListener("change", () => {
        lockControlPt(1);
    }, false);
    var cp3lock = document.getElementById('cp3-lock');
    cp3lock.addEventListener("change", () => {
        lockControlPt(2);
    }, false);

    const resetButton = document.getElementById('reset-cps');
    resetButton.addEventListener("click", resetCtlPts, false); 

}

function mouseDown(e) {
    var mouseX = e.pageX - canvasX;
    var mouseY = e.pageY - canvasY;
    // retreive index of selectec/clicked point if available
    selectedIdx = linkedController.detectSelection(mouseX, mouseY);
    drag = true;
    oldX = mouseX;
    oldY = mouseY;
    return false;

}

function mouseUp() {
    drag = false;

}

function mouseMove(e) {
    if(!drag) return false;

    var mouseX = e.pageX - canvasX;
    var mouseY = e.pageY - canvasY;
    dx = mouseX - oldX;
    dy = mouseY - oldY;
    linkedController.updateCtlPtPosition(selectedIdx, dx);

    oldX = e.pageX - canvasX;
    oldY = e.pageY - canvasY;
}

/**
 * Locks the control point of the profile controller at the given index 
 * @param {Number} idx Index of control point to lock
 */
function lockControlPt(idx) {
    linkedController.lockControlPt(idx);
}

/**
 * Resets the positions of control points of the linked customizer
 */
function resetCtlPts() {
    linkedController.resetCtlPts();
}
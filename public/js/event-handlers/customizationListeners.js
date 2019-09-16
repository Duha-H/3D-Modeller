var linkedCustomizer;
var canvasX;    // canvas x position (top left corner)
var canvasY;    // canvas y position (top left corner)
// mouse handling variables
var drag = false;
var oldX, oldY;
var dx = 0, dy = 0;
var selectedIdx = -1;

export function CustomizationHandler(profileCustomizer) {
    linkedCustomizer = profileCustomizer;
    this.canvas = linkedCustomizer.canvas;

    // draw linked customizer
    linkedCustomizer.setCanvasDimensions(this.canvas.clientWidth, this.canvas.clientHeight);
    linkedCustomizer.draw();
    
    // get canvas position
    var rect = this.canvas.getBoundingClientRect();
    canvasX = parseInt(rect.left);
    canvasY = parseInt(rect.top);

    this.canvas.addEventListener("mousedown", mouseDown, false);
    this.canvas.addEventListener("mouseup", mouseUp, false);
    this.canvas.addEventListener("mouseout", mouseUp, false);
    this.canvas.addEventListener("mousemove", mouseMove, false);

    const modifyButton = document.getElementById('modify-button');
    modifyButton.addEventListener("click", () => {
        //console.log('event 1!');
        document.getElementById('profile-customizer').style.opacity = 1;
    }, false);

    // Bind control point lock events
    const cp2lock = document.getElementById('cp2-lock');
    cp2lock.addEventListener("change", () => {
        lockControlPt(1);
    }, false);
    const cp3lock = document.getElementById('cp3-lock');
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
    selectedIdx = linkedCustomizer.detectSelection(mouseX, mouseY);
    drag = true;
    oldX = mouseX;
    oldY = mouseY;
    return false;

}

function mouseUp() {
    drag = false;
    linkedCustomizer.resetCtlPtDeltas();
}

function mouseMove(e) {
    if(!drag) return false;

    var mouseX = e.pageX - canvasX;
    var mouseY = e.pageY - canvasY;
    dx = mouseX - oldX;
    dy = mouseY - oldY;
    linkedCustomizer.updateCtlPtPosition(selectedIdx, dx);

    oldX = e.pageX - canvasX;
    oldY = e.pageY - canvasY;
}

/**
 * Locks the control point of the profile controller at the given index 
 * @param {Number} idx Index of control point to lock
 */
function lockControlPt(idx) {
    linkedCustomizer.lockControlPt(idx);
}

/**
 * Resets the positions of control points of the linked customizer
 */
function resetCtlPts() {
    linkedCustomizer.resetCtlPts();
}
import { ControlPoint } from './controlPoint.js';
/**
 * Creates and draws a building profile customization controller
 */

const MODES = { // used for toggling color theme
    DARK: 'white',
    LIGHT: 'rgb(20, 23, 37)'
}
const DEF_RADIUS = 6;  // default size of control point
const X_POS_INITIAL = 50;
const Y_POS_INITIAL = 20;   // y coordinate of first control point
const Y_POS_FINAL = 370;    // y coordinate of last control point

export class ProfileCustomizer {
    
    constructor(canvas) {
        
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.vWidth = canvas.clientWidth;
        this.vHeight = canvas.clientHeight;
        this.mode = MODES.DARK;

        //X_POS_INITIAL = this.vWidth/2; // initial x coordinate of control points
        this.cps = []; // list of control points
        this.numPoints = 4; // initial number of control points

        this.initCtlPts();
        this.draw();
    }

    /**
     * Toggle color theme
     */
    toggleTheme() {
        this.mode = this.mode == MODES.DARK ? MODES.LIGHT : MODES.DARK;
        this.draw();
    }

    /**
     * Populates the inital array of control points and their attributes
     */
    initCtlPts() {
        var ySpacing = (Y_POS_FINAL - Y_POS_INITIAL) / this.numPoints;
        var x, y;
        for(var i = 0; i < this.numPoints; i++) {
            x = X_POS_INITIAL;
            y = Y_POS_INITIAL + (ySpacing * i);
            var controlPt = new ControlPoint(this.ctx, x, y);
            this.cps.push(controlPt);
        }
    }

    /**
     * Draws control points and profile curve
     */
    draw() {
        // clear canvas
        this.ctx.clearRect(0, 0, this.vWidth, this.vHeight);

        // draw control points
        this.ctx.fillStyle = this.mode;
        this.cps.forEach((point) => {
            point.draw();
        });

        // draw control path
        this.ctx.strokeStyle = 'rgb(138, 230, 236)';
        this.ctx.moveTo(this.cps[0].x, this.cps[0].y);
        this.ctx.lineTo(this.cps[1].x, this.cps[1].y);
        this.ctx.lineTo(this.cps[2].x, this.cps[2].y);
        this.ctx.lineTo(this.cps[3].x, this.cps[3].y);
        this.ctx.stroke();

        // draw profile curve
        this.ctx.strokeStyle = this.mode;
        this.ctx.beginPath();
        this.ctx.moveTo(this.cps[0].x, this.cps[0].y);
        if(this.cps[1].locked) {
            this.ctx.lineTo(this.cps[1].x, this.cps[1].y);
            if(this.cps[2].locked) {
                this.ctx.lineTo(this.cps[2].x, this.cps[2].y);
                this.ctx.lineTo(this.cps[3].x, this.cps[3].y);
            } else {
                this.ctx.quadraticCurveTo(this.cps[2].x, this.cps[2].y,
                    this.cps[3].x, this.cps[3].y);
            }
        } else if(this.cps[2].locked) {
            this.ctx.quadraticCurveTo(this.cps[1].x, this.cps[1].y,
                this.cps[2].x, this.cps[2].y);
            this.ctx.lineTo(this.cps[3].x, this.cps[3].y);
        } else {
            this.ctx.bezierCurveTo(this.cps[1].x, this.cps[1].y,
                this.cps[2].x, this.cps[2].y,
                this.cps[3].x, this.cps[3].y);
        }        
        this.ctx.stroke();
        

        
    }

    /**
     * Updates position of control point at the specified index
     * @param {Number} idx Index of control point to update
     * @param {Number} dx Change in x coordinate
     */
    updateCtlPtPosition(idx, dx) {
        // check that a point at the given index exitst
        if(this.cps[idx] !== undefined) {
            this.cps[idx].updatePosition(dx, 0);
            // redraw control points
            this.draw();
            if(this.linkedScene) {
                this.linkedScene.buildings[this.linkedScene.currBldg].convertToMesh(this.cps);
                this.linkedScene.draw();
            }
        } 
        
    }


    /**
     * Returns the index of the clicked/selected control point, or -1 if no point is selected
     * @param {Number} mouseX X coordinate of mouse click
     * @param {Number} mouseY Y coordinate of mouse click
     */
    detectSelection(mouseX, mouseY) {
        var point;
        for(var i = 0; i < this.numPoints; i++) {
            point = this.cps[i];
            if(point.isSelected(mouseX, mouseY)) {
                return i;
            }
        }
        return -1;  // no point is selected
    }

    /**
     * Updates the lock status of a control point
     * @param {Number} idx Index of control point to lock
     */
    lockControlPt(idx) {
        const updatedStatus = !this.cps[idx].locked;
        this.cps[idx].locked = updatedStatus;
        this.draw();
    }

    /**
     * Resets customizer's control point positions
     */
    resetCtlPts() {
        this.cps = [];
        this.initCtlPts();
        this.draw();
        if(this.linkedScene) {
            this.linkedScene.buildings[this.linkedScene.currBldg].resetMesh();
            this.linkedScene.draw();
        }
    }

    /**
     * Resets delta x values of control points
     */
    resetCtlPtDeltas() {
        this.cps.forEach((point) => {
            point.dx = 0;
        });
    }

    linkScene(scene) {
        this.linkedScene = scene;
    }
}
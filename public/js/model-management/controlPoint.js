/**
 * Control Point object
 */
const DEF_RADIUS = 6;  // default size of control point

export class ControlPoint {
    
    constructor(context, x, y) {

        this.ctx = context;
        this.x = x;
        this.y = y;
        this.locked = false;
        this.dx = 0; // change in point position (x direction)
    }

    draw() {
        //this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, DEF_RADIUS, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    /**
     * Returns true if control point is selected/clicked
     * @param {Number} mouseX X coordinate of mouse click
     * @param {Number} mouseY Y coordinate of mouse click
     */
    isSelected(mouseX, mouseY) {
        var selected = false;
        var x1 = this.x - DEF_RADIUS;
        var x2 = this.x + DEF_RADIUS;
        var y1 = this.y - DEF_RADIUS;
        var y2 = this.y + DEF_RADIUS;
        // check if mouse coordinates are within point range
        if(mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2) 
            selected = true;

        return selected;
    }

    /**
     * Updates x, y coordinates of Control Point
     * @param {Number} dx Change in x coordinate
     * @param {Number} dx Change in y coordinate
     */
    updatePosition(dx, dy) {
        this.dx = dx;
        this.x += dx;
        this.y += dy;
    }
}
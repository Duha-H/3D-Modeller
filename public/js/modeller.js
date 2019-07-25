import { Cube } from './models/cube.js';
import { Camera } from './scene-objects/camera.js';
import { degToRad } from './utils/utils.js';
import { Grid } from './geometry/grid.js';
import { Building } from './models/building.js';
import { Square } from './geometry/square.js';
import { Scene } from './scene.js';
import { Cone } from './models/cone.js';
import { Line } from './geometry/line.js';

/**
 * Creates and draws 3D Modeller (main canvas)
 */

const {mat4} = glMatrix; // object destructuring to get mat4
var modelViewMatrix = mat4.create();
var normalMatrix = mat4.create();
var modelMatrix = mat4.create();

export class Modeller extends Scene {

    constructor(renderer) {
        super(renderer);

        // create scene objects
        this.grid = new Grid(this.gl, 100, 100, 2);
        this.showGrid = true;
        this.base = new Cube(this.gl);
        this.buildings = [new Building(this.gl)];
        this.currBldg = 0; // currently active building
    }

    /**
     * Toggle displaying grid on and off
     */
    toggleGrid() {
        this.showGrid = !this.showGrid;
        this.draw();
    }

    /**
     * Add new building to scene
     */
    addNewBuilding() {
        var building = new Building(this.gl);
        this.buildings.push(building);
        this.currBldg++;
    }

    linkProfileCustomizer(customizer) {
        this.profileCustomizer = customizer;
    }

    /**
     * Apply transformations and draw scene objects
     */
    draw() {

        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

        // update uniforms
        this.gl.uniformMatrix4fv(this.renderer.uniformLocs.view, false, this.camera.viewMatrix);
        this.gl.uniformMatrix4fv(this.renderer.uniformLocs.projection, false, this.camera.projectionMatrix);
        
        // draw base
        modelMatrix = mat4.create(); // matrix used to apply tranformations to base
        this.base.translate([0, -1.1, 0], modelMatrix);
        this.base.scale([50, 1, 50], modelMatrix);
        this.base.setHeight(0.08);

        this.updateMatrixUniforms(modelMatrix);

        this.base.setColor(this.mode);
        this.base.draw(this.renderer.attribLocs);

        
        // draw grid
        if (this.showGrid)
            this.grid.draw(this.renderer.uniformLocs, this.renderer.attribLocs);

        // draw buildings
        for(var i = 0; i < this.buildings.length; i++) {
            // set color of active building
            if (i === this.currBldg) {
                this.buildings[i].setColor([0.5, 0.8, 0.7]);
            }
            else {
                this.buildings[i].setColor([0.5, 0.8, 0.5]);
            }

            // draw building
            this.buildings[i].draw(this.renderer.uniformLocs, this.renderer.attribLocs, this.camera.viewMatrix);
        }

    }

}
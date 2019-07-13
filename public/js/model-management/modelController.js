import * as modelGenerator from './modelGenerator.js';
/**
 * Manages and controls vertices and normals of a given model
 */
export class ModelController {

    constructor(vertexPositions, height) {
        this.vertexPositions = vertexPositions;
        this.height = height;
        this.floorPolygons = modelGenerator.generateFloorPolygons(vertexPositions, this.height, 3);
        console.log(this.floorPolygons.length, 'floor polygons');
        this.modelVertices = modelGenerator.generateMesh(this.floorPolygons);
        this.modelNormals = modelGenerator.generateNormals(this.modelVertices);
    }

    updateHeight(newHeight) {
        modelGenerator.updateModelHeight(this.modelVertices, newHeight);
    }

    updateMeshSections(controlPoints) {
        const sections = controlPoints.length - 1;
        if(this.floorPolygons.length !== controlPoints.length)
            this.floorPolygons = modelGenerator.generateFloorPolygons(this.vertexPositions, this.height, sections);
        //console.log(this.floorPolygons.length, 'floor polygons');
        //let vertices = modelGenerator.generateMesh(this.floorPolygons);
        //console.log('before:', this.modelVertices.length);
        //const floors = modelGenerator.updateFloorPolygons(floorPolygons, controlPoints);
        this.floorPolygons = modelGenerator.updateFloorPolygons(this.floorPolygons, controlPoints);
        this.modelVertices = modelGenerator.generateMesh(this.floorPolygons);
        //console.log('after:', this.modelVertices.length);
        this.modelNormals = modelGenerator.generateNormals(this.modelVertices);
    }

    resetMeshSections() {
        this.floorPolygons = modelGenerator.generateFloorPolygons(this.vertexPositions, this.height, 1);
        this.modelVertices = modelGenerator.generateMesh(this.floorPolygons);
        this.modelNormals = modelGenerator.generateNormals(this.modelVertices);
    }
}
import * as utils from '../utils/utils.js';
/**
 * Module of functions for generating vertices and normals of a given model
 */


/**
 * Returns a list of vertices defining model triangles
 * @param {Array} vertexPositions 2D list of vertex positons of a given base polygon (bottom)
 */
export function generateModelVertices(vertexPositions, height) {
    let vertices = [];
    const floorPolygons = generateFloorPolygons(vertexPositions, height, 1);
    vertices = generateMesh(floorPolygons);

    return vertices;
}


/**
 * Returns a list of model vertices using the vertex positions of the base polygon.
 * Vertices returned define triangles of a model with the specified number of sections
 * @param {Array} floorPolygons 3D array of base polygon vertex positions at different floor heights
 */
export function generateMesh(floorPolygons) {
    const sections = floorPolygons.length - 1;
    //console.log('sections:', sections);
    let updatedVertices = [];
    // define vertices of bottom and top polygons
    let bottomTriangles = getPolygonTriangles(floorPolygons[0]);
    //console.log(bottomTriangles.length / 3, 'bottom triangle vertices generated');
    let topTriangles = getPolygonTriangles(floorPolygons[sections]);
    //console.log(topTriangles.length / 3, 'top triangle vertices generated');
    updatedVertices.push(...bottomTriangles);
    updatedVertices.push(...topTriangles);
    
    for(let i = 0; i < sections; i++) {
        
        let v1 = i;
        let v2 = i + 1;
        
        let bottomPolygon = floorPolygons[v1];
        let topPolygon = floorPolygons[v2];
        
        let sectionTriangles = getSideTriangles(bottomPolygon, topPolygon);
        updatedVertices.push(...sectionTriangles);
    }
    return updatedVertices;
}


/**
 * Returns an array of vertex normals for the provided vertices
 * @param {Array} vertices Vertices to generate normals for
 */
export function generateNormals(vertices) {
    let normals = [];
    // generates a normal for two triangles at a time
    // makes sure that triangles of the same quad have the same normal (they're technically one surface)
    for(let i = 0; i < vertices.length; i+=18) {
        const p1 = [vertices[i], vertices[i+1], vertices[i+2]];
        const p2 = [vertices[i+3], vertices[i+4], vertices[i+5]];
        const p3 = [vertices[i+6], vertices[i+7], vertices[i+8]];
        let u = utils.subtractVec3(p2, p1);
        let v = utils.subtractVec3(p3, p1);
        // calculate v x u (ensures normals point outwards based on the order of vertex definitions)
        let surfaceNormal = utils.crossProduct(v, u);
        normals.push(...utils.copyArray(surfaceNormal, 6));
    }
    return normals;
}


/**
 * Updates model height for the provided vertices
 * @param {Array} vertices Vertices of model to update
 * @param {Number} newHeight New block height
 */
export function updateModelHeight(vertices, newHeight) {
    // updates are performed by reference to the provided vertices array (in place)
    for(let i = 1; i < vertices.length; i+=3) {
        vertices[i] = vertices[i] > 0 ? newHeight : vertices[i];
    }
}


/**
 * Returns a 3D array of polygon vertex positions at various building sub-sections based 
 * on a given number of sub-polygons/sections.
 * Number of sub-polygons is equal to numSection + 1 (returned array has length = numSections + 1)
 * @param {Array} vertexPositions 2D array of polygon vertex positions (outer vertices only)
 * @param {Number} height Specified height of model
 * @param {Number} numSections Number of sub-sections (floors) in model mesh
 */
export function generateFloorPolygons(vertexPositions, height, numSections) {
    let polygons = [];
    let floorHeight = height / numSections;
    for(let i = 0; i <= numSections; i++) {
        let polygonVertexPositions = getVertexPositionsWithUpdatedHeight(vertexPositions, floorHeight * i);
        if(isNaN(polygonVertexPositions[i][2]))
            console.log('PROBLEM');
        polygons.push(polygonVertexPositions);
    }
    return polygons;
}


/**
 * Returns a list of vertices defining triangles of a given polygon
 * @param {Array} vertexPositions 2D of vertex positions of polygon
 */
function getPolygonTriangles(vertexPositions) {
    // get triangles from vertex POSITIONS
    let vertices = [];
    let numVertexPositions = vertexPositions.length;
    let numTriangles = numVertexPositions % 2 == 0 ? 
        numVertexPositions / 2 : numVertexPositions - 1;
    // generate triangles of base polygon
    if(numVertexPositions % 2 == 0) {
        for(let i = 1; i <= numTriangles; i++) {
            vertices.push(...vertexPositions[0]);
            vertices.push(...vertexPositions[i]);
            vertices.push(...vertexPositions[i+1]);
        }
    } else {
        for(let i = 1; i <= numTriangles; i++) {
            let v = i == numTriangles ? 1 : i + 1;
            vertices.push(...vertexPositions[0]);
            vertices.push(...vertexPositions[i]);
            vertices.push(...vertexPositions[v]);
        }
    }
    return vertices;
}


/**
 * Returns a list vertices for side quads (2 triangles) for the specified bottom and top poylgons
 * @param {Array} bottomPolygonVertices 2D array of vertex positons of bottom polygon
 * @param {Array} topPolygonVertices 2D array of vertex positions of top polygon
 */
function getSideTriangles(bottomPolygonVertices, topPolygonVertices) {
    // side triangles from bottom and top polygon vertex POSITIONS
    let vertices = [];
    if(bottomPolygonVertices.length !== topPolygonVertices.length) {
        console.log('Error: getting side triangles; polygon vertex lengths mismatch');
        return;
    }
    const numFaces = bottomPolygonVertices.length;
    for(let i = 0; i < numFaces; i++) {
        let v1 = i;
        let v2 = i == numFaces - 1 ? 0 : i + 1;
        // define triangle vertices starting from the lower left corner and proceeding clockwise
        // first triangle
        vertices.push(...bottomPolygonVertices[v1]);
        vertices.push(...bottomPolygonVertices[v2]);
        vertices.push(...topPolygonVertices[v2]);

        // second triangle
        vertices.push(...bottomPolygonVertices[v1]);
        vertices.push(...topPolygonVertices[v2]);
        vertices.push(...topPolygonVertices[v1]);
    }
    if (numFaces % 2 !== 0) {
        // add last face if a central vertex exists (i.e. total number of faces is odd)
        vertices.push(...bottomPolygonVertices[numFaces - 1]);
        vertices.push(...bottomPolygonVertices[1]);
        vertices.push(...topPolygonVertices[1]);

        vertices.push(...bottomPolygonVertices[numFaces - 1]);
        vertices.push(...topPolygonVertices[1]);
        vertices.push(...topPolygonVertices[numFaces - 1]);
    }
    return vertices;
}


/**
 * Returns vertex positions of a polygon at the specified height (y value)
 * @param {Array} vertexPositions 2D array of polygon vertex positions
 * @param {Number} height Height of polygon (y value)
 */
function getVertexPositionsWithUpdatedHeight(vertexPositions, height) {
    // yes, function names can get longer
    let updatedVertexPositions = [];
    if(vertexPositions[0][1] === height) { // specified height is the same as current height
        return vertexPositions;
    }
    for(let i = 0; i < vertexPositions.length; i++) {
        let x = vertexPositions[i][0];
        let y = height;
        let z = vertexPositions[i][2];
        updatedVertexPositions.push([x, y, z]);
    }
    return updatedVertexPositions;
}

/**
 * Returns an updated 3D array of floor polygon vertex positions based on changes in control
 * point positions at different heights
 * @param {Array} floorPolygons 3D array of floor polygon vertex positions at different floor heights
 * @param {Array} controlPoints 1D array of control points affecting change on floor polygon vertex positions
 */
export function updateFloorPolygons(floorPolygons, controlPoints) {
    if(floorPolygons.length !== controlPoints.length) {
        console.log('Error: mismatched lengths of floor polygons and control points');
        return;
    }
    let updatedPolygons = [];
    const sections = controlPoints.length - 1;
    for(let i = 0; i < controlPoints.length; i++) {
        if(controlPoints[sections - i].dx === 0) {  // control point position has not changed
            updatedPolygons.push(floorPolygons[i]); // push polygon unchanged   
            continue;
        }
        let dx = controlPoints[sections - i].dx * 0.09; // control point position change
        let updatedFloor = [];
        for(let j = 0; j < floorPolygons[i].length; j++) {
            let vertex = floorPolygons[i][j];

            const x = vertex[0];
            const z = vertex[2];
            let mag = Math.sqrt((x ** 2) + (z ** 2)); // calculate magnitude of vector along which vertex updates
            // (x, z) + du
            // normalize
            let ux = x / mag;
            let uz = z / mag;
            // calculate distance change
            let dux = dx * ux;
            let duz = dx * uz;
            // compute new position
            let newX = x + dux;
            let newZ = z + duz;
            
            updatedFloor.push([newX, vertex[1], newZ]); // add updated vertex to floor polygon
            
        }
        updatedPolygons.push(updatedFloor); // push updated polygon vertices
    }

    return updatedPolygons;
}
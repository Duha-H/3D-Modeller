import * as utils from '../utils/utils.js';
/**
 * Module for generating vertices and normals of a given model
 */

/**
 * 
 * @param {Array} vertexPositions 2D list of vertex positons of a given base polygon (bottom)
 */
export function generateModelVertices(vertexPositions, height) {
    let vertices = [];
    // get top polygon vertex positions from bottom polygon
    let topVertexPositions = getVertexPositionsWithUpdatedHeight(vertexPositions, height);
    // get vertex positions of polygons excluding center vertex if any (used to generate side quads)
    let bottomPolygon = vertexPositions.filter((element) => {
        // this is incredibly lazy and should probably change but works for now
        return element.toString() !== '0,0,0'; // remove center vertex position
    });
    let topPolygon = getVertexPositionsWithUpdatedHeight(bottomPolygon, height);

    // generate vertices of triangles of bottom and top polygons
    let baseVertices = getPolygonTrianlges(vertexPositions);
    let topVertices = getPolygonTrianlges(topVertexPositions);
    // generate side quads (triangles)
    let sideTriangles = getSideTriangles(bottomPolygon, topPolygon);
    
    // add bottom polygon vertices (triangles)
    vertices.push(...baseVertices);
    // add top polygon vertices (triangles)
    vertices.push(...topVertices);
    // add side quads vertices (triangles)    
    vertices.push(...sideTriangles);

    return vertices;
}

/**
 * Returns a list of vertices defining triangles of a given polygon
 * @param {Array} vertexPositions 2D of vertex positions of polygon
 */
function getPolygonTrianlges(vertexPositions) {
    // get triangles from vertex POSITIONS
    let vertices = [];
    var numVertexPositions = vertexPositions.length;
    var numTriangles = numVertexPositions % 2 == 0 ? 
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
        console.log('Error: polygon vertex lengths mismatch');
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
    for(let i = 0; i < vertexPositions.length; i++) {
        let x = vertexPositions[i][0];
        let y = height;
        let z = vertexPositions[i][2];
        updatedVertexPositions.push([x, y, z]);
    }
    return updatedVertexPositions;
}

/**
 * Returns an array of vertex normals for the provided vertices
 * @param {Array} vertices Vertices to generate normals for
 */
export function generateNormals(vertices) {
    let normals = [];
    for(let i = 0; i < vertices.length; i+=9) {
        const p1 = [vertices[i], vertices[i+1], vertices[i+2]];
        const p2 = [vertices[i+3], vertices[i+4], vertices[i+5]];
        const p3 = [vertices[i+6], vertices[i+7], vertices[i+8]];
        let u = utils.subtractVec3(p2, p1);
        let v = utils.subtractVec3(p3, p1);
        // calculate v x u (normals pointing outward based on the order of vertex definitions)
        let surfaceNormal = utils.crossProduct(v, u);
        normals.push(...utils.copyArray(surfaceNormal, 3));
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
 * Adds intermediate base polygons to model vertices
 * @param {Number} subPolygons Number of sub-polygons/sections in mesh redefinition
 */
export function convertToMesh(subPolygons) {
    var subPlgns = subPolygons === undefined ? 4 : subPolygons;
}

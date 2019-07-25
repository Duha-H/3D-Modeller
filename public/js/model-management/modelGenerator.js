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
        //console.log('before:', floorPolygons[v1], floorPolygons[v2]);
        let bottomPolygon = floorPolygons[v1].filter((element) => {
            return (element[0] !== 0 && element[2] !== 0); // remove center vertex position
        });
        let topPolygon = floorPolygons[v2].filter((element) => {
            return (element[0] !== 0 && element[2] !== 0); // remove center vertex position
        });
        //console.log('after:', bottomPolygon, topPolygon);
        //console.log(bottomPolygon.length, topPolygon.length);
        
        let sectionTriangles = getSideTriangles(bottomPolygon, topPolygon);
        updatedVertices.push(...sectionTriangles);
        //console.log(sectionTriangles.length/6, 'section triangles generated for section', i);
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
 * Returns a 3D array of polygon vertex positions at various building sub-sections based on a given number of sub-polygons/sections.
 * Number of sub-polygons is equal to numSection + 1 (returned array has length = numSections + 1)
 * @param {Array} vertexPositions 2D array of polygon vertex positions (outer vertices only)
 * @param {Number} height Specified height of model
 * @param {Number} numSections Number of sub-sections (floors) in model mesh
 */
export function generateFloorPolygons(vertexPositions, height, numSections) {
    let polygons = [];
    let floorHeight = height / numSections;
    //console.log('generating floor polygons:', numSections);
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


export function updateFloorPolygons(floorPolygons, controlPoints) {
    if(floorPolygons.length !== controlPoints.length) {
        console.log('Error: mismatched lengths of floor polygons and control points');
        return;
    }
    let updatedPolygons = [];
    const sections = controlPoints.length - 1;
    for(let i = 0; i < controlPoints.length; i++) {
        if(controlPoints[sections - i].dx === 0) {  // control point position has not changed
            console.log('no change at', i);
            updatedPolygons.push(floorPolygons[i]); // push polygon unchanged   
            continue;
        }
        let dx = controlPoints[sections - i].dx * 0.3;
        //let updatedFloor = floorPolygons[i];
        let updatedFloor = [];
        for(let j = 0; j < floorPolygons[i].length; j++) {
            let vertex = floorPolygons[i][j];
            //console.log('old:', vertex[0], vertex[1], vertex[2]);
            const x_ = vertex[0];
            const z_ = vertex[2];
            let x2 = Math.pow(x_, 2);
            let z2 = Math.pow(z_, 2);
            //console.log('x:', x2);
            //console.log('z:', z2);
            let mag = Math.sqrt(x2 + z2);
            //console.log(mag);
            let theta = utils.degToRad(Math.asin((z_ / mag)));
            //console.log(theta);
            const flagx = x_ < 0 ? -1 : 1;
            const flagz = z_ < 0 ? -1 : 1;
            let x = x_ + (theta * dx * flagx);
            let z = z_ + (theta * dx * flagz);
            //let x = x_;
            //let z = z_;
            //vertex[0] = x;
            //vertex[2] = z;
            //console.log('new values: ', floorPolygons[i][j][0], floorPolygons[i][j][1], floorPolygons[i][j][2]);
            updatedFloor.push([x, vertex[1], z]); // add updated vertex to floor polygon
            //console.log('new:', [x, vertex[1], z]);
        }
        updatedPolygons.push(updatedFloor); // push updated polygon vertices
    }

    return updatedPolygons;
}
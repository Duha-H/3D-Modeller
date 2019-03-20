// Cube object definition and functions

const vertexD = [
    // Front
     1,  1,  1,
     1, -1,  1,
    -1,  1,  1,
    -1,  1,  1,
     1, -1,  1,
    -1, -1,  1,
    
    // Left
    -1,  1,  1,
    -1, -1,  1,
    -1,  1, -1,
    -1,  1, -1,
    -1, -1,  1,
    -1, -1, -1,

    // Back
    -1,  1, -1,
    -1, -1, -1,
     1,  1, -1,
     1,  1, -1,
    -1, -1, -1,
     1, -1, -1,

    // Right
     1,  1, -1,
     1, -1, -1,
     1,  1,  1,
     1,  1,  1,
     1, -1,  1,
     1, -1, -1,

    // Top
     1,  1,  1,
     1,  1, -1,
    -1,  1,  1,
    -1,  1,  1,
     1,  1, -1,
    -1,  1, -1,

    // Bottom
     1, -1,  1,
     1, -1, -1,
    -1, -1,  1,
    -1, -1,  1,
     1, -1, -1,
    -1, -1, -1

];

const normalD = [
    ...createCopies([ 0,  0,  1], 6),  // FRONT
    ...createCopies([-1,  0,  0], 6),  // LEFT
    ...createCopies([ 0,  0, -1], 6),  // BACK
    ...createCopies([ 1,  0,  0], 6),  // RIGHT
    ...createCopies([ 0,  1,  0], 6),  // TOP
    ...createCopies([ 0, -1,  0], 6),  // BOTTOM
];

function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
}

function createCopies(array, copies) {
    // return "array" copied "copies" times and spread into a single array "result"
    var result = [];
    for(let i = 0; i < copies; i++) {
        result.push(...array);
    }
    return result;
}

function Cube(gl) {

    // generate random face colors
    var colorD = [];
    for(let face = 0; face < 6; face++) {
        let faceColor = randomColor();
        for (let vertex = 0; vertex < 6; vertex++) {
            colorD.push(...faceColor);
        }
    }

    // create and bind vertex and color buffers
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexD), gl.STATIC_DRAW); 

    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorD), gl.STATIC_DRAW);

    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalD), gl.STATIC_DRAW);    


    this.draw = function(posLocation, colorLocation, normalLocation) {

        gl.enableVertexAttribArray(posLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(posLocation, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(colorLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(normalLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, vertexD.length / 3);        
    }

    this.applyTransformations = function(uniformLocation, pos, scale) {

        const modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, pos);
        mat4.scale(modelMatrix, modelMatrix, scale);
        //mat4.translate(modelMatrix, modelMatrix, [0.5, 0.5, -2]);
        //gl.uniformMatrix4fv(uniformLocation, false, modelMatrix);
        return modelMatrix;

    }

    this.translate = function(x, y, z) {
        mat4.translate(modelMatrix, modelMatrix, [x, y, z]);
    }

    this.scale = function(x, y, z) {
        mat4.scale(modelMatrix, modelMatrix, [x, y, z]);
    }

    this.setColor = function(color) {

        colorD = [];
        for(let face = 0; face < 6; face++) {
            let faceColor = color;
            for (let vertex = 0; vertex < 6; vertex++) {
                colorD.push(...faceColor);
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorD), gl.STATIC_DRAW);

    }

    this.getBoundingBox = function() {
        
    }
}


// Utility/Helper functions

/**
 * Returns a random color in a 3-element (RGB) array
 */
export function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
}


/**
 * Returns array copied numCopies times and spread into a single array "result"
 * @param {array} array 
 * @param {number} numCopies 
 */
export function copyArray(array, numCopies) {
    var result = [];
    for(let i = 0; i < numCopies; i++) {
        result.push(...array);
    }
    return result;
}

/**
 * Converts angle from degrees to radians
 * @param {number} x Angle in degrees
 */
export function degToRad(x) {
    return x * Math.PI / 180;
}

/**
 * Converts angle from radians to degrees
 * @param {number} x Angle in radians
 */
export function radToDeg(x) {
    return x * 180 / Math.PI;
}
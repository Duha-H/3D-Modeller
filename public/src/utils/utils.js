// Utility/Helper functions

/**
 * Returns a random color in a 3-element (RGB) array
 */
export function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
}


/**
 * Returns array copied numCopies times and spread into a single array "result"
 * @param {*} array 
 * @param {*} numCopies 
 */
export function copyArray(array, numCopies) {
    var result = [];
    for(let i = 0; i < numCopies; i++) {
        result.push(...array);
    }
    return result;
}

//export *  from './utils.js';
//import '../gl-setup/gl-matrix.js';


const {mat4} = glMatrix; // object destructuring to get mat4

/**
 * Creates Camera object
 * Updates view and projection matrices appropriately
 */


export class Camera {

    constructor(position, reference, upVector, userControlled) {
        // Camera position
        this.position = position;
        this.reference = reference;
        this.upVector = upVector;

        // Define user control
        this.enableControl = userControlled;
    }
    
    /**
     * Updates camera position
     * @param {mat4} viewMatrix 
     * @param {array} position 
     */
    updatePosition(viewMatrix, newPosition) {
        this.position = newPosition;
        mat4.lookAt(viewMatrix, this.position, this.reference, this.upVector);
    }

    /**
     * Updates camera reference point
     * @param {mat4} viewMatrix 
     * @param {array} newReference 
     */
    updateReference(viewMatrix, newReference) {
        this.reference = newReference;
        mat4.lookAt(viewMatrix, this.position, this.reference, this.upVector);
    }

    /**
     * Updates camera up vector
     * @param {mat4} viewMatrix 
     * @param {array} newUpVector 
     */
    updateUpVector(viewMatrix, newUpVector) {
        this.upVector = newUpVector;
        mat4.lookAt(viewMatrix, this.position, this.reference, this.upVector);
    }

    /**
     * Sets up perspective projection matrix
     * @param {mat4} projectionMatrix
     * @param {number} fov Vertical field of view 
     * @param {number} aspectRatio 
     * @param {number} near Near plane position
     * @param {number} far Far plane position
     */
    setPerspective(projectionMatrix, fov, aspectRatio, near, far) {
        mat4.perspective(projectionMatrix, 
            fov, 
            aspectRatio, 
            near,
            far
        );
    }

    /**
     * Sets up orthographic projection matrix
     * @param {mat4} projectionMatrix 
     * @param {number} left left bound of orthographic projection
     * @param {number} right right bound of orthographic projection
     * @param {number} bottom bottom bound of orthographic projection
     * @param {number} top top bound of orthographic projection
     * @param {number} near near bound of orthographic projection
     * @param {number} far far bound of orthographic projection
     */
    setOrthogonal(projectionMatrix, left, right, bottom, top, near, far) {
        mat4.ortho(projectionMatrix,
            left,
            right,
            bottom,
            top,
            near,
            far
        );
    }

}
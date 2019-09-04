//import '../gl-setup/gl-matrix.js';
import { degToRad } from '../utils/utils.js';


const {mat4} = glMatrix; // object destructuring to get mat4
// default camera position and reference attributes
const CAM_DISTANCE = 30;
const CAM_X = 4, CAM_Y = 5, CAM_Z = 7;
const REF_X = 0, REF_Y = 0, REF_Z = 0;
const UP_X = 0, UP_Y = 1, UP_Z = 0;
const H_ANGLE = 90; // horizontal angle
const V_ANGLE = 45; // vertical angle
const RATE = 1;     // camera orbiting rate

/**
 * Creates Camera object
 * Updates view and projection matrices appropriately
 */


export class Camera {

    constructor() {
        // Camera position
        this.position = [CAM_X, CAM_Y, CAM_Z];
        this.reference = [REF_X, REF_Y, REF_Z];
        this.upVector = [UP_X, UP_Y, UP_Z];
        this.distance = CAM_DISTANCE;
        this.hAngle = H_ANGLE;
        this.vAngle = V_ANGLE;
        this.rate = RATE;

        // Camera transformation matrices
        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        
    }
    
    /**
     * Updates camera position
     * @param {mat4} viewMatrix 
     * @param {array} position 
     */
    updatePosition(newPosition) {
        this.position = newPosition;
        mat4.lookAt(this.viewMatrix, this.position, this.reference, this.upVector);
    }

    /**
     * Updates camera reference point
     * @param {mat4} viewMatrix 
     * @param {array} newReference 
     */
    updateReference(newReference) {
        this.reference = newReference;
        mat4.lookAt(this.viewMatrix, this.position, this.reference, this.upVector);
    }

    /**
     * Updates camera up vector
     * @param {mat4} viewMatrix 
     * @param {array} newUpVector 
     */
    updateUpVector(newUpVector) {
        this.upVector = newUpVector;
        mat4.lookAt(this.viewMatrix, this.position, this.reference, this.upVector);
    }

    /**
     * Pan/move camera around a given scene (update position and reference)
     * @param {Number} x Pan magnitude in x axis
     * @param {Number} z Pan magnitude in z axis
     */
    panCamera(x, z) {
        var newPosition = this.position;
        var newReference = this.reference;

        newPosition[0] -= Math.sin(degToRad(this.hAngle)) !== 0
            ? Math.sin(degToRad(this.hAngle)) * x 
            : x;
        newPosition[2] -= Math.cos(degToRad(this.hAngle)) !== 0
            ? Math.cos(degToRad(this.hAngle)) * z
            : z;
        
        newReference[0] -= Math.sin(degToRad(this.hAngle)) !== 0 
            ? Math.sin(degToRad(this.hAngle)) * x 
            : x;
        newReference[2] -= Math.cos(degToRad(this.hAngle)) !== 0 
            ? Math.cos(degToRad(this.hAngle)) * z 
            : z;

        this.updatePosition(newPosition);
        this.updateReference(newReference);
    }

    /**
     * Sets up perspective projection matrix
     * @param {mat4} projectionMatrix
     * @param {number} fov Vertical field of view 
     * @param {number} aspectRatio 
     * @param {number} near Near plane position
     * @param {number} far Far plane position
     */
    setPerspective(fov, aspectRatio, near, far) {
        mat4.perspective(this.projectionMatrix, 
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
    setOrthogonal(left, right, bottom, top, near, far) {
        mat4.ortho(this.projectionMatrix,
            left,
            right,
            bottom,
            top,
            near,
            far
        );
    }

    /**
     * Sets camera's default view matrix
     */
    setView() {

        const cameraX = CAM_DISTANCE * Math.cos(degToRad(V_ANGLE)) * Math.cos(degToRad(H_ANGLE));
        const cameraY = CAM_DISTANCE * Math.sin(degToRad(V_ANGLE));
        const cameraZ = CAM_DISTANCE * Math.cos(degToRad(V_ANGLE)) * Math.sin(degToRad(H_ANGLE));

        this.updatePosition([cameraX, cameraY, cameraZ]);
    }

    /**
     * Updates camera viewing attributes and matrix
     * @param {Number} vAngle vertical angle in degrees
     * @param {Number} hAngle horizontal angle in degrees
     * @param {Number} camDistance length of viewing vector
     */
    updateView(vAngle, hAngle, camDistance) {

        this.distance = camDistance;
        this.hAngle = hAngle;
        this.vAngle = vAngle;
        var ref = this.reference;
        var cameraX = ref[0] + camDistance * Math.cos(degToRad(vAngle)) * Math.cos(degToRad(hAngle));
        var cameraY = ref[1] + camDistance * Math.sin(degToRad(vAngle));
        var cameraZ = ref[2] + camDistance * Math.cos(degToRad(vAngle)) * Math.sin(degToRad(hAngle));

        this.updatePosition([cameraX, cameraY, cameraZ]);
    }

}
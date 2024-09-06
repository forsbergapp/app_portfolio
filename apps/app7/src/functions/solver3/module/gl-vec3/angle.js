/**
 * @module apps/app7/src/functions/solver3/module/gl-vec3
 */

module.exports = angle;

const fromValues = require('./fromValues');
const normalize = require('./normalize');
const dot = require('./dot');

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
function angle(a, b) {
    const tempA = fromValues(a[0], a[1], a[2]);
    const tempB = fromValues(b[0], b[1], b[2]);
 
    normalize(tempA, tempA);
    normalize(tempB, tempB);
 
    const cosine = dot(tempA, tempB);

    if(cosine > 1.0){
        return 0;
    } else {
        return Math.acos(cosine);
    }     
}

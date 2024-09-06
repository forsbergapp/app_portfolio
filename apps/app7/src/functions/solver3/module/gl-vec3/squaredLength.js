/**
 * @module apps/app7/src/functions/solver3/module/gl-vec3
 */

module.exports = squaredLength;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
    const x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
}
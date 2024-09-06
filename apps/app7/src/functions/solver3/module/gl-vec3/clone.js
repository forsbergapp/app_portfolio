/**
 * @module apps/app7/src/functions/solver3/module/gl-vec3
 */

module.exports = clone;

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
function clone(a) {
    const out = new Float32Array(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
}
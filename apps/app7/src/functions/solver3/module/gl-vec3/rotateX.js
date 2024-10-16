/**
 * @module apps/app7/src/functions/solver3/module/gl-vec3
 */

module.exports = rotateX;

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateX(out, a, b, c){
    const by = b[1];
    const bz = b[2];

    // Translate point to the origin
    const py = a[1] - by;
    const pz = a[2] - bz;

    const sc = Math.sin(c);
    const cc = Math.cos(c);

    // perform rotation and translate to correct position
    out[0] = a[0];
    out[1] = by + py * cc - pz * sc;
    out[2] = bz + py * sc + pz * cc;

    return out;
}

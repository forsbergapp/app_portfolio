/**
 * @module apps/app7/src/functions/solver3/module/gl-vec3
 */

module.exports = rotateZ;

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateZ(out, a, b, c){
    const bx = b[0];
    const by = b[1];

    //Translate point to the origin
    const px = a[0] - bx;
    const py = a[1] - by;
  
    const sc = Math.sin(c);
    const cc = Math.cos(c);

    // perform rotation and translate to correct position
    out[0] = bx + px * cc - py * sc;
    out[1] = by + px * sc + py * cc;
    out[2] = a[2];
  
    return out;
}

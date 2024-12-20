/**
 * @module apps/app7/src/functions/solver3/module/gl-vec3
 */

module.exports = rotateY;

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateY(out, a, b, c){
    const bx = b[0];
    const bz = b[2];

    // translate point to the origin
    const px = a[0] - bx;
    const pz = a[2] - bz;
    
    const sc = Math.sin(c);
    const cc = Math.cos(c);
  
    // perform rotation and translate to correct position
    out[0] = bx + pz * sc + px * cc;
    out[1] = a[1];
    out[2] = bz + pz * cc - px * sc;
  
    return out;
}

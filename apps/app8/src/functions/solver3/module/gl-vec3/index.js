/**
 * Changed from original https://github.com/stackgl/gl-vec3:
 * Merged all files into one
 * Replaced function declarations with function expression syntax
 * Added types
 * Replaced CommonJS to module syntax
 * @module apps/app8/src/functions/solver3/module/gl-vec3/index
 */

/**
 * @name EPSILON
 * @description EPSILON
 * @constant
 */
const EPSILON = 0.000001;

/**
 * @name add
 * @description Adds two vec3's
 * @function
 * @param {*} out the receiving vector
 * @param {*} a the first operand
 * @param {*} b the second operand
 * @returns {*} out
 */
const add = (out, a, b) => {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};
/**
 * @name angle
 * @description Get the angle between two 3D vectors
 * @function
 * @param {*} a The first operand
 * @param {*} b The second operand
 * @returns {number} The angle in radians
 */
const angle = (a, b) => {
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
};
/**
 * @name ceil
 * @description Math.ceil the components of a vec3
 * @function
 * @param {*} out the receiving vector
 * @param {*} a vector to ceil
 * @returns {*} out
 */
const ceil = (out, a) => {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
};
  
/**
 * @name clone
 * @description Creates a new vec3 initialized with values from an existing vector
 * @function
 * @param {*} a vector to clone
 * @returns {*} a new 3D vector
 */
const clone = a => {
    const out = new Float32Array(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};
/**
 * @name create
 * @description Creates a new, empty vec3
 * @function
 * @returns {*} a new 3D vector
 */
const create = () => {
    const out = new Float32Array(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};
/**
 * @name cross
 * @description Computes the cross product of two vec3's
 * @function
 * @param {*} out the receiving vector
 * @param {*} a the first operand
 * @param {*} b the second operand
 * @returns {*} out
 */
const cross = (out, a, b) =>{
    const ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};
/**
 * @name distance
 * @description Calculates the euclidian distance between two vec3's
 * @function
 * @param {*} a the first operand
 * @param {*} b the second operand
 * @returns {Number} distance between a and b
 */
const distance = (a, b) => {
    const x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};
/**
 * @name divide
 * @description Divides two vec3's
 * @function
 * @param {*} out the receiving vector
 * @param {*} a the first operand
 * @param {*} b the second operand
 * @returns {*} out
 */
const divide = (out, a, b) => {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};
/**
 * @name dot
 * @description Calculates the dot product of two vec3's
 * @function
 * @param {*} a the first operand
 * @param {*} b the second operand
 * @returns {Number} dot product of a and b
 */
const dot = (a, b) =>{
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};
/**
 * @name equals
 * @description Returns whether or not the vectors have approximately the same elements in the same position.
 * @function
 * @param {*} a The first vector.
 * @param {*} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
const equals = (a, b) => {
    const a0 = a[0];
    const a1 = a[1];
    const a2 = a[2];
    const b0 = b[0];
    const b1 = b[1];
    const b2 = b[2];
    return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)));
  };
/**
 * @name exactEquals
 * @description Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 * @function
 * @param {*} a The first vector.
 * @param {*} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
const exactEquals = (a, b) =>{
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  };
  
/**
 * @name floor
 * @description Math.floor the components of a vec3
 * @function
 * @param {*} out the receiving vector
 * @param {*} a vector to floor
 * @returns {*} out
 */
const floor = (out, a) =>{
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
  };
/**
 * @name forEach
 * @description Perform some operation over an array of vec3s. (not used contains vec is not defined error)
 * @function
 * @param {[]} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {[]} a
 */
const forEach = (a, stride, offset, count, fn, arg) => {
    let i, l;
    if(!stride) {
        stride = 3;
    }

    if(!offset) {
        offset = 0;
    }
    
    if(count) {
        l = Math.min((count * stride) + offset, a.length);
    } else {
        l = a.length;
    }

    for(i = offset; i < l; i += stride) {
        vec[0] = a[i]; 
        vec[1] = a[i+1]; 
        vec[2] = a[i+2];
        fn(vec, vec, arg);
        a[i] = vec[0]; 
        a[i+1] = vec[1]; 
        a[i+2] = vec[2];
    }
    
    return a;
};
/**
 * @name fromValues
 * @description Creates a new vec3 initialized with the given values
 * @function
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {*} a new 3D vector
 */
const fromValues = (x, y, z) => {
    const out = new Float32Array(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};
/**
 * @name inverse
 * @description Returns the inverse of the components of a vec3
 * @function
 * @param {*} out the receiving vector
 * @param {*} a vector to invert
 * @returns {*} out
 */
const inverse = (out, a) => {
    out[0] = 1.0 / a[0];
    out[1] = 1.0 / a[1];
    out[2] = 1.0 / a[2];
    return out;
};
/**
 * @name length
 * @description Calculates the length of a vec3
 * @function
 * @param {*} a vector to calculate length of
 * @returns {Number} length of a
 */
const length = a => {
    const x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};
/**
 * @name lerp
 * @description Performs a linear interpolation between two vec3's
 * @function
 * @param {*} out the receiving vector
 * @param {*} a the first operand
 * @param {*} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {*} out
 */
const lerp = (out, a, b, t) => {
    const ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};
/**
 * @name max
 * @description Returns the maximum of two vec3's
 * @function
 * @param {*} out the receiving vector
 * @param {*} a the first operand
 * @param {*} b the second operand
 * @returns {*} out
 */
const max = (out, a, b) => {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};
/**
 * @name min
 * @description Returns the minimum of two vec3's
 * @function
 * @param {*} out the receiving vector
 * @param {*} a the first operand
 * @param {*} b the second operand
 * @returns {*} out
 */
const min = (out, a, b) => {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};
/**
 * @name multiply
 * @description Multiplies two vec3's
 * @function
 * @param {*} out the receiving vector
 * @param {*} a the first operand
 * @param {*} b the second operand
 * @returns {*} out
 */
const multiply = (out, a, b) => {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};
/**
 * @name negate
 * @description Negates the components of a vec3
 * @function
 * @param {*} out the receiving vector
 * @param {*} a vector to negate
 * @returns {*} out
 */
const negate = (out, a) => {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};
/**
 * @name normalize
 * @description Normalize a vec3
 * @param {*} out the receiving vector
 * @param {*} a vector to normalize
 * @returns {*} out
 */
const normalize = (out, a) => {
    const x = a[0],
        y = a[1],
        z = a[2];
    let len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};
/**
 * @name random
 * @description Generates a random vector with the given scale
 * @function
 * @param {*} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {*} out
 */
const random = (out, scale) =>{
    scale = scale || 1.0;

    const r = Math.random() * 2.0 * Math.PI;
    const z = (Math.random() * 2.0) - 1.0;
    const zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};
/**
 * @name rotateX
 * @description Rotate a 3D vector around the x-axis
 * @function
 * @param {*} out The receiving vec3
 * @param {*} a The vec3 point to rotate
 * @param {*} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {*} out
 */
const rotateX = (out, a, b, c) =>{
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
};
/**
 * @name rotateY
 * @description Rotate a 3D vector around the y-axis
 * @function
 * @param {*} out The receiving vec3
 * @param {*} a The vec3 point to rotate
 * @param {*} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {*} out
 */
const rotateY = (out, a, b, c) =>{
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
};
/**
 * @name rotateZ
 * @description Rotate a 3D vector around the z-axis
 * @function
 * @param {*} out The receiving vec3
 * @param {*} a The vec3 point to rotate
 * @param {*} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {*} out
 */
const rotateZ = (out, a, b, c) =>{
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
};
/**
 * @name round
 * @description Math.round the components of a vec3
 * @function
 * @param {*} out the receiving vector
 * @param {*} a vector to round
 * @returns {*} out
 */
const round = (out, a) => {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    return out;
};
/**
 * @name scale
 * @description Scales a vec3 by a scalar number
 * @function
 * @param {*} out the receiving vector
 * @param {*} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {*} out
 */
const scale = (out, a, b) => {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};  
/**
 * @name scaleAndAdd
 * @description Adds two vec3's after scaling the second operand by a scalar value
 * @function
 * @param {*} out the receiving vector
 * @param {*} a the first operand
 * @param {*} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {*} out
 */
const scaleAndAdd = (out, a, b, scale) => {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};
/**
 * @name set
 * @description Set the components of a vec3 to the given values
 * @function
 * @param {*} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {*} out
 */
const set = (out, x, y, z) => {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};
/**
 * @name squaredDistance
 * @description Calculates the squared euclidian distance between two vec3's
 * @function
 * @param {*} a the first operand
 * @param {*} b the second operand
 * @returns {Number} squared distance between a and b
 */
const squaredDistance = (a, b) => {
    const x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};
/**
 * @name squaredLength
 * @description Calculates the squared length of a vec3
 * @function
 * @param {*} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
const squaredLength = a => {
    const x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};
/**
 * @name subtract
 * @description Subtracts vector b from vector a
 * @function
 * @param {*} out the receiving vector
 * @param {*} a the first operand
 * @param {*} b the second operand
 * @returns {*} out
 */
const subtract = (out, a, b) => {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};
/**
 * @name transformMat3
 * @description Transforms the vec3 with a mat3.
 * @function
 * @param {*} out the receiving vector
 * @param {*} a the vector to transform
 * @param {*} m the 3x3 matrix to transform with
 * @returns {*} out
 */
const transformMat3 = (out, a, m) => {
    const x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};
/**
 * @name transformMat4
 * @description Transforms the vec3 with a mat4.
 *              4th vector component is implicitly '1'
 * @function
 * @param {*} out the receiving vector
 * @param {*} a the vector to transform
 * @param {*} m matrix to transform with
 * @returns {*} out
 */
const transformMat4 = (out, a, m) =>{
    const x = a[0], y = a[1], z = a[2];
    let w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
};
/**
 * @name transformQuat
 * @description Transforms the vec3 with a quat
 * @function
 * @param {*} out the receiving vector
 * @param {*} a the vector to transform
 * @param {*} q quaternion to transform with
 * @returns {*} out
 */
const transformQuat = (out, a, q) => {

    const x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};
export {EPSILON, add, angle, ceil, clone, create, cross, distance, divide, dot, equals, exactEquals, floor, forEach, fromValues, inverse, length, lerp, max, min, multiply,
            negate, normalize, random, rotateX, rotateY, rotateZ, round, scale, scaleAndAdd, set, squaredDistance, squaredLength, subtract, 
            transformMat3, transformMat4, transformQuat
};

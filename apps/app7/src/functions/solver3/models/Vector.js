/**
 * @module apps/app7/src/functions/solver3/models/vector
 */

/**@type{import('../module/gl-vec3/index.js')} */
const {angle, cross, rotateX, rotateY, rotateZ} = await import('../module/gl-vec3/index.js');

const rotate = {
	x: rotateX,
	y: rotateY,
	z: rotateZ
};

/**
 * @name Vector
 * @description Vector
 * @class
 */
class Vector {
	/**
	 * @name FromString
	 * @description Factory method.
	 * @param {string} vector - Space-deliminated x, y, and z values.
	 * @method
	 * @returns {Vector}
	 */
	static FromString(vector) {
		/**@ts-ignore */
		return new Vector(vector.split(' ').map(value => parseInt(value)));
	}

	/**
	 * @name areEqual
	 * @description areEqual
	 * @method
	 * @param {[]} vector1 - Vector 1.
	 * @param {[]} vector2 - Vector 2.
	 * @returns {boolean}
	 */
	static areEqual(vector1, vector2) {
		/**@ts-ignore */
		return vector1[0] === vector2[0] && vector1[1] === vector2[1] && vector1[2] === vector2[2];
	}

	/**
	 * @name getAngle
	 * @description Helper method. gl-vec3's angle function always returns positive but in many
	 * 				cases we want the angle in the direction from one vector to another. To get
	 * 				the sign of the angle, cross the two vectors and determine the direction the
	 * 				crossed vector, um, directs in. For example, the vector [0, -1, 0] would
	 * 				shoot negatively along the y-axis.
	 * @method
	 * @param {[]} v1 - Vector 1.
	 * @param {[]} v2 - Vector 2.
	 * @returns {number}
	 */
	static getAngle(v1, v2) {
		const _angle = angle(v1, v2);
		const crossVector = cross([], v1, v2);
		const sign = new Vector(crossVector).getMagnitude();

		return sign ? _angle * sign : _angle;
	}

	/**
	 * @name getRotationFromNormals
	 * @descriotion Finds the rotation axis and angle to get from one normal to another.
	 * @method
	 * @param {[]} normal1 - The from normal.
	 * @param {[]} normal2 - The to normal.
	 * @returns {{axis:*, angle:*}} - Stores the rotation axis and angle
	 */
	static getRotationFromNormals(normal1, normal2) {
		let axis = new Vector(cross([], normal1, normal2)).getAxis();
		const angle = Vector.getAngle(normal1, normal2);

		// when normal1 is equal to or opposite from normal2, it means 2 things: 1)
		// the cross axis is undefined and 2) the angle is either 0 or PI. This
		// means that rotating around the axis parallel to normal1 will not result
		// in any change, while rotating around either of the other two will work
		// properly.
		if (!axis) {
			const axes = ['x', 'y', 'z'];
			axes.splice(axes.indexOf(new Vector(normal1).getAxis()), 1);
			axis = axes[0];
		}

		return { axis, angle };
	}

	/**
	 * @name reverseRotation
	 * @description reverseRotation
	 * @method
	 * @param {{axis:*, angle:*}} rotation - The rotation to reverse.
	 * @returns {{axis:*, angle:*}}
	 */
	static reverseRotation(rotation) {
		rotation.angle *= -1;
		return rotation;
	}

	/**
	 * @param {[]} [vector] - Contains x, y, and z values.
	 */
	constructor(vector) {
		/**@ts-ignore */
		this.set(vector);
	}

	/**
	 * @name toArray
	 * @description toArray
	 * @method
	 * @returns {*}
	 */
	toArray() {
		return this.vector;
	}

	/**
	 * @name set
	 * @description set
	 * @method
	 * @param {[]} vector - The new vector to store.
	 * @returns {*}
	 */
	set(vector) {
		if (typeof vector === 'undefined') {
			return;
		}

		this.vector = vector.map(value => Math.round(value));
	}

	/**
	 * @name setX
	 * @description setX
	 * @method
	 * @param {number} value - The value to store.
	 * @returns {*}
	 */
	setX(value) {
		/**@ts-ignore */
		this.vector[0] = value;
	}

	/**
	 * @name setY
	 * @description setY
	 * @method
	 * @param {number} value - The value to store.
	 * @returns {*}
	 */
	setY(value) {
		/**@ts-ignore */
		this.vector[1] = value;
	}

	/**
	 * @name setZ
	 * @description setZ
	 * @method
	 * @param {number} value - The value to store.
	 * @returns {*}
	 */
	setZ(value) {
		/**@ts-ignore */
		this.vector[2] = value;
	}

	/**
	 * @name getX
	 * @description getX
	 * @method
	 * @returns {number}
	 */
	getX() {
		return this.toArray()[0];
	}

	/**
	 * @name getY
	 * @description getY
	 * @method
	 * @returns {number}
	 */
	getY() {
		return this.toArray()[1];
	}

	/**
	 * @name getZ
	 * @description getZ
	 * @returns {number}
	 */
	getZ() {
		return this.toArray()[2];
	}

	/**
	 * @name isAxis
	 * @description Kind of a flimsy method. If this vector points parallel to an axis, this
	 * 				returns true. A hacky way to find this is to count the number of 0's and
	 * 				return true if and only if the count is 2.
	 * @returns {boolean}
	 */
	isAxis() {
		let count = 0;
		/**@ts-ignore */
		for (const value of this.vector) {
			if (value === 0) {
				count += 1;
			}
		}

		return count === 2;
	}

	/**
	 * @name getAxis
	 * @description Kind of a flimsy method. If this vector points parallel to an axis, return
	 * 				that axis.
	 * @method
	 * @returns {*}
	 */
	getAxis() {
		if (!this.isAxis()) {
			return;
		}
		/**@ts-ignore */
		if (this.vector[0] !== 0) return 'x';
		/**@ts-ignore */
		if (this.vector[1] !== 0) return 'y';
		/**@ts-ignore */
		if (this.vector[2] !== 0) return 'z';
	}

	/**
	 * @name getMagnitude
	 * @description Kind of a flimsy method. If this vector points parallel to an axis, return
	 * 				the magnitude of the value along that axis. (Basically, return whether it
	 * 				is positive or negative.)
	 * @method
	 * @returns {*}
	 */
	getMagnitude() {
		if (!this.isAxis()) {
			return;
		}
		/**@ts-ignore */
		return this[`get${this.getAxis().toUpperCase()}`]();
	}

	/**
	 * @name rotate
	 * @description rotate
	 * @method
	 * @param {string} axis - The axis to rotate around.
	 * @param {number} angle - The angle of rotation.
	 * @returns {Vector}
	 */
	rotate(axis, angle) {
		axis = axis.toLowerCase();
		/**@ts-ignore */
		this.set(rotate[axis]([], this.vector, [0, 0, 0], angle));
		return this;
	}
}

export { Vector };

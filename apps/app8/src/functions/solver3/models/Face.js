/**
 * @module apps/app8/src/functions/solver3/models/face
 */

import { Vector } from './Vector.js';

const faceToNormal = {
	front: '0 0 1',
	right: '1 0 0',
	up: '0 1 0',
	down: '0 -1 0',
	left: '-1 0 0',
	back: '0 0 -1'
};
/**
 * @name
 * @description
 * @class
 */
class Face {
	/**
	 * @name FromNormal
	 * @description Factory method.
	 * @method
	 * @param {string|[]} normal - The normal that identifies this face.
	 * @returns {Face}
	 */
	static FromNormal(normal) {
		if (typeof normal === 'string') {
			normal = Vector.FromString(normal).toArray();
		}

		return new Face(Face.getFace(normal));
	}

	/**
	 * @name getNormal
	 * @description getNormal
	 * @method
	 * @param {string} face - A string that identifies a face.
	 * @returns {[]}
	 */
	static getNormal(face) {
		/**@ts-ignore */
		return Vector.FromString(faceToNormal[face]).toArray();
	}

	/**
	 * @name geFace
	 * @description getFace
	 * @method
	 * @param {string|[]} normal - The normal that identifies a face.
	 * @returns {*}
	 */
	static getFace(normal) {
		if (typeof normal === 'string') {
			normal = Vector.FromString(normal).toArray();
		}

		for (const face of Object.keys(faceToNormal)) {
			/**@ts-ignore */
			if (normal.join(' ') === faceToNormal[face]) {
				return face;
			}
		}
	}

	/**
	 * @param {string} face - The string of a face, e.g. 'RIGHT'.
	 */
	constructor(face) {
		if (typeof face !== 'string') {
			throw new Error(`"face" must be a string (received: ${face})`);
		}

		face = face.toLowerCase();
		/**@ts-ignore */
		this.vector = Vector.FromString(faceToNormal[face]);
	}

	/**
	 * @name normal
	 * @description Method to return the normal as an array.
	 * @method
	 * @returns {[]}
	 */
	normal() {
		return this.vector.toArray();
	}

	/**
	 * @name toString
	 * @description toString
	 * @method
	 * @returns {string}
	 */
	toString() {
		return Face.getFace(this.normal());
	}

	/**
	 * @name orientTo
	 * @description Simulates an orientation change where this face becomes the new given face.
	 * 				NOTE: this only changes this face's normals, not any cubies' positions.
	 * @method
	 * @param {string|Face} newFace - The new face, e.g. 'FRONT'
	 * @returns {*}
	 */
	orientTo(newFace) {
		if (typeof newFace === 'string') {
			newFace = new Face(newFace);
		}

		const { axis, angle } = Vector.getRotationFromNormals(this.normal(), newFace.normal());
		this.vector.rotate(axis, angle);
		return this;
	}

	/**
	 * @name rotate
	 * @description Convenience method for rotating this face. NOTE: this only changes this
	 * 				face's normals, not any cubies' positions.
	 * @method
	 * @param {string} axis - Axis of rotation.
	 * @param {number} angle - Angle of rotation.
	 * @returns {Face}
	 */
	rotate(axis, angle) {
		this.vector.rotate(axis, angle);
		return this;
	}
}

Face.FRONT = new Face('FRONT');
Face.RIGHT = new Face('RIGHT');
Face.UP = new Face('UP');
Face.DOWN = new Face('DOWN');
Face.LEFT = new Face('LEFT');
Face.BACK = new Face('BACK');

export { Face };

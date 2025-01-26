/**
 * @module apps/app7/src/functions/solver3/models/cube
 */

import { Vector } from './Vector.js';
import { Face } from './Face.js';

/**
 * @name Cubie
 * @description Cubie
 * @class
 */
class Cubie {
	/**
	 * @name FromFaces
	 * @descriotion Factory method. Returns an instance of a cubie identified by the faces it
	 * 				sits on.
	 * @method
	 * @param {[]} faces - A list of all the faces this cubie sits on.
	 * @returns {*}
	 */
	static FromFaces(faces) {
		/**@ts-ignore */
		const position = new Vector([0, 0, 0]);
		const colorMap = {};

		for (const face of faces) {
			if (!face) {
				continue;
			}

			const temp = new Face(face);
			const axis = temp.vector.getAxis().toUpperCase();
			/**@ts-ignore */
			position[`set${axis}`](temp.vector.getMagnitude());
			/**@ts-ignore */
			colorMap[face.toLowerCase()] = temp.toString()[0].toLowerCase();
		}

		return new Cubie({ position: position.toArray(), colorMap });
	}

	/**
	 * @description
	 * @method
	 * @param {object} options
	 * @param {object} options.position - The cubie's position.
	 * @param {object} options.colorMap - A map with faces as keys and colors
	 * 										as values. For example: { 'front' : 'f' }.
	 */
	constructor({ position, colorMap = {} }) {
		/**@ts-ignore */
		this.position(position);
		this.colorMap = {};

		Object.keys(colorMap).forEach(face => {
			/**@ts-ignore */
			const color = colorMap[face];
			this.colorFace(face, color);
		});
	}

	/**
	 * @name clone
	 * @description clone
	 * @method
	 * @returns {Cubie}
	 */
	clone() {
		return new Cubie({
			position: this.position(),
			colorMap: this.colorMap
		});
	}

	/**
	 * @name position
	 * @description Getter/setter for the vector position.
	 * @param {[]} [position] - The new position to store.
	 * @returns {*}
	 */
	position(position) {
		if (typeof position === 'undefined') {
			return this.vector ? this.vector.toArray() : this.vector;
		}

		this.vector = new Vector(position);
	}

	/**
	 * @name getX
	 * @description  getX
	 * @method
	 * @returns {number}
	 */
	getX() {
		/**@ts-ignore */
		return this.vector.getX();
	}

	/**
	 * @name getY
	 * @description getY
	 * @method
	 * @returns {number}
	 */
	getY() {
		/**@ts-ignore */
		return this.vector.getY();
	}

	/**
	 * @name getZ
	 * @description getZ
	 * @method
	 * @returns {number}
	 */
	getZ() {
		/**@ts-ignore */
		return this.vector.getZ();
	}

	/**
	 * @name isCorner
	 * @description isCorner
	 * @method
	 * @returns {boolean}
	 */
	isCorner() {
		return Object.keys(this.colorMap).length === 3;
	}

	/**
	 * @name isEdge
	 * @description isEdge
	 * @method
	 * @returns {boolean}
	 */
	isEdge() {
		return Object.keys(this.colorMap).length === 2;
	}

	/**
	 * @name isMiddle
	 * @description isMiddle
	 * @method
	 * @returns {boolean}
	 */
	isMiddle() {
		return Object.keys(this.colorMap).length === 1;
	}

	/**
	 * @name colors
	 * @description colors
	 * @method
	 * @returns {[]}
	 */
	colors() {
		/**@ts-ignore */
		return Object.keys(this.colorMap).map(face => this.colorMap[face]);
	}

	/**
	 * @name hasColor
	 * @description hasColor
	 * @method
	 * @param {string} color - Check if the cubie has this color.
	 * @returns {boolean}
	 */
	hasColor(color) {
		color = color.toLowerCase();

		for (const face of Object.keys(this.colorMap)) {
			/**@ts-ignore */
			if (this.colorMap[face] === color) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @name hasFace
	 * @description hasFace
	 * @method
	 * @param {string} face - Check if the cubie has this face.
	 * @returns {boolean}
	 */
	hasFace(face) {
		face = face.toLowerCase();
		return Object.keys(this.colorMap).includes(face);
	}

	/**
	 * @name getY
	 * @description Sets a color on a given face or normal of a cubie.
	 * @method
	 * @param {string} face - The face of the cubie we want to set the color on.
	 * @param {string} color - The color we want to set.
	 * @returns {Cubie}
	 */
	colorFace(face, color) {
		face = face.toLowerCase();
		color = color.toLowerCase();
		/**@ts-ignore */
		this.colorMap[face] = color;
		return this;
	}

	/**
	 * @name getColorOfFace
	 * @description getColorOfFace
	 * @method
	 * @param {string} face - The color on the face this cubie sits on.
	 * @returns {string}
	 */
	getColorOfFace(face) {
		face = face.toLowerCase();
		/**@ts-ignore */
		return this.colorMap[face];
	}

	/**
	 * @name getFaceOfColor
	 * @description getFaceOfColor
	 * @method
	 * @param {string} color - Find the face that this color sits on.
	 * @returns {string}
	 */
	getFaceOfColor(color) {
		color = color.toLowerCase();
		/**@ts-ignore */
		return Object.keys(this.colorMap).find(cubieColor => {
			/**@ts-ignore */
			return this.colorMap[cubieColor] === color;
		});
	}

	/**
	 * @name faces
	 * @description Return all the faces this cubie sits on.
	 * @method
	 * @returns {*}
	 */
	faces() {
		return Object.keys(this.colorMap);
	}

	/**
	 * @name rotate
	 * @description Rotates the position vector around `axis` by `angle`. Updates the internal
	 * 				position vector and the normal-color map.
	 * @method
	 * @param {string} axis - The axis of rotation.
	 * @param {number} angle - The magnitude of rotation.
	 * @returns {void}
	 */
	rotate(axis, angle) {
		// update position vector after rotation
		/**@ts-ignore */
		this.vector.rotate(axis, angle);

		// update normal-color map
		const newMap = {}; // need to completely overwrite the old one

		// go through each normal, rotate it, and assign the new normal the old color
		for (const face of Object.keys(this.colorMap)) {
			/**@ts-ignore */
			const color = this.colorMap[face];
			const faceModel = new Face(face);

			const newNormal = faceModel.rotate(axis, angle).normal().join(' ');
			const newFace = Face.FromNormal(newNormal).toString().toLowerCase();
			/**@ts-ignore */
			newMap[newFace] = color;
		}

		this.colorMap = {};
		/**@ts-ignore */
		Object.keys(newMap).forEach(face => this.colorFace(face, newMap[face]));
	}
}

export { Cubie };
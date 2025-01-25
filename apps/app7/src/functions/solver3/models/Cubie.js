/**
 * @module apps/app7/src/functions/solver3/models/cube
 */

import { Vector } from './Vector.js';
import { Face } from './Face.js';

class Cubie {
	/**
	 * Factory method. Returns an instance of a cubie identified by the faces it
	 * sits on.
	 * @param {array} faces - A list of all the faces this cubie sits on.
	 */
	static FromFaces(faces) {
		const position = new Vector([0, 0, 0]);
		const colorMap = {};

		for (const face of faces) {
			if (!face) {
				continue;
			}

			const temp = new Face(face);
			const axis = temp.vector.getAxis().toUpperCase();
			position[`set${axis}`](temp.vector.getMagnitude());

			colorMap[face.toLowerCase()] = temp.toString()[0].toLowerCase();
		}

		return new Cubie({ position: position.toArray(), colorMap });
	}

	/**
	 * @param {object} [options]
	 * @param {object} options.position - The cubie's position.
	 * @param {object} options.colorMap - A map with faces as keys and colors
	 * as values. For example: { 'front' : 'f' }.
	 */
	constructor({ position, colorMap = {} }) {
		this.position(position);
		this.colorMap = {};

		Object.keys(colorMap).forEach(face => {
			const color = colorMap[face];
			this.colorFace(face, color);
		});
	}

	/**
	 * @returns {Cubie}
	 */
	clone() {
		return new Cubie({
			position: this.position(),
			colorMap: this.colorMap
		});
	}

	/**
	 * Getter/setter for the vector position.
	 * @param {array} [position] - The new position to store.
	 * @returns {array}
	 */
	position(position) {
		if (typeof position === 'undefined') {
			return this.vector ? this.vector.toArray() : this.vector;
		}

		this.vector = new Vector(position);
	}

	/**
	 * @returns {number}
	 */
	getX() {
		return this.vector.getX();
	}

	/**
	 * @returns {number}
	 */
	getY() {
		return this.vector.getY();
	}

	/**
	 * @returns {number}
	 */
	getZ() {
		return this.vector.getZ();
	}

	/**
	 * @returns {boolean}
	 */
	isCorner() {
		return Object.keys(this.colorMap).length === 3;
	}

	/**
	 * @returns {boolean}
	 */
	isEdge() {
		return Object.keys(this.colorMap).length === 2;
	}

	/**
	 * @returns {boolean}
	 */
	isMiddle() {
		return Object.keys(this.colorMap).length === 1;
	}

	/**
	 * @returns {array}
	 */
	colors() {
		return Object.keys(this.colorMap).map(face => this.colorMap[face]);
	}

	/**
	 * @param {string} color - Check if the cubie has this color.
	 * @returns {boolean}
	 */
	hasColor(color) {
		color = color.toLowerCase();

		for (const face of Object.keys(this.colorMap)) {
			if (this.colorMap[face] === color) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @param {string} face - Check if the cubie has this face.
	 * @returns {boolean}
	 */
	hasFace(face) {
		face = face.toLowerCase();
		return Object.keys(this.colorMap).includes(face);
	}

	/**
	 * Sets a color on a given face or normal of a cubie.
	 * @param {string} face - The face of the cubie we want to set the color on.
	 * @param {string} color - The color we want to set.
	 * @returns {Cubie}
	 */
	colorFace(face, color) {
		face = face.toLowerCase();
		color = color.toLowerCase();

		this.colorMap[face] = color;
		return this;
	}

	/**
	 * @param {string} face - The color on the face this cubie sits on.
	 * @returns {string}
	 */
	getColorOfFace(face) {
		face = face.toLowerCase();

		return this.colorMap[face];
	}

	/**
	 * @param {string} color - Find the face that this color sits on.
	 * @returns {string}
	 */
	getFaceOfColor(color) {
		color = color.toLowerCase();

		return Object.keys(this.colorMap).find(cubieColor => {
			return this.colorMap[cubieColor] === color;
		});
	}

	/**
	 * Return all the faces this cubie sits on.
	 * @returns {array}
	 */
	faces() {
		return Object.keys(this.colorMap);
	}

	/**
	 * Rotates the position vector around `axis` by `angle`. Updates the internal
	 * position vector and the normal-color map.
	 * @param {string} axis - The axis of rotation.
	 * @param {number} angle - The magnitude of rotation.
	 * @returns {null}
	 */
	rotate(axis, angle) {
		// update position vector after rotation
		this.vector.rotate(axis, angle);

		// update normal-color map
		const newMap = {}; // need to completely overwrite the old one

		// go through each normal, rotate it, and assign the new normal the old color
		for (const face of Object.keys(this.colorMap)) {
			const color = this.colorMap[face];
			const faceModel = new Face(face);

			const newNormal = faceModel.rotate(axis, angle).normal().join(' ');
			const newFace = Face.FromNormal(newNormal).toString().toLowerCase();

			newMap[newFace] = color;
		}

		this.colorMap = {};
		Object.keys(newMap).forEach(face => this.colorFace(face, newMap[face]));
	}
}

export { Cubie };

/**
 * @module apps/app8/src/functions/solver3/utils
 */

const {cross} = await import('../module/gl-vec3/index.js');

import { Face } from '../models/Face.js';
import { Vector } from '../models/Vector.js';

/**
 * @name _middlesMatchingFace
 * @description maps each face with the notation for their middle moves
 * @constant
 */
const _middlesMatchingFace = {
	f: 's',
	r: 'mprime',
	u: 'eprime',
	d: 'e',
	l: 'm',
	b: 'sprime'
};

/**
 * @name getFaceOfMove
 * @description getFaceOfMove
 * @function
 * @param {string} move - The notation of a move, e.g. rPrime.
 * @returns {string|undefined}
 */
export const getFaceOfMove = move => {
	if (typeof move !== 'string') {
		throw new TypeError('move must be a string');
	}

	const faceLetter = move[0].toLowerCase();

	if (faceLetter === 'f') return 'front';
	if (faceLetter === 'r') return 'right';
	if (faceLetter === 'u') return 'up';
	if (faceLetter === 'd') return 'down';
	if (faceLetter === 'l') return 'left';
	if (faceLetter === 'b') return 'back';
};

/**
 * @name getMoveOfFace
 * @description Checks if string, sets lowercase and checks if 
 * 				from, right, up, down, left or back
 * 				(Original comment: Almost useless. Almost.)
 * @function
 * @param {string} face - The string identifying a face.
 * @returns {string}
 */
export const getMoveOfFace = face => {
	if (typeof face !== 'string') {
		throw new TypeError('face must be a string');
	}

	face = face.toLowerCase();

	if (!['front', 'right', 'up', 'down', 'left', 'back'].includes(face)) {
		throw new Error(`${face} is not valid face`);
	}

	return face[0];
};
/**
 * @name getMiddleMatchingFace
 * @description getMiddleMatchingFace
 * @function
 * @param {*} face
 * @returns {*}
 */
export const getMiddleMatchingFace = face => {
	face = face.toLowerCase()[0];
	/**@ts-ignore */
	return _middlesMatchingFace[face];
};
/**
 * @name getFaceMatchingMiddle
 * @description getFaceMatchingMiddle
 * @function
 * @param {*} middle
 * @returns {*}
 */
export const getFaceMatchingMiddle = middle => {
	middle = middle.toLowerCase();

	for (const face of Object.keys(_middlesMatchingFace)) {
		/**@ts-ignore*/
		const testMiddle = _middlesMatchingFace[face];
		if (middle === testMiddle) {
			return face;
		}
	}
};

/**
 * @name transformNotations
 * @description transformNotations
 * @function
 * @param {string|[]} notations - The move notation.
 * @param {{upperCase?:boolean, 		//Turn all moves to upper case (i.e. no "double" moves).
 * 			orientation?:*,
 * 			reverse?:*}} options - Move options. 
 *
 * @returns {string|[]} -- whichever was initially given.
 */
export const transformNotations = (notations, options = {}) => {
	let normalized = normalizeNotations(notations);

	if (options.upperCase) {
		/**@ts-ignore*/
		normalized = normalized.map(n => n[0].toUpperCase() + n.slice(1));
	}

	if (options.orientation) {
		normalized = orientMoves(normalized, options.orientation);
	}

	if (options.reverse) {
		normalized = _reverseNotations(normalized);
	}

	return typeof notations === 'string' ? normalized.join(' ') : normalized;
};

/**
 * @name normalizeNotations
 * @description normalizeNotations
 * @function
 * @param {[]|string} notations - The notations to noramlize.
 * @returns {[]}
 */
export const normalizeNotations = (notations) => {
	if (typeof notations === 'string') {
		/**@ts-ignore */
		notations = notations.split(' ');
	}
	/**@ts-ignore */
	notations = notations.filter(notation => notation !== '');

	/**@ts-ignore */
	return notations.map(notation => {
		const isPrime = notation.toLowerCase().includes('prime');
		const isDouble = notation.includes('2');

		notation = notation[0];

		if (isDouble) notation = notation[0] + '2';
		else if (isPrime) notation = notation + 'prime';

		return notation;
	});
};

/**
 * @name getDirectionFromFaces
 * @description Finds the direction from an origin face to a target face. The origin face
 * 				will be oriented so that it becomes FRONT. An orientation object must be
 * 				provided that specifies any of these faces (exclusively): TOP, RIGHT, DOWN,
 * 				LEFT.
 * 				If FRONT or BACK is provided along with one of those faces, it will be
 * 				ignored. If FRONT or BACK is the only face provided, the orientation is
 * 				ambiguous and an error will be thrown.
 * @example		getDirectionFromFaces('back', 'up', { down: 'right' })
 * 				Step 1) orient the BACK face so that it becomes FRONT.
 * 				Step 2) orient the DOWN face so that it becomes RIGHT.
 * 				Step 3) Find the direction from BACK (now FRONT) to UP (now LEFT).
 * 				Step 4) Returns 'left'.
 * @function
 * @param {string} origin - The origin face.
 * @param {string} target - The target face.
 * @param {object} orientation - The object that specifies the cube orientation.
 * @returns {string|undefined}
 */
export const getDirectionFromFaces = (origin, target, orientation) => {
	orientation = _toLowerCase(orientation);
	orientation = _prepOrientationForDirection(orientation, origin);

	const fromFace = new Face(origin);
	const toFace = new Face(target);

	const rotations = _getRotationsForOrientation(orientation);
	/**@ts-ignore*/
	_rotateFacesByRotations([fromFace, toFace], rotations);

	const axis = new Vector(cross([], fromFace.normal(), toFace.normal())).getAxis();
	const direction = Vector.getAngle(fromFace.normal(), toFace.normal());

	if (axis === 'x' && direction > 0) return 'down';
	if (axis === 'x' && direction < 0) return 'up';
	if (axis === 'y' && direction > 0) return 'right';
	if (axis === 'y' && direction < 0) return 'left';

	if (direction === 0) {
		return 'front';
	} else if (direction === Math.PI) {
		return 'back';
	}
};

/**
 * @name getFaceFromDirection
 * @description See `getDirectionFromFaces`. Almost identical, but instead of finding a
 * 				direction from an origin face and target face, this finds a target face from
 * 				an origin face and direction.
 * @function
 * @param {string} origin - The origin face.
 * @param {string} direction - The direction.
 * @param {object} orientation - The orientation object.
 * @returns {string}
 */
export const getFaceFromDirection = (origin, direction, orientation) => {
	orientation = _toLowerCase(orientation);
	orientation = _prepOrientationForDirection(orientation, origin);

	const fromFace = new Face(origin);

	const rotations = _getRotationsForOrientation(orientation);
	/**@ts-ignore*/
	_rotateFacesByRotations([fromFace], rotations);

	const directionFace = new Face(direction);
	const { axis, angle } = Vector.getRotationFromNormals(fromFace.normal(), directionFace.normal());
	fromFace.rotate(axis, angle);

	// at this point fromFace is now the target face, but we still need to revert
	// the orientation to return the correct string
	const reversedRotations = rotations.map((/**@type{*}*/rotation) => Vector.reverseRotation(rotation)).reverse();
	/**@ts-ignore*/
	_rotateFacesByRotations([fromFace], reversedRotations);
	return fromFace.toString();
};

/**
 * @name getRotationFromTo
 * @description Finds a move that rotates the given face around its normal, by the angle
 * 				described by normal1 -> normal2.
 * @function
 * @param {string} face - The face to rotate.
 * @param {string} from - The origin face.
 * @param {string} to - The target face.
 * @returns {string|undefined}
 */
export const getRotationFromTo = (face, from, to) => {
	const rotationFace = new Face(face);
	const fromFace = new Face(from);
	const toFace = new Face(to);

	const rotationAxis = rotationFace.vector.getAxis();
	const [fromAxis, toAxis] = [fromFace.vector.getAxis(), toFace.vector.getAxis()];

	if ([fromAxis.toLowerCase(), toAxis.toLowerCase()].includes(rotationAxis.toLowerCase())) {
		throw new Error(`moving ${rotationFace} from ${fromFace} to ${toFace} is not possible.`);
	}

	const move = getMoveOfFace(face).toUpperCase();
	let angle = Vector.getAngle(fromFace.normal(), toFace.normal());
	if (rotationFace.vector.getMagnitude() < 0) {
		angle *= -1;
	}

	if (angle === 0) {
		return '';
	} else if (Math.abs(angle) === Math.PI) {
		return `${move} ${move}`;
	} else if (angle < 0) {
		return `${move}`;
	} else if (angle > 0) {
		return `${move}Prime`;
	}
};

/**
 * @name orientMoves
 * @description Returns an array of transformed notations so that if done when the cube's
 * 				orientation is default (FRONT face is FRONT, RIGHT face is RIGHT, etc.), the
 * 				moves will have the same effect as performing the given notations on a cube
 * 				oriented by the specified orientation.
 * @function
 * @example		orientMoves(['R', 'U'], { front: 'front', up: 'up' })      === ['R', 'U']
 * 				orientMoves(['R', 'U'], { front: 'front', down: 'right' }) === ['U', 'L']
 * 				orientMoves(['R', 'U', 'LPrime', 'D'], { up: 'back', right: 'down' }) === ['D', 'B', 'UPrime', 'F']
 * @function
 * @param {[]} notations - An array of notation strings.
 * @param {object} orientation - The orientation object.
 * @returns {*}
 */
export const orientMoves = (notations, orientation) => {
	orientation = _toLowerCase(orientation);
	const rotations = _getRotationsForOrientation(orientation);
	rotations.reverse().map((/**@type{*}*/rotation) => Vector.reverseRotation(rotation));

	return notations.map(notation => {
		/**@ts-ignore */
		const isPrime = notation.toLowerCase().includes('prime');
		/**@ts-ignore */
		const isDouble = notation.includes('2');
		/**@ts-ignore */
		const isWithMiddle = notation[0] === notation[0].toLowerCase();
		/**@ts-ignore */
		const isMiddle = ['m', 'e', 's'].includes(notation[0].toLowerCase());

		if (isDouble) {
			/**@ts-ignore */
			notation = notation.replace('2', '');
		}

		let face;

		if (isMiddle) {
			const faceStr = getFaceOfMove(getFaceMatchingMiddle(notation));
			/**@ts-ignore */
			face = new Face(faceStr);
		} else {
			const faceStr = getFaceOfMove(notation[0]);
			/**@ts-ignore */
			face = new Face(faceStr);
		}
		/**@ts-ignore*/
		_rotateFacesByRotations([face], rotations);

		let newNotation; // this will always be lower case

		if (isMiddle) {
			newNotation = getMiddleMatchingFace(face.toString());
		} else {
			newNotation = face.toString()[0];
		}

		if (!isWithMiddle) newNotation = newNotation.toUpperCase();
		if (isDouble) newNotation = newNotation + '2';
		if (isPrime && !isMiddle) newNotation += 'prime';

		return newNotation;
	});
};

//-----------------
// Helper functions
//-----------------

/**
 * @name _toLowerCase
 * @description Returns an object with all keys and values lowercased. Assumes all keys and
 * 				values are strings.
 * @function
 * @param {object} object - The object to map.
 * @returns {*}
 */
function _toLowerCase(object) {
	const ret = {};
	Object.keys(object).forEach(key => {
		/**@ts-ignore */
		ret[key.toLowerCase()] = object[key].toLowerCase();
	});
	return ret;
}

/**
 * @name _prepOrientationForDirection
 * @description This function is specificly for `getDirectionFromFaces` and
 * 				`getFaceFromDirection`. It removes all keys that are either 'front' or 'back'
 * 				and sets the given front face to orientation.front.
 * @function
 * @param {object} orientation - The orientation object.
 * @param {string} front - The face to set as front.
 * @returns {*}
 */
function _prepOrientationForDirection(orientation, front) {
	const keys = Object.keys(orientation);

	if (keys.length <= 1 && ['front', 'back'].includes(keys[0])) {
		throw new Error(`Orientation object "${orientation}" is ambiguous. Please specify one of these faces: "up", "right", "down", "left"`);
	}

	// remove "front" and "back" from provided orientation object
	const temp = orientation;
	orientation = {};

	keys.forEach(key => {
		if (['front', 'back'].includes(key)) {
			return;
		}
		/**@ts-ignore */
		orientation[key] = temp[key];
	});
	/**@ts-ignore*/
	orientation.front = front.toLowerCase();

	return orientation;
}

/**
 * @name _getRotationsForOrientation
 * @description _getRotationsForOrientation
 * @param {object} orientation - The orientation object.
 * @returns {*}
 */
function _getRotationsForOrientation(orientation) {
	/**@ts-ignore */
	if (Object.keys(orientation) <= 1) {
		throw new Error(`Orientation object "${orientation}" is ambiguous. Please specify 2 faces.`);
	}

	const keys = Object.keys(orientation);
	/**@ts-ignore */
	const origins = keys.map(key => new Face(orientation[key]));
	const targets = keys.map(key => new Face(key));

	// perform the first rotation, and save it
	const rotation1 = Vector.getRotationFromNormals(
		origins[0].normal(),
		origins[0].orientTo(targets[0]).normal()
	);

	// perform the first rotation on the second origin face
	origins[1].rotate(rotation1.axis, rotation1.angle);

	// peform the second rotation, and save it
	const rotation2 = Vector.getRotationFromNormals(
		origins[1].normal(),
		origins[1].orientTo(targets[1]).normal()
	);

	// if the rotation angle is PI, there are 3 possible axes that can perform the
	// rotation. however only one axis will perform the rotation while keeping
	// the first origin face on the target. this axis is the same as the origin
	// face's normal.
	if (Math.abs(rotation2.angle) === Math.PI) {
		const rotation2Axis = new Face(keys[0]).vector.getAxis();
		rotation2.axis = rotation2Axis;
	}

	return [rotation1, rotation2];
}

/**
 * @name _rotateFacesByRotations
 * @description _rotateFacesByRotations
 * @param {[]} faces 		- Array of Face objects to rotate.
 * @param {[]} rotations 	- Array of rotations to apply to faces.
 * @returns {void}
 */
function _rotateFacesByRotations(faces, rotations) {
	for (const face of faces) {
		for (const rotation of rotations) {
			/**@ts-ignore */
			face.rotate(rotation.axis, rotation.angle);
		}
	}
}

/**
 * @name _reverseNotations
 * @description _reverseNotations
 * @param {[]} notations
 * @returns {*}
 */
function _reverseNotations(notations) {
	/**@ts-ignore*/
	const reversed = [];

	for (let notation of notations) {
		/**@ts-ignore*/
		const isPrime = notation.includes('prime');
		/**@ts-ignore*/
		notation = isPrime ? notation[0] : notation[0] + 'prime';
		reversed.push(notation);
	}

	return typeof moves === 'string' ? reversed.join(' ') : reversed;
}

export default {
	getFaceOfMove,
	getMoveOfFace,
	getMiddleMatchingFace,
	getFaceMatchingMiddle,
	transformNotations,
	normalizeNotations,
	getDirectionFromFaces,
	getRotationFromTo,
	getFaceFromDirection,
	orientMoves
};


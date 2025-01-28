/**
 * @module apps/app8/src/functions/solver3/solvers/f2l
 */

import { RubiksCube } from '../../../models/RubiksCube.js';
import { F2LCaseBaseSolver } from './F2LCaseBaseSolver.js';
import {
	getFaceOfMove, getFaceFromDirection, getRotationFromTo, getMoveOfFace,
	getDirectionFromFaces
} from '../../../utils/index.js';

/**
 * @name R
 * @description R
 * @function
 * @param {*} moves
 * @returns {*}
 */
const R = moves => RubiksCube.reverseMoves(moves);

/**
 * @name  Case1Solver
 * @description Top level case 1:
 * 				Both corner and edge are on the DOWN face.
 * @class
 */
class Case1Solver extends F2LCaseBaseSolver {
	/**
	 * 10 Cases:
	 * 1) Pair is matched.
	 * 2) Pair is separated.
	 *
	 * ---- Group 1: Corner's white color is on DOWN face ----
	 * 3) Corner and edge share a face and colors on that face are equal.
	 * 4) Corner and edge share a face and colors on that face are not equal.
	 * 5) Corner and edge do not share a face.
	 *
	 * ---- Group 2: Corner's "other" color matches edge's "primary" color ----
	 * 6) Corner shares a face with edge.
	 * 7) Corner does not share a face with edge.
	 *
	 * ---- Group 3: Corner's "other" color doesn't match edge's "primary" color ----
	 * 8) Edge shares a face with corner's cross color's face.
	 * 9) Edge shares a face with corner's other color's face.
	 * 10) Corner does not share a face with edge.
	 *
	 * TODO: refactor
	 */
	/**
	 * @name _getCaseNumber
	 * @description _getCaseNumber
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_getCaseNumber({ corner, edge }) {
		if (this.isPairMatched({ corner, edge })) {
			return 1;
		}
		if (this.isPairSeparated({ corner, edge })) {
			return 2;
		}

		let sharedFace;
		edge.faces().forEach((/**@type{*}*/face) => {
			if (corner.faces().includes(face) && face !== 'down') {
				sharedFace = face;
			}
		});
		const otherColor = corner.colors().find((/**@type{*}*/color) => {
			return color !== 'u' && color !== corner.getColorOfFace('down');
		});
		const primaryColor = edge.colors().find((/**@type{*}*/c) => edge.getFaceOfColor(c) !== 'down');

		// Group 1
		if (corner.getFaceOfColor('u') === 'down') {
			if (sharedFace) {
				if (corner.getColorOfFace(sharedFace) === edge.getColorOfFace(sharedFace)) {
					return 3;
				} else {
					return 4;
				}
			} else {
				return 5;
			}
		}

		// Group 2
		if (otherColor === primaryColor) {
			if (sharedFace) {
				return 6;
			} else {
				return 7;
			}
		}

		// Group 3
		if (sharedFace) {
			if (sharedFace === corner.getFaceOfColor('u')) {
				return 8;
			} else {
				return 9;
			}
		} else {
			return 10;
		}
	}
	/**
	 * @name _solveCase1
	 * @description _solveCase1
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_solveCase1({ corner, edge }) {
		return this.solveMatchedPair({ corner, edge });
	}
	/**
	 * @name _solveCase2
	 * @description _solveCase2
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_solveCase2({ corner, edge }) {
		return this.solveSeparatedPair({ corner, edge });
	}
	/**
	 * @name _solveCase3
	 * @description _solveCase3
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_solveCase3({ corner, edge }) {
		// calculate which side the corner is on, the position, etc.
		const currentFace = edge.faces().find((/**@type{*}*/face) => face !== 'down');
		const targetFace = getFaceOfMove(edge.getColorOfFace('down'));
		/**@ts-ignore */
		const prepFace = getFaceFromDirection(targetFace, 'back', { up: 'down' });
		const otherFace = corner.getFaceOfColor(edge.getColorOfFace('down'));
		const isLeft = getFaceFromDirection(currentFace, otherFace, { up: 'down' }) === 'left';

		// the moves
		const prep = getRotationFromTo('down', currentFace, prepFace);
		let moveFace = getFaceOfMove(edge.getColorOfFace(currentFace));
		const dir = isLeft ? 'D' : 'DPrime';

		moveFace = isLeft ? moveFace : R(moveFace);

		let solveMoves = `${prep} ${moveFace} ${moveFace} D D `;
		solveMoves += `${moveFace} ${dir} ${R(moveFace)} ${dir} ${moveFace} ${moveFace}`;
		this.move(solveMoves, { upperCase: true });
	}
	/**
	 * @name _solveCase4
	 * @description _solveCase4
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_solveCase4({ corner, edge }) {
		// calculate which side the corner is on, the position, etc.
		const currentFace = edge.faces().find((/**@type{*}*/face) => face !== 'down');
		const targetFace = getFaceOfMove(edge.getColorOfFace(currentFace));
		const otherFace = corner.faces().find((/**@type{*}*/face) => !edge.faces().includes(face));
		const isLeft = getFaceFromDirection(otherFace, currentFace, { up: 'down' }) === 'left';

		// the moves
		/**@ts-ignore*/
		const prep = getRotationFromTo('down', currentFace, targetFace);
		/**@ts-ignore */
		let moveFace = getMoveOfFace(targetFace);
		moveFace = isLeft ? R(moveFace) : moveFace;

		this.move(`${prep} ${moveFace} D D ${R(moveFace)}`, { upperCase: true });
		this.solveSeparatedPair({ corner, edge });
	}
	/**
	 * @name _solveCase5
	 * @description _solveCase5
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_solveCase5({ corner, edge }) {
		const primary = edge.colors().find((/**@type{*}*/color) => edge.getFaceOfColor(color) !== 'down');
		const secondary = edge.colors().find((/**@type{*}*/color) => edge.getFaceOfColor(color) === 'down');

		const isLeft = getFaceFromDirection(
			/**@ts-ignore */
			getFaceOfMove(primary),
			getFaceOfMove(secondary),
			{ up: 'down' }
		) === 'right';

		const edgeCurrent = edge.getFaceOfColor(primary);
		const edgeTarget = getFaceOfMove(primary);

		// do the prep move now. need to calculate things after this move is done
		/**@ts-ignore */
		const edgePrep = getRotationFromTo('down', edgeCurrent, edgeTarget);
		/**@ts-ignore */
		this.move(edgePrep, { upperCase: true });

		// calculate corner stuff
		const cornerCurrent = corner.getFaceOfColor(primary);
		const cornerTarget = edgeTarget;

		// the moves
		/**@ts-ignore */
		const cornerPrep = getRotationFromTo('down', cornerCurrent, cornerTarget);
		const open = isLeft ? R(edgeTarget) : edgeTarget;

		this.move(`${open} ${cornerPrep} ${R(open)}`, { upperCase: true });
		this.solveMatchedPair({ corner, edge });
	}
	/**
	 * @name _solveCase6
	 * @description _solveCase6
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_solveCase6({ corner, edge }) {
		const primary = edge.colors().find((/**@type{*}*/color) => edge.getFaceOfColor(color) !== 'down');

		const currentFace = edge.getFaceOfColor(primary);
		const targetFace = getFaceOfMove(edge.getColorOfFace('down'));
		const isLeft = getDirectionFromFaces(
			currentFace,
			corner.getFaceOfColor(primary),
			{ up: 'down' }
		) === 'left';
		/**@ts-ignore */
		const prep = getRotationFromTo('down', currentFace, targetFace);
		const moveFace = isLeft ? targetFace : R(targetFace);
		const dir = isLeft ? 'DPrime' : 'D';

		this.move(`${prep} ${moveFace} ${dir} ${R(moveFace)}`, { upperCase: true });
		this.solveSeparatedPair({ corner, edge});
	}

	/**
	 * @name _solveCase7
	 * @description _solveCase7
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_solveCase7({ corner, edge }) {
		const primary = edge.colors().find((/**@type{*}*/c) => edge.getFaceOfColor(c) !== 'down');
		const cornerCurrent = corner.getFaceOfColor('u');
		const cornerTarget = getFaceOfMove(primary);
		const isLeft = getDirectionFromFaces(
			corner.getFaceOfColor(primary),
			corner.getFaceOfColor('u'),
			{ up: 'down' }
		) === 'left';
		/**@ts-ignore */
		const cornerPrep = getRotationFromTo('down', cornerCurrent, cornerTarget);
		/**@ts-ignore */
		this.move(cornerPrep, { upperCase: true });

		const edgeCurrent = edge.getFaceOfColor(primary);
		const edgeTarget = corner.getFaceOfColor(primary);

		const open = isLeft ? corner.getFaceOfColor('u') : R(corner.getFaceOfColor('u'));
		const edgeMatch = getRotationFromTo('down', edgeCurrent, edgeTarget);
		this.move(`${open} ${edgeMatch} ${R(open)}`, { upperCase: true });

		this.solveMatchedPair({ corner, edge });
	}
	/**
	 * @name _solveCase8
	 * @description _solveCase8
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_solveCase8({ corner, edge }) {
		const primary = edge.colors().find((/**@type{*}*/c) => edge.getFaceOfColor(c) !== 'down');
		const secondary = edge.colors().find((/**@type{*}*/c) => edge.getFaceOfColor(c) === 'down');

		const currentFace = corner.getFaceOfColor(secondary);
		const targetFace = getFaceOfMove(primary);

		const isLeft = getDirectionFromFaces(
			currentFace,
			corner.getFaceOfColor('u'),
			{ up: 'down' }
		) === 'left';
		/**@ts-ignore */
		const prep = getRotationFromTo('down', currentFace, targetFace);
		const open = isLeft ? R(targetFace) : targetFace;
		const dir = isLeft ? 'D' : 'DPrime';

		this.move(`${prep} ${open} ${dir} ${R(open)}`, { upperCase: true });
		this.solveSeparatedPair({ corner, edge });
	}
	/**
	 * @name _solveCase9
	 * @description _solveCase9
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_solveCase9({ corner, edge }) {
		const otherColor = edge.colors().find((/**@type{*}*/c) => edge.getFaceOfColor(c) === 'down');
		const currentFace = corner.getFaceOfColor('u');
		const targetFace = getFaceOfMove(otherColor);

		const isLeft = getDirectionFromFaces(
			corner.getFaceOfColor(otherColor),
			currentFace,
			{ up: 'down' }
		) === 'left';
		/**@ts-ignore */
		const prep = getRotationFromTo('down', currentFace, targetFace);
		const moveFace = isLeft ? targetFace : R(targetFace);

		this.move(`${prep} ${moveFace} D D ${R(moveFace)}`, { upperCase: true });
		this.solveSeparatedPair({ corner, edge });
	}
	/**
	 * @name _solveCase10
	 * @description _solveCase10
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_solveCase10({ corner, edge }) {
		const primary = edge.colors().find((/**@type{*}*/c) => edge.getFaceOfColor(c) !== 'down');
		const secondary = edge.colors().find((/**@type{*}*/c) => edge.getFaceOfColor(c) === 'down');
		const cornerCurrent = corner.getFaceOfColor('u');
		const cornerTarget = getFaceOfMove(secondary);
		const isLeft = getDirectionFromFaces(
			corner.getFaceOfColor(secondary),
			corner.getFaceOfColor('u'),
			{ up: 'down' }
		) === 'left';
		/**@ts-ignore */
		const cornerPrep = getRotationFromTo('down', cornerCurrent, cornerTarget);
		/**@ts-ignore */
		this.move(cornerPrep, { upperCase: true });

		const edgeCurrent = edge.getFaceOfColor(primary);
		const edgeTarget = getFaceOfMove(primary);

		const open = isLeft ? cornerTarget : R(cornerTarget);
		/**@ts-ignore */
		const edgePrep = getRotationFromTo('down', edgeCurrent, edgeTarget);

		this.move(`${open} ${edgePrep} ${R(open)}`, { upperCase: true });
		this.solveSeparatedPair({ corner, edge });
	}
}

export { Case1Solver };

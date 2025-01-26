/**
 * @module apps/app7/src/functions/solver3/solvers/f2l
 */

import { RubiksCube } from '../../../models/RubiksCube.js';
import { F2LCaseBaseSolver } from './F2LCaseBaseSolver.js';
import {
	getDirectionFromFaces, getFaceFromDirection, getRotationFromTo
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
 * @name Case3Solver
 * @description Top level case 3:
 * 				Corner is on UP face and edge is on DOWN face.
 * @class
 */
class Case3Solver extends F2LCaseBaseSolver {
	/**
   * 2 cases:
   *
   * 1) Corner's cross color is on the cross face.
   * 2) Corner's cross color is not on the cross face.
   */
	/**
	 * @name _getCaseNumber
	 * @description _getCaseNumber
	 * @function
	 * @param {{corner:*, edge:*}} case
	 * @returns {number}
	 */
	_getCaseNumber({ corner, edge }) {
		if (corner.getColorOfFace('up') === 'u') {
			return 1;
		} else {
			return 2;
		}
	}
	/**
	 * @name _solveCase1
	 * @description _solveCase1
	 * @function
	 * @param {{corner:*, edge:*}} case
	 * @returns {void}
	 */
	_solveCase1({ corner, edge }) {
		const faces = corner.faces().filter((/**@type{*}*/face) => face !== 'up');
		const direction = getDirectionFromFaces(faces[0], faces[1], { up: 'down' });
		const [leftFace, rightFace] = direction === 'right' ? faces : faces.reverse();

		const currentFace = edge.faces().find((/**@type{*}*/face) => face !== 'down');
		const primaryColor = edge.getColorOfFace(currentFace);

		const targetFace = getFaceFromDirection(
			corner.getFaceOfColor(primaryColor),
			primaryColor === corner.getColorOfFace(rightFace) ? 'right' : 'left',
			{ up: 'down' }
		);
		const isLeft = primaryColor === corner.getColorOfFace(leftFace);

		const prep = getRotationFromTo('down', currentFace, targetFace);
		const moveFace = isLeft ? rightFace : R(leftFace);
		const dir = isLeft ? 'DPrime' : 'D';

		this.move(`${prep} ${moveFace} ${dir} ${R(moveFace)}`, { upperCase: true });
		this.solveMatchedPair({ corner, edge });
	}
	/**
	 * @name _solveCase2
	 * @description _solveCase2
	 * @function
	 * @param {{corner:*, edge:*}} case
	 * @returns {void}
	 */
	_solveCase2({ corner, edge }) {
		const otherColor = corner.colors().find((/**@type{*}*/color) => {
			return color !== 'u' && corner.getFaceOfColor(color) !== 'up';
		});
		const currentFace = edge.faces().find((/**@type{*}*/face) => face !== 'down');
		const primaryColor = edge.getColorOfFace(currentFace);

		const willBeMatched = otherColor !== primaryColor;
		const targetFace = corner.getFaceOfColor(willBeMatched ? otherColor : 'u');

		const prep = getRotationFromTo('down', currentFace, targetFace);
		const isLeft = getDirectionFromFaces(
			corner.getFaceOfColor(otherColor),
			corner.getFaceOfColor('u'),
			{ up: 'down' }
		) === 'left';
		const dir = isLeft ? 'DPrime' : 'D';
		let moveFace = corner.getFaceOfColor('u');
		moveFace = isLeft ? R(moveFace) : moveFace;

		this.move(`${prep} ${moveFace} ${dir} ${R(moveFace)}`, { upperCase: true });
		const solveFn = `solve${willBeMatched ? 'Matched' : 'Separated'}Pair`;
		/**@ts-ignore */
		this[solveFn]({ corner, edge });
	}
}

export { Case3Solver };

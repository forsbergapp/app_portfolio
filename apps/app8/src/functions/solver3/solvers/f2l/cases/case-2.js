/**
 * @module apps/app8/src/functions/solver3/solvers/f2l
 */

import { RubiksCube } from '../../../models/RubiksCube.js';
import { F2LCaseBaseSolver } from './F2LCaseBaseSolver.js';
import {
	getDirectionFromFaces, getRotationFromTo 
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
 * @name Case2Solver
 * @description Top level case 2:
 *				Corner is on the DOWN face and edge is not on DOWN or UP face.
 * @class
 */
class Case2Solver extends F2LCaseBaseSolver {
	/**
	 * 4 cases:
	 *
	 * ---- Group 1: Corner's white color is on DOWN face ----
	 * 1) Pair can be matched up.
	 * 2) Pair cannot be matched up.
	 *
	 * ---- Group 2: Corner's white color is not on DOWN face ----
	 * 3) Corner's other color can match up with the edge color on that face.
	 * 4) Corner's other color cannot match up with the edge color on that face.
	 */
	/**
	 * @name _getCaseNumber
	 * @description _getCaseNumber
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_getCaseNumber({ corner, edge }) {
		// get relative right faces of corner and edge
		const cFaces = corner.faces().filter((/**@type{*}*/face) => face !== 'down');
		const eFaces = edge.faces();
		const cornerDir = getDirectionFromFaces(cFaces[0], cFaces[1], { up: 'down' });
		const edgeDir = getDirectionFromFaces(eFaces[0], eFaces[1], { up: 'down' });
		const cornerRight = cornerDir === 'right' ? cFaces[1] : cFaces[0];
		const edgeRight = edgeDir === 'right' ? eFaces[1] : eFaces[0];

		if (corner.getFaceOfColor('u') === 'down') {
			if (corner.getColorOfFace(cornerRight) === edge.getColorOfFace(edgeRight)) {
				return 1;
			} else {
				return 2;
			}
		}

		const otherColor = corner.colors().find((/**@type{*}*/color) => {
			return color !== 'u' && color !== corner.getColorOfFace('down');
		});
		const isLeft = getDirectionFromFaces(
			corner.getFaceOfColor(otherColor),
			corner.getFaceOfColor('u'),
			{ up: 'down' }
		) === 'left';
		const matchingEdgeColor = isLeft ?
			edge.getColorOfFace(edgeRight) :
			edge.colors().find((/**@type{*}*/c) => edge.getFaceOfColor(c) !== edgeRight);

		if (otherColor === matchingEdgeColor) {
			return 3;
		} else {
			return 4;
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
		const color = edge.colors()[0];
		const currentFace = corner.getFaceOfColor(color);
		const targetFace = edge.getFaceOfColor(color);

		const prep = getRotationFromTo('down', currentFace, targetFace);
		/**@ts-ignore */
		this.move(prep, { upperCase: true });

		const [face1, face2] = edge.faces();
		const dir = getDirectionFromFaces(face1 , face2, { up: 'down' });
		const rightFace = dir === 'right' ? face2 : face1;

		this.move(`${rightFace} DPrime ${R(rightFace)}`, { upperCase: true });
		this.solveMatchedPair({ corner, edge });
	}
	/**
	 * @name _solveCase2
	 * @description _solveCase2
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_solveCase2({ corner, edge }) {
		const currentFace = corner.getFaceOfColor(edge.colors()[0]);
		const targetFace = edge.getFaceOfColor(edge.colors()[1]);

		const prep = getRotationFromTo('down', currentFace, targetFace);
		/**@ts-ignore */
		this.move(prep, { upperCase: true });

		const dir = getDirectionFromFaces(edge.faces()[0], edge.faces()[1], { up: 'down' });
		const rightFace = edge.faces()[dir === 'right' ? 1 : 0];

		this.move(`${rightFace} D ${R(rightFace)} DPrime`, { upperCase: true });
		this.move(`${rightFace} D ${R(rightFace)}`, { upperCase: true });

		this.solveSeparatedPair({ corner, edge });
	}
	/**
	 * @name _solveCase3
	 * @description _solveCase3
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_solveCase3({ corner, edge }) {
		this._case3And4Helper({ corner, edge }, 3);
	}
	/**
	 * @name _solveCase4
	 * @description _solveCase4
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	_solveCase4({ corner, edge }) {
		this._case3And4Helper({ corner, edge }, 4);
	}
	/**
	 * @name _case3And4Helper
	 * @description _case3And4Helper
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @param {*} caseNum
	 * @returns {*}
	 */
	_case3And4Helper({ corner, edge }, caseNum) {
		const downColor = corner.getColorOfFace('down');
		const otherColor = corner.colors().find((/**@type{*}*/c) => ![downColor, 'u'].includes(c));
		const matchingColor = caseNum === 3 ? otherColor : downColor;
		const isLeft = getDirectionFromFaces(
			corner.getFaceOfColor(otherColor),
			corner.getFaceOfColor('u'),
			{ up: 'down' }
		) === 'left';

		const currentFace = corner.getFaceOfColor('u');
		// let targetFace = getFaceOfMove(otherColor)
		const targetFace = edge.getFaceOfColor(matchingColor);

		const prep = getRotationFromTo('down', currentFace, targetFace);
		const moveFace = isLeft ? targetFace : R(targetFace);
		let dir = isLeft ? 'DPrime' : 'D';
		dir = caseNum === 4 ? R(dir) : dir;

		this.move(`${prep} ${moveFace} ${dir} ${R(moveFace)}`, { upperCase: true });

		const method = `solve${caseNum === 3 ? 'Matched' : 'Separated'}Pair`;
		/**@ts-ignore */
		this[method]({ corner, edge });
	}
}

export { Case2Solver };

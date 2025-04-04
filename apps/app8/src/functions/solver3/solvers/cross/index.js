/**
 * @module apps/app8/src/functions/solver3/solvers/cross
 */

import { BaseSolver } from '../BaseSolver.js';
import { RubiksCube } from '../../models/RubiksCube.js';
import {
	getDirectionFromFaces, getFaceOfMove, getRotationFromTo, getMoveOfFace
} from '../../utils/index.js';

/**
 * @name CROSS_COLOR
 * @description CROSS_COLOR
 * @constant
 */
const CROSS_COLOR = 'u';
/**
 * @name R
 * @description R
 * @function
 * @param {*} moves
 * @returns {*}
 */
const R = moves => RubiksCube.reverseMoves(moves);

/**
 * @name CrossSolver
 * @description CrossSolver
 * @class
 */
class CrossSolver extends BaseSolver {
	/**
	 * @param {*} args
	 */
	constructor(...args) {
		/**@ts-ignore */
		super(...args);

		this.phase = 'cross';
	}
	/**
	 * @name solve
	 * @description solve
	 * @method
	 * @returns {*}
	 */
	solve() {
		const crossEdges = this._getCrossEdges();
		for (const edge of crossEdges) {
			const partition = this._solve({ edge });
			this.partitions.push(partition);
		}

		return this.partitions;
	}
	/**
	 * @name isSolved
	 * @description isSolved
	 * @method
	 * @returns {boolean}
	 */
	isSolved() {
		const edges = this._getCrossEdges();
		for (const edge of edges) {
			if (!this.isEdgeSolved(edge)) {
				return false;
			}
		}

		return true;
	}
	/**
	 * @name isEdgeSolved
	 * @description isEdgeSolved
	 * @method
	 * @param {* } edge
	 * @returns {*}
	 */
	isEdgeSolved(edge) {
		const otherColor = edge.colors().find((/**@type{*}*/color) => color !== 'u');
		const otherFace = edge.faces().find((/**@type{*} */face) => face !== 'up');
		const matchesMiddle = otherFace[0] === otherColor;
		const isOnCrossFace = edge.getColorOfFace('up') === 'u';

		return isOnCrossFace && matchesMiddle;
	}

	/**
	 * @name _getCrossEdges
	 * @description Finds all edges that have 'F' as a color.
	 * @method
	 * @returns {*}
	 */
	_getCrossEdges() {
		return this.cube.edges().filter(edge => 
			/**@ts-ignore */
			edge.hasColor(CROSS_COLOR));
	}

	/**
	 * @name
	 * @description 6 Cases!
	 * 1) The edge's UP color is on the UP face.
	 * 2) the edge's UP color is on the DOWN face.
	 * 3) The edge's UP color is not on the UP or DOWN face and the other color is on the UP face.
	 * 4) The edge's UP color is not on the UP or DOWN face and the other color is on the DOWN face.
	 * 5) The edge's UP color is not on the UP or DOWN face and the other color is on the RELATIVE RIGHT face.
	 * 6) The edge's UP color is not on the UP or DOWN face and the other color is on the RELATIVE LEFT face.
	 * @method
	 * @param {*} edge
	 * @returns {*}
	 */
	_getCaseNumber({ edge }) {
		if (edge.getColorOfFace('up') === CROSS_COLOR) {
			return 1;
		} else if (edge.getColorOfFace('down') === CROSS_COLOR) {
			return 2;
		}

		if (edge.faces().includes('up')) {
			return 3;
		} else if (edge.faces().includes('down')) {
			return 4;
		}

		const crossFace = edge.getFaceOfColor(CROSS_COLOR);
		const otherFace = edge.getFaceOfColor(edge.colors().find((/**@type{*}*/color) => color !== CROSS_COLOR));
		const direction = getDirectionFromFaces(crossFace, otherFace, { up: 'up' });

		if (direction === 'right') {
			return 5;
		} else if (direction === 'left') {
			return 6;
		}
	}
	/**
	 * @name _solveCase1
	 * @description _solveCase1
	 * @method
	 * @param {*} edge
	 * @returns {*}
	 */
	_solveCase1({ edge }) {
		if (this.isEdgeSolved(edge)) {
			return;
		}

		const face = edge.faces().find((/**@type{*}*/face) => face !== 'up');
		this.move(`${face} ${face}`, { upperCase: true });
		this._solveCase2({ edge });
	}
	/**
	 * @name _solveCase2
	 * @description _solveCase2
	 * @method
	 * @param {*} edge
	 * @returns {*}
	 */
	_solveCase2({ edge }) {
		const solveMoves = this._case1And2Helper({ edge }, 2);
		this.move(solveMoves, { upperCase: true });
	}
	/**
	 * @name _solveCase3
	 * @description _solveCase3
	 * @method
	 * @param {*} edge
	 * @returns {*}
	 */
	_solveCase3({ edge }) {
		const prepMove = this._case3And4Helper({ edge }, 3);
		this.move(prepMove, { upperCase: true });
		this._solveCase5({ edge });
	}
	/**
	 * @name _solveCase4
	 * @description _solveCase4
	 * @method
	 * @param {*} edge
	 * @returns {*}
	 */
	_solveCase4({ edge }) {
		const prepMove = getRotationFromTo(
			'down',
			edge.getFaceOfColor('u'),
			/**@ts-ignore */
			getFaceOfMove(edge.getColorOfFace('down'))
		);
		/**@ts-ignore */
		this.move(prepMove, { upperCase: true });

		const edgeToMiddle = R(edge.getFaceOfColor('u'));

		this.move(edgeToMiddle, { upperCase: true });
		this._solveCase5({ edge });
	}
	/**
	 * @name _solveCase5
	 * @description _solveCase5
	 * @method
	 * @param {*} edge
	 * @returns {*}
	 */
	_solveCase5({ edge }) {
		const solveMoves = this._case5And6Helper({ edge }, 5);
		this.move(solveMoves, { upperCase: true });
	}
	/**
	 * @name _solveCase6
	 * @description _solveCase6
	 * @method
	 * @param {*} edge
	 * @returns {*}
	 */
	_solveCase6({ edge }) {
		const solveMoves = this._case5And6Helper({ edge }, 6);
		this.move(solveMoves, { upperCase: true });
	}
	/**
	 * @name _case1And2Helper
	 * @description _case1And2Helper
	 * @method
	 * @param {*} edge
	 * @param {*} caseNum
	 * @returns {*}
	 */
	_case1And2Helper({ edge }, caseNum) {
		const crossColorFace = caseNum === 1 ? 'up' : 'down';
		const currentFace = edge.faces().find((/**@type{*}*/face) => face !== crossColorFace);
		const targetFace = getFaceOfMove(edge.getColorOfFace(currentFace));

		/**@ts-ignore */
		let solveMoves = getRotationFromTo(crossColorFace, currentFace, targetFace);

		if (caseNum === 2) {
			/**@ts-ignore */
			const edgeToCrossFace = getMoveOfFace(targetFace);
			solveMoves += ` ${edgeToCrossFace} ${edgeToCrossFace}`;
		}

		return solveMoves;
	}
	/**
	 * @name _case3And4Helper
	 * @description _case3And4Helper
	 * @method
	 * @param {*} edge
	 * @param {*} caseNum
	 * @returns {*}
	 */
	_case3And4Helper({ edge }, caseNum) {
		let prepMove = edge.faces().find((/**@type{*}*/face) => !['up', 'down'].includes(face));

		if (caseNum === 4) {
			prepMove = R(prepMove);
		}

		return prepMove;
	}
	/**
	 * @name _case5And6Helper
	 * @description _case5And6Helper
	 * @method
	 * @param {*} edge
	 * @param {*} caseNum
	 * @returns {*}
	 */
	_case5And6Helper({ edge }, caseNum) {
		const otherColor = edge.colors().find((/**@type{*}*/color) => color !== 'u');
		const currentFace = edge.getFaceOfColor(otherColor);
		const targetFace = getFaceOfMove(otherColor);
		/**@ts-ignore */
		const prepMove = getRotationFromTo('up', currentFace, targetFace);
		let edgeToCrossFace = getMoveOfFace(currentFace);

		if (caseNum === 6) {
			edgeToCrossFace = R(edgeToCrossFace);
		}

		return `${R(prepMove)} ${edgeToCrossFace} ${prepMove}`;
	}
	/**
	 * @name _getPartitionBefore
	 * @description _getPartitionBefore
	 * @method
	 * @param {*} edge
	 * @returns {*}
	 */
	_getPartitionBefore({ edge }) {
		return { edge: edge.clone() };
	}
	/**
	 * @name _getPartitionAfter
	 * @description _getPartitionAfter
	 * @method
	 * @param {*} edge
	 * @returns {*}
	 */
	_getPartitionAfter({ edge }) {
		return { edge };
	}
}

export { CrossSolver };

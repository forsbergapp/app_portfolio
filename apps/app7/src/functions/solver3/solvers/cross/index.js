/**
 * @module apps/app7/src/functions/solver3/solvers/cross
 */

import { BaseSolver } from '../BaseSolver.js';
import { RubiksCube } from '../../models/RubiksCube.js';
import {
	getDirectionFromFaces, getFaceOfMove, getRotationFromTo, getMoveOfFace
} from '../../utils/index.js';

const CROSS_COLOR = 'u';
const R = (moves) => RubiksCube.reverseMoves(moves);

class CrossSolver extends BaseSolver {
	constructor(...args) {
		super(...args);

		this.phase = 'cross';
	}

	solve() {
		const crossEdges = this._getCrossEdges();
		for (const edge of crossEdges) {
			const partition = this._solve({ edge });
			this.partitions.push(partition);
		}

		return this.partitions;
	}

	isSolved() {
		const edges = this._getCrossEdges();
		for (const edge of edges) {
			if (!this.isEdgeSolved(edge)) {
				return false;
			}
		}

		return true;
	}

	isEdgeSolved(edge) {
		const otherColor = edge.colors().find(color => color !== 'u');
		const otherFace = edge.faces().find(face => face !== 'up');
		const matchesMiddle = otherFace[0] === otherColor;
		const isOnCrossFace = edge.getColorOfFace('up') === 'u';

		return isOnCrossFace && matchesMiddle;
	}

	/**
	 * Finds all edges that have 'F' as a color.
	 * @returns {array}
	 */
	_getCrossEdges() {
		return this.cube.edges().filter(edge => edge.hasColor(CROSS_COLOR));
	}

	/**
	 * 6 Cases!
	 * 1) The edge's UP color is on the UP face.
	 * 2) the edge's UP color is on the DOWN face.
	 * 3) The edge's UP color is not on the UP or DOWN face and the other color is on the UP face.
	 * 4) The edge's UP color is not on the UP or DOWN face and the other color is on the DOWN face.
	 * 5) The edge's UP color is not on the UP or DOWN face and the other color is on the RELATIVE RIGHT face.
	 * 6) The edge's UP color is not on the UP or DOWN face and the other color is on the RELATIVE LEFT face.
	 *
	 * @param {cubie} edge
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
		const otherFace = edge.getFaceOfColor(edge.colors().find(color => color !== CROSS_COLOR));
		const direction = getDirectionFromFaces(crossFace, otherFace, { up: 'up' });

		if (direction === 'right') {
			return 5;
		} else if (direction === 'left') {
			return 6;
		}
	}

	_solveCase1({ edge }) {
		if (this.isEdgeSolved(edge)) {
			return;
		}

		const face = edge.faces().find(face => face !== 'up');
		this.move(`${face} ${face}`, { upperCase: true });
		this._solveCase2({ edge });
	}

	_solveCase2({ edge }) {
		const solveMoves = this._case1And2Helper({ edge }, 2);
		this.move(solveMoves, { upperCase: true });
	}

	_solveCase3({ edge }) {
		const prepMove = this._case3And4Helper({ edge }, 3);
		this.move(prepMove, { upperCase: true });
		this._solveCase5({ edge });
	}

	_solveCase4({ edge }) {
		const prepMove = getRotationFromTo(
			'down',
			edge.getFaceOfColor('u'),
			getFaceOfMove(edge.getColorOfFace('down'))
		);
		this.move(prepMove, { upperCase: true });

		const edgeToMiddle = R(edge.getFaceOfColor('u'));

		this.move(edgeToMiddle, { upperCase: true });
		this._solveCase5({ edge });
	}

	_solveCase5({ edge }) {
		const solveMoves = this._case5And6Helper({ edge }, 5);
		this.move(solveMoves, { upperCase: true });
	}

	_solveCase6({ edge }) {
		const solveMoves = this._case5And6Helper({ edge }, 6);
		this.move(solveMoves, { upperCase: true });
	}

	_case1And2Helper({ edge }, caseNum) {
		const crossColorFace = caseNum === 1 ? 'up' : 'down';
		const currentFace = edge.faces().find(face => face !== crossColorFace);
		const targetFace = getFaceOfMove(edge.getColorOfFace(currentFace));

		let solveMoves = getRotationFromTo(crossColorFace, currentFace, targetFace);

		if (caseNum === 2) {
			const edgeToCrossFace = getMoveOfFace(targetFace);
			solveMoves += ` ${edgeToCrossFace} ${edgeToCrossFace}`;
		}

		return solveMoves;
	}

	_case3And4Helper({ edge }, caseNum) {
		let prepMove = edge.faces().find(face => !['up', 'down'].includes(face));

		if (caseNum === 4) {
			prepMove = R(prepMove);
		}

		return prepMove;
	}

	_case5And6Helper({ edge }, caseNum) {
		const otherColor = edge.colors().find(color => color !== 'u');
		const currentFace = edge.getFaceOfColor(otherColor);
		const targetFace = getFaceOfMove(otherColor);

		const prepMove = getRotationFromTo('up', currentFace, targetFace);
		let edgeToCrossFace = getMoveOfFace(currentFace);

		if (caseNum === 6) {
			edgeToCrossFace = R(edgeToCrossFace);
		}

		return `${R(prepMove)} ${edgeToCrossFace} ${prepMove}`;
	}

	_getPartitionBefore({ edge }) {
		return { edge: edge.clone() };
	}

	_getPartitionAfter({ edge }) {
		return { edge };
	}
}

export { CrossSolver };

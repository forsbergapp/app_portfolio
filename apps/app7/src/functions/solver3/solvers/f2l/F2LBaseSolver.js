/**
 * @module apps/app7/src/functions/solver3/solvers/f2l
 */

import { BaseSolver } from '../BaseSolver.js';
import { RubiksCube } from '../../models/RubiksCube.js';
import {
	getFaceOfMove, getDirectionFromFaces, getFaceFromDirection, getRotationFromTo,
	getMoveOfFace
} from '../../utils/index.js';

const R = (moves) => RubiksCube.reverseMoves(moves);

class F2LBaseSolver extends BaseSolver {
	constructor(...args) {
		super(...args);

		this.phase = 'f2l';
	}

	colorsMatch({ corner, edge }) {
		const colors = edge.colors();

		if (corner.colors().includes(colors[0]) && corner.colors().includes(colors[1])) {
			return true;
		}

		return false;
	}

	/**
	 * Returns true only if the pair is matched and in the correct slot.
	 */
	isPairSolved({ corner, edge }) {
		if (!this.isPairMatched({ corner, edge })) {
			return false;
		}

		// is the corner on the cross face?
		if (corner.getFaceOfColor('u') !== 'up') {
			return false;
		}

		// are the edge's colors on the correct face? (e.g. is the edge's 'F' color
		// on the 'FRONT' face)?
		for (const color of edge.colors()) {
			if (edge.getFaceOfColor(color) !== getFaceOfMove(color)) {
				return false;
			}
		}

		return true;
	}

	isPairMatched({ corner, edge }) {
		// are the two non-cross colors the same?
		if (!this.colorsMatch({ corner, edge })) {
			return false;
		}

		// for each color, do the corner and edge share the same face?
		for (const color of edge.colors()) {
			if (corner.getFaceOfColor(color) !== edge.getFaceOfColor(color)) {
				return false;
			}
		}

		return true;
	}

	isPairSeparated({ corner, edge }) {
		// colors must match
		if (!this.colorsMatch({ corner, edge })) {
			return false;
		}

		// corner's white face cannot be UP or DOWN
		if (['up', 'down'].includes(corner.getFaceOfColor('u'))) {
			return false;
		}

		// edge must be on the DOWN face
		if (!edge.faces().includes('down')) {
			return false;
		}


		const otherColor = corner.colors().find(color => {
			return color !== 'u' && corner.getFaceOfColor(color) !== 'down';
		});

		// edge must be oriented properly
		if (edge.getFaceOfColor(otherColor) !== 'down') {
			return false;
		}

		// corner and edge must be one move away from matching
		const isOneMoveFromMatched = getDirectionFromFaces(
			corner.getFaceOfColor(otherColor),
			edge.getFaceOfColor(corner.getColorOfFace('down')),
			{ up: 'up' }
		) === 'back';

		return isOneMoveFromMatched;
	}

	solveMatchedPair({ corner, edge }) {
		if (!this.isPairMatched({ corner, edge })) {
			throw new Error('Pair is not matched');
		}

		// get the color that is not on the down face and is not the crossColor
		const matchedColor = edge.colors().find(color => {
			return edge.getFaceOfColor(color) !== 'down';
		});

		const isLeft = getDirectionFromFaces(
			edge.getFaceOfColor(matchedColor),
			corner.getFaceOfColor('u'),
			{ up: 'down' }
		) === 'left';

		const matchingFace = getFaceOfMove(matchedColor);
		const currentFace = corner.getFaceOfColor(matchedColor);
		const prepFace = getFaceFromDirection(matchingFace, isLeft ? 'left' : 'right', { up: 'down' });

		const prep = getRotationFromTo('down', currentFace, prepFace);
		const open = isLeft ? matchingFace : R(matchingFace);
		const insert = isLeft ? 'DPrime' : 'D';

		const solveMoves = [prep, open, insert, R(open)].join(' ');
		this.move(solveMoves, { upperCase: true });
		return solveMoves;
	}

	solveSeparatedPair({ corner, edge }) {
		if (!this.isPairSeparated({ corner, edge })) {
			throw new Error('Pair is not separated');
		}

		// get the color that is not on the down face and is not the crossColor
		const matchedColor = edge.colors().find(color => {
			return edge.getFaceOfColor(color) !== 'down';
		});

		const isLeft = getDirectionFromFaces(
			corner.getFaceOfColor('u'),
			edge.getFaceOfColor(matchedColor),
			{ up: 'down' }
		).toUpperCase() === 'LEFT';

		const currentFace = corner.getFaceOfColor('u');
		const prepFace = getFaceOfMove(matchedColor);

		const prep = getRotationFromTo('down', currentFace, prepFace);
		let match = getMoveOfFace(prepFace);
		match = isLeft ? R(match) : match;
		const insert = isLeft ? 'DPrime' : 'D';

		const solveMoves = [prep, match, insert, R(match)].join(' ');
		this.move(solveMoves, { upperCase: true });
		return solveMoves;
	}

	_getPartitionBefore({ corner, edge }) {
		return {
			corner: corner.clone(),
			edge: edge.clone()
		};
	}

	_getPartitionAfter({ corner, edge }) {
		return { corner, edge };
	}
}

export { F2LBaseSolver };

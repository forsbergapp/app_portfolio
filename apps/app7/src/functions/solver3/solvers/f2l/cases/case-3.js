import { RubiksCube } from '../../../models/RubiksCube.js';
import { F2LCaseBaseSolver } from './F2LCaseBaseSolver.js';
import {
	getDirectionFromFaces, getFaceFromDirection, getRotationFromTo
} from '../../../utils/index.js';

const R = (moves) => RubiksCube.reverseMoves(moves);

/**
 * Top level case 3:
 * Corner is on UP face and edge is on DOWN face.
 */
class Case3Solver extends F2LCaseBaseSolver {
	/**
   * 2 cases:
   *
   * 1) Corner's cross color is on the cross face.
   * 2) Corner's cross color is not on the cross face.
   */
	_getCaseNumber({ corner, edge }) {
		if (corner.getColorOfFace('up') === 'u') {
			return 1;
		} else {
			return 2;
		}
	}

	_solveCase1({ corner, edge }) {
		const faces = corner.faces().filter(face => face !== 'up');
		const direction = getDirectionFromFaces(faces[0], faces[1], { up: 'down' });
		const [leftFace, rightFace] = direction === 'right' ? faces : faces.reverse();

		const currentFace = edge.faces().find(face => face !== 'down');
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

	_solveCase2({ corner, edge }) {
		const otherColor = corner.colors().find(color => {
			return color !== 'u' && corner.getFaceOfColor(color) !== 'up';
		});
		const currentFace = edge.faces().find(face => face !== 'down');
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
		this[solveFn]({ corner, edge });
	}
}

export { Case3Solver };

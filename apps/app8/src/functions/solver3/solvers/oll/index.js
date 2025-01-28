/**
 * @module apps/app8/src/functions/solver3/solvers/oll
 */

import { RubiksCube } from '../../models/RubiksCube.js';
import { BaseSolver } from '../BaseSolver.js';
import { getDirectionFromFaces } from '../../utils/index.js';

/**
 * @name SOLVED_STATE
 * @description SOLVED_STATE
 * @constant
 */
const SOLVED_STATE = '00000000';

/**
 * @name R
 * @description R
 * @function
 * @param {*} moves
 * @returns {*}
 */
const R = moves => RubiksCube.reverseMoves(moves);

/**
 * @name OLLSolver
 * @description OLLSolver
 * @class
 */
class OLLSolver extends BaseSolver {
	/**
	 * @param {*} args
	 */
	constructor(...args) {
		/**@ts-ignore */
		super(...args);
		this.phase = 'oll';

		// orientations in order based on http://badmephisto.com/oll.php, however the
		// actual algorithms may be different.
		this.algorithms = {
			[SOLVED_STATE]: '', // solved state
			'21000110': 'F R U RPrime UPrime FPrime', // 1
			'21211010': 'F R U RPrime UPrime FPrime F R U RPrime UPrime FPrime', // 2
			'10201020': 'R U2 RPrime UPrime R U RPrime UPrime R UPrime RPrime', // 3
			'01112000': 'F U R UPrime RPrime FPrime', // 4
			'11102120': 'F U R UPrime RPrime U R UPrime RPrime FPrime', // 5
			'11210000': 'RPrime UPrime FPrime U F R', // 6
			'11102021': 'FPrime LPrime UPrime L U LPrime UPrime L U F', // 7
			'10011110': 'R L2 BPrime L BPrime LPrime B2 L BPrime L RPrime', // 8
			'00202121': 'LPrime R2 B RPrime B R B2 RPrime B RPrime L', // 9
			'01111111': 'F U R UPrime RPrime FPrime L F U FPrime UPrime LPrime', // 10
			'21212101': 'F U R UPrime RPrime FPrime R B U BPrime UPrime RPrime', // 11
			'21211111': 'F R U RPrime UPrime FPrime B U L UPrime LPrime BPrime', // 12
			'20201010': 'R U2 R2 UPrime R2 UPrime R2 U2 R', // 13
			'01101110': 'R B RPrime L U LPrime UPrime R BPrime RPrime', // 14
			'21002120': 'LPrime BPrime L RPrime UPrime R U LPrime B L', // 15
			'21001100': 'RPrime F R U RPrime UPrime FPrime U R', // 16
			'01000100': 'R U RPrime UPrime MPrime U R UPrime rPrime', // 17
			'01010101': 'M U R U RPrime UPrime M2 U R UPrime rPrime', // 18
			'10211021': 'F R U RPrime UPrime R U RPrime UPrime FPrime B U L UPrime LPrime BPrime', // 19
			'11000120': 'R U RPrime UPrime RPrime F R FPrime', // 20
			'10000020': 'LPrime BPrime R B L BPrime RPrime B', // 21
			'20001000': 'B LPrime BPrime R B L BPrime RPrime', // 22
			'00112001': 'RPrime UPrime RPrime F R FPrime U R', // 23
			'21112111': 'R U2 RPrime RPrime F R FPrime U2 RPrime F R FPrime', // 24
			'10002101': 'R U2 RPrime RPrime F R FPrime R U2 RPrime', // 25
			'21110101': 'M U R U RPrime UPrime MPrime RPrime F R FPrime', // 26
			'11212010': 'F LPrime U2 L U2 L F2 LPrime F', // 27
			'01110020': 'R U RPrime U R UPrime RPrime UPrime RPrime F R FPrime', // 28
			'10012100': 'RPrime UPrime R UPrime RPrime U R U R BPrime RPrime B', // 29
			'10112021': 'RPrime UPrime R UPrime RPrime U FPrime U F R', // 30
			'01110121': 'F U R UPrime RPrime FPrime F U FPrime UPrime FPrime L F LPrime', // 31
			'01112101': 'F U R UPrime RPrime FPrime B U BPrime UPrime SPrime U B UPrime bPrime', // 32
			'21212000': 'lPrime U2 L U LPrime U l', // 33
			'01212020': 'r U RPrime U R U2 rPrime', // 34
			'00202020': 'R U RPrime U R U2 RPrime', // 35
			'10101000': 'RPrime UPrime R URprime RPrime U2 R', // 36
			'01001021': 'RPrime U R U2 RPrime UPrime FPrime U F U R', // 37
			'10200101': 'R UPrime RPrime U2 R U B UPrime BPrime UPrime RPrime', // 38
			'21102011': 'r U RPrime U R UPrime RPrime U R U2 rPrime', // 39
			'21112010': 'lPrime UPrime L UPrime LPrime U L UPrime LPrime U2 l', // 40
			'11100011': 'r U2 RPrime UPrime R UPrime rPrime', // 41
			'11012000': 'F R UPrime RPrime UPrime R U RPrime FPrime', // 42
			'11001011': 'lPrime UPrime L UPrime LPrime U2 l', // 43
			'01010000': 'r U RPrime UPrime M U R UPrime RPrime', // 44
			'01002110': 'R U RPrime UPrime BPrime RPrime F R FPrime B', // 45
			'01202120': 'L FPrime LPrime UPrime L F LPrime FPrime U F', // 46
			'11001110': 'RPrime F R U RPrime FPrime R F UPrime FPrime', // 47
			'10200000': 'R2 D RPrime U2 R DPrime RPrime U2 RPrime', // 48
			'20112011': 'RPrime U2 R2 U RPrime U R U2 BPrime RPrime B', // 49
			'10000121': 'R U BPrime UPrime RPrime U R B RPrime', // 50
			'11000021': 'RPrime UPrime F U R UPrime RPrime FPrime R', // 51
			'01100120': 'L FPrime LPrime UPrime L U F UPrime LPrime', // 52
			'11112020': 'RPrime F R2 FPrime U2 FPrime U2 F RPrime', // 53
			'20110100': 'BPrime RPrime B LPrime BPrime R R BPrime RPrime B2 L', // 54
			'20100101': 'B L BPrime R B L2 B L B2 RPrime', // 55
			'01101011': 'FPrime UPrime F L FPrime LPrime U L F LPrime', // 56
			'21012020': 'F U FPrime RPrime F R UPrime RPrime FPrime R', // 57
		};
	}
	/**
	 * @name isSolved
	 * @description isSolved
	 * @method
	 * @returns {*}
	 */
	isSolved() {
		return this.getOllString() === SOLVED_STATE;
	}
	/**
	 * @name solve
	 * @description solve
	 * @method
	 * @returns {*}
	 */
	solve() {
		return this._solve();
	}
	/**
	 * @name _getCaseNumber
	 * @description _getCaseNumber
	 * @method
	 * @returns {*}
	 */
	_getCaseNumber() {
		return this.getOllString();
	}
	/**
	 * @name _solveCase
	 * @description _solveCase
	 * @method
	 * @param {*} ollString
	 * @returns {*}
	 */
	_solveCase(ollString) {
		const pattern = this.findPattern(ollString);
		const algorithm = this.getAlgorithm(pattern);
		const frontFace = this._getFrontFace(ollString, pattern);

		this.move(algorithm, {
			orientation: { up: 'down', front: frontFace }
		});
	}
	/**
	 * @name getOllString
	 * @description getOllString
	 * @method
	 * @returns {*}
	 */
	getOllString() {
		/**@type{*} */
		const orientations = [];

		const cubies = this._getOllCubies();
		cubies.forEach((/**@type{*}*/cubie) => {
			const orientation = this._getCubieOrientation(cubie);
			orientations.push(orientation);
		});

		return orientations.join('');
	}

	/**
	 * @name findPattern
	 * @description findPattern
	 * @method
	 * @param {string} [ollString] - Probably unnecessary. If passed in, it saves
	 * 								a step computing the ollString.
	 * @returns {*}
	 */
	findPattern(ollString) {
		if (typeof ollString === 'undefined') {
			ollString = this.getOllString();
		}

		for (let i = 0; i < 4; i++) {
			/**@ts-ignore */
			const algorithm = this.algorithms[ollString];

			if (typeof algorithm === 'string') {
				return ollString;
			} else {
				ollString = this._rotateOllStringLeft(ollString);
			}
		}

		throw new Error(`No pattern found for oll string "${ollString}"`);
	}

	/**
	 * @name getAlgorithm
	 * @description getAlgorithm
	 * @method
	 * @param {string} [pattern] - The pattern on this OLL or the ollString.
	 * @returns {*}
	 */
	getAlgorithm(pattern) {
		if (typeof pattern === 'undefined') {
			/**@ts-ignore */
			pattern = this.getPattern(pattern); // pattern can be an ollString
		}
		/**@ts-ignore */
		if (typeof this.algorithms[pattern] === 'undefined') {
			throw new Error(`No algorithm found for pattern "${pattern}"`);
		}
		/**@ts-ignore */
		return this.algorithms[pattern];
	}
	/**
	 * @name _getOllCubies
	 * @description _getOllCubies
	 * @method
	 * @returns {*}
	 */
	_getOllCubies() {
		const positions = [
			['front', 'down', 'right'],
			['front', 'down'],
			['front', 'down', 'left'],
			['left', 'down'],
			['left', 'down', 'back'],
			['back', 'down'],
			['back', 'down', 'right'],
			['right', 'down']
		];
		/**@ts-ignore */
		return positions.map(pos => this.cube.getCubie(pos));
	}

	/**
	 * @name _getCubieOrientation
	 * @description Returns a number indicating the orientation of the cubie.
	 * 0 --> The DOWN color is on the DOWN face.
	 * 1 --> The DOWN color is a clockwise rotation from "solved".
	 * 2 --> The DOWN color is a counter-clockwise rotation from "solved".
	 * @method
	 * @param {*} cubie
	 * @returns {*}
	 */
	_getCubieOrientation(cubie) {
		if (cubie.getColorOfFace('down') === 'd') {
			return 0;
		}

		// if cubie is an edge piece, return 1
		if (cubie.isEdge()) {
			return 1;
		}

		const [face1, face2] = cubie.faces().filter((/**@type{*}*/face) => face !== 'down');
		const dir = getDirectionFromFaces(face1, face2, { up: 'down' });
		const rightFace = dir === 'right' ? face2 : face1;

		return cubie.getColorOfFace(rightFace) === 'd' ? 1 : 2;
	}
	/**
	 * @name _getFrontFace
	 * @description _getFrontFace
	 * @method
	 * @param {*} ollString
	 * @param {*} pattern
	 * @returns {*}
	 */
	_getFrontFace(ollString, pattern) {
		const rotationOrder = ['front', 'left', 'back', 'right'];

		for (let i = 0; i < 4; i++) {
			if (ollString === pattern) {
				return rotationOrder[i];
			} else {
				ollString = this._rotateOllStringLeft(ollString);
			}
		}

		throw new Error(`OLL string "${ollString}" does not resolve to the pattern "${pattern}"`);
	}
	/**
	 * @name _rotateOllStringLeft
	 * @description _rotateOllStringLeft
	 * @method
	 * @param {*} ollString
	 * @returns {*}
	 */
	_rotateOllStringLeft(ollString) {
		return ollString.slice(2) + ollString.slice(0, 2);
	}
	/**
	 * @name _getPartitionBefore
	 * @description _getPartitionBefore
	 * @method
	 * @returns {*}
	 */
	_getPartitionBefore() {
		return this.getOllString();
	}
	/**
	 * @name _getPartitionAfter
	 * @description _getPartitionAfter
	 * @method
	 * @returns {*}
	 */
	_getPartitionAfter() {
		return null;
	}
}

export { OLLSolver };

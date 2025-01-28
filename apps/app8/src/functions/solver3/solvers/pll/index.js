/**
 * @module apps/app8/src/functions/solver3/solvers/pll
 */

import { BaseSolver } from '../BaseSolver.js';
import {
	getFaceOfMove, getRotationFromTo, getDirectionFromFaces
} from '../../utils/index.js';

/**
 * @name SOLVED_STATE
 * @description
 * @constant
 */
const SOLVED_STATE = '0 0 0 0 0 0 0 0';
/**
 * @name PLLSolver
 * @description PLLSolver
 * @class
 */
class PLLSolver extends BaseSolver {
	/**
	 * @param {*} args
	 */
	constructor(...args) {
		/**@ts-ignore */
		super(...args);
		this.phase = 'pll';

		this.algorithms = {
			[SOLVED_STATE]: '', // already solved
			'2 -1 1 -1 1 0 0 2': 'R2 F2 RPrime BPrime R F2 RPrime B RPrime', // #1
			'-1 1 -1 2 2 0 0 1': 'R BPrime R F2 RPrime B R F2 R2', // #2
			'1 -1 2 2 0 0 1 -1': 'R UPrime R U R U R UPrime RPrime UPrime R2', // #3
			'-1 1 -1 1 0 0 2 2': 'R2 U R U RPrime UPrime RPrime UPrime RPrime U RPrime', // #4
			'2 2 2 2 2 2 2 2': 'M M U M M U2 M M U M M', // #5
			'0 1 1 1 1 0 2 2': 'R U RPrime UPrime RPrime F R2 UPrime RPrime UPrime R U RPrime FPrime', // #6
			'1 0 2 0 1 0 0 0': 'R U2 RPrime UPrime R U2 LPrime U RPrime UPrime L', // #7
			'0 2 2 0 1 1 1 1': 'F R UPrime RPrime UPrime R U RPrime FPrime R U RPrime UPrime RPrime F R FPrime', // #8
			'1 -1 -1 2 -1 -1 1 0': 'RPrime U2 R U2 RPrime F R U RPrime UPrime RPrime FPrime R2', // #9
			'0 1 -1 -1 2 -1 -1 1': 'R UPrime RPrime UPrime R U R D RPrime UPrime R DPrime RPrime U2 RPrime', // #10
			'0 2 -1 -1 -1 -1 2 0': 'RPrime U RPrime UPrime BPrime D BPrime DPrime B2 RPrime BPrime R B R', // #11
			'2 -1 -1 -1 -1 2 0 0': 'RPrime UPrime FPrime R U RPrime UPrime RPrime F R2 UPrime RPrime UPrime R U RPrime U R', // #12
			'-1 2 2 2 -1 2 0 2': 'L U LPrime B2 uPrime B UPrime BPrime U BPrime u B2', // #13
			'2 -1 2 0 2 -1 2 2': 'RPrime UPrime R B2 u BPrime U B UPrime B uPrime B2', // #14
			'2 -1 1 1 0 1 1 -1': 'R2 uPrime R UPrime R U RPrime u R2 B UPrime BPrime', // #15
			'1 0 1 1 -1 2 -1 1': 'R2 u RPrime U RPrime UPrime R uPrime R2 FPrime U F', // #16
			'1 -1 -1 1 1 -1 -1 1': 'U RPrime UPrime R UPrime R U R UPrime RPrime U R U R2 UPrime RPrime', // #17
			'0 1 0 0 0 1 0 2': 'LPrime U2 L U LPrime U2 R UPrime L U RPrime', // #18
			'1 1 -1 -1 1 1 -1 -1': 'R BPrime RPrime F R B RPrime FPrime R B RPrime F R BPrime RPrime FPrime', // #19
			'2 0 2 0 2 0 2 0': 'R U RPrime U R U RPrime FPrime R U RPrime UPrime RPrime F R2 UPrime RPrime U2 R UPrime RPrime', // #20
			'0 2 0 2 0 2 0 2': 'RPrime U R UPrime RPrime FPrime UPrime F R U RPrime F RPrime FPrime R UPrime R', // #21
		};
	}
	/**
	 * @name solver
	 * @description solver
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
		return this.getPllString();
	}
	/**
	 * @name _solveCase
	 * @description _solveCase
	 * @method
	 * @param {*} pllString
	 * @returns {*}
	 */
	_solveCase(pllString) {
		const pattern = this.findPattern(pllString);
		const algorithm = this.getAlgorithm(pattern);
		const frontFace = this._getFrontFace(pllString, pattern);

		this.move(algorithm, {
			orientation: { up: 'down', front: frontFace }
		});

		// may need an extra rotation of DOWN for a complete solve
		/**@ts-ignore */
		const cubie = this.cube.getCubie(['down', 'front']); // any cubie on DOWN
		const origin = 'front';
		const target = getFaceOfMove(cubie.getColorOfFace(origin));
		/**@ts-ignore */
		const lastLayerMove = getRotationFromTo('down', origin, target);
		/**@ts-ignore */
		this.move(lastLayerMove);
	}
	/**
	 * @name isSolved
	 * @description isSolved
	 * @method
	 * @returns {*}
	 */
	isSolved() {
		return this.cube.isSolved();
	}

	/**
	 * @name getPLLString
	 * @description Permutations are unique in the way that each cubie is permutated relative
	 * to the one adjacent to it. For each cubie (in order), find the relative
	 * direction from its color to the next cubie's color, and turn it into a
	 * number. This will allow each permutation to be held in a unique string.
	 * @method
	 * @returns {*}
	 */
	getPllString() {
		const pllString = [];
		const pllCubies = this._getPllCubies();

		const faces = ['front', 'left', 'back', 'right']; // we're upside down

		for (let i = 0; i < pllCubies.length; i++) {
			const cubie1 = pllCubies[i];
			let cubie2 = pllCubies[i + 1];
			const faceToCheck = faces[~~(i / 2)];

			// get the colors of the two cubies
			const color1 = cubie1.getColorOfFace(faceToCheck);

			// wrap around to the first cubie
			if (!cubie2) {
				cubie2 = pllCubies[0];
			}
			const color2 = cubie2.getColorOfFace(faceToCheck);

			// find the direction between the two
			const face1 = getFaceOfMove(color1);
			const face2 = getFaceOfMove(color2);

			// turn it into a number
			/**@ts-ignore */
			let direction = getDirectionFromFaces(face1, face2, { up: 'down' });
			/**@ts-ignore */
			if (direction === 'front') direction = 0;
			/**@ts-ignore */
			if (direction === 'right') direction = 1;
			/**@ts-ignore */
			if (direction === 'left') direction = -1;
			/**@ts-ignore */
			if (direction === 'back') direction = 2;

			pllString.push(direction);
		}

		return pllString.join(' ');
	}
	/**
	 * @name findPattern
	 * @description findPattern
	 * @method
	 * @param {*} pllString
	 * @returns {*}
	 */
	findPattern(pllString) {
		const initialString = pllString;

		if (typeof pllString === 'undefined') {
			pllString = this.getPllString();
		}

		for (let i = 0; i < 4; i++) {
			/**@ts-ignore */
			const algorithm = this.algorithms[pllString];

			if (typeof algorithm === 'string') {
				return pllString;
			} else {
				pllString = this._rotatePllStringLeft(pllString);
			}
		}

		throw new Error(`No pattern found for pll string "${initialString}"`);
	}
	/**
	 * @name getAlgorithm
	 * @description getAlgorithm
	 * @method
	 * @param {*} pattern
	 * @returns {*}
	 */
	getAlgorithm(pattern) {
		if (typeof pattern === 'undefined') {
			pattern = this.findPattern(pattern); // pattern can be a pllString
		}
		/**@ts-ignore */
		if (typeof this.algorithms[pattern] === 'undefined') {
			throw new Error(`No algorithm found for pattern "${pattern}"`);
		}
		/**@ts-ignore */
		return this.algorithms[pattern];
	}
	/**
	 * @name _getPllCubies
	 * @description _getPllCubies
	 * @method
	 * @returns {*}
	 */
	_getPllCubies() {
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
	 * @name _getCubiePermutation
	 * @description _getCubiePermutation
	 * @method
	 * @param {*} cubie
	 * @returns {*}
	 */
	_getCubiePermutation(cubie) {
		// pick a face, any face (expect for the down face)
		const face = cubie.faces().find((/**@type{*}*/face) => face !== 'down');

		// get the cube face this face lies on
		const cubeFace = getFaceOfMove(cubie.getColorOfFace(face));

		// find the move that will permute the cubie correctly
		/**@ts-ignore */
		let moveToSolveCubie = getRotationFromTo('down', face, cubeFace);
		/**@ts-ignore */
		moveToSolveCubie = moveToSolveCubie.toLowerCase();

		// translate the move to a number
		let dir;
		if (moveToSolveCubie === '') dir = 0;
		else if (moveToSolveCubie.includes('prime')) dir = 1;
		else if (moveToSolveCubie.split(' ').length > 1) dir = 2;
		else dir = -1;

		return dir;
	}
	/**
	 * @name _rotatePllStringLeft
	 * @description _rotatePllStringLeft
	 * @method
	 * @param {*} pllString
	 * @returns {*}
	 */
	_rotatePllStringLeft(pllString) {
		const arr = pllString.split(' ').map((/**@type{*}*/num) => parseInt(num));
		return [...arr.slice(2), ...arr.slice(0, 2)].join(' ');
	}
	/**
	 * @name _getFrontFace
	 * @description _getFrontFace
	 * @method
	 * @param {*} pllString
	 * @param {*} pattern
	 * @returns {*}
	 */
	_getFrontFace(pllString, pattern) {
		const rotationOrder = ['front', 'left', 'back', 'right'];

		for (let i = 0; i < 4; i++) {
			if (pllString === pattern) {
				return rotationOrder[i];
			} else {
				pllString = this._rotatePllStringLeft(pllString);
			}
		}

		throw new Error(`OLL string "${pllString}" does not resolve to the pattern "${pattern}"`);
	}
}

export { PLLSolver };

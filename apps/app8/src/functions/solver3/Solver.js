/**
 * @module apps/app8/src/functions/solver3
 */

import { RubiksCube } from './models/RubiksCube.js';
import { CrossSolver } from './solvers/cross/index.js';
import { F2LSolver } from './solvers/f2l/index.js';
import { OLLSolver } from './solvers/oll/index.js';
import { PLLSolver } from './solvers/pll/index.js';
import { normalizeNotations } from './utils/index.js';
import { algorithmShortener } from './algorithm-shortener.js';

/**
 * @name Solver
 * @description Solver
 * @class
 */
class Solver {
	/**
	 * @param {string|RubiksCube} cubeState - Can be one of 3 things:
	 * 1) A string representing a Rubik's Cube state.
	 * 2) A string containing a list of moves to make from a solved state to
	 *    identify a cube state.
	 * 3) An instance of a RubiksCube.
	 * @param {*} options
	 */
	constructor(cubeState, options) {
		if (cubeState instanceof RubiksCube) {
			this.cube = cubeState;
		} else if (typeof cubeState === 'string') {
			// if there are spaces present in cubeState, assume it's a set of
			// scramble moves.
			// it's possible that one or no scramble moves are present.
			const magicNum = 6; // longest possible move string -- e.g. Rprime
			if (cubeState.split(' ').length > 1 || cubeState.length <= magicNum) {
				this.cube = RubiksCube.Solved();
				this.cube.move(cubeState);
			} else {
				this.cube = new RubiksCube(cubeState);
			}
		} else {
			throw new Error('"cubeState" is not a valid cubeState. Please provide a list of scramble moves or a string representing a cube state');
		}

		this.options = options;
		this.phases = ['cross', 'f2l', 'oll', 'pll'];
		this.progress = {};
		/**@ts-ignore */
		this.phases.forEach(phase => this.progress[phase] = []);

		/**
		 * @name afterEach
		 * @description save each partition to this.progress after each solve
		 * @function
		 * @param {*} partition
		 * @param {*} phase
		 * @returns {*}
		 */
		const afterEach = (partition, phase) => {
			this._updateProgress(partition, phase);
		};

		this.currentPhase = null; // good for debugging
		this.currentSolver = null; // good for debugging

		this.crossSolver = new CrossSolver(this.cube, this.options);
		this.f2lSolver = new F2LSolver(this.cube, this.options);
		this.ollSolver = new OLLSolver(this.cube, this.options);
		this.pllSolver = new PLLSolver(this.cube, this.options);

		this.afterEach('all', afterEach);
	}

	/**
	 * @name afterEach
	 * @description afterEach
	 * @method
	 * @param {*} phases
	 * @param {*} callback
	 * @returns {*}
	 */
	afterEach(phases, callback) {
		// argument parsing
		if (typeof phases === 'function') {
			// if first argument is a function, default phases to 'all'
			callback = phases;
			phases = 'all';
		} else if (typeof phases === 'string') {
			if (phases === 'all') {
				// 'all': shortcut for array of all phases
				phases = this.phases.slice();
			} else {
				// lastly turn phases into an array
				phases = [phases];
			}
		}

		// error handling
		if (typeof callback !== 'function') {
			throw new Error('"afterEach" callback is not a function.');
		}

		// error handling
		for (const phase of phases) {
			if (!this.phases.includes(phase)) {
				throw new Error(`Phase "${phase}" isn't recognized. Please specify "cross", "f2l", "oll", "pll", or "all".`);
			}
		}

		// if everything has gone okay, add the callback
		for (const phase of phases) {
			/**@ts-ignore */
			const solver = this[`${phase}Solver`];
			solver.afterEach(callback);
		}
	}
	/**
	 * @name solve
	 * @description solve
	 * @method
	 * @returns {*}
	 */
	solve() {
		this.currentPhase = 'cross';
		this.currentSolver = this.crossSolver;
		this.crossSolver.solve();

		this.currentPhase = 'f2l';
		this.currentSolver = this.f2lSolver;
		this.f2lSolver.solve();

		this.currentPhase = 'oll';
		this.currentSolver = this.ollSolver;
		this.ollSolver.solve();

		this.currentPhase = 'pll';
		this.currentSolver = this.pllSolver;
		this.pllSolver.solve();
	}
	/**
	 * @name getmoves
	 * @description getMoves
	 * @method
	 * @returns {*}
	 */
	getMoves() {
		/**@type{*} */
		let moves = [];

		Object.keys(this.progress).forEach(phase => {
			/**@ts-ignore */
			const partitions = this.progress[phase];
			partitions.forEach((/**@type{*} */partition) => moves.push(...partition.moves));
		});

		moves = normalizeNotations(moves);

		return moves.join(' ');
	}
	/**
	 * @name getPartitions
	 * @description getPartitions
	 * @method
	 * @returns {*}
	 */
	getPartitions() {
		const ret = {};
		const phases = Object.keys(this.progress);
		phases.forEach(phase => {
			/**@ts-ignore */
			const partitions = this.progress[phase];

			if (partitions.length === 1) {
				/**@ts-ignore */
				ret[phase] = algorithmShortener(partitions[0].moves);
			} else {
				/**@type{*[]} */
				const phaseMoves = [];
				/**@ts-ignore */
				this.progress[phase].forEach(partition => {
					phaseMoves.push(algorithmShortener(partition.moves));
				});
				/**@ts-ignore */
				ret[phase] = phaseMoves;
			}
		});

		return ret;
	}
	/**
	 * @name isCrossEdgeSolved
	 * @description isCrossEdgeSolved
	 * @method
	 * @param {*} edge
	 * @returns {*}
	 */
	isCrossEdgeSolved(edge) {
		return this.crossSolver.isEdgeSolved(edge);
	}
	/**
	 * @name isF2LPairSolved
	 * @description isF2LPairSolved
	 * @method
	 * @param {{corner:*, edge:*}} param
	 * @returns {*}
	 */
	isF2LPairSolved({ corner, edge }) {
		return this.f2lSolver.isPairSolved({ corner, edge });
	}
	/**
	 * @name isOLLSolved
	 * @description isOLLSolved
	 * @method
	 * @returns {*}
	 */
	isOLLSolved() {
		return this.ollSolver.isSolved();
	}
	/**
	 * @name isPLLSolved
	 * @description isPLLSolved
	 * @method
	 * @returns {*}
	 */
	isPLLSolved() {
		return this.pllSolver.isSolved();
	}
	/**
	 * @name _updateProgress
	 * @description _updateProgress
	 * @method
	 * @param {*} partition
	 * @param {*} phase
	 * @returns {*}
	 */
	_updateProgress(partition, phase) {
		/**@ts-ignore */
		this.progress[phase].push(partition);
	}
}

export { Solver };

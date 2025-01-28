/**
 * @module apps/app8/src/functions/solver3/solvers/basesolver
 */

import { RubiksCube } from '../models/RubiksCube.js';
import { transformNotations } from '../utils/index.js';

/**
 * @name BaseSolver
 * @description BaseSolver
 * @class
 */
class BaseSolver {
	/**
	 * Solves the first step following the Fridrich Method: the cross. Solves the
	 * cross on the UP face by default.
	 *
	 * @param {string|RubiksCube} rubiksCube - This can either be a 54-character
	 * long string representing the cube state (in this case it will have to
	 * "build" another rubik's Cube), or an already built RubiksCube object.
	 */
	constructor(rubiksCube, options = {}) {
		this.cube = typeof rubiksCube === 'string' ? new RubiksCube(rubiksCube) : rubiksCube;
		this.options = options;

		this.partition = {};
		/**@ts-ignore */
		this.partitions = [];
		/**@ts-ignore */
		this.totalMoves = [];
		/**@ts-ignore */
		this._afterEachCallbacks = [];
	}

	/**
	 * @param {string|[]} notations - A string of move(s) to execute and store.
	 * @param {object} options - The options to pass to RubiksCube#move.
	 */
	move(notations, options) {
		if (typeof notations === 'string') {
			/**@ts-ignore */
			notations = notations.split(' ');
		}

		this.cube.move(notations, options);

		// this step is also in RubiksCube#move, but it is important we do it here
		// as well. The notations need to be saved to the partition correctly.
		notations = transformNotations(notations, options);

		for (const notation of notations) {
			this.totalMoves.push(notation);
		}
	}
	/**
	 * @name afterEach
	 * @description afterEach
	 * @method
	 * @param {*} callback
	 * @returns {void}
	 */
	afterEach(callback) {
		this._afterEachCallbacks.push(callback);
	}

	/**
	 * @name _triggerAfterEach
	 * @description _triggerAfterEach
	 * @method
	 * @param {...*} callbackArgs - The arguments to call the function with.
	 * @returns {void}
	 */
	_triggerAfterEach(...callbackArgs) {
		this._afterEachCallbacks.forEach(fn => fn(...callbackArgs));
	}

	/**
	 * @name _solve
	 * @description Solves the edge and/or corner and returns information about the state
	 * about them right before they are solved. It's important to construct the
	 * object in steps for debugging, so that we can still have access to e.g.
	 * the case number if the solve method fails.
	 * @method
	 * @returns {*}
	 */
	_solve(cubies = {}) {

		this.partition = {};
		/**@ts-ignore */
		this.partition.cubies = cubies;

		/**@ts-ignore */
		const { corner, edge } = cubies;

		/**@ts-ignore */
		this.partition.caseNumber = this._getCaseNumber({ corner, edge });

		/**@ts-ignore */
		this._solveCase(this.partition.caseNumber, { corner, edge });
		/**@ts-ignore */		
		this.partition.moves = this.totalMoves;

		this.totalMoves = [];
		/**@ts-ignore */
		if (!this._overrideAfterEach) {
			/**@ts-ignore */
			this._triggerAfterEach(this.partition, this.phase);
		}

		return this.partition;
	}
	/**
	 * @name _solveCase
	 * @description _solveCase
	 * @method
	 * @param {*} caseNumber
	 * @param {*} cubies
	 * @returns {void}
	 */
	_solveCase(caseNumber, cubies = {}) {
		const { corner, edge } = cubies;
		/**@ts-ignore */
		this[`_solveCase${caseNumber}`]({ corner, edge });
	}
}

export { BaseSolver };

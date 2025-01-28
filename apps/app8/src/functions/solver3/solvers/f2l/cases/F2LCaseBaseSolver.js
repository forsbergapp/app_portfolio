/**
 * @module apps/app8/src/functions/solver3/solvers/f2l
 */

import { F2LBaseSolver } from '../F2LBaseSolver.js';

/**
 * @name F2LCaseBaseSolver
 * @description F2LCaseBaseSolver
 * @class
 */
class F2LCaseBaseSolver extends F2LBaseSolver {
	/**
	 * @name solve
	 * @description solve
	 * @method
	 * @param {{corner:*, edge:*}} case
	 * @returns {*}
	 */
	solve({ corner, edge }) {
		return this._solve({ corner, edge });
	}
}

export { F2LCaseBaseSolver };

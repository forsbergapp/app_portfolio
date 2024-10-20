/**
 * @module apps/app7/src/functions/solver3/solvers/f2l
 */

import { F2LBaseSolver } from '../F2LBaseSolver.js';

class F2LCaseBaseSolver extends F2LBaseSolver {
	solve({ corner, edge }) {
		return this._solve({ corner, edge });
	}
}

export { F2LCaseBaseSolver };

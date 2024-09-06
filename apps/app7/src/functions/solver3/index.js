/**
 * @module apps/app7/src/functions/solver3
 */

import { Solver } from './Solver.js';
import { algorithmShortener } from './algorithm-shortener.js';

// solver constructor
export { Solver };

// models
//export { Cubie } from './models/Cubie.js';
//export { RubiksCube } from './models/RubiksCube.js';

// solvers
export { CrossSolver } from './solvers/cross/index.js';
export { F2LSolver } from './solvers/f2l/index.js';
export { OLLSolver } from './solvers/oll/index.js';
export { PLLSolver } from './solvers/pll/index.js';

// algorithm shortener
export { algorithmShortener } from './algorithm-shortener.js';

/**
 * @param {string} cubeState - The string representing a cube state.
 * @param {object} options
 * @prop {boolean} options.partitioned - Whether to separate moves according to
 * phase.
 */
export default (cubeState, options = {}) => {
	const solver = new Solver(cubeState, options);
	solver.solve();

	if (options.partitioned) {
		return solver.getPartitions();
	} else {
		return algorithmShortener(solver.getMoves());
	}
};

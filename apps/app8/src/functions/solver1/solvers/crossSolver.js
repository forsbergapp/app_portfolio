/**
 * @module apps/app8/src/functions/solver1/solvers/crosssolver
 */

import {
  createEdgePermutationTable,
  createEdgeOrientationTable,
} from '../MoveTable.js';

import Search from '../Search.js';

/**
 * @name CrossSearch
 * @description CrossSearch
 * @function
 * @returns {*}
 */
export const CrossSearch = new Search(() => ({
  moveTables: [
    createEdgePermutationTable({
      name: 'EdgePermutation',
      affected: [4, 5, 6, 7],
    }),

    createEdgeOrientationTable({
      name: 'EdgeOrientation',
      affected: [4, 5, 6, 7],
    }),
  ],

  pruningTables: [['EdgePermutation'], ['EdgeOrientation']],
}));

/**
 * @name crossSolver 
 * @description crossSolver 
 * @function
 * @param {*} scramble
 * @returns {*}
 */
const crossSolver = scramble => CrossSearch.solve({ scramble });

export default crossSolver;

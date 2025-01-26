/**
 * @module apps/app7/src/functions/solver1/solvers/eolinesolver
 */

import {
  createEdgePermutationTable,
  createEdgeOrientationTable,
} from '../MoveTable.js';

import Search from '../Search.js';

/**
 * @name EOLineSearch
 * @description EOLineSearch
 * @function
 * @returns {*}
 */
export const EOLineSearch = new Search(() => ({
  moveTables: [
    createEdgeOrientationTable({
      name: 'EdgeOrientation',
      affected: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    }),

    createEdgePermutationTable({
      name: 'EdgePermutation',
      affected: [5, 7],
    }),
  ],

  pruningTables: [['EdgeOrientation'], ['EdgePermutation']],
}));

/**
 * @name EOLineSolver
 * @description EOLineSolver
 * @param {*} scramble
 * @function
 * @returns {*}
 */
const EOLineSolver = scramble => EOLineSearch.solve({ scramble });

export default EOLineSolver;

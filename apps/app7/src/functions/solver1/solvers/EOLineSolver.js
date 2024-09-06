/**
 * @module apps/app7/src/functions/solver1/solvers/eolinesolver
 */

import {
  createEdgePermutationTable,
  createEdgeOrientationTable,
} from '../MoveTable.js';

import Search from '../Search.js';

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
 * @param {*} scramble
 */
const EOLineSolver = scramble => EOLineSearch.solve({ scramble });

export default EOLineSolver;

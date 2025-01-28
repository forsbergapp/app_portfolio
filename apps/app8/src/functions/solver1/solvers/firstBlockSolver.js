/**
 * @module apps/app8/src/functions/solver1/solvers/firstblocksolver
 */

import {
  createEdgePermutationTable,
  createCornerPermutationTable,
  createEdgeOrientationTable,
  createCornerOrientationTable,
} from '../MoveTable.js';

import Search from '../Search.js';

/**
 * @name FirstBlockSearch
 * @description FirstBlockSearch
 * @function
 * @returns {*}
 */
export const FirstBlockSearch = new Search(() => ({
  moveTables: [
    createEdgeOrientationTable({
      name: 'EdgeOrientation',
      affected: [6, 9, 10],
    }),

    createCornerOrientationTable({
      name: 'CornerOrientation',
      affected: [5, 6],
    }),

    createEdgePermutationTable({
      name: 'EdgePermutation',
      affected: [6, 9, 10],
    }),

    createCornerPermutationTable({
      name: 'CornerPermutation',
      affected: [5, 6],
    }),
  ],

  pruningTables: [
    ['EdgeOrientation', 'CornerPermutation'],
    ['CornerOrientation', 'CornerPermutation'],
    ['EdgePermutation', 'CornerPermutation'],
  ],
}));
/**
 * @name firstBlockSolver
 * @description firstBlockSolver
 * @param {*} scramble
 * @function
 * @returns {*}
 */
const firstBlockSolver = scramble => FirstBlockSearch.solve({ scramble });

export default firstBlockSolver;

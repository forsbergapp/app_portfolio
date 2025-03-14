/**
 * @module apps/app8/src/functions/solver1/solvers/xcrosssolver
 */

import {
  createEdgePermutationTable,
  createCornerPermutationTable,
  createEdgeOrientationTable,
  createCornerOrientationTable,
} from '../MoveTable.js';

import Search from '../Search.js';

/**
 * @name XCrossSearch
 * @description XCrossSearch
 * @function
 * @returns {*}
 */
export const XCrossSearch = new Search(() => ({
  moveTables: [
    createEdgePermutationTable({
      name: 'EdgePermutation',
      affected: [4, 5, 6, 7, 9],
    }),

    createEdgeOrientationTable({
      name: 'EdgeOrientation',
      affected: [4, 5, 6, 7, 9],
    }),

    createCornerPermutationTable({
      name: 'CornerPermutation',
      affected: [5],
    }),

    createCornerOrientationTable({
      name: 'CornerOrientation',
      affected: [5],
    }),
  ],

  pruningTables: [
    ['EdgePermutation', 'CornerPermutation'],
    ['EdgeOrientation', 'CornerOrientation'],
  ],
}));
/**
 * @name XCrossSolver
 * @description XCrossSolver
 * @function
 * @param {*} scramble
 * @returns {*}
 */
const XCrossSolver = scramble => XCrossSearch.solve({ scramble });

export default XCrossSolver;

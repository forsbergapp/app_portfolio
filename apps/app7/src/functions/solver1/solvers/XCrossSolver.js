/**
 * @module apps/app7/src/functions/solver1/solvers/xcrosssolver
 */

import {
  createEdgePermutationTable,
  createCornerPermutationTable,
  createEdgeOrientationTable,
  createCornerOrientationTable,
} from '../MoveTable.js';

import Search from '../Search.js';

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
 * @param {*} scramble
 */
const XCrossSolver = scramble => XCrossSearch.solve({ scramble });

export default XCrossSolver;

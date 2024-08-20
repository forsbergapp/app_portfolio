import {
  createEdgePermutationTable,
  createEdgeOrientationTable,
} from '../MoveTable.js';

import Search from '../Search.js';

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
 * @param {*} scramble
 */
const crossSolver = scramble => CrossSearch.solve({ scramble });

export default crossSolver;

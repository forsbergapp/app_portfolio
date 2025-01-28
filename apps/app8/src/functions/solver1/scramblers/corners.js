/**
 * @module apps/app8/src/functions/solver1/scramblers/corners
 */

import getScrambleForPieces from './scramblePieces.js';

/**
 * @name getScramble
 * @description getScramble
 * @function
 * @returns {*}
 */
const getScramble = () => getScrambleForPieces(
  [],

  [0, 1, 2, 3, 4, 5, 6, 7],
);

export default getScramble;

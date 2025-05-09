/**
 * @module apps/app8/src/functions/solver1/scramblers/pll
 */

import getScrambleForPieces from './scramblePieces.js';
import { Edges, Corners } from '../cube.js';

/**
 * @name getScramble
 * @description getScramble
 * @function
 * @returns {*}
 */
const getScramble = () => getScrambleForPieces(
  [Edges.UR, Edges.UF, Edges.UL, Edges.UB],

  [Corners.URF, Corners.UFL, Corners.ULB, Corners.UBR],

  [],

  [],
);

export default getScramble;

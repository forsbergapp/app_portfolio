/**
 * @module apps/app8/src/functions/solver1/scramblers/lse
 */

import getScrambleForPieces from './scramblePieces.js';
import { Edges } from '../cube.js';

/**
 * @name LSE_EDGES
 * @description LSE_EDGES
 * @constant
 */
const LSE_EDGES = [Edges.UR, Edges.UF, Edges.UL, Edges.UB, Edges.DF, Edges.DB];

/**
 * @name getScramble
 * @description getScramble
 * @function
 * @returns {*}
 */
const getScramble = () => getScrambleForPieces(
  LSE_EDGES,

  [],

  LSE_EDGES,

  [],

  false,

  true,
);

export default getScramble;

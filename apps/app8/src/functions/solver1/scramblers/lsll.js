/**
 * @module apps/app8/src/functions/solver1/scramblers/lsll
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
  [Edges.UR, Edges.UF, Edges.UL, Edges.UB, Edges.FR],

  [Corners.URF, Corners.UFL, Corners.ULB, Corners.UBR, Corners.DFR],
);

export default getScramble;

/**
 * @module apps/app8/src/functions/solver1/scramblers/zzls
 */

import getScrambleForPieces from './scramblePieces.js';
import { Edges, Corners } from '../cube.js';

/**
 * @name CORNERS
 * @description CORNERS
 * @constant
 */
const CORNERS = [
  Corners.URF,
  Corners.UFL,
  Corners.ULB,
  Corners.UBR,
  Corners.DFR,
];

/**
 * @name getScramble
 * @description getScramble
 * @function
 * @returns {*}
 */
const getScramble = () => getScrambleForPieces(
  [Edges.UR, Edges.UF, Edges.UL, Edges.UB, Edges.FR],

  CORNERS,

  [],

  CORNERS,
);

export default getScramble;

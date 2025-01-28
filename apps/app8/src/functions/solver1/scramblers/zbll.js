/**
 * @module apps/app8/src/functions/solver1/scramblers/zbll
 */

import getScrambleForPieces from './scramblePieces.js';
import { Edges, Corners } from '../cube.js';

/**
 * @name EDGES
 * @description EDGES
 * @constant
 */
const EDGES = [Edges.UR, Edges.UF, Edges.UL, Edges.UB];

/**
 * @name CORNERS
 * @description CORNERS
 * @constant
 */
const CORNERS = [Corners.URF, Corners.UFL, Corners.ULB, Corners.UBR];

/**
 * @name getScramble
 * @description getScramble
 * @function
 * @returns {*}
 */
const getScramble = () => getScrambleForPieces(
  EDGES,

  CORNERS,

  [],

  CORNERS,
);

export default getScramble;

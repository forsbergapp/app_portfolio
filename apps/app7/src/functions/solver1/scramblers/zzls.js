/**
 * @module apps/app7/src/functions/solver1/scramblers/zzls
 */

import getScrambleForPieces from './scramblePieces.js';
import { Edges, Corners } from '../cube.js';

const CORNERS = [
  Corners.URF,
  Corners.UFL,
  Corners.ULB,
  Corners.UBR,
  Corners.DFR,
];

const getScramble = () => getScrambleForPieces(
  [Edges.UR, Edges.UF, Edges.UL, Edges.UB, Edges.FR],

  CORNERS,

  [],

  CORNERS,
);

export default getScramble;

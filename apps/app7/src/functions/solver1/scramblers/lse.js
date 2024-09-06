/**
 * @module apps/app7/src/functions/solver1/scramblers/lse
 */

import getScrambleForPieces from './scramblePieces.js';
import { Edges } from '../cube.js';

const LSE_EDGES = [Edges.UR, Edges.UF, Edges.UL, Edges.UB, Edges.DF, Edges.DB];

const getScramble = () => getScrambleForPieces(
  LSE_EDGES,

  [],

  LSE_EDGES,

  [],

  false,

  true,
);

export default getScramble;

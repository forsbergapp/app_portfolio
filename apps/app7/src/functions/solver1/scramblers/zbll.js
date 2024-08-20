import getScrambleForPieces from './scramblePieces.js';
import { Edges, Corners } from '../cube.js';

const EDGES = [Edges.UR, Edges.UF, Edges.UL, Edges.UB];

const CORNERS = [Corners.URF, Corners.UFL, Corners.ULB, Corners.UBR];

const getScramble = () => getScrambleForPieces(
  EDGES,

  CORNERS,

  [],

  CORNERS,
);

export default getScramble;

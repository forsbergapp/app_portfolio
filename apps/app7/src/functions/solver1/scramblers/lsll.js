import getScrambleForPieces from './scramblePieces.js';
import { Edges, Corners } from '../cube.js';

const getScramble = () => getScrambleForPieces(
  [Edges.UR, Edges.UF, Edges.UL, Edges.UB, Edges.FR],

  [Corners.URF, Corners.UFL, Corners.ULB, Corners.UBR, Corners.DFR],
);

export default getScramble;

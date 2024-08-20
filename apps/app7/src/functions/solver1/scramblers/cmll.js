import getScrambleForPieces from './scramblePieces.js';
import { Edges, Corners } from '../cube.js';

const getScramble = () => getScrambleForPieces(
  [Edges.UR, Edges.UF, Edges.UL, Edges.UB, Edges.DF, Edges.DB],

  [Corners.URF, Corners.UFL, Corners.ULB, Corners.UBR],
);

export default getScramble;

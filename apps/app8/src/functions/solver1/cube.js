/**
 * @module apps/app8/src/functions/solver1/cube
 */

import { parseAlgorithm } from './algorithms.js';
import { rotateParts } from './tools.js';

export const Edges = {
  UR: 0,
  UF: 1,
  UL: 2,
  UB: 3,
  DR: 4,
  DF: 5,
  DL: 6,
  DB: 7,
  FR: 8,
  FL: 9,
  BL: 10,
  BR: 11,
};

export const Corners = {
  URF: 0,
  UFL: 1,
  ULB: 2,
  UBR: 3,
  DFR: 4,
  DLF: 5,
  DBL: 6,
  DBR: 7,
};

/**
 * @description We define moves as the four pieces which are
 *              rotated in a circular fashion.
 * @constant
 */
const edgeMoves = [
  [1, 8, 5, 9],
  [0, 11, 4, 8],
  [1, 2, 3, 0],
  [3, 10, 7, 11],
  [2, 9, 6, 10],
  [5, 4, 7, 6],
];

/**
 * @description Corner moves are defined in the same way as
 *              the edge moves are defined.
 * @constant
 */
const cornerMoves = [
  [1, 0, 4, 5],
  [0, 3, 7, 4],
  [0, 1, 2, 3],
  [3, 2, 6, 7],
  [2, 1, 5, 6],
  [5, 4, 7, 6],
];

/**
 * @name permutationMove
 * @description Helper function to perform a corner or edge permutation move
 *              to the given permutation vector.
 * @constant
 * @param {*} pieces
 * @param {*} moveIndex
 * @param {*} moves
 * @returns {*}
 */
const permutationMove = (pieces, moveIndex, moves) => {
  let updated = pieces;
  const move = moves[Math.floor(moveIndex / 3)];
  const pow = moveIndex % 3;

  for (let i = 0; i <= pow; i += 1) {
    updated = rotateParts(updated, move);
  }

  return updated;
};

/**
 * @name edgePermutationMove
 * @description Perform a move to an edge permutaion vector.
 * @constant
 * @param {*} pieces
 * @param {*} moveIndex
 * @returns {*}
 */
export const edgePermutationMove = (pieces, moveIndex) => permutationMove(pieces, moveIndex, edgeMoves);

/**
 * @name cornerPermutationMove
 * @description Perform a move to a corner permuttaion vector.
 * @function
 * @param {*} pieces
 * @param {*} moveIndex
 * @returns {*}
 */
export const cornerPermutationMove = (pieces, moveIndex) => permutationMove(pieces, moveIndex, cornerMoves);

/**
 * @name edgeOrientationMove
 * @description Perform a move to an edge orientation vector.
 * @function
 * @param {*} pieces
 * @param {*} moveIndex
 * @returns {*}
 */
export const edgeOrientationMove = (pieces, moveIndex) => {
  const moveNumber = Math.floor(moveIndex / 3);
  const move = edgeMoves[moveNumber];
  const pow = moveIndex % 3;

  const updatedPieces = edgePermutationMove(pieces, moveIndex);

  // Only quarter moves of the F and B faces affect the edge orientation.
  if ((moveNumber === 0 || moveNumber === 3) && pow % 2 === 0) {
    for (let i = 0; i < 4; i += 1) {
      updatedPieces[move[i]] = (updatedPieces[move[i]] + 1) % 2;
    }
  }

  return updatedPieces;
};

/**
 * @name cornerOrientationMove
 * @description Perform a move to a corner orientation vector.
 * @param {*} pieces
 * @param {*} moveIndex
 * @returns {*}
 */
export const cornerOrientationMove = (pieces, moveIndex) => {
  const moveNumber = Math.floor(moveIndex / 3);
  const move = cornerMoves[moveNumber];
  const pow = moveIndex % 3;

  const updatedPieces = cornerPermutationMove(pieces, moveIndex);

  // Only quarter moves of any slice but the U and D slices
  // affect the corner orientation.
  if (moveNumber !== 2 && moveNumber !== 5 && pow % 2 === 0) {
    for (let i = 0; i < 4; i += 1) {
      updatedPieces[move[i]] = (updatedPieces[move[i]] + ((i + 1) % 2) + 1) % 3;
    }
  }

  return updatedPieces;
};

/**
 * @description The identity cube.
 * @constant
 */
export const identity = {
  ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  cp: [0, 1, 2, 3, 4, 5, 6, 7],
  co: [0, 0, 0, 0, 0, 0, 0, 0],
};

/**
 * @name doAlgorithm
 * @description Performs an algorithm to a cube on the cubie level.
 * @param {*} algorithm
 * @param {*} cube
 * @returns {*}
 */
export const doAlgorithm = (algorithm, cube = identity) => {
  let ep = cube.ep.slice();
  let eo = cube.eo.slice();
  let cp = cube.cp.slice();
  let co = cube.co.slice();

  parseAlgorithm(algorithm).forEach((move) => {
    ep = edgePermutationMove(ep, move);
    eo = edgeOrientationMove(eo, move);
    cp = cornerPermutationMove(cp, move);
    co = cornerOrientationMove(co, move);
  });

  return {
    ep, eo, cp, co,
  };
};

/**
 * @name allMoves
 * @description All the moves which can be performed on a cube.
 * @constant
 */
export const allMoves = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
];

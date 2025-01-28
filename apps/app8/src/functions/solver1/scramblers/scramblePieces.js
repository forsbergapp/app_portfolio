/**
 * @module apps/app8/src/functions/solver1/scramblers/scramblepieces
 */

import {
  getPermutationFromIndex,
  getOrientationFromIndex,
  getParity,
} from '../coordinates.js';

import { getRandomInt, factorial, rotateParts } from '../tools.js';

import { solveCoordinates } from '../solvers/kociemba.js';

/**
 * @name UPPER_FACE_POSITIONS
 * @description UPPER_FACE_POSITIONS
 * @constant
 */
const UPPER_FACE_POSITIONS = [0, 1, 2, 3];

/**
 * @name getOrientationFromEnabled
 * @description Returns an orientation vector where all pieces
 *              are solved, except for the given enabled pieces.
 * @param {*} enabled
 * @param {*} flipCount
 * @param {*} size
 * @returns {*}
 */
const getOrientationFromEnabled = (enabled, flipCount, size) => {
  const pieces = getOrientationFromIndex(
    getRandomInt(0, flipCount ** (enabled.length - 1)),
    enabled.length,
    flipCount,
  );

  const orientation = Array(size).fill(0);

  enabled.forEach((/**@type{*}*/piece, /**@type{number}*/i) => {
    orientation[piece] = pieces[i];
  });

  return orientation;
};

/**
 * @name getPermutationFromEnabled
 * @description Returns a permutation vector where all pieces are
 *              solved, except for the given enabled pieces.
 * @function
 * @param {*} enabled
 * @param {*} size
 * @returns {*}
 */
const getPermutationFromEnabled = (enabled, size) => {
  const pieces = getPermutationFromIndex(
    getRandomInt(0, factorial(enabled.length)),
    enabled.slice(0),
    enabled.length,
  );

  const permutation = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].slice(0, size);

  enabled.forEach((/**@type{*}*/piece, /**@type{number}*/i) => {
    permutation[piece] = pieces[i];
  });

  return permutation;
};

/**
 * @name adjustUpperFace
 * @description adjustUpperFace
 * @function
 * @param {*} pieces
 * @param {*} [amount]
 * @returns {*}
 */
export const adjustUpperFace = (pieces, amount) => {
  amount = amount || getRandomInt(0, 4);

  for (let i = 0; i < amount; i += 1) {
    pieces = rotateParts(pieces, UPPER_FACE_POSITIONS);
  }

  return pieces;
};

/**
 * @name getScrambleForPieces
 * @description Generates a random scramble where all pieces are solved, except
 *              for the provided edges and corners, which will be scrambled randomly.
 * @function
 * @returns {*}
 */
export const getScrambleForPieces = (
  /**@ts-ignore */
  permutationEdges,
  /**@ts-ignore */
  permutationCorners,
  orientationEdges = permutationEdges,
  orientationCorners = permutationCorners,
  adjustEdges = false,
  adjustCorners = false,
) => {
  let eo;
  let ep;
  let co;
  let cp;

  do {
    eo = getOrientationFromEnabled(orientationEdges, 2, 12);

    ep = getPermutationFromEnabled(permutationEdges, 12);

    if (adjustEdges) {
      ep = adjustUpperFace(ep);
    }

    co = getOrientationFromEnabled(orientationCorners, 3, 8);

    cp = getPermutationFromEnabled(permutationCorners, 8);

    if (adjustCorners) {
      cp = adjustUpperFace(cp);
    }
  } while (getParity(ep) !== getParity(cp));

  return solveCoordinates(eo, ep, co, cp);
};

export default getScrambleForPieces;

/**
 * @module apps/app7/src/functions/solver1/movetable
 */

import {
  getPermutationFromIndex,
  getIndexFromPermutation,
  getOrientationFromIndex,
  getIndexFromOrientation,
} from './coordinates.js';

import {
  edgePermutationMove,
  cornerPermutationMove,
  edgeOrientationMove,
  cornerOrientationMove,
  allMoves,
} from './cube.js';

import { factorial } from './tools.js';

/**
 * Create a function which performs a move on a coordinate.
 * @param {*} getVector
 * @param {*} doMove
 * @param {*} getIndex
 */
const createMoveHandler = (getVector, doMove, getIndex) => (/**@type{*}*/index, /**@type{*}*/move) => {
  let vector = getVector(index);
  vector = doMove(vector, move);
  return getIndex(vector);
};

export class MoveTable {
  constructor(/**@type{*}*/settings) {
    // A name must be provided if the generic solver is being used, as
    // we use them to create the pruning tables.
    this.name = settings.name;

    // Some tables in the Kociemba solver define their own size, as
    // they are a subset of another already generated helper table.
    this.size = settings.size;

    this.defaultIndex = settings.defaultIndex || 0;
    this.solvedIndexes = settings.solvedIndexes || [this.defaultIndex];

    // We allow defining a custom function that returns the updated
    // index. This is useful for helper tables which are subsets
    // of already generated tables.
    if (settings.doMove) {
      this.doMove = (/**@type{*}*/index, /**@type{*}*/move) => settings.doMove(this.table, index, move);
    }

    if (settings.table) {
      this.table = settings.table;

      // If a pre-generated table is provide, do not generate another one.
      return;
    }

    const cubieMove = createMoveHandler(
      settings.getVector,
      settings.cubieMove,
      settings.getIndex,
    );

    this.createMoveTable(settings.size, cubieMove, settings.moves);
  }

  doMove(/**@type{*}*/index, /**@type{*}*/move) {
    return this.table[index][move];
  }
  /**
   * @param {*} size
   * @param {*} cubieMove
   * @param {*} moves
   */
  createMoveTable(size, cubieMove, moves = allMoves) {
    this.table = [];

    for (let i = 0; i < size; i += 1) {
      this.table.push([]);
    }

    // Create a matrix which stores the result after
    // applying a move to a coordinate.
    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < moves.length; j += 1) {
        const move = moves[j];

        if (!this.table[i][move]) {
          // Assign both the value and its inverse at once
          // to avoid exess computing on the cubie level.
          const result = cubieMove(i, move);
          const inverse = move - 2 * (move % 3) + 2;
          this.table[i][move] = result;
          this.table[result][inverse] = i;
        }
      }
    }
  }
}
/**
 * @param {*} settings
 */
export const createCornerPermutationTable = settings => new MoveTable({
  name: settings.name,
  moves: settings.moves,
  defaultIndex: getIndexFromPermutation(
    [0, 1, 2, 3, 4, 5, 6, 7],
    settings.affected,
    settings.reversed,
  ),
  size: settings.size || factorial(8) / factorial(8 - settings.affected.length),
  /**
   * @param {*} index
   */
  getVector: index => getPermutationFromIndex(
    index,
    settings.affected.slice(),
    8,
    settings.reversed,
  ),
  cubieMove: cornerPermutationMove,
  /**
   * @param {*} pieces
   */
  getIndex: pieces => getIndexFromPermutation(pieces, settings.affected, settings.reversed),
});
/**
 * @param {*} settings
 */
export const createEdgePermutationTable = settings => new MoveTable({
  name: settings.name,
  moves: settings.moves,
  defaultIndex: getIndexFromPermutation(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    settings.affected,
    settings.reversed,
  ),
  size: settings.size || factorial(12) / factorial(12 - settings.affected.length),
  /**
   * @param {*} index
   */
  getVector: index => getPermutationFromIndex(
    index,
    settings.affected.slice(),
    12,
    settings.reversed,
  ),
  cubieMove: edgePermutationMove,
  /**
   * @param {*} pieces
   */
  getIndex: pieces => getIndexFromPermutation(pieces, settings.affected, settings.reversed),
});
/**
 * @param {*} affected
 * @param {*} numPieces
 * @param {*} numStates
 */
const getCorrectOrientations = (affected, numPieces, numStates) => {
  const indexes = [];

  const size = numStates ** (numPieces - 1);

  const target = numStates ** (numPieces - affected.length - 1);

  for (let i = 0; i < size && indexes.length < target; i += 1) {
    const orientation = getOrientationFromIndex(i, numPieces, numStates);

    if (affected.every((/**@type{*}*/piece) => orientation[piece] === 0)) {
      indexes.push(i);
    }
  }

  return indexes;
};
/**
 * @param {*} settings
 */
export const createEdgeOrientationTable = settings => new MoveTable({
  name: settings.name,
  size: 2048,
  solvedIndexes: getCorrectOrientations(settings.affected, 12, 2),
  /**
   * @param {*} index
   */
  getVector: index => getOrientationFromIndex(index, 12, 2),
  cubieMove: edgeOrientationMove,
  /**
   * @param {*} pieces
   */
  getIndex: pieces => getIndexFromOrientation(pieces, 2),
});
/**
 * @param {*} settings
 */
export const createCornerOrientationTable = settings => new MoveTable({
  name: settings.name,
  size: 2187,
  solvedIndexes: getCorrectOrientations(settings.affected, 8, 3),
  /**
   * @param {*} index
   */
  getVector: index => getOrientationFromIndex(index, 8, 3),
  cubieMove: cornerOrientationMove,
  /**
   * @param {*} pieces
   */
  getIndex: pieces => getIndexFromOrientation(pieces, 3),
});

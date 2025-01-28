/**
 * @module apps/app8/src/functions/solver1/movetable
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
 * @name createMoveHandler
 * @description Create a function which performs a move on a coordinate.
 * @function
 * @param {function} getVector
 * @param {function} doMove
 * @param {function} getIndex
 * @returns {function}
 */
const createMoveHandler = (getVector, doMove, getIndex) => (/**@type{number}*/index, /**@type{number}*/move) => {
  let vector = getVector(index);
  vector = doMove(vector, move);
  return getIndex(vector);
};
/**
 * @name MoveTable
 * @description  MoveTable
 * @class
 */
export class MoveTable {
  /**
   * @param {*} settings
   */
  constructor(settings) {
    // A name must be provided if the generic solver is being used, as
    // we use them to create the pruning tables.
    /**@type{string}*/
    this.name = settings.name;

    // Some tables in the Kociemba solver define their own size, as
    // they are a subset of another already generated helper table.
    /**@type{number}*/
    this.size = settings.size;
    /**@type{number}*/
    this.defaultIndex = settings.defaultIndex || 0;
    /**@type{number[]}*/
    this.solvedIndexes = settings.solvedIndexes || [this.defaultIndex];

    if (settings.doMove) {
      /**
       * @name doMove
       * @description We allow defining a custom function that returns the updated
       *              index. This is useful for helper tables which are subsets
       *              of already generated tables.
       * @function
       * @method
       * @returns {*}
       */
      this.doMove = (/**@type{*}*/index, /**@type{*}*/move) => settings.doMove(this.table, index, move);
    }

    if (settings.table) {
      /**@type{*} */
      this.table = settings.table;

      // If a pre-generated table is provide, do not generate another one.
      return;
    }
    /**
     * @name cubieMove
     * @description cubieMove
     * @function
     * @returns {function}
     */
    const cubieMove = createMoveHandler(
      settings.getVector,
      settings.cubieMove,
      settings.getIndex,
    );

    this.createMoveTable(settings.size, cubieMove, settings.moves);
  }

  /**
   * @name  doMove
   * @description doMove
   * @method
   * @param {number} index
   * @param {number} move
   * @returns {number}
   */
  doMove(index, move) {
    return this.table[index][move];
  }
  /**
   * @name createMoveTable
   * @description createMoveTable
   * @method
   * @param {number} size
   * @param {function} cubieMove
   * @param {number[]} moves
   * @returns {void}
   */
  createMoveTable(size, cubieMove, moves = allMoves) {
    //replacing very slow loop with one fast statement
    //use map function to avoid server memory issue
    this.table = Array(size).fill([]).map(()=>[]);

    //original code
    //this.table = [];
    //for (let i = 0; i < size; i += 1) {
    //  this.table.push([]);
    //}

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
 * @name createCornerPermutationTable
 * @description createCornerPermutationTable
 * @function
 * @param {*} settings
 * @returns {*}
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
 * @name createEdgePermutationTable
 * @description createEdgePermutationTable
 * @function
 * @param {*} settings
 * @returns {*}
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
 * @name getCorrectOrientations
 * @description getCorrectOrientations
 * @function
 * @param {*} affected
 * @param {*} numPieces
 * @param {*} numStates
 * @returns {*}
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
 * @name createEdgeOrientationTable
 * @description createEdgeOrientationTable
 * @function
 * @param {*} settings
 * @returns {*}
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
 * @name createCornerOrientationTable
 * @description createCornerOrientationTable
 * @function
 * @param {*} settings
 * @returns {*}
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

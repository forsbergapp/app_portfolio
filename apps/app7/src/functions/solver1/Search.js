import { parseAlgorithm, formatAlgorithm, invertAlgorithm } from './algorithms.js';
import PruningTable from './PruningTable.js';
import { allMoves } from './cube.js';

class Search {
  /**
   * @param {*} createTables
   * @param {*} moves
   */
  constructor(createTables, moves = allMoves) {
    this.createTables = createTables;
    this.moves = moves;
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    const { moveTables, pruningTables } = this.createTables();

    this.moveTables = moveTables;
    /**@type{*} */
    this.pruningTables = [];

    pruningTables.forEach((/**@type{*} */moveTableNames) => {
      const moveTableIndexes = moveTableNames.map((/**@type{*} */name) => this.moveTables.map((/**@type{*} */table) => table.name).indexOf(name));

      moveTableIndexes.sort(
        (/**@type{*} */a, /**@type{*} */b) => this.moveTables[a].size - this.moveTables[b].size,
      );
      /**@type{*} */
      const mappedTables = [];

      moveTableIndexes.forEach((/**@type{*} */i) => mappedTables.push(this.moveTables[i]));

      const pruningTable = new PruningTable(mappedTables, this.moves);

      this.pruningTables.push({
        pruningTable,
        moveTableIndexes,
      });
    });
  }
  /**
   * @param {*} solution
   * @param {*} indexes
   */
  handleSolution(solution, indexes) {
    return {
      solution,
      indexes,
    };
  }
  /**
   * @param {*} indexes
   * @param {*} depth
   * @param {*} lastMove
   * @param {*} solution
   * @returns {*}
   */
  search(indexes, depth, lastMove, solution) {
    let minimumDistance = 0;

    for (let i = 0; i < this.pruningTables.length; i += 1) {
      let index = indexes[this.pruningTables[i].moveTableIndexes[0]];
      let power = 1;

      for (let j = 1; j < this.pruningTables[i].moveTableIndexes.length; j += 1) {
        power *= this.moveTables[this.pruningTables[i].moveTableIndexes[j - 1]].size;
        index += indexes[this.pruningTables[i].moveTableIndexes[j]] * power;
      }

      const distance = this.pruningTables[i].pruningTable.getPruningValue(index);

      if (distance > depth) {
        return false;
      }

      // The true minimum distance to the solved indexes is
      // given by the pruning table with the largest distance.
      if (distance > minimumDistance) {
        minimumDistance = distance;
      }
    }

    if (minimumDistance === 0) {
      return this.handleSolution(solution, indexes);
    }

    if (depth > 0) {
      for (let i = 0; i < this.moves.length; i += 1) {
        const move = this.moves[i];

        if (Math.floor(move / 3) !== Math.floor(lastMove / 3) && Math.floor(move / 3) !== Math.floor(lastMove / 3) - 3) {
          const updatedIndexes = [];

          for (let j = 0; j < indexes.length; j += 1) {
            updatedIndexes.push(this.moveTables[j].doMove(indexes[j], move));
          }

          const result = this.search(updatedIndexes, depth - 1, move, solution.concat([move]));

          if (result) {
            return result;
          }
        }
      }
    }

    return false;
  }
  /**
   * @param {*} settings
   */
  solve(settings) {
    this.initialize();

    this.settings = { maxDepth: 22, // For the Kociemba solver.
      lastMove: null,
      format: true,
      ...settings };

    const indexes = this.settings.indexes || [];

    let solutionRotation;

    if (this.settings.scramble) {
      const [moves, totalRotation] = parseAlgorithm(this.settings.scramble, true);

      if (totalRotation.length > 0) {
        solutionRotation = invertAlgorithm(totalRotation.join(' '));
      }

      for (let i = 0; i < this.moveTables.length; i += 1) {
        indexes.push(this.moveTables[i].defaultIndex);
      }

      moves.forEach((/**@type{*} */move) => {
        for (let i = 0; i < indexes.length; i += 1) {
          indexes[i] = this.moveTables[i].doMove(indexes[i], move);
        }
      });
    }

    for (let depth = 0; depth <= this.settings.maxDepth; depth += 1) {
      const solution = this.search(indexes, depth, this.settings.lastMove, []);

      if (solution) {
        if (this.settings.format) {
          const formatted = formatAlgorithm(solution.solution);

          if (solutionRotation) {
            // If we have rotations in the scramble, apply the inverse to the solution
            // and then parse again to remove the rotations. This results in a
            // solution that can be applied from the result scramble orientation.
            return formatAlgorithm(parseAlgorithm(`${solutionRotation} ${formatted}`));
          }

          return formatted;
        }

        return solution;
      }
    }

    return false;
  }
}

export default Search;
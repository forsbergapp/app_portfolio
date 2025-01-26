/**
 * @module apps/app7/src/functions/solver1
 */

import crossSolver, { CrossSearch } from './solvers/crossSolver.js';
import EOLineSolver, { EOLineSearch } from './solvers/EOLineSolver.js';
import firstBlockSolver, { FirstBlockSearch } from './solvers/firstBlockSolver.js';
import kociemba, { phaseOne, phaseTwo } from './solvers/kociemba.js';
import XCrossSolver, { XCrossSearch } from './solvers/XCrossSolver.js';
import get2GLLScramble from './scramblers/2gll.js';
import get3x3Scramble from './scramblers/3x3.js';
import getCMLLScramble from './scramblers/cmll.js';
import getCornersOnlycramble from './scramblers/corners.js';
import getEdgesOnlyScramble from './scramblers/edges.js';
import getLSEScramble from './scramblers/lse.js';
import getLSLLScramble from './scramblers/lsll.js';
import getPLLscramble from './scramblers/pll.js';
import getZBLLScramble from './scramblers/zbll.js';
import getZZLSScramble from './scramblers/zzls.js';

export default {
  /**
   * @name solve
   * @description solve
   * @function
   * @returns {*}
   */
  solve: (/**@type{*}*/scramble, /**@type{string}*/solver = 'kociemba') => {
    const solvers = {
      kociemba,
      cross: crossSolver,
      eoline: EOLineSolver,
      fb: firstBlockSolver,
      xcross: XCrossSolver,
    };
    /**@ts-ignore */
    if (solvers[solver]) {
      /**@ts-ignore */
      return solvers[solver](scramble);
    }

    throw 'Specified solver does not exist.';
  },
  /**
   * @name scramble
   * @description scramble
   * @function
   * @returns {*}
   */
  scramble: (scrambler = '3x3') => {
    const scramblers = {
      '3x3': get3x3Scramble,
      '2gll': get2GLLScramble,
      cmll: getCMLLScramble,
      corners: getCornersOnlycramble,
      edges: getEdgesOnlyScramble,
      lse: getLSEScramble,
      lsll: getLSLLScramble,
      pll: getPLLscramble,
      zbll: getZBLLScramble,
      zzls: getZZLSScramble,
    };
    /**@ts-ignore */
    if (scramblers[scrambler]) {
      /**@ts-ignore */
      return scramblers[scrambler]();
    }

    throw 'Specified scrambler does not exist.';
  },

  /**
   * @name initialize
   * @description initialize
   * @function
   * @returns {*}
   */
  initialize: (/**@type{*}*/solver) => {
    const search = {
      cross: CrossSearch,
      eoline: EOLineSearch,
      fb: FirstBlockSearch,
      xcross: XCrossSearch,
    };

    if (solver === 'kociemba') {
      phaseOne.initialize();
      phaseTwo.initialize();
      /**@ts-ignore */
    } else if (search[solver]) {
      /**@ts-ignore */
      search[solver].initialize();
    } else {
      throw 'Specified solver does not exist.';
    }
  },
};

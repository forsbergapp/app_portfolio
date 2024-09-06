/**
 * @module apps/app7/src/functions/solver1/algorithms
 */

// Numeric representation of the different powers of moves.
const powers = {
  '': 0,
  2: 1,
  '\'': 2,
};

/**
 * Check whether or not we are able to parse the given algorithm string.
 * @param {*} algorithm
 */
const validateAlgorithm = algorithm => /^([FRUBLDfrubldxyzMSE][2']?\s*)+$/.test(algorithm);

// Map single-power wide moves to a rotation + moves.
const wideMoves = {
  f: ['z', 'B'],
  r: ['x', 'L'],
  u: ['y', 'D'],
  b: ['z\'', 'F'],
  l: ['x\'', 'R'],
  d: ['y\'', 'U'],
  M: ['x\'', 'R', 'L\''],
  S: ['z', 'F\'', 'B'],
  E: ['y\'', 'U', 'D\''],
};

// Specifies the translation of FRUBLD as performed by rotations.
const rotations = {
  x: 'DRFULB',
  y: 'RBULFD',
  z: 'FULBDR',
};

/**
 * Strip rotations and wide moves from an algorithm. Returns
 * an array of moves as strings.
 * @param {*} moves
 */
const normalize = moves => {
  // Replace wide moves with rotations + moves.
  moves = moves.reduce((/**@type{*}*/acc, /**@type{*}*/move) => {
    const axis = move.charAt(0);
    /**@ts-ignore */
    const pow = powers[move.charAt(1)];
    /**@ts-ignore */
    if (wideMoves[axis]) {
      for (let i = 0; i <= pow; i += 1) {
        /**@ts-ignore */
        acc = acc.concat(wideMoves[axis]);
      }
      return acc;
    }
    return acc.concat(move);
  }, []);
  /**@ts-ignore */
  let output = [];

  // We store all rotations that were encountered, to map the
  // solution to the same final rotation as the scramble.
  const totalRotation = [];

  // Remove rotations by mapping all moves to the right of the rotation.
  for (let i = moves.length - 1; i >= 0; i -= 1) {
    const axis = moves[i].charAt(0);
    /**@ts-ignore */
    const pow = powers[moves[i].charAt(1)];

    if ('xyz'.includes(axis)) {
      totalRotation.unshift(moves[i]);

      for (let j = 0; j <= pow; j += 1) {
        /**@ts-ignore */
        output = output.map((outputMove) => rotations[axis]['FRUBLD'.indexOf(outputMove[0])] + outputMove.charAt(1));
      }
    } else {
      output.unshift(moves[i]);
    }
  }

  return [output, totalRotation];
};

/**
 * Parses a scramble, returning an array of integers describing the moves.
 * @param {*}       algorithm
 * @param {boolean} returnTotalRotation
 */
export const parseAlgorithm = (algorithm, returnTotalRotation = false) => {
  if (!validateAlgorithm(algorithm)) {
    throw 'Invalid algorithm provided to algorithm parser';
  }
  /**@ts-ignore */
  const result = [];

  const [moves, totalRotation] = normalize(
    algorithm.match(/[FRUBLDfrubldxyzMSE][2']?/g),
  );

  moves.forEach((move) => {
    const moveNum = 'FRUBLD'.indexOf(move.charAt(0));
    /**@ts-ignore */
    const pow = powers[move.charAt(1)];
    result.push(moveNum * 3 + pow);
  });

  if (returnTotalRotation) {
    /**@ts-ignore */
    return [result, totalRotation];
  }
  /**@ts-ignore */
  return result;
};

/**
 * Computes the inverse of a given algorithm. Rotations are supported.
 * @param {*} algorithm
 */
export const invertAlgorithm = algorithm => {
  if (!validateAlgorithm(algorithm)) {
    throw 'Invalid algorithm provided to algorithm parser';
  }

  const moves = algorithm.match(/[FRUBLDfrubldxyzMSE][2']?/g);

  const inverted = moves.reverse().map((/**@type{*}*/move) => {
    const axis = move.charAt(0);
    /**@ts-ignore */
    const pow = powers[move.charAt(1)];
    const inv = pow - 2 * (pow % 3) + 2;

    if (inv === 1) {
      return `${axis}2`;
    }

    if (inv === 2) {
      return `${axis}'`;
    }

    return axis;
  });

  return inverted.join(' ');
};

/**
 * Convert an array of integers to a human-readable representation.
 * @param {*} moves
 */
export const formatAlgorithm = moves => {
  let sequence = '';

  moves.forEach((/**@type{*}*/move) => {
    sequence += ' ';
    sequence += 'FRUBLD'.charAt(Math.floor(move / 3));

    switch (move % 3) {
      case 1:
        sequence += '2';
        break;

      case 2:
        sequence += '\'';
        break;

      default:
    }
  });

  // Trim extra spaces.
  return sequence.trim();
};

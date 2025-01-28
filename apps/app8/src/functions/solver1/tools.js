/**
 * @module apps/app8/src/functions/solver1/tools
 */
/**
 * @constant
 * @type{number[]} 
 */
const factorials = [];

/**
 * @name factorial
 * @description Calculates n factorial and attempts to cache
 *              as much information as possible.
 * @function
 * @param {number} n
 * @returns {number}
 */
export const factorial = n => {
  if (n === 0 || n === 1) {
    return 1;
  }

  if (factorials[n] > 0) {
    return factorials[n];
  }

  factorials[n] = factorial(n - 1) * n;

  return factorials[n];
};

/**
 * @constant
 * @type{number[][]} 
 */
const binomials = [];

/**
 * @name choose
 * @description Calculates n choose k using cached binomial numbers.
 * @function
 * @param {number} n
 * @param {number} k
 * @returns {number}
 */
export const choose = (n, k) => {
  if (k > n) {
    return 0;
  }

  while (n >= binomials.length) {
    const s = binomials.length;
    /**@type{number[]} */
    const nextRow = [];

    nextRow[0] = 1;

    for (let i = 1, prev = s - 1; i < s; i += 1) {
      nextRow[i] = binomials[prev][i - 1] + binomials[prev][i];
    }

    nextRow[s] = 1;

    binomials.push(nextRow);
  }

  return binomials[n][k];
};

/**
 * @name cartesian
 * @description Cartesian product of a given nested array.
 * @function
 * @param {[][]}arg
 * @returns {number[][]}
 */
export const cartesian = arg => {
  /**@type{number[][]} */
  const result = [];
  const max = arg.length - 1;

  /**
   * @param {number[]} arr
   * @param {number} i
   */
  const helper = (arr, i) => {
    for (let j = 0; j < arg[i].length; j += 1) {
      /**@type{number[]} */
      const copy = arr.slice(0);

      copy.push(arg[i][j]);

      if (i === max) {
          /**@ts-ignore*/
          result.push(copy);
      } else {
          helper(copy, i + 1);
      }
    }
  };

  helper([], 0);

  return result;
};

/**
 * @name getRandomInt
 * @description Get a random integer in the provided range, inclusive.
 * @function
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * @name permute
 * @description permute (not used)
 * @function
 * @param {number} n
 * @param {number} r
 * @returns {number}
 */
export const permute = (n, r) => factorial(n) / factorial(n - r);

/**
 * @name rotateParts
 * @description Rotates the subarray containing the affected pieces
 *              to the right by one.
 * @function
 * @param {number[]} pieces
 * @param {number[]} affected
 * @returns {number[]}
 */
export const rotateParts = (pieces, affected) => {
  const updatedPieces = pieces.slice(0);

  updatedPieces[affected[0]] = pieces[affected[affected.length - 1]];

  for (let i = 1; i < affected.length; i += 1) {
    updatedPieces[affected[i]] = pieces[affected[i - 1]];
  }

  return updatedPieces;
};

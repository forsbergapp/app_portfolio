/**
 * @module apps/app8/src/functions/solver1/solve
 */
class AlgorithmsClass {
    /** 
     * @name powers
     * @description Numeric representation of the different powers of moves.
     * @constant
     */
    powers = {
        '': 0,
        2: 1,
        '\'': 2,
    };
    
    /**
     * @name validateAlgorithm
     * @description Check whether or not we are able to parse the given algorithm string.
     * @param {*} algorithm
     * @function
     * @returns {boolean}
     */
    validateAlgorithm = algorithm => /^([FRUBLDfrubldxyzMSE][2']?\s*)+$/.test(algorithm);
    
    /**
     * @name wideMoves
     * @description Map single-power wide moves to a rotation + moves.
     * @constant
     */
    wideMoves = {
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
    
    /**
     * @name rotations
     * @description Specifies the translation of FRUBLD as performed by rotations.
     * @constant
     */
    rotations = {
        x: 'DRFULB',
        y: 'RBULFD',
        z: 'FULBDR',
    };
    
    /**
     * @name normalize
     * @description Strip rotations and wide moves from an algorithm. Returns
     *              an array of moves as strings.
     * @function
     * @param {RegExpMatchArray} moves
     * @returns {[string[],string[]]}
     */
    normalize = moves => {
        // Replace wide moves with rotations + moves.
        moves = moves.reduce((/**@type{*}*/acc, /**@type{*}*/move) => {
        const axis = move.charAt(0);
        /**@ts-ignore */
        const pow = this.powers[move.charAt(1)];
        /**@ts-ignore */
        if (this.wideMoves[axis]) {
            for (let i = 0; i <= pow; i += 1) {
            /**@ts-ignore */
            acc = acc.concat(this.wideMoves[axis]);
            }
            return acc;
        }
        return acc.concat(move);
        }, []);
        /**@type{string[]} */
        let output = [];
    
        // We store all rotations that were encountered, to map the
        // solution to the same final rotation as the scramble.
        const totalRotation = [];
    
        // Remove rotations by mapping all moves to the right of the rotation.
        for (let i = moves.length - 1; i >= 0; i -= 1) {
        const axis = moves[i].charAt(0);
        /**@ts-ignore */
        const pow = this.powers[moves[i].charAt(1)];
    
        if ('xyz'.includes(axis)) {
            totalRotation.unshift(moves[i]);
    
            for (let j = 0; j <= pow; j += 1) {
            /**@ts-ignore */
            output = output.map((outputMove) => this.rotations[axis]['FRUBLD'.indexOf(outputMove[0])] + outputMove.charAt(1));
            }
        } else {
            output.unshift(moves[i]);
        }
        }
    
        return [output, totalRotation];
    };
    
    /**
     * @name parseAlgorithm
     * @description Parses a scramble, returning an array of integers describing the moves.
     * @function
     * @param {string}  algorithm
     * @param {boolean} returnTotalRotation
     * @returns {[number[], string[]]|number[]}
     */
    parseAlgorithm (algorithm, returnTotalRotation = false) {
        if (!this.validateAlgorithm(algorithm)) {
            throw 'Invalid algorithm provided to algorithm parser';
        }
        /**@type{number[]} */
        const result = [];
    
        const [moves, totalRotation] = this.normalize(
            /**@ts-ignore */
            algorithm.match(/[FRUBLDfrubldxyzMSE][2']?/g),
        );
    
        moves.forEach((move) => {
            const moveNum = 'FRUBLD'.indexOf(move.charAt(0));
            /**@ts-ignore */
            const pow = this.powers[move.charAt(1)];
            result.push(moveNum * 3 + pow);
        });
    
        if (returnTotalRotation) {
            return [result, totalRotation];
        }
        return result;
    }
    
    /**
     * @name invertAlgorithm
     * @description Computes the inverse of a given algorithm. Rotations are supported.
     * @function
     * @param {string} algorithm
     * @returns {string|undefined}
     */
    invertAlgorithm = algorithm => {
        if (!this.validateAlgorithm(algorithm)) {
            throw 'Invalid algorithm provided to algorithm parser';
        }
    
        const moves = algorithm.match(/[FRUBLDfrubldxyzMSE][2']?/g);
        /**@ts-ignore */
        const inverted = moves.reverse().map((/**@type{*}*/move) => {
        const axis = move.charAt(0);
        /**@ts-ignore */
        const pow = this.powers[move.charAt(1)];
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
     * @name formatAlgorithm
     * @description Convert an array of integers to a human-readable representation.
     * @function
     * @param {*} moves
     * @returns {string}
     */
    formatAlgorithm = moves => {
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
}
const Algorithms = new AlgorithmsClass();

class ToolsClass {
    /**
     * @constant
     * @type{number[]} 
     */
    factorials = [];

    /**
     * @name factorial
     * @description Calculates n factorial and attempts to cache
     *              as much information as possible.
     * @function
     * @param {number} n
     * @returns {number}
     */
    factorial(n){
        if (n === 0 || n === 1) {
            return 1;
        }

        if (this.factorials[n] > 0) {
            return this.factorials[n];
        }

        this.factorials[n] = this.factorial(n - 1) * n;

        return this.factorials[n];
    }

    /**
     * @constant
     * @type{number[][]} 
     */
    binomials = [];

    /**
     * @name choose
     * @description Calculates n choose k using cached binomial numbers.
     * @function
     * @param {number} n
     * @param {number} k
     * @returns {number}
     */
    choose(n, k){
        if (k > n) {
            return 0;
        }

        while (n >= this.binomials.length) {
            const s = this.binomials.length;
            /**@type{number[]} */
            const nextRow = [];

            nextRow[0] = 1;

            for (let i = 1, prev = s - 1; i < s; i += 1) {
                nextRow[i] = this.binomials[prev][i - 1] + this.binomials[prev][i];
            }

            nextRow[s] = 1;

            this.binomials.push(nextRow);
        }

        return this.binomials[n][k];
    }

    /**
     * @name cartesian
     * @description Cartesian product of a given nested array.
     * @function
     * @param {[][]}arg
     * @returns {number[][]}
     */
    cartesian = arg => {
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
    getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    /**
     * @name permute
     * @description permute (not used)
     * @function
     * @param {number} n
     * @param {number} r
     * @returns {number}
     */
    permute = (n, r) => this.factorial(n) / this.factorial(n - r);

    /**
     * @name rotateParts
     * @description Rotates the subarray containing the affected pieces
     *              to the right by one.
     * @function
     * @param {number[]} pieces
     * @param {number[]} affected
     * @returns {number[]}
     */
    rotateParts = (pieces, affected) => {
        const updatedPieces = pieces.slice(0);

        updatedPieces[affected[0]] = pieces[affected[affected.length - 1]];

        for (let i = 1; i < affected.length; i += 1) {
            updatedPieces[affected[i]] = pieces[affected[i - 1]];
        }

        return updatedPieces;
    };
}
const Tools = new ToolsClass();

class CoordinatesClass {
    /**
     * @name rotateLeft
     * @description In-place rotation of the subarray determined by the two
     *              indexes left and right to the left by one.
     * @function
     * @param {*} pieces
     * @param {*} left
     * @param {*} right
     * @returns {void}
     */
    rotateLeft = (pieces, left, right) => {
        const original = pieces[left];
    
        for (let i = left; i < right; i += 1) {
            pieces[i] = pieces[i + 1];
        }
    
        pieces[right] = original;
    };
    
    /**
     * @name rotateRight
     * @description In-place rotation of the subarray determined by the two
     *              indexes left and right to the right by one.
     * @function
     * @param {*} pieces
     * @param {*} left
     * @param {*} right
     * @returns {void}
     */
    rotateRight = (pieces, left, right) => {
        const original = pieces[right];
    
        for (let i = right; i > left; i -= 1) {
            pieces[i] = pieces[i - 1];
        }
    
        pieces[left] = original;
    };
    
    /**
     * @name getIndexFromOrientation
     * @description Bijection which encodes a given orientation vector to an unique index.
     *              The flip count is the number of ways in which a single piece in the
     *              orientation vector may be oriented. For edges, this number is 2 flips,
     *              and for corners there are 3 possible twists. Thus, edges are encoded
     *              using a binary number system, and corners using a trinary number system.
     * @function
     * @param {*} pieces
     * @param {*} flipCount
     * @returns {number}
     */
    getIndexFromOrientation = (pieces, flipCount) => {
        let sum = 0;
    
        // Note that we do not include the last element in the vector here.
        // This is because the orientation of the last piece if determined
        // by the orientation of all the other pieces - when you rotate any
        // axis on the cube, only an even number of pieces is affected.
        for (let i = 0; i < pieces.length - 1; i += 1) {
            sum = flipCount * sum + pieces[i];
        }
    
        return sum;
    };
    
    /**
     * @name getOrientationFromIndex
     * @description Returns the original orientation vector given the number which
     *              describes it, the number of pieces in the vector, and the number
     *              of ways in which an individual piece may be oriented.
     * @function
     * @param {*} index
     * @param {*} numPieces
     * @param {*} numFlips
     * @returns {*}
     */
    getOrientationFromIndex = (index, numPieces, numFlips) => {
        const orientation = [];
    
        let parity = 0;
    
        for (let i = numPieces - 2; i >= 0; i -= 1) {
            const ori = index % numFlips;
            index = Math.floor(index / numFlips);
            orientation[i] = ori;
            parity += ori;
        }
    
        // Restore the last piece based on the orientation of the other pieces.
        orientation[numPieces - 1] = (numFlips - (parity % numFlips)) % numFlips;
    
        return orientation;
    };
    
    /**
     * @name getParity
     * @description Each move on a cube perform an even number of swaps when considering
     *              both edges and corner pieces at the same time. Thus, only half of all
     *              cube states are reachable using legal moves. This also implies that
     *              for a cube to be solvable, the parity of both corners and edges must
     *              both be either even or odd. We use this to verify that a cube is
     *              solvable when generating random state scrambles, and also to
     *              describe the overall cube permutation using only 10 edges, 6 corners
     *              and the parity of either the corners or the edges.
     * @function
     * @param {*} pieces
     * @returns {number}
     */
    getParity = pieces => {
        let sum = 0;
    
        for (let i = pieces.length - 1; i > 0; i -= 1) {
            for (let j = i - 1; j >= 0; j -= 1) {
                if (pieces[j] > pieces[i]) {
                sum += 1;
                }
            }
        }
    
        return sum % 2;
    };
    
    /**
     * @name getIndexFromPermutation
     * @description Encodes the permutation of the affected pieces within the entire
     *              permutation vector, by encoding both their position and then the
     *              permutation of the affected pieces within the permutation vector
     *              using a variable-base number system. If reversed is true, the
     *              values are assigned right-to-left. This is used in the Kociemba
     *              solver, so that 0 is used as the solved coordinate for the move
     *              table describing the UD-slice edges.
     * @function
     * @param {*} pieces
     * @param {*} affected
     * @param {*} reversed
     * @returns {*}
     */
    getIndexFromPermutation(pieces, affected, reversed = false) {
        let offset = pieces.length - 1;
        let position = 0;
        let k = 1;
    
        // Store the permutation of the subarray containing
        // only the affected pieces.
        const edges = [];
    
        // Encode the position of the affected pieces in a number
        // from 0 up to n choose k, where n is the number of pieces
        // in the permutation vector and k is the number of affected pieces.
        if (reversed) {
            for (let n = pieces.length - 1; n >= 0; n -= 1) {
                if (affected.indexOf(pieces[n]) >= 0) {
                offset = Math.min(offset, pieces[n]);
                position += Tools.choose(pieces.length - 1 - n, k);
                edges.unshift(pieces[n]);
                k += 1;
                }
            }
        } 
        else {
            for (let n = 0; n < pieces.length; n += 1) {
                if (affected.indexOf(pieces[n]) >= 0) {
                offset = Math.min(offset, pieces[n]);
                position += Tools.choose(n, k);
                edges.push(pieces[n]);
                k += 1;
                }
            }
        }
    
        let permutation = 0;
    
        // Encode the position of the subarray as a number from 0 and up
        // to n factorial, where n is the number of affected pieces.
        for (let i = edges.length - 1; i > 0; i -= 1) {
            let s = 0;
        
            while (edges[i] !== affected[i]) {
                this.rotateLeft(edges, 0, i);
                s += 1;
            }
        
            permutation = (i + 1) * permutation + s;
        }
    
        // Encode both the position and the permutation
        // as a number using a variable base.
        return Tools.factorial(affected.length) * position + permutation;
    }
    
    /**
     * @name getPermutationFromIndex
     * @description Restores the permutation described by an index, number of affected
     *              pieces and the permutation vector size. If reversed is true, the
     *              indexes have been assigned right-to-left.
     * @function
     * @param {*} index
     * @param {*} affected
     * @param {*} size
     * @param {boolean} reversed
     * @returns {*}
     */
    getPermutationFromIndex(index, affected, size, reversed = false) {
        const base = Tools.factorial(affected.length);
    
        let position = Math.floor(index / base);
        let permutation = index % base;
    
        const pieces = [];
    
        for (let i = 0; i < size; i += 1) {
            pieces.push(-1);
        }
    
        for (let i = 1; i < affected.length; i += 1) {
            let s = permutation % (i + 1);
            permutation = Math.floor(permutation / (i + 1));
        
            while (s > 0) {
                this.rotateRight(affected, 0, i);
                s -= 1;
            }
        }
    
        let k = affected.length - 1;
    
        if (reversed) {
            for (let n = 0; n < size; n += 1) {
                const binomial = Tools.choose(size - 1 - n, k + 1);
        
                if (position - binomial >= 0) {
                pieces[n] = affected[affected.length - 1 - k];
                position -= binomial;
                k -= 1;
                }
            }
        } 
        else {
            for (let n = size - 1; n >= 0; n -= 1) {
                const binomial = Tools.choose(n, k + 1);
        
                if (position - binomial >= 0) {
                pieces[n] = affected[k];
                position -= binomial;
                k -= 1;
                }
            }
        }
    
        return pieces;
    }  
}
const Coordinates = new CoordinatesClass();
/**
 * @name PruningTable
 * @description A pruning table gives a lower bound on the number of moves
 *              required to reach a target state.
 * @class
 */
class PruningTableClass {
    /**
     * @description declaring MoveTable type here is faster than using type import
     * @param {{name:string,size:number, doMove:function}[]} moveTables
     * @param {number[]} moves
     */
    constructor(moveTables, moves) {
        this.computePruningTable(moveTables, moves);
    }
    /**
     * @name setPruningValue
     * @description setPruningValue
     * @method
     * @param {number} index
     * @param {number} value
     * @returns {void}
     */
    setPruningValue(index, value) {
        /**@ts-ignore */
        this.table[index >> 3] ^= (0xf ^ value) << ((index & 7) << 2);
    }
    /**
     * @name getPruningValue
     * @description getPruningValue
     * @method
     * @param {number} index
     * @returns {number}
     */
    getPruningValue(index) {
        /**@ts-ignore */
        return (this.table[index >> 3] >> ((index & 7) << 2)) & 0xf;
    }
    /**
     * @name computePruningTable
     * @description computePruningTable (declaring MoveTable type here is faster than using type import)
     * @method
     * @param {{name:string,size:number, doMove:function}[]} moveTables
     * @param {number[]} moves
     * @returns {void}
     */
    computePruningTable(moveTables, moves) {
        const size = moveTables.reduce((/**@type{*}*/acc, /**@type{*}*/obj) => acc * obj.size, 1);

        //replacing very slow loop with one fast statement
        //use map function to avoid server memory issue
        this.table = Array(size+7>>3).fill([]).map(()=>-1);
        //original code
        //this.table = [];
        //for (let i = 0; i < (size + 7) >> 3; i += 1) {
        //  this.table.push(-1);
        //}

        let depth = 0;
        let done = 0;

        const powers = [1];

        for (let i = 1; i < moveTables.length; i += 1) {
            powers.push(moveTables[i - 1].size * powers[i - 1]);
        }

        const permutations = Tools.cartesian(moveTables.map((/**@type{*} */data) => data.solvedIndexes));

        for (let i = 0; i < permutations.length; i += 1) {
            let index = 0;

            for (let j = 0; j < permutations[i].length; j += 1) {
                index += powers[j] * permutations[i][j];
            }

            this.setPruningValue(index, 0);

            done += 1;
        }
        // We generate the table using a BFS. Depth 0 contains all positions which
        // are solved, and we loop through the correct indexes and apply all 18 moves
        // to the correct states. Then we visit all positions at depth 2, and apply
        // the 18 moves, and so on.
        while (done !== size) {
            // When half the table is generated, we switch to a backward search
            // where we apply the 18 moves to all empty entries. If the result
            // is a position which corresponds to the previous depth, we set the
            // index to the current depth.
            const inverse = done > size / 2;
            const find = inverse ? 0xf : depth;
            const check = inverse ? depth : 0xf;

            depth += 1;
            
            for (let index = 0; index < size; index += 1) {
                if (this.getPruningValue(index) === find) {
                    for (let moveIndex = 0; moveIndex < moves.length; moveIndex += 1) {
                        const move = moves[moveIndex];

                        let currentIndex = index;
                        let position = 0;
                        for (let i = powers.length - 1; i >= 0; i -= 1) {
                            position += powers[i] * moveTables[i].doMove(Math.floor(currentIndex / powers[i]), move);
                            currentIndex %= powers[i];
                        }
                        if (this.getPruningValue(position) === check) {
                            done += 1;

                            if (inverse) {
                                this.setPruningValue(index, depth);
                                break;
                            }

                            this.setPruningValue(position, depth);
                        }
                    }
                }
            }
        }
    }
}

class CubeClass {
    Edges = {
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
      
    Corners = {
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
    edgeMoves = [
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
    cornerMoves = [
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
    permutationMove = (pieces, moveIndex, moves) => {
        let updated = pieces;
        const move = moves[Math.floor(moveIndex / 3)];
        const pow = moveIndex % 3;
        
        for (let i = 0; i <= pow; i += 1) {
            updated = Tools.rotateParts(updated, move);
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
    edgePermutationMove = (pieces, moveIndex) => this.permutationMove(pieces, moveIndex, this.edgeMoves);
      
    /**
     * @name cornerPermutationMove
     * @description Perform a move to a corner permuttaion vector.
     * @function
     * @param {*} pieces
     * @param {*} moveIndex
     * @returns {*}
     */
    cornerPermutationMove = (pieces, moveIndex) => this.permutationMove(pieces, moveIndex, this.cornerMoves);
      
    /**
     * @name edgeOrientationMove
     * @description Perform a move to an edge orientation vector.
     * @function
     * @param {*} pieces
     * @param {*} moveIndex
     * @returns {*}
     */
    edgeOrientationMove = (pieces, moveIndex) => {
        const moveNumber = Math.floor(moveIndex / 3);
        const move = this.edgeMoves[moveNumber];
        const pow = moveIndex % 3;
        
        const updatedPieces = this.edgePermutationMove(pieces, moveIndex);
        
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
    cornerOrientationMove = (pieces, moveIndex) => {
        const moveNumber = Math.floor(moveIndex / 3);
        const move = this.cornerMoves[moveNumber];
        const pow = moveIndex % 3;
    
        const updatedPieces = this.cornerPermutationMove(pieces, moveIndex);
    
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
    identity = {
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
    doAlgorithm = (algorithm, cube = this.identity) => {
        let ep = cube.ep.slice();
        let eo = cube.eo.slice();
        let cp = cube.cp.slice();
        let co = cube.co.slice();
        
        Algorithms.parseAlgorithm(algorithm).forEach((move) => {
            ep = this.edgePermutationMove(ep, move);
            eo = this.edgeOrientationMove(eo, move);
            cp = this.cornerPermutationMove(cp, move);
            co = this.cornerOrientationMove(co, move);
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
    allMoves = [
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
}
const Cube = new CubeClass();

class MoveTableClass {
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
        createMoveTable(size, cubieMove, moves = Cube.allMoves) {
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
//MoveTable functions
/**
 * @name createCornerPermutationTable
 * @description createCornerPermutationTable
 * @function
 * @param {*} settings
 * @returns {*}
 */
const createCornerPermutationTable = settings => new MoveTableClass({
    name:           settings.name,
    moves:          settings.moves,
    defaultIndex:   Coordinates.getIndexFromPermutation(
                    [0, 1, 2, 3, 4, 5, 6, 7],
                    settings.affected,
                    settings.reversed,
                    ),
    size:           settings.size || Tools.factorial(8) / Tools.factorial(8 - settings.affected.length),
    /**
     * @param {*} index
     */
    getVector:      index => Coordinates.getPermutationFromIndex(
                    index,
                    settings.affected.slice(),
                    8,
                    settings.reversed,
                    ),
    cubieMove:      Cube.cornerPermutationMove,
    /**
     * @param {*} pieces
     */
    getIndex:       pieces => Coordinates.getIndexFromPermutation(pieces, settings.affected, settings.reversed),
});
/**
 * @name createEdgePermutationTable
 * @description createEdgePermutationTable
 * @function
 * @param {*} settings
 * @returns {*}
 */
const createEdgePermutationTable = settings => new MoveTableClass({
    name: settings.name,
    moves: settings.moves,
    defaultIndex: Coordinates.getIndexFromPermutation(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    settings.affected,
    settings.reversed,
    ),
    size: settings.size || Tools.factorial(12) / Tools.factorial(12 - settings.affected.length),
    /**
     * @param {*} index
     */
    getVector: index => Coordinates.getPermutationFromIndex(
    index,
    settings.affected.slice(),
    12,
    settings.reversed,
    ),
    cubieMove: Cube.edgePermutationMove,
    /**
     * @param {*} pieces
     */
    getIndex: pieces => Coordinates.getIndexFromPermutation(pieces, settings.affected, settings.reversed),
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
        const orientation = Coordinates.getOrientationFromIndex(i, numPieces, numStates);

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
const createEdgeOrientationTable = settings => new MoveTableClass({
    name: settings.name,
    size: 2048,
    solvedIndexes: getCorrectOrientations(settings.affected, 12, 2),
    /**
     * @param {*} index
     */
    getVector: index => Coordinates.getOrientationFromIndex(index, 12, 2),
    cubieMove: Cube.edgeOrientationMove,
    /**
     * @param {*} pieces
     */
    getIndex: pieces => Coordinates.getIndexFromOrientation(pieces, 2),
});
/**
 * @name createCornerOrientationTable
 * @description createCornerOrientationTable
 * @function
 * @param {*} settings
 * @returns {*}
 */
const createCornerOrientationTable = settings => new MoveTableClass({
    name: settings.name,
    size: 2187,
    solvedIndexes: getCorrectOrientations(settings.affected, 8, 3),
    /**
     * @param {*} index
     */
    getVector: index => Coordinates.getOrientationFromIndex(index, 8, 3),
    cubieMove: Cube.cornerOrientationMove,
    /**
     * @param {*} pieces
     */
    getIndex: pieces => Coordinates.getIndexFromOrientation(pieces, 3),
});

/**
 * @name Search
 * @description Search
 * @class
 */
class SearchClass {
    /**
     * @param {*} createTables
     * @param {*} moves
     */
    constructor(createTables, moves = Cube.allMoves) {
      this.createTables = createTables;
      this.moves = moves;
    }
    /**
     * @name initialize
     * @description initialize
     * @method
     * @returns {void}
     */
    initialize() {
      if (this.initialized) {
        return;
      }
  
      this.initialized = true;
  
      const { moveTables, pruningTables } = this.createTables();
  
      this.moveTables = moveTables;
      /**@type{{pruningTable:{table:number[]|undefined},moveTableIndexes:[]}[]} */
      this.pruningTables = [];
  
      pruningTables.forEach((/**@type{*} */moveTableNames) => {
        const moveTableIndexes = moveTableNames.map((/**@type{*} */name) => this.moveTables.map((/**@type{*} */table) => table.name).indexOf(name));
  
        moveTableIndexes.sort(
          (/**@type{*} */a, /**@type{*} */b) => this.moveTables[a].size - this.moveTables[b].size,
        );
        /**@type{*} */
        const mappedTables = [];
  
        moveTableIndexes.forEach((/**@type{*} */i) => mappedTables.push(this.moveTables[i]));
  
        const pruningTable = new PruningTableClass(mappedTables, this.moves);
        /**@ts-ignore */
        this.pruningTables.push({
          pruningTable,
          moveTableIndexes,
        });
      });
    }
    /**
     * @name handleSolution
     * @descrtion handleSolution
     * @method
     * @param {*} solution
     * @param {*} indexes
     * @returns {{solution:*, indexes:*}}
     */
    handleSolution(solution, indexes) {
      return {
        solution,
        indexes,
      };
    }
    /**
     * @name search
     * @description search
     * @method
     * @param {*} indexes
     * @param {*} depth
     * @param {*} lastMove
     * @param {*} solution
     * @returns {boolean|{solution:*, indexes:*}}
     */
    search(indexes, depth, lastMove, solution) {
      let minimumDistance = 0;
      /**@ts-ignore */
      for (let i = 0; i < this.pruningTables.length; i += 1) {
        /**@ts-ignore */
        let index = indexes[this.pruningTables[i].moveTableIndexes[0]];
        let power = 1;
        /**@ts-ignore */
        for (let j = 1; j < this.pruningTables[i].moveTableIndexes.length; j += 1) {
          /**@ts-ignore */
          power *= this.moveTables[this.pruningTables[i].moveTableIndexes[j - 1]].size;
          /**@ts-ignore */
          index += indexes[this.pruningTables[i].moveTableIndexes[j]] * power;
        }
        /**@ts-ignore */
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
     * @name solve
     * @description solve
     * @param {*} settings
     * @returns {boolean|string|{solution:*, indexes:*}}
     */
    solve(settings) {
      this.initialize();
  
      this.settings = { maxDepth: 20, // For the Kociemba solver.
        lastMove: null,
        format: true,
        ...settings };
  
      const indexes = this.settings.indexes || [];
  
      let solutionRotation;
  
      if (this.settings.scramble) {
        const [moves, totalRotation] = Algorithms.parseAlgorithm(this.settings.scramble, true);
        /**@ts-ignore */
        if (totalRotation.length > 0) {
          /**@ts-ignore */
          solutionRotation = Algorithms.invertAlgorithm(totalRotation.join(' '));
        }
  
        for (let i = 0; i < this.moveTables.length; i += 1) {
          indexes.push(this.moveTables[i].defaultIndex);
        }
        /**@ts-ignore */
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
            /**@ts-ignore */
            const formatted = Algorithms.formatAlgorithm(solution.solution);
  
            if (solutionRotation) {
              // If we have rotations in the scramble, apply the inverse to the solution
              // and then parse again to remove the rotations. This results in a
              // solution that can be applied from the result scramble orientation.
              return Algorithms.formatAlgorithm(Algorithms.parseAlgorithm(`${solutionRotation} ${formatted}`));
            }
  
            return formatted;
          }
  
          return solution;
        }
      }
  
      return false;
    }
}

class KociembaClass {
    /** 
     * @name phaseTwoMoves
     * @description In phase two, only quarter moves of U and D and double turns of
     *              all the other faces are allowed, in order to keep the cube in
     *              the phase two group G1.
     * @constant
     */
    phaseTwoMoves = [1, 10, 4, 13, 6, 7, 8, 15, 16, 17];

    // The following tables are being used in both phases.
    /**@ts-ignore */
    parity;
    /**@ts-ignore */
    URFToDLF;
    /**@ts-ignore */
    slice;
    /**@ts-ignore */
    merge;

    /**
     * @name phaseTwoTables
     * @description Initialize the tables used in phase one of the solver.
     * @function
     * @returns {*}
     */
    phaseTwoTables = () => {
        // In order to start phase two, we need to know the positions
        // in which the pieces landed after solving the cube into G1.
        // Since returning to the cubie level to perform the solution
        // would be slow, we use two helper tables in phase one which
        // later are merged into the final phase two coordinate.
        const getMergeCoord = (/**@type{*}*/x, /**@type{*}*/y) => {
            const a = Coordinates.getPermutationFromIndex(x, [0, 1, 2], 12);
            const b = Coordinates.getPermutationFromIndex(y, [3, 4, 5], 12);

            for (let i = 0; i < 8; i += 1) {
                if (a[i] !== -1) {
                    if (b[i] !== -1) {
                    return -1;
                    }
                    b[i] = a[i];
                }
            }

            return Coordinates.getIndexFromPermutation(b, [0, 1, 2, 3, 4, 5]);
        };

        this.merge = [];

        // Due to the sorted nature of our coordinate definitions, the
        // index of both the coordinates will be less than 336 when phase
        // one is finished. This allows for a pretty small merging table.
        for (let i = 0; i < 336; i += 1) {
            this.merge.push([]);

            for (let j = 0; j < 336; j += 1) {
                /**@ts-ignore */
                this.merge[i][j] = getMergeCoord(i, j);
            }
        }

        return {
            moveTables: [
            // The permutation of the slice pices, which already
            // are in the correct positions on the cube.
            new MoveTableClass({
                name: 'slicePermutation',
                size: 24,
                /**@ts-ignore */
                table: this.slice.table,
            }),
            /**@ts-ignore */
            this.parity,
            /**@ts-ignore */
            this.URFToDLF,

            createEdgePermutationTable({
                name: 'URToDF',
                size: 20160,
                moves: this.phaseTwoMoves,
                affected: [0, 1, 2, 3, 4, 5],
            }),
            ],

            pruningTables: [
            ['slicePermutation', 'parity', 'URFToDLF'],
            ['slicePermutation', 'parity', 'URToDF'],
            ],
        };
    };

    /**
     * @name phaseTwo
     * @description phaseTwo
     * @constant
     */
    phaseTwo = new SearchClass(this.phaseTwoTables, this.phaseTwoMoves);

    /**
     * @name phaseOneTables
     * @description phaseOneTables
     * @function
     * @returns {*}
     */
    phaseOneTables = () => {
        // The parity move table is so small that we inline it. It
        // describes the parity of both the edge and corner pieces,
        // which must be equal for the cube to be solvable. The
        // coordinate is included in both phases, but only used
        // in phase two.
        this.parity = new MoveTableClass({
            name: 'parity',

            size: 2,

            table: [
            [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
            [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
            ],
        });

        this.URFToDLF = createCornerPermutationTable({
            name: 'URFToDLF',
            affected: [0, 1, 2, 3, 4, 5],
        });

        // This table is not used directly. This coordinate modulo 24 gives the
        // permutation of the subarray containing the UD-slice pieces, while this
        // coordinate divided by 24 gives the position of the UD-slice pieces.
        // Two smaller move tables are created using this table, one to solve the
        // position of the UD-slice pieces in phase one, and one to solve the
        // pieces in phase two. Due to the reduced move set in phase two, the pruning
        // table for this coordinate is smaller than it would normally be.
        this.slice = createEdgePermutationTable({
            name: 'slice',
            affected: [8, 9, 10, 11],
            reversed: true,
        });

        // Initialize phase two, since it now is guaranteed that the
        // helper move tables have finished generating.
        this.phaseTwo.initialize();

        return {
            moveTables: [
            new MoveTableClass({
                // The position of the slice edges. When this coordinate is
                // solved, the UD-slice pieces are in the UD-slice, but they
                // are not necessarily permuted.
                name: 'slicePosition',
                size: 495,
                table: this.slice.table,
                doMove: (/**@type{*}*/table, /**@type{*}*/index, /**@type{*}*/move) => Math.floor(table[index * 24][move] / 24),
            }),

            createCornerOrientationTable({
                name: 'twist',
                affected: [0, 1, 2, 3, 4, 5, 6, 7],
            }),

            createEdgeOrientationTable({
                name: 'flip',
                affected: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            }),

            this.slice,
            this.parity,
            this.URFToDLF,

            createEdgePermutationTable({
                name: 'URToUL',
                affected: [0, 1, 2],
            }),

            createEdgePermutationTable({
                name: 'UBToDF',
                affected: [3, 4, 5],
            }),
            ],

            pruningTables: [['slicePosition', 'flip'], ['slicePosition', 'twist']],
        };
    };
}
const Kociemba = new KociembaClass();
/**
 * @name PhaseOneSearch
 * @description PhaseOneSearch
 * @class
 * @returns {*}
 */
class PhaseOneSearchClass extends SearchClass {
    /**@ts-ignore*/
    constructor(...args) {
        /**@ts-ignore*/
        super(...args);

        this.maxDepth = 20;
        this.solution = null;
    }
    /**
     * @name handleSolution
     * @description handleSolution
     * @method
     * @param {*} solution
     * @param {*} indexes
     * @returns {*}
     */
    handleSolution(solution, indexes) {
        const lastMove = solution.slice(-1)[0];

        // We do not allow solutions which end in a phase two move, as we then
        // would end up duplicating work.
        if (
            lastMove % 2 === 0
            && Math.floor(lastMove / 3) === 6
            && Math.floor(lastMove / 3) === 15
            ) {
            return false;
        }

        const phaseTwoSolution = Kociemba.phaseTwo.solve({
            indexes: [
                indexes[3],
                indexes[4],
                indexes[5],
                /**@ts-ignore*/
                Kociemba.merge[indexes[6]][indexes[7]],
            ],

            maxDepth: this.maxDepth - solution.length,

            lastMove,

            format: false,
        });

        if (phaseTwoSolution) {
            /**@ts-ignore */
            this.solution = solution.concat(phaseTwoSolution.solution);

            if (this.maxDepth <= this.settings.maxDepth) {
                return {
                    solution: this.solution,
                    indexes,
                };
            }

            this.maxDepth = this.solution.length - 1;
        }

        return false;
    }
}
/**
 * @name phaseOne
 * @description phaseOne
 * @constant
 */
const phaseOne = new PhaseOneSearchClass(Kociemba.phaseOneTables);
/**
 * @name kociemba
 * @description kociemba
 * @param {*} scramble
 * @param {*} maxDepth
 * @returns {*}
 */
const kociemba = (scramble, maxDepth = 20) => {
    if (Array.isArray(scramble)) {
        return phaseOne.solve({
            indexes: scramble,
            maxDepth,
        });
    }

    return phaseOne.solve({
        scramble,
        maxDepth,
    });
};
export default {
  /**
   * @name solve
   * @description solve
   * @function
   * @returns {*}
   */
  solve: (/**@type{*}*/scramble) => {
      return kociemba(scramble);
  },

};

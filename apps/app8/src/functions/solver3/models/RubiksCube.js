/**
 * @module apps/app8/src/functions/solver3/models/rubikscube
 */

import { Cubie } from './Cubie.js';
import { algorithmShortener } from '../algorithm-shortener.js';
import {
	transformNotations, getMiddleMatchingFace
} from '../utils/index.js';

/**
 * @name SOLVED_STATE
 * @description SOLVED_STATE
 * @constant
 */
const SOLVED_STATE = 'fffffffffrrrrrrrrruuuuuuuuudddddddddlllllllllbbbbbbbbb';

/**
 * @name RubiksCube
 * @description RubiksCube
 * @class
 */
class RubiksCube {
	/**
	 * @name Solved
	 * @description Factory method. Returns an instance of a solved Rubiks Cube.
	 * @method
	 * @returns {*}
	 */
	static Solved() {
		return new RubiksCube(SOLVED_STATE);
	}

	/**
	 * @name FromMoves
	 * @description Factory method.
	 * @method
	 * @param {string|[]} moves
	 * @returns {*}
	 */
	static FromMoves(moves) {
		const cube = RubiksCube.Solved();
		cube.move(moves);
		return cube;
	}

	/**
	 * @name Scrambled
	 * @description Factory method. Returns an instance of a scrambled Rubiks Cube.
	 * @method
	 * @returns {*}
	 */
	static Scrambled() {
		const cube = RubiksCube.Solved();
		const randomMoves = RubiksCube.getRandomMoves(25);
		cube.move(randomMoves);

		return cube;
	}

	/**
	 * @name resverseMoves
	 * @description 
	 * @method
	 * @param {string|[]} moves - The list of moves to reverse.
	 * @returns {string|[]} -- whichever was initially given.
	 */
	static reverseMoves(moves) {
		return RubiksCube.transformMoves(moves, { reverse: true });
	}

	/**
	 * @name transformMoves
	 * @description transformMoves
	 * @method
	 * @param {string|[]} moves - The moves to transform;
	 * @param {{uppercase:boolean,				//Turn lowercase moves into uppercase.
	 * 			orientation:object}				//An object describing the orientation
	 * 			|{}} options
	 * from which to makes the moves. See src/js/utils#orientMoves.
	 *
	 * @returns {string|[]} -- whichever was initially given.
	 */
	static transformMoves(moves, options = {}) {
		return transformNotations(moves, options);
	}
	/**
	 * @name getRandomMoves
	 * @description getRandomMoves
	 * @method
	 * @returns {*}
	 */
	static getRandomMoves(length = 25) {
		/**@type{*} */
		let randomMoves = [];
		const totalMoves = [
			'F',
			'Fprime',
			'R',
			'Rprime',
			'U',
			'Uprime',
			'D',
			'Dprime',
			'L',
			'Lprime',
			'B',
			'Bprime'
		];

		while (randomMoves.length < length) {
			for (let i = 0; i < length - randomMoves.length; i++) {
				const idx = ~~(Math.random() * totalMoves.length);
				randomMoves.push(totalMoves[idx]);
			}

			randomMoves = algorithmShortener(randomMoves).split(' ');
		}

		return randomMoves.join(' ');
	}

	/**
	 * @description  The cube state are represented as:
	 * 'FFFFFFFFFRRRRRRRRRUUUUUUUUUDDDDDDDDDLLLLLLLLLBBBBBBBBB'
	 *
	 * where:
	 * F stands for the FRONT COLOR
	 * R stands for the RIGHT COLOR
	 * U stands for the UP COLOR
	 * D stands for the DOWN COLOR
	 * L stands for the LEFT COLOR
	 * B stands for the BACK COLOR
	 *
	 * and the faces are given in the order of:
	 * FRONT, RIGHT, UP, DOWN, LEFT, BACK
	 *
	 * The order of each color per face is ordered by starting from the top left
	 * corner and moving to the bottom right, as if reading lines of text.
	 *
	 * See this example: http://2.bp.blogspot.com/_XQ7FznWBAYE/S9Sbric1KNI/AAAAAAAAAFs/wGAb_LcSOwo/s1600/rubik.png
	 * Also available here:
	 * /apps/app8/src/functions/solver3/models/rubik.png
	 * @param {string} cubeState - The string representing the Rubik's Cube.
	 * 
	 */
	constructor(cubeState) {
		if (cubeState.length !== 9 * 6) {
			throw new Error('Wrong number of colors provided');
		}

		this._notationToRotation = {
			f: { axis: 'z', mag: -1 },
			r: { axis: 'x', mag: -1 },
			u: { axis: 'y', mag: -1 },
			d: { axis: 'y', mag: 1 },
			l: { axis: 'x', mag: 1 },
			b: { axis: 'z', mag: 1 },
			m: { axis: 'x', mag: 1 },
			e: { axis: 'y', mag: 1 },
			s: { axis: 'z', mag: -1 }
		};

		this._build(cubeState);
	}

	/**
	 * @name getFace
	 * @description Grab all the cubes on a given face, and return them in order from top left
	 * 				to bottom right.
	 * @method
	 * @param {string} face - The face to grab.
	 * @returns {[]}
	 */
	getFace(face) {
		if (typeof face !== 'string') {
			throw new Error(`"face" must be a string (received: ${face})`);
		}

		face = face.toLowerCase()[0];

		// The 3D position of cubies and the way they're ordered on each face
		// do not play nicely. Below is a shitty way to reconcile the two.
		// The way the cubies are sorted depends on the row and column they
		// occupy on their face. Cubies on a higher row will have a lower sorting
		// index, but rows are not always denoted by cubies' y position, and
		// "higher rows" do not always mean "higher axis values".

		/**@ts-ignore */
		let row, col, rowOrder, colOrder;
		let cubies;

		// grab correct cubies
		if (face === 'f') {
			[row, col, rowOrder, colOrder] = ['Y', 'X', -1, 1];
			/**@ts-ignore */
			cubies = this._cubies.filter(cubie => cubie.getZ() === 1);
		} else if (face === 'r') {
			[row, col, rowOrder, colOrder] = ['Y', 'Z', -1, -1];
			/**@ts-ignore */
			cubies = this._cubies.filter(cubie => cubie.getX() === 1);
		} else if (face === 'u') {
			[row, col, rowOrder, colOrder] = ['Z', 'X', 1, 1];
			/**@ts-ignore */
			cubies = this._cubies.filter(cubie => cubie.getY() === 1);
		} else if (face === 'd') {
			[row, col, rowOrder, colOrder] = ['Z', 'X', -1, 1];
			/**@ts-ignore */
			cubies = this._cubies.filter(cubie => cubie.getY() === -1);
		} else if (face === 'l') {
			[row, col, rowOrder, colOrder] = ['Y', 'Z', -1, 1];
			/**@ts-ignore */
			cubies = this._cubies.filter(cubie => cubie.getX() === -1);
		} else if (face === 'b') {
			[row, col, rowOrder, colOrder] = ['Y', 'X', -1, -1];
			/**@ts-ignore */
			cubies = this._cubies.filter(cubie => cubie.getZ() === -1);
		} else if (['m', 'e', 's'].includes(face)) {
			/**@ts-ignore */
			return this._getMiddleCubiesForMove(face);
		}

		// order cubies from top left to bottom right
		/**@ts-ignore */
		return cubies.sort((first, second) => {
			/**@ts-ignore */
			const firstCubieRow = first[`get${row}`]() * rowOrder;
			/**@ts-ignore */
			const firstCubieCol = first[`get${col}`]() * colOrder;
			/**@ts-ignore */
			const secondCubieRow = second[`get${row}`]() * rowOrder;
			/**@ts-ignore */
			const secondCubieCol = second[`get${col}`]() * colOrder;

			if (firstCubieRow < secondCubieRow) {
				return -1;
			} else if (firstCubieRow > secondCubieRow) {
				return 1;
			} else {
				return firstCubieCol < secondCubieCol ? -1 : 1;
			}
		});
	}

	/**
	 * @name getCubie
	 * @description getCubie
	 * @method
	 * @param {[]} faces - The list of faces the cubie belongs on.
	 * @returns{*}
	 */
	getCubie(faces) {
		/**@ts-ignore */
		return this._cubies.find(cubie => {
			if (faces.length != cubie.faces().length) {
				return false;
			}

			for (const face of faces) {
				if (!cubie.faces().includes(face)) {
					return false;
				}
			}

			return true;
		});
	}

	/**
	 * @name corners
	 * @description Finds and returns all cubies with three colors.
	 * @method
	 * @returns {[]}
	 */
	corners() {
		/**@ts-ignore */
		return this._cubies.filter(cubie => cubie.isCorner());
	}

	/**
	 * @name edges
	 * @description Finds and returns all cubies with two colors.
	 * @method
	 * @returns {[]}
	 */
	edges() {
		/**@ts-ignore */
		return this._cubies.filter(cubie => cubie.isEdge());
	}

	/**
	 * @name middles
	 * @description Finds and returns all cubies with one color.
	 * @method
	 * @returns {[]}
	 */
	middles() {
		/**@ts-ignore */
		return this._cubies.filter(cubie => cubie.isMiddle());
	}

	/**
	 * @name move
	 * @description Gets the rotation axis and magnitude of rotation based on notation.
	 * 				Then finds all cubes on the correct face, and rotates them around the
	 * 				rotation axis.
	 * @method
	 * @param {string|[]} notations - The move notation.
	 * @param {{uppercase:object}|{}} options - Move options.Turn all moves to upper case (i.e. no "double" moves).
	 * @returns {*}
	 */
	move(notations, options = {}) {
		if (typeof notations === 'string') {
			/**@ts-ignore */
			notations = notations.split(' ');
		}
		/**@ts-ignore */
		notations = transformNotations(notations, options);

		for (const notation of notations) {
			const move = notation[0];

			if (!move) {
				continue;
			}

			const isPrime = notation.toLowerCase().includes('prime');
			const isWithMiddle = move === move.toLowerCase();
			const isDoubleMove  = notation.includes('2');

			/**@ts-ignore */
			let { axis, mag } = this._getRotationForFace(move);
			let cubesToRotate = this.getFace(move);

			if (isPrime) mag *= -1;
			if (isDoubleMove) mag *= 2;

			if (isWithMiddle) {
				const middleMove = getMiddleMatchingFace(move);
				const middleCubies = this._getMiddleCubiesForMove(middleMove);
				/**@ts-ignore */
				cubesToRotate = [...cubesToRotate, ...middleCubies];
			}

			for (const cubie of cubesToRotate) {
				/**@ts-ignore */
				cubie.rotate(axis, mag);
			}
		}
	}
	/**
	 * @name isSolved
	 * @description isSolved
	 * @method
	 * @returns {*}
	 */
	isSolved() {
		return this.toString() === SOLVED_STATE;
	}
	/**
	 * @name toString
	 * @description toString
	 * @method
	 * @returns {*}
	 */
	toString() {
		let cubeState = '';

		const faces = ['front', 'right', 'up', 'down', 'left', 'back'];
		for (const face of faces) {
			const cubies = this.getFace(face);
			for (const cubie of cubies) {
				/**@ts-ignore */
				cubeState += cubie.getColorOfFace(face);
			}
		}

		return cubeState;
	}
	/**
	 * @name clone
	 * @description clone
	 * @method
	 * @returns {*}
	 */
	clone() {
		return new RubiksCube(this.toString());
	}

	/**
	 * @name _build
	 * @description Create a "virtual" cube, with individual "cubies" having a 3D coordinate
	 * 				position and 1 or more colors attached to them.
	 * @method
	 * @param {*} cubeState
	 * @returns {*}
	 */
	_build(cubeState) {
		/**@ts-ignore */
		this._cubies = [];
		this._populateCube();

		const parsedColors = this._parseColors(cubeState);

		for (const face of Object.keys(parsedColors)) {
			/**@ts-ignore */
			const colors = parsedColors[face];
			/**@ts-ignore */
			this._colorFace(face, colors);
		}
	}

	/**
	 * @name _populateCube
	 * @description Populates the "virtual" cube with 26 "empty" cubies by their position.
	 * @method
	 * @returns {void}
	 */
	_populateCube() {
		for (let x = -1; x <= 1; x++) {
			for (let y = -1; y <= 1; y++) {
				for (let z = -1; z <= 1; z++) {
					// no cubie in the center of the rubik's cube
					if (x === 0 && y === 0 && z === 0) {
						continue;
					}
					/**@ts-ignore */
					const cubie = new Cubie({ position: [x, y, z] });
					/**@ts-ignore */
					this._cubies.push(cubie);
				}
			}
		}
	}

	/**
	 * @name _parseColors
	 * @description A map with faces for keys and colors for values
	 * @method
	 * @param {*} cubeState
	 * @returns {object} 
	 */
	_parseColors(cubeState) {
		const faceColors = {
			front: [],
			right: [],
			up: [],
			down: [],
			left: [],
			back: []
		};

		let currentFace;

		for (let i = 0; i < cubeState.length; i++) {
			const color = cubeState[i];

			if (i < 9) {
				currentFace = 'front';
			} else if (i < 9 * 2) {
				currentFace = 'right';
			} else if (i < 9 * 3) {
				currentFace = 'up';
			} else if (i < 9 * 4) {
				currentFace = 'down';
			} else if (i < 9 * 5) {
				currentFace = 'left';
			} else {
				currentFace = 'back';
			}
			/**@ts-ignore */
			faceColors[currentFace].push(color);
		}

		return faceColors;
	}

	/**
	 * @name _colorFace
	 * @description _colorFace
	 * @method
	 * @param {[]} face - An array of the cubies on the given face.
	 * @param {[]} colors - An array of the colors on the given face.
	 * @returns {*}
	 */
	_colorFace(face, colors) {
		/**@ts-ignore */
		const cubiesToColor = this.getFace(face);
		for (let i = 0; i < colors.length; i++) {
			/**@ts-ignore */
			cubiesToColor[i].colorFace(face, colors[i]);
		}
	}

	/**
	 * @name _getRotationForFace
	 * @description The the rotation axis and magnitude for the given face.
	 * @method
	 * @param {*} face
	 * @returns {object}
	 */
	_getRotationForFace(face) {
		if (typeof face !== 'string') {
			throw new Error(`"face" must be a string (received: ${face})`);
		}

		face = face.toLowerCase();

		return {
			/**@ts-ignore */
			axis: this._notationToRotation[face].axis,
			/**@ts-ignore */
			mag: this._notationToRotation[face].mag * Math.PI / 2
		};
	}
	/**
	 * @name _getMiddleCubiesForMove
	 * @description _getMiddleCubiesForMove
	 * @method
	 * @param {*} move
	 * @returns {*}
	 */
	_getMiddleCubiesForMove(move) {
		move = move[0].toLowerCase();

		/**@ts-ignore */
		let nonMiddles;
		if (move === 'm') {
			nonMiddles = ['left', 'right'];
		} else if (move === 'e') {
			nonMiddles = ['up', 'down'];
		} else if (move === 's') {
			nonMiddles = ['front', 'back'];
		}
		/**@ts-ignore */
		return this._cubies.filter(cubie => {
			/**@ts-ignore */
			return !cubie.hasFace(nonMiddles[0]) && !cubie.hasFace(nonMiddles[1]);
		});
	}
}

export { RubiksCube };

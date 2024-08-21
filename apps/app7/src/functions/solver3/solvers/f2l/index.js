import { RubiksCube } from '../../models/RubiksCube.js';
import { F2LBaseSolver } from './F2LBaseSolver.js';
import { Case1Solver } from './cases/case-1.js';
import { Case2Solver } from './cases/case-2.js';
import { Case3Solver } from './cases/case-3.js';
import { getDirectionFromFaces } from '../../utils/index.js';

const R = (moves) => RubiksCube.reverseMoves(moves);

class F2LSolver extends F2LBaseSolver {
	constructor(...args) {
		super(...args);

		this.subCaseOptions = Object.assign(this.options, {
			_overrideAfterEach: true
		});
	}

	solve() {
		this.partitions = [];

		const pairs = this.getAllPairs();
		pairs.forEach(({ corner, edge }) => {
			const partition = this._solve({ corner, edge });
			this.partitions.push(partition);
		});

		return this.partitions;
	}

	isSolved() {
		const pairs = this.getAllPairs();
		for (const pair of pairs) {
			if (!this.isPairSolved(pair)) {
				return false;
			}
		}

		return true;
	}

	getAllPairs() {
		const corners = this.cube.corners().filter(corner => {
			return corner.hasColor('u');
		});
		const edges = this.cube.edges().filter(edge => {
			return !edge.hasColor('u') && !edge.hasColor('d');
		});

		const pairs = [];

		for (const edge of edges) {
			const corner = corners.find(corner => {
				const colors = edge.colors();
				return corner.hasColor(colors[0]) && corner.hasColor(colors[1]);
			});

			pairs.push({ edge, corner });
		}

		return pairs;
	}

	/**
	 * 4 top level cases: (cross face is UP)
	 *
	 * 1) Corner and edge are both on the DOWN face.
	 * 2) Corner is on the DOWN face and edge is not on DOWN face.
	 * 3) Corner is on UP face and edge is on DOWN face.
	 * 4) Corner is on UP face and edge is not on DOWN face.
	 */
	_getCaseNumber({ corner, edge }) {
		if (corner.faces().includes('down')) {
			if (edge.faces().includes('down')) {
				return 1;
			}
			if (!edge.faces().includes('down') && !edge.faces().includes('up')) {
				return 2;
			}
		}

		if (corner.faces().includes('up')) {
			if (edge.faces().includes('down')) {
				return 3;
			}
			if (!edge.faces().includes('down') && !edge.faces().includes('up')) {
				return 4;
			}
		}

		throw new Error('Could not find a top level F2L case');
	}

	_solveCase1({ corner, edge }) {
		const solver = new Case1Solver(this.cube, this.subCaseOptions);
		const partition = solver.solve({ corner, edge });

		this.totalMoves = partition.moves;
		this.partition.caseNumber = [this.partition.caseNumber, partition.caseNumber];
	}

	_solveCase2({ corner, edge }) {
		const solver = new Case2Solver(this.cube, this.subCaseOptions);
		const partition = solver.solve({ corner, edge });

		this.totalMoves = partition.moves;
		this.partition.caseNumber = [this.partition.caseNumber, partition.caseNumber];
	}

	_solveCase3({ corner, edge }) {
		const solver = new Case3Solver(this.cube, this.subCaseOptions);
		const partition = solver.solve({ corner, edge });

		this.totalMoves = partition.moves;
		this.partition.caseNumber = [this.partition.caseNumber, partition.caseNumber];
	}

	_solveCase4({ corner, edge }) {
		if (this.isPairSolved({ corner, edge })) {
			return;
		}

		let solver;
		if (corner.faces().includes(edge.faces()[0]) &&
				corner.faces().includes(edge.faces()[1])) {
			solver = new Case1Solver(this.cube, this.subCaseOptions);
		} else {
			solver = new Case2Solver(this.cube, this.subCaseOptions);
		}

		const faces = corner.faces().filter(face => face !== 'up');
		const dir = getDirectionFromFaces(faces[0], faces[1], { up: 'down' });
		const cornerRightFace = dir === 'right' ? faces[1] : faces[0];

		this.move(`${cornerRightFace} D ${R(cornerRightFace)}`, { upperCase: true });

		const partition = solver.solve({ corner, edge });

		this.partition.caseNumber = [this.partition.caseNumber, partition.caseNumber];
		this.totalMoves = [...this.totalMoves, ...partition.moves];
	}
}

export { F2LSolver };

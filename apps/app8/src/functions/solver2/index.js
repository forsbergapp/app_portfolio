/**
 * SSSSSSSS   OOOOOO   LL      VV    VV  EEEEEEE  RRRRRR
 * SS        OO    OO  LL      VV    VV  EE       RR   RR
 * SSSSSSSS  00    00  LL       VV  VV   EEEEEEE  RRRRR
 *		 SS  00    00  LL        VVVV    EE       RR  RR
 * SSSSSSSS   000000   LLLLLL     VV     EEEEEEE  RR   RR
 *
 * This is an implementation of Thistlewaite's algorithm in javascript:
 * (http://en.wikipedia.org/wiki/Optimal_solutions_for_Rubik's_Cube#Thistlethwaite.27s_algorithm)
 *
 * The Rubik's cube has 20 cubicles, the cubicles are fixed positions on the cube where cubies reside
 * Each cubie is named after the cubicle it belongs in. A cubicle is named by the faces it has.
 * The faces are labeled as: {U: up, D: down, R: right, L: left, F: front, B: back}
 *
 * To solve a cube you pass it a string of the current state of the cube that looks like:
 * UF UR UB UL DF DR DB DL FR FL BR BL UFR URB UBL ULF DRF DFL DLB DBR (<-- is an already solved cube)*
 *
 * The first 12 pairs correspond to the cubicle of the Rubik's cube
 * For a scrambled cube you put the cubie that is in the cubicle in the order presented above.
 * An example of a scramble cube is:
 * BR DF UR LB BD FU FL DL RD FR LU BU UBL FDR FRU BUR ULF LDF RDB DLB
 *
 * The state of the Rubik's cube is the position of the cubies at each of the 20 non-center locations
 * We number the cubies in the following order:
 * 
 *                    -------------------
 *                    |     |     |     |
 *                    |     |     |     |
 *                    |     |     |     |
 *                    -------------------
 *                    |     |     |     |
 *                    |  11 |  B  |  10 |
 *                    |     |     |     |
 *                    -------------------
 *                    |     |     |     |
 *                    |     |     |     |
 *                    |     |     |     |
 *  =======================================================
 *  |     |     |     |     |     |     |     |     |     |
 *  |     |     |     |  14 |  2  |  13 |     |     |     |
 *  |     |     |     |     |     |     |     |     |     |
 *  -------------------------------------------------------
 *  |     |     |     |     |     |     |     |     |     |
 *  |     |  L  |     |  3  |  U  |  1  |     |  R  |     |
 *  |     |     |     |     |     |     |     |     |     |
 *  -------------------------------------------------------
 *  |     |     |     |     |     |     |     |     |     |
 *  |     |     |     |  15 |  0  |  12 |     |     |     |
 *  |     |     |     |     |     |     |     |     |     |
 *  =======================================================
 *                    |     |     |     |
 *                    |     |     |     |
 *                    |     |     |     |
 *                    -------------------
 *                    |     |     |     |
 *                    |  9  |  F  |  8  |
 *                    |     |     |     |
 *                    -------------------
 *                    |     |     |     |
 *                    |     |     |     |
 *                    |     |     |     |
 *                    ===================
 *                    |     |     |     |
 *                    |  17 |  4  |  16 |
 *                    |     |     |     |
 *                    -------------------
 *                    |     |     |     |
 *                    |  7  |  D  |  5  |
 *                    |     |     |     |
 *                    -------------------
 *                    |     |     |     |
 *                    |  18 |  6  |  19 |
 *                    |     |     |     |
 *                    -------------------
 * 
 * A cube 'state' is a Array<int> with 40 entries, the first 20
 * are a permutation of {0,...,19} and describe which cubie is at
 * a certain position (regarding the input ordering). The first
 * twelve are for edges, the last eight for corners.
 * 
 * The last 20 entries are for the orientations, each describing
 * how often the cubie at a certain position has been turned
 * counterclockwise away from the correct orientation. Again the
 * first twelve are edges, the last eight are corners. The values
 * are 0 or 1 for edges and 0, 1 or 2 for corners.
 *
 * Changed
 * Added types
 * Replaced function and prototype usage with class and arrow functions
 * @module apps/app8/src/functions/solver2
 */

/**
 * @name RubiksCubeSolver
 * @description RubiksCubeSolver
 * @class
 */
class RubiksCubeSolver {
	constructor (){
		this.phase = 0;
		this.currentState = null;
		this.goalState = null;
	}
	/**
	 * @name applyMove
	 * @description applyMove
	 * @method
	 * @param {*} move
	 * @param {*} inState
	 * @returns {*}
	 */
	applyMove = (move, inState) =>{
		const affectedCubies = [
			[0,  1,  2,  3,  0,  1,  2,  3],   // U
			[4,  7,  6,  5,  4,  5,  6,  7],   // D
			[0,  9,  4,  8,  0,  3,  5,  4],   // F
			[2, 10,  6, 11,  2,  1,  7,  6],   // B
			[3, 11,  7,  9,  3,  2,  6,  5],   // L
			[1,  8,  5, 10,  1,  0,  4,  7],   // R
		];
		let turns = move % 3 + 1;
		const face = Math.floor(move / 3);
		const state = inState.slice();
		while(turns--> 0){
			const oldState = state.slice();
			for(let i=0; i<8; i++ ){
				const isCorner = (i > 3)==true?1:0;
				const target = affectedCubies[face][i] + isCorner*12;
				const killer = affectedCubies[face][(i&3)==3 ? i-3 : i+1] + isCorner*12;
				const orientationDelta = (i<4) ? (face>1 && face<4) : (face<2) ? 0 : 2 - (i&1);
				state[target] = oldState[killer];
				state[target+20] = oldState[killer+20] + orientationDelta;
				if(turns == 0)
					state[target+20] %= 2 + isCorner;
			}
		}
		return state;
	};
	/**
	 * @name inverse
	 * @description inverse
	 * @method
	 * @param {*} move
	 * @returns {*}
	 */
	inverse = move => {
		return move + 2 - 2 * (move % 3);
	};
	/**
	 * @name getid
	 * @description getid
	 * @method
	 * @param {*} state
	 * @returns {*}
	 */
	getId = state =>{
		//--- Phase 1: Edge orientations.
		if(this.phase < 2)
			return JSON.stringify(state.slice(20,32));
		
		//-- Phase 2: Corner orientations, E slice edges.
		if(this.phase < 3){
			const result = state.slice(31,40);
			for(let e=0; e<12; e++){
				//Bitwise OR assignment
				//https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Bitwise_OR_assignment
				//left shift operator
				//https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Left_shift
				result[0] |= (Math.floor(state[e] / 8)) << e;
			}
			return JSON.stringify(result);
		}
		//--- Phase 3: Edge slices M and S, corner tetrads, overall parity.
		if(this.phase < 4){
			const result = [0,0,0];
			for(let e=0; e<12; e++){
				//Bitwise OR assignment
				//https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Bitwise_OR_assignment
				//left shift operator
				//https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Left_shift
				result[0] |= ((state[e] > 7) ? 2 : (state[e] & 1)) << (2*e);
			}
			for(let c=0; c<8; c++){
				//Bitwise OR assignment
				//https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Bitwise_OR_assignment
				//left shift operator
				//https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Left_shift
				result[1] |= ((state[c+12]-12) & 5) << (3*c);
			}
			for(let i=12; i<20; i++)
				for(let j=i+1; j<20; j++){
					//Bitwise XOR assignment
					//https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Bitwise_XOR_assignment
					result[2] ^= (state[i] > state[j])==true?1:0;
				}
			return JSON.stringify(result);
		}
		
		//--- Phase 4: The rest.
		return JSON.stringify(state);
	};
	/**
	 * @name setState
	 * @description setState
	 * @method
	 * @param {*} cube
	 * @param {*} cube_goal
	 * @returns {*}
	 */
	setState = (cube, cube_goal) =>{
		cube = cube.split(' ');
		if(cube.length != 20){
			throw 'Not enough cubies provided';
		}
		//--- Prepare current (start) and goal state.
		this.currentState = new Array(40);
		this.goalState = new Array(40);
		for(let i=0; i<40; i++){
			this.currentState[i] = 0;
			this.goalState[i] = 0;
		}
		for(let i=0; i<20; i++){
			
			//--- Goal state.
			this.goalState[i] = i;
			
			//--- Current (start) state.
			let cubie = cube[i];
			while((this.currentState[i] = cube_goal.indexOf(cubie)) == -1){
				cubie = cubie.substr(1) + cubie[0];
				this.currentState[i+20]++;
				if(this.currentState[i+20] > 2){
					throw 'Cannot solve: Invalid painting of cube.';
				}
			}
		}
		return this.verifyState();
	};
	/**
	 * @name verifyState
	 * @description verifyState
	 * @method
	 * @returns {*}
	 */
	verifyState = () =>{
		//orientation of edges
		let sum = 0;
		this.currentState.slice(20,32).forEach((/**@type{number}*/edge)=>{
			sum+=edge;
		});
		if(sum % 2 != 0){
			//edge orientation
			throw 'Cannot solve: Edges not oriented correctly.';
		}
		sum = 0;
		//orientation of corners
		this.currentState.slice(32,40).forEach((/**@type{number}*/edge)=>{
			sum+=edge;
		});
		if(sum % 3 != 0){
			//corner orientation
			throw 'Cannot solve: Corners not oriented correctly';
		}
		/**
		 * @param {*} a
		 */
		const getParity = a =>{
			let count = 0;
			for(let i = 0; i<a.length; i++){
				for(let j=0; j<i; j++){
					if(a[j] > a[i]){
						count++;
						const temp = a[i];
						a[i] = a[j];
						a[j] = temp;
					}
				}
			}
			return count;
		};
		//check for parity
		sum = 0;
		//edge parity
		sum += getParity(this.currentState.slice(0,12));
		//corner parity
		sum += getParity(this.currentState.slice(12,20));
		if (sum % 2 != 0){
			throw 'Cannot solve: Parity error only one set of corners or edges swapped.' ;
		}

		return true;
	};

	/**
	 * @name solve
	 * @description solve
	 * @method
	 * @param {*} cube_currentstate
	 * @param {*} cube_goalstate
	 * @returns {*}
	 */
	solve = (cube_currentstate, cube_goalstate) =>{
		this.solution = '';
		this.phase = 0;  
		
		if(cube_currentstate)
			this.setState(cube_currentstate, cube_goalstate);
		else 
			this.verifyState();

		while(++this.phase < 5){
			this.startPhase();
		}
		this.prepareSolution();
		return this.solution;
	};
	/**
	 * @name startPhase
	 * @description startPhase
	 * @method
	 * @returns {*}
	 */
	startPhase = () =>{
		//--- Compute ids for current and goal state, skip phase if equal.
		const currentId = this.getId(this.currentState), goalId = this.getId(this.goalState);
		if(currentId == goalId)
			return;
		//--- Initialize the BFS queue.
		const q = [];
		q.push(this.currentState);
		q.push(this.goalState);
		
		//--- Initialize the BFS tables.
		const predecessor = {};
		const direction = {}, lastMove = {};
		/**@ts-ignore */
		direction[currentId] = 1;
		/**@ts-ignore */
		direction[goalId] = 2;
		
		//--- Begin BFS search
		while(1){
			//--- Get state from queue, compute its ID and get its direction.
			const oldState = q.shift();
			let oldId = this.getId(oldState);
			/**@ts-ignore */
			const oldDir = direction[oldId];
			
			//--- Apply all applicable moves to it and handle the new state.
			const applicableMoves = [0, 262143, 259263, 74943, 74898];
			for(let move=0; move<18; move++){
				if(applicableMoves[this.phase] & (1 << move)){
					
					//--- Apply the move.
					const newState = this.applyMove(move, oldState);
					let newId = this.getId(newState);
					/**@ts-ignore */
					const newDir = direction[newId];
					
					//--- Have we seen this state (id) from the other direction already?
					//--- I.e. have we found a connection?
					if( newDir  &&  newDir != oldDir ){
						//--- Make oldId represent the forwards and newId the backwards search state.
						if(oldDir > 1){
							const temp = newId;
							newId = oldId;
							oldId = temp;
							move = this.inverse(move);
						}
						
						//--- Reconstruct the connecting algorithm.
						const algorithm = [move];
						while(oldId != currentId){ 
							/**@ts-ignore */
							algorithm.unshift(lastMove[oldId]);
							/**@ts-ignore */
							oldId = predecessor[ oldId ];
						}
						while(newId != goalId){
							/**@ts-ignore */
							algorithm.push(this.inverse(lastMove[newId]));
							/**@ts-ignore */
							newId = predecessor[newId];
						}
						
						//--- append to the solution and apply the algorithm.
						for(let i=0; i<algorithm.length; i++ ){
							for(let j=0; j<algorithm[i]%3 + 1; j++)
								this.solution += 'UDFBLR'[Math.floor(algorithm[i]/3)];
							this.currentState = this.applyMove(algorithm[i], this.currentState);
						}
						
						//--- Jump to the next this.phase.
						return;
					}
					
					//--- If we've never seen this state (id) before, visit it.
					if(!newDir){
						q.push(newState);
						/**@ts-ignore */
						direction[newId] = direction[oldId];
						/**@ts-ignore */
						lastMove[newId] = move;
						/**@ts-ignore */
						predecessor[newId] = oldId;
					}
				}
			}
		}
	};

	/**
	 * @name prepareSolution
	 * @description prepareSolution
	 * @method
	 * @returns {*}
	 */
	prepareSolution = ()=>{
		/**@ts-ignore */
		let moves = this.solution.match(/(\w)\1*/g);
		if(!moves){
			this.solution = '';
			return;
		}
		const opposites = {'F':'B','B':'F','T':'D','D':'T','R':'L','L':'R'};
		let result = '';
		for(let i=0; i<moves.length-2; i++){
			/**@ts-ignore */
			if(moves[i][0] == moves[i+2][0] && opposites[moves[i+1][0]] == moves[i][0]){
				const temp = moves[i+2];
				moves[i+2] = moves[i+1];
				moves[i+1] = temp;
				i = 0;
			}
		}
		moves = moves.join('').match(/(\w)\1*/g);
		/**@ts-ignore */
		moves.forEach(move=>{
			if(move.length % 4 == 1)
				result += move[0];
			else if(move.length % 4 == 2)
				result += move[0] + '2';
			else if(move.length % 4 == 3)
				result += move[0] + '\'';
			else if(move.length % 4 == 0)
				return;
			result += ' ';
		});
		this.solution = result.trim();
	};
}

export {RubiksCubeSolver};
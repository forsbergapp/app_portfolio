/** @module apps/app7 */

const GOAL_SOLVE = ['UF', 'UR', 'UB', 'UL', 'DF', 'DR', 'DB', 'DL', 'FR', 'FL', 'BR', 'BL', 'UFR', 'URB', 'UBL', 'ULF', 'DRF', 'DFL', 'DLB', 'DBR'];

/**
 * 
 * Solves current cubestate using 3 different solution
 * 1	Kociemba
 * 2	Thistlewaite
 * 3	CFOP / Fridrich method  (Cross – F2L – OLL – PLL)
 * Returns Singmaster notation with moves, time and length for each solution
 * @param {number} app_id
 * @param {{cube_currentstate:string, cube_goalstate:[]}} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../types.js').res} res
 * @returns {Promise.<{	cube_solution1:string, 
 *						cube_solution1_time:number, 
 *						cube_solution1_length:number, 
 *						cube_solution2:string, 
 *						cube_solution2_time:number,
 *						cube_solution2_length:number,
 *						cube_solution3:string, 
 *						cube_solution3_time:number,
 *						cube_solution3_length:number}[]>}
 */
const cube_solve = async (app_id, data, user_agent, ip, locale, res) =>{

	//Algorithm information:
	//https://en.wikipedia.org/wiki/Optimal_solutions_for_the_Rubik's_Cube
	//https://en.wikipedia.org/wiki/CFOP_method

	// Source: https://github.com/torjusti/cubesolver
	//algorithm:Kociemba
	/**@type{import('./solver1/index.js')} */
	const {default:cuberSolver1} = await import('./solver1/index.js');

	//Source:https://github.com/stringham/rubiks-solver
	//algorithm: Thistlewaite
	/**@type{import('./solver2/index.js')} */
	const cuberSolver2 = await import('./solver2/index.js');


	//Source:https://github.com/slammayjammay/rubiks-cube-solver
	//algorithm: CFOP / Fridrich method  (Cross – F2L – OLL – PLL)
	/**@type{import('./solver3/index.js')} */
	const {default:cuberSolver3} = await import('./solver3/index.js');

	const timer1 = Date.now();
    const solver2 = new cuberSolver2.RubiksCubeSolver();
	
	//use Thistlewaite algorithm to solve from solved to given state
	const solver2_moves_from_solved = solver2.solve(data.cube_goalstate?data.cube_goalstate.join(' '):GOAL_SOLVE.join(' '), data.cube_currentstate.split(' '));
	if (solver2_moves_from_solved =='')
		return [{	cube_solution1:'', 
					cube_solution1_time:0, 
					cube_solution1_length:0, 
					cube_solution2:'', 
					cube_solution2_time:0,
					cube_solution2_length:0,
					cube_solution3:'', 
					cube_solution3_time:0,
					cube_solution3_length:0}];
	else{
		//Solver 1
		// Solve using Kociemba algorithm from calculated moves from solved using first Thistlewaite
		const solution1 = cuberSolver1.solve(solver2_moves_from_solved, 'kociemba');
		const timer2 = Date.now();
		//Solver 2
		//solve from current state to given state or default solved state
		const solution2 = solver2.solve(data.cube_currentstate, data.cube_goalstate ?? GOAL_SOLVE);
		const timer3 = Date.now();

		//solver 3
		//convert cubestate to correct format
		//solved cube:
		//0-1 2-3 4-5 6-7 8-9 10-11 12-13 14-15 16-17 18-19 20-21 22-23 24-25-26 27-28-29 30-31-32 33-34-35 36-37-38 39-40-41 42-43-44 45-46-47
		//UF  UR  UB  UL  DF   DR    DB   DL    FR    FL     BR    BL     UFR      URB      UBL      ULF      DRF      DFL      DLB      DBR

		const cs = data.cube_currentstate.replaceAll(' ', '');
		const cubstate_solver3 = [
			cs[35] + cs[1] + cs[25] + cs[18] + 'F' + cs[16] + cs[40] + cs[9]  + cs[38],	//front
			cs[26] + cs[3] + cs[28] + cs[17] + 'R' + cs[21] + cs[37] + cs[11] + cs[47],	//right
			cs[30] + cs[4] + cs[27] + cs[6]  + 'U' + cs[2]  + cs[33] + cs[0]  + cs[24],	//up
			cs[39] + cs[8] + cs[36] + cs[14] + 'D' + cs[10] + cs[42] + cs[12] + cs[45],	//down
			cs[32] + cs[7] + cs[34] + cs[23] + 'L' + cs[19] + cs[43] + cs[15] + cs[41],	//left
			cs[29] + cs[5] + cs[31] + cs[20] + 'B' + cs[22] + cs[46] + cs[13] + cs[44]	//back
		].join('').toLowerCase();  
		let solution3 = cuberSolver3(cubstate_solver3, { partitioned: false });
		/**@ts-ignore */
		solution3 =  solution3.toUpperCase().replaceAll('PRIME', '\'');	
		const timer4 = Date.now();
		//return shortest solution
		/**@ts-ignore */
		return [{	cube_solution1:solution1, 
					cube_solution1_time:timer2-timer1, 
					cube_solution1_length:solution1.split(' ').length, 
					/**@ts-ignore */
					cube_solution2:solution2, 
					cube_solution2_time:timer3-timer2,
					/**@ts-ignore */
					cube_solution2_length:solution2.split(' ').length,
					/**@ts-ignore */
					cube_solution3:solution3, 
					cube_solution3_time:timer4-timer3,
					/**@ts-ignore */
					cube_solution3_length:solution3.split(' ').length}];
	}
};
export default cube_solve;



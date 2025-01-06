/**
 * @module apps/app7/src/functions/solve
 */

const GOAL_SOLVE = ['UF', 'UR', 'UB', 'UL', 'DF', 'DR', 'DB', 'DL', 'FR', 'FL', 'BR', 'BL', 'UFR', 'URB', 'UBL', 'ULF', 'DRF', 'DFL', 'DLB', 'DBR'];

/**
 * @name cube_solve
 * @description Solves Rubiks cube using generative AI pattern
 * 				Model: 		Robot
 * 							Using Kociemba and Thistlewaite algorithms
 * 							Mathematical best solutions
 * 							Human
 * 							Using CFOP / Fridrich method  (Cross – F2L – OLL – PLL)
 * 							Used often by speed cubers that is easier to understand for humans (?)
 * 				Preamble:	Sing master notation
 * 				Temperature:	Return one best solution or all solutions
 * 
 * 				Solves cube from current state to solved state or given state
 * 				Uses worker_threads for Kociemba algorithm so main proces is not blocked
 * 				since this algorithm can takes from seconds to mintues to solve the cube
 * 
 * 				Returns Singmaster notation with moves, time, length and model for each solution
 * @function
 * @param {number} app_id
 * @param {import('./types.js').APP_FUNCTION_cube_solve_data} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<import('./types.js').APP_FUNCTION_cube_solve_return[]>}
 */
const cube_solve = async (app_id, data, user_agent, ip, locale, res) =>{
	if ((data.model ==0 || data.model ==1) && data.preamble == 0 && (data.temperature == 0 || data.temperature == 1) && 
		data.cube_currentstate !=''){
		//Algorithm information:
		//https://en.wikipedia.org/wiki/Optimal_solutions_for_the_Rubik's_Cube
		//https://en.wikipedia.org/wiki/CFOP_method

		//solver 1
		// Source: https://github.com/torjusti/cubesolver
		//algorithm:Kociemba

		//solver 2
		//Source:https://github.com/stringham/rubiks-solver
		//algorithm: Thistlewaite
		/**@type{import('./solver2/index.js')} */
		const cuberSolver2 = await import('./solver2/index.js');

		//solver 3
		//Source:https://github.com/slammayjammay/rubiks-cube-solver
		//algorithm: CFOP / Fridrich method  (Cross – F2L – OLL – PLL)
		/**@type{import('./solver3/index.js')} */
		const {default:cuberSolver3} = await import('./solver3/index.js');
		//Only robot can solve to given goal state at the moment
		if (data.cube_goalstate)
			data.model = 0;
		switch (data.model){
			case 0:{
				//Model robot can be slow, send PROGRESS using server side event				
				/**@type{import('../../../../server/socket.js')} */
				const {socketAppServerFunctionSend} = await import(`file://${process.cwd()}/server/socket.js`);

				const timer1 = Date.now();
				const solver2 = new cuberSolver2.RubiksCubeSolver();	
				//use Thistlewaite algorithm to solve from solved to given state
				
				const solver2_moves_from_solved = solver2.solve(data.cube_goalstate?data.cube_goalstate.join(' '):GOAL_SOLVE.join(' '), data.cube_currentstate.split(' '));
				if (solver2_moves_from_solved=='')
						return [];
				else{
					await socketAppServerFunctionSend(app_id, res.req.query.iam, 'PROGRESS', btoa(JSON.stringify({part:1, total:3, text:''})));
					// Solve using Kociemba algorithm from calculated moves from solved using first Thistlewaite
					/**
					 * @param {string} moves
					 */
					const solve1 = async moves =>{
						const { Worker } = await import('node:worker_threads');
						/**@ts-ignore */
						const worker = new Worker(import.meta.dirname.replace('C:','') +  '/solver1/worker.js', { workerData: moves});
						return new Promise(resolve => {
							worker.on('message', result => {
								resolve(result);
							});
						});
					};					
					const solution1 = await solve1(solver2_moves_from_solved);
					await socketAppServerFunctionSend(app_id, res.req.query.iam, 'PROGRESS', btoa(JSON.stringify({part:2, total:3, text:''})));
					const timer2 = Date.now();
					const solution2 = solver2.solve(data.cube_currentstate, data.cube_goalstate ?? GOAL_SOLVE);
					const timer3 = Date.now();
					if (data.temperature ==0){
						//return best solution
						return [{	cube_solution:solution1.split(' ').length<solution2.split(' ').length?solution1:solution2, 
									cube_solution_time:solution1.split(' ').length<solution2.split(' ').length?timer2-timer1:timer3-timer2, 
									cube_solution_length:solution1.split(' ').length<solution2.split(' ').length?solution1.split(' ').length:solution2.split(' ').length, 
									cube_solution_model:0}];
					}
					else{
						//return all solutions
						return [{	cube_solution:solution1, 
									cube_solution_time:timer2-timer1, 
									cube_solution_length:solution1.split(' ').length,
									cube_solution_model:0},
								{	cube_solution:solution2, 
									cube_solution_time:timer3-timer2, 
									cube_solution_length:solution2.split(' ').length,
									cube_solution_model:0}];
					}
				}
			}
			case 1:{
				//convert cubestate to correct format
				//solved cube:
				//0-1 2-3 4-5 6-7 8-9 10-11 12-13 14-15 16-17 18-19 20-21 22-23 24-25-26 27-28-29 30-31-32 33-34-35 36-37-38 39-40-41 42-43-44 45-46-47
				//UF  UR  UB  UL  DF   DR    DB   DL    FR    FL     BR    BL     UFR      URB      UBL      ULF      DRF      DFL      DLB      DBR
				const timer_start = Date.now();
				const cs = data.cube_currentstate.replaceAll(' ', '');
				const cubstate_solver3 = [
					cs[35] + cs[1] + cs[25] + cs[18] + 'F' + cs[16] + cs[40] + cs[9]  + cs[38],	//front
					cs[26] + cs[3] + cs[28] + cs[17] + 'R' + cs[21] + cs[37] + cs[11] + cs[47],	//right
					cs[30] + cs[4] + cs[27] + cs[6]  + 'U' + cs[2]  + cs[33] + cs[0]  + cs[24],	//up
					cs[39] + cs[8] + cs[36] + cs[14] + 'D' + cs[10] + cs[42] + cs[12] + cs[45],	//down
					cs[32] + cs[7] + cs[34] + cs[23] + 'L' + cs[19] + cs[43] + cs[15] + cs[41],	//left
					cs[29] + cs[5] + cs[31] + cs[20] + 'B' + cs[22] + cs[46] + cs[13] + cs[44]	//back
				].join('').toLowerCase();  
				const solution = cuberSolver3(cubstate_solver3, { partitioned: false });
				if (solution.solution_string=='')
					return [];
				else{
					//replace PRIME word with '
					solution.solution_string =  solution.solution_string.toUpperCase().replaceAll('PRIME', '\'');
					const timer_finished = Date.now();
					//middle layer turns not supported
					//M, E, S
					if (solution.solution_string.toUpperCase().indexOf('M')>-1 ||
						solution.solution_string.toUpperCase().indexOf('E')>-1 ||
						solution.solution_string.toUpperCase().indexOf('S')>-1)
							throw ('Not supported');
					else
						return [{	
							cube_solution:solution.solution_string, 
							cube_solution_time:timer_finished-timer_start,
							cube_solution_length:solution.solution_string.split(' ').length,
							cube_solution_model:1}];
				}
			}
		}
		
	}
	else{
		if (data.cube_currentstate && data.cube_currentstate == '' )
			return [];
		else{
			/**@type{import('../../../../server/iam.js')} */
			const  {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
			res.statusCode = 400;
			throw iamUtilMesssageNotAuthorized();
		}
	}
};
export default cube_solve;



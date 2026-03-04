/**
 * @module apps/app8/src/functions/solve
 */

/**
 * @import {server} from '../../../../server/types.js'
 * @import {APP_FUNCTION_cube_solution_model,APP_FUNCTION_cube_solve_data, APP_FUNCTION_cube_solve_return} from './types.js'
 */

const GOAL_SOLVE = ['UF', 'UR', 'UB', 'UL', 'DF', 'DR', 'DB', 'DL', 'FR', 'FL', 'BR', 'BL', 'UFR', 'URB', 'UBL', 'ULF', 'DRF', 'DFL', 'DLB', 'DBR'];
const {server} = await import('../../../../server/server.js');

/**
 * @name cubeSolve
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
 * @param {{app_id:number,
 *          data:APP_FUNCTION_cube_solve_data,
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 * 			idToken:string,
 *          authorization:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:APP_FUNCTION_cube_solve_return[]}>}
 */
const cubeSolve = async parameters =>{
	if ((parameters.data.model ==0 || parameters.data.model ==1) && parameters.data.preamble == 0 && (parameters.data.temperature == 0 || parameters.data.temperature == 1) && 
		parameters.data.cube_currentstate !=''){
		//Algorithm information:
		//https://en.wikipedia.org/wiki/Optimal_solutions_for_the_Rubik's_Cube
		//https://en.wikipedia.org/wiki/CFOP_method

		//solver 1
		// Source: https://github.com/torjusti/cubesolver
		//algorithm:Kociemba

		//solver 2
		//Source:https://github.com/stringham/rubiks-solver
		//algorithm: Thistlewaite
		const cuberSolver2 = await import('./solver2/index.js');

		//solver 3
		//Source:https://github.com/slammayjammay/rubiks-cube-solver
		//algorithm: CFOP / Fridrich method  (Cross – F2L – OLL – PLL)
		const {default:cuberSolver3} = await import('./solver3/index.js');
		//Only robot can solve to given goal state at the moment
		if (parameters.data.cube_goalstate)
			parameters.data.model = 0;
		/**@type{APP_FUNCTION_cube_solution_model} */
		const model = parameters.data.model;
		switch (parameters.data.model){
			case 0:{
				//Model robot can be slow, send PROGRESS_LOADING using server side event				

				const timer1 = Date.now();
				const solver2 = new cuberSolver2.RubiksCubeSolver();	
				//use Thistlewaite algorithm to solve from solved to given state
				
				const solver2_moves_from_solved = solver2.solve(parameters.data.cube_goalstate?parameters.data.cube_goalstate:GOAL_SOLVE.join(' '), parameters.data.cube_currentstate.split(' '));
				if (solver2_moves_from_solved=='')
						return {result:[], type:'JSON'};
				else{
                    await server.socket.socketClientPostMessage({ app_id:parameters.app_id,
                                                    resource_id:null,
                                                    data:{  data_app_id:parameters.app_id,
                                                            iam_user_id:null,
                                                            idToken:parameters.idToken,
                                                            message:JSON.stringify({part:1, total:3, info:''}),
                                                            message_type:'PROGRESS_LOADING'
                                                        }
                                            });
					// Solve using Kociemba algorithm from calculated moves from solved using first Thistlewaite
					/**
					 * @param {string} moves
					 */
					const solve1 = async moves =>{
						const { Worker } = await import('node:worker_threads');
						
						const worker = new Worker(
											/**@ts-ignore */
											import.meta.dirname
											.replace('C:','') +  '/solver1/worker.js', { workerData: moves});
						return new Promise(resolve => {
							worker.on('message', result => {
								resolve(result);
							});
						});
					};					
					const solution1 = await solve1(solver2_moves_from_solved);
                    
					const timer2 = Date.now();
					const solution2 = solver2.solve(parameters.data.cube_currentstate, parameters.data.cube_goalstate?.split(' ') ?? GOAL_SOLVE);
					const timer3 = Date.now();
					if (parameters.data.temperature ==0){
						//return best solution
						return {result:[{cube_solution:			solution1.split(' ').length<solution2.split(' ').length?solution1:solution2, 
										cube_solution_time:		solution1.split(' ').length<solution2.split(' ').length?timer2-timer1:timer3-timer2, 
										cube_solution_length:	solution1.split(' ').length<solution2.split(' ').length?solution1.split(' ').length:solution2.split(' ').length, 
										cube_solution_model:	model}], type:'JSON'};
					}
					else{
						//return all solutions
						return {result:[{	cube_solution:			solution1, 
											cube_solution_time:		timer2-timer1, 
											cube_solution_length:	solution1.split(' ').length,
											cube_solution_model:	model},
										{	cube_solution:			solution2, 
											cube_solution_time:		timer3-timer2, 
											cube_solution_length:	solution2.split(' ').length,
											cube_solution_model:	model}], 
								type:'JSON'};
					}
				}
			}
			case 1:{
				//convert cubestate to correct format
				//solved cube:
				//0-1 2-3 4-5 6-7 8-9 10-11 12-13 14-15 16-17 18-19 20-21 22-23 24-25-26 27-28-29 30-31-32 33-34-35 36-37-38 39-40-41 42-43-44 45-46-47
				//UF  UR  UB  UL  DF   DR    DB   DL    FR    FL     BR    BL     UFR      URB      UBL      ULF      DRF      DFL      DLB      DBR
				const timer_start = Date.now();
				const cs = parameters.data.cube_currentstate.replaceAll(' ', '');
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
					return {result:[], type:'JSON'};
				else{
					//replace PRIME word with '
					solution.solution_string =  solution.solution_string.toUpperCase().replaceAll('PRIME', '\'');
					const timer_finished = Date.now();
					//middle layer turns not supported
					//M, E, S
					if (solution.solution_string.toUpperCase().indexOf('M')>-1 ||
						solution.solution_string.toUpperCase().indexOf('E')>-1 ||
						solution.solution_string.toUpperCase().indexOf('S')>-1)
						return {http:400,
								code:'CUBE_SOLVE',
								text:'Not supported',
								developerText:null,
								moreInfo:null,
								type:'JSON'
							};
					else
						return {result:[{	
										cube_solution:			solution.solution_string, 
										cube_solution_time:		timer_finished-timer_start,
										cube_solution_length:	solution.solution_string.split(' ').length,
										cube_solution_model:	model}], 
								type:'JSON'};
				}
			}
		}

	}
	else{
		if (parameters.data.cube_currentstate && parameters.data.cube_currentstate == '' )
			return {result:[], type:'JSON'};
		else{
			return {http:400,
				code:'CUBE_SOLVE',
				text:server.iam.iamUtilMessageNotAuthorized(),
				developerText:null,
				moreInfo:null,
				type:'JSON'
			};
		}
	}
};
export default cubeSolve;



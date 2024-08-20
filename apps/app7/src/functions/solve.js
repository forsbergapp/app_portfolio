/** @module apps/app7 */

const GOAL_SOLVE = ['UF', 'UR', 'UB', 'UL', 'DF', 'DR', 'DB', 'DL', 'FR', 'FL', 'BR', 'BL', 'UFR', 'URB', 'UBL', 'ULF', 'DRF', 'DFL', 'DLB', 'DBR'];

/**
 * @param {number} app_id
 * @param {{cube_currentstate:string, cube_goalstate:[]}} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../types.js').res} res
 * @returns {Promise.<{cube_solution:string}[]>}
 */
const cube_solve = async (app_id, data, user_agent, ip, locale, res) =>{
    ///**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    //const {get} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);

	//return await get(app_id, null, null, data.data_app_id, 'CUBE_SOLVE', null, locale, true);

	// Source: https://github.com/torjusti/cubesolver
	/**@type{import('./solver1/index.js')} */
	const {default:cuberSolver1} = await import('./solver1/index.js');

	//Source:https://github.com/stringham/rubiks-solver
	/**@type{import('./solver2/index.js')} */
	const cuberSolver2 = await import('./solver2/index.js');
	
    const solver2 = new cuberSolver2.RubiksCubeSolver();
	
	const timer = Date.now();
	//use Thistlewaite algorithm to solve from solved to given state
	const solver2_moves_from_solved = solver2.solve(data.cube_goalstate?data.cube_goalstate.join(' '):GOAL_SOLVE.join(' '), data.cube_currentstate.split(' '));
	if (solver2_moves_from_solved =='')
		return [{cube_solution:solver2_moves_from_solved}];
	else{
		// Solve using Kociemba algorithm from calculated moves from solved
		const solution1 = cuberSolver1.solve(solver2_moves_from_solved, 'kociemba');
		const timer1 = Date.now();
		//solve from current state to given state or default solved state
		const solution2 = solver2.solve(data.cube_currentstate, data.cube_goalstate ?? GOAL_SOLVE);
		//return shortest solution
		/**@ts-ignore */
		return [{	cube_solution1:solution1, 
					cube_solution1_time:timer1-timer, 
					cube_solution1_length:solution1.split(' ').length, 
					cube_solution2:solution2, 
					cube_solution2_time:Date.now()-timer1,
					/**@ts-ignore */
					cube_solution2_length:solution2.split(' ').length}];
	}
};
export default cube_solve;



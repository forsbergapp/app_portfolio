/**
 * @module apps/app7/src/types
 */

/**
 * @description Type APP_FUNCTION_model_robot
 * @typedef {0} APP_FUNCTION_model_robot
 */

/**
 * @description Type APP_FUNCTION_model_human
 * @typedef {1} APP_FUNCTION_model_human
 */

/**
 * @description Type APP_FUNCTION_cube_solution_model
 * @typedef {APP_FUNCTION_model_robot|APP_FUNCTION_model_human} APP_FUNCTION_cube_solution_model
 */

/**
 * @description Type APP_FUNCTION_notation_singmaster
 * @typedef {0} APP_FUNCTION_notation_singmaster
 */

/**
 * @description Type APP_FUNCTION_solution_one
 * @typedef {0} APP_FUNCTION_solution_one
 */

/**
 * @description Type APP_FUNCTION_solution_all
 * @typedef {1} APP_FUNCTION_solution_all
 */
/**
 * @description Type APP_FUNCTION_cube_solve_data
 * @typedef {{  model: 				APP_FUNCTION_cube_solution_model,
 *			    preamble:			APP_FUNCTION_notation_singmaster,
 *			    temperature:		APP_FUNCTION_solution_one|APP_FUNCTION_solution_all,
 *			    cube_currentstate:	string,
 * 			    cube_goalstate:		[]|null,
 * 			    client_id: 			number}} APP_FUNCTION_cube_solve_data
 */
/**
 * @description Type APP_FUNCTION_cube_solve_return
 * @typedef {{  cube_solution:string|null, 
 *				cube_solution_time:number|null,
 *				cube_solution_length:number|null,
 *				cube_solution_model:APP_FUNCTION_cube_solution_model}} APP_FUNCTION_cube_solve_return
 */

export{};
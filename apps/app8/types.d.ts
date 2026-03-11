/**
 * @module apps/app8/types
 */

/**
 * @name APP_FUNCTION_model_robot
 * @description Type APP_FUNCTION_model_robot
 */
type APP_FUNCTION_model_robot = 0

/**
 * @name APP_FUNCTION_model_human
 * @description Type APP_FUNCTION_model_human
 */
type APP_FUNCTION_model_human = 1

/**
 * @name APP_FUNCTION_cube_solution_model
 * @description Type APP_FUNCTION_cube_solution_model
 */
type APP_FUNCTION_cube_solution_model = APP_FUNCTION_model_robot|APP_FUNCTION_model_human
/**
 * @name APP_FUNCTION_notation_singmaster
 * @description Type APP_FUNCTION_notation_singmaster
 */
type APP_FUNCTION_notation_singmaster = 0

/**
 * @name APP_FUNCTION_solution_one
 * @description Type APP_FUNCTION_solution_one
 */
type APP_FUNCTION_solution_one = 0

/**
 * @name APP_FUNCTION_solution_all
 * @description Type APP_FUNCTION_solution_all
 */
type APP_FUNCTION_solution_all = 1
/**
 * @name APP_FUNCTION_cube_solve_data
 * @description Type APP_FUNCTION_cube_solve_data
 */
type APP_FUNCTION_cube_solve_data = {
        model: 				APP_FUNCTION_cube_solution_model,
        preamble:			APP_FUNCTION_notation_singmaster,
        temperature:		APP_FUNCTION_solution_one|APP_FUNCTION_solution_all,
        cube_currentstate:	string,
        cube_goalstate:		string|null,
        client_id: 			number
}
/**
 * @name APP_FUNCTION_cube_solve_return
 * @description Type APP_FUNCTION_cube_solve_return
 */
type APP_FUNCTION_cube_solve_return = {
        cube_solution:string|null, 
        cube_solution_time:number|null,
        cube_solution_length:number|null,
        cube_solution_model:APP_FUNCTION_cube_solution_model
}

export{
        APP_FUNCTION_model_robot,
        APP_FUNCTION_model_human,
        APP_FUNCTION_cube_solution_model,
        APP_FUNCTION_notation_singmaster,
        APP_FUNCTION_solution_one,
        APP_FUNCTION_solution_all,
        APP_FUNCTION_cube_solve_data,
        APP_FUNCTION_cube_solve_return
};
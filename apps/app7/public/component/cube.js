/**
 * @module apps/app7/component/cube
 */

/**
 * @param {{icon_robot:string,
*          icon_human:string, 
*          icon_solution:string,
*          icon_solution_list:string}} props
*/
const template = props =>`  <div id='cube'></div> 
                            <div id='button_controls'>
                                <div class='buttons_row buttons_move'>
                                    <div id='button_L' name='L' class='button_move cube_red'>↷</div>
                                    <div id='button_R' name='R' class='button_move cube_orange'>↷</div>
                                    <div id='button_U' name='U' class='button_move cube_white'>↷</div>
                                    <div id='button_D' name='D' class='button_move cube_yellow'>↷</div>
                                    <div id='button_F' name='F' class='button_move cube_blue'>↷</div>
                                    <div id='button_B' name='B' class='button_move cube_green'>↷</div>
                                </div>
                                <div class='buttons_row buttons_move'>
                                    <div id='button_L2' name="L'" class='button_move cube_red'>↶</div>
                                    <div id='button_R2' name="R'" class='button_move cube_orange'>↶</div>
                                    <div id='button_U2' name="U'" class='button_move cube_white'>↶</div>
                                    <div id='button_D2' name="D'" class='button_move cube_yellow'>↶</div>
                                    <div id='button_F2' name="F'" class='button_move cube_blue'>↶</div>
                                    <div id='button_B2' name="B'" class='button_move cube_green'>↶</div>
                                </div>
                                <div id='overlay'>
                                    <div id='button_step_info'>
                                        <div id='button_step'></div>
                                        <div id='button_step_move'></div>
                                    </div>
                                </div>
                                <div id='button_solve_speed'>
                                    <div id='button_solve_speed_250' data-speed=250 class='button_solve_speed common_dialogue_button button_speed_selected'>250</div>
                                    <div id='button_solve_speed_500' data-speed=500 class='button_solve_speed common_dialogue_button'>500</div>
                                    <div id='button_solve_speed_1000' data-speed=1000 class='button_solve_speed common_dialogue_button'>1000</div>
                                    <div id='button_solve_speed_5000' data-speed=5000 class='button_solve_speed common_dialogue_button'>5000</div>
                                </div>
                                <div class='buttons_row'>
                                    <div class='buttons_col'>
                                        <div id='button_solve' class='common_dialogue_button'></div>
                                    </div>
                                    <div class='buttons_col'>
                                        <div id='button_solve_cubestate' class='common_dialogue_button'></div>
                                    </div>
                                    <div class='buttons_col'>
                                        <div id='app_select_model' class='common_select'>
                                            <div class='common_select_dropdown'>
                                                <div class='common_select_dropdown_value' data-value='0'>${props.icon_robot}</div>
                                                <div class='common_select_dropdown_icon common_icon'></div>
                                            </div>
                                            <div class='common_select_options'>
                                                <div class='common_select_option' data-value='0'>${props.icon_robot}</div>
                                                <div class='common_select_option' data-value='1'>${props.icon_human}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='buttons_col'>
                                        <div id='button_solved_step' class='common_dialogue_button'></div>
                                    </div>
                                    <div class='buttons_col'>
                                        <div id='button_solved_step_cubestate' class='common_dialogue_button'></div>
                                    </div>
                                </div>
                                <div class='buttons_row'>
                                    <div class='buttons_col'>
                                        <div id='button_scramble' class='common_dialogue_button'></div>
                                    </div>
                                    <div class='buttons_col'></div>
                                    <div class='buttons_col'>
                                        <div id='app_select_temperature' class='common_select'>
                                            <div class='common_select_dropdown'>
                                                <div class='common_select_dropdown_value' data-value='0'>${props.icon_solution}</div>
                                                <div class='common_select_dropdown_icon common_icon'></div>
                                            </div>
                                            <div class='common_select_options'>
                                                <div class='common_select_option' data-value='0'>${props.icon_solution}</div>
                                                <div class='common_select_option' data-value='1'>${props.icon_solution_list}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='buttons_col'>
                                        <div id='button_reset' class='common_dialogue_button'></div>
                                    </div>
                                    <div class='buttons_col'>
                                        <div id='button_info' class='common_dialogue_button'></div>
                                    </div>
                                </div>
                            </div>`;
/**
* Cube component
* @param {{ cube_width:number,
*           common_app_id:number,
*           function_element_row:function,
*           function_lov_show:function,
*           function_lov_close:function,
*           function_show_message:function,
*           function_ComponentRemove:function,
*           function_FFB:function,
*           common_document:import('../../../common_types.js').CommonAppDocument,
*           common_mountdiv:string}} props 
* @returns {Promise.<{  props:{function_post:function}, 
*                       data:{  cube_init:                  function, 
*                               cube_show_solution:         function,
*                               cube_solve:                 function,
*                               cube_makeIdentityAffine:    function,
*                               cube_multiplyAffine:        function,
*                               cube_makeRotateAffineX:     function,
*                               cube_makeRotateAffineY:     function},
*                       template:string}>}
*/
const component = async props => {
    const ICONS = {
        robot:'🤖',
        human:'👤',
        moves:'⤮',
        time: '⌛',
        solution:'💡',
        solution_list:'∞'
    };
    /**@type {import('./cube_lib.js')}*/
    const cube_lib = await import('./cube_lib.js');

    
    /**
     * @param {{icon_robot:string,
     *          icon_human:string, 
     *          icon_solution:string,
     *          icon_solution_list:string}} props_template
     */
    const render_template = props_template =>{
        return template(props_template);
    };
    /**
     * @returns {{cube:*, controls:*}}
     */
    const cube_init = () => {
        const cube = new cube_lib.RubiksCube( props.cube_width);
        cube.render();
        return {cube:cube, controls:new cube_lib.RubiksCubeControls('button_controls', cube)};
    };
    /**
     * Show cube solution using LOV to select soluition and start cube moves or show step by step cube moves
     * @param {*} cube
     * @param {*} cube_controls
     * @param {string}  result
     * @param {string}  button_id
     * @returns {void}
     */
    const cube_show_solution = (cube, cube_controls, result, button_id) =>{
        /**
         * @type{{cube_solution:string,
         *        cube_solution_time:number,
         *        cube_solution_length:number,
         *        cube_solution_model:number}[]}
         */
        const cube_result = JSON.parse(result).rows;
        if (cube_result.length>0){
            const cube_result_lov = cube_result.map(row=>{return {
                //use base64 for solution in id column
                id:btoa(row.cube_solution), 
                cube_solution: `${row.cube_solution_model==0?ICONS.robot:ICONS.human} 
                                (${ICONS.moves}:${row.cube_solution_length}, ${ICONS.time}:${row.cube_solution_time}) - ${row.cube_solution}`}; 
            });
            /**
             * Start cube moves if button solve clicked or show cube step by step cube moves
            * @param {import('../../../common_types.js').CommonAppEvent} event
            * @returns {void}
            */
            const function_event = event => {
                const solution = atob(props.function_element_row(event.target).getAttribute('data-id') ?? '');
                if (button_id=='button_solve' || button_id=='button_solve_cubestate')
                    cube.makeMoves(solution);
                else
                    cube_controls.setSolution(solution);
                props.function_lov_close();
            };
            props.function_lov_show({lov:'CUSTOM', lov_custom_list:cube_result_lov, lov_custom_value:'cube_solution', function_event:function_event});
        }
        else
            if (button_id=='button_solve_cubestate' || button_id=='button_solved_step_cubestate')
                props.function_show_message('INFO', null, null, 'message_text','!', props.common_app_id);
    };
    /**
     * Solve the cube state using server function CUBE_SOLVE that uses generative AI pattern
     * @param {*} cube
     * @param {*} cube_controls
     * @param {string} button_id
     * @param {string|null} cube_goalstate
     * @returns {void}
     */
    const cube_solve = (cube, cube_controls, button_id, cube_goalstate=null) => {
        if (cube.rotating == false){
            props.common_document.querySelector(`#${button_id}`).classList.add('css_spinner');
            /**
             *  Solve using generative AI parameters
             * 
             *  model               0=Robot, 1=Human
             *  preamble            0=Singmaster notation
             *  temperature         0=best solution, 1=all solutions for given model
             *  cube current state  string of cube state
             *  cube goalstate      empty to solve or to given cube state
             */
            props.function_FFB('/app-function/CUBE_SOLVE', null, 'POST', 'APP_DATA',
                {   model:              Number(props.common_document.querySelector('#app_select_model .common_select_dropdown_value')?.getAttribute('data-value')),
                    preamble:           0,
                    temperature:        Number(props.common_document.querySelector('#app_select_temperature .common_select_dropdown_value')?.getAttribute('data-value')),
                    cube_currentstate: 	cube.getState(),
                    cube_goalstate: 	cube_goalstate})
                    .then((/**@type{string}*/result)=>{
                        props.function_ComponentRemove('common_dialogue_message', true);
                        props.common_document.querySelector(`#${button_id}`).classList.remove('css_spinner');
                        cube_show_solution(cube, cube_controls, result, button_id);
                    })
                    .catch(()=>{
                        props.function_ComponentRemove('common_dialogue_message', true);
                        props.common_document.querySelector(`#${button_id}`).classList.remove('css_spinner');
                    });
        }
    };
    /**
     * Post component, adds all SVG paths for the cube
     * @returns {void}
     */
    const post_component =() =>{
        let html = '';
        for (let i=0;i<156;i++){
            html += `<path class='cube_face' id='cube_face_${i}'/>`;
        }
        props.common_document.querySelector('#cube').innerHTML = `<svg xmlns='http://www.w3.org/2000/svg'>${html}</svg>`;
   };
   return {
       props:  {function_post:post_component},
       data:   {cube_init:                  cube_init, 
                cube_show_solution:         cube_show_solution,
                cube_solve:                 cube_solve,
                cube_makeIdentityAffine:    cube_lib.makeIdentityAffine,
                cube_multiplyAffine:        cube_lib.multiplyAffine,
                cube_makeRotateAffineX:     cube_lib.makeRotateAffineX,
                cube_makeRotateAffineY:     cube_lib.makeRotateAffineY},
       template: render_template({ icon_robot:ICONS.robot,
                                   icon_human:ICONS.human, 
                                   icon_solution:ICONS.solution,
                                   icon_solution_list:ICONS.solution_list})
   };
};
export default component;
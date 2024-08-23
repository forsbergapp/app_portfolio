const template =`   <div id='app_main'>
                        <div id='app_main_page'>
                            <div id='cube'></div> 
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
                                        <div id='app_select_model' class='common_select'>
                                            <div class='common_select_dropdown'>
                                                <div class='common_select_dropdown_value' data-value='0'>🤖</div>
                                                <div class='common_select_dropdown_icon common_icon'></div>
                                            </div>
                                            <div class='common_select_options'>
                                                <div class='common_select_option' data-value='0'>🤖</div>
                                                <div class='common_select_option' data-value='1'>👤</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='buttons_col'>
                                        <div id='button_solved_step' class='common_dialogue_button'></div>
                                    </div>
                                </div>
                                <div class='buttons_row'>
                                    <div class='buttons_col'>
                                        <div id='button_scramble' class='common_dialogue_button'></div>
                                    </div>
                                    <div class='buttons_col'>
                                        <div id='app_select_temperature' class='common_select'>
                                            <div class='common_select_dropdown'>
                                                <div class='common_select_dropdown_value' data-value='0'>💡</div>
                                                <div class='common_select_dropdown_icon common_icon'></div>
                                            </div>
                                            <div class='common_select_options'>
                                                <div class='common_select_option' data-value='0'>💡</div>
                                                <div class='common_select_option' data-value='1'>∞</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class='buttons_col'>
                                        <div id='button_reset' class='common_dialogue_button'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
/**
 * 
 * @param {{common_document:import('../../../types.js').AppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    props;
    
    const render_template = () =>{
        return template;
    };
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
};
export default component;
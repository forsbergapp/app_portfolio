/**
 * @module apps/app2/component/settings_tab7
 */

/**
 * @param {{user_settings:import('../js/types.js').APP_user_setting['data']}} props
 */
const template = props =>`  <div id='user_settings'>
                                <div class='setting_horizontal_row'>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'>
                                        <div id='setting_icon_user_settings' class='common_icon'></div>
                                    </div>
                                    <div class='setting_horizontal_col'>
                                        <select id='setting_select_user_setting' >
                                            ${props.user_settings.map(user_settings=>
                                                `<option id=${user_settings.id} >${user_settings.json_data.description}</option>`
                                            ).join('')
                                            }                                        
                                        </select>
                                    </div>
                                    <div class='setting_horizontal_col'></div>
                                </div>
                                <div class='setting_horizontal_row'>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'>
                                        <div id='setting_icon_user_url_day' class='common_icon'></div>
                                    </div>
                                    <div class='setting_horizontal_col'>
                                        <div id='setting_data_user_url_day'>
                                            <div id='user_day_html' class='common_dialogue_button common_icon'> </div>
                                        </div>
                                    </div>
                                    <div class='setting_horizontal_col'></div>
                                </div>
                                <div class='setting_horizontal_row'>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'>
                                        <div id='setting_icon_user_url_month' class='common_icon'></div>
                                    </div>
                                    <div class='setting_horizontal_col'>
                                        <div id='setting_data_user_url_month'>
                                            <div id='user_month_html' class='common_dialogue_button common_icon'> </div>
                                        </div>
                                    </div>
                                    <div class='setting_horizontal_col'></div>
                                </div>
                                <div class='setting_horizontal_row'>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'>
                                        <div id='setting_icon_user_url_year' class='common_icon'></div>
                                    </div>
                                    <div class='setting_horizontal_col'>
                                        <div id='setting_data_user_url_year'>
                                            <div id='user_year_html' class='common_dialogue_button common_icon'> </div>
                                        </div>
                                    </div>
                                    <div class='setting_horizontal_col'></div>
                                </div>
                                <div class='setting_horizontal_row'>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'>
                                        <div id='setting_btn_user_save' class='common_dialogue_button common_icon' ></div>
                                        <div id='setting_btn_user_add' class='common_dialogue_button common_icon' ></div>
                                        <div id='setting_btn_user_delete' class='common_dialogue_button common_icon' ></div>
                                    </div>
                                    <div class='setting_horizontal_col'></div>
                                </div>
                            </div>`;
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          user_settings:import('../js/types.js').APP_user_setting['data'] }} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    return {
        props:  {function_post:null},
        data:   null,
        template: template({user_settings:props.user_settings})
    };
};
export default method;
/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id='user_settings'>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_user_settings' class='common_icon'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <select id='setting_select_user_setting' >
                                    <option></option>
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
                                    <div id='user_day_pdf' class='common_dialogue_button common_icon'> </div>
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
                                    <div id='user_month_pdf' class='common_dialogue_button common_icon'> </div>
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
                                    <div id='user_year_pdf' class='common_dialogue_button common_icon'> </div>
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
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    
    const render_template = () =>{
        return template;
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default method;
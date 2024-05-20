/**@type{import('../../../types.js').AppDocument}} */
const AppDocument = document;
const template =`   <div id='toolbar_top'>
                        <div id='app_user_account'></div>
                        <div id='toolbar_btn_zoomout' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_zoomin' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_left' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_right' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_search' class='common_toolbar_button common_icon'></div>
                    </div>
                    <div id='app_profile_search'></div>
                    <div id='paper'></div>
                    <div id='settings'>
                        <div id='settings_tab_navigation'>
                            <div id='settings_tab_nav_1' class='settings_tab_nav settings_tab_nav_selected common_icon'></div>
                            <div id='settings_tab_nav_2' class='settings_tab_nav common_icon'></div>
                            <div id='settings_tab_nav_3' class='settings_tab_nav common_icon'></div>
                            <div id='settings_tab_nav_4' class='settings_tab_nav common_icon'></div>
                            <div id='settings_tab_nav_5' class='settings_tab_nav common_icon'></div>
                            <div id='settings_tab_nav_6' class='settings_tab_nav common_icon'></div>
                            <div id='settings_tab_nav_7' class='settings_tab_nav common_icon'></div>
                        </div>
                        <div id='settings_tab1' class='settings_tab_content'></div>
                        <div id='settings_tab2' class='settings_tab_content'></div>
                        <div id='settings_tab3' class='settings_tab_content'></div>
                        <div id='settings_tab4' class='settings_tab_content'></div>
                        <div id='settings_tab5' class='settings_tab_content'></div>
                        <div id='settings_tab6' class='settings_tab_content'></div>
                        <div id='settings_tab7' class='settings_tab_content'>
                            <div id='user_settings'>
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
                            </div>
                        </div>
                        <div id='settings_close' class='common_dialogue_button common_icon' ></div>
                    </div>
                    <div id='dialogues'>
                        <div id='dialogue_loading'></div>
                        <div id='dialogue_info' class='common_dialogue_content'></div>
                        <div id='dialogue_scan_open_mobile' class='common_dialogue_content'></div>
                    </div>
                    <div id='toolbar_bottom'>
                        <div id='toolbar_btn_about' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_print' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_day' class='common_toolbar_button common_icon' ></div>
                        <div id='app_profile_toolbar'></div>
                        <div id='toolbar_btn_month' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_year' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_settings' class='common_toolbar_button common_icon'></div>
                    </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    
    const render_template = () =>{
        return template;
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default component;
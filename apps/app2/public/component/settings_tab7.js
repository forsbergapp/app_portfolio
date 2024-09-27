/**
 * @module apps/app2/component/settings_tab7
 */

const template = () =>`  <div id='user_settings'>
                                <div class='setting_horizontal_row'>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'>
                                        <div id='setting_icon_user_settings' class='common_icon'></div>
                                    </div>
                                    <div class='setting_horizontal_col'>
                                        <div id='setting_select_user_setting'></div>
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
 *          user_settings:import('../js/types.js').APP_user_setting,
 *          function_ComponentRender:import('../../../common_types.js').CommonModuleCommon['ComponentRender']}} props 
 * @returns {Promise.<{ props:{function_post:function},
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    const post_component = async () =>{
        
        await props.function_ComponentRender({mountDiv:'setting_select_user_setting',
            props:{
                default_data_value:props.user_settings.current_id,
                default_value:props.user_settings.data[props.user_settings.current_id].json_data.description,
                options: props.user_settings.data.map((setting, index)=>{return {value:index, text:setting.json_data.description};}),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            },
            methods:null,
            lifecycle:null,
            path:'/common/component/select.js'});
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template()
    };
};
export default method;
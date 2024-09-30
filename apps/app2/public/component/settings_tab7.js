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
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      user_settings:import('../js/types.js').APP_user_setting,
 *                      },
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      ComponentRender:import('../../../common_types.js').CommonModuleCommon['ComponentRender']
 *                       }}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle,
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const method = async props => {
    const onMounted = async () =>{
        
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_user_setting',
            data:       {
                        default_data_value:props.data.user_settings.current_id,
                        default_value:props.data.user_settings.data[props.data.user_settings.current_id].json_data.description,
                        options: props.data.user_settings.data.map((setting, index)=>{return {value:index, text:setting.json_data.description};}),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            path:'/common/component/common_select.js'});
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template()
    };
};
export default method;
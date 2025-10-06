/**
 * Settings tab 6
 * @module apps/app4/component/settings_tab6
 */
/**
 * @import {common}  from '../../../common_types.js'
 * @import {APP_user_setting}  from '../js/types.js'
 */

/**
 * @name template
 * @description Template
 * @returns {string}
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
                                            <div id='user_day_html' class='common_app_dialogues_button common_icon'> </div>
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
                                            <div id='user_month_html' class='common_app_dialogues_button common_icon'> </div>
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
                                            <div id='user_year_html' class='common_app_dialogues_button common_icon'> </div>
                                        </div>
                                    </div>
                                    <div class='setting_horizontal_col'></div>
                                </div>
                                <div class='setting_horizontal_row'>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'>
                                        <div id='setting_btn_user_save' class='common_app_dialogues_button common_icon' ></div>
                                        <div id='setting_btn_user_add' class='common_app_dialogues_button common_icon' ></div>
                                        <div id='setting_btn_user_delete' class='common_app_dialogues_button common_icon' ></div>
                                    </div>
                                    <div class='setting_horizontal_col'></div>
                                </div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      user_settings:APP_user_setting,
 *                      },
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                       }}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'],
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const onMounted = async () =>{
        
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_user_setting',
            data:       {
                        default_data_value:props.data.user_settings.current_id,
                        default_value:props.data.user_settings.data[props.data.user_settings.current_id].Document.Description,
                        options: props.data.user_settings.data.map((setting, index)=>{return {value:index, text:setting.Document.Description};}),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    null,
            path:'/common/component/common_select.js'});
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;
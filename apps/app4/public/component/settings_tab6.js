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
 * @function
 * @param {{icons:{
 *                  user_settings:string,
 *                  user_url_day:string,
 *                  user_url_month:string,
 *                  user_url_year:string,
 *                  html:string,
 *                  save:string,
 *                  add:string,
 *                  delete:string}}} props
 * @returns {string}
 */
const template = props =>`  <div id='user_settings'>
                                <div class='setting_horizontal_row'>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'>${props.icons.user_settings}</div>
                                    <div class='setting_horizontal_col'>
                                        <div id='setting_select_user_setting'></div>
                                    </div>
                                    <div class='setting_horizontal_col'></div>
                                </div>
                                <div class='setting_horizontal_row'>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'>${props.icons.html}</div>
                                    <div class='setting_horizontal_col'>
                                        <div id='user_day_html' class='common_app_dialogues_button common_link'>${props.icons.user_url_day}</div>
                                    </div>
                                    <div class='setting_horizontal_col'></div>
                                </div>
                                <div class='setting_horizontal_row'>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'>${props.icons.html}</div>
                                    <div class='setting_horizontal_col'>
                                        <div id='user_month_html' class='common_app_dialogues_button common_link'>${props.icons.user_url_month}</div>
                                    </div>
                                    <div class='setting_horizontal_col'></div>
                                </div>
                                <div class='setting_horizontal_row'>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'>${props.icons.html}</div>
                                    <div class='setting_horizontal_col'>
                                        <div id='user_year_html' class='common_app_dialogues_button common_link'>${props.icons.user_url_year}</div>
                                    </div>
                                    <div class='setting_horizontal_col'></div>
                                </div>
                                <div class='setting_horizontal_row'>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'></div>
                                    <div class='setting_horizontal_col'>
                                        <div id='setting_btn_user_save' class='common_app_dialogues_button common_link common_icon_button'>${props.icons.save}</div>
                                        <div id='setting_btn_user_add' class='common_app_dialogues_button common_link common_icon_button'>${props.icons.add}</div>
                                        <div id='setting_btn_user_delete' class='common_app_dialogues_button common_link common_icon_button'>${props.icons.delete}</div>
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
        template:   template({icons:{
                                    user_settings:props.methods.COMMON.commonGlobalGet('ICONS').settings + props.methods.COMMON.commonGlobalGet('ICONS').gps_position,
                                    user_url_day:props.methods.COMMON.commonGlobalGet('ICONS').regional_day,
                                    user_url_month:props.methods.COMMON.commonGlobalGet('ICONS').regional_month,
                                    user_url_year:props.methods.COMMON.commonGlobalGet('ICONS').regional_year,
                                    html:props.methods.COMMON.commonGlobalGet('ICONS').html,
                                    save:props.methods.COMMON.commonGlobalGet('ICONS').save,
                                    add:props.methods.COMMON.commonGlobalGet('ICONS').add,
                                    delete:props.methods.COMMON.commonGlobalGet('ICONS').delete
                            }})
    };
};
export default component;
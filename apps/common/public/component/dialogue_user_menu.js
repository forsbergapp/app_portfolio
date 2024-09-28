/**
 * @module apps/common/component/dialogue_user_menu
 */

/**
 * 
 * @param {{username:string,
 *          countdown:0|1}} props 
 * @returns 
 */
const template = props =>`  <div id='common_dialogue_user_menu_username'>${props.username}</div>
                            ${props.countdown==1?
                                `<div id='common_dialogue_user_menu_token_countdown'>
                                    <div id='common_dialogue_user_menu_token_countdown_time'></div>
                                </div>`:''
                            }
                            <div id='common_dialogue_user_menu_app_theme'></div>
                            <div id='common_dialogue_user_menu_preferences'>
                                <div id='common_dialogue_user_menu_preference_locale' class='common_dialogue_user_menu_preference_col1 common_icon'></div>
                                <div class='common_dialogue_user_menu_preference_col2'>
                                    <div id='common_dialogue_user_menu_user_locale_select'></div>
                                </div>
                                <div id='common_dialogue_user_menu_preference_timezone' class='common_dialogue_user_menu_preference_col1 common_icon'></div>
                                <div class='common_dialogue_user_menu_preference_col2'>
                                    <div id='common_dialogue_user_menu_user_timezone_select'></div>
                                </div>
                                <div id='common_dialogue_user_menu_preference_direction' class='common_dialogue_user_menu_preference_col1 common_icon'></div>
                                <div class='common_dialogue_user_menu_preference_col2'>
                                    <div id='common_dialogue_user_menu_user_direction_select'></div>
                                </div>
                                <div id='common_dialogue_user_menu_preference_arabic_script' class='common_dialogue_user_menu_preference_col1 common_icon'></div>
                                <div class='common_dialogue_user_menu_preference_col2'>
                                    <div id='common_dialogue_user_menu_user_arabic_script_select'></div>
                                </div>
                            </div>
                            <div id='common_dialogue_user_menu_logged_in'>
                                <div id='common_dialogue_user_menu_edit' class='common_icon'></div>
                                <div id='common_dialogue_user_menu_log_out' class='common_icon'></div>
                            </div>
                            <div id='common_dialogue_user_menu_logged_out'>
                                <div id='common_dialogue_user_menu_signup' class='common_icon'></div>
                                <div id='common_dialogue_user_menu_log_in' class='common_icon'></div>
                            </div>
                            <div id='common_dialogue_user_menu_close' class='common_dialogue_button common_icon' ></div>`;
/**
 * div common_dialogue_user_menu_app_theme used to show optional component app_theme.js
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      app_id:number,
 *                      user_account_id:number,
 *                      common_app_id:number,
 *                      data_app_id:number,
 *                      username:string,
 *                      token_exp:number|null,
 *                      token_iat:number|null,
 *                      token_timestamp:number|null,
 *                      system_admin:string,
 *                      system_admin_only:number,
 *                      user_locale:string,
 *                      user_timezone:string,
 *                      user_direction:string,
 *                      user_arabic_script:string},
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      set_current_value:import('../../../common_types.js').CommonModuleCommon['set_current_value'],
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB'],
 *                      ComponentRender:import('../../../common_types.js').CommonModuleCommon['ComponentRender'],
 *                      user_session_countdown:import('../../../common_types.js').CommonModuleCommon['user_session_countdown'],
 *                      show_message:import('../../../common_types.js').CommonModuleCommon['show_message']
 *                      },
 *          lifecycle:  null}} props
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).classList.add('common_dialogue_show1');
    props.methods.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    const is_provider_user = async () =>{
        const user = await props.methods.FFB(`/server-db/user_account/${props.data.user_account_id ?? ''}`, null, 'GET', 'APP_ACCESS', null)
                            .then((/**@type{string}*/result)=>JSON.parse(result))
                            .catch((/**@type{Error}*/error)=>{throw error;});
        if (props.data.user_account_id == parseInt(user.id))
            return user.identity_provider_id!=null;
        else {
            //User not found
            props.methods.show_message('ERROR', '20305', null, null, null, props.data.common_app_id);
            return null;
        }
    };
    
    const adjust_logged_out_logged_in = async () =>{
        //set logged out or logged in
        if (props.data.username || (props.data.user_account_id!=null && await is_provider_user())){
            props.methods.common_document.querySelector('#common_dialogue_user_menu_logged_in').style.display = 'inline-block';
            props.methods.common_document.querySelector('#common_dialogue_user_menu_logged_out').style.display = 'none';
            //admin does not show log out icon here
            if (props.data.app_id == props.data.common_app_id)
                props.methods.common_document.querySelector('#common_dialogue_user_menu_log_out').style.display = 'none';
        }
        else
            if (props.data.system_admin){
                props.methods.common_document.querySelector('#common_dialogue_user_menu_logged_in').style.display = 'none';
                props.methods.common_document.querySelector('#common_dialogue_user_menu_logged_out').style.display = 'none';
            }
            else{
                props.methods.common_document.querySelector('#common_dialogue_user_menu_username').style.display = 'none';
                props.methods.common_document.querySelector('#common_dialogue_user_menu_logged_in').style.display = 'none';
                props.methods.common_document.querySelector('#common_dialogue_user_menu_logged_out').style.display = 'inline-block';
            }
    };
    const post_component = async () =>{                                                               
        //Fetch settings with direction, timezone and arabic script
        /**@type{{id:number, app_setting_type_name:string, value:string, display_data:string}[]} */
        const settings = props.data.system_admin_only == 1?[]:await props.methods.FFB('/server-db/app_settings_display', `data_app_id=${props.data.data_app_id}`, 'GET', 'APP_DATA')
                                                                .then((/**@type{string}*/result)=>JSON.parse(result).rows)
                                                                .catch((/**@type{Error}*/error)=>{throw error;});
        props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = template({ username:props.data.username ?? props.data.system_admin ?? '',
                                                                                                countdown:(props.data.token_exp && props.data.token_iat)?1:0
                                                                                                });
        //mount select
        if (props.data.system_admin_only!=1){
            //Locale
            await props.methods.ComponentRender({
                mountDiv:   'common_dialogue_user_menu_user_locale_select', 
                data:       {
                            default_data_value:props.data.user_locale,
                            default_value:'',
                            options: null,
                            path:'/server-db/locale',
                            query:`lang_code=${props.data.user_locale}`,
                            method:'GET',
                            authorization_type:'APP_DATA',
                            column_value:'locale',
                            column_text:'text'
                            },
                methods:    {FFB:props.methods.FFB},
                lifecycle:  null,
                path:       '/common/component/select.js'});
            //Timezone
            await props.methods.ComponentRender({
                mountDiv:  'common_dialogue_user_menu_user_timezone_select', 
                data:       {
                            default_data_value:props.data.user_timezone,
                            default_value:'',
                            options: settings.filter(setting=>setting.app_setting_type_name=='TIMEZONE'),
                            path:null,
                            query:null,
                            method:null,
                            authorization_type:null,
                            column_value:'value',
                            column_text:'display_data'
                            },
                methods:    {FFB:props.methods.FFB},
                lifecycle:null,
                path:'/common/component/select.js'});
            //Direction with default ' '
            await props.methods.ComponentRender({
                mountDiv:   'common_dialogue_user_menu_user_direction_select', 
                data:       {
                            default_data_value:props.data.user_direction,
                            default_value:' ',
                            options: [{value:'', display_data:' '}].concat(settings.filter(setting=>setting.app_setting_type_name=='DIRECTION')),
                            path:null,
                            query:null,
                            method:null,
                            authorization_type:null,
                            column_value:'value',
                            column_text:'display_data'
                            },
                methods:    {FFB:props.methods.FFB},
                lifecycle:  null,
                path:       '/common/component/select.js'});   
            //Arabic script with default ' '
            await props.methods.ComponentRender({
                mountDiv:   'common_dialogue_user_menu_user_arabic_script_select', 
                data:       {
                            default_data_value:props.data.user_arabic_script,
                            default_value:' ',
                            options: [{value:'', display_data:' '}].concat(settings.filter(setting=>setting.app_setting_type_name=='ARABIC_SCRIPT')),
                            path:null,
                            query:null,
                            method:null,
                            authorization_type:null,
                            column_value:'value',
                            column_text:'display_data'
                            },
                methods:    {FFB:props.methods.FFB},
                lifecycle:  null,
                path:       '/common/component/select.js'});
        }
        if ((props.data.system_admin_only == 1)==false){
            //set current value on all the selects
            props.methods.set_current_value('common_dialogue_user_menu_user_locale_select', props.data.user_locale);
            props.methods.set_current_value('common_dialogue_user_menu_user_timezone_select', props.data.user_timezone);
            props.methods.set_current_value('common_dialogue_user_menu_user_direction_select', props.data.user_direction);
            props.methods.set_current_value('common_dialogue_user_menu_user_arabic_script_select', props.data.user_arabic_script);
        }
        await adjust_logged_out_logged_in();
        if (props.data.token_exp && props.data.token_iat){
            const element_id = 'common_dialogue_user_menu_token_countdown_time';
            props.methods.user_session_countdown(props.methods.common_document.querySelector(`#${element_id}`), props.data.token_exp);
        }   
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template({username:props.data.username ?? props.data.system_admin ?? '', countdown:0})
    };
};
export default component;
const template =`   <div id='common_dialogue_user_menu_username'><USERNAME/></div>
                    <div id='common_dialogue_user_menu_app_theme'></div>
                    <div id='common_dialogue_user_menu_preferences'>
                        <div id='common_dialogue_user_menu_preference_locale' class='common_dialogue_user_menu_preference_col1 common_icon'></div>
                        <div class='common_dialogue_user_menu_preference_col2'>
                            <select id='common_dialogue_user_menu_user_locale_select' >
                                <COMMON_USER_LOCALE/>
                            </select>
                        </div>
                        <div id='common_dialogue_user_menu_preference_timezone' class='common_dialogue_user_menu_preference_col1 common_icon'></div>
                        <div class='common_dialogue_user_menu_preference_col2'>
                            <select id='common_dialogue_user_menu_user_timezone_select' >
                                <COMMON_USER_TIMEZONE/>
                            </select>
                        </div>
                        <div id='common_dialogue_user_menu_preference_direction' class='common_dialogue_user_menu_preference_col1 common_icon'></div>
                        <div class='common_dialogue_user_menu_preference_col2'>
                            <select id='common_dialogue_user_menu_user_direction_select' >
                                <COMMON_USER_DIRECTION/>
                            </select>
                        </div>
                        <div id='common_dialogue_user_menu_preference_arabic_script' class='common_dialogue_user_menu_preference_col1 common_icon'></div>
                        <div class='common_dialogue_user_menu_preference_col2'>
                            <select id='common_dialogue_user_menu_user_arabic_script_select' >
                                <COMMON_USER_ARABIC_SCRIPT/>
                            </select>
                        </div>
                    </div>
                    <div id='common_dialogue_user_menu_logged_in'>
                        <div id='common_dialogue_user_menu_edit' class='common_icon'></div>
                        <div id='common_dialogue_user_menu_log_out' class='common_icon'></div>
                    </div>
                    <div id='common_dialogue_user_menu_logged_out'>
                        <div id='common_dialogue_user_menu_signup' class='common_icon'></div>
                        <div id='common_dialogue_user_menu_log_in' class='common_icon'></div>
                    </div>`;
/**
 * div common_dialogue_user_menu_app_theme used to show optional component app_theme.js
 * @param {*} props 
 * @returns {Promise.<{ props:{function_post:function|null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show1');
    props.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    /* how to call
    ComponentRender('common_dialogue_user_menu', 
                    {   app_id:COMMON_GLOBAL.app_id,
                        user_account_id:common.COMMON_GLOBAL.user_account_id,
                        common_app_id:COMMON_GLOBAL.common_app_id,
                        data_app_id:COMMON_GLOBAL.common_app_id,
                        username:common.COMMON_GLOBAL.user_account_username,
                        system_admin:common.COMMON_GLOBAL.system_admin,
                        current_locale:COMMON_GLOBAL.user_locale,
                        current_timezone:COMMON_GLOBAL.user_timezone,
                        current_direction:COMMON_GLOBAL.user_direction,
                        current_arabic_script:COMMON_GLOBAL.user_arabic_script,
                        //functions
                        function_FFB:FFB,
                        function_get_locales_options:COMMON_GLOBAL.get_locales_options,
                        function_show_message:show_message},
                    '/common/component/dialogue_user_menu.js')
    */
    const is_provider_user = async () =>{
        const user = await props.function_FFB('DB_API', `/user_account?user_account_id=${props.user_account_id ?? ''}`, 'GET', 'APP_ACCESS', null)
                            .then((/**@type{string}*/result)=>JSON.parse(result))
                            .catch((/**@type{Error}*/error)=>{throw error});
        if (props.user_account_id == parseInt(user.id)) {
            return user.identity_provider_id!=null;
        } else {
            //User not found
            props.function_show_message('ERROR', '20305', null, null, null, props.common_app_id);
            return null;
        }
    }
    /**
     * Renders user preferences options timezone, direction and arabic script
     * @returns {Promise<{  timezone:   string,
     *                      direction:  string,
     *                      arab_script:string}>}
     */
     const get_preferences_options = async () =>{
        const app_settings = await props.function_FFB('DB_API', `/app_setting?data_app_id=${props.data_app_id}`, 'GET', 'APP_DATA')
                            .then((/**@type{string}*/result)=>JSON.parse(result))
                            .catch((/**@type{Error}*/error)=>{throw error});
        let options_timezone = '';
        let options_direction = '';
        let options_arabic_script = '';
        for (const app_setting of app_settings){
            switch (app_setting.app_setting_type_name){
                case 'TIMEZONE':{
                    options_timezone += `<option id=${app_setting.id} value='${app_setting.value}'>${app_setting.display_data}</option>`;
                    break;
                }
                case 'DIRECTION':{
                    options_direction += `<option id=${app_setting.id} value='${app_setting.value}'>${app_setting.display_data}</option>`;
                    break;
                }
                case 'ARABIC_SCRIPT':{
                    options_arabic_script += `<option id=${app_setting.id} value='${app_setting.value}'>${app_setting.display_data}</option>`;
                    break;
                }
            }
        }
        return {timezone:   options_timezone,
                direction:  `<option id='' value=''></option>${options_direction}`,  
                arab_script:`<option id='' value=''></option>${options_arabic_script}`};
    };
    const update_rendered = async () =>{
        //set current value on all the selects
        const common_dialogue_user_menu_user_locale_select =           props.common_document.querySelector('#common_dialogue_user_menu_user_locale_select');
        common_dialogue_user_menu_user_locale_select.value =           props.current_locale;
        const common_dialogue_user_menu_user_timezone_select =         props.common_document.querySelector('#common_dialogue_user_menu_user_timezone_select');
        common_dialogue_user_menu_user_timezone_select.value =         props.current_timezone;
        const common_dialogue_user_menu_user_direction_select =        props.common_document.querySelector('#common_dialogue_user_menu_user_direction_select');
        common_dialogue_user_menu_user_direction_select.value =        props.current_direction;
        const common_dialogue_user_menu_user_arabic_script_select =    props.common_document.querySelector('#common_dialogue_user_menu_user_arabic_script_select');
        common_dialogue_user_menu_user_arabic_script_select.value =    props.current_arabic_script;
        //set logged out or logged in
        if (props.username || (props.user_account_id!=null && await is_provider_user())){
            props.common_document.querySelector('#common_dialogue_user_menu_logged_in').style.display = 'inline-block';
            props.common_document.querySelector('#common_dialogue_user_menu_logged_out').style.display = 'none';
            //admin does not show log out icon here
            if (props.app_id == props.common_app_id)
                props.common_document.querySelector('#common_dialogue_user_menu_log_out').style.display = 'none';
        }
        else
            if (props.system_admin){
                props.common_document.querySelector('#common_dialogue_user_menu_logged_in').style.display = 'none';
                props.common_document.querySelector('#common_dialogue_user_menu_logged_out').style.display = 'none';
            }
            else{
                props.common_document.querySelector('#common_dialogue_user_menu_username').style.display = 'none';
                props.common_document.querySelector('#common_dialogue_user_menu_logged_in').style.display = 'none';
                props.common_document.querySelector('#common_dialogue_user_menu_logged_out').style.display = 'inline-block';
            }
    }
    const render_template = async () =>{
        if (props.system_admin_only && props.system_admin_only==1){
            return template
                    .replace('<USERNAME/>',                 props.username ?? props.system_admin ?? '')
                    .replace('<COMMON_USER_LOCALE/>',       '')
                    .replace('<COMMON_USER_TIMEZONE/>',     '')
                    .replace('<COMMON_USER_DIRECTION/>',    '')
                    .replace('<COMMON_USER_ARABIC_SCRIPT/>','');
        }
        else{
            const options_locales = await props.function_get_locales_options();
            const options_settings = await get_preferences_options();
            
            return template
                    .replace('<USERNAME/>',                 props.username ?? props.system_admin ?? '')
                    .replace('<COMMON_USER_LOCALE/>',       options_locales)
                    .replace('<COMMON_USER_TIMEZONE/>',     options_settings.timezone)
                    .replace('<COMMON_USER_DIRECTION/>',    options_settings.direction)
                    .replace('<COMMON_USER_ARABIC_SCRIPT/>',options_settings.arab_script);
        }
    }
    return {
        props:  {function_post:update_rendered},
        data:   null,
        template: await render_template()
    };
}
export default component;
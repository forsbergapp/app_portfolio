/**@type{import('../../../types.js').AppDocument} */
const AppDocument = document;

/**@ts-ignore */
const common = await import('common');
/**
 * App exception function
 * @param {Error} error 
 * @returns {void}
 */
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, null, error);
};
/**
 * App event click
 * @param {import('../../../types.js').AppEvent} event 
 * @returns {void}
 */
const app_event_click = event => {
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click',(/**@type{import('../../../types.js').AppEvent}*/event) => {
            app_event_click(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('click',event)
        .then(()=>{
            switch (event_target_id){
                case 'app_page_secure_refresh':{
                    init_secure();
                    break;
                }
                case 'app_page_start_get_bankaccount':
                case 'app_page_start_bank_account':
                case 'app_page_start_bank_statements':
                case 'app_page_start_bank_directpayment':
                case 'app_page_start_bank_iso':{
                    common.show_common_dialogue('SIGNUP');
                    break;
                }
                /* COMMON */
                case 'common_toolbar_framework_js':{
                   framework_set(1);
                    break;
                }
                case 'common_toolbar_framework_vue':{
                   framework_set(2);
                    break;
                }
                case 'common_toolbar_framework_react':{
                   framework_set(3);
                    break;
                }
                //dialogue user menu
                case 'common_user_menu':
                case 'common_user_menu_logged_in':
                case 'common_user_menu_avatar':
                case 'common_user_menu_avatar_img':
                case 'common_user_menu_logged_out':
                case 'common_user_menu_default_avatar':{
                    common.ComponentRender('common_dialogue_user_menu', 
                    {   app_id:common.COMMON_GLOBAL.app_id,
                        user_account_id:common.COMMON_GLOBAL.user_account_id,
                        common_app_id:common.COMMON_GLOBAL.common_app_id,
                        data_app_id:common.COMMON_GLOBAL.common_app_id,
                        username:common.COMMON_GLOBAL.user_account_username,
                        token_exp:common.COMMON_GLOBAL.token_exp,
                        token_iat:common.COMMON_GLOBAL.token_iat,
                        token_timestamp: common.COMMON_GLOBAL.token_timestamp,
                        system_admin:common.COMMON_GLOBAL.system_admin,
                        current_locale:common.COMMON_GLOBAL.user_locale,
                        current_timezone:common.COMMON_GLOBAL.user_timezone,
                        current_direction:common.COMMON_GLOBAL.user_direction,
                        current_arabic_script:common.COMMON_GLOBAL.user_arabic_script,
                        //functions
                        function_FFB:common.FFB,
                        function_user_session_countdown:common.user_session_countdown,
                        function_show_message:common.show_message},
                                            '/common/component/dialogue_user_menu.js')
                    .then(()=>common.ComponentRender(   'common_dialogue_user_menu_app_theme', 
                                                        {function_app_theme_update:common.common_preferences_post_mount},
                                                        '/common/component/app_theme.js'));
                    break;
                }
                case 'common_dialogue_user_menu_log_out':{
                    user_logoff_app();
                    break;
                }
                /*Dialogue user start */
                case 'common_user_start_login_button':{
                    common.user_login()
                    .then(()=>common.ComponentRemove('app_main_page'))
                    .then(()=>init_secure())
                    .catch(()=>null);
                    break;
                }
                
                case 'common_user_start_signup_button':{
                    common.user_signup();
                    break;
                }
                case 'common_user_start_identity_provider_login':{
                    const target_row = common.element_row(event.target);
                    common.user_login(null, null, null, target_row.querySelector('.common_login_provider_id').innerHTML)
                    .then(()=>common.ComponentRemove('app_main_page'))
                    .then(()=>init_secure())
                    .catch(()=>null);
                    break;
                }
            }
        });
    }
};
/**
 * App event change
 * @param {import('../../../types.js').AppEvent} event 
 * @returns {void}
 */
const app_event_change = event =>{
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('change',(/**@type{import('../../../types.js').AppEvent}*/event) => {
            app_event_change(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('change',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_dialogue_user_menu_user_locale_select':{
                    common.common_translate_ui(event.target.value);
                    break;
                }
                case 'common_dialogue_user_menu_user_arabic_script_select':
                case 'common_dialogue_user_menu_app_select_theme':{
                    AppDocument.body.className = 'app_theme' + AppDocument.querySelector('#common_dialogue_user_menu_app_select_theme').value;
                    common.common_preferences_update_body_class_from_preferences()
                    break;
                }
            }
        });
    }
};
const user_logoff_app = () =>{
    common.user_logoff()
    .then(()=>common.ComponentRemove('app_main_page'))
    .then(()=>common.ComponentRender('app_main_page',
                                    {},
                                    '/component/page_start.js'));
}
/**
 * Sets framework
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
const framework_set = async (framework=null) => {
    await common.framework_set(framework,
        {   Click: app_event_click,
            Change: app_event_change,
            KeyDown: null,
            KeyUp: null,
            Focus: null,
            Input:null});
};
/**
 * IBAN mod 97
 * @param {string} str 
 * @returns {number}
 */
const IBAN_mod97 = str => {
    const first9 = str.substring(0, 9);
    const remainingStr = str.substring(9);
    const remainder = Number(first9) % 97; 
    const newString = remainder.toString() + remainingStr;
    if (newString.length > 2)
        return IBAN_mod97(newString);
    return remainder;};

/**
 * IBAN get check digit
 * @param {string} country_code 
 * @param {string} bban 
 * @returns {number}
 */
const IBAN_getCheckDigit = (country_code, bban) => {
    const checkstring = bban + (country_code.charCodeAt(0) - 55) + (country_code.charCodeAt(1) - 55); 
    for(let digit=0; digit<99;digit++){
        const remainder = IBAN_mod97(checkstring + digit.toString().padStart(2,'0')); 
        if (remainder == 1)
            return digit;
    }
    return -1;
};
/**
 * IBAN compose with optional print format
 * @param {string} country_code 
 * @param {string} bank_id 
 * @param {string} account_number 
 * @param {boolean} print_format 
 * @returns {string}
 */
const IBAN_compose = (country_code, bank_id, account_number, print_format=false) => {
    const bban = bank_id.toString() + account_number.toString();
    if (print_format){
        const bban_print_string = bban.toString().match(/.{0,4}/g);
        if (bban_print_string)
            return country_code.toUpperCase() + IBAN_getCheckDigit(country_code, bban).toString() + ' ' + bban_print_string.join(' ');
        else
            return country_code.toUpperCase() + IBAN_getCheckDigit(country_code, bban).toString() + ' ' + '';
    }
    else
        return country_code.toUpperCase() + IBAN_getCheckDigit(country_code, bban) + bban.toString();
}
/**
 * IBAN validate
 * @param {string} iban 
 * @returns {boolean}
 */
const IBAN_validate = iban => {
    const reorderedString = iban.substring(4) + iban.substring(0, 4);
    const replacedString = reorderedString.replaceAll(/[a-z]{1}/gi, match =>(match.toUpperCase().charCodeAt(0) - 55).toString(),);
    return IBAN_mod97(replacedString) === 1;
};

/**
 * Init secure
 * @returns {void}
 */
const init_secure = () => {
    common.ComponentRender('app_main_page',
                            {locale:common.COMMON_GLOBAL.user_locale,
                            app_data_bank_id:1234,
                            app_data_bank_name:'App Bank',
                            app_data_bank_country_code:'SE',
                            app_data_bank_account_currency: '€',
                            app_data_bank_account_currency_name:'App Euro',
                            app_data_customer_bban:'0000123456789012',
                            user_timezone:common.COMMON_GLOBAL.user_timezone,
                            function_IBAN_compose:IBAN_compose,
                            function_FFB:common.FFB},
                            '/component/page_secure.js');
}
/**
 * Init app
 * @returns {Promise.<void>}
 */
const init_app = async () => {
    AppDocument.body.className = 'app_theme1';
    await common.ComponentRender(common.COMMON_GLOBAL.app_div, {}, '/component/app.js')
    .then(()=> common.ComponentRender('app_top_usermenu', 
                                        {},
                                        '/common/component/user_account.js'))
    .then(()=> common.ComponentRender('app_main_page', 
                                        {},
                                        '/component/page_start.js'))
    .then(()=> common.ComponentRender('app_construction', {}, '/common/component/construction.js'));
   framework_set();
};
/**
 * Init common
 * @param {{app:*[],
 *          app_service:{system_admin_only:number, first_time:number}}} parameters 
 * @returns {void}
 */
const init = parameters => {
    common.COMMON_GLOBAL.app_function_exception = app_exception;
    common.COMMON_GLOBAL.app_function_session_expired = user_logoff_app;
    common.init_common(parameters).then(()=>{
        init_app();
    });
};
export{init};
/**@type{{body:{className:string, classList:{add:function}},
 *        querySelector:function}} */
 const AppDocument = document;

 /**
 * @typedef {object}        AppEvent
 * @property {string}       code
 * @property {function}     preventDefault
 * @property {function}     stopPropagation
 * @property {{ id:                 string,
  *              innerHTML:          string,
  *              value:              string,
  *              parentNode:         {nextElementSibling:{querySelector:function}},
  *              nextElementSibling: {dispatchEvent:function},
  *              focus:              function,
  *              blur:               function,
  *              getAttribute:       function,
  *              setAttribute:       function,
  *              dispatchEvent:      function,
  *              classList:          {contains:function}
  *              className:          string
  *            }}  target
  */
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
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_click = event => {
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click',(/**@type{AppEvent}*/event) => {
            app_event_click(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('click',event)
        .then(()=>{
            switch (event_target_id){
                case 'app_page_secure_refresh':{
                    common.ComponentRender('app_main_page',
                                            {locale:common.COMMON_GLOBAL.user_locale},
                                            '/component/page_secure.js');
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
                        function_show_message:common.show_message},
                                            '/common/component/dialogue_user_menu.js')
                    .then(()=>common.ComponentRender(   'common_dialogue_user_menu_app_theme', 
                                                        {function_app_theme_update:common.common_preferences_post_mount},
                                                        '/common/component/app_theme.js'));
                    break;
                }
                case 'common_dialogue_user_menu_log_out':{
                    common.user_logoff()
                    .then(()=>common.ComponentRemove('app_main_page'))
                    .then(()=>common.ComponentRender('app_main_page',
                                                    {},
                                                    '/component/page_start.js'))
                    break;
                }
                /*Dialogue user start */
                case 'common_user_start_login_button':{
                    common.user_login()
                    .then(()=>common.ComponentRemove('app_main_page'))
                    .then(()=>common.ComponentRender('app_main_page',
                                {locale:common.COMMON_GLOBAL.user_locale},
                                '/component/page_secure.js'))
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
                    .then(()=>common.ComponentRender('app_main_page',
                                {locale:common.COMMON_GLOBAL.user_locale},
                                '/component/page_secure.js'))
                    .catch(()=>null);
                    break;
                }
            }
        });
    }
};
/**
 * App event change
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_change = event =>{
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('change',(/**@type{AppEvent}*/event) => {
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
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        init_app();
    });
};
export{init};
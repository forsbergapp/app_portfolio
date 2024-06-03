/**@type{import('../../../types.js').AppDocument} */
const AppDocument = document;

const path_common ='common';
/**@type {import('../../../types.js').module_common} */
const common = await import(path_common);
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
                case 'tab1':
                case 'tab2':
                case 'tab3':{
                    AppDocument.querySelectorAll('.app_page_secure_tab').forEach((/**@type{HTMLElement}*/element)=>element.classList.remove('active'));
                    AppDocument.querySelector(`#${event_target_id}`).classList.add('active');
                    switch (event_target_id){
                        case 'tab1':{
                            common.ComponentRender('app_page_secure_tab_content', 
                                            {
                                                display_type:'MASTER_DETAIL_HORIZONTAL',
                                                master_path:'/app-function/ACCOUNT_STATEMENT',
                                                master_query:`user_account_id=${common.COMMON_GLOBAL.user_account_id}&data_app_id=${common.COMMON_GLOBAL.app_id}`,
                                                master_method:'GET',
                                                master_token_type:'APP_ACCESS',
                                                detail_path:'/app-function/ACCOUNT_TRANSACTIONS',
                                                detail_query:   `user_account_id=${common.COMMON_GLOBAL.user_account_id}&data_app_id=${common.COMMON_GLOBAL.app_id}`+ 
                                                                `&fields=timestamp,logo,origin,amount_deposit,amount_withdrawal`,
                                                detail_method:'GET',
                                                detail_token_type:'APP_ACCESS',
                                                detail_class:'bank_statement',
                                                new_resource:false,
                                                mode:'READ',
                                                timezone:common.COMMON_GLOBAL.user_timezone,
                                                locale:common.COMMON_GLOBAL.user_locale,
                                                button_print: false,
                                                button_update: false,
                                                button_post: false,
                                                button_delete: false,
                                                function_FFB:common.FFB,
                                                function_button_print:null,
                                                function_button_update:null,
                                                function_button_post:null,
                                                function_button_delete:null
                                            }, '/common/component/app_data_display.js');                            
                            break;
                        }
                        case 'tab2':{
                            common.ComponentRender('app_page_secure_tab_content', 
                                            {
                                                display_type:'VERTICAL_KEY_VALUE',
                                                master_path:'/server-db/app_data_resource_master/',
                                                master_query:   `resource_name=CUSTOMER&user_account_id=${common.COMMON_GLOBAL.user_account_id}&data_app_id=${common.COMMON_GLOBAL.app_id}` + 
                                                                `&fields=name,customer_type,address,city,country,resource_metadata`,
                                                master_method:'GET',
                                                master_token_type:'APP_ACCESS',
                                                detail_path:null,
                                                detail_query:null,
                                                detail_method:null,
                                                detail_token_type:null,
                                                detail_class:null,
                                                new_resource:false,
                                                mode:'READ',
                                                timezone:common.COMMON_GLOBAL.user_timezone,
                                                locale:common.COMMON_GLOBAL.user_locale,
                                                button_print: false,
                                                button_update: false,
                                                button_post: false,
                                                button_delete: false,
                                                function_FFB:common.FFB,
                                                function_button_print:null,
                                                function_button_update:null,
                                                function_button_post:null,
                                                function_button_delete:null
                                            }, '/common/component/app_data_display.js');
                            break;
                        }
                        case 'tab3':{
                            common.ComponentRender('app_page_secure_tab_content', 
                                            {
                                                display_type:'VERTICAL_KEY_VALUE',
                                                master_path:'/server-db/app_data_resource_detail/',
                                                master_query:   `resource_name=ACCOUNT&user_account_id=${common.COMMON_GLOBAL.user_account_id}&data_app_id=${common.COMMON_GLOBAL.app_id}` + 
                                                                `&fields=bank_account_number,bank_account_secret,bank_account_vpa,resource_metadata`,
                                                master_method:'GET',
                                                master_token_type:'APP_ACCESS',
                                                detail_path:null,
                                                detail_query:null,
                                                detail_method:null,
                                                detail_token_type:null,
                                                detail_class:null,
                                                new_resource:false,
                                                mode:'READ',
                                                timezone:common.COMMON_GLOBAL.user_timezone,
                                                locale:common.COMMON_GLOBAL.user_locale,
                                                button_print: false,
                                                button_update: false,
                                                button_post: false,
                                                button_delete: false,
                                                function_FFB:common.FFB,
                                                function_button_print:null,
                                                function_button_update:null,
                                                function_button_post:null,
                                                function_button_delete:null
                                            }, '/common/component/app_data_display.js');
                            break;
                        }
                    }
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
                    common.user_login(null, null, null, Number(target_row.querySelector('.common_login_provider_id').innerHTML))
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

const customer_create = async () => {
    AppDocument.querySelector(`#common_app_data_display_button_post`).classList.add('css_spinner');
    await common.FFB(   '/app-function/CUSTOMER_CREATE', 
                        null, 
                        'POST', 
                        'APP_ACCESS', 
                        {
                            user_account_id :common.COMMON_GLOBAL.user_account_id,
                            data_app_id     :common.COMMON_GLOBAL.app_id,
                            customer_type   :AppDocument.querySelector(`#app_page_secure_tab_content [data-value='customer_type']`).innerHTML,
                            name            :AppDocument.querySelector(`#app_page_secure_tab_content [data-value='name']`).innerHTML,
                            address         :AppDocument.querySelector(`#app_page_secure_tab_content [data-value='address']`).innerHTML,
                            city            :AppDocument.querySelector(`#app_page_secure_tab_content [data-value='city']`).innerHTML,
                            country         :AppDocument.querySelector(`#app_page_secure_tab_content [data-value='customer_type']`).innerHTML
                        }
                    );
    init_secure();
}
/**
 * Init secure
 * @returns {void}
 */
const init_secure = () => {
    common.ComponentRender('app_main_page',
                            {
                            app_id:common.COMMON_GLOBAL.app_id,
                            user_id:common.COMMON_GLOBAL.user_account_id,
                            timezone:common.COMMON_GLOBAL.user_timezone,
                            locale:common.COMMON_GLOBAL.user_locale,
                            function_button_post:customer_create,
                            function_ComponentRender:common.ComponentRender,
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
 * @param {string} parameters 
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
/**
 * Bank app
 * @module apps/app5/app
 */

/**@type{import('../../../common_types.js').COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const path_common ='common';
/**@type {import('../../../common_types.js').CommonModuleCommon} */
const common = await import(path_common);
/**
 * App exception function
 * @param {Error} error 
 * @returns {void}
 */
const app_exception = (error) => {
    common.commonMessageShow('EXCEPTION', null, null, null, error);
};
/**
 * App event click
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const app_event_click = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_click(event);
        });
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        common.commonEvent('click',event)
        .then(()=>{
            switch (event_target_id){
                case 'tab1':
                case 'tab2':
                case 'tab3':{
                    COMMON_DOCUMENT.querySelectorAll('.app_page_secure_tab').forEach((/**@type{HTMLElement}*/element)=>element.classList.remove('active'));
                    COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('active');
                    switch (event_target_id){
                        case 'tab1':{
                            common.commonComponentRender({
                                mountDiv:   'app_page_secure_tab_content', 
                                data:       {
                                            app_id:common.COMMON_GLOBAL.app_id,
                                            display_type:'MASTER_DETAIL_HORIZONTAL',
                                            master_path:'/app-function/ACCOUNT_STATEMENT',
                                            master_query:'fields=title,bank_account_balance,bank_account_number,bank_account_iban,currency,currency_name',
                                            master_body:{user_account_id: common.COMMON_GLOBAL.user_account_id, data_app_id:common.COMMON_GLOBAL.app_id},
                                            master_method:'POST',
                                            master_token_type:'APP_ACCESS',
                                            master_resource:'ACCOUNT_METADATA',
                                            detail_path:'/app-function/ACCOUNT_TRANSACTIONS',
                                            detail_query: 'fields=timestamp,logo,origin,amount_deposit,amount_withdrawal',
                                            detail_body: {user_account_id:common.COMMON_GLOBAL.user_account_id,data_app_id:common.COMMON_GLOBAL.app_id},
                                            detail_method:'POST',
                                            detail_token_type:'APP_ACCESS',
                                            detail_resource:'TRANSACTION_METADATA',
                                            detail_class:'bank_statement',
                                            new_resource:false,
                                            mode:'READ',
                                            timezone:common.COMMON_GLOBAL.user_timezone,
                                            locale:common.COMMON_GLOBAL.user_locale,
                                            button_print: false,
                                            button_update: false,
                                            button_post: false,
                                            button_delete: false
                                            },
                                methods:    {
                                           commonFFB:common.commonFFB,
                                            button_print:null,
                                            button_update:null,
                                            button_post:null,
                                            button_delete:null
                                            },
                                path:'/common/component/common_app_data_display.js'});
                            break;
                        }
                        case 'tab2':{
                            common.commonComponentRender({
                                mountDiv:   'app_page_secure_tab_content', 
                                data:       {
                                            app_id:common.COMMON_GLOBAL.app_id,
                                            display_type:'VERTICAL_KEY_VALUE',
                                            master_path:'/app-function/CUSTOMER_GET',
                                            master_query: 'fields=name,customer_type,address,city,country',
                                            master_body:{user_account_id:common.COMMON_GLOBAL.user_account_id, data_app_id:common.COMMON_GLOBAL.app_id},
                                            master_method:'POST',
                                            master_token_type:'APP_ACCESS',
                                            master_resource:'CUSTOMER_METADATA',
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
                                            button_delete: false
                                            },
                                methods:    {
                                           commonFFB:common.commonFFB,
                                            button_print:null,
                                            button_update:null,
                                            button_post:null,
                                            button_delete:null
                                            },
                                path:       '/common/component/common_app_data_display.js'});
                            break;
                        }
                        case 'tab3':{
                            common.commonComponentRender({
                                mountDiv:   'app_page_secure_tab_content', 
                                data:       {
                                            app_id:common.COMMON_GLOBAL.app_id,
                                            display_type:'VERTICAL_KEY_VALUE',
                                            master_path:'/app-function/ACCOUNT_GET',
                                            master_query: 'fields=title,title_sub,bank_account_number,bank_account_secret,bank_account_vpa',
                                            master_body: {user_account_id:common.COMMON_GLOBAL.user_account_id, data_app_id:common.COMMON_GLOBAL.app_id},
                                            master_method:'POST',
                                            master_token_type:'APP_ACCESS',
                                            master_resource:'ACCOUNT_METADATA',
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
                                            button_delete: false
                                            },
                                methods:    {
                                           commonFFB:common.commonFFB,
                                            button_print:null,
                                            button_update:null,
                                            button_post:null,
                                            button_delete:null
                                            },
                                path:       '/common/component/common_app_data_display.js'});
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
                    common.commonDialogueShow('SIGNUP');
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
                    common.commonComponentRender({
                        mountDiv:   'common_dialogue_user_menu', 
                        data:       {
                                    app_id:common.COMMON_GLOBAL.app_id,
                                    user_account_id:common.COMMON_GLOBAL.user_account_id,
                                    common_app_id:common.COMMON_GLOBAL.common_app_id,
                                    data_app_id:common.COMMON_GLOBAL.common_app_id,
                                    username:common.COMMON_GLOBAL.user_account_username,
                                    token_exp:common.COMMON_GLOBAL.token_exp,
                                    token_iat:common.COMMON_GLOBAL.token_iat,
                                    token_timestamp: common.COMMON_GLOBAL.token_timestamp,
                                    admin:common.COMMON_GLOBAL.admin,
                                    user_locale:common.COMMON_GLOBAL.user_locale,
                                    user_timezone:common.COMMON_GLOBAL.user_timezone,
                                    user_direction:common.COMMON_GLOBAL.user_direction,
                                    user_arabic_script:common.COMMON_GLOBAL.user_arabic_script
                                    },
                        methods:    {
                                    commonSelectCurrentValueSet:common.commonSelectCurrentValueSet,
                                   commonFFB:common.commonFFB,
                                    commonComponentRender:common.commonComponentRender,
                                    commonUserSessionCountdown:common.commonUserSessionCountdown,
                                    commonMessageShow:common.commonMessageShow
                                    },
                        path:       '/common/component/common_dialogue_user_menu.js'})
                    .then(()=>
                        common.commonComponentRender({
                            mountDiv:   'common_dialogue_user_menu_app_theme', 
                            data:       null,
                            methods:    {
                                        commonThemeDefaultList:common.commonThemeDefaultList,
                                        commonComponentRender:common.commonComponentRender, 
                                        app_theme_update:common.commonPreferencesPostMount
                                        },
                            path:       '/common/component/common_dialogue_user_menu_app_theme.js'}));
                    break;
                }
                case 'common_dialogue_user_menu_log_out':{
                    user_logout_app();
                    break;
                }
                /*Dialogue user start */
                case 'common_user_start_login_button':{
                    user_login_app();
                    break;
                }
                case 'common_user_start_identity_provider_login':{
                    const target_row = common.commonElementRow(event.target);
                    const provider_element = target_row.querySelector('.common_login_provider_id');
                    if (provider_element && provider_element.textContent)
                        common.commonUserLogin(null, null, null, parseInt(provider_element.textContent))
                            .then(()=>common.commonComponentRemove('app_main_page'))
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
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const app_event_change = event =>{
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('change',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_change(event);
        });
    }
    else
        common.commonEvent('change',event);
};
/**
 * App event keyup
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const app_event_keyup = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keyup',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_keyup(event);
        }, true);
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        common.commonEvent('keyup',event)
        .then(()=>{
            switch(event_target_id){
                case 'common_user_start_login_username':
                case 'common_user_start_login_password':{
                    if (event.code === 'Enter') {
                        event.preventDefault();
                        user_login_app();
                    }
                    break;
                }

            }
        });
    }
};

const user_login_app = () =>{
    common.commonUserLogin()
    .then(()=>common.commonComponentRemove('app_main_page'))
    .then(()=>init_secure())
    .catch(()=>null);
};
const user_logout_app = () =>{
    common.commonUserLogout()
    .then(()=>common.commonComponentRemove('app_main_page'))
    .then(()=>
        common.commonComponentRender({
            mountDiv:   'app_main_page', 
            data:       null,
            methods:    null,
            path:       '/component/page_start.js'}));
};
/**
 * Sets framework
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
const framework_set = async (framework=null) => {
    await common.commonFrameworkSet(framework,
        {   Click: app_event_click,
            Change: app_event_change,
            KeyDown: null,
            KeyUp: app_event_keyup,
            Focus: null,
            Input:null});
};

const customer_create = async () => {
    await common.commonFFB({  path:'/app-function/CUSTOMER_CREATE', 
                        method:'POST', 
                        authorization_type:'APP_ACCESS', 
                        body:{
                            user_account_id :common.COMMON_GLOBAL.user_account_id,
                            data_app_id     :common.COMMON_GLOBAL.app_id,
                            customer_type   :COMMON_DOCUMENT.querySelector('#app_page_secure_tab_content [data-value=\'customer_type\']').textContent,
                            name            :COMMON_DOCUMENT.querySelector('#app_page_secure_tab_content [data-value=\'name\']').textContent,
                            address         :COMMON_DOCUMENT.querySelector('#app_page_secure_tab_content [data-value=\'address\']').textContent,
                            city            :COMMON_DOCUMENT.querySelector('#app_page_secure_tab_content [data-value=\'city\']').textContent,
                            country         :COMMON_DOCUMENT.querySelector('#app_page_secure_tab_content [data-value=\'country\']').textContent
                        },
                        spinner_id:COMMON_DOCUMENT.querySelector('.common_app_data_display_button_post').id
                    });
    init_secure();
};
/**
 * 
 * @param {1|0} status 
 */
const payment_request_update = async status => {
    await common.commonFFB({  path:'/app-function/PAYMENT_REQUEST_UPDATE', 
                        method:'POST', 
                        authorization_type:'APP_ACCESS', 
                        body:{
                            data_app_id     :common.COMMON_GLOBAL.app_id,
                            user_account_id :common.COMMON_GLOBAL.user_account_id,
                            payment_request_id:COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col2.common_app_data_display_type_payment_request_id').getAttribute('data-value'),
                            status:status
                        }})
    .then((result)=>status==1?common.commonMessageShow('INFO', null, null, null,JSON.parse(result).rows[0].status, common.COMMON_GLOBAL.common_app_id):null)
    .finally(()=>common.commonComponentRemove('common_dialogue_app_data_display', true));
};
const payment_request_accept = async () => {
    payment_request_update(1);
};
const payment_request_cancel = async () => {
    payment_request_update(0);
};
/**
 * 
 * @param {string} message 
 */
const show_payment_request = async message =>{
    if (COMMON_DOCUMENT.querySelector('#common_dialogue_app_data_display .common_app_data_display_master_col1[data-key=amount]'))
        null;
    else
        await common.commonComponentRender({
                mountDiv:   'common_dialogue_app_data_display', 
                data:       {
                            app_id:common.COMMON_GLOBAL.app_id,
                            display_type:'VERTICAL_KEY_VALUE',
                            dialogue:true,
                            master_path:'/app-function/PAYMENT_REQUEST_GET',
                            master_query:'',
                            master_body:{	
                                            data_app_id:common.COMMON_GLOBAL.app_id,
                                            user_account_id: common.COMMON_GLOBAL.user_account_id,
                                            payment_request_id: JSON.parse(message).payment_request_id
                                        },
                            master_method:'POST',
                            master_token_type:'APP_ACCESS',
                            master_resource:'PAYMENT_REQUEST_METADATA',
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
                            button_post: true,
                            button_post_icon_class:'common_data_display_icon_ok',
                            button_delete: true,
                            button_delete_icon_class:'common_data_display_icon_cancel'
                            },
                methods:    {
                           commonFFB:common.commonFFB,
                            button_print:null,
                            button_update:null,
                            button_post:payment_request_accept,
                            button_delete:payment_request_cancel
                            },
                path:       '/common/component/common_app_data_display.js'})
            .then(()=>{
                COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col1[data-key=amount]').nextElementSibling.textContent = 
                COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col1[data-key=amount]').nextElementSibling.textContent + ' ' +
                COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col2.common_app_data_display_type_currency_symbol').textContent;

                common.commonUserSessionCountdown(  COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col2.common_app_data_display_type_countdown'), 
                                                JSON.parse(message).exp);
            })
            .catch(()=>common.commonComponentRemove('common_dialogue_app_data_display', true));
};

/**
 * Init secure
 * @returns {void}
 */
const init_secure = () => {
    common.commonComponentRender({
        mountDiv:   'app_main_page', 
        data:       {
                    app_id:common.COMMON_GLOBAL.app_id,
                    user_account_id:common.COMMON_GLOBAL.user_account_id,
                    timezone:common.COMMON_GLOBAL.user_timezone,
                    locale:common.COMMON_GLOBAL.user_locale
                    },
        methods:    {
                    button_post:customer_create,
                    commonComponentRender:common.commonComponentRender,
                   commonFFB:common.commonFFB},
        path:       '/component/page_secure.js'});
};
/**
 * Init app
 * @returns {Promise.<void>}
 */
const init_app = async () => {
    COMMON_DOCUMENT.body.className = 'app_theme1';
    await common.commonComponentRender({
        mountDiv:   common.COMMON_GLOBAL.app_div, 
        data:       null,
        methods:    null,
        path:       '/component/app.js'})
    .then(()=> 
        common.commonComponentRender({
            mountDiv:   'app_top_usermenu', 
            data:       null,
            methods:    null,
            path:       '/common/component/common_user_account.js'}))
    .then(()=> 
        common.commonComponentRender({
            mountDiv:   'app_main_page', 
            data:       null,
            methods:    null,
            path:       '/component/page_start.js'}));
   framework_set();
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {void}
 */
const init = parameters => {
    common.COMMON_GLOBAL.app_function_exception = app_exception;
    common.COMMON_GLOBAL.app_function_session_expired = user_logout_app;
    common.COMMON_GLOBAL.app_function_sse = show_payment_request;
    common.commonInit(parameters).then(()=>{
        init_app();
    });
};
export{init};
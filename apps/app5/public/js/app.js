/**
 * Bank app
 * @module apps/app5/app
 */

/**
 * @import {CommonAppEvent, CommonModuleCommon, COMMON_DOCUMENT} from '../../../common_types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const commonPath ='/common/js/common.js';
/**@type {CommonModuleCommon} */
const common = await import(commonPath);
/**
 * @name appException
 * @description App exception function
 * @function
 * @param {Error} error 
 * @returns {void}
 */
const appException = (error) => {
    common.commonMessageShow('EXCEPTION', null, null, null, error);
};
/**
 * @name appEventClick
 * @description App event click
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventClick = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click',(/**@type{CommonAppEvent}*/event) => {
            appEventClick(event);
        });
    }
    else{
        const event_target_id = common.commonMiscElementId(event.target);
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
                                            master_path:'/app-module/ACCOUNT_STATEMENT',
                                            master_query:'fields=title,bank_account_balance,bank_account_number,bank_account_iban,currency,currency_name',
                                            master_body:{type:'FUNCTION',user_account_id: common.COMMON_GLOBAL.user_account_id, data_app_id:common.COMMON_GLOBAL.app_id},
                                            master_method:'POST',
                                            master_token_type:'APP_ACCESS',
                                            master_resource:'ACCOUNT_METADATA',
                                            detail_path:'/app-module/ACCOUNT_TRANSACTIONS',
                                            detail_query: 'fields=timestamp,logo,origin,amount_deposit,amount_withdrawal',
                                            detail_body: {type:'FUNCTION',user_account_id:common.COMMON_GLOBAL.user_account_id,data_app_id:common.COMMON_GLOBAL.app_id},
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
                                            master_path:'/app-module/CUSTOMER_GET',
                                            master_query: 'fields=name,customer_type,address,city,country',
                                            master_body:{type:'FUNCTION',user_account_id:common.COMMON_GLOBAL.user_account_id, data_app_id:common.COMMON_GLOBAL.app_id},
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
                                            master_path:'/app-module/ACCOUNT_GET',
                                            master_query: 'fields=title,title_sub,bank_account_number,bank_account_secret,bank_account_vpa',
                                            master_body: {type:'FUNCTION',user_account_id:common.COMMON_GLOBAL.user_account_id, data_app_id:common.COMMON_GLOBAL.app_id},
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
                   appFrameworkSet(1);
                    break;
                }
                case 'common_toolbar_framework_vue':{
                   appFrameworkSet(2);
                    break;
                }
                case 'common_toolbar_framework_react':{
                   appFrameworkSet(3);
                    break;
                }
                //dialogue user menu
                case 'common_iam_avatar':
                case 'common_iam_avatar_logged_in':
                case 'common_iam_avatar_avatar':
                case 'common_iam_avatar_avatar_img':
                case 'common_iam_avatar_logged_out':
                case 'common_iam_avatar_default_avatar':{
                    common.commonComponentRender({
                            mountDiv:   'common_dialogue_user_menu_app_theme', 
                            data:       null,
                            methods:    {
                                        commonMiscThemeDefaultList:common.commonMiscThemeDefaultList,
                                        commonComponentRender:common.commonComponentRender, 
                                        app_theme_update:common.commonMiscPreferencesPostMount
                                        },
                            path:       '/common/component/common_dialogue_user_menu_app_theme.js'});
                    break;
                }
                case 'common_dialogue_user_menu_log_out':{
                    appUserLogout();
                    break;
                }
                /*Dialogue user start */
                case 'common_dialogue_iam_start_login_button':{
                    appUserLogin();
                    break;
                }
                case 'common_dialogue_iam_start_identity_provider_login':{
                    const target_row = common.commonMiscElementRow(event.target);
                    const provider_element = target_row.querySelector('.common_login_provider_id');
                    if (provider_element && provider_element.textContent)
                        common.commonUserLogin(null, null, null, parseInt(provider_element.textContent))
                            .then(()=>common.commonComponentRemove('app_main_page'))
                            .then(()=>appSecureInit())
                            .catch(()=>null);             
                    break;
                }
            }
        });
    }
};
/**
 * @name appEventChange
 * @description App event change
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventChange = event =>{
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('change',(/**@type{CommonAppEvent}*/event) => {
            appEventChange(event);
        });
    }
    else
        common.commonEvent('change',event);
};
/**
 * @name appEventKeyUp
 * @description App event keyup
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventKeyUp = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keyup',(/**@type{CommonAppEvent}*/event) => {
            appEventKeyUp(event);
        }, true);
    }
    else{
        const event_target_id = common.commonMiscElementId(event.target);
        common.commonEvent('keyup',event)
        .then(()=>{
            switch(event_target_id){
                case 'common_dialogue_iam_start_login_username':
                case 'common_dialogue_iam_start_login_password':{
                    if (event.code === 'Enter') {
                        event.preventDefault();
                        appUserLogin();
                    }
                    break;
                }

            }
        });
    }
};
/**
 * @name appUserLogin
 * @description User login
 * @function
 * @returns {void}
 */
const appUserLogin = () =>{
    common.commonUserLogin()
    .then(()=>common.commonComponentRemove('app_main_page'))
    .then(()=>appSecureInit())
    .catch(()=>null);
};
/**
 * @name appUserLogout
 * @description User logout
 * @function
 * @returns {void}
 */
const appUserLogout = () =>{
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
 * @name appFrameworkSet
 * @description Sets framework
 * @function
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
const appFrameworkSet = async (framework=null) => {
    await common.commonFrameworkSet(framework,
        {   Click: appEventClick,
            Change: appEventChange,
            KeyDown: null,
            KeyUp: appEventKeyUp,
            Focus: null,
            Input:null});
};
/**
 * @name appCustomerCreate
 * @description Customer create
 * @function
 * @returns {Promise.<void>}
 */
const appCustomerCreate = async () => {
    
    await common.commonFFB({  path:'/app-module/CUSTOMER_CREATE', 
                        method:'POST', 
                        authorization_type:'APP_ACCESS', 
                        body:{
                            type:'FUNCTION',
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
    appSecureInit();
};
/**
 * @name appPaymentRequestUpdate
 * @description Payment request update
 * @function
 * @param {1|0} status 
 * @returns {Promise.<void>}
 */
const appPaymentRequestUpdate = async status => {
    await common.commonFFB({  path:'/app-module/PAYMENT_REQUEST_UPDATE', 
                        method:'POST', 
                        authorization_type:'APP_ACCESS', 
                        body:{
                            type:'FUNCTION',
                            data_app_id     :common.COMMON_GLOBAL.app_id,
                            user_account_id :common.COMMON_GLOBAL.user_account_id,
                            payment_request_id:COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col2.common_app_data_display_type_payment_request_id').getAttribute('data-value'),
                            status:status
                        }})
    .then((result)=>status==1?common.commonMessageShow('INFO', null, null, null,JSON.parse(result).rows[0].status, common.COMMON_GLOBAL.common_app_id):null)
    .finally(()=>common.commonComponentRemove('common_dialogue_app_data_display', true));
};
/**
 * @name appPaymentRequestAccept
 * @description Payment request accept
 * @function
 * @returns {Promise.<void>}
 */
const appPaymentRequestAccept = async () => {
    appPaymentRequestUpdate(1);
};
/**
 * @name appPaymentRequestCancel
 * @description Payment request cancel
 * @function
 * @returns {Promise.<void>}
 */
const appPaymentRequestCancel = async () => {
    appPaymentRequestUpdate(0);
};
/**
 * @name appPaymentRequestShow
 * @description Payment request show
 * @function
 * @param {string} message 
 * @returns {Promise.<void>}
 */
const appPaymentRequestShow = async message =>{
    if (COMMON_DOCUMENT.querySelector('#common_dialogue_app_data_display .common_app_data_display_master_col1[data-key=amount]'))
        null;
    else
        await common.commonComponentRender({
                mountDiv:   'common_dialogue_app_data_display', 
                data:       {
                            app_id:common.COMMON_GLOBAL.app_id,
                            display_type:'VERTICAL_KEY_VALUE',
                            dialogue:true,
                            master_path:'/app-module/PAYMENT_REQUEST_GET',
                            master_query:'',
                            master_body:{	
                                            type:'FUNCTION',
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
                            button_post:appPaymentRequestAccept,
                            button_delete:appPaymentRequestCancel
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
 * @name appSecureInit
 * @description Init secure
 * @functions
 * @returns {void}
 */
const appSecureInit = () => {
    common.commonComponentRender({
        mountDiv:   'app_main_page', 
        data:       {
                    app_id:common.COMMON_GLOBAL.app_id,
                    user_account_id:common.COMMON_GLOBAL.user_account_id,
                    timezone:common.COMMON_GLOBAL.user_timezone,
                    locale:common.COMMON_GLOBAL.user_locale
                    },
        methods:    {
                    button_post:appCustomerCreate,
                    commonComponentRender:common.commonComponentRender,
                   commonFFB:common.commonFFB},
        path:       '/component/page_secure.js'});
};
/**
 * @name appInit
 * @description Init app
 * @function
 * @returns {Promise.<void>}
 */
const appInit = async () => {
    COMMON_DOCUMENT.body.className = 'app_theme1';
    appFrameworkSet();
    //common app component
    await common.commonComponentRender({mountDiv:   'common_app',
                                        data:       {
                                                    framework:      common.COMMON_GLOBAL.app_framework
                                                    },
                                        methods:    null,
                                        path:       '/common/component/common_app.js'});
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
            path:       '/common/component/common_iam_avatar.js'}))
    .then(()=> 
        common.commonComponentRender({
            mountDiv:   'app_main_page', 
            data:       null,
            methods:    null,
            path:       '/component/page_start.js'}));
    common.commonComponentRender({mountDiv:   'common_fonts',
        data:       {
                    font_default:   true,
                    font_arabic:    true,
                    font_asian:     true,
                    font_prio1:     true,
                    font_prio2:     true,
                    font_prio3:     true
                    },
        methods:    null,
        path:       '/common/component/common_fonts.js'});
};
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {string} parameters 
 * @returns {void}
 */
const appCommonInit = parameters => {
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = appUserLogout;
    common.COMMON_GLOBAL.app_function_sse = appPaymentRequestShow;
    common.commonInit(parameters).then(()=>{
        appInit();
    });
};
export{appCommonInit};
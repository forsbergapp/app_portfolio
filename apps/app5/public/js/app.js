/**
 * Bank app
 * @module apps/app5/app
 */

/**
 * @import {common} from '../../../common_types.js'
 */

/**@type{common['COMMON_DOCUMENT']} */
const COMMON_DOCUMENT = document;

/**@type {common['CommonModuleCommon']} */
let common;

const APP_GLOBAL = {token:null};

/**
 * @name appEventClick
 * @description App event click
 * @function
 * @param {common['CommonAppEvent']} event 
 * @returns {void}
 */
const appEventClick = event => {
    const event_target_id = common.commonMiscElementId(event.target);
    switch (event_target_id){
        case 'tab1':
        case 'tab2':
        case 'tab3':{
            COMMON_DOCUMENT.querySelectorAll('#app_page_secure .app_page_secure_tab').forEach((/**@type{HTMLElement}*/element)=>element.classList.remove('active'));
            COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('active');
            switch (event_target_id){
                case 'tab1':{
                    common.commonComponentRender({
                        mountDiv:   'app_page_secure_tab_content', 
                        data:       {
                                    display_type:'MASTER_DETAIL_HORIZONTAL',
                                    master_path:'/app-common-module/ACCOUNT_STATEMENT',
                                    master_query:'fields=Title,BankAccountBalance,BankAccountNumber,BankAccountIban,Currency,CurrencyName',
                                    master_body:{   type:'FUNCTION',
                                                    IAM_iam_user_app_id: common.commonGlobalGet('Data').UserApp.iam_user_app_id,
                                                    IAM_iam_user_id: common.commonGlobalGet('Data').User.iam_user_id, 
                                                    IAM_data_app_id:common.commonGlobalGet('Data').UserApp.app_id},
                                    master_method:'POST',
                                    master_token_type:'APP_ACCESS',
                                    master_resource:'ACCOUNT',
                                    detail_path:'/app-common-module/ACCOUNT_TRANSACTIONS',
                                    detail_query: 'fields=Timestamp,Logo,Origin,AmountDeposit,AmountWithdrawal',
                                    detail_body: {  type:'FUNCTION',
                                                    IAM_iam_user_id:common.commonGlobalGet('Data').User.iam_user_id,
                                                    IAM_data_app_id:common.commonGlobalGet('Data').UserApp.app_id},
                                    detail_method:'POST',
                                    detail_token_type:'APP_ACCESS',
                                    detail_resource:'TRANSACTION_METADATA',
                                    detail_class:'bank_statement',
                                    new_resource:false,
                                    mode:'READ',
                                    button_print: false,
                                    button_update: false,
                                    button_post: false,
                                    button_delete: false
                                    },
                        methods:    {
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
                                    display_type:'VERTICAL_KEY_VALUE',
                                    master_path:'/app-common-module/CUSTOMER_GET',
                                    master_query: 'fields=Name,CustomerType,Address,City,Country',
                                    master_body:{   type:'FUNCTION',
                                                    IAM_iam_user_app_id: common.commonGlobalGet('Data').UserApp.iam_user_app_id,
                                                    IAM_iam_user_id:common.commonGlobalGet('Data').User.iam_user_id, 
                                                    IAM_data_app_id:common.commonGlobalGet('Data').UserApp.app_id},
                                    master_method:'POST',
                                    master_token_type:'APP_ACCESS',
                                    master_resource:'CUSTOMER',
                                    detail_path:null,
                                    detail_query:null,
                                    detail_method:null,
                                    detail_token_type:null,
                                    detail_class:null,
                                    new_resource:false,
                                    mode:'READ',
                                    button_print: false,
                                    button_update: false,
                                    button_post: false,
                                    button_delete: false
                                    },
                        methods:    {
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
                                    display_type:'VERTICAL_KEY_VALUE',
                                    master_path:'/app-common-module/ACCOUNT_GET',
                                    master_query: 'fields=Title,TitleSub,BankAccountNumber,BankAccountSecret,BankAccountVpa',
                                    master_body: {  type:'FUNCTION',
                                                    IAM_iam_user_id:common.commonGlobalGet('Data').User.iam_user_id, 
                                                    IAM_data_app_id:common.commonGlobalGet('Data').UserApp.app_id},
                                    master_method:'POST',
                                    master_token_type:'APP_ACCESS',
                                    master_resource:'ACCOUNT',
                                    detail_path:null,
                                    detail_query:null,
                                    detail_method:null,
                                    detail_token_type:null,
                                    detail_class:null,
                                    new_resource:false,
                                    mode:'READ',
                                    button_print: false,
                                    button_update: false,
                                    button_post: false,
                                    button_delete: false
                                    },
                        methods:    {
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
        case 'common_app_dialogues_user_menu_log_out':{
            common.commonUserLogout().then(()=>appUserLogout());
            break;
        }
        /*Dialogue user start */
        case 'common_app_dialogues_iam_start_login_button':{
            appUserLogin();
            break;
        }
    }
};

/**
 * @name appEventKeyUp
 * @description App event keyup
 * @function
 * @param {common['CommonAppEvent']} event 
 * @returns {void}
 */
const appEventKeyUp = event => {
    const event_target_id = common.commonMiscElementId(event.target);
    switch(event_target_id){
        case 'common_app_dialogues_iam_start_login_username':
        case 'common_app_dialogues_iam_start_login_password':{
            if (event.code === 'Enter') {
                event.preventDefault();
                appUserLogin();
            }
            break;
        }

    }
};
/**
 * @name appUserLogin
 * @description User login
 * @function
 * @returns {Promise.<void>}
 */
const appUserLogin = async () =>{
    await common.commonUserLogin();
    await appUserLoginPost();
};
/**
 * @name appUserLoginPost
 * @description User login post
 * @function
 * @returns {Promise.<void>}
 */
const appUserLoginPost = async () =>{
    if (common.commonGlobalGet('Data').User.iam_user_id != null){
        common.commonComponentRemove('app_main_page');
        appSecureInit();
    }
};

/**
 * @name appUserLogout
 * @description User logout
 * @function
 * @returns {void}
 */
const appUserLogout = () =>{
    common.commonComponentRemove('app_main_page');
    common.commonComponentRender({
        mountDiv:   'app_main_page', 
        data:       null,
        methods:    null,
        path:       '/component/page_start.js'});
};
/**
 * @name appCustomerCreate
 * @description Customer create
 * @function
 * @returns {Promise.<void>}
 */
const appCustomerCreate = async () => {
    
    await common.commonFFB({  path:'/app-common-module/CUSTOMER_CREATE', 
                        method:'POST', 
                        authorization_type:'APP_ACCESS', 
                        body:{
                            type:'FUNCTION',
                            IAM_iam_user_app_id :common.commonGlobalGet('Data').UserApp.iam_user_app_id,
                            IAM_iam_user_id :common.commonGlobalGet('Data').User.iam_user_id,
                            IAM_data_app_id :common.commonGlobalGet('Data').UserApp.app_id,
                            customer_type   :COMMON_DOCUMENT.querySelector('#app_page_secure_tab_content [data-value=\'CustomerType\']').textContent,
                            name            :COMMON_DOCUMENT.querySelector('#app_page_secure_tab_content [data-value=\'Name\']').textContent,
                            address         :COMMON_DOCUMENT.querySelector('#app_page_secure_tab_content [data-value=\'Address\']').textContent,
                            city            :COMMON_DOCUMENT.querySelector('#app_page_secure_tab_content [data-value=\'City\']').textContent,
                            country         :COMMON_DOCUMENT.querySelector('#app_page_secure_tab_content [data-value=\'Country\']').textContent
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
    await common.commonFFB({  path:'/app-common-module/PAYMENT_REQUEST_UPDATE', 
                        method:'POST', 
                        authorization_type:'APP_ACCESS', 
                        body:{
                            type:               'FUNCTION',
                            IAM_data_app_id:    common.commonGlobalGet('Data').UserApp.app_id,
                            IAM_iam_user_id:    common.commonGlobalGet('Data').User.iam_user_id,
                            token:              APP_GLOBAL.token,
                            status:             status
                        }})
    .then((result)=>status==1?common.commonMessageShow('INFO', null, null,JSON.parse(result).rows[0].status):null)
    .finally(()=>{
        //remove the token since user answered the request
        APP_GLOBAL.token=null;
        common.commonComponentRemove('common_app_dialogues_app_data_display');
    });
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
    APP_GLOBAL.token = JSON.parse(message).token;
    //mount component only if not already opened
    if (COMMON_DOCUMENT.querySelector('#common_app_dialogues_app_data_display .common_app_data_display_master_col1[data-key=Amount]'))
        null;
    else
        //Payment request received, show dialogue with payment request info and send received token 
        await common.commonComponentRender({
                mountDiv:   'common_app_dialogues_app_data_display', 
                data:       {
                            display_type:'VERTICAL_KEY_VALUE',
                            dialogue:true,
                            master_path:'/app-common-module/PAYMENT_REQUEST_GET',
                            master_query:'',
                            master_body:{	
                                            type:'FUNCTION',
                                            IAM_data_app_id:common.commonGlobalGet('Data').UserApp.app_id,
                                            IAM_iam_user_id: common.commonGlobalGet('Data').User.iam_user_id,
                                            token: APP_GLOBAL.token
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
                            button_print: false,
                            button_update: false,
                            button_post: true,
                            button_post_icon:common.commonGlobalGet('ICONS')['ok'],
                            button_delete: true,
                            button_delete_icon:common.commonGlobalGet('ICONS')['cancel'],
                            },
                methods:    {
                            button_print:null,
                            button_update:null,
                            button_post:appPaymentRequestAccept,
                            button_delete:appPaymentRequestCancel
                            },
                path:       '/common/component/common_app_data_display.js'})
            .then(()=>{
                COMMON_DOCUMENT.querySelector('#common_app_dialogues_app_data_display .common_app_data_display_master_col1[data-key=Amount]').nextElementSibling.textContent += ' ' +
                COMMON_DOCUMENT.querySelector('#common_app_dialogues_app_data_display .common_app_data_display_master_col2[data-key=CurrencySymbol]').textContent;

                common.commonUserSessionCountdown(  COMMON_DOCUMENT.querySelector('#common_app_dialogues_app_data_display .common_app_data_display_master_col2[data-key=Countdown]'), 
                                                    JSON.parse(message).exp);
            })
            .catch(()=>common.commonComponentRemove('common_app_dialogues_app_data_display'));
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
        data:       null,
        methods:    {
                    button_post:appCustomerCreate},
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
    await common.commonComponentRender({
        mountDiv:   common.commonGlobalGet('Parameters').app_div, 
        data:       null,
        methods:    null,
        path:       '/component/app.js'})
    .then(()=> 
        common.commonComponentRender({
            mountDiv:   'app_main_page', 
            data:       null,
            methods:    null,
            path:       '/component/page_start.js'}));
};
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {common['CommonModuleCommon']} commonLib
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib) => {
    common = commonLib;
    common.commonGlobalSet({key:'Functions', name:'app_function_session_expired', value:appUserLogout});
    common.commonGlobalSet({key:'Functions', name:'app_function_sse', value:appPaymentRequestShow});
    await appInit();
};
/**
 * @name appMetadata
 * @description App metadata for event delegataion and lifecycle events
 * @function
 * @returns {common['commonMetadata']}
 */
const appMetadata = () =>{
    return { 
        events:{  
            click:   appEventClick,
            keyup:   appEventKeyUp},
        lifeCycle:{onMounted:appUserLoginPost}
    };
};
export{appCommonInit, appMetadata};
export default appCommonInit;
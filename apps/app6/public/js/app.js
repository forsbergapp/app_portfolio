/**
 * Shop app
 * @module apps/app6/app
 */

/**
 * @import {CommonAppEvent, CommonModuleCommon, COMMON_DOCUMENT} from '../../../common_types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

/**@type {CommonModuleCommon} */
let common;
/**
 * @name appException
 * @description App exception function
 * @function
 * @param {Error} error 
 * @returns {void}
 */
const appException = error => {
    common.commonMessageShow('EXCEPTION', null, null, error);
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
                case event.target.parentNode.classList.contains('common_select_option')?event_target_id:'':{
                    appProductUpdate();
                    break;
                }
                case 'tshirt':{
                    if (COMMON_DOCUMENT.querySelector(`#${event_target_id}`).parentNode.style.transform == 'scale(2)')
                        COMMON_DOCUMENT.querySelector(`#${event_target_id}`).parentNode.style.transform = 'scale(1)';
                    else
                        COMMON_DOCUMENT.querySelector(`#${event_target_id}`).parentNode.style.transform = 'scale(2)';
                    break;
                }
                case ('common_lov_list' && COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col1[data-key=payment_method]'))?event_target_id:'' :{
                    if( COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col2[data-value=payment_method]').getAttribute('data-lov_value')=='VPA'){
                        COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col1[data-key=payment_id]').style.visibility='visible';
                        COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col2[data-value=payment_id]').style.visibility='visible';
                    }
                    else{
                        COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col1[data-key=payment_id]').style.visibility='hidden';
                        COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col2[data-value=payment_id]').style.visibility='hidden';
                    }   
                    break;
                }
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
            }
        });
    }
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
                case event.target.getAttribute('data-value')=='payment_id'?event_target_id:'':{
                    appVPAIsValid(event.target, event.target.textContent);
                    break;
                }
            }
        });
    }
};
/**
 * @name appVPAIsValid
 * @description Validate VPA
 * @function
 * @param {CommonAppEvent['target']} element
 * @param {string} str
 * @returns {boolean}
 */
const appVPAIsValid = (element, str) => {
    element.classList.remove('common_input_error');
    const regex = /^[a-z,0-9]{8}-[a-z,0-9]{4}-4[a-z,0-9]{3}-[89ab][a-z,0-9]{3}-[a-z,0-9]{12}$/;
    if (regex.test(str))
        return true;
    else{
        element.classList.add('common_input_error');
        return false;
    }
};
/**
 * @name appProductUpdate
 * @description Product update attributes
 * @function
 * @returns {Promise.<void>}
 */
const appProductUpdate = async () =>{
    COMMON_DOCUMENT.querySelector('#tshirt').style.fill = COMMON_DOCUMENT.querySelector('.common_select_dropdown_value.common_app_data_display_master_row_list [data-product_color]').getAttribute('data-product_color');

    const product_variant_id = COMMON_DOCUMENT.querySelectorAll('.common_app_data_display_master_row[id] .common_select_dropdown_value .common_app_data_display_master_col_list[data-id]')[0].getAttribute('data-id');

    await common.commonComponentRender({
        mountDiv:   COMMON_DOCUMENT.querySelectorAll('.common_app_data_display_master_row[id]')[1].id, 
        data:       {
                    app_id:common.COMMON_GLOBAL.app_id,
                    common_app_id:common.COMMON_GLOBAL.common_app_id,
                    display_type:'VERTICAL_KEY_VALUE',
                    master_path:'/app-common-module/PRODUCT_LOCATION_GET',
                    master_query:'fields=stock',
                    master_body:{type:'FUNCTION',IAM_data_app_id:common.COMMON_GLOBAL.app_id, resource_id : product_variant_id},
                    master_method:'POST',
                    master_token_type:'APP_ID',
                    master_resource:'PRODUCT_VARIANT_LOCATION_METADATA',
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
        path:'/common/component/common_app_data_display.js'});
    
};
/**
 * @name appPaymentRequestStatus
 * @description Get payment request status
 * @function
 * @returns {void}
 */
const appPaymentRequestStatus = ()=>{
    if ( new Date().getSeconds() % 2){
        const payment_request_id = COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col2.common_app_data_display_type_payment_request_id').getAttribute('data-value');
    
        common.commonFFB({path:'/app-common-module/PAYMENT_REQUEST_GET_STATUS', method:'POST', authorization_type:'APP_ACCESS_EXTERNAL',   body:{type:'FUNCTION',IAM_data_app_id:common.COMMON_GLOBAL.app_id, payment_request_id: payment_request_id}})
        .then((/**@type{*}*/result)=>{
            const status = JSON.parse(result).rows[0].status;
            if (status != 'PENDING'){
                common.COMMON_GLOBAL.token_at = null;
                common.commonComponentRemove('common_dialogue_app_data_display', true);
                common.commonMessageShow('INFO', null, null,status);
            }
        })
        .catch(()=>{
            common.COMMON_GLOBAL.token_at = null;
            common.commonComponentRemove('common_dialogue_app_data_display', true);
        });
    }
};
/**
 * @name appPaymentRequest
 * @description Payment request
 * @function
 * @returns {Promise.<void>}
 */
const appPaymentRequest = async () =>{
    const sku = COMMON_DOCUMENT.querySelectorAll('.common_select_dropdown_value .common_app_data_display_master_col_list[data-sku]')[0].getAttribute('data-sku');
    const payerid_element = COMMON_DOCUMENT.querySelectorAll('.common_app_data_display_master_row .common_app_data_display_master_col2[data-value=payment_id]')[0];
    if (appVPAIsValid(payerid_element, payerid_element.textContent)){
        const data = {
            type:'FUNCTION',
            reference:      `SHOP SKU ${sku}`,
            IAM_data_app_id:common.COMMON_GLOBAL.app_id,
            payerid:        payerid_element.textContent,
            amount:         COMMON_DOCUMENT.querySelectorAll('.common_select_dropdown_value .common_app_data_display_master_col_list[data-price]')[0].getAttribute('data-price'),
            currency_code:  COMMON_DOCUMENT.querySelectorAll('.common_select_dropdown_value .common_app_data_display_master_col_list[data-currency_code]')[0].getAttribute('data-currency_code'),
            message:        'Shop app'
        };
        await common.commonComponentRender({
            mountDiv:   'common_dialogue_app_data_display', 
            data:       {
                        app_id:common.COMMON_GLOBAL.app_id,
                        common_app_id:common.COMMON_GLOBAL.common_app_id,
                        display_type:'VERTICAL_KEY_VALUE',
                        dialogue:true,
                        master_path:'/app-common-module/PAYMENT_REQUEST_CREATE',
                        master_query:'',
                        master_body:data,
                        master_method:'POST',
                        master_token_type:'APP_ID',
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
                        button_post: false,
                        button_delete: true,
                        button_delete_icon_class:'common_data_display_icon_cancel'
                        },
            methods:    {
                       commonFFB:common.commonFFB,
                        button_print:null,
                        button_update:null,
                        button_post:null,
                        button_delete:appPayCancel
                        },
            path:'/common/component/common_app_data_display.js'})
            .then(result=>{
                //save the returned access token
                common.COMMON_GLOBAL.token_at = result.data.master_object.token.value;

                COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col1[data-key=amount]').nextElementSibling.textContent = 
                COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col1[data-key=amount]').nextElementSibling.textContent + ' ' +
                COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col2.common_app_data_display_type_currency_symbol').textContent;
    
                common.commonUserSessionCountdown(  COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col2.common_app_data_display_type_countdown'), 
                                                COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col2.common_app_data_display_type_exp').getAttribute('data-value'),
                                                appPaymentRequestStatus);
            })
            .catch(()=>common.commonComponentRemove('common_dialogue_app_data_display', true));
    }
    else
        common.commonMessageShow('INFO', null, 'message_text','!');
};
/**
 * @name appPayCancel
 * @description Pay cancel
 * @function
 * @returns {Promise.<void>}
 */
const appPayCancel = async () =>{
    common.COMMON_GLOBAL.token_at = null;
    common.commonMessageShow('INFO',null,null, 'Payment cancel');
    common.commonComponentRemove('common_dialogue_app_data_display', true);
};
/**
 * @name appPay
 * @description Pay product
 * @function
 * @returns {Promise.<void>}
 */
const appPay = async () =>{
    await common.commonComponentRender({
        mountDiv:   'common_dialogue_app_data_display', 
        data:       {
                    app_id:common.COMMON_GLOBAL.app_id,
                    common_app_id:common.COMMON_GLOBAL.common_app_id,
                    display_type:'VERTICAL_KEY_VALUE',
                    dialogue:true,
                    master_path:'/app-common-module/COMMON_APP_DATA_METADATA',
                    master_query:'fields=json_data',
                    master_body:{   type:'FUNCTION',
                                    IAM_module_app_id:common.COMMON_GLOBAL.common_app_id,
                                    IAM_data_app_id:common.COMMON_GLOBAL.app_id, 
                                    resource_name:'PAYMENT_METADATA'},
                    master_method:'POST',
                    master_token_type:'APP_ID',
                    master_resource:'PAYMENT_METADATA',
                    detail_path:null,
                    detail_query:null,
                    detail_body:null,
                    detail_method:null,
                    detail_token_type:null,
                    detail_class:null,
                    new_resource:true,
                    mode:'EDIT',
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
                    button_post:appPaymentRequest,
                    button_delete:appPayCancel},
        path:       '/common/component/common_app_data_display.js'});
        COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col1[data-key=payment_id]').style.visibility='hidden';
        COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col2[data-value=payment_id]').style.visibility='hidden';
        COMMON_DOCUMENT.querySelector('.common_app_data_display_master_col2[data-value=payment_id]').classList.add('common_input_error');
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
            Change: null,
            KeyDown: null,
            KeyUp: appEventKeyUp,
            Focus: null,
            Input:null});
};
/**
 * @name appInit
 * @description Init app
 * @function
 * @returns {Promise.<void>}
 */
const appInit = async () => {
    COMMON_DOCUMENT.body.className = 'app_theme1';

    await appFrameworkSet();
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
        methods:    {commonMiscResourceFetch:common.commonMiscResourceFetch},
        path:'/component/app.js'});
    await common.commonComponentRender({
        mountDiv:   'app_main_page', 
        data:       {
                    app_id:common.COMMON_GLOBAL.app_id,
                    common_app_id:common.COMMON_GLOBAL.common_app_id,
                    timezone:common.COMMON_GLOBAL.user_timezone,
                    locale:common.COMMON_GLOBAL.user_locale
                    },
        methods:    {
                    pay:appPay,
                   commonFFB:common.commonFFB,
                    commonComponentRender:common.commonComponentRender,
                    commonMessageShow:common.commonMessageShow
                    },
        path:'/component/page_start.js'});
    appProductUpdate();
    common.commonComponentRender({mountDiv:   'common_fonts',
        data:       {
                    font_default:   true,
                    font_arabic:    false,
                    font_asian:     false,
                    font_prio1:     false,
                    font_prio2:     false,
                    font_prio3:     false
                    },
        methods:    null,
        path:       '/common/component/common_fonts.js'});
};
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {CommonModuleCommon} commonLib
 * @param {string} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib, parameters) => {
    common = commonLib;
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = null;
    common.commonInit(parameters).then(()=>{
        appInit();
    });
};
export{appCommonInit};
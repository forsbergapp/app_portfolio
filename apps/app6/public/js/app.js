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
                case event.target.parentNode.classList.contains('common_select_option')?event_target_id:'':{
                    product_update();
                    break;
                }
                case 'tshirt':{
                    if (AppDocument.querySelector(`#${event_target_id}`).parentNode.style.transform == 'scale(2)')
                        AppDocument.querySelector(`#${event_target_id}`).parentNode.style.transform = 'scale(1)';
                    else
                        AppDocument.querySelector(`#${event_target_id}`).parentNode.style.transform = 'scale(2)';
                    break;
                }
                case ('common_lov_list' && AppDocument.querySelector('.common_app_data_display_master_col1[data-key=payment_method]'))?event_target_id:'' :{
                    if( AppDocument.querySelector('.common_app_data_display_master_col2[data-value=payment_method]').getAttribute('data-lov_value')=='VPA'){
                        AppDocument.querySelector('.common_app_data_display_master_col1[data-key=payment_id]').style.visibility='visible';
                        AppDocument.querySelector('.common_app_data_display_master_col2[data-value=payment_id]').style.visibility='visible';
                    }
                    else{
                        AppDocument.querySelector('.common_app_data_display_master_col1[data-key=payment_id]').style.visibility='hidden';
                        AppDocument.querySelector('.common_app_data_display_master_col2[data-value=payment_id]').style.visibility='hidden';
                    }   
                    break;
                }
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
            }
        });
    }
};
/**
 * App event change
 * @param {import('../../../types.js').AppEvent} event 
 * @returns {void}
 */
const app_event_change = event => {
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('change',(/**@type{import('../../../types.js').AppEvent}*/event) => {
            app_event_change(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('change',event)
        .then(()=>{
            switch (event_target_id){
                case (event.target.classList.contains('common_app_data_display_master_col2') && event.target.classList.contains('common_app_data_display_type_countdown'))?event_target_id:'':{
                    //call every odd second
                    if ( new Date().getSeconds() % 2){
                        const payment_request_id = AppDocument.querySelector('.common_app_data_display_master_col2.common_app_data_display_type_payment_request_id').getAttribute('data-value');
                    
                        common.FFB('/app-function/PAYMENT_REQUEST_GET_STATUS', null, 'POST', 'APP_DATA',   {
                                                                                                    payment_request_id: payment_request_id
                                                                                                    })
                        .then((/**@type{*}*/result)=>{
                            const status = JSON.parse(result).rows[0].status;
                            if (status != 'PENDING'){
                                common.ComponentRemove('common_dialogue_app_data_display', true);
                                common.show_message('INFO', null, null, null,status, common.COMMON_GLOBAL.common_app_id);
                            }
                        })
                        .catch(()=>common.ComponentRemove('common_dialogue_app_data_display', true));
                    }
                    break;
                }
            }
        });
    }
};

/**
 * App event keyup
 * @param {import('../../../types.js').AppEvent} event 
 * @returns {void}
 */
const app_event_keyup = event => {
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keyup',(/**@type{import('../../../types.js').AppEvent}*/event) => {
            app_event_keyup(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('keyup',event)
        .then(()=>{
            switch(event_target_id){
                case event.target.getAttribute('data-value')=='payment_id'?event_target_id:'':{
                    isValidVPA(event.target, event.target.innerText);
                    break;
                }
            }
        });
    }
};
/**
 * Validate VPA
 * @typedef {import('../../../types.js').AppEvent} appevent
 * @param {appevent['target']} element
 * @param {string} str
 * @returns {boolean}
 */
const isValidVPA = (element, str) => {
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
 * Product update attributes
 */
const product_update = async () =>{
    AppDocument.querySelector('#tshirt').style.fill = AppDocument.querySelector('.common_select_dropdown_value.common_app_data_display_master_row_list [data-product_color]').getAttribute('data-product_color');

    const product_variant_id = AppDocument.querySelectorAll('.common_app_data_display_master_row[id] .common_select_dropdown_value .common_app_data_display_master_col_list[data-id]')[0].getAttribute('data-id');

    await common.ComponentRender(AppDocument.querySelectorAll('.common_app_data_display_master_row[id]')[1].id, 
        {
            app_id:common.COMMON_GLOBAL.app_id,
            display_type:'VERTICAL_KEY_VALUE',
            master_path:'/app-function/PRODUCT_LOCATION_GET',
            master_query:'fields=stock',
            master_body:{data_app_id:common.COMMON_GLOBAL.app_id, resource_id : product_variant_id},
            master_method:'POST',
            master_token_type:'APP_DATA',
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
            button_delete: false,
            function_FFB:common.FFB,
            function_button_print:null,
            function_button_update:null,
            function_button_post:null,
            function_button_delete:null
        }, '/common/component/app_data_display.js');
    AppDocument.querySelectorAll('.common_app_data_display_master_row[id]')[1].innerHTML = AppDocument.querySelectorAll('.common_app_data_display_master_row[id]')[2].innerHTML;
    
};
/**
     * Payment request
     */
const payment_request = async () =>{
    const sku = AppDocument.querySelectorAll('.common_select_dropdown_value .common_app_data_display_master_col_list[data-sku]')[0].getAttribute('data-sku');
    const payerid_element = AppDocument.querySelectorAll('.common_app_data_display_master_row .common_app_data_display_master_col2[data-value=payment_id]')[0];
    if (isValidVPA(payerid_element, payerid_element.innerText)){
        const data = {
            reference:      `SHOP SKU ${sku}`,
            data_app_id:    common.COMMON_GLOBAL.app_id,
            payerid:        payerid_element.innerText,
            amount:         AppDocument.querySelectorAll('.common_select_dropdown_value .common_app_data_display_master_col_list[data-price]')[0].getAttribute('data-price'),
            currency_code:  AppDocument.querySelectorAll('.common_select_dropdown_value .common_app_data_display_master_col_list[data-currency_code]')[0].getAttribute('data-currency_code'),
            message:        'Shop app'
        };

        await common.ComponentRender('common_dialogue_app_data_display', 
            {
                app_id:common.COMMON_GLOBAL.app_id,
                display_type:'VERTICAL_KEY_VALUE',
                dialogue:true,
                master_path:'/app-function/PAYMENT_REQUEST_CREATE',
                master_query:'',
                master_body:data,
                master_method:'POST',
                master_token_type:'APP_DATA',
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
                function_FFB:common.FFB,
                function_button_print:null,
                function_button_update:null,
                function_button_post:null,
                function_button_delete:pay_cancel
            }, '/common/component/app_data_display.js')
            .then(()=>{
                AppDocument.querySelector('.common_app_data_display_master_col1[data-key=amount]').nextElementSibling.innerText = 
                AppDocument.querySelector('.common_app_data_display_master_col1[data-key=amount]').nextElementSibling.innerText + ' ' +
                AppDocument.querySelector('.common_app_data_display_master_col2.common_app_data_display_type_currency_symbol').innerText;
    
                common.user_session_countdown(  AppDocument.querySelector('.common_app_data_display_master_col2.common_app_data_display_type_countdown'), 
                                                AppDocument.querySelector('.common_app_data_display_master_col2.common_app_data_display_type_exp').getAttribute('data-value'),
                                                true);
            })
            .catch(()=>common.ComponentRemove('common_dialogue_app_data_display', true));
    }
    else
        common.show_message('INFO', null, null, 'message_text','!', common.COMMON_GLOBAL.common_app_id);
};
/**
 * Pay cancel
 */
const pay_cancel = async () =>{
    common.show_message('INFO',null,null,null, 'Payment cancel');
    common.ComponentRemove('common_dialogue_app_data_display', true);
};
/**
 * Pay product
 */
const pay = async () =>{
    
    await common.ComponentRender('common_dialogue_app_data_display', 
        {
            app_id:common.COMMON_GLOBAL.app_id,
            display_type:'VERTICAL_KEY_VALUE',
            dialogue:true,
            master_path:'/app-function/PAYMENT_METADATA',
            master_query:'fields=json_data',
            master_body:{data_app_id:common.COMMON_GLOBAL.app_id},
            master_method:'POST',
            master_token_type:'APP_DATA',
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
            button_delete: true,
            function_FFB:common.FFB,
            function_button_print:null,
            function_button_update:null,
            function_button_post:payment_request,
            function_button_delete:pay_cancel,
        }, '/common/component/app_data_display.js');
        AppDocument.querySelector('.common_app_data_display_master_col1[data-key=payment_id]').style.visibility='hidden';
        AppDocument.querySelector('.common_app_data_display_master_col2[data-value=payment_id]').style.visibility='hidden';
        AppDocument.querySelector('.common_app_data_display_master_col2[data-value=payment_id]').classList.add('common_input_error');
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
            KeyUp: app_event_keyup,
            Focus: null,
            Input:null});
};
/**
 * Init app
 * @returns {Promise.<void>}
 */
const init_app = async () => {
    AppDocument.body.className = 'app_theme1';
    await common.ComponentRender(common.COMMON_GLOBAL.app_div, {}, '/component/app.js');
    await common.ComponentRender('app_main_page', 
                                        {app_id:common.COMMON_GLOBAL.app_id,
                                        timezone:common.COMMON_GLOBAL.user_timezone,
                                        locale:common.COMMON_GLOBAL.user_locale,
                                        function_pay:pay,
                                        function_FFB:common.FFB,
                                        function_ComponentRender:common.ComponentRender,
                                        function_show_message:common.show_message},
                                        '/component/page_start.js');
    product_update();
    framework_set();
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {void}
 */
const init = (parameters) => {
    AppDocument.body.className = 'app_theme1';
    common.COMMON_GLOBAL.app_function_exception = app_exception;
    common.COMMON_GLOBAL.app_function_session_expired = null;
    common.init_common(parameters).then(()=>{
        init_app();
    });
};
export{init};
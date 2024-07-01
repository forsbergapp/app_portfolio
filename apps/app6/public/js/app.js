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
 * Sets framework
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
 const framework_set = async (framework=null) => {
    await common.framework_set(framework,
        {   Click: app_event_click,
            Change: null,
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
    await common.ComponentRender(common.COMMON_GLOBAL.app_div, {}, '/component/app.js');
    await common.ComponentRender('app_main_page', 
                                        {app_id:common.COMMON_GLOBAL.app_id,
                                        timezone:common.COMMON_GLOBAL.user_timezone,
                                        locale:common.COMMON_GLOBAL.user_locale,
                                        function_FFB:common.FFB,
                                        function_ComponentRender:common.ComponentRender,
                                        function_show_message:common.show_message},
                                        '/component/page_start.js');
    product_update();
    common.ComponentRender('app_construction', {}, '/common/component/construction.js');
    framework_set();
   
    AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('mousemove',(/**@type{import('../../../types.js').AppEvent}*/event) => {
        const event_target_id = common.element_id(event.target);
        if (event_target_id=='tshirt'){
            AppDocument.querySelector('#tshirt').style.transform = `rotateY(${event.layerX}deg)`;
        }   
        else
            AppDocument.querySelector('#tshirt').style.transform = 'rotateY(0deg)';
    });
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
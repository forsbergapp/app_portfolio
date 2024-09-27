/**
 * @module apps/app3/app
 */

/**@type{import('../../../common_types.js').CommonAppDocument} */
const CommonAppDocument = document;

const path_common ='common';
/**@type {import('../../../common_types.js').CommonModuleCommon} */
const common = await import(path_common);

const APP_GLOBAL = {
                    'docs':[{'id':1,
                            'doc_title':'Diagram',
                            'doc_url':'/common/documents/app_portfolio.webp',
                            'doc_url_small':'/common/documents/app_portfolio_small.webp'},
                            {'id':2,
                            'doc_title':'Data Model',
                            'doc_url':'/common/documents/data_model.webp',
                            'doc_url_small':'/common/documents/data_model_small.webp'}
                            ]
};
Object.seal(APP_GLOBAL);
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
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const app_event_click = event => {
    if (event==null){
        CommonAppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_click(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('click',event)
        .then(()=>{
            switch (event_target_id){
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
                case 'common_window_info_btn_close':{
                    CommonAppDocument.querySelector('#dialogue_documents').style.visibility = 'visible';
                    break;
                }
                case 'doc_list':
                case event.target.classList.contains('doc_list_item_image')?event_target_id:'':{
                    const target_row = common.element_row(event.target);
                    if (target_row.querySelector('.doc_list_item_image')?.getAttribute('data-full_size'))
                        common.ComponentRender({mountDiv:'common_window_info',
                            props:{   info:0,
                                url:target_row.querySelector('.doc_list_item_image')?.getAttribute('data-full_size'),
                                content_type:null, 
                                iframe_content:null,
                                function_common_setTimeout:common.common_setTimeout},
                            methods:null,
                            lifecycle:null,
                            path:'/common/component/window_info.js'});
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
    await common.ComponentRender({mountDiv:common.COMMON_GLOBAL.app_div,
        props:null,
        methods:null,
        lifecycle:null,
        path:'/component/app.js'});
    common.ComponentRender({mountDiv:'doc_list',
        props:{docs:APP_GLOBAL.docs},
        methods:null,
        lifecycle:null,
        path:'/component/docs.js'});
    CommonAppDocument.querySelector('#dialogue_documents').style.visibility = 'visible';
   framework_set();
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {void}
 */
const init = parameters => {
    CommonAppDocument.body.className = 'app_theme1';
    common.COMMON_GLOBAL.app_function_exception = app_exception;
    common.COMMON_GLOBAL.app_function_session_expired = null;
    common.init_common(parameters).then(()=>{
        init_app();
    });
};
export{init};
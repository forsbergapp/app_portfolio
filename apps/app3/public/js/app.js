/**
 * Presentation app
 * @module apps/app3/app
 */

/**@type{import('../../../common_types.js').COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const commonPath ='common';
/**@type {import('../../../common_types.js').CommonModuleCommon} */
const common = await import(commonPath);

const APP_GLOBAL = {
                    'docs':[{'id':1,
                            'doc_title':'Diagram',
                            'doc_type':'IMAGE',
                            'doc_url':'/common/documents/app_portfolio.webp',
                            'doc_image':'/common/documents/app_portfolio.webp',
                            'doc_image_small':'/common/documents/app_portfolio_small.webp'},
                            {'id':2,
                            'doc_title':'Data Model',
                            'doc_type':'IMAGE',
                            'doc_url':'/common/documents/data_model.webp',
                            'doc_image':'/common/documents/data_model.webp',
                            'doc_image_small':'/common/documents/data_model_small.webp'},
                            {'id':3,
                            'doc_title':'JSDoc',
                            'doc_type':'URL',
                            'doc_url':'/info/jsdoc',
                            'doc_image':null,
                            'doc_image_small':null}
                            ]
};
Object.seal(APP_GLOBAL);
/**
 * App exception function
 * @param {Error} error 
 * @returns {void}
 */
const appException = (error) => {
    common.commonMessageShow('EXCEPTION', null, null, null, error);
};
 
/**
 * App event click
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const appEventClick = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            appEventClick(event);
        });
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        common.commonEvent('click',event)
        .then(()=>{
            switch (event_target_id){
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
                case 'common_window_info_btn_close':{
                    COMMON_DOCUMENT.querySelector('#dialogue_documents').style.visibility = 'visible';
                    break;
                }
                case 'doc_list':
                case event.target.classList.contains('doc_list_item_image')?event_target_id:'':{
                    const target_row = common.commonElementRow(event.target);
                    if (target_row.querySelector('.doc_list_item_image')?.getAttribute('data-type'))
                        common.commonComponentRender({
                            mountDiv:   'common_window_info',
                            data:       {
                                        //show IMAGE type 0 or URL type 1
                                        info:target_row.querySelector('.doc_list_item_image')?.getAttribute('data-type')=='IMAGE'?0:1,
                                        url:target_row.querySelector('.doc_list_item_image')?.getAttribute('data-url'),
                                        content_type:null, 
                                        iframe_content:null
                                        },
                            methods:    {commonWindowSetTimeout:common.commonWindowSetTimeout},
                            path:       '/common/component/common_window_info.js'});
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
const appFrameworkSet = async (framework=null) => {
    await common.commonFrameworkSet(framework,
        {   Click: appEventClick,
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
const appInit = async () => {
    await common.commonComponentRender({
        mountDiv:   common.COMMON_GLOBAL.app_div,
        data:       null,
        methods:    null,
        path:       '/component/app.js'});
    common.commonComponentRender({
        mountDiv:   'doc_list',
        data:       {docs:APP_GLOBAL.docs},
        methods:    null,
        path:       '/component/docs.js'});
    COMMON_DOCUMENT.querySelector('#dialogue_documents').style.visibility = 'visible';
   appFrameworkSet();
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {void}
 */
const appCommonInit= parameters => {
    COMMON_DOCUMENT.body.className = 'app_theme1';
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = null;
    common.commonInit(parameters).then(()=>{
        appInit();
    });
};
export{appCommonInit};
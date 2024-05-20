/**@type{import('../../../types.js').AppDocument} */
const AppDocument = document;

/**@ts-ignore */
const common = await import('common');

const APP_GLOBAL = {
                    'docs':[{'id':1,
                            'doc_title':'Diagram',
                            'doc_url':'/common/documents/app_portfolio.webp',
                            'doc_url_small':'/common/documents/app_portfolio_small.webp'},
                            {'id':2,
                            'doc_title':'Data Model',
                            'doc_url':'/common/documents/data_model.webp',
                            'doc_url_small':'/common/documents/data_model_small.webp'},
                            {'id':3,
                            'doc_title':'Property Management',
                            'doc_url':'/common/documents/datamodel_pm.webp',
                            'doc_url_small':'/common/documents/datamodel_pm_small.webp'}
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
 * Get docs
 * @param {*} docid 
 * @returns {void}
 */
const getdocs = (docid = null) => {
    AppDocument.querySelector('#doc_list').classList.add('css_spinner');
    let html ='';
    for (const doc of APP_GLOBAL.docs) {
        if (docid== doc.id || docid==null)
            html += `<div class='doc_list_item common_row'>
                        <div id='doc_${doc.id}' full_size='${doc.doc_url}' class='doc_list_item_image' style='background-image:url("${doc.doc_url_small}")'></div>
                        <div class='doc_list_item_title'>${doc.doc_title}</div>
                    </div>`;
    }
    AppDocument.querySelector('#doc_list').classList.remove('css_spinner');
    AppDocument.querySelector('#doc_list').innerHTML = html;
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
                    AppDocument.querySelector('#dialogue_documents').style.visibility = 'visible';
                    break;
                }
                case 'doc_list':
                case event.target.classList.contains('doc_list_item_image')?event_target_id:'':{
                    const target_row = common.element_row(event.target);
                    if (target_row.querySelector('.doc_list_item_image').getAttribute('full_size'))
                        common.ComponentRender('common_window_info',
                        {   info:0,
                            url:target_row.querySelector('.doc_list_item_image').getAttribute('full_size'),
                            content_type:null, 
                            iframe_content:null}, '/common/component/window_info.js');
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
    await common.ComponentRender(common.COMMON_GLOBAL.app_div, {}, '/component/app.js');
    getdocs();
    AppDocument.querySelector('#dialogue_documents').style.visibility = 'visible';
   framework_set();
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {void}
 */
const init = parameters => {
    AppDocument.body.className = 'app_theme1';
    common.COMMON_GLOBAL.app_function_exception = app_exception;
    common.COMMON_GLOBAL.app_function_session_expired = null;
    common.init_common(parameters).then(()=>{
        init_app();
    });
};
export{init};
/**@type{{body:{className:string, classList:{add:function}},
 *        querySelector:function}} */
 const AppDocument = document;

 /**
 * @typedef {object}        AppEvent
 * @property {string}       code
 * @property {function}     preventDefault
 * @property {function}     stopPropagation
 * @property {{ id:                 string,
  *              innerHTML:          string,
  *              value:              string,
  *              parentNode:         {nextElementSibling:{querySelector:function}},
  *              nextElementSibling: {dispatchEvent:function},
  *              focus:              function,
  *              blur:               function,
  *              getAttribute:       function,
  *              setAttribute:       function,
  *              dispatchEvent:      function,
  *              classList:          {contains:function}
  *              className:          string
  *            }}  target
  */

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
                        <div docid='doc_${doc.id}' full_size='${doc.doc_url}' class='doc_list_item_image' style='background-image:url("${doc.doc_url_small}")'></div>
                        <div class='doc_list_item_title'>${doc.doc_title}</div>
                    </div>`;
    }
    AppDocument.querySelector('#doc_list').classList.remove('css_spinner');
    AppDocument.querySelector('#doc_list').innerHTML = html;
};
/**
 * App event click
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_click = event => {
    if (event==null){
        AppDocument.querySelector('#app').addEventListener('click',(/**@type{AppEvent}*/event) => {
            app_event_click(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('click',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_toolbar_framework_js':{
                    mount_app_app('1');
                    break;
                }
                case 'common_toolbar_framework_vue':{
                    mount_app_app('2');
                    break;
                }
                case 'common_toolbar_framework_react':{
                    mount_app_app('3');
                    break;
                }
                case 'common_window_info_btn_close':{
                    AppDocument.querySelector('#dialogue_documents').style.visibility = 'visible';
                    break;
                }
                case 'doc_list':{
                    const target_row = common.element_row(event.target);
                    if (target_row.querySelector('.doc_list_item_image').getAttribute('full_size'))
                        common.show_window_info(0, target_row.querySelector('.doc_list_item_image').getAttribute('full_size'));
                    break;
                }
            }
        });
    }
};
/**
 * Mount app
 * @param {string|null} framework 
 * @returns {Promise.<void>}
 */
const mount_app_app = async (framework=null) => {
    await common.mount_app(framework,
        {   Click: app_event_click,
            Change: null,
            KeyDown: null,
            KeyUp: null,
            Focus: null,
            Input:null})
    .then(()=> {
        getdocs();
        const docid = window.location.pathname.substring(1);
        if (docid!=''){
            AppDocument.querySelector('#dialogue_documents').style.visibility = 'hidden';
            common.show_window_info(0, AppDocument.querySelector(`#doc_${docid}`).getAttribute('full_size'));
        }
        else
            AppDocument.querySelector('#dialogue_documents').style.visibility = 'visible';
    });
};
/**
 * Init app
 * @returns {Promise.<void>}
 */
const init_app = async () => {
    mount_app_app();
};
/**
 * Init common
 * @param {{app:{   parameter_name:string, 
 *                  parameter_value:string}[],
 *          app_service:{system_admin_only:number, first_time:number}}} parameters 
 * @returns {void}
 */
const init = parameters => {
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        init_app();
    });
};
export{init};
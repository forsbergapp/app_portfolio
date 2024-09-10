/**
 * @module apps/default_PWA/app
 */

/**@type{import('../../../common_types.js').CommonAppDocument} */
const CommonAppDocument = document;

/**@type{import('../../../common_types.js').CommonAppWindow} */
const CommonAppWindow = window;

const path_common ='common';
/**@type {import('../../../common_types.js').CommonModuleCommon} */
const common = await import(path_common);
/**
 * App exception function
 * @param {Error} error 
 * @returns {void}
 */
 const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, null, error);
};
const serviceworker = () => {
    if (!CommonAppWindow.Promise) {
        CommonAppWindow.Promise = Promise;
    }
    if('serviceWorker' in CommonAppWindow.navigator) {
        CommonAppWindow.navigator.serviceWorker.register('/sw.js', {scope: '/'});
    }
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
            Input:null})
    .then(()=>serviceworker());
};
/**
 * Init app
 * @returns {Promise.<void>}
 */
const init_app = async () => {
    await common.ComponentRender(common.COMMON_GLOBAL.app_div, {}, '/component/app.js')
    .then(()=>common.ComponentRender('app_construction', {}, '/common/component/construction.js'));
   framework_set();
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {void}
 */
const init = (parameters) => {
    CommonAppDocument.body.className = 'app_theme1';    
    common.COMMON_GLOBAL.app_function_exception = app_exception;
    common.COMMON_GLOBAL.app_function_session_expired = null;
    common.init_common(parameters).then(()=>{
        init_app();
    });
};
export{init};

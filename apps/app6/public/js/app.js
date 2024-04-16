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
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_click = event => {
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click',(/**@type{AppEvent}*/event) => {
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
            Input:null});
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
 * @param {{app:*[],
 *          app_service:{system_admin_only:number, first_time:number}}} parameters 
 * @returns {void}
 */
const init = (parameters) => {
    AppDocument.body.className = 'app_theme1';
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        init_app();
    });
};
export{init};
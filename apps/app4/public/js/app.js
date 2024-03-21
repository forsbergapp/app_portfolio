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
    'module_leaflet_map_container':''
};
Object.seal(APP_GLOBAL);
/**
 * App exception function
 * @param {*} error 
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
const app_event_click = event =>{
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
                    init_map(1);
                    break;
                }
                case 'common_toolbar_framework_vue':{
                    init_map(2);
                    break;
                }
                case 'common_toolbar_framework_react':{
                    init_map(3);
                    break;
                }
            }
        });
    }
        
};
/**
 * Mount app
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
const init_map = async (framework=null)=>{
    AppDocument.querySelector('#mapid').outerHTML = '<div id="mapid"></div>';
    
    await common.mount_app(framework,
                    {   Click: app_event_click,
                        Change: null,
                        KeyDown: null,
                        KeyUp: null,
                        Focus: null,
                        Input:null})
    .then(()=>  common.map_init(APP_GLOBAL.module_leaflet_map_container,
                                common.COMMON_GLOBAL.client_longitude,
                                common.COMMON_GLOBAL.client_latitude,
                                null,
                                null))
    .then(()=>  common.map_update(  common.COMMON_GLOBAL.client_longitude,
                                    common.COMMON_GLOBAL.client_latitude,
                                    common.COMMON_GLOBAL.module_leaflet_zoom,
                                    common.COMMON_GLOBAL.client_place,
                                    null,
                                    common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                    common.COMMON_GLOBAL.module_leaflet_jumpto)
    );
};
/**
 * Init app
 * @returns {void}
 */
const init_app = () =>{
    APP_GLOBAL.module_leaflet_map_container      ='mapid';
    init_map();
};
/**
 * Init common
 * @param {{app:*[],
 *          app_service:{system_admin_only:number, first_time:number}}} parameters 
 * @returns {void}
 */
const init = parameters => {
    AppDocument.querySelector('#loading').classList.add('css_spinner');
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        init_app();
        AppDocument.querySelector('#loading').classList.remove('css_spinner');
    })
    .catch(()=>AppDocument.querySelector('#loading').classList.remove('css_spinner'));
};
export{init};

/**
 * @module apps/default_app/app
 */

/**
 * @import {commonMetadata, CommonAppEvent, CommonModuleCommon, COMMON_DOCUMENT} from '../../../common_types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

/**@type{CommonModuleCommon}*/
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
                case 'common_app_toolbar_framework_js':{
                   appFrameworkSet(1);
                    break;
                }
                case 'common_app_toolbar_framework_vue':{
                   appFrameworkSet(2);
                    break;
                }
                case 'common_app_toolbar_framework_react':{
                   appFrameworkSet(3);
                    break;
                }
            }
        });
    }
};
/**
 * 
 * @name appFrameworkSet
 * @description Sets framework
 * @function
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
 const appFrameworkSet = async (framework=null) =>
    await common.commonFrameworkSet(framework, appMetadata().events);
/**
 * 
 * @name appIniot
 * @description Init app
 * @function
 * @returns {Promise.<void>}
 */
const appInit = async () => {
    await common.commonComponentRender({mountDiv:common.COMMON_GLOBAL.app_div,
        data:null,
        methods:    {commonMiscResourceFetch:common.commonMiscResourceFetch},
        path:'/component/app.js'});
    await common.commonComponentRender({  mountDiv:'app_construction',
                                        data:null,
                                        methods:null,
                                        path:'/common/component/common_construction.js'});
};
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {CommonModuleCommon} commonLib
 * @param {function} start
 * @param {Object.<String,*>} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib, start, parameters) => {        
    parameters;
    common = commonLib;
    await start();
    COMMON_DOCUMENT.body.className = 'app_theme1';    
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = null;
    appInit();
};
/**
 * @returns {commonMetadata}
 */
const appMetadata = () =>{
    return { 
        events:{  
            Click:   appEventClick,
            Change:  null,
            KeyDown: null,
            KeyUp:   null,
            Focus:   null,
            Input:   null}
    };
};
export{appCommonInit, appMetadata};
export default appCommonInit;
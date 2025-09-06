/**
 * @module apps/default_app/app
 */

/**
 * @import {commonMetadata, CommonModuleCommon, COMMON_DOCUMENT} from '../../../common_types.js'
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
 * 
 * @name appIniot
 * @description Init app
 * @function
 * @returns {Promise.<void>}
 */
const appInit = async () => {
    await common.commonComponentRender({mountDiv:common.COMMON_GLOBAL.app_div,
        data:       {logo:common.COMMON_GLOBAL.app_logo},
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
 * @name appMetadata
 * @description App metadata for event delegataion and lifecycle events
 * @function
 * @returns {commonMetadata}
 */
const appMetadata = () =>{
    return { 
        events:{},
            lifeCycle:{onMounted:null}
    };
};
export{appCommonInit, appMetadata};
export default appCommonInit;
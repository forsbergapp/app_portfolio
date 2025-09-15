/**
 * @module apps/default_app/app
 */

/**
 * @import {common} from '../../../common_types.js'
 */

/**@type{common['COMMON_DOCUMENT']} */
const COMMON_DOCUMENT = document;

/**@type{common['CommonModuleCommon']}*/
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
    await common.commonComponentRender({mountDiv:common.commonGlobalGet('app_div'),
        data:       {logo:common.commonGlobalGet('app_logo')},
        methods:    null,
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
 * @param {common['CommonModuleCommon']} commonLib
 * @param {function} start
 * @param {Object.<String,*>} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib, start, parameters) => {        
    parameters;
    common = commonLib;
    await start();
    COMMON_DOCUMENT.body.className = 'app_theme1';    
    common.commonGlobalSet('app_function_exception', appException);
    common.commonGlobalSet('app_function_session_expired', null);
    appInit();
};
/**
 * @name appMetadata
 * @description App metadata for event delegataion and lifecycle events
 * @function
 * @returns {common['commonMetadata']}
 */
const appMetadata = () =>{
    return { 
        events:{},
            lifeCycle:{onMounted:null}
    };
};
export{appCommonInit, appMetadata};
export default appCommonInit;
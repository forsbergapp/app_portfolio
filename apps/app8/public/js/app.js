/** 
 * Cube app
 * @module apps/app8/app
 */

/**
 * @import {common} from '../../../common_types.js'
 */

/**@type{common['COMMON_DOCUMENT']} */
const COMMON_DOCUMENT = document;

/**@type {common['CommonModuleCommon']} */
let common;

/**
 * @name appEventClick
 * @description App event click
 * @function
 * @param {common['CommonAppEvent']} event 
 * @returns {void}
 */
const appEventClick = event => {
    const event_target_id = common.commonMiscElementId(event.target);    
    switch (event_target_id){
        /*Dialogue user start */
        case 'common_app_dialogues_iam_start_login_button':{
            common.commonUserLogin().catch(()=>null);
            break;
        }
    }
};

/**
 * @name appInit
 * @description Init app
 * @function
 * @returns {Promise.<void>}
 */
const appInit = async () => {
    await common.commonComponentRender({
        mountDiv:   common.commonGlobalGet('Parameters').app_div, 
        data:       null,
        methods:    null,
        path:       '/component/app.js'});
};
/**RubiksCube
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {common['CommonModuleCommon']} commonLib
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib) => {
    common = commonLib;
    common.commonGlobalSet({key:'Functions', name:'app_function_session_expired', value:null});
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
        events:{  
            click:      appEventClick},
        lifeCycle:{onMounted:null}
    };
};
export{appCommonInit, appMetadata};
export default appCommonInit;
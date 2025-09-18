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

/**@type{{events:common['commonComponentEvents']|null}} */
const APP_GLOBAL = {events:null};
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
    APP_GLOBAL.events?APP_GLOBAL.events('click', event):null;
};
/**
 * @name appEventMouseDown
 * @description App event mouse down
 * @function
 * @param {common['CommonAppEvent']} event 
 * @returns {void}
 */
const appEventMouseDown = event =>{
    APP_GLOBAL.events?APP_GLOBAL.events('mousedown', event):null;
};
/**
 * @name appEventMouseUp
 * @description App event mouse up
 * @function
 * @param {common['CommonAppEvent']} event 
 * @returns {void}
 */
const appEventMouseUp = event =>{
    APP_GLOBAL.events?APP_GLOBAL.events('mouseup', event):null;
};
/**
 * @name appEventMouseMove
 * @description App event mouse move
 * @function
 * @param {common['CommonAppEvent']} event 
 * @returns {void}
 */
const appEventMouseMove = event =>{
    APP_GLOBAL.events?APP_GLOBAL.events('mousemove', event):null;
};

/**
 * @name appInit
 * @description Init app
 * @function
 * @returns {Promise.<void>}
 */
const appInit = async () => {
    COMMON_DOCUMENT.body.className = 'app_theme1';
    await common.commonComponentRender({
        mountDiv:   common.commonGlobalGet('app_div'), 
        data:       null,
        methods:    null,
        path:       '/component/app.js'})
    .then(component=>{
        APP_GLOBAL.events = component.events;
    });
};
/**RubiksCube
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {common['CommonModuleCommon']} commonLib
 * @param {Object.<String,*>} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib, parameters) => {
    parameters;
    common = commonLib;
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
        events:{  
            click:      appEventClick,
            mousedown:  appEventMouseDown,
            mouseup:    appEventMouseUp,
            mousemove:  appEventMouseMove,
            touchmove:  appEventMouseMove,
            touchend:   appEventMouseUp,
            touchcancel:appEventMouseUp,
            touchstart: appEventMouseDown},
        lifeCycle:{onMounted:null}
    };
};
export{appCommonInit, appMetadata};
export default appCommonInit;
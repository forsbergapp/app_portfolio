/**
 * @module apps/app9/app
 */

/**
 * @import {common} from '../../../common_types.js'
 */

/**@type{common['COMMON_DOCUMENT']} */
const COMMON_DOCUMENT = document;

/**@type {common['CommonModuleCommon']} */
let common;

/**
 * @name appTotpGet
 * @description Get TOTP value
 * @function
 * @param {string} otp_key
 * @returns {void} 
 */
const appTotpGet = otp_key =>{
    /**
     * @param {number} expire
     */
    const countdown = async expire =>{
        if (COMMON_DOCUMENT.querySelector('#otp_key') && COMMON_DOCUMENT.querySelector('#otp_key').textContent !=''){
            const time_left = (expire * 1000) - (Date.now());
            if (time_left < 0)
                appTotpGet(COMMON_DOCUMENT.querySelector('#otp_key').textContent);
            else{
                const seconds = Math.floor((time_left % (1000 * 60)) / 1000);
                //show count down using locale
                COMMON_DOCUMENT.querySelector('#totp_countdown_time').textContent = (seconds).toLocaleString(common.commonGlobalGet('Data').UserApp.user_locale);
                //wait 1 second
                await common.commonWindowWait(1000);            
                countdown(expire);
            }
        }
    };
    common.commonFFB({
        path:'/app-common-module/TOTP_GET',
        method:'POST', authorization_type:'APP_ID',
        body:{  type:           'FUNCTION',
                IAM_data_app_id:common.commonGlobalGet('Data').UserApp.app_id,
                otp_key:        otp_key}
    })
    .then((/**@type{string}*/result)=>{
        if (JSON.parse(result).rows[0]?.expire){
            COMMON_DOCUMENT.querySelector('#totp_value').textContent = JSON.parse(result).rows[0]?.totp_value;
            countdown(JSON.parse(result).rows[0]?.expire);
        }
        else{
            COMMON_DOCUMENT.querySelector('#totp_value').textContent=null;
            COMMON_DOCUMENT.querySelector('#totp_countdown_time').textContent=null;
        }
    });
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
        case 'clear_button':{
            COMMON_DOCUMENT.querySelector('#otp_key').textContent=null;
            COMMON_DOCUMENT.querySelector('#totp_value').textContent=null;
            COMMON_DOCUMENT.querySelector('#totp_countdown_time').textContent=null;
            break;
        }
        /*Dialogue user start */
        case 'common_app_dialogues_iam_start_login_button':{
            common.commonUserLogin().catch(()=>null);
            break;
        }                
    }
};
/**
 * @name appEventKeyUp
 * @description App event keyup
 * @function
 * @param {common['CommonAppEvent']} event 
 * @returns {void}
 */
const appEventKeyUp = event => {
    const event_target_id = common.commonMiscElementId(event.target);
    switch(event_target_id){
        case 'otp_key':{
            if (event.target.textContent.length==26){
                event.target.textContent = event.target.textContent.toUpperCase();
                appTotpGet(event.target.textContent);
            }
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
    await common.commonComponentRender({mountDiv:common.commonGlobalGet('Parameters').app_div,
        data:null,
        methods:null,
        path:'/component/app.js'});
};
/**
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
            click:   appEventClick,
            keyup:   appEventKeyUp},
        lifeCycle:{onMounted:null}
    };
};
export{appCommonInit, appMetadata};
export default appCommonInit;
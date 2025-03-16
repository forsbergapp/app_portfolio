/**
 * @module apps/app9/app
 */

/**
 * @import {CommonAppEvent, CommonModuleCommon, COMMON_DOCUMENT} from '../../../common_types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const commonPath ='/common/js/common.js';
/**@type {CommonModuleCommon} */
const common = await import(commonPath);

/**
 * @name appException
 * @description App exception function
 * @function
 * @param {Error} error 
 * @returns {void}
 */
 const appException = (error) => {
    common.commonMessageShow('EXCEPTION', null, null, null, error);
};

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
        if (COMMON_DOCUMENT.querySelector('#otp_key').textContent !=''){
            const time_left = (expire * 1000) - (Date.now());
            if (time_left < 0)
                appTotpGet(COMMON_DOCUMENT.querySelector('#otp_key').textContent);
            else{
                const seconds = Math.floor((time_left % (1000 * 60)) / 1000);
                //show count down using locale
                COMMON_DOCUMENT.querySelector('#totp_countdown_time').textContent = (seconds).toLocaleString(common.COMMON_GLOBAL.user_locale);
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
                IAM_data_app_id:common.COMMON_GLOBAL.app_id,
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
                case 'clear_button':{
                    COMMON_DOCUMENT.querySelector('#otp_key').textContent=null;
                    COMMON_DOCUMENT.querySelector('#totp_value').textContent=null;
                    COMMON_DOCUMENT.querySelector('#totp_countdown_time').textContent=null;
                    break;
                }
                case 'common_toolbar_framework_js':{
                   appFrameworkSet(1);
                    break;
                }
                case 'common_toolbar_framework_vue':{
                   appFrameworkSet(2);
                    break;
                }
                case 'common_toolbar_framework_react':{
                   appFrameworkSet(3);
                    break;
                }
            }
        });
    }
};
/**
 * @name appEventKeyUp
 * @description App event keyup
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventKeyUp = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keyup',(/**@type{CommonAppEvent}*/event) => {
            appEventKeyUp(event);
        }, true);
    }
    else{
        const event_target_id = common.commonMiscElementId(event.target);
        common.commonEvent('keyup',event)
        .then(()=>{
            switch(event_target_id){
                case 'otp_key':{
                    if (event.target.textContent.length==26){
                        event.target.textContent = event.target.textContent.toUpperCase();
                        appTotpGet(event.target.textContent);
                    }
                    break;
                }
            }
        });
    }
};

/**
 * @anme appFrameworkSet
 * @description Sets framework
 * @function
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
 const appFrameworkSet = async (framework=null) => {
    await common.commonFrameworkSet(framework,
        {   Click: appEventClick,
            Change: null,
            KeyDown: null,
            KeyUp: appEventKeyUp,
            Focus: null,
            Input:null});
};
/**
 * @name appInit
 * @description Init app
 * @function
 * @returns {Promise.<void>}
 */
const appInit = async () => {
    await appFrameworkSet();
    //common app component
    await common.commonComponentRender({mountDiv:   'common_app',
                                        data:       {
                                                    framework:      common.COMMON_GLOBAL.app_framework
                                                    },
                                        methods:    null,
                                        path:       '/common/component/common_app.js'});
    await common.commonComponentRender({mountDiv:common.COMMON_GLOBAL.app_div,
        data:null,
        methods:null,
        path:'/component/app.js'});
    common.commonComponentRender({mountDiv:   'common_fonts',
        data:       {
                    font_default:   true,
                    font_arabic:    true,
                    font_asian:     true,
                    font_prio1:     true,
                    font_prio2:     true,
                    font_prio3:     true
                    },
        methods:    null,
        path:       '/common/component/common_fonts.js'});
};
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {string} parameters 
 * @returns {void}
 */
const appCommonInit= (parameters) => {
    COMMON_DOCUMENT.body.className = 'app_theme1';    
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = null;
    common.commonInit(parameters).then(()=>{
        appInit();
    });
};
export{appCommonInit};

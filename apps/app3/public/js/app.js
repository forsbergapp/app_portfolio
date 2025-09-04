/**
 * Presentation app
 * @module apps/app3/app
 */

/**
 * @import {commonMetadata,CommonAppEvent, commonDocumentType, CommonModuleCommon, COMMON_DOCUMENT} from '../../../common_types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

/**@type {CommonModuleCommon} */
let common;

/**
 * @name show
 * @description Shows document
 * @function
 * @param {string} href
 * @param {string} title
 * @param {commonDocumentType} documentType
 */
const show = async (href, title, documentType) =>{
    
    COMMON_DOCUMENT.querySelector('#content').innerHTML='';
    //common app component
    await common.commonComponentRender({mountDiv:   'content',
        data:       {
                        common_app_id:common.COMMON_GLOBAL.app_common_app_id,
                        app_logo:common.COMMON_GLOBAL.app_logo,
                        app_copyright:common.COMMON_GLOBAL.app_copyright,
                        app_name:COMMON_DOCUMENT.title,
                        href:href,
                        title:title,
                        documentType:documentType
                    },
        methods:    {
                        commonMiscResourceFetch:common.commonMiscResourceFetch,
                        commonFFB:common.commonFFB
                    },
        path:       '/common/component/common_document.js'});
};
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
                case 'menu_open':{
                    COMMON_DOCUMENT.querySelector('#nav').style.display = 'block';
                    break;
                }
                case 'menu_close': {
                    COMMON_DOCUMENT.querySelector('#nav').style.display = 'none';
                    break;
                }
                case event.target.classList.contains('app_menu')?event_target_id:'':{
                    if (event.target.parentNode.querySelector('.app_submenu').classList.contains('active'))
                        event.target.parentNode.querySelector('.app_submenu').classList.remove('active');
                    else
                        event.target.parentNode.querySelector('.app_submenu').classList.add('active');
                    break;
                }
                case 'title':
                case 'nav_content_app':
                case 'content':{
                    event.preventDefault();
                    if (event.target.getAttribute('href'))
                        show(   event.target.getAttribute('href'), 
                                //use title from first menu text if clicking on title
                                event_target_id=='title'?COMMON_DOCUMENT.querySelectorAll('#nav_content_app .common_link')[0].textContent:event.target.href?event.target.href.split('/')[3]:event.target.textContent, 
                                //GUIDE in title and nav_content_app
                                /**@ts-ignore */
                                event_target_id=='title'?'GUIDE':event_target_id=='content'?'MODULE_CODE':common.commonMiscElementRow(event.target, 'app_menu_data').getAttribute('data-type'));
                    break;
                }
                /*Dialogue user start */
                case 'common_dialogue_iam_start_login_button':{
                    common.commonUserLogin().catch(()=>null);
                    break;
                }                
            }
        });
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
        mountDiv:   common.COMMON_GLOBAL.app_div,
        data:       {app_id:common.COMMON_GLOBAL.app_common_app_id},
        methods:    {commonFFB:common.commonFFB},
        path:       '/component/app.js'});
    //show first menu at start
    COMMON_DOCUMENT.querySelector('#title').click();
};
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {CommonModuleCommon} commonLib
 * @param {Object.<string,*>} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib, parameters) => {        
    parameters;
    common = commonLib;
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
        events:{  
            Click:   appEventClick,
            Change:  null,
            KeyDown: null,
            KeyUp:   null,
            Focus:   null,
            Input:   null},
        lifeCycle:{onMounted:null}
    };
};
export{appCommonInit, appMetadata};
export default appCommonInit;
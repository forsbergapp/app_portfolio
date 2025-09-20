/**
 * Presentation app
 * @module apps/app3/app
 */

/**
 * @import {common} from '../../../common_types.js'
 */

/**@type{common['COMMON_DOCUMENT']} */
const COMMON_DOCUMENT = document;

/**@type {common['CommonModuleCommon']} */
let common;

/**
 * @name show
 * @description Shows document
 * @function
 * @param {{href:string,
 *          title:string,
 *          documentType:common['commonDocumentType']|string|null}} parameters
 */
const show = async parameters =>{
    
    //common app component
    await common.commonComponentRender({mountDiv:   'app_content',
        data:       {
                        common_app_id:common.commonGlobalGet('app_common_app_id'),
                        app_logo:common.commonGlobalGet('app_logo'),
                        app_copyright:common.commonGlobalGet('app_copyright'),
                        app_name:COMMON_DOCUMENT.title,
                        href:parameters.href,
                        title:parameters.title,
                        documentType:parameters.documentType
                    },
        methods:    null,
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
 * @param {common['CommonAppEvent']} event 
 * @returns {void}
 */
const appEventClick = event => {
    const event_target_id = common.commonMiscElementId(event.target);
    switch (event_target_id){
        case event.target.classList.contains('app_menu')?event_target_id:'':{
            if (event.target.parentNode.querySelector('.app_submenu').classList.contains('active'))
                event.target.parentNode.querySelector('.app_submenu').classList.remove('active');
            else
                event.target.parentNode.querySelector('.app_submenu').classList.add('active');
            break;
        }
        case 'app_menu_title':
        case 'app_menu_content':
        case 'common_document':{
            event.preventDefault();
            if (event.target.getAttribute('href'))
                show({
                        href:event.target.getAttribute('href'), 
                        title:
                                //use title from first menu text if clicking on title
                                event_target_id=='app_menu_title'?
                                    COMMON_DOCUMENT.querySelectorAll('#app_menu_content .common_link')[0].textContent:
                                        event.target.href?
                                            event.target.href.split('/')[3]:
                                                event.target.textContent, 
                        documentType:
                            //GUIDE in title and nav_content_app
                            event_target_id=='app_menu_title'?
                                                'GUIDE':
                                                    /**@ts-ignore */
                                                    event_target_id=='common_document'?
                                                        'MODULE_CODE':
                                                            common.commonMiscElementRow(event.target, 'app_menu_data').getAttribute('data-type')
                    });
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
 * @name appInit
 * @description Init app
 * @function
 * @returns {Promise.<void>}
 */
const appInit = async () => {
    await common.commonComponentRender({
        mountDiv:   common.commonGlobalGet('app_div'),
        data:       {app_id:common.commonGlobalGet('app_common_app_id')},
        methods:    null,
        path:       '/component/app.js'});
    //show first menu at start
    COMMON_DOCUMENT.querySelector('#app_menu_title').click();
};
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {common['CommonModuleCommon']} commonLib
 * @param {Object.<string,*>} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib, parameters) => {        
    parameters;
    common = commonLib;
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
        events:{  
            click:   appEventClick},
        lifeCycle:{onMounted:null}
    };
};
export{appCommonInit, appMetadata};
export default appCommonInit;
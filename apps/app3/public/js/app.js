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
    switch (true){
        case event.target.classList.contains('app_menu'):{
            if (event.target.parentNode.querySelector('.app_submenu').classList.contains('active'))
                event.target.parentNode.querySelector('.app_submenu').classList.remove('active');
            else
                event.target.parentNode.querySelector('.app_submenu').classList.add('active');
            break;
        }
        case event_target_id=='app_menu_title':{
            show({
                        href:event.target.getAttribute('data-href'), 
                        title:
                                //use title from first menu text if clicking on title
                                COMMON_DOCUMENT.querySelectorAll('#app_menu_content .common_link')[0].textContent, 
                        documentType: 'GUIDE'
                    });
            break;
        }
        case event.target.classList.contains('common_link'):{
            event.preventDefault();
            if (event.target.getAttribute('data-href'))
                show({
                        href:           event.target.getAttribute('data-href'), 
                        title:          event.target.getAttribute('data-href').split('/')[3], 
                        documentType:   event_target_id=='app_menu_content'?
                                            common.commonMiscElementRow(event.target, 'app_menu_data').getAttribute('data-type'):
                                                'MODULE_CODE'
                                                            
                    });
            break;
        }
        /*Dialogue user start */
        case event_target_id=='common_app_dialogues_iam_start_login_button':{
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
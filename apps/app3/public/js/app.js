/**
 * Presentation app
 * @module apps/app3/app
 */

/**
 * @import {CommonAppEvent, commonDocumentType, CommonModuleCommon, COMMON_DOCUMENT} from '../../../common_types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const commonPath ='/common/js/common.js';
/**@type {CommonModuleCommon} */
const common = await import(commonPath);

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
                        common_app_id:common.COMMON_GLOBAL.common_app_id,
                        app_logo:common.COMMON_GLOBAL.app_logo,
                        app_copyright:common.COMMON_GLOBAL.app_copyright,
                        app_name:COMMON_DOCUMENT.title,
                        href:href,
                        title:title,
                        documentType:documentType
                    },
        methods:    {commonFFB:common.commonFFB},
        path:       '/common/component/common_document.js'});
};
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
 * @name appFrameworkSet
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
            KeyUp: null,
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
    await common.commonComponentRender({
        mountDiv:   common.COMMON_GLOBAL.app_div,
        data:       {app_id:common.COMMON_GLOBAL.common_app_id},
        methods:    {commonFFB:common.commonFFB},
        path:       '/component/app.js'});
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
    //show first menu at start
    await COMMON_DOCUMENT.querySelector('#title').click();

    const resizeDoc = () =>{
        if (COMMON_DOCUMENT.querySelector('#nav').offsetWidth)
            COMMON_DOCUMENT.querySelector('#content').style.setProperty('--document_width', (COMMON_DOCUMENT.querySelector('body').offsetWidth - COMMON_DOCUMENT.querySelector('#nav').offsetWidth)/(COMMON_DOCUMENT.querySelector('body').offsetWidth));
        else
            COMMON_DOCUMENT.querySelector('#content').style.setProperty('--document_width', (COMMON_DOCUMENT.querySelector('body').offsetWidth)/(COMMON_DOCUMENT.querySelector('#content').offsetWidth));
    };
    const resizeObserver = new ResizeObserver(() => {
        resizeDoc();    
    }); 
    resizeObserver.observe(COMMON_DOCUMENT.querySelector('body'));
};
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {string} parameters 
 * @returns {void}
 */
const appCommonInit = parameters => {
    COMMON_DOCUMENT.body.className = 'app_theme1';
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = null;
    common.commonInit(parameters).then(()=>{
        appInit();
    });
};
export{appCommonInit};
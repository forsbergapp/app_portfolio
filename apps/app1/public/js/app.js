/**
 * Presentation app
 * @module apps/app3/app
 */

/**
 * @import {CommonAppEvent, CommonModuleCommon, COMMON_DOCUMENT} from '../../../common_types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const commonPath ='/common/js/common.js';
/**@type {CommonModuleCommon} */
const common = await import(commonPath);

/**@type {import('../../../common_types.js').CommonModuleJsonDocPrettify} */
const {prettyPrint} = await import(common.commonMiscImportmap('jsdoc_prettify'));

/**
 * @param {string} href
 */
const linenumber = href =>{
    const source = document.getElementsByClassName('prettyprint source linenums');
    let i = 0;
    let lineNumber = 0;
    let lineId;
    let lines;
    let totalLines;
    let anchorHash;

    if (source && source[0]) {
        anchorHash = href.split('#')[1];
        lines = source[0].getElementsByTagName('li');
        totalLines = lines.length;

        for (; i < totalLines; i++) {
            lineNumber++;
            lineId = `line${lineNumber}`;
            lines[i].id = lineId;
            if (lineId === anchorHash) {
                lines[i].className += ' selected';
            }
        }
    }
};
/**
 * @param {string} href
 * @param {string} title
 * @param {boolean} markdown
 * @param {boolean} local
 */
const show = async (href, title, markdown, local) =>{
    if (local)
        try {
            COMMON_DOCUMENT.querySelector('#content_title').innerHTML= '';
            COMMON_DOCUMENT.querySelector('#content').innerHTML='';
            const response = await fetch(href);    
            if (response.ok){
                COMMON_DOCUMENT.querySelector('#content_title').innerHTML= title;
                if (markdown)
                    COMMON_DOCUMENT.querySelector('#content').className = 'markdown';
                else
                    COMMON_DOCUMENT.querySelector('#content').className = '';

                COMMON_DOCUMENT.querySelector('#content').innerHTML= common.commonMiscMarkdownParse(await response.text());
                
            }

        } catch (error) {
            null;
        }
    else{
        COMMON_DOCUMENT.querySelector('#content_title').innerHTML= '';
        COMMON_DOCUMENT.querySelector('#content').innerHTML='';
        const content = await common.commonFFB({path:'/app-common-doc/' + (href.split('#').length>1?href.split('#')[0]:href), method:'GET', authorization_type:'APP_DATA', spinner_id:'content'}).catch(()=>null);
        COMMON_DOCUMENT.querySelector('#content_title').innerHTML= content?title:'';
        if (markdown)
            COMMON_DOCUMENT.querySelector('#content').className = 'markdown';
        else
            COMMON_DOCUMENT.querySelector('#content').className = '';
        COMMON_DOCUMENT.querySelector('#content').innerHTML= content ?? '';
        prettyPrint();
        if (href.split('#')[1])
            linenumber(href);
    }
        
};
/**
 * App exception function
 * @function
 * @param {Error} error 
 * @returns {void}
 */
const appException = (error) => {
    common.commonMessageShow('EXCEPTION', null, null, null, error);
};
 
/**
 * App event click
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
                case 'title':
                case 'nav_content_app':
                case 'nav_content_jsdoc':
                case 'article':{
                    event.preventDefault();
                    if (event.target.getAttribute('href'))
                        show(   event.target.getAttribute('href'), 
                                //use title from first menu text if clicking on title
                                event_target_id=='title'?COMMON_DOCUMENT.querySelectorAll('#nav_content_app .common_link')[0].textContent:event.target.textContent, 
                                //markdown links in title and nav_content_app
                                (event_target_id=='title' ||event_target_id=='nav_content_app')?true:false, 
                                //local links in title and nav_content_app
                                (event_target_id=='title' ||event_target_id=='nav_content_app')?true:false);
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
                case 'common_window_info_btn_close':{
                    COMMON_DOCUMENT.querySelector('#dialogue_documents').style.visibility = 'visible';
                    break;
                }
                case event.target.classList.contains('markdown_image')?event_target_id:'':{
                    if (event.target.getAttribute('data-url'))
                        common.commonComponentRender({
                            mountDiv:   'common_window_info',
                            data:       {
                                        //show IMAGE type 0 
                                        info:0,
                                        url:event.target.getAttribute('data-url'),
                                        content_type:null, 
                                        iframe_content:null
                                        },
                            methods:    {commonWindowSetTimeout:common.commonWindowSetTimeout},
                            path:       '/common/component/common_window_info.js'});
                    break;
                }
            }
        });
    }
};
/**
 * Sets framework
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
 * Init app
 * @function
 * @returns {Promise.<void>}
 */
const appInit = async () => {
    appFrameworkSet();
    //common app component
    await common.commonComponentRender({mountDiv:   'common_app',
                                        data:       {
                                                    framework:      common.COMMON_GLOBAL.app_framework,
                                                    font_default:   true,
                                                    font_arabic:    true,
                                                    font_asian:     true,
                                                    font_prio1:     true,
                                                    font_prio2:     true,
                                                    font_prio3:     true
                                                    },
                                        methods:    null,
                                        path:       '/common/component/common_app.js'});
    await common.commonComponentRender({
        mountDiv:   common.COMMON_GLOBAL.app_div,
        data:       null,
        methods:    null,
        path:       '/component/app.js'});
    //show first menu at start
    COMMON_DOCUMENT.querySelector('#title').click();

};
/**
 * Init common
 * @function
 * @param {string} parameters 
 * @returns {void}
 */
const appCommonInit= parameters => {
    COMMON_DOCUMENT.body.className = 'app_theme1';
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = null;
    common.commonInit(parameters).then(()=>{
        appInit();
    });
};
export{appCommonInit};
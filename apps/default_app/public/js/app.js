/**
 * @module apps/default_PWA/app
 */

/**@type{import('../../../common_types.js').COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const commonPath ='common';
/**@type {import('../../../common_types.js').CommonModuleCommon} */
const common = await import(commonPath);
/**
 * App exception function
 * @param {Error} error 
 * @returns {void}
 */
 const appException = (error) => {
    common.commonMessageShow('EXCEPTION', null, null, null, error);
};

/**
 * App event click
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const appEventClick = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            appEventClick(event);
        });
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        common.commonEvent('click',event)
        .then(()=>{
            switch (event_target_id){
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
 * Sets framework
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
 * @returns {Promise.<void>}
 */
const appInit = async () => {
    await common.commonComponentRender({mountDiv:common.COMMON_GLOBAL.app_div,
        data:null,
        methods:null,
        path:'/component/app.js'})
    .then(()=>common.commonComponentRender({  mountDiv:'app_construction',
                                        data:null,
                                        methods:null,
                                        path:'/common/component/common_construction.js'}));
   appFrameworkSet();
};
/**
 * Init common
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

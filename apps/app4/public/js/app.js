/**
 * Map app
 * @module apps/app4/app
 */

/**@type{import('../../../common_types.js').CommonAppDocument} */
const CommonAppDocument = document;

const path_common ='common';
/**@type {import('../../../common_types.js').CommonModuleCommon} */
const common = await import(path_common);

/**
 * App exception function
 * @param {*} error 
 * @returns {void}
 */
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, null, error);
};
/**
 * App event click
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const app_event_click = event =>{
    if (event==null){
        CommonAppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_click(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('click',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_toolbar_framework_js':{
                   framework_set(1);
                    break;
                }
                case 'common_toolbar_framework_vue':{
                   framework_set(2);
                    break;
                }
                case 'common_toolbar_framework_react':{
                   framework_set(3);
                    break;
                }
                //dialogue user menu
                case 'common_user_menu':
                case 'common_user_menu_logged_in':
                case 'common_user_menu_avatar':
                case 'common_user_menu_avatar_img':
                case 'common_user_menu_logged_out':
                case 'common_user_menu_default_avatar':{
                    common.ComponentRender({
                        mountDiv:   'common_dialogue_user_menu',
                        data:       {
                                    app_id:common.COMMON_GLOBAL.app_id,
                                    user_account_id:common.COMMON_GLOBAL.user_account_id,
                                    common_app_id:common.COMMON_GLOBAL.common_app_id,
                                    data_app_id:common.COMMON_GLOBAL.common_app_id,
                                    username:common.COMMON_GLOBAL.user_account_username,
                                    token_exp:common.COMMON_GLOBAL.token_exp,
                                    token_iat:common.COMMON_GLOBAL.token_iat,
                                    token_timestamp: common.COMMON_GLOBAL.token_timestamp,
                                    system_admin:common.COMMON_GLOBAL.system_admin,
                                    user_locale:common.COMMON_GLOBAL.user_locale,
                                    user_timezone:common.COMMON_GLOBAL.user_timezone,
                                    user_direction:common.COMMON_GLOBAL.user_direction,
                                    user_arabic_script:common.COMMON_GLOBAL.user_arabic_script},
                        methods:    {
                                    set_current_value:common.set_current_value,
                                    FFB:common.FFB,
                                    ComponentRender:common.ComponentRender,
                                    user_session_countdown:common.user_session_countdown,
                                    show_message:common.show_message
                                    },
                        path:       '/common/component/common_dialogue_user_menu.js'})
                    .then(()=>
                        common.ComponentRender({
                            mountDiv:   'common_dialogue_user_menu_app_theme',
                            data:       null,
                            methods:    {
                                        theme_default_list:common.theme_default_list,
                                        ComponentRender:common.ComponentRender, 
                                        app_theme_update:common.common_preferences_post_mount
                                        },
                            path:       '/common/component/common_dialogue_user_menu_app_theme.js'}));
                    break;
                }
                case 'common_dialogue_user_menu_log_out':{
                    common.user_logout();
                    break;
                }
                /*Dialogue user start */
                case 'common_user_start_login_button':{
                    common.user_login().catch(()=>null);
                    break;
                }
                case 'common_user_start_signup_button':{
                    common.user_signup();
                    break;
                }
                case 'common_user_start_identity_provider_login':{
                    const target_row = common.element_row(event.target);
                    const provider_element = target_row.querySelector('.common_login_provider_id');
                    if (provider_element && provider_element.textContent)
                        common.user_login(null, null, null, parseInt(provider_element.textContent));
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
 const framework_set = async (framework=null) => {
    await common.framework_set(framework,
        {   Click: app_event_click,
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
const init_map = async ()=>{
    await common.ComponentRender({
        mountDiv:   common.COMMON_GLOBAL.app_div,
        data:       null,
        methods:    null,
        path:       '/component/app.js'});
    common.map_init('mapid',
                    common.COMMON_GLOBAL.client_longitude,
                    common.COMMON_GLOBAL.client_latitude,
                    null)
    .then(()=>  
        common.COMMON_GLOBAL.moduleLeaflet.methods.map_update({ 
                            longitude:common.COMMON_GLOBAL.client_longitude,
                            latitude:common.COMMON_GLOBAL.client_latitude,
                            text_place: common.COMMON_GLOBAL.client_place,
                            country:'',
                            city:'',
                            timezone_text :null,
                            to_method:0
                        }))
    .then(()=>  
       framework_set());
};
/**
 * Init app
 * @returns {Promise.<void>}
 */
const init_app = async () =>{
    await common.ComponentRender({
        mountDiv:   'common_user_account',
        data:       null,
        methods:    null,
        path:       '/common/component/common_user_account.js'});
    init_map();
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {void}
 */
const init = parameters => {
    CommonAppDocument.body.className = 'app_theme1';
    common.COMMON_GLOBAL.app_function_exception = app_exception;
    common.COMMON_GLOBAL.app_function_session_expired = common.user_logout;
    common.init_common(parameters).then(()=>{
        init_app();
    });
};
export{init};

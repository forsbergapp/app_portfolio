/**@type{{body:{className:string, classList:{add:function}},
 *        querySelector:function,
 *        querySelectorAll:function}} */
 const AppDocument = document;

 /**
  * @typedef {object}        AppEvent
  * @property {string}       code
  * @property {function}     preventDefault
  * @property {function}     stopPropagation
  * @property {{ id:                 string,
  *              innerHTML:          string,
  *              value:              string,
  *              parentNode:         {nextElementSibling:{querySelector:function}},
  *              nextElementSibling: {dispatchEvent:function},
  *              focus:              function,
  *              blur:               function,
  *              getAttribute:       function,
  *              setAttribute:       function,
  *              dispatchEvent:      function,
  *              classList:          {contains:function}
  *              className:          string
  *            }}  target
  */
 
/**@ts-ignore */
const common = await import('common');

const APP_GLOBAL = {
    'img_diagram_img':'/common/documents/app_portfolio.webp',
    'img_diagram_img_small':'/common/documents/app_portfolio_small.webp',
    'img_datamodel_img':'/common/documents/data_model.webp',
    'img_datamodel_img_small':'/common/documents/data_model_small.webp'
};
Object.seal(APP_GLOBAL);
/**
 * Show or hide dialouge
 * @returns {void}
 */
const show_hide_apps_dialogue = () => {
    if (AppDocument.querySelector('#dialogue_start_content').style.visibility=='visible' ||
        AppDocument.querySelector('#dialogue_start_content').style.visibility==''){
        AppDocument.querySelector('#dialogue_start_content').style.visibility='hidden';
        AppDocument.querySelector('#dialogue_info_content').style.visibility='hidden';
        AppDocument.querySelector('#common_profile_btn_top').style.visibility='hidden';
    }
    else{
        AppDocument.querySelector('#dialogue_start_content').style.visibility='visible';
        AppDocument.querySelector('#dialogue_info_content').style.visibility='visible';
        AppDocument.querySelector('#common_profile_btn_top').style.visibility='visible';
    }
};
/**
 * App event click
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_click = event => {
    if (event==null){
        AppDocument.querySelector('#app').addEventListener('click', (/**@type{AppEvent}*/event) => {
            app_event_click(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('click',event)
        .then(()=>{
            if (event.target.className == 'app_logo')
                window.open(common.element_row(event.target).querySelector('.app_url').innerHTML);
            else{
                switch (event_target_id){
                    case 'common_toolbar_framework_js':{
                        mount_app_app(1);
                        break;
                    }
                    case 'common_toolbar_framework_vue':{
                        mount_app_app(2);
                        break;
                    }
                    case 'common_toolbar_framework_react':{
                        mount_app_app(3);
                        break;
                    }
                    case 'app_menu_apps':{
                        AppDocument.querySelector('#app_menu_content_apps' ).style.display ='block';
                        AppDocument.querySelector('#app_menu_content_info' ).style.display ='none';
                        break;
                    }
                    case 'app_menu_info':{
                        AppDocument.querySelector('#app_menu_content_apps' ).style.display ='none';
                        AppDocument.querySelector('#app_menu_content_info' ).style.display ='block';
                        break;
                    }
                    case 'theme_background':{
                        show_hide_apps_dialogue();
                        break;
                    }
                    //start page
                    case 'start_message':{
                        event.preventDefault();
                        AppDocument.querySelector('#dialogue_info_content' ).style.visibility ='visible';
                        AppDocument.querySelector('#dialogue_start_content' ).style.visibility ='hidden';
                        break;
                    }
                    //second page
                    case 'info_diagram':
                    case 'info_diagram_img':{
                        common.show_window_info(0, APP_GLOBAL.img_diagram_img);
                        break;
                    }
                    case 'info_datamodel':
                    case 'info_datamodel_img':{
                        common.show_window_info(0, APP_GLOBAL.img_datamodel_img);
                        break;
                    }
                    case 'info_message':{
                        event.preventDefault();
                        AppDocument.querySelector('#dialogue_info_content' ).style.visibility ='hidden';
                        AppDocument.querySelector('#dialogue_start_content' ).style.visibility ='visible';
                        break;
                    }
                    case 'app_email':{
                        window.open(`mailto:${common.COMMON_GLOBAL.app_email}`,'_blank','');
                        break;
                    }
                    case 'app_link':{
                        if (common.COMMON_GLOBAL.app_link_url)
                            window.open(common.COMMON_GLOBAL.app_link_url,'_blank','');
                        break;
                    }
                    case 'info_link1':{
                        common.show_window_info(1, common.COMMON_GLOBAL.info_link_policy_url);
                        break;
                    }
                    case 'info_link2':{
                        common.show_window_info(1, common.COMMON_GLOBAL.info_link_disclaimer_url);
                        break;
                    }
                    case 'info_link3':{
                        common.show_window_info(1, common.COMMON_GLOBAL.info_link_terms_url);
                        break;
                    }case 'info_link4':{
                        common.show_window_info(1, common.COMMON_GLOBAL.info_link_about_url);
                        break;
                    }
                    //common
                    case 'common_profile_btn_top':{
                        common.profile_top(1);
                        break;
                    }
                    //user menu
                    case 'common_user_menu_username':{
                        AppDocument.querySelector('#common_dialogue_profile').style.visibility = 'visible';
                        common.profile_show(null,null);
                        AppDocument.querySelector('#common_user_menu_dropdown').style='none';
                        break;
                    }
                    case 'common_user_menu_dropdown_log_out':{
                        common.user_logoff();
                        AppDocument.querySelector('#common_user_menu_dropdown').style='none';
                        break;
                    }
                    //user preferences
                    case 'app_theme_checkbox':{
                        app_theme_update(true);
                        break;
                    }
                    //common with app specific settings
                    case 'common_profile_home':{
                        common.profile_top(1);
                        break;
                    }
                    case 'common_profile_close':{
                        common.profile_close();
                        break;
                    }
                    case 'common_profile_top_row1_1':{
                        common.profile_top(1);
                        break;
                    }
                    case 'common_profile_top_row1_2':{
                        common.profile_top(2);
                        break;
                    }
                    case 'common_profile_top_row1_3':{
                        common.profile_top(3);
                        break;
                    }
                    case 'common_profile_follow':{
                        common.profile_follow_like('FOLLOW');
                        break;
                    }
                    case 'common_profile_like':{
                        common.profile_follow_like('LIKE');
                        break;
                    }
                    case 'common_profile_main_btn_following':{
                        common.profile_detail(1, null, true);
                        break;
                    }
                    case 'common_profile_main_btn_followed':{
                        common.profile_detail(2, null, true);
                        break;
                    }
                    case 'common_profile_main_btn_likes':{
                        common.profile_detail(3, null, true);
                        break;
                    }
                    case 'common_profile_main_btn_liked':
                    case 'common_profile_main_btn_liked_users':{
                        common.profile_detail(4, null, true);
                        break;
                    }
                    case 'common_profile_main_btn_cloud':{
                        common.profile_detail(5, '/user_account_app/apps', true);
                        break;
                    }
                    case 'common_user_start_login_button':{
                        common.user_login().catch(()=>null);
                        break;
                    }
                    case 'common_user_start_signup_button':{
                        common.user_signup();
                        break;
                    }
                    case 'common_identity_provider_login':{
                        const target_row = common.element_row(event.target);
                        common.ProviderSignIn(target_row.querySelector('.common_login_provider_id').innerHTML);
                        break;
                    }
                    case 'common_user_edit_btn_user_delete_account':{
                        user_delete_app();
                        break;
                    }
                }
            }
        });
    };
};
/**
 * App event change
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_change = event => {
    if (event==null){
        AppDocument.querySelector('#app').addEventListener('change', (/**@type{AppEvent}*/event) => {
            app_event_change(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('change',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_user_locale_select':{
                    common.common_translate_ui(event.target.value).then(()=>get_apps());
                    break;
                }
                case 'common_user_arabic_script_select':{
                    app_theme_update();
                    break;
                }
            }
        });
    };
};
/**
 * App event keyup
 * @param {AppEvent} event
 * @returns {void} 
 */
const app_event_keyup = event => {
    if (event==null){
        AppDocument.querySelector('#app').addEventListener('keyup', (/**@type{AppEvent}*/event) => {
            app_event_keyup(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('keyup',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_profile_search_input':{
                    common.search_input(event, 'profile', null);
                    break;
                }
                case 'common_user_start_login_username':
                case 'common_user_start_login_password':{
                    if (event.code === 'Enter') {
                        event.preventDefault();
                        common.user_login()
                        .then(() => {
                            //unfocus
                            event.target.blur();
                        })
                        .catch(()=>null);
                    }        
                    break;
                }
                //dialouge verify
                case 'common_user_verify_verification_char1':
                case 'common_user_verify_verification_char2':
                case 'common_user_verify_verification_char3':
                case 'common_user_verify_verification_char4':
                case 'common_user_verify_verification_char5':{
                    user_verify_check_input_app(AppDocument.querySelector(`#${event_target_id}`), 
                                                'common_user_verify_verification_char' + Number(event_target_id.substring(event_target_id.length-1))+1);
                    break;
                }
                case 'common_user_verify_verification_char6':{
                    user_verify_check_input_app(AppDocument.querySelector(`#${event_target_id}`), '');
                    break;
                }
            }
        });
    };
};
/**
 * App theme update
 * @param {boolean} toggle_theme 
 * @returns {void}
 */
const app_theme_update = (toggle_theme=false) => {
    let theme = '';
    if(AppDocument.querySelector('#app_theme_checkbox').classList.contains('checked')){
        theme = 'app_theme_sun';
        if (toggle_theme){
            AppDocument.querySelector('#app_theme_checkbox').classList.remove('checked');
            theme = 'app_theme_moon';
        }
    }
    else{
        theme = 'app_theme_moon';
        if (toggle_theme){
            AppDocument.querySelector('#app_theme_checkbox').classList.add('checked');
            theme = 'app_theme_sun';
        }
    }
    AppDocument.body.className = AppDocument.querySelector('#common_user_arabic_script_select').value;
    AppDocument.body.classList.add(theme);
};
/**
 * Get apps
 * @returns {void}
 */
const get_apps = () => {
    
    AppDocument.querySelector('#apps').innerHTML = '';
    AppDocument.querySelector('#app_menu_content_apps_list').innerHTML = '';
    AppDocument.querySelector('#apps').classList.add('common_icon', 'css_spinner');
    AppDocument.querySelector('#app_menu_content_apps_list').classList.add('common_icon', 'css_spinner');
    common.FFB ('APP', `/apps?id=${common.COMMON_GLOBAL.common_app_id}`, 'GET', 'APP_DATA', null)
    .then((/**@type{string}*/result)=>{
        let html_apps ='';
        let html_menu_apps_list ='';
        let apps_count=0;
        for (const app of JSON.parse(result)) {
            apps_count++;
            html_apps +=`<div class='app_link_row common_row'>
                            <div class='app_link_col'>
                                <div class='app_url'>${app.PROTOCOL}${app.SUBDOMAIN}.${app.HOST}:${app.PORT}</div>
                            </div>
                            <div class='app_link_col'>
                                <img class='app_logo' src='${app.LOGO}' />
                            </div>
                            <div class='app_link_col'>
                                <div class='app_name'>${app.APP_NAME_TRANSLATION}</div>
                            </div>
                        </div>`;
            html_menu_apps_list +=`<div class='app_link_row common_row'>
                                        <div class='app_link_col'>
                                            <div class='app_id'>${app.APP_ID}</div>
                                        </div>
                                        <div class='app_link_col'>
                                            <div class='app_url'>${app.PROTOCOL}${app.SUBDOMAIN}.${app.HOST}:${app.PORT}</div>
                                        </div>
                                        <div class='app_link_col'>
                                            <img class='app_logo' src='${app.LOGO}' />
                                        </div>
                                        <div class='app_link_col'>
                                            <div class='app_name'>${app.NAME} - ${app.APP_NAME_TRANSLATION}</div>
                                            <div class='app_category'>${app.APP_CATEGORY==null?'':app.APP_CATEGORY}</div>
                                            <div class='app_description'>${app.APP_DESCRIPTION==null?'':app.APP_DESCRIPTION}</div>
                                        </div>
                                    </div>`;
        }
        //if odd add extra empty column
        if (apps_count & 1)
            html_apps +=`<div class='app_link_row common_row'>
                            <div class='app_link_col'></div>
                            <div class='app_link_col'></div>
                            <div class='app_link_col'></div>
                        </div>`;
        AppDocument.querySelector('#apps').classList.remove('common_icon', 'css_spinner');
        AppDocument.querySelector('#app_menu_content_apps_list').classList.remove('common_icon', 'css_spinner');
        AppDocument.querySelector('#apps').innerHTML = html_apps;
        AppDocument.querySelector('#app_menu_content_apps_list').innerHTML = html_menu_apps_list;
    })
    .catch(()=>{
        AppDocument.querySelector('#apps').classList.remove('common_icon', 'css_spinner');
        AppDocument.querySelector('#app_menu_content_apps_list').classList.remove('common_icon', 'css_spinner');
    });
};
/**
 * App exception function
 * @param {Error} error 
 * @returns {void}
 */
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, null, error);
};
/**
 * 
 * @param {AppEvent['target']} item 
 * @param {string} nextField 
 * @returns {Promise.<void>}
 */
const user_verify_check_input_app = async (item, nextField) => {
    await common.user_verify_check_input(item, nextField)
    .then((/**@type{{verification_type:number}}}*/result)=>{
        if (result!=null){
            //login if LOGIN  or SIGNUP were verified successfully
            if (result.verification_type==1 ||
                result.verification_type==2)
                common.user_login().catch(()=>null);
        }
        
    }) 
    .catch(()=>null);
};
/**
 * User delete
 * @returns {Promise.<void>}
 */
const user_delete_app = async () => {
    
    const function_delete_user_account = () => { 
                                                common.user_delete(1, null)
                                                .then(()=>common.user_logoff())
                                                .catch(()=>null);
                                            };
    await common.user_delete(null, function_delete_user_account)
    .then(()=>null)
    .catch(()=>null);
};
/**
 * Mounts app
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
const mount_app_app = async (framework=null) => {
    await common.mount_app(framework,
        {   Click: app_event_click,
            Change: app_event_change,
            KeyDown: null,
            KeyUp: app_event_keyup,
            Focus: null,
            Input:null})
    .then(()=> {
        AppDocument.querySelector('#dialogue_start_content').style.visibility = 'visible';
        if (common.COMMON_GLOBAL.user_locale != navigator.language.toLowerCase())
            common.common_translate_ui(common.COMMON_GLOBAL.user_locale).then(()=>get_apps());
        else
            get_apps();
        
        const user = window.location.pathname.substring(1);
        if (user !='') {
            //show profile for user entered in url
            AppDocument.querySelector('#common_dialogue_profile').style.visibility = 'visible';
            common.profile_show(null, user);
        }
        //use transition from now and not when starting app
        AppDocument.querySelectorAll('.dialogue_flip').forEach((/**@type{HTMLElement}*/dialogue) =>{
            dialogue.style.transition = 'all 1s';
        });
        //show app themes from now to avoid startup css render issues
        AppDocument.querySelector('#app_themes').style.display = 'block';
    });
};
/**
 * Init app
 * @param {{app:*[],
 *          app_service:{system_admin_only:number, first_time:number}}} parameters 
 * @returns {Promise.<void>}
 */
const init_app = async (parameters) => {
    for (const parameter of parameters.app) {
        if (parameter['MODULE_EASY.QRCODE_WIDTH'])
            common.COMMON_GLOBAL['module_easy.qrcode_width'] = parseInt(parameter['MODULE_EASY.QRCODE_WIDTH']);
        if (parameter['MODULE_EASY.QRCODE_HEIGHT'])
            common.COMMON_GLOBAL['module_easy.qrcode_height'] = parseInt(parameter['MODULE_EASY.QRCODE_HEIGHT']);
        if (parameter['MODULE_EASY.QRCODE_COLOR_DARK'])
            common.COMMON_GLOBAL['module_easy.qrcode_color_dark'] = parameter['MODULE_EASY.QRCODE_COLOR_DARK'];
        if (parameter['MODULE_EASY.QRCODE_COLOR_LIGHT'])
            common.COMMON_GLOBAL['module_easy.qrcode_color_light'] = parameter['MODULE_EASY.QRCODE_COLOR_LIGHT'];
        if (parameter['MODULE_EASY.QRCODE_BACKGROUND_COLOR'])
            common.COMMON_GLOBAL['module_easy.qrcode_background_color'] = parameter['MODULE_EASY.QRCODE_BACKGROUND_COLOR'];
    }
    
    //info
    AppDocument.querySelector('#info_diagram_img').src=APP_GLOBAL.img_diagram_img_small;
    AppDocument.querySelector('#info_datamodel_img').src=APP_GLOBAL.img_datamodel_img_small;
    
    AppDocument.querySelector('#app_copyright').innerHTML = common.COMMON_GLOBAL.app_copyright;
    AppDocument.querySelector('#app_email').innerHTML=common.COMMON_GLOBAL.app_email;
    
    if (common.COMMON_GLOBAL.app_link_url==null)
        AppDocument.querySelector('#app_link').style.display = 'none';
    else
        AppDocument.querySelector('#app_link').innerHTML = common.COMMON_GLOBAL.app_link_title;
    AppDocument.querySelector('#info_link1').innerHTML = common.COMMON_GLOBAL.info_link_policy_name;
    AppDocument.querySelector('#info_link2').innerHTML = common.COMMON_GLOBAL.info_link_disclaimer_name;
    AppDocument.querySelector('#info_link3').innerHTML = common.COMMON_GLOBAL.info_link_terms_name;
    AppDocument.querySelector('#info_link4').innerHTML = common.COMMON_GLOBAL.info_link_about_name;

    common.zoom_info();
    common.move_info();

    mount_app_app();
};
/**
 * Init common
 * @param {{app:*[],
 *          app_service:{system_admin_only:number, first_time:number}}} parameters 
 * @returns {void}
 */
const init = parameters => {
    AppDocument.querySelector('#apps').classList.add('common_icon', 'css_spinner');
    AppDocument.querySelector('#app_menu_content_apps_list').classList.add('common_icon', 'css_spinner');
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        init_app(parameters);
    });
};
export{init};
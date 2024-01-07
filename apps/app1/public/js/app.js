const common = await import('common');

const APP_GLOBAL = {
    'img_diagram_img':'/common/documents/app_portfolio.webp',
    'img_diagram_img_small':'/common/documents/app_portfolio_small.webp',
    'img_datamodel_img':'/common/documents/data_model.webp',
    'img_datamodel_img_small':'/common/documents/data_model_small.webp'
};
Object.seal(APP_GLOBAL);
const show_hide_apps_dialogue = () => {
    if (document.querySelector('#dialogue_start_content').style.visibility=='visible' ||
        document.querySelector('#dialogue_start_content').style.visibility==''){
        document.querySelector('#dialogue_start_content').style.visibility='hidden';
        document.querySelector('#dialogue_info_content').style.visibility='hidden';
        document.querySelector('#common_profile_btn_top').style.visibility='hidden';
    }
    else{
        document.querySelector('#dialogue_start_content').style.visibility='visible';
        document.querySelector('#dialogue_info_content').style.visibility='visible';
        document.querySelector('#common_profile_btn_top').style.visibility='visible';
    }
};
const setEvents = () => {
    //app
    document.querySelector('#app').addEventListener('click', event => {
        common.common_event('click',event);
        if (event.target.className == 'app_logo')
            window.open(event.target.parentNode.parentNode.querySelector('.app_url').innerHTML);
        else{
            const event_target_id = common.element_id(event.target);
            switch (event_target_id){
                case 'app_menu_apps':{
                    document.querySelector('#app_menu_content_apps' ).style.display ='block';
                    document.querySelector('#app_menu_content_info' ).style.display ='none';
                    break;
                }
                case 'app_menu_info':{
                    document.querySelector('#app_menu_content_apps' ).style.display ='none';
                    document.querySelector('#app_menu_content_info' ).style.display ='block';
                    break;
                }
                case 'theme_background':{
                    show_hide_apps_dialogue();
                    break;
                }
                //start page
                case 'start_message':{
                    event.preventDefault();
                    document.querySelector('#dialogue_info_content' ).style.visibility ='visible';
                    document.querySelector('#dialogue_start_content' ).style.visibility ='hidden';
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
                    document.querySelector('#dialogue_info_content' ).style.visibility ='hidden';
                    document.querySelector('#dialogue_start_content' ).style.visibility ='visible';
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
                    user_menu_item_click(event.target);
                    break;
                }
                case 'common_user_menu_dropdown_log_out':{
                    user_menu_item_click(event.target);
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
                    common.profile_detail(1, null, true, null);
                    break;
                }
                case 'common_profile_main_btn_followed':{
                    common.profile_detail(2, null, true, null);
                    break;
                }
                case 'common_profile_main_btn_likes':{
                    common.profile_detail(3, null, true, null);
                    break;
                }
                case 'common_profile_main_btn_liked':{
                    common.profile_detail(4, null, true, null);
                    break;
                }
                case 'common_profile_main_btn_cloud':{
                    common.profile_detail(5, '/user_account_app/apps', true, common.ICONS.sky_cloud, null);
                    break;
                }
                case 'common_login_button':{
                    user_login_app();
                    break;
                }
                case 'common_signup_button':{
                    common.user_signup();
                    break;
                }
                case 'common_identity_provider_login':{
                    const target_row = common.element_row(event.target);
                    ProviderSignIn_app(target_row.querySelector('.common_login_provider_id').innerHTML);
                    break;
                }
                case 'common_user_edit_btn_user_delete_account':{
                    user_delete_app();
                    break;
                }
            }
        }
    });
    document.querySelector('#app').addEventListener('change', event => {
        common.common_event('change',event);
        switch (event.target.id){
            case 'common_user_locale_select':{
                document.querySelector('#apps').innerHTML = common.APP_SPINNER;common.common_translate_ui(event.target.value, ()=>{get_apps();});
                break;
            }
            case 'common_user_arabic_script_select':{
                app_theme_update();
                break;
            }
        }
    });
    document.querySelector('#app').addEventListener('keyup', event => {
        common.common_event('keyup',event);
        switch (event.target.id){
            case 'common_profile_search_input':{
                common.search_input(event, 'profile', null);
                break;
            }
            case 'common_login_username':
            case 'common_login_password':{
                if (event.code === 'Enter') {
                    event.preventDefault();
                    user_login_app().then(() => {
                        //unfocus
                        event.target.blur();
                    });
                }        
                break;
            }
            //dialouge verify
            case 'common_user_verify_verification_char1':{
                user_verify_check_input_app(event.target, 'common_user_verify_verification_char2');
                break;
            }
            case 'common_user_verify_verification_char2':{
                user_verify_check_input_app(event.target, 'common_user_verify_verification_char3');
                break;
            }
            case 'common_user_verify_verification_char3':{
                user_verify_check_input_app(event.target, 'common_user_verify_verification_char4');
                break;
            }
            case 'common_user_verify_verification_char4':{
                user_verify_check_input_app(event.target, 'common_user_verify_verification_char5');
                break;
            }
            case 'common_user_verify_verification_char5':{
                user_verify_check_input_app(event.target, 'common_user_verify_verification_char6');
                break;
            }
            case 'common_user_verify_verification_char6':{
                user_verify_check_input_app(event.target, '');
                break;
            }
        }
    });
    document.querySelector('#app').addEventListener('keydown', event => {
        common.common_event('keydown',event);
    });
};
const app_theme_update = toggle_theme => {
    let theme = '';
    if(document.querySelector('#app_theme_checkbox').classList.contains('checked')){
        theme = 'app_theme_sun';
        if (toggle_theme){
            document.querySelector('#app_theme_checkbox').classList.remove('checked');
            theme = 'app_theme_moon';
        }
    }
    else{
        theme = 'app_theme_moon';
        if (toggle_theme){
            document.querySelector('#app_theme_checkbox').classList.add('checked');
            theme = 'app_theme_sun';
        }
    }
    document.body.className = document.querySelector('#common_user_arabic_script_select').value;
    document.body.classList.add(theme);
    return null;
};

const get_apps = () => {
    const old_button = document.querySelector('#apps').innerHTML;
    const old_button_menu_list = document.querySelector('#app_menu_content_apps_list').innerHTML;
    
    common.FFB ('APP', `/apps?id=${common.COMMON_GLOBAL.common_app_id}`, 'GET', 'APP_DATA', null, (err, result) => {
        if (err){
            document.querySelector('#apps').innerHTML = old_button;
            document.querySelector('#app_menu_content_apps_list').innerHTML = old_button_menu_list;
        }
        else{
            const apps = JSON.parse(result);
            let html_apps ='';
            let html_menu_apps_list ='';
            let apps_count=0;
            for (const app of apps) {
                apps_count++;
                html_apps +=`<div class='app_link_row'>
                            <div class='app_link_col'>
                                <div class='app_url'>${app.PROTOCOL}${app.SUBDOMAIN}.${app.HOST}:${app.PORT}</div>
                            </div>
                            <div class='app_link_col'>
                                <img class='app_logo' src='${app.LOGO}' />
                            </div>
                            <div class='app_link_col'>
                                <div class='app_name'>${app.NAME}</div>
                            </div>
                        </div>`;
                html_menu_apps_list +=`<div class='app_link_row'>
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
                                <div class='app_name'>${app.NAME}</div>
                                <div class='app_category'>${app.APP_CATEGORY==null?'':app.APP_CATEGORY}</div>
                                <div class='app_description'>${app.APP_DESCRIPTION==null?'':app.APP_DESCRIPTION}</div>
                            </div>
                        </div>`;
            }
            //if odd add extra empty column
            if (apps_count & 1)
                html_apps +=`<div class='app_link_row'>
                                <div class='app_link_col'></div>
                                <div class='app_link_col'></div>
                                <div class='app_link_col'></div>
                            </div>`;
            document.querySelector('#apps').innerHTML = html_apps;
            document.querySelector('#app_menu_content_apps_list').innerHTML = html_menu_apps_list;
        }
    });
};

const user_menu_item_click = (item) => {
    switch (item.id==''?item.parentNode.id:item.id){
        case 'common_user_menu_username':{
            document.querySelector('#common_dialogue_profile').style.visibility = 'visible';
            common.profile_show(null,null,()=>{});
            break;
        }
        case 'common_user_menu_dropdown_log_out':{
            common.user_logoff();            
            break;
        }
        default:
            break;
    }
    document.querySelector('#common_user_menu_dropdown').style='none';
};
const user_login_app = async () => {
    const username = document.querySelector('#common_login_username');
    const password = document.querySelector('#common_login_password');
    const old_button = document.querySelector('#common_login_button').innerHTML;
    document.querySelector('#common_login_button').innerHTML = common.APP_SPINNER;
            
    await common.user_login(username.innerHTML, password.innerHTML, (err, result)=>{
        document.querySelector('#common_login_button').innerHTML = old_button;
        if (err==null){            
            //set avatar or empty
            common.set_avatar(result.avatar, document.querySelector('#common_user_menu_avatar_img'));
            document.querySelector('#common_user_menu_username').innerHTML = result.username;
            
            document.querySelector('#common_user_menu_logged_in').style.display = 'inline-block';
            document.querySelector('#common_user_menu_logged_out').style.display = 'none';

            document.querySelector('#common_user_menu_username').style.display = 'block';
            document.querySelector('#common_user_menu_dropdown_logged_in').style.display = 'inline-block';
            document.querySelector('#common_user_menu_dropdown_logged_out').style.display = 'none';

            common.dialogue_login_clear();
            common.dialogue_signup_clear();
        }
        
    });
};
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, error);
};
const user_verify_check_input_app = async (item, nextField) => {
    await common.user_verify_check_input(item, nextField, (err, result) => {
        if ((err==null && result==null)==false)
            if(err==null){
                //login if LOGIN  or SIGNUP were verified successfully
                if (result.verification_type==1 ||
                    result.verification_type==2)
                    user_login_app();
            }
    });
};

const user_delete_app = async () => {
    let user_local;
    if (document.querySelector('#common_user_edit_local').style.display == 'block')
        user_local = true;
    else
        user_local = false;
    const function_delete_user_account = () => { 
                                            document.querySelector('#common_dialogue_message').style.visibility = 'hidden';
                                            common.user_delete(1, user_local, null, (err)=>{
                                                if (err==null){
                                                    common.user_logoff();
                                                }
                                            }); 
                                        };
    await common.user_delete(null, user_local, function_delete_user_account, (err) =>{
        if (err==null){
            common.user_logoff();
        }
    });
};
const ProviderUser_update_app = async (identity_provider_id, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email) => {
    await common.ProviderUser_update(identity_provider_id, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email, (err, result)=>{
        if(err==null){
            //set avatar or empty
            common.set_avatar(result.avatar, document.querySelector('#common_user_menu_avatar_img'));
            document.querySelector('#common_user_menu_username').innerHTML = result.username;

            document.querySelector('#common_user_menu_logged_in').style.display = 'inline-block';
            document.querySelector('#common_user_menu_logged_out').style.display = 'none';

            document.querySelector('#common_user_menu_dropdown_logged_in').style.display = 'inline-block';
            document.querySelector('#common_user_menu_dropdown_logged_out').style.display = 'none';
        }
    });
};
const ProviderSignIn_app = async (provider_button) => {
    await common.ProviderSignIn(provider_button, (err, result)=>{
        if (err==null){
            ProviderUser_update_app(result.identity_provider_id, 
                                    result.profile_id, 
                                    result.profile_first_name, 
                                    result.profile_last_name, 
                                    result.profile_image_url, 
                                    result.profile_email);
        }
    });
};
const init_app = async (parameters) => {
    for (const parameter of parameters.app) {
        if (parameter.parameter_name=='MODULE_EASY.QRCODE_WIDTH')
            common.COMMON_GLOBAL['module_easy.qrcode_width'] = parseInt(parameter.parameter_value);
        if (parameter.parameter_name=='MODULE_EASY.QRCODE_HEIGHT')
            common.COMMON_GLOBAL['module_easy.qrcode_height'] = parseInt(parameter.parameter_value);
        if (parameter.parameter_name=='MODULE_EASY.QRCODE_COLOR_DARK')
            common.COMMON_GLOBAL['module_easy.qrcode_color_dark'] = parameter.parameter_value;
        if (parameter.parameter_name=='MODULE_EASY.QRCODE_COLOR_LIGHT')
            common.COMMON_GLOBAL['module_easy.qrcode_color_light'] = parameter.parameter_value;
        if (parameter.parameter_name=='MODULE_EASY.QRCODE_BACKGROUND_COLOR')
            common.COMMON_GLOBAL['module_easy.qrcode_background_color'] = parameter.parameter_value;
    }
    //start
    document.querySelector('#start_message').innerHTML = common.ICONS.app_info;
    //info
    document.querySelector('#info_diagram_img').src=APP_GLOBAL.img_diagram_img_small;
    document.querySelector('#info_datamodel_img').src=APP_GLOBAL.img_datamodel_img_small;
    document.querySelector('#title1').innerHTML = common.ICONS.sky_cloud + common.ICONS.misc_model;
    document.querySelector('#title2').innerHTML = common.ICONS.app_database + common.ICONS.misc_model;
    document.querySelector('#info_message').innerHTML = common.ICONS.app_home;
    document.querySelector('#contact_text').innerHTML = common.ICONS.app_email;
    document.querySelector('#app_copyright').innerHTML = common.COMMON_GLOBAL.app_copyright;
    document.querySelector('#app_email').innerHTML=common.COMMON_GLOBAL.app_email;

    document.querySelector('#app_menu_apps').innerHTML=common.ICONS.app_apps;
    document.querySelector('#app_menu_info').innerHTML=common.ICONS.app_info;
    
    if (common.COMMON_GLOBAL.app_link_url==null)
        document.querySelector('#app_link').style.display = 'none';
    else
        document.querySelector('#app_link').innerHTML = common.COMMON_GLOBAL.app_link_title;
    document.querySelector('#info_link1').innerHTML = common.COMMON_GLOBAL.info_link_policy_name;
    document.querySelector('#info_link2').innerHTML = common.COMMON_GLOBAL.info_link_disclaimer_name;
    document.querySelector('#info_link3').innerHTML = common.COMMON_GLOBAL.info_link_terms_name;
    document.querySelector('#info_link4').innerHTML = common.COMMON_GLOBAL.info_link_about_name;

    //profile info
    document.querySelector('#common_profile_main_btn_cloud').innerHTML = common.ICONS.sky_cloud;
    
    setEvents();
    common.zoom_info('');
    common.move_info(null,null);

    document.querySelector('#apps').innerHTML = common.APP_SPINNER;
    if (common.COMMON_GLOBAL.user_locale != navigator.language.toLowerCase())
        common.common_translate_ui(common.COMMON_GLOBAL.user_locale, ()=>{
                get_apps();
        });
    else
        get_apps();
    const show_start = async () => {
        const user = window.location.pathname.substring(1);
        if (user !='') {
            //show profile for user entered in url
            document.querySelector('#common_dialogue_profile').style.visibility = 'visible';
            common.profile_show(null, user,()=>{});
        }
    };
    show_start().then(()=>{
        //use transition from now and not when starting app
        document.querySelectorAll('.dialogue_flip').forEach(dialogue =>{
            dialogue.style.transition = 'all 1s';
        });
        //show app themes from now to avoid startup css render issues
        document.querySelector('#app_themes').style.display = 'block';
    });
};

const init = (parameters) => {
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        init_app(parameters);
    });
};
export{show_hide_apps_dialogue, setEvents, app_theme_update, get_apps, user_menu_item_click, user_login_app,
       user_verify_check_input_app, user_delete_app, ProviderUser_update_app, ProviderSignIn_app,
       init_app, init};
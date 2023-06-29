const common = await import('/common/js/common.js');

const APP_GLOBAL = {
    'app_copyright':'',
    'app_email':'',
    'img_diagram_img':'/app1/images/app_portfolio.webp',
    'img_diagram_img_small':'/app1/images/app_portfolio_small.webp',
    'img_datamodel_img':'/app1/images/data_model.webp',
    'img_datamodel_img_small':'/app1/images/data_model_small.webp',
    'info_social_link1_url':'',
    'info_social_link2_url':'',
    'info_social_link3_url':'',
    'info_social_link4_url':'',
    'info_social_link1_icon':'',
    'info_social_link2_icon':'',
    'info_social_link3_icon':'',
    'info_social_link4_icon':'',
    'info_link_policy_name':'',
    'info_link_policy_url':'',
    'info_link_disclaimer_name':'',
    'info_link_disclaimer_url':'',
    'info_link_terms_name':'',
    'info_link_terms_url':'',
    'info_link_about_name':'',
    'info_link_about_url':''
};
const show_hide_apps_dialogue = () => {
    if (document.getElementById('dialogue_start_content').style.visibility=='visible' ||
        document.getElementById('dialogue_start_content').style.visibility==''){
        document.getElementById('dialogue_start_content').style.visibility='hidden';
        document.getElementById('dialogue_info_content').style.visibility='hidden';
        document.getElementById('common_profile_btn_top').style.visibility='hidden';
    }
    else{
        document.getElementById('dialogue_start_content').style.visibility='visible';
        document.getElementById('dialogue_info_content').style.visibility='visible';
        document.getElementById('common_profile_btn_top').style.visibility='visible';
    }
};
const setEvents = () => {

    //app
    document.getElementById('theme_background').addEventListener('click', () => { show_hide_apps_dialogue();  }, false);
    //start page
    document.getElementById( 'start_message' ).addEventListener( 'click', ( event ) => {
        event.preventDefault();
        document.getElementById( 'dialogue_info_content' ).className = 'dialogue_content dialogue_flip dialogue_flip-side-1';
        document.getElementById( 'dialogue_start_content' ).className = 'dialogue_content dialogue_flip dialogue_flip-side-2';
    }, false );
    //second page
    document.getElementById('info_diagram').addEventListener('click', () => {common.show_window_info(0, APP_GLOBAL['img_diagram_img']);}, false);
    document.getElementById('info_datamodel').addEventListener('click', () => {common.show_window_info(0, APP_GLOBAL['img_datamodel_img']);}, false);
    
    document.getElementById( 'info_message' ).addEventListener( 'click', ( event ) => {
        event.preventDefault();
        document.getElementById( 'dialogue_info_content' ).className = 'dialogue_content dialogue_flip';
        document.getElementById( 'dialogue_start_content' ).className = 'dialogue_content dialogue_flip';
    }, false );
    //common
    document.getElementById('common_profile_btn_top').addEventListener('click', () => {common.profile_top(1);}, false);
    //user menu
    document.getElementById('common_user_menu_username').addEventListener('click', (event) => { user_menu_item_click(event.target); }, false);
    document.getElementById('common_user_menu_dropdown_log_out').addEventListener('click', (event) => { user_menu_item_click(event.target); }, false);
    //user preferences
    document.getElementById('app_theme_checkbox').addEventListener('click', () => { app_theme_switch(); }, false);
    document.getElementById('common_user_locale_select').addEventListener('change', (event) => { document.getElementById('apps').innerHTML = common.APP_SPINNER;common.common_translate_ui(event.target.value, null, ()=>{get_apps();});}, false);
    document.getElementById('common_user_arabic_script_select').addEventListener('change', () => { app_theme_switch();}, false);
    //common with app specific settings
    //dialogue profile
    document.getElementById('common_profile_home').addEventListener('click', () => {common.profile_top(1);}, false);
    document.getElementById('common_profile_close').addEventListener('click', () => {common.profile_close();}, false);
    document.getElementById('common_profile_search_input').addEventListener('keyup', (event) => { common.search_input(event, null);}, false);
    document.getElementById('common_profile_top_row1_1').addEventListener('click', () => { common.profile_top(1);}, false);
    document.getElementById('common_profile_top_row1_2').addEventListener('click', () => { common.profile_top(2);}, false);
    document.getElementById('common_profile_top_row1_3').addEventListener('click', () => { common.profile_top(3);}, false);
    document.getElementById('common_profile_follow').addEventListener('click', () => { common.profile_follow_like('FOLLOW'); }, false);
    document.getElementById('common_profile_like').addEventListener('click', () => { common.profile_follow_like('LIKE'); }, false);
    document.getElementById('common_profile_main_btn_following').addEventListener('click', () => { common.profile_detail(1, null, true, null); }, false);
    document.getElementById('common_profile_main_btn_followed').addEventListener('click', () => { common.profile_detail(2, null, true, null); }, false);
    document.getElementById('common_profile_main_btn_likes').addEventListener('click', () => { common.profile_detail(3, null, true, null); }, false);
    document.getElementById('common_profile_main_btn_liked').addEventListener('click', () => { common.profile_detail(4, null, true, null); }, false);
    document.getElementById('common_profile_main_btn_cloud').addEventListener('click', () => { common.profile_detail(5, '/user_account_app/apps', true, common.ICONS['sky_cloud'], null); }, false);
    //dialogue login/signup/forgot
    const input_username_login = document.getElementById('common_login_username');
    input_username_login.addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault();
            user_login_app().then(() => {
                //unfocus
                document.getElementById('common_login_username').blur();
            });
        }
    });
    const input_password_login = document.getElementById('common_login_password');
    input_password_login.addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault();
            user_login_app().then(() => {
                //unfocus
                document.getElementById('common_login_password').blur();
            });
        }
    });
    document.getElementById('common_login_button').addEventListener('click', () => { user_login_app(); }, false);    
    document.getElementById('common_signup_button').addEventListener('click', () => { common.user_signup(); }, false);
    //dialogue user edit    
    document.getElementById('common_user_edit_btn_user_delete_account').addEventListener('click', () => { user_delete_app(); }, false);
    //dialogue verify
    document.getElementById('common_user_verify_verification_container').addEventListener('keyup', (event) => {
        switch (event.target.id){
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
    }, false);
};
const app_theme_switch = () => {
    if(document.getElementById('app_theme_checkbox').checked){
        document.body.className = 'app_theme_' + 'sun ' + document.getElementById('common_user_arabic_script_select').value;
    }
    else{
        document.body.className = 'app_theme_' + 'moon ' + document.getElementById('common_user_arabic_script_select').value;
    }
    return null;
};

const get_apps = () => {
    let json;
    const old_button = document.getElementById('apps').innerHTML;
    common.FFB ('DB_API', `/apps?id=${common.COMMON_GLOBAL['common_app_id']}`, 'GET', 0, null, (err, result) => {
        if (err)
            document.getElementById('apps').innerHTML = old_button;
        else{
            json = JSON.parse(result);
            let html ='';
            for (let i = 0; i < json.data.length; i++) {
                html +=`<div class='app_link_row'>
                            <div class='app_link_col'>
                                <div class='app_id'>${json.data[i].id}</div>
                            </div>
                            <div class='app_link_col'>
                                <div class='app_url'>${json.data[i].url}</div>
                            </div>
                            <div class='app_link_col'>
                                <img class='app_logo' src='${json.data[i].logo}' />
                            </div>
                            <div class='app_link_col'>
                                <div class='app_name'>${json.data[i].app_name}</div>
                                <div class='app_category'>${json.data[i].app_category==null?'':json.data[i].app_category}</div>
                                <div class='app_description'>${json.data[i].app_description==null?'':json.data[i].app_description}</div>
                            </div>
                        </div>`;
            }
            const clickappevent = (event) => { 
                window.open(event.target.parentNode.parentNode.children[1].children[0].innerHTML);};

            document.querySelectorAll('.app_logo').forEach(e => e.removeEventListener('click', clickappevent));
            document.getElementById('apps').innerHTML = html;
            document.querySelectorAll('.app_logo').forEach(e => e.addEventListener('click', clickappevent));
        }
    });
};

const user_menu_item_click = (item) => {
    switch (item.id==''?item.parentNode.id:item.id){
        case 'common_user_menu_username':{
            document.getElementById('common_dialogue_profile').style.visibility = 'visible';
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
    document.getElementById('common_user_menu_dropdown').style='none';
};
const user_login_app = async () => {
    const username = document.getElementById('common_login_username');
    const password = document.getElementById('common_login_password');
    const old_button = document.getElementById('common_login_button').innerHTML;
    document.getElementById('common_login_button').innerHTML = common.APP_SPINNER;
            
    await common.user_login(username.value, password.value, (err, result)=>{
        document.getElementById('common_login_button').innerHTML = old_button;
        if (err==null){            
            //set avatar or empty
            common.set_avatar(result.avatar, document.getElementById('common_user_menu_avatar_img'));
            document.getElementById('common_user_menu_username').innerHTML = result.username;
            
            document.getElementById('common_user_menu_logged_in').style.display = 'inline-block';
            document.getElementById('common_user_menu_logged_out').style.display = 'none';

            document.getElementById('common_user_menu_username').style.display = 'block';
            document.getElementById('common_user_menu_dropdown_logged_in').style.display = 'inline-block';
            document.getElementById('common_user_menu_dropdown_logged_out').style.display = 'none';

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
    if (document.getElementById('common_user_edit_local').style.display == 'block')
        user_local = true;
    else
        user_local = false;
    const function_delete_user_account = () => { 
                                            document.getElementById('common_dialogue_message').style.visibility = 'hidden';
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
            common.set_avatar(result.avatar, document.getElementById('common_user_menu_avatar_img'));
            document.getElementById('common_user_menu_username').innerHTML = result.username;

            document.getElementById('common_user_menu_logged_in').style.display = 'inline-block';
            document.getElementById('common_user_menu_logged_out').style.display = 'none';

            document.getElementById('common_user_menu_dropdown_logged_in').style.display = 'inline-block';
            document.getElementById('common_user_menu_dropdown_logged_out').style.display = 'none';
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
const init_app = async () => {
    //start
    document.getElementById('about_name').innerHTML = common.COMMON_GLOBAL['app_name'];
    document.getElementById('start_message').innerHTML = common.ICONS['app_info'];    
    //theme switcher
    document.getElementById('app_theme_checkbox').checked = true;
    //info
    document.getElementById('info_diagram_img').src=APP_GLOBAL['img_diagram_img_small'];
    document.getElementById('info_datamodel_img').src=APP_GLOBAL['img_datamodel_img_small'];
    document.getElementById('title1').innerHTML = common.COMMON_GLOBAL['app_name'] + ' Diagram';
    document.getElementById('title2').innerHTML = common.COMMON_GLOBAL['app_name'] + ' Data model';
    document.getElementById('info_message').innerHTML = common.ICONS['app_home'];
    document.getElementById('contact_text').innerHTML = 'Contact';    
    document.querySelector('#app_copyright').innerHTML = APP_GLOBAL['app_copyright'];
    document.getElementById('app_email').href='mailto:' + APP_GLOBAL['app_email'];
    document.getElementById('app_email').innerHTML=APP_GLOBAL['app_email'];

    //links
    document.getElementById('start_links').addEventListener('click', (event) => { 
        //social links ends with an integer and is part of app global
        if (event.target.id.startsWith('social_link')){
            if (APP_GLOBAL[`info_${event.target.id}_url`])
                window.open(APP_GLOBAL[`info_${event.target.id}_url`],'_blank','');
        }
        else{
            //info_link ends with an integer
            switch (event.target.id){
                case 'info_link1':{
                    common.show_window_info(1, APP_GLOBAL['info_link_policy_url']);
                    break;
                }
                case 'info_link2':{
                    common.show_window_info(1, APP_GLOBAL['info_link_disclaimer_url']);
                    break;
                }
                case 'info_link3':{
                    common.show_window_info(1, APP_GLOBAL['info_link_terms_url']);
                    break;
                }case 'info_link4':{
                    common.show_window_info(1, APP_GLOBAL['info_link_about_url']);
                    break;
                }
            }
        }
        
    }, false);
    
    if (APP_GLOBAL['info_social_link1_url']==null)
        document.getElementById('social_link1').style.display = 'none';
    else
        document.getElementById('social_link1').innerHTML = APP_GLOBAL['info_social_link1_icon'];
    if (APP_GLOBAL['info_social_link2_url']==null)
        document.getElementById('social_link2').style.display = 'none';
    else
        document.getElementById('social_link2').innerHTML = APP_GLOBAL['info_social_link2_icon'];
    if (APP_GLOBAL['info_social_link3_url']==null)
        document.getElementById('social_link3').style.display = 'none';
    else
        document.getElementById('social_link3').innerHTML = APP_GLOBAL['info_social_link3_icon'];
    if (APP_GLOBAL['info_social_link4_url']==null)
        document.getElementById('social_link4').style.display = 'none';
    else
        document.getElementById('social_link4').innerHTML = APP_GLOBAL['info_social_link4_icon'];
    document.getElementById('info_link1').innerHTML = APP_GLOBAL['info_link_policy_name'];
    document.getElementById('info_link2').innerHTML = APP_GLOBAL['info_link_disclaimer_name'];
    document.getElementById('info_link3').innerHTML = APP_GLOBAL['info_link_terms_name'];
    document.getElementById('info_link4').innerHTML = APP_GLOBAL['info_link_about_name'];

    //profile info
    document.getElementById('common_profile_main_btn_cloud').innerHTML = common.ICONS['sky_cloud'];
    
    setEvents();
    common.zoom_info('');
    common.move_info(null,null);
};

const init = (parameters) => {
    common.COMMON_GLOBAL['exception_app_function'] = app_exception;
    common.init_common(parameters, (err, global_app_parameters)=>{
        if (err)
            null;
        else{
            for (let i = 0; i < global_app_parameters.length; i++) {
                if (global_app_parameters[i].parameter_name=='APP_COPYRIGHT')
                    APP_GLOBAL['app_copyright'] =global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='APP_EMAIL')
                    APP_GLOBAL['app_email'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK1_URL')
                    APP_GLOBAL['info_social_link1_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK2_URL')
                    APP_GLOBAL['info_social_link2_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK3_URL')
                    APP_GLOBAL['info_social_link3_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK4_URL')
                    APP_GLOBAL['info_social_link4_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK1_ICON')
                    APP_GLOBAL['info_social_link1_icon'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK2_ICON')
                    APP_GLOBAL['info_social_link2_icon'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK3_ICON')
                    APP_GLOBAL['info_social_link3_icon'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK4_ICON')
                    APP_GLOBAL['info_social_link4_icon'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_POLICY_URL')
                    APP_GLOBAL['info_link_policy_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_DISCLAIMER_URL')
                    APP_GLOBAL['info_link_disclaimer_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_TERMS_URL')
                    APP_GLOBAL['info_link_terms_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_ABOUT_URL')
                    APP_GLOBAL['info_link_about_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_POLICY_NAME')
                    APP_GLOBAL['info_link_policy_name'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_DISCLAIMER_NAME')
                    APP_GLOBAL['info_link_disclaimer_name'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_TERMS_NAME')
                    APP_GLOBAL['info_link_terms_name'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_ABOUT_NAME')
                    APP_GLOBAL['info_link_about_name'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_WIDTH')
                    common.COMMON_GLOBAL['module_easy.qrcode_width'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_HEIGHT')
                    common.COMMON_GLOBAL['module_easy.qrcode_height'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_COLOR_DARK')
                    common.COMMON_GLOBAL['module_easy.qrcode_color_dark'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_COLOR_LIGHT')
                    common.COMMON_GLOBAL['module_easy.qrcode_color_light'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_LOGO_FILE_PATH')
                    common.COMMON_GLOBAL['module_easy.qrcode_logo_file_path'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_LOGO_WIDTH')
                    common.COMMON_GLOBAL['module_easy.qrcode_logo_width'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_LOGO_HEIGHT')
                    common.COMMON_GLOBAL['module_easy.qrcode_logo_height'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_BACKGROUND_COLOR')
                    common.COMMON_GLOBAL['module_easy.qrcode_background_color'] = global_app_parameters[i].parameter_value;
            }
            init_app().then(()=>{
                document.getElementById('apps').innerHTML = common.APP_SPINNER;
                if (common.COMMON_GLOBAL['user_locale'] != navigator.language.toLowerCase())
                    common.common_translate_ui(common.COMMON_GLOBAL['user_locale'], null, ()=>{
                            get_apps();
                    });
                else
                    get_apps();
                const show_start = async () => {
                    const user = window.location.pathname.substring(1);
                    if (user !='') {
                        //show profile for user entered in url
                        document.getElementById('common_dialogue_profile').style.visibility = 'visible';
                        common.profile_show(null, user,()=>{});
                    }
                };
                show_start().then(()=>{
                    common.Providers_init((event) => { ProviderSignIn_app(event.target.id==''?event.target.parentElement:event.target); });
                    //use transition from now and not when starting app
                    document.querySelectorAll('.dialogue_flip').forEach(dialogue =>{
                        dialogue.style.transition = 'all 1s';
                    });
                    //show app themes from now to avoid startup css render issues
                    document.querySelector('#app_themes').style.display = 'block';
                });
            });
        }
    });
};
export{show_hide_apps_dialogue, setEvents, app_theme_switch, get_apps, user_menu_item_click, user_login_app,
       app_exception, user_verify_check_input_app, user_delete_app, ProviderUser_update_app, ProviderSignIn_app,
       init_app, init};
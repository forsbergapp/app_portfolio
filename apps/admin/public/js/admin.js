const common = await import('common');
const app_secure = await import('app_secure');

const admin_logoff_app = () => {
    const clear_common = () => {
        app_secure.delete_globals();
        document.querySelector('#select_broadcast_type').classList.remove('admin','system_admin');
        document.querySelector('#menu_secure').classList.remove('admin','system_admin');
        document.querySelectorAll('.main_content').forEach(content => {
            content.innerHTML = '';
        });
        common.show_common_dialogue('LOGIN');
        document.querySelector('#menu').style.visibility = 'hidden';
        document.querySelector('#menu_open').style.visibility = 'hidden';
        document.querySelector('#admin_secure').style.visibility = 'hidden';
    };
    common.user_logoff(common.COMMON_GLOBAL.system_admin != '').then(() => {
        clear_common();
    });
};
const admin_login = async () => {
    let system_admin = false;
    if (document.querySelector('#common_user_start_nav .common_user_start_selected').id == 'common_user_start_login_system_admin')
        system_admin = true;
    await common.user_login(system_admin)
    .then(()=>{
        if (system_admin){
            document.querySelector('#menu').style.visibility = 'visible';
            document.querySelector('#menu_open').style.visibility = 'visible';
            document.querySelector('#admin_secure').style.visibility = 'visible';
            app_secure.init();
        }
        else{
            document.querySelector('#menu').style.visibility = 'visible';
            document.querySelector('#menu_open').style.visibility = 'visible';
            document.querySelector('#common_user_preferences').style.display = 'block';
            document.querySelector('#admin_secure').style.visibility = 'visible';
            app_secure.init();
        }
    })
    .catch(()=>null);
};
const app_event_click = event => {
    if (event==null){
        //javascript framework
        document.querySelector('#app').addEventListener('click',(event) => {
            app_event_click(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        const list_title = common.element_list_title(event.target);
        common.common_event('click',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_toolbar_framework_js':{
                    mount_app_app('1');
                    break;
                }
                case 'common_toolbar_framework_vue':{
                    mount_app_app('2');
                    break;
                }
                case 'common_toolbar_framework_react':{
                    mount_app_app('3');
                    break;
                }
                case 'common_user_start_login_button':
                case 'common_user_start_login_system_admin_button':{
                    admin_login();
                    break;
                }
                case 'menu_open':{
                    document.querySelector('#menu').style.display = 'block';
                    break;
                }
                case 'menu_close': {
                    document.querySelector('#menu').style.display = 'none';
                    break;
                }
                case 'menu_1':
                case 'menu_2':
                case 'menu_3':
                case 'menu_4':
                case 'menu_5':
                case 'menu_6':
                case 'menu_7':
                case 'menu_8':
                case 'menu_9':
                case 'menu_10':{
                    app_secure.show_menu(parseInt(event_target_id.substring(5)));
                    break;
                }
                case 'menu_11': {
                    admin_logoff_app();
                    break;
                }
                //common
                case 'common_message_cancel':{
                    document.querySelector('#common_dialogue_message').style.visibility = 'hidden';
                    break;
                }
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
                case 'common_profile_main_btn_liked':
                case 'common_profile_main_btn_liked_heart':
                case 'common_profile_main_btn_liked_users':{
                    common.profile_detail(4, null, true, null);
                    break;
                }
                case 'common_user_menu_username':{
                    if (common.COMMON_GLOBAL.system_admin == ''){
                        document.querySelector('#common_dialogue_profile').style.visibility = 'visible';
                        common.profile_show(null,null);
                        document.querySelector('#common_user_menu_dropdown').style = 'none';
                    }
                    break;
                }
                default:{
                    app_secure.app_events('click', event, event_target_id, list_title);
                    break;
                }
            }
        });
    }
};

const app_event_change = event => {
    if (event==null){
        //javascript framework
        document.querySelector('#app').addEventListener('change',(event) => {
            app_event_change(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('change',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_user_locale_select':{
                    common.common_translate_ui(event.target.value, ()=>{});
                    break;
                }
                case 'common_user_arabic_script_select':{
                    document.querySelector('#common_app_select_theme').dispatchEvent(new Event('change'));
                    break;
                }
                case 'common_app_select_theme':{
                    document.body.className = 'app_theme' + 
                                                document.querySelector('#common_app_select_theme').value + ' ' + 
                                                document.querySelector('#common_user_arabic_script_select').value;
                    break;
                }
                default:{
                    app_secure.app_events('change', event, event_target_id);
                    break;
                }
            }
        });
    }
};

const app_event_keyup = event => {
    if (event==null){
        //javascript framework
        document.querySelector('#app').addEventListener('keyup',(event) => {
            app_event_keyup(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('keyup',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_user_start_login_username':
                case 'common_user_start_login_password':
                case 'common_user_start_login_system_admin_username':
                case 'common_user_start_login_system_admin_password':
                case 'user_start_login_system_admin_password_confirm_input':{
                    if (event.code === 'Enter') {
                        event.preventDefault();
                        admin_login().then(() => {
                            //unfocus
                            document.querySelector('#' + event.target.id).blur();
                        });
                    }
                    break;
                }
                default:
                    app_secure.app_events('keyup', event, event_target_id);
                    break;
            }
        });
    }
};

const app_event_keydown = event => {
    if (event==null){
        //javascript framework
        document.querySelector('#app').addEventListener('keydown',(event) => {
            app_event_keydown(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('keydown',event)
        .then(()=>{
            app_secure.app_events('keydown', event, event_target_id);
        });
    }
};
const app_event_input = event => {
    if (event==null){
        //javascript framework
        document.querySelector('#app').addEventListener('input',(event) => {
            app_event_input(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('input',event)
        .then(()=>{
            app_secure.app_events('input', event, event_target_id);
        });
    }
};
const app_event_focus = event => {
    if (event==null){
        //javascript framework
        document.querySelector('#app').addEventListener('focus',(event) => {
            app_event_focus(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('focus',event)
        .then(()=>{
            app_secure.app_events('focus', event, event_target_id);
        });
    }
};

const admin_exception = (error) => {
    common.show_message('EXCEPTION', null, null, null, error);
};
const mount_app_app = async framework => {
    await common.mount_app(framework,
        {   Click: app_event_click,
            Change: app_event_change,
            KeyDown: app_event_keydown,
            KeyUp: app_event_keyup,
            Focus: app_event_focus,
            Input:app_event_input})
    .then(()=>{
        if (common.COMMON_GLOBAL.user_account_id =='' && common.COMMON_GLOBAL.system_admin=='')
            if (common.COMMON_GLOBAL.system_admin_only == 1)
                common.show_common_dialogue('LOGIN_SYSTEM_ADMIN');
            else
                common.show_common_dialogue('LOGIN'); 
    });
};
const init_app = (parameters) => {
    document.querySelector('#common_user_start_login_system_admin').style.display = 'inline-block';
    if (parameters.app_service.first_time == 1) {
        document.querySelector('#common_user_start_login_system_admin_first_time').style.display = 'block';
        document.querySelector('#common_user_start_login_system_admin_password_confirm').style.display = 'block';
    }
    if (parameters.app_service.system_admin_only == 1) {
        document.querySelector('#common_user_start_login').style.display = 'none';
        document.querySelector('#common_user_start_login_form').style.display = 'none';
    }
    else {
        for (let i = 0; i < parameters.app.length; i++) {
            if (parameters.app[i].parameter_name == 'MODULE_EASY.QRCODE_WIDTH')
                common.COMMON_GLOBAL['module_easy.qrcode_width'] = parseInt(parameters.app[i].parameter_value);
            if (parameters.app[i].parameter_name == 'MODULE_EASY.QRCODE_HEIGHT')
                common.COMMON_GLOBAL['module_easy.qrcode_height'] = parseInt(parameters.app[i].parameter_value);
            if (parameters.app[i].parameter_name == 'MODULE_EASY.QRCODE_COLOR_DARK')
                common.COMMON_GLOBAL['module_easy.qrcode_color_dark'] = parameters.app[i].parameter_value;
            if (parameters.app[i].parameter_name == 'MODULE_EASY.QRCODE_COLOR_LIGHT')
                common.COMMON_GLOBAL['module_easy.qrcode_color_light'] = parameters.app[i].parameter_value;
            if (parameters.app[i].parameter_name == 'MODULE_EASY.QRCODE_BACKGROUND_COLOR')
                common.COMMON_GLOBAL['module_easy.qrcode_background_color'] = parameters.app[i].parameter_value;
        }
    }
    if (parameters.app_service.system_admin_only == 0)
        if (common.COMMON_GLOBAL.user_locale != navigator.language.toLowerCase())
            common.common_translate_ui(common.COMMON_GLOBAL.user_locale);
    mount_app_app()
    .then (()=>document.querySelector('#common_user_start_login_button').classList.remove('css_spinner'))
    .catch(()=>document.querySelector('#common_user_start_login_button').classList.remove('css_spinner'));
};
const init = (parameters) => {
    //show admin login as default
    document.querySelector('#common_user_start_login_button').classList.add('css_spinner');
    common.COMMON_GLOBAL.exception_app_function = admin_exception;
    common.init_common(parameters).then(()=>{
        init_app(parameters);  
    })
    .catch(()=>document.querySelector('#common_user_start_login_button').classList.remove('css_spinner'));
};
export { init };
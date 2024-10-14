/**
 * @module apps/admin/secure
 */

/**@type{import('../../../common_types.js').COMMON_DOCUMENT} */
 const COMMON_DOCUMENT = document;

const common_path ='common';
/**@type {import('../../../common_types.js').CommonModuleCommon} */
const common = await import(common_path);

/**
 * App globals
 * @type{{  component: {MENU_MONITOR:{ monitorShow:                function,
 *                                     monitorDetailShowLogDir:    function,
 *                                     monitorDetailShowServerLog: function,
 *                                     monitorDetailPage:          function,
 *                                     monitorDetailClickSort:     function,
 *                                     monitorDetailClickItem:     function
 *                                  }
 *                      },
 *          previous_row:{}}}
 */
const APP_GLOBAL = {
    component: {MENU_MONITOR : {monitorShow:                ()=>null,
                                monitorDetailShowLogDir:    ()=>null,
                                monitorDetailShowServerLog: ()=>null,
                                monitorDetailPage:          ()=>null,
                                monitorDetailClickSort:     ()=>null,
                                monitorDetailClickItem:     ()=>null
                            }
                },
    previous_row:{}
};
Object.seal(APP_GLOBAL);
/**
 * Set globals to null
 * @returns {void}
 */
const delete_globals = () => {
    APP_GLOBAL.component = {MENU_MONITOR : {monitorShow:                ()=>null,
                                            monitorDetailShowLogDir:    ()=>null,
                                            monitorDetailShowServerLog: ()=>null,
                                            monitorDetailPage:          ()=>null,
                                            monitorDetailClickSort:     ()=>null,
                                            monitorDetailClickItem:     ()=>null
                                        }
                            };
    APP_GLOBAL.previous_row = {};
};

/**
 * Show given menu
 * @param {number} menu 
 * @returns {void}
 */
const show_menu = menu => {
    COMMON_DOCUMENT.querySelectorAll('.secure_menuitem').forEach((/**@type{HTMLElement}*/content) =>content.classList.remove('secure_menuitem_selected'));
    COMMON_DOCUMENT.querySelector(`#secure_menu_${menu}`).classList.add('secure_menuitem_selected');

    switch(menu){
        //START
        case 1:{
            common.commonComponentRender({mountDiv:   'secure_menu_content',
                                    data:       null,
                                    methods:    {
                                                commonComponentRender:common.commonComponentRender, 
                                                commonFFB:common.commonFFB
                                                },
                                    path:       '/component/menu_start.js'})
            .then(()=>show_charts());
            
            break;
        }
        //USER STAT
        case 2:{
            common.commonComponentRender({
                mountDiv:   'secure_menu_content',
                data:       null,
                methods:    {commonFFB:common.commonFFB},
                path:       '/component/menu_user_stat.js'});
            break;    
        }
        //USERS
        case 3:{
            common.commonComponentRender({
                mountDiv:   'secure_menu_content',
                data:       null,
                methods:    null,
                path:       '/component/menu_users.js'})
            .then(()=>search_users());
            break;
        }
        //APP ADMIN
        case 4:{
            common.commonComponentRender({
                mountDiv:   'secure_menu_content',
                data:       null,
                methods:    {commonFFB:common.commonFFB},
                path:       '/component/menu_apps.js'});
            break;    
        }
        //MONITOR
        case 5:{
            /**
             * @param {*} parameters
             */
            const map_update = (...parameters) =>common.COMMON_GLOBAL.moduleLeaflet.methods.map_update(...parameters);
            common.commonComponentRender({
                mountDiv:   'secure_menu_content',
                data:       {
                            app_id:common.COMMON_GLOBAL.app_id, 
                            admin_only:common.COMMON_GLOBAL.admin_only,
                            service_socket_client_ID: common.COMMON_GLOBAL.service_socket_client_ID,
                            client_latitude:common.COMMON_GLOBAL.client_latitude,
                            client_longitude:common.COMMON_GLOBAL.client_longitude,
                            client_place:common.COMMON_GLOBAL.client_place
                            },
                methods:    {
                            show_broadcast_dialogue:show_broadcast_dialogue,
                            map_update:map_update,
                            commonModuleLeafletInit:common.commonModuleLeafletInit,
                            commonElementRow:common.commonElementRow,
                            commonInputControl:common.commonInputControl,
                            commonComponentRender:common.commonComponentRender,
                            commonWindowUserAgentPlatform:common.commonWindowUserAgentPlatform,
                            commonRoundOff:common.commonRoundOff,
                            commonLovClose:common.commonLovClose,
                            commonLovShow:common.commonLovShow,
                            commonFFB:common.commonFFB
                            },
                path:       '/component/menu_monitor.js'})
            .then(result=>{
                APP_GLOBAL.component.MENU_MONITOR  = result.methods;
                COMMON_DOCUMENT.querySelector('#menu_monitor_connected').click();
            });
            break;
        }
        //SERVER CONFIG
        case 6:{
            common.commonComponentRender({
                mountDiv:   'secure_menu_content',
                data:       null,
                methods:    null,
                path:       '/component/menu_config.js'});
            break;
        }
        //INSTALLATION
        case 7:{
            common.commonComponentRender({
                mountDiv:   'secure_menu_content',
                data:       null,
                methods:    {commonFFB:common.commonFFB},
                path:       '/component/menu_installation.js'});
            break;
        }
        //DATABASE
        case 8:{
            common.commonComponentRender({
                mountDiv:   'secure_menu_content',
                data:       null,
                methods:    {
                            commonRoundOff:common.commonRoundOff,
                            commonFFB:common.commonFFB
                            },
                path:       '/component/menu_db_info.js'});
            break;
        }
        //BACKUP/RESTORE
        case 9:{
            break;
        }
        //SERVER
        case 10:{
            common.commonComponentRender({
                mountDiv:   'secure_menu_content',
                data:       null,
                methods:    {commonFFB:common.commonFFB},
                path:       '/component/menu_server.js'});
            break;
        }
    }            
};
/**
 * Show charts
 * @returns{Promise.<void>}
 */
const show_charts = async () => {
    common.commonComponentRender({
        mountDiv:   'menu_start_graphBox',
        data:       null,
        methods:    {
                    commonComponentRender:common.commonComponentRender,
                    commonFFB:common.commonFFB
                    },
        path:       '/component/menu_start_chart.js'});
};
/**
 * Broadcast send
 * @returns{void}
 */
const sendBroadcast = () => {
    let broadcast_type ='';
    let client_id;
    let app_id;
    const broadcast_message = COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_message').textContent;

    if (broadcast_message==''){
        common.commonMessageShow('INFO', null, null, 'message_text', '!', common.COMMON_GLOBAL.app_id);
    }
    else{
        if (COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id').textContent==''){
            app_id = COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_select_app_broadcast .common_select_dropdown_value').getAttribute('data-value');
            client_id = '';
            broadcast_type = COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_select_broadcast_type .common_select_dropdown_value').getAttribute('data-value');
        }
        else{
            client_id = COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id').textContent;
            app_id = '';
            broadcast_type = 'CHAT';
        }
            
        const json_data ={  app_id:             app_id==''?null:app_id,
                            client_id:          client_id==''?null:client_id,
                            client_id_current:  common.COMMON_GLOBAL.service_socket_client_ID,
                            broadcast_type:     broadcast_type, 
                            broadcast_message:  common.commonWindowToBase64(broadcast_message)};
        let path='';
        if (common.COMMON_GLOBAL.admin!=null){
            path = '/server-socket/message';
        }
        else{
            path = '/server-socket/message';
        }
        common.commonFFB({path:path, method:'POST', authorization_type:'ADMIN', body:json_data})
        .then((/**@type{string}*/result)=>{
            if (Number(JSON.parse(result).sent) > 0)
                common.commonMessageShow('INFO', null, null, 'message_success', `(${Number(JSON.parse(result).sent)})`, common.COMMON_GLOBAL.app_id);
            else
                common.commonMessageShow('INFO', null, null, 'message_fail', null, common.COMMON_GLOBAL.app_id);
        })
        .catch(()=>null);
    }
};    
/**
 * Broadcast close
 * @returns{void}
 */
const closeBroadcast = () => {
    common.commonComponentRemove('dialogue_send_broadcast', true);
};
/**
 * Broadcast close
 * @param {string} dialogue_type 
 * @param {number|null} client_id 
 * @returns{Promise.<void>}
 */
const show_broadcast_dialogue = async (dialogue_type, client_id=null) => {
    common.commonComponentRender({
        mountDiv:       'dialogue_send_broadcast',
        data:           null,
        methods:        {
                        commonComponentRender:common.commonComponentRender,
                        commonFFB:common.commonFFB
                        },
        path:           '/component/dialogue_send_broadcast.js'})
    .then(()=>{
        switch (dialogue_type){
            case 'CHAT':{
                //hide and set INFO, should not be able to send MAINTENANCE message here
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_select_broadcast_type').style.display='none';
                //hide app selection
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_select_app_broadcast').style.display='none';
                //show client id
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id_label').style.display = 'inline-block';
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id').style.display = 'inline-block';
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id').textContent = client_id;
                break;
            }
            case 'APP':{
                //hide and set INFO, should not be able to send MAINTENANCE message here
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_select_broadcast_type').style.display='none';
                //show app selection
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_select_app_broadcast').style.display='block';
                //hide client id
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id_label').style.display = 'none';
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id').style.display = 'none';
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id').textContent = '';
                break;
            }
            case 'ALL':{
                //show broadcast type and INFO
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_select_broadcast_type').style.display='inline-block';
                //show app selection
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_select_app_broadcast').style.display='block';
                //hide client id
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id_label').style.display = 'none';
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id').style.display = 'none';
                COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id').textContent = '';
                break;
            }
        }
    });
};
/**
 * Broadcast set type
 * @returns{void}
 */
const set_broadcast_type = () => {
    switch (COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_select_broadcast_type .common_select_dropdown_value').getAttribute('data-value')){
        case 'ALERT':{
            //show app selection
            COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_select_app_broadcast').style.display='block';
            //hide client id
            COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id_label').style.display = 'none';
            COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id').style.display = 'none';
            COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id').textContent = '';
            break;
        }
        case 'MAINTENANCE':{
            //hide app selection
            COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_select_app_broadcast').style.display='none';
            //hide client id
            COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id_label').style.display = 'none';
            COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id').style.display = 'none';
            COMMON_DOCUMENT.querySelector('#dialogue_send_broadcast_client_id').textContent = '';
            break;
        }
    }
};
/**
 * Maintenance set
 * @returns{void}
 */
const set_maintenance = () => {
    let check_value;
    if (COMMON_DOCUMENT.querySelector('#menu_start_checkbox_maintenance').classList.contains('checked'))
        check_value = 1;
    else
        check_value = 0;
    const json_data = {maintenance:check_value};
    common.commonFFB({path:'/server-config/config/CONFIG_SERVER', method:'PUT', authorization_type:'ADMIN', body:json_data}).catch(()=>null);
};
/**
 * 
 * @param {string} sort 
 * @param {string} order_by 
 * @returns 
 */
const search_users = (sort='username', order_by='asc') => {
    common.commonComponentRender({
        mountDiv:   'menu_users_list',
        data:       {
                    user_account_id:common.COMMON_GLOBAL.user_account_id,
                    sort:sort,
                    order_by:order_by
                    },
        methods:    {commonFFB:common.commonFFB},
        path:       '/component/menu_users_list.js'});
 
};

/**
 * Button save
 * @param {string} item 
 */
const button_save = async (item) => {
    switch (item){
        case 'menu_apps_save':{
            //save changes in menu_apps
            let x = COMMON_DOCUMENT.querySelectorAll('.menu_apps_row');
            for (const record of x){
                if (record.getAttribute('data-changed-record')=='1'){
                    await update_record('app',
                                        record,
                                        item,
                                        {   user_account:{  id:0,
                                                            active:0,
                                                            user_level:0,
                                                            private:0,
                                                            username:'',
                                                            bio:'',
                                                            email:'',
                                                            email_unverified:'',
                                                            password:'',
                                                            password_reminder:'',
                                                            verification_code:''},
                                            app:{           id: record.children[0].children[0].textContent,
                                                            app_category_id: record.children[5].children[0].textContent},
                                            app_parameter: {app_id:0,
                                                            parameter_name:'',
                                                            parameter_value:'',
                                                            parameter_comment:''}});
                }
            }
            //save changes in menu_apps_parameters
            x = COMMON_DOCUMENT.querySelectorAll('.menu_apps_parameters_row');
            for (const record of x){
                if (record.getAttribute('data-changed-record')=='1'){
                    await update_record('app_parameter',
                                        record,
                                        item,
                                        {   user_account:{  id:0,
                                                            active:0,
                                                            user_level:0,
                                                            private:0,
                                                            username:'',
                                                            bio:'',
                                                            email:'',
                                                            email_unverified:'',
                                                            password:'',
                                                            password_reminder:'',
                                                            verification_code:''},
                                            app:{           id: 0,
                                                            app_category_id: 0},
                                            app_parameter: {app_id:record.children[0].children[0].textContent,
                                                            parameter_name:  record.children[1].children[0].textContent,
                                                            parameter_value: record.children[2].children[0].textContent,
                                                            parameter_comment: record.children[3].children[0].textContent}});
                }
            }
            break;
        }
        case 'menu_users_save':{
            //save changes in menu_users_list
            const x = COMMON_DOCUMENT.querySelectorAll('.menu_users_list_row');
            for (const record of x){
                if (record.getAttribute('data-changed-record')=='1'){
                    await update_record('user_account',
                                        record,
                                        item,
                                        {   user_account:{  id:record.children[1].children[0].textContent,
                                                            active:record.children[4].children[0].textContent,
                                                            user_level:record.children[5].children[0].textContent,
                                                            private:record.children[6].children[0].textContent,
                                                            username:record.children[7].children[0].textContent,
                                                            bio: record.children[8].children[0].textContent,
                                                            email: record.children[9].children[0].textContent,
                                                            email_unverified: record.children[10].children[0].textContent,
                                                            password: record.children[11].children[0].textContent,
                                                            password_reminder: record.children[12].children[0].textContent,
                                                            verification_code: record.children[13].children[0].textContent},
                                            app:{           id: 0,
                                                            app_category_id: 0},
                                            app_parameter: {app_id:0,
                                                            parameter_name:  '',
                                                            parameter_value: '',
                                                            parameter_comment: ''}});
                }
            }
            break;
        }
        case 'menu_config_save':{
            const config_server = () => {
                /**@type{object} */
                let config_server = {};
                COMMON_DOCUMENT.querySelectorAll('#menu_config_detail .menu_config_detail_group').forEach((/**@type{HTMLElement}*/config_group_element) => 
                    {
                        const config_group  = {
                                                [config_group_element.querySelector('.menu_config_detail_group_title div')?.textContent ?? '']:
                                                        Array.from(config_group_element.querySelectorAll('.menu_config_detail_row')).map(config_group_row => 
                                                            {
                                                                return {
                                                                    [config_group_row.querySelectorAll('.menu_config_detail_col div')[0].textContent ?? '']:
                                                                                config_group_row.querySelectorAll('.menu_config_detail_col div')[1].textContent,
                                                                    COMMENT:    config_group_row.querySelectorAll('.menu_config_detail_col div')[2].textContent ?? ''
                                                                };
                                                            }
                                                        )
                                            };
                        config_server = {...config_server, ...config_group};
                    }
                );
                return config_server;
            };
            const file = COMMON_DOCUMENT.querySelectorAll('#secure_menu_content .list_nav .list_nav_selected_tab')[0].id.substring('menu_config_'.length).toUpperCase();
            //file:'CONFIG_SERVER', 'CONFIG_APPS', 'CONFIG_IAM_BLOCKIP', 'CONFIG_IAM_POLICY', 'CONFIG_IAM_USERAGENT', 'CONFIG_MICROSERVICE', 'CONFIG_MICROSERVICE_SERVICES'
            const json_data = { config:    file=='CONFIG_SERVER'?
                                                config_server():
                                                    JSON.parse(COMMON_DOCUMENT.querySelector('#menu_config_detail_edit').textContent)};

            common.commonFFB({path:`/server-config/config/${file}`, method: 'PUT', authorization_type:'ADMIN', body:json_data, spinner_id:item});
            break;
        }
    }
};
/**
 * Update record
 * @param {'user_account'|'app'|'app_parameter'} table 
 * @param {HTMLElement} row_element 
 * @param {string} button 
 * @param {{user_account:{  id:number,
 *                          active:number,
 *                          user_level:number,
 *                          private:number,
 *                          username:string,
 *                          bio:string,
 *                          email:string,
 *                          email_unverified:string,
 *                          password:string,
 *                          password_reminder:string,
 *                          verification_code:string},
 *          app:{           id:number,
 *                          app_category_id:number},
 *          app_parameter: {app_id:number,
 *                          parameter_name:string,
 *                          parameter_value:string,
 *                          parameter_comment:string}}} parameters
 */
const update_record = async (table, 
                             row_element,
                             button,
                             parameters) => {
    let path = '';
    let json_data;
    /**@type{import('../../../common_types.js').CommonRESTAPIMethod} */
    let method;
    switch (table){
        case 'user_account':{
            json_data = {   active:             parameters.user_account.active,
                            user_level:         parameters.user_account.user_level,
                            private:            parameters.user_account.private,
                            username:           parameters.user_account.username,
                            bio:                parameters.user_account.bio,
                            email:              parameters.user_account.email,
                            email_unverified:   parameters.user_account.email_unverified,
                            password_new:       parameters.user_account.password,
                            password_reminder:  parameters.user_account.password_reminder,
                            verification_code:  parameters.user_account.verification_code};
            path = `/server-db_admin/user_account/${parameters.user_account.id}`;
            method = 'PATCH';
            break;
        }
        case 'app':{
            json_data = {   
                            app_category_id:parameters.app.app_category_id
                        };
            path = `/server-db_admin/apps/${parameters.app.id}`;
            method = 'PUT';
            break;
        }
        case 'app_parameter':{
            json_data = {   parameter_name:     parameters.app_parameter.parameter_name,
                            parameter_value:    parameters.app_parameter.parameter_value,
                            parameter_comment:  parameters.app_parameter.parameter_comment};
            path = `/server-config/config-apps-parameter/${parameters.app_parameter.app_id}`;
            method = 'PATCH';
            break;
        }
    }
    await common.commonFFB({path:path, method:method, authorization_type:'ADMIN', body:json_data, spinner_id:button})
            .then(()=>row_element.setAttribute('data-changed-record', '0'));
};


/**
 * Executes installation rest API and presents the result
 * @param {string} id 
 * @param {boolean|null} db_icon 
 * @param {string} path 
 * @param {string} query
 * @param {import('../../../common_types.js').CommonRESTAPIMethod} method 
 * @param {{demo_password:string}|null} data 
 * @returns {void}
 */
const installation_function = (id, db_icon, path, query, method, data) => {
    common.commonFFB({path:path, query:query, method:method, authorization_type:'ADMIN', body:data, spinner_id:id})
    .then((/**@type{string}*/result)=>{
        if (db_icon!=null)
            if (db_icon)
                COMMON_DOCUMENT.querySelector('#menu_installation_db_icon').classList.add('installed');
            else
                COMMON_DOCUMENT.querySelector('#menu_installation_db_icon').classList.remove('installed');
        common.commonMessageShow('LOG', null, null, null, JSON.parse(result).info, common.COMMON_GLOBAL.common_app_id);
    });
};
/**
 * Installs DB
 * @returns {void}
 */
const db_install = () =>{
    common.commonComponentRemove('common_dialogue_message');
    installation_function(  'menu_installation_db_button_install', true, 
                            '/server-db_admin/database', 
                            `client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}`, 
                            'POST', null);
};
/**
 * Uninstalls DB
 * @returns {void}
 */
const db_uninstall = () =>{
    common.commonComponentRemove('common_dialogue_message');
    installation_function(  'menu_installation_db_button_uninstall', false, 
                            '/server-db_admin/database', 
                            `client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}`, 'DELETE', null);
};
/**
 * Installs Demo data
 * @returns {void}
 */
const demo_install = () =>{
    if (common.commonInputControl(null,
                        {
                            check_valid_list_elements:[[COMMON_DOCUMENT.querySelector('#menu_installation_demo_password'),null]]
                        })==true){
        const json_data = {demo_password: COMMON_DOCUMENT.querySelector('#menu_installation_demo_password').textContent};
        installation_function(  'menu_installation_demo_button_install', null, 
                                '/server-db_admin/database-demo', 
                                `client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}`,
                                'POST', json_data);
    }
};
/**
 * Uninstalls Demo data
 * @returns {void}
 */
const demo_uninstall = () =>{
    installation_function(  'menu_installation_demo_button_uninstall', null, 
                            '/server-db_admin/database-demo', 
                            `?client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}`,
                            'DELETE', null);
};

/**
 * App events
 * @param {string} event_type 
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @param {string} event_target_id 
 * @param {HTMLElement|null} event_list_title 
 * @returns {void}
 */
const app_events = (event_type, event, event_target_id, event_list_title=null)=> {
    switch (event_type){
        case 'click':{
            switch (event_target_id){
                case event.target?.classList.contains('common_select_option')?event_target_id:'':
                case event.target.parentNode?.classList.contains('common_select_option')?event_target_id:'':{
                    //menu start
                    if( event_target_id == 'menu_start_select_app' ||
                        event_target_id == 'menu_start_select_year'||
                        event_target_id == 'menu_start_select_month' ||
                        event_target_id == 'menu_start_select_stat'){
                        show_charts();    
                    }
                    if( event_target_id == 'dialogue_send_broadcast_select_broadcast_type')
                        set_broadcast_type();
                    //menu monitor
                    if( event_target_id == 'menu_monitor_select_app'||
                        event_target_id == 'menu_monitor_select_year'||
                        event_target_id == 'menu_monitor_select_month'||
                        event_target_id == 'menu_monitor_select_day'){
                            switch (COMMON_DOCUMENT.querySelector('#menu_monitor .list_nav_selected_tab').id){
                                case 'menu_monitor_server_log':{
                                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab').classList.remove('list_nav_selected_tab');
                                    COMMON_DOCUMENT.querySelector('#menu_monitor_server_log').classList.add('list_nav_selected_tab');
                                    APP_GLOBAL.component.MENU_MONITOR.monitorDetailShowServerLog('logdate', 'desc');
                                    break;
                                }
                                case 'menu_monitor_connected':{
                                    COMMON_DOCUMENT.querySelector('#menu_monitor_connected').click();
                                    break;
                                }
                                case 'menu_monitor_app_log':{
                                    COMMON_DOCUMENT.querySelector('#menu_monitor_app_log').click();
                                    break;
                                }
                                default:{
                                    break;
                                }
                            }
                        }
                    if( event_target_id == 'menu_monitor_detail_select_logscope')
                        APP_GLOBAL.component.MENU_MONITOR.monitorDetailShowServerLog('logdate', 'desc');
                    break;
                }
                case 'menu_start_broadcast_button':{
                    show_broadcast_dialogue('ALL');
                    break;
                }
                case 'menu_start_checkbox_maintenance':{
                    set_maintenance();
                    break;
                }
                case 'menu_users_search_icon':{
                    COMMON_DOCUMENT.querySelector('#menu_users_list_search_input').focus();
                    search_users('username', 'asc');
                    break;
                }
                case 'menu_users_save':{
                    button_save('menu_users_save');
                    break;
                }
                case 'menu_apps_save':{
                    button_save('menu_apps_save');
                    break;
                }
                case 'menu_monitor_detail_filesearch':{
                    APP_GLOBAL.component.MENU_MONITOR.monitorDetailShowLogDir();
                    break;
                }
                case 'menu_monitor_detail_server_log_search_icon':{
                    COMMON_DOCUMENT.querySelector('#menu_monitor_detail_server_log_search_input').focus();
                    APP_GLOBAL.component.MENU_MONITOR.monitorDetailShowServerLog('logdate','desc');
                    break;
                }
                case 'menu_monitor_connected':{
                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab')?.classList.remove('list_nav_selected_tab');
                    COMMON_DOCUMENT.querySelector('#menu_monitor_connected').classList.add('list_nav_selected_tab');
                    APP_GLOBAL.component.MENU_MONITOR.monitorShow('CONNECTED', '', 'connection_date', 'desc');
                    break;
                }
                case 'menu_monitor_app_log':{
                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab')?.classList.remove('list_nav_selected_tab');
                    COMMON_DOCUMENT.querySelector('#menu_monitor_app_log').classList.add('list_nav_selected_tab');
                    APP_GLOBAL.component.MENU_MONITOR.monitorShow('APP_LOG', 0, 'date_created', 'desc');
                    break;
                }
                case 'menu_monitor_server_log':{
                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab')?.classList.remove('list_nav_selected_tab');
                    COMMON_DOCUMENT.querySelector('#menu_monitor_server_log').classList.add('list_nav_selected_tab');
                    APP_GLOBAL.component.MENU_MONITOR.monitorShow('SERVER_LOG', '', 'logdate', 'desc');
                    break;
                }
                case 'menu_monitor_pagination_first':
                case 'menu_monitor_pagination_previous':
                case 'menu_monitor_pagination_next':
                case 'menu_monitor_pagination_last':{
                    APP_GLOBAL.component.MENU_MONITOR.monitorDetailPage(event_target_id);
                    break;
                }
                case 'menu_config_save':{
                    button_save('menu_config_save');
                    break;
                }
                case 'menu_config_config_server' :
                case 'menu_config_config_iam_blockip':
                case 'menu_config_config_iam_useragent':
                case 'menu_config_config_iam_policy':{
                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab').classList.remove('list_nav_selected_tab');
                    COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('list_nav_selected_tab');
                    common.commonComponentRender({
                        mountDiv:       'menu_config_detail_container',
                        data:           {file:`${event_target_id.substring('menu_config_'.length).toUpperCase()}`},
                        methods:        {commonFFB:common.commonFFB},
                        path:           '/component/menu_config_detail.js'});
                    break;
                }
                case 'menu_installation_db_button_install':{
                    common.commonMessageShow('CONFIRM',null,db_install, null, null, common.COMMON_GLOBAL.app_id);
                    break;
                }
                case 'menu_installation_db_button_uninstall':{
                    common.commonMessageShow('CONFIRM',null,db_uninstall, null, null, common.COMMON_GLOBAL.app_id);
                    break;
                }
                case 'menu_installation_demo_button_install':{
                    demo_install();
                    break;
                }
                case 'menu_installation_demo_button_uninstall':{
                    demo_uninstall();
                    break;
                }
                case event_list_title && event_list_title.classList.contains('list_sort_click')?event_target_id:'':{
                    if (event_target_id == 'menu_users_list')
                        search_users(event_list_title?.getAttribute('data-column') ?? '', event_list_title?.classList.contains('desc')?'asc':'desc');
                    else
                        event_list_title!=null?APP_GLOBAL.component.MENU_MONITOR.monitorDetailClickSort(event_target_id, 
                                        event_list_title.getAttribute('data-column') ?? '',
                                        event_list_title.classList.contains('desc')?'asc':'desc'
                                        ):null;
                    break;
                }
                case event.target.classList.contains('gps_click')?event_target_id:'':{
                    APP_GLOBAL.component.MENU_MONITOR.monitorDetailClickItem('GPS',
                                    {
                                        latitude:   event.target.getAttribute('data-latitude') ?? '',
                                        longitude:  event.target.getAttribute('data-longitude') ?? '',
                                        ip:         event.target.getAttribute('data-ip') ?? '',
                                        id:         0
                                    });
                    break;
                }
                case event.target.classList.contains('chat_click')?event_target_id:'':{
                    APP_GLOBAL.component.MENU_MONITOR.monitorDetailClickItem('CHAT', 
                                    {   
                                        latitude:'',
                                        longitude:'',
                                        ip:'',
                                        id: Number(event.target.getAttribute('data-id'))
                                    });
                    break;
                }
                case 'menu_apps':{
                    if (event.target.classList.contains('common_list_lov_click'))
                        common.commonLovEvent(event, 'APP_CATEGORY');
                    break;
                }
                case 'dialogue_send_broadcast_send':{
                    sendBroadcast();
                    break;
                }
                case 'dialogue_send_broadcast_close':{
                    closeBroadcast();
                    break;
                }
            }
            break;
        }
        case 'focus':{
            switch (event_target_id){
                case 'menu_apps':{
                    //event on master to automatically show detail records
                    if (APP_GLOBAL.previous_row != common.commonElementRow(event.target)){
                        APP_GLOBAL.previous_row = common.commonElementRow(event.target);
                        common.commonComponentRender({
                            mountDiv:   'menu_apps_parameters',
                            data:       {app_id_data:parseInt(common.commonElementRow(event.target).getAttribute('data-app_id') ?? '')},
                            methods:    {commonFFB:common.commonFFB},
                            path:       '/component/menu_apps_parameters.js'});
                    }
                    break;
                }
                case 'menu_users_list':{
                    //event on master to automatically show detail records
                    if (APP_GLOBAL.previous_row != common.commonElementRow(event.target)){
                        APP_GLOBAL.previous_row = common.commonElementRow(event.target);
                        common.commonComponentRender({
                            mountDiv:   'menu_users_iam_user_login',
                            data:       {user_account_id:parseInt(common.commonElementRow(event.target).getAttribute('data-user_account_id') ?? '')},
                            methods:    {commonFFB:common.commonFFB},
                            path:       '/component/menu_users_iam_user_login.js'});
                    }
                    break;
                }   
            }
            break;
        }
        case 'input':{
            if (event.target.classList.contains('list_edit')){
                common.commonElementRow(event.target).setAttribute('data-changed-record','1');
                //app category LOV
                if (common.commonElementRow(event.target).classList.contains('menu_apps_row') && event.target.classList.contains('common_input_lov'))
                    if (event.target.textContent=='')
                        event.target.parentNode.nextElementSibling.querySelector('.common_lov_value').textContent = '';
                    else
                        common.commonLovAction(event, 'APP_CATEGORY', null, '/server-db_admin/app_category', `id=${event.target.textContent}`, 'GET', 'APP_ACCESS', null);
            }
            break;
        }
        case 'keyup':{
            switch (event_target_id){
                case 'menu_users_list_search_input':{
                    if (!event.code.startsWith('Arrow') && 
                        event.code != 'Home' && 
                        event.code != 'End' &&
                        event.code != 'PageUp' &&
                        event.code != 'PageDown')
                        common.commonTypewatch(search_users, 'username', 'asc');
                    break;
                }
                case 'menu_monitor_detail_server_log_search_input':{
                    if (!event.code.startsWith('Arrow') && 
                        event.code != 'Home' && 
                        event.code != 'End' &&
                        event.code != 'PageUp' &&
                        event.code != 'PageDown')
                        common.commonTypewatch(APP_GLOBAL.component.MENU_MONITOR.monitorDetailShowServerLog, 'logdate', 'desc');
                    break;
                }
            }
            break;
        }
        case 'keydown':{
            if (event.target.classList.contains('list_edit')){
                if (event.code=='ArrowUp') {
                    APP_GLOBAL.previous_row = common.commonElementRow(event.target);
                    event.preventDefault();
                    //focus on first list_edit item in the row
                    const element_previous = common.commonElementRow(event.target).previousSibling;
                    /**@ts-ignore */
                    if (element_previous && element_previous.classList.contains('common_row')){
                        /**@ts-ignore */
                        element_previous.querySelectorAll('.list_edit')[0].focus();
                    }
                }
                if (event.code=='ArrowDown') {
                    APP_GLOBAL.previous_row = common.commonElementRow(event.target);
                    event.preventDefault();
                    //focus on first list_edit item in the row
                    const element_next = common.commonElementRow(event.target).nextSibling;
                    if (element_next){
                        /**@ts-ignore */
                        element_next.querySelectorAll('.list_edit')[0].focus();       
                    }
                }
            }
            break;
        }
    }
};
/**
 * Init
 * @returns {void}
 */
const init = () => {
    //SET GLOBALS
    APP_GLOBAL.previous_row= {};

    show_menu(1);
};
export {delete_globals, show_menu, app_events, init,show_broadcast_dialogue};
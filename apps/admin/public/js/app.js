/**
 * Admin app
 * @module apps/admin/app
 */
/**@type{import('../../../common_types.js').COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const commonPath ='common';
/**@type {import('../../../common_types.js').CommonModuleCommon} */
const common = await import(commonPath);

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
const APP_SECURE_GLOBAL = {
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
Object.seal(APP_SECURE_GLOBAL);

/**
 * Set globals to null
 * @returns {void}
 */
const appSecureGlobalDelete = () => {
    APP_SECURE_GLOBAL.component = {MENU_MONITOR : { monitorShow:                ()=>null,
                                                    monitorDetailShowLogDir:    ()=>null,
                                                    monitorDetailShowServerLog: ()=>null,
                                                    monitorDetailPage:          ()=>null,
                                                    monitorDetailClickSort:     ()=>null,
                                                    monitorDetailClickItem:     ()=>null
                                                }
                            };
    APP_SECURE_GLOBAL.previous_row = {};
};

/**
 * Show given menu
 * @param {number} menu 
 * @returns {void}
 */
const appSecureMenuShow = menu => {
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
            .then(()=>appSecureMenuStartChartShow());
            
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
            .then(()=>appSecureMenuUsers());
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
                            service_socket_client_ID: common.COMMON_GLOBAL.service_socket_client_ID,
                            client_latitude:common.COMMON_GLOBAL.client_latitude,
                            client_longitude:common.COMMON_GLOBAL.client_longitude,
                            client_place:common.COMMON_GLOBAL.client_place
                            },
                methods:    {
                            appSecureDialogueSendBroadcastShow:appSecureDialogueSendBroadcastShow,
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
                APP_SECURE_GLOBAL.component.MENU_MONITOR  = result.methods;
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
const appSecureMenuStartChartShow = async () => {
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
const appSecureDialogueSendBroadcastSend = () => {
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
const appSecureDialogueSendBroadcastClose = () => {
    common.commonComponentRemove('dialogue_send_broadcast', true);
};
/**
 * Broadcast close
 * @param {string} dialogue_type 
 * @param {number|null} client_id 
 * @returns{Promise.<void>}
 */
const appSecureDialogueSendBroadcastShow = async (dialogue_type, client_id=null) => {
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
const appSecureDialogueSendBroadcastBroadcastTypeSet = () => {
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
const appSecureDialogueSendBroadcastMaintenanceSet = () => {
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
const appSecureMenuUsers = (sort='username', order_by='asc') => {
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
const appSecureCommonButtonSave = async (item) => {
    switch (item){
        case 'menu_apps_save':{
            //save changes in menu_apps
            for (const record of COMMON_DOCUMENT.querySelectorAll('.menu_apps_row[data-changed-record=\'1\']')){
                await appSecureCommonRecordUpdate('app',
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
                                        app:{           id: record.querySelector('[data-column=\'ID\']').textContent},
                                        app_parameter: {app_id:0,
                                                        parameter_name:'',
                                                        parameter_value:'',
                                                        parameter_comment:''}});
            }
            //save changes in menu_apps_parameters
            for (const record of COMMON_DOCUMENT.querySelectorAll('.menu_apps_parameters_row[data-changed-record=\'1\']')){
                await appSecureCommonRecordUpdate('app_parameter',
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
                                        app:{           id: 0},
                                        app_parameter: {app_id:record.querySelector('[data-column=\'APP_ID\']').textContent,
                                                        parameter_name:  record.querySelector('[data-column=\'NAME\']').textContent,
                                                        parameter_value: record.querySelector('[data-column=\'VALUE\']').textContent,
                                                        parameter_comment: record.querySelector('[data-column=\'COMMENT\']').textContent}});
            }
            break;
        }
        case 'menu_users_save':{
            //save changes in menu_users_list
            for (const record of COMMON_DOCUMENT.querySelectorAll('.menu_users_list_row[data-changed-record=\'1\']')){
                await appSecureCommonRecordUpdate('user_account',
                                    record,
                                    item,
                                    {   user_account:{  id:record.querySelector('[data-column=\'id\']').textContent,
                                                        active:record.querySelector('[data-column=\'active\']').textContent,
                                                        user_level:record.querySelector('[data-column=\'level\']').textContent,
                                                        private:record.querySelector('[data-column=\'private\']').textContent,
                                                        username:record.querySelector('[data-column=\'username\']').textContent,
                                                        bio: record.querySelector('[data-column=\'bio\']').textContent,
                                                        email: record.querySelector('[data-column=\'email\']').textContent,
                                                        email_unverified: record.querySelector('[data-column=\'email_unverified\']').textContent,
                                                        password: record.querySelector('[data-column=\'password\']').textContent,
                                                        password_reminder: record.querySelector('[data-column=\'password_reminder\']').textContent,
                                                        verification_code: record.querySelector('[data-column=\'verification_code\']').textContent},
                                        app:{           id: 0},
                                        app_parameter: {app_id:0,
                                                        parameter_name:  '',
                                                        parameter_value: '',
                                                        parameter_comment: ''}});
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
            //file:'CONFIG_SERVER', 'CONFIG_IAM_BLOCKIP', 'CONFIG_IAM_POLICY', 'CONFIG_IAM_USERAGENT', 'CONFIG_MICROSERVICE', 'CONFIG_MICROSERVICE_SERVICES'
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
 *          app:{           id:number},
 *          app_parameter: {app_id:number,
 *                          parameter_name:string,
 *                          parameter_value:string,
 *                          parameter_comment:string}}} parameters
 */
const appSecureCommonRecordUpdate = async (table, 
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
            json_data = null;
            path = `/server-db_admin/apps/${parameters.app.id}`;
            method = 'PUT';
            break;
        }
        case 'app_parameter':{
            json_data = {   parameter_name:     parameters.app_parameter.parameter_name,
                            parameter_value:    parameters.app_parameter.parameter_value,
                            parameter_comment:  parameters.app_parameter.parameter_comment};
            path = `/app-common-app-parameter/${parameters.app_parameter.app_id}`;
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
const appSecureMenuInstallationDbInstallationFunction = (id, db_icon, path, query, method, data) => {
    common.commonFFB({path:path, query:query, method:method, authorization_type:'ADMIN', body:data, spinner_id:id})
    .then((/**@type{string}*/result)=>{
        if (db_icon!=null)
            if (db_icon){
                common.COMMON_GLOBAL.admin_only = 0;
                COMMON_DOCUMENT.querySelector('#menu_installation_db_icon').classList.add('installed');
            }
            else{
                common.COMMON_GLOBAL.admin_only = 1;
                COMMON_DOCUMENT.querySelector('#menu_installation_db_icon').classList.remove('installed');
            }
                
        common.commonMessageShow('LOG', null, null, null, JSON.parse(result).info, common.COMMON_GLOBAL.common_app_id);
    });
};
/**
 * Installs DB
 * @returns {void}
 */
const appSecureMenuInstallationDbInstall = () =>{
    common.commonComponentRemove('common_dialogue_message');
    appSecureMenuInstallationDbInstallationFunction(  'menu_installation_db_button_install', true, 
                            '/server-db_admin/database', 
                            `client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}`, 
                            'POST', null);
};
/**
 * Uninstalls DB
 * @returns {void}
 */
const appSecureMenuInstallationDbUninstall = () =>{
    common.commonComponentRemove('common_dialogue_message');
    appSecureMenuInstallationDbInstallationFunction(  'menu_installation_db_button_uninstall', false, 
                            '/server-db_admin/database', 
                            `client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}`, 'DELETE', null);
};
/**
 * Installs Demo data
 * @returns {void}
 */
const appSecureMenuInstallationDemoInstall = () =>{
    if (common.commonInputControl(null,
                        {
                            check_valid_list_elements:[[COMMON_DOCUMENT.querySelector('#menu_installation_demo_password'),null]]
                        })==true){
        const json_data = {demo_password: COMMON_DOCUMENT.querySelector('#menu_installation_demo_password').textContent};
        appSecureMenuInstallationDbInstallationFunction(  'menu_installation_demo_button_install', null, 
                                '/server-db_admin/database-demo', 
                                `client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}`,
                                'POST', json_data);
    }
};
/**
 * Uninstalls Demo data
 * @returns {void}
 */
const appSecureMenuInstallationDemoUninstall = () =>{
    appSecureMenuInstallationDbInstallationFunction(  'menu_installation_demo_button_uninstall', null, 
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
const appSecureEvents = (event_type, event, event_target_id, event_list_title=null)=> {
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
                        appSecureMenuStartChartShow();    
                    }
                    if( event_target_id == 'dialogue_send_broadcast_select_broadcast_type')
                        appSecureDialogueSendBroadcastBroadcastTypeSet();
                    //menu monitor
                    if( event_target_id == 'menu_monitor_select_app'||
                        event_target_id == 'menu_monitor_select_year'||
                        event_target_id == 'menu_monitor_select_month'||
                        event_target_id == 'menu_monitor_select_day'){
                            switch (COMMON_DOCUMENT.querySelector('#menu_monitor .list_nav_selected_tab').id){
                                case 'menu_monitor_server_log':{
                                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab').classList.remove('list_nav_selected_tab');
                                    COMMON_DOCUMENT.querySelector('#menu_monitor_server_log').classList.add('list_nav_selected_tab');
                                    APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorDetailShowServerLog('logdate', 'desc');
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
                        APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorDetailShowServerLog('logdate', 'desc');
                    break;
                }
                case 'menu_start_broadcast_button':{
                    appSecureDialogueSendBroadcastShow('ALL');
                    break;
                }
                case 'menu_start_checkbox_maintenance':{
                    appSecureDialogueSendBroadcastMaintenanceSet();
                    break;
                }
                case 'menu_users_search_icon':{
                    COMMON_DOCUMENT.querySelector('#menu_users_list_search_input').focus();
                    appSecureMenuUsers('username', 'asc');
                    break;
                }
                case 'menu_users_save':{
                    appSecureCommonButtonSave('menu_users_save');
                    break;
                }
                case 'menu_apps_save':{
                    appSecureCommonButtonSave('menu_apps_save');
                    break;
                }
                case 'menu_monitor_detail_filesearch':{
                    APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorDetailShowLogDir();
                    break;
                }
                case 'menu_monitor_detail_server_log_search_icon':{
                    COMMON_DOCUMENT.querySelector('#menu_monitor_detail_server_log_search_input').focus();
                    APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorDetailShowServerLog('logdate','desc');
                    break;
                }
                case 'menu_monitor_connected':{
                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab')?.classList.remove('list_nav_selected_tab');
                    COMMON_DOCUMENT.querySelector('#menu_monitor_connected').classList.add('list_nav_selected_tab');
                    APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorShow('CONNECTED', '', 'connection_date', 'desc');
                    break;
                }
                case 'menu_monitor_app_log':{
                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab')?.classList.remove('list_nav_selected_tab');
                    COMMON_DOCUMENT.querySelector('#menu_monitor_app_log').classList.add('list_nav_selected_tab');
                    APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorShow('APP_LOG', 0, 'date_created', 'desc');
                    break;
                }
                case 'menu_monitor_server_log':{
                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab')?.classList.remove('list_nav_selected_tab');
                    COMMON_DOCUMENT.querySelector('#menu_monitor_server_log').classList.add('list_nav_selected_tab');
                    APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorShow('SERVER_LOG', '', 'logdate', 'desc');
                    break;
                }
                case 'menu_monitor_pagination_first':
                case 'menu_monitor_pagination_previous':
                case 'menu_monitor_pagination_next':
                case 'menu_monitor_pagination_last':{
                    APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorDetailPage(event_target_id);
                    break;
                }
                case 'menu_config_save':{
                    appSecureCommonButtonSave('menu_config_save');
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
                    common.commonMessageShow('CONFIRM',null,appSecureMenuInstallationDbInstall, null, null, common.COMMON_GLOBAL.app_id);
                    break;
                }
                case 'menu_installation_db_button_uninstall':{
                    common.commonMessageShow('CONFIRM',null,appSecureMenuInstallationDbUninstall, null, null, common.COMMON_GLOBAL.app_id);
                    break;
                }
                case 'menu_installation_demo_button_install':{
                    appSecureMenuInstallationDemoInstall();
                    break;
                }
                case 'menu_installation_demo_button_uninstall':{
                    appSecureMenuInstallationDemoUninstall();
                    break;
                }
                case event_list_title && event_list_title.classList.contains('list_sort_click')?event_target_id:'':{
                    if (event_target_id == 'menu_users_list')
                        appSecureMenuUsers(event_list_title?.getAttribute('data-column') ?? '', event_list_title?.classList.contains('desc')?'asc':'desc');
                    else
                        event_list_title!=null?APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorDetailClickSort(event_target_id, 
                                        event_list_title.getAttribute('data-column') ?? '',
                                        event_list_title.classList.contains('desc')?'asc':'desc'
                                        ):null;
                    break;
                }
                case event.target.classList.contains('gps_click')?event_target_id:'':{
                    APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorDetailClickItem('GPS',
                                    {
                                        latitude:   event.target.getAttribute('data-latitude') ?? '',
                                        longitude:  event.target.getAttribute('data-longitude') ?? '',
                                        ip:         event.target.getAttribute('data-ip') ?? '',
                                        id:         0
                                    });
                    break;
                }
                case event.target.classList.contains('chat_click')?event_target_id:'':{
                    APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorDetailClickItem('CHAT', 
                                    {   
                                        latitude:'',
                                        longitude:'',
                                        ip:'',
                                        id: Number(event.target.getAttribute('data-id'))
                                    });
                    break;
                }
                case 'dialogue_send_broadcast_send':{
                    appSecureDialogueSendBroadcastSend();
                    break;
                }
                case 'dialogue_send_broadcast_close':{
                    appSecureDialogueSendBroadcastClose();
                    break;
                }
            }
            break;
        }
        case 'focus':{
            switch (event_target_id){
                case 'menu_apps':{
                    //event on master to automatically show detail records
                    if (APP_SECURE_GLOBAL.previous_row != common.commonElementRow(event.target)){
                        APP_SECURE_GLOBAL.previous_row = common.commonElementRow(event.target);
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
                    if (APP_SECURE_GLOBAL.previous_row != common.commonElementRow(event.target)){
                        APP_SECURE_GLOBAL.previous_row = common.commonElementRow(event.target);
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
                        common.commonTypewatch(appSecureMenuUsers, 'username', 'asc');
                    break;
                }
                case 'menu_monitor_detail_server_log_search_input':{
                    if (!event.code.startsWith('Arrow') && 
                        event.code != 'Home' && 
                        event.code != 'End' &&
                        event.code != 'PageUp' &&
                        event.code != 'PageDown')
                        common.commonTypewatch(APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorDetailShowServerLog, 'logdate', 'desc');
                    break;
                }
            }
            break;
        }
        case 'keydown':{
            if (event_target_id=='menu_apps' && !event.code.startsWith('Arrow') && event.code !='Tab')
                event.preventDefault();
            else
                if (event.target.classList.contains('list_edit')){
                    if (event.code=='ArrowUp') {
                        APP_SECURE_GLOBAL.previous_row = common.commonElementRow(event.target);
                        event.preventDefault();
                        //focus on first list_edit item in the row
                        const element_previous = common.commonElementRow(event.target).previousSibling;
                        /**@ts-ignore */
                        if (element_previous && element_previous.classList?.contains('common_row')){
                            /**@ts-ignore */
                            element_previous.querySelectorAll('.list_edit')[0].focus();
                        }
                    }
                    if (event.code=='ArrowDown') {
                        APP_SECURE_GLOBAL.previous_row = common.commonElementRow(event.target);
                        event.preventDefault();
                        //focus on first list_edit item in the row
                        const element_next = common.commonElementRow(event.target).nextSibling;
                        if (element_next){
                            /**@ts-ignore */
                            element_next.querySelectorAll?element_next.querySelectorAll('.list_edit')[0].focus():null;
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
const appSecureInit = () => {
    //SET GLOBALS
    APP_SECURE_GLOBAL.previous_row= {};

    appSecureMenuShow(1);
};

/**
 * Admin logout
 * @returns {void}
 */
const appLogout = () => {
    common.commonUserLogout().then(() => {
        appSecureGlobalDelete();
        common.commonComponentRemove('secure');
        common.commonDialogueShow('LOGIN_ADMIN');
    });
};
/**
 * Admin login
 * @returns {Promise.<void>}
 */
const appLogin = async () => {
    await common.commonUserLogin(true)
    .then(()=>{
        common.commonComponentRender({
            mountDiv:   'secure',
            data:       null,
            methods:    null,
            path:       '/component/secure.js'})
        .then(()=>{
            common.commonComponentRender({
                mountDiv:   'secure_app_user_account',
                data:       null,
                methods:    null,
                path:       '/common/component/common_user_account.js'})
            .then(()=>{
                COMMON_DOCUMENT.querySelector('#common_user_menu_default_avatar').classList.add('app_role_admin');
                COMMON_DOCUMENT.querySelector('#common_user_menu_logged_in').style.display = 'none';
                COMMON_DOCUMENT.querySelector('#common_user_menu_logged_out').style.display = 'inline-block';
                appSecureInit();
            });
        });
    })
    .catch(()=>common.commonComponentRemove('secure'));
};
/**
 * Event click
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const appEventClick = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click', (/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            appEventClick(event);
        }, true);
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        const list_title = common.commonElementListTitle(event.target);
        common.commonEvent('click',event)
        .then(()=>{
            switch (event_target_id){
                case 'secure_menu_open':{
                    COMMON_DOCUMENT.querySelector('#secure_menu').style.display = 'block';
                    break;
                }
                case 'secure_menu_close': {
                    COMMON_DOCUMENT.querySelector('#secure_menu').style.display = 'none';
                    break;
                }
                case 'secure_menu_1':
                case 'secure_menu_2':
                case 'secure_menu_3':
                case 'secure_menu_4':
                case 'secure_menu_5':
                case 'secure_menu_6':
                case 'secure_menu_7':
                case 'secure_menu_8':
                case 'secure_menu_9':
                case 'secure_menu_10':{
                    appSecureMenuShow(parseInt(event_target_id.substring('secure_menu_'.length)));
                    break;
                }
                case 'secure_menu_11': {
                    appLogout();
                    break;
                }
                case 'common_user_start_login_admin_button':{
                    appLogin();
                    break;
                }
                //common
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
                /**user account */
                case 'common_user_menu':
                case 'common_user_menu_logged_in':
                case 'common_user_menu_avatar':
                case 'common_user_menu_avatar_img':
                case 'common_user_menu_logged_out':
                case 'common_user_menu_default_avatar':{
                    common.commonComponentRender({
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
                                                    admin:common.COMMON_GLOBAL.admin,
                                                    admin_only:common.COMMON_GLOBAL.admin_only,
                                                    user_locale:common.COMMON_GLOBAL.user_locale,
                                                    user_timezone:common.COMMON_GLOBAL.user_timezone,
                                                    user_direction:common.COMMON_GLOBAL.user_direction,
                                                    user_arabic_script:common.COMMON_GLOBAL.user_arabic_script
                                                    },
                                        methods:    {
                                                    commonSelectCurrentValueSet:common.commonSelectCurrentValueSet,
                                                   commonFFB:common.commonFFB,
                                                    commonComponentRender:common.commonComponentRender,
                                                    commonUserSessionCountdown:common.commonUserSessionCountdown,
                                                    commonMessageShow:common.commonMessageShow
                                                    },
                                        path:       '/common/component/common_dialogue_user_menu.js'})

                        .then(()=>common.commonComponentRender(
                                        {mountDiv:  'common_dialogue_user_menu_app_theme',
                                        data:       null,
                                        methods:    {
                                                    commonThemeDefaultList:common.commonThemeDefaultList, 
                                                    commonComponentRender:common.commonComponentRender, 
                                                    app_theme_update:common.commonPreferencesPostMount
                                                    },
                                        path:'/common/component/common_dialogue_user_menu_app_theme.js'}));
                    break;
                }
                default:{
                    appSecureEvents('click', event, event_target_id, list_title);
                    break;
                }
            }
        });
    }
};
/**
 * Event change
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const appEventChange = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('change',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            appEventChange(event);
        });
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        common.commonEvent('change',event)
        .then(()=>appSecureEvents('change', event, event_target_id));
    }
};
/**
 * Event keyup
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const appEventKeyUp = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keyup',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            appEventKeyUp(event);
        });
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        common.commonEvent('keyup',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_user_start_login_admin_username':
                case 'common_user_start_login_admin_password':
                case 'common_user_start_login_admin_password_confirm':{
                    if (event.code === 'Enter') {
                        event.preventDefault();
                        appLogin().catch(()=>null);
                    }
                    break;
                }
                default:
                    appSecureEvents('keyup', event, event_target_id);
                    break;
            }
        });
    }
};
/**
 * Event keydown
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const appEventKeyDown = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keydown',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            appEventKeyDown(event);
        });
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        common.commonEvent('keydown',event)
        .then(()=>{
            appSecureEvents('keydown', event, event_target_id);
        });
    }
};
/**
 * Event input
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const appEventInput = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('input',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            appEventInput(event);
        }, true);
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        common.commonEvent('input',event)
        .then(()=>{
            appSecureEvents('input', event, event_target_id);
        });
    }
};
/**
 * Event focus
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const appEventFocus = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('focus',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            appEventFocus(event);
        }, true);
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        common.commonEvent('focus',event)
        .then(()=>{
            appSecureEvents('focus', event, event_target_id);
        });
    }
};

/**
 * Exception function
 * @param {Error} error
 * @returns {void}
 */
const appException = (error) => {
    common.commonMessageShow('EXCEPTION', null, null, null, error);
};
/**
 * Sets framework
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
const appFrameworkSet = async (framework=null) => {
    common.commonFrameworkSet(framework,
                    {   Click: appEventClick,
                        Change: appEventChange,
                        KeyDown: appEventKeyDown,
                        KeyUp: appEventKeyUp,
                        Focus: appEventFocus,
                        Input:appEventInput})
    .then(()=>{
        if (common.COMMON_GLOBAL.user_account_id ==null && common.COMMON_GLOBAL.admin==null)
            common.commonDialogueShow('LOGIN_ADMIN');
    });                        
};
/**
 * App init
 * @param {{app:import('../../../common_types.js').CommonAppParametersRecord,
 *          app_service:{admin_only:number, first_time:number}}} parameters 
 * @returns {Promise.<void>}
 */
const appInit = async (parameters) => {
    parameters;
    await common.commonComponentRender({  mountDiv:   common.COMMON_GLOBAL.app_div,
                                    data:       null,
                                    methods:    null,
                                    path:       '/component/app.js'});
   appFrameworkSet();
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit= async parameters => {        
    COMMON_DOCUMENT.body.className = 'app_theme1';
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = appLogout;
    
    common.commonInit(parameters).then((/**@type{{  app:import('../../../common_types.js').CommonAppParametersRecord, 
                                                    app_service:{admin_only:number, first_time:number}}}*/decodedparameters)=>{
        appInit(decodedparameters);
    });
};
export { appCommonInit, appSecureDialogueSendBroadcastShow };
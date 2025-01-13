/**
 * Admin app
 * @module apps/admin/app
 */
/**
 * @import {commonInitAppParameters, CommonAppEvent, CommonRESTAPIMethod, CommonModuleCommon, COMMON_DOCUMENT}  from '../../../common_types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const commonPath ='/common/js/common.js';
/**@type {CommonModuleCommon} */
const common = await import(commonPath);

/**
 * App globals
 * @type{{  component: {MENU_MONITOR:{ monitorShow:                function,
 *                                     monitorDetailShowLogDir:    function,
 *                                     monitorDetailShowServerLog: function,
 *                                     monitorDetailPage:          function,
 *                                     monitorDetailClickSort:     function,
 *                                     monitorDetailClickItem:     function
 *                                  },
 *                      MENU_REPORT:{  updateMetadata:             function, 
 *                                     reportRun:                  function, 
 *                                     reportQueueUpdate:          function,
 *                                     reportPreview:              function
 *                                  }
 *                     },
 *          previous_row:{}}}
 */
const APP_SECURE_GLOBAL = {
    component: {MENU_MONITOR : {monitorShow:                ()=>null,
                                monitorDetailShowLogDir:    ()=>null,
                                monitorDetailShowServerLog: ()=>null,
                                monitorDetailPage:          ()=>null,
                                monitorDetailClickSort:     ()=>null,
                                monitorDetailClickItem:     ()=>null
                            },
                MENU_REPORT : { updateMetadata:             ()=>null,
                                reportRun:                  ()=>null,
                                reportQueueUpdate:          ()=>null,
                                reportPreview:              ()=>null
                }
                },
    previous_row:{}
};
Object.seal(APP_SECURE_GLOBAL);

/**
 * @name appSecureGlobalDelete
 * @description Set globals to null
 * @function
 * @returns {void}
 */
const appSecureGlobalDelete = () => {
    APP_SECURE_GLOBAL.component = { MENU_MONITOR: { monitorShow:                ()=>null,
                                                    monitorDetailShowLogDir:    ()=>null,
                                                    monitorDetailShowServerLog: ()=>null,
                                                    monitorDetailPage:          ()=>null,
                                                    monitorDetailClickSort:     ()=>null,
                                                    monitorDetailClickItem:     ()=>null
                                                },
                                    MENU_REPORT: {  updateMetadata:             ()=>null,
                                                    reportRun:                  ()=>null,
                                                    reportQueueUpdate:          ()=>null,
                                                    reportPreview:              ()=>null
                                    }
                            };
    APP_SECURE_GLOBAL.previous_row = {};
};

/**
 * @name appSecureMenuShow
 * @description Show given menu
 * @function
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
                            commonMiscElementRow:common.commonMiscElementRow,
                            commonMiscInputControl:common.commonMiscInputControl,
                            commonComponentRender:common.commonComponentRender,
                            commonWindowUserAgentPlatform:common.commonWindowUserAgentPlatform,
                            commonMiscRoundOff:common.commonMiscRoundOff,
                            commonLovClose:common.commonLovClose,
                            commonLovShow:common.commonLovShow,
                            commonFFB:common.commonFFB,
                            commonMicroserviceGeolocationIp:common.commonMicroserviceGeolocationIp,
                            commonMicroserviceGeolocationPlace:common.commonMicroserviceGeolocationPlace
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
                            commonMiscRoundOff:common.commonMiscRoundOff,
                            commonFFB:common.commonFFB
                            },
                path:       '/component/menu_db_info.js'});
            break;
        }
        //REPORT
        case 9:{
            common.commonComponentRender({
                mountDiv:   'secure_menu_content',
                data:       null,
                methods:    {
                            commonComponentRender:common.commonComponentRender,
                            commonFFB:common.commonFFB
                            },
                path:       '/component/menu_report.js'})
                .then(result=>{
                    APP_SECURE_GLOBAL.component.MENU_REPORT  = result.methods;
                });
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
 * @name appSecureMenuStartChartShow
 * @description Show charts
 * @function
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
 * @name appSecureDialogueSendBroadcastSend
 * @description Broadcast send
 * @function
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
        
        common.commonFFB({path:'/server-socket/message', method:'POST', authorization_type:'ADMIN', body:json_data})
        .then((/**@type{string}*/result)=>{
            if (Number(JSON.parse(result).sent) > 0)
                common.commonMessageShow('INFO', null, null, 'message_success', `(${Number(JSON.parse(result).sent)})`, common.COMMON_GLOBAL.app_id);
            else
                common.commonMessageShow('INFO', null, null, 'message_fail', `(${Number(JSON.parse(result).sent)})`, common.COMMON_GLOBAL.app_id);
        })
        .catch(()=>null);
    }
};    
/**
 * @name appSecureDialogueSendBroadcastClose
 * @description Broadcast close
 * @function
 * @returns{void}
 */
const appSecureDialogueSendBroadcastClose = () => {
    common.commonComponentRemove('dialogue_send_broadcast', true);
};
/**
 * @name appSecureDialogueSendBroadcastShow
 * @description Broadcast send broadcast show
 * @function
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
 * @name appSecureDialogueSendBroadcastBroadcastTypeSet
 * @description Broadcast set type
 * @function
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
 * @name appSecureDialogueSendBroadcastMaintenanceSet
 * @description Maintenance set
 * @function
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
 * @name appSecureMenuUsers
 * @description Renders component menu_users_list
 * @function
 * @param {string} sort 
 * @param {string} order_by 
 * @returns {void}
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
 * @name appSecureCommonButtonSave
 * @description Button save
 *              Saves apps, modules, parameters and secrets
 *              or config or users
 * @function
 * @param {string} item 
 * @returns {Promise.<void>}
 */
const appSecureCommonButtonSave = async (item) => {
    switch (item){
        case 'menu_apps_save':{
            //save changes in menu_apps
            for (const record of COMMON_DOCUMENT.querySelectorAll('.menu_apps_row[data-changed-record=\'1\']')){
                await appSecureCommonRecordUpdate(  'app',
                                                    record,
                                                    item,
                                                    record.querySelector('[data-column=\'id\']').textContent,
                                                    {
                                                        id:             record.querySelector('[data-column=\'id\']').textContent,
                                                        name:           record.querySelector('[data-column=\'name\']').textContent,
                                                        subdomain:      record.querySelector('[data-column=\'subdomain\']').textContent,
                                                        path:           record.querySelector('[data-column=\'path\']').textContent,
                                                        logo:           record.querySelector('[data-column=\'logo\']').textContent,
                                                        showparam:      record.querySelector('[data-column=\'showparam\']').textContent,
                                                        manifest:       record.querySelector('[data-column=\'manifest\']').textContent,
                                                        js:             record.querySelector('[data-column=\'js\']').textContent,
                                                        css:            record.querySelector('[data-column=\'css\']').textContent,
                                                        css_report:     record.querySelector('[data-column=\'css_report\']').textContent,
                                                        favicon_32x32:  record.querySelector('[data-column=\'favicon_32x32\']').textContent,
                                                        favicon_192x192:record.querySelector('[data-column=\'favicon_192x192\']').textContent,
                                                        status:         record.querySelector('[data-column=\'status\']').textContent
                                                    });
            }
            
            if (COMMON_DOCUMENT.querySelector('#menu_apps_detail_parameter.list_nav_selected_tab'))
                //save changes in menu_apps_parameters
                for (const record of COMMON_DOCUMENT.querySelectorAll('.menu_apps_detail_row[data-changed-record=\'1\']')){
                    await appSecureCommonRecordUpdate(  'app_parameter',
                                                        record,
                                                        item,
                                                        record.querySelector('[data-column=\'app_id\']').textContent,
                                                        {   parameter_name:     record.querySelector('[data-column=\'name\']').textContent,
                                                            parameter_value:    record.querySelector('[data-column=\'value\']').textContent,
                                                            parameter_comment:  record.querySelector('[data-column=\'comment\']').textContent
                                                        });
                }
            if (COMMON_DOCUMENT.querySelector('#menu_apps_detail_secret.list_nav_selected_tab'))
                //save changes in menu_apps_secret
                for (const record of COMMON_DOCUMENT.querySelectorAll('.menu_apps_detail_row[data-changed-record=\'1\']')){
                    await appSecureCommonRecordUpdate(  'app_secret',
                                                        record,
                                                        item,
                                                        record.querySelector('[data-column=\'app_id\']').textContent,
                                                        {   parameter_name:     record.querySelector('[data-column=\'name\']').textContent,
                                                            parameter_value:    record.querySelector('[data-column=\'value\']').textContent
                                                        });
                }
            if (COMMON_DOCUMENT.querySelector('#menu_apps_detail_module.list_nav_selected_tab'))
                //save changes in menu_apps_module
                for (const record of COMMON_DOCUMENT.querySelectorAll('.menu_apps_detail_row[data-changed-record=\'1\']')){
                    await appSecureCommonRecordUpdate(  'app_module',
                                                        record,
                                                        item,
                                                        record.querySelector('[data-column=\'id\']').textContent,
                                                        {   app_id:             record.querySelector('[data-column=\'app_id\']').textContent,
                                                            common_type:        record.querySelector('[data-column=\'common_type\']').textContent,
                                                            common_name:        record.querySelector('[data-column=\'common_name\']').textContent,
                                                            common_role:        record.querySelector('[data-column=\'common_role\']').textContent,
                                                            common_path:        record.querySelector('[data-column=\'common_path\']').textContent,
                                                            common_description: record.querySelector('[data-column=\'common_description\']').textContent
                                                        });
                }
            break;
        }
        case 'menu_users_save':{
            //save changes in menu_users_list
            for (const record of COMMON_DOCUMENT.querySelectorAll('.menu_users_list_row[data-changed-record=\'1\']')){
                await appSecureCommonRecordUpdate(  'user_account',
                                                    record,
                                                    item,
                                                    record.querySelector('[data-column=\'id\']').textContent,
                                                    {   active:             record.querySelector('[data-column=\'active\']').textContent,
                                                        user_level:         record.querySelector('[data-column=\'user_level\']').textContent,
                                                        private:            record.querySelector('[data-column=\'private\']').textContent,
                                                        username:           record.querySelector('[data-column=\'username\']').textContent,
                                                        bio:                record.querySelector('[data-column=\'bio\']').textContent,
                                                        email:              record.querySelector('[data-column=\'email\']').textContent,
                                                        email_unverified:   record.querySelector('[data-column=\'email_unverified\']').textContent,
                                                        password:           record.querySelector('[data-column=\'password\']').textContent,
                                                        password_reminder:  record.querySelector('[data-column=\'password_reminder\']').textContent,
                                                        verification_code:  record.querySelector('[data-column=\'verification_code\']').textContent
                                                    });
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
            //file:'CONFIG_SERVER', 'CONFIG_IAM_POLICY', 'CONFIG_MICROSERVICE', 'CONFIG_MICROSERVICE_SERVICES'
            const json_data = { config:    file=='CONFIG_SERVER'?
                                                config_server():
                                                    JSON.parse(COMMON_DOCUMENT.querySelector('#menu_config_detail_edit').textContent)};

            common.commonFFB({path:`/server-config/config/${file}`, method: 'PUT', authorization_type:'ADMIN', body:json_data, spinner_id:item});
            break;
        }
    }
};
/**
 * @name appSecureCommonRecordUpdate
 * @description Updates record
 * @function
 * @param {'user_account'|'app'|'app_parameter'|'app_secret'|'app_module'} table 
 * @param {HTMLElement} row_element 
 * @param {string} button 
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<void>}
 */
const appSecureCommonRecordUpdate = async ( table, 
                                            row_element,
                                            button,
                                            resource_id,
                                            data) => {
    let path = '';
    /**@type{CommonRESTAPIMethod} */
    let method;
    switch (table){
        case 'user_account':{
            path = `/server-db_admin/user_account/${resource_id}`;
            method = 'PATCH';
            break;
        }
        case 'app':{
            path = `/app-common-app/${resource_id}`;
            method = 'PUT';
            break;
        }
        case 'app_module':{
            path = `/app-common-app-module/${resource_id}`;
            method = 'PUT';
            break;
        }
        case 'app_parameter':{
            path = `/app-common-app-parameter/${resource_id}`;
            method = 'PATCH';
            break;
        }
        case 'app_secret':{
            path = `/app-common-app-secret/${resource_id}`;
            method = 'PATCH';
            break;
        }
    }
    await common.commonFFB({path:path, method:method, authorization_type:'ADMIN', body:data, spinner_id:button})
            .then(()=>row_element.setAttribute('data-changed-record', '0'));
};


/**
 * @name appSecureMenuInstallationDbInstallationFunction
 * @description Executes installation rest API and presents the result
 * @function
 * @param {string} id 
 * @param {boolean|null} db_icon 
 * @param {string} path 
 * @param {CommonRESTAPIMethod} method 
 * @param {{demo_password?:string}|null} data 
 * @returns {void}
 */
const appSecureMenuInstallationDbInstallationFunction = (id, db_icon, path, method, data) => {
    common.commonFFB({path:path, method:method, authorization_type:'ADMIN', body:data, spinner_id:id})
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
 * @name appSecureMenuInstallationDbInstall
 * @description Installs DB
 * @function
 * @returns {void}
 */
const appSecureMenuInstallationDbInstall = () =>{
    common.commonComponentRemove('common_dialogue_message');
    appSecureMenuInstallationDbInstallationFunction('menu_installation_db_button_install', 
                                                    true, 
                                                    '/server-db_admin/database', 
                                                    'POST', 
                                                    null);
};
/**
 * @name appSecureMenuInstallationDbUninstall
 * @description Uninstalls DB
 * @function
 * @returns {void}
 */
const appSecureMenuInstallationDbUninstall = () =>{
    common.commonComponentRemove('common_dialogue_message');
    appSecureMenuInstallationDbInstallationFunction('menu_installation_db_button_uninstall', 
                                                    false, 
                                                    '/server-db_admin/database', 
                                                    'DELETE', 
                                                    null);
};
/**
 * @name appSecureMenuInstallationDemoInstall
 * @description Installs Demo data
 * @function
 * @returns {void}
 */
const appSecureMenuInstallationDemoInstall = () =>{
    if (common.commonMiscInputControl(null,
                        {
                            check_valid_list_elements:[[COMMON_DOCUMENT.querySelector('#menu_installation_demo_password'),null]]
                        })==true){
        const json_data = { demo_password: COMMON_DOCUMENT.querySelector('#menu_installation_demo_password').textContent};
        appSecureMenuInstallationDbInstallationFunction(  'menu_installation_demo_button_install', null, 
                                '/server-db_admin/database-demo', 
                                'POST', 
                                json_data);
    }
};
/**
 * @name appSecureMenuInstallationDemoUninstall
 * @description Uninstalls Demo data
 * @function
 * @returns {void}
 */
const appSecureMenuInstallationDemoUninstall = () =>{
    appSecureMenuInstallationDbInstallationFunction(  'menu_installation_demo_button_uninstall', null, 
                            '/server-db_admin/database-demo', 
                            'DELETE', 
                            null);
};

/**
 * @name appSecureEvents
 * @description App events
 * @function
 * @param {string} event_type 
 * @param {CommonAppEvent} event 
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
                                    APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorDetailShowServerLog(0,'logdate', 'desc');
                                    break;
                                }
                                case 'menu_monitor_connected':{
                                    COMMON_DOCUMENT.querySelector('#menu_monitor_connected').click();
                                    break;
                                }
                                case 'menu_monitor_app_data_stat':{
                                    COMMON_DOCUMENT.querySelector('#menu_monitor_app_data_stat').click();
                                    break;
                                }
                                default:{
                                    break;
                                }
                            }
                        }
                    if( event_target_id == 'menu_monitor_detail_select_logscope')
                        APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorDetailShowServerLog(0,'logdate', 'desc');
                    if( event_target_id == 'menu_report_select_report')
                        APP_SECURE_GLOBAL.component.MENU_REPORT.updateMetadata();
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
                case 'menu_apps_detail_parameter':
                case 'menu_apps_detail_secret':
                case 'menu_apps_detail_module':{
                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab').classList.remove('list_nav_selected_tab');
                    COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('list_nav_selected_tab');
                    common.commonComponentRender({
                        mountDiv:   'menu_apps_detail',
                        data:       {
                                    app_id_data:parseInt(common.commonMiscElementRow(APP_SECURE_GLOBAL.previous_row).getAttribute('data-app_id') ?? ''),
                                    detail:event_target_id,
                                    },
                        methods:    {commonFFB:common.commonFFB},
                        path:       '/component/menu_apps_detail.js'});
                    break;
                }
                case 'menu_monitor_detail_filesearch':{
                    APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorDetailShowLogDir();
                    break;
                }
                case 'menu_monitor_detail_server_log_search_icon':{
                    COMMON_DOCUMENT.querySelector('#menu_monitor_detail_server_log_search_input').focus();
                    APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorDetailShowServerLog(0, 'logdate','desc');
                    break;
                }
                case 'menu_monitor_connected':{
                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab')?.classList.remove('list_nav_selected_tab');
                    COMMON_DOCUMENT.querySelector('#menu_monitor_connected').classList.add('list_nav_selected_tab');
                    APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorShow('CONNECTED', '', 'connection_date', 'desc');
                    break;
                }
                case 'menu_monitor_app_data_stat':{
                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab')?.classList.remove('list_nav_selected_tab');
                    COMMON_DOCUMENT.querySelector('#menu_monitor_app_data_stat').classList.add('list_nav_selected_tab');
                    APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorShow('APP_DATA_STAT', 0, 'date_created', 'desc');
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
                case 'menu_report_run':{
                    APP_SECURE_GLOBAL.component.MENU_REPORT.reportRun();
                    break;
                }
                case 'menu_report_queue_reload':{
                    APP_SECURE_GLOBAL.component.MENU_REPORT.reportQueueUpdate();
                    break;
                }
                case event.target?.classList.contains('report_queue_result')?event_target_id:'':
                    APP_SECURE_GLOBAL.component.MENU_REPORT.reportPreview(event.target.getAttribute('data-id'));
                    break;
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
                    if (APP_SECURE_GLOBAL.previous_row != common.commonMiscElementRow(event.target)){
                        APP_SECURE_GLOBAL.previous_row = common.commonMiscElementRow(event.target);
                        COMMON_DOCUMENT.querySelector('#menu_apps_detail_parameter').click();
                    }
                    break;
                }
                case 'menu_users_list':{
                    //event on master to automatically show detail records
                    if (APP_SECURE_GLOBAL.previous_row != common.commonMiscElementRow(event.target)){
                        APP_SECURE_GLOBAL.previous_row = common.commonMiscElementRow(event.target);
                        common.commonComponentRender({
                            mountDiv:   'menu_users_iam_user_login',
                            data:       {user_account_id:parseInt(common.commonMiscElementRow(event.target).getAttribute('data-user_account_id') ?? '')},
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
                common.commonMiscElementRow(event.target).setAttribute('data-changed-record','1');
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
                        common.commonMiscTypewatch(appSecureMenuUsers, 'username', 'asc');
                    break;
                }
                case 'menu_monitor_detail_server_log_search_input':{
                    if (!event.code.startsWith('Arrow') && 
                        event.code != 'Home' && 
                        event.code != 'End' &&
                        event.code != 'PageUp' &&
                        event.code != 'PageDown')
                        common.commonMiscTypewatch(APP_SECURE_GLOBAL.component.MENU_MONITOR.monitorDetailShowServerLog, 0, 'logdate', 'desc');
                    break;
                }
            }
            break;
        }
        case 'keydown':{
            if (event.target.classList.contains('list_edit')){
                if (event.code=='ArrowUp') {
                    APP_SECURE_GLOBAL.previous_row = common.commonMiscElementRow(event.target);
                    event.preventDefault();
                    //focus on first list_edit item in the row
                    const element_previous = common.commonMiscElementRow(event.target).previousSibling;
                    /**@ts-ignore */
                    if (element_previous && element_previous.classList?.contains('common_row')){
                        /**@ts-ignore */
                        element_previous.querySelectorAll('.list_edit')[0].focus();
                    }
                }
                if (event.code=='ArrowDown') {
                    APP_SECURE_GLOBAL.previous_row = common.commonMiscElementRow(event.target);
                    event.preventDefault();
                    //focus on first list_edit item in the row
                    const element_next = common.commonMiscElementRow(event.target).nextSibling;
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
 * @name appSecureInit
 * @description Init secure
 * @function
 * @returns {void}
 */
const appSecureInit = () => {
    //SET GLOBALS
    APP_SECURE_GLOBAL.previous_row= {};

    appSecureMenuShow(1);
};

/**
 * @name appLogout
 * @description App logout
 * @function
 * @returns {void}
 */
const appLogout = () => {
    common.commonUserLogout().then(() => {
        appSecureGlobalDelete();
        common.commonComponentRemove('app');
        common.commonDialogueShow('LOGIN_ADMIN');
    });
};
/**
 * @name appLogin
 * @description Admin login
 * @function
 * @returns {Promise.<void>}
 */
const appLogin = async () => {
    await common.commonUserLogin(true)
    .then(result=>{
        common.commonComponentRender({
            mountDiv:   'app',
            data:       null,
            methods:    null,
            path:       '/component/secure.js'})
        .then(()=>{
            common.commonComponentRender({
                mountDiv:   'secure_app_user_account',
                data:       null,
                methods:    null,
                path:       '/common/component/common_iam_avatar.js'})
            .then(()=>{
                COMMON_DOCUMENT.querySelector('#common_iam_avatar_avatar_img').style.backgroundImage= (result.avatar ?? null)?
                                                                                                    `url('${result.avatar ?? null}')`:
                                                                                                    'url()';
                COMMON_DOCUMENT.querySelector('#common_iam_avatar_logged_in').style.display = 'inline-block';
                COMMON_DOCUMENT.querySelector('#common_iam_avatar_logged_out').style.display = 'none';

                appSecureInit();
            });
        });
    })
    .catch(()=>common.commonComponentRemove('secure'));
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
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click', (/**@type{CommonAppEvent}*/event) => {
            appEventClick(event);
        }, true);
    }
    else{
        const event_target_id = common.commonMiscElementId(event.target);
        const list_title = common.commonMiscElementListTitle(event.target);
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
                case 'common_dialogue_iam_start_login_admin_button':{
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
                case 'common_iam_avatar':
                case 'common_iam_avatar_logged_in':
                case 'common_iam_avatar_avatar':
                case 'common_iam_avatar_avatar_img':
                case 'common_iam_avatar_logged_out':
                case 'common_iam_avatar_default_avatar':{
                    common.commonComponentRender(
                                        {mountDiv:  'common_dialogue_user_menu_app_theme',
                                        data:       null,
                                        methods:    {
                                                    commonMiscThemeDefaultList:common.commonMiscThemeDefaultList, 
                                                    commonComponentRender:common.commonComponentRender, 
                                                    app_theme_update:common.commonMiscPreferencesPostMount
                                                    },
                                        path:'/common/component/common_dialogue_user_menu_app_theme.js'});
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
 * @name appEventChange
 * @description App event change
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventChange = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('change',(/**@type{CommonAppEvent}*/event) => {
            appEventChange(event);
        });
    }
    else{
        const event_target_id = common.commonMiscElementId(event.target);
        common.commonEvent('change',event)
        .then(()=>appSecureEvents('change', event, event_target_id));
    }
};
/**
 * @name appEventKeyUp
 * @description App event keyup
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventKeyUp = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keyup',(/**@type{CommonAppEvent}*/event) => {
            appEventKeyUp(event);
        });
    }
    else{
        const event_target_id = common.commonMiscElementId(event.target);
        common.commonEvent('keyup',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_dialogue_iam_start_login_admin_username':
                case 'common_dialogue_iam_start_login_admin_password':
                case 'common_dialogue_iam_start_login_admin_password_confirm':{
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
 * @name appEventKeyDown
 * @description App event keydown
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventKeyDown = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keydown',(/**@type{CommonAppEvent}*/event) => {
            appEventKeyDown(event);
        });
    }
    else{
        const event_target_id = common.commonMiscElementId(event.target);
        common.commonEvent('keydown',event)
        .then(()=>{
            appSecureEvents('keydown', event, event_target_id);
        });
    }
};
/**
 * @name appEventInput
 * @description App event input
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventInput = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('input',(/**@type{CommonAppEvent}*/event) => {
            appEventInput(event);
        }, true);
    }
    else{
        const event_target_id = common.commonMiscElementId(event.target);
        common.commonEvent('input',event)
        .then(()=>{
            appSecureEvents('input', event, event_target_id);
        });
    }
};
/**
 * @name appEventFocus
 * @description App event focus
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventFocus = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('focus',(/**@type{CommonAppEvent}*/event) => {
            appEventFocus(event);
        }, true);
    }
    else{
        const event_target_id = common.commonMiscElementId(event.target);
        common.commonEvent('focus',event)
        .then(()=>{
            appSecureEvents('focus', event, event_target_id);
        });
    }
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
 * @name appFrameworkSet
 * @description Sets framework
 * @function
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
                        Input:appEventInput});
};
/**
 * @name appInit
 * @description App init
 * @function
 * @param {commonInitAppParameters} parameters 
 * @returns {Promise.<void>}
 */
const appInit = async (parameters) => {
    parameters;
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
    await common.commonDialogueShow('LOGIN_ADMIN');
};    
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {string} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit = async parameters => {        
    COMMON_DOCUMENT.body.className = 'app_theme1';
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = appLogout;
    
    common.commonInit(parameters).then(decodedparameters=>{
        appInit(decodedparameters);
    });
};
export { appCommonInit, appSecureDialogueSendBroadcastShow };
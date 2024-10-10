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
 * @type{{  page_navigation:function, 
 *          monitor_detail_server_log:function, 
 *          limit:number, 
 *          previous_row:{}, 
 *          moduleLeafletDiv:*, 
 *          service_log_file_interval:string}}
 */
const APP_GLOBAL = {
    page_navigation:()=>null,
    monitor_detail_server_log:()=>null,
    limit:0,
    previous_row:{},
    moduleLeafletDiv:'',
    service_log_file_interval:''
};
Object.seal(APP_GLOBAL);
/**
 * Set globals to null
 * @returns {void}
 */
const delete_globals = () => {
    APP_GLOBAL.page_navigation = ()=>null,
    APP_GLOBAL.monitor_detail_server_log = ()=>null,
    APP_GLOBAL.limit = 0;
    APP_GLOBAL.previous_row = {};
    APP_GLOBAL.moduleLeafletDiv = '';
    APP_GLOBAL.service_log_file_interval = '';
};

/**
 * Show given menu
 * @param {number} menu 
 * @returns {void}
 */
const show_menu = menu => {
    COMMON_DOCUMENT.querySelectorAll('.menuitem').forEach((/**@type{HTMLElement}*/content) =>content.classList.remove('menuitem_selected'));
    COMMON_DOCUMENT.querySelector(`#menu_${menu}`).classList.add('menuitem_selected');

    switch(menu){
        //START
        case 1:{
            common.commonComponentRender({mountDiv:   'menu_content',
                                    data:       {system_admin:common.COMMON_GLOBAL.system_admin},
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
                mountDiv:   'menu_content',
                data:       null,
                methods:    {commonFFB:common.commonFFB},
                path:       '/component/menu_user_stat.js'});
            break;    
        }
        //USERS
        case 3:{
            common.commonComponentRender({
                mountDiv:   'menu_content',
                data:       null,
                methods:    null,
                path:       '/component/menu_users.js'})
            .then(()=>search_users());
            break;
        }
        //APP ADMIN
        case 4:{
            common.commonComponentRender({
                mountDiv:   'menu_content',
                data:       null,
                methods:    {commonFFB:common.commonFFB},
                path:       '/component/menu_apps.js'});
            break;    
        }
        //MONITOR
        case 5:{
            common.commonComponentRender({
                mountDiv:   'menu_content',
                data:       {
                            app_id:common.COMMON_GLOBAL.app_id, 
                            system_admin:common.COMMON_GLOBAL.system_admin
                            },
                methods:    {
                            map_mount:map_mount,
                            commonComponentRender:common.commonComponentRender,
                            commonFFB:common.commonFFB
                            },
                path:       '/component/menu_monitor.js'})
            .then((/**@type{{data:{limit:number}, methods:null}}*/result)=>{
                APP_GLOBAL.limit = result.data.limit;
                COMMON_DOCUMENT.querySelector('#list_monitor_nav_connected').click();
            });
            break;
        }
        //SERVER CONFIG
        case 6:{
            common.commonComponentRender({
                mountDiv:   'menu_content',
                data:       null,
                methods:    {nav_click:nav_click},
                path:       '/component/menu_config.js'});
            break;
        }
        //INSTALLATION
        case 7:{
            common.commonComponentRender({
                mountDiv:   'menu_content',
                data:       {system_admin:common.COMMON_GLOBAL.system_admin},
                methods:    {commonFFB:common.commonFFB},
                path:       '/component/menu_installation.js'});
            break;
        }
        //DATABASE
        case 8:{
            common.commonComponentRender({
                mountDiv:   'menu_content',
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
                mountDiv:   'menu_content',
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
        mountDiv:   'graphBox',
        data:       {system_admin:common.COMMON_GLOBAL.system_admin},
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
    const broadcast_message = COMMON_DOCUMENT.querySelector('#send_broadcast_message').textContent;

    if (broadcast_message==''){
        common.commonMessageShow('INFO', null, null, 'message_text', '!', common.COMMON_GLOBAL.app_id);
    }
    else{
        if (COMMON_DOCUMENT.querySelector('#client_id').textContent==''){
            app_id = COMMON_DOCUMENT.querySelector('#select_app_broadcast .common_select_dropdown_value').getAttribute('data-value');
            client_id = '';
            broadcast_type = COMMON_DOCUMENT.querySelector('#select_broadcast_type .common_select_dropdown_value').getAttribute('data-value');
        }
        else{
            client_id = COMMON_DOCUMENT.querySelector('#client_id').textContent;
            app_id = '';
            broadcast_type = 'CHAT';
        }
            
        const json_data ={  app_id:             app_id==''?null:app_id,
                            client_id:          client_id==''?null:client_id,
                            client_id_current:  common.COMMON_GLOBAL.service_socket_client_ID,
                            broadcast_type:     broadcast_type, 
                            broadcast_message:  common.commonWindowToBase64(broadcast_message)};
        let path='';
        /**@type{import('../../../common_types.js').CommonRESTAPIAuthorizationType}*/
        let token_type;
        if (common.COMMON_GLOBAL.system_admin!=null){
            path = '/server-socket/message';
            token_type = 'SYSTEMADMIN';
        }
        else{
            path = '/server-socket/message';
            token_type = 'APP_ACCESS';
        }
        common.commonFFB({path:path, method:'POST', authorization_type:token_type, body:json_data})
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
        data:           {system_admin:common.COMMON_GLOBAL.system_admin},
        methods:        {
                        commonComponentRender:common.commonComponentRender,
                        commonFFB:common.commonFFB
                        },
        path:           '/component/dialogue_send_broadcast.js'})
    .then(()=>{
        switch (dialogue_type){
            case 'CHAT':{
                //hide and set INFO, should not be able to send MAINTENANCE message here
                COMMON_DOCUMENT.querySelector('#select_broadcast_type').style.display='none';
                //hide app selection
                COMMON_DOCUMENT.querySelector('#select_app_broadcast').style.display='none';
                //show client id
                COMMON_DOCUMENT.querySelector('#client_id_label').style.display = 'inline-block';
                COMMON_DOCUMENT.querySelector('#client_id').style.display = 'inline-block';
                COMMON_DOCUMENT.querySelector('#client_id').textContent = client_id;
                break;
            }
            case 'APP':{
                //hide and set INFO, should not be able to send MAINTENANCE message here
                COMMON_DOCUMENT.querySelector('#select_broadcast_type').style.display='none';
                //show app selection
                COMMON_DOCUMENT.querySelector('#select_app_broadcast').style.display='block';
                //hide client id
                COMMON_DOCUMENT.querySelector('#client_id_label').style.display = 'none';
                COMMON_DOCUMENT.querySelector('#client_id').style.display = 'none';
                COMMON_DOCUMENT.querySelector('#client_id').textContent = '';
                break;
            }
            case 'ALL':{
                //show broadcast type and INFO
                COMMON_DOCUMENT.querySelector('#select_broadcast_type').style.display='inline-block';
                //show app selection
                COMMON_DOCUMENT.querySelector('#select_app_broadcast').style.display='block';
                //hide client id
                COMMON_DOCUMENT.querySelector('#client_id_label').style.display = 'none';
                COMMON_DOCUMENT.querySelector('#client_id').style.display = 'none';
                COMMON_DOCUMENT.querySelector('#client_id').textContent = '';
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
    switch (COMMON_DOCUMENT.querySelector('#select_broadcast_type .common_select_dropdown_value').getAttribute('data-value')){
        case 'ALERT':{
            //show app selection
            COMMON_DOCUMENT.querySelector('#select_app_broadcast').style.display='block';
            //hide client id
            COMMON_DOCUMENT.querySelector('#client_id_label').style.display = 'none';
            COMMON_DOCUMENT.querySelector('#client_id').style.display = 'none';
            COMMON_DOCUMENT.querySelector('#client_id').textContent = '';
            break;
        }
        case 'MAINTENANCE':{
            //hide app selection
            COMMON_DOCUMENT.querySelector('#select_app_broadcast').style.display='none';
            //hide client id
            COMMON_DOCUMENT.querySelector('#client_id_label').style.display = 'none';
            COMMON_DOCUMENT.querySelector('#client_id').style.display = 'none';
            COMMON_DOCUMENT.querySelector('#client_id').textContent = '';
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
    if (COMMON_DOCUMENT.querySelector('#menu_1_checkbox_maintenance').classList.contains('checked'))
        check_value = 1;
    else
        check_value = 0;
    const json_data = {maintenance:check_value};
    common.commonFFB({path:'/server-config/config/CONFIG_SERVER', method:'PUT', authorization_type:'SYSTEMADMIN', body:json_data}).catch(()=>null);
};
/**
 * 
 * @param {string} sort 
 * @param {string} order_by 
 * @returns 
 */
const search_users = (sort='username', order_by='asc') => {
    common.commonComponentRender({
        mountDiv:   'list_user_account',
        data:       {
                    user_account_id:common.COMMON_GLOBAL.user_account_id,
                    user_app_role_id:common.COMMON_GLOBAL.user_app_role_id,
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
        case 'apps_save':{
            //save changes in list_apps
            let x = COMMON_DOCUMENT.querySelectorAll('.list_apps_row');
            for (const record of x){
                if (record.getAttribute('data-changed-record')=='1'){
                    await update_record('app',
                                        record,
                                        item,
                                        {   user_account:{  id:0,
                                                            app_role_id:0,
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
            //save changes in list_app_parameter
            x = COMMON_DOCUMENT.querySelectorAll('.list_app_parameter_row');
            for (const record of x){
                if (record.getAttribute('data-changed-record')=='1'){
                    await update_record('app_parameter',
                                        record,
                                        item,
                                        {   user_account:{  id:0,
                                                            app_role_id:0,
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
        case 'users_save':{
            //save changes in list_user_account
            const x = COMMON_DOCUMENT.querySelectorAll('.list_user_account_row');
            for (const record of x){
                if (record.getAttribute('data-changed-record')=='1'){
                    await update_record('user_account',
                                        record,
                                        item,
                                        {   user_account:{  id:record.children[1].children[0].textContent,
                                                            app_role_id:record.children[2].children[0].textContent,
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
        case 'config_save':{
            const config_server = () => {
                /**@type{object} */
                let config_server = {};
                COMMON_DOCUMENT.querySelectorAll('#list_config .list_config_group').forEach((/**@type{HTMLElement}*/config_group_element) => 
                    {
                        const config_group  = {
                                                [config_group_element.querySelector('.list_config_group_title div')?.textContent ?? '']:
                                                        Array.from(config_group_element.querySelectorAll('.list_config_row')).map(config_group_row => 
                                                            {
                                                                return {
                                                                    [config_group_row.querySelectorAll('.list_config_col div')[0].textContent ?? '']:
                                                                                config_group_row.querySelectorAll('.list_config_col div')[1].textContent,
                                                                    COMMENT:    config_group_row.querySelectorAll('.list_config_col div')[2].textContent ?? ''
                                                                };
                                                            }
                                                        )
                                            };
                        config_server = {...config_server, ...config_group};
                    }
                );
                return config_server;
            };
            const file = COMMON_DOCUMENT.querySelectorAll('#menu_content .list_nav .list_nav_selected_tab')[0].id.substring('list_config_nav_'.length).toUpperCase();
            //file:'CONFIG_SERVER', 'CONFIG_APPS', 'CONFIG_IAM_BLOCKIP', 'CONFIG_IAM_POLICY', 'CONFIG_IAM_USERAGENT', 'CONFIG_IAM_USER', 'CONFIG_MICROSERVICE', 'CONFIG_MICROSERVICE_SERVICES'
            const json_data = { config:    file=='CONFIG_SERVER'?
                                                config_server():
                                                    JSON.parse(COMMON_DOCUMENT.querySelector('#list_config_edit').textContent)};

            common.commonFFB({path:`/server-config/config/${file}`, method: 'PUT', authorization_type:'SYSTEMADMIN', body:json_data, spinner_id:item});
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
 *                          app_role_id:number,
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
    /**@type{import('../../../common_types.js').CommonRESTAPIAuthorizationType}*/
    let token_type;
    /**@type{import('../../../common_types.js').CommonRESTAPIMethod} */
    let method;
    switch (table){
        case 'user_account':{
            json_data = {   app_role_id:        parameters.user_account.app_role_id,
                            active:             parameters.user_account.active,
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
            token_type = 'SUPERADMIN';
            method = 'PATCH';
            break;
        }
        case 'app':{
            json_data = {   
                            app_category_id:parameters.app.app_category_id
                        };
            path = `/server-db_admin/apps/${parameters.app.id}`;
            token_type = 'APP_ACCESS';
            method = 'PUT';
            break;
        }
        case 'app_parameter':{
            json_data = {   parameter_name:     parameters.app_parameter.parameter_name,
                            parameter_value:    parameters.app_parameter.parameter_value,
                            parameter_comment:  parameters.app_parameter.parameter_comment};
            path = `/server-config/config-apps-parameter/${parameters.app_parameter.app_id}`;
            token_type = 'APP_ACCESS';
            method = 'PATCH';
            break;
        }
    }
    await common.commonFFB({path:path, method:method, authorization_type:token_type, body:json_data, spinner_id:button})
            .then(()=>row_element.setAttribute('data-changed-record', '0'));
};
/**
 * Mounts map in monitor component
 */
const map_mount = () =>{
    //show map only for this condition
    if (common.COMMON_GLOBAL.system_admin_only != 1)
        common.commonModuleLeafletInit(APP_GLOBAL.moduleLeafletDiv,
                        common.COMMON_GLOBAL.client_longitude,
                        common.COMMON_GLOBAL.client_latitude,
                        null).then(() => {
            common.COMMON_GLOBAL.moduleLeaflet.methods.map_update({ longitude:common.COMMON_GLOBAL.client_longitude,
                                latitude:common.COMMON_GLOBAL.client_latitude,
                                text_place:common.COMMON_GLOBAL.client_place,
                                country:'',
                                city:'',
                                timezone_text :null
                            });
        });
};

/**
 * Navigation click
 * @param {string} item_id 
 * @returns{void}
 */
const nav_click = (item_id) => {
    const reset_config = () => {
        COMMON_DOCUMENT.querySelector('#list_config_nav_config_server').classList.remove('list_nav_selected_tab');
        COMMON_DOCUMENT.querySelector('#list_config_nav_config_iam_blockip').classList.remove('list_nav_selected_tab');
        COMMON_DOCUMENT.querySelector('#list_config_nav_config_iam_useragent').classList.remove('list_nav_selected_tab');
        COMMON_DOCUMENT.querySelector('#list_config_nav_config_iam_policy').classList.remove('list_nav_selected_tab');
    };
    
    switch (item_id){
        //SERVER CONFIG
        case 'list_config_nav_config_server':{
            reset_config();
            COMMON_DOCUMENT.querySelector('#list_config_nav_config_server').classList.add('list_nav_selected_tab');
            common.commonComponentRender({
                mountDiv:       'list_config_container',
                data:           {file:'CONFIG_SERVER'},
                methods:        {commonFFB:common.commonFFB},
                path:           '/component/menu_config_detail.js'});
            break;
        }
        case 'list_config_nav_config_iam_blockip':{
            reset_config();
            COMMON_DOCUMENT.querySelector('#list_config_nav_config_iam_blockip').classList.add('list_nav_selected_tab');
            common.commonComponentRender({
                mountDiv:       'list_config_container',
                data:           {file:'CONFIG_IAM_BLOCKIP'},
                methods:        {commonFFB:common.commonFFB},
                path:           '/component/menu_config_detail.js'});
            break;
        }
        case 'list_config_nav_config_iam_useragent':{
            reset_config();
            COMMON_DOCUMENT.querySelector('#list_config_nav_config_iam_useragent').classList.add('list_nav_selected_tab');
            common.commonComponentRender({
                mountDiv:       'list_config_container',
                data:           {file:'CONFIG_IAM_USERAGENT'},
                methods:        {commonFFB:common.commonFFB},
                path:           '/component/menu_config_detail.js'});
            break;
        }
        case 'list_config_nav_config_iam_policy':{
            reset_config();
            COMMON_DOCUMENT.querySelector('#list_config_nav_config_iam_policy').classList.add('list_nav_selected_tab');
            common.commonComponentRender({
                mountDiv:       'list_config_container',
                data:           {file:'CONFIG_IAM_POLICY'},
                methods:        {commonFFB:common.commonFFB},
                path:           '/component/menu_config_detail.js'});
            break;
        }
    }
};
/**
 * Show list
 * @param {'CONNECTED'|'APP_LOG'|'SERVER_LOG'} list_detail
 * @param {string} query
 * @param {string} sort 
 * @param {string} order_by 
 */
const monitorDetailShow = async (list_detail, query, sort, order_by) => {
    common.commonComponentRender({
        mountDiv:   'list_monitor',
        data:       {
                    app_id:common.COMMON_GLOBAL.app_id,
                    system_admin:common.COMMON_GLOBAL.system_admin,
                    monitor_detail:list_detail,
                    query:query,
                    sort:sort,
                    order_by:order_by,
                    service_socket_client_ID:common.COMMON_GLOBAL.service_socket_client_ID,
                    limit:APP_GLOBAL.limit
                    },
        methods:    {
                    get_log_parameters:get_log_parameters,
                    show_app_log:show_app_log,
                    commonInputControl:common.commonInputControl,
                    commonComponentRender:common.commonComponentRender,
                    commonWindowUserAgentPlatform:common.commonWindowUserAgentPlatform,
                    commonRoundOff:common.commonRoundOff,
                    commonFFB:common.commonFFB
                    },
        path:       '/component/menu_monitor_detail.js'})
    .then((/**@type{{   data:null, 
                        methods:{page_navigation:function, monitor_detail_server_log:function}}}*/result)=>{
        APP_GLOBAL.page_navigation = result.methods.page_navigation;
        APP_GLOBAL.monitor_detail_server_log = result.methods.monitor_detail_server_log;
    });
};

/**
 * Show app log
 * @param {string} sort 
 * @param {string} order_by
 * @param {number} offset 
 * @returns{Promise.<void>}
 */
const show_app_log = async (sort='date_created', order_by='desc', offset=0) => {
    monitorDetailShow('APP_LOG', 
              `&offset=${offset}`, 
              sort,
              order_by);
};
/**
 * List sort click
 * @param {string} list 
 * @param {string} sortcolumn 
 * @param {string} order_by 
 * @returns {void}
 */
const list_sort_click = (list, sortcolumn, order_by) => {
    switch (list){
        case 'list_app_log':{
            show_app_log(sortcolumn, order_by);    
            break;
        }
        case 'list_connected':{
            monitorDetailShow('CONNECTED', 
                '', 
                sortcolumn,
                order_by);
            break;
        }
        case 'list_server_log':{
            APP_GLOBAL.monitor_detail_server_log(sortcolumn, order_by);
            break;
        }
        case 'list_user_account':{
            search_users(sortcolumn, order_by);
            break;
        }
    }
};
/**
 * List item click
 * @param {string} item_type 
 * @param {{ip:string,
 *          latitude:string,
 *          longitude:string,
 *          id:number}} data 
 */
const list_item_click = (item_type, data) => {
    //check if gps_click and if not system admin only when map is not loaded
    if (item_type=='GPS' && common.COMMON_GLOBAL.system_admin_only != 1){
        if (data['ip']){
            common.commonFFB({path:'/geolocation/ip', query:data['ip'] != '::1'?`ip=${data['ip']}`:null, method: 'GET', authorization_type:'APP_DATA'})
            .then((/**@type{string}*/result)=>{
                const geodata = JSON.parse(result);
                common.COMMON_GLOBAL.moduleLeaflet.methods.map_update({ longitude:geodata.geoplugin_longitude,
                                                                        latitude:geodata.geoplugin_latitude,
                                                                        text_place: geodata.geoplugin_city + ', ' +
                                                                                    geodata.geoplugin_regionName + ', ' +
                                                                                    geodata.geoplugin_countryName,
                                                                        country:'',
                                                                        city:'',
                                                                        timezone_text :null
                                                                    });
            })
            .catch(()=>null);
        }
        else{
            common.commonFFB({path:'/geolocation/place', query:`latitude=${data['latitude']}&longitude=${data['longitude']}`, method:'GET', authorization_type:'APP_DATA'})
            .then((/**@type{string}*/result)=>{
                /**@type{{geoplugin_place:string, geoplugin_region:string, geoplugin_countryCode:string}} */
                const geodata = JSON.parse(result);
                common.COMMON_GLOBAL.moduleLeaflet.methods.map_update({ longitude:data['longitude'],
                                                                        latitude:data['latitude'],
                                                                        text_place: geodata.geoplugin_place + ', ' + 
                                                                                    geodata.geoplugin_region + ', ' + 
                                                                                    geodata.geoplugin_countryCode,
                                                                        country:'',
                                                                        city:'',
                                                                        timezone_text :null
                                                                    });
            })
            .catch(()=>null);
        }
    }
    else
        if (item_type=='CHAT'){
            show_broadcast_dialogue('CHAT', data['id']);
        }
    
};
/**
 * Get log parameters
 * @returns {Promise.<{parameters:{ SCOPE_REQUEST:string,
 *                                  SCOPE_SERVER:string, 
 *                                  SCOPE_SERVICE:string,
 *                                  SCOPE_APP:string,
 *                                  SCOPE_DB:string,
 *                                  REQUEST_LEVEL:number,
 *                                  SERVICE_LEVEL:number,
 *                                  DB_LEVEL:number,
 *                                  APP_LEVEL:number,
 *                                  LEVEL_VERBOSE:string 
 *                                  LEVEL_ERROR:string
 *                                  LEVEL_INFO:string,
 *                                  FILE_INTERVAL:string},
 *                     logscope_level_options:{log_scope:string, log_level:string}[]}>}
 */
const get_log_parameters = async () => {
    return new Promise((resolve)=>{
        common.commonFFB({path:'/server-config/config/CONFIG_SERVER', query:'config_group=SERVICE_LOG', method:'GET', authorization_type:'SYSTEMADMIN'})
        .then((/**@type{string}*/result)=>{
            const log_parameters = {
                SCOPE_REQUEST : JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_REQUEST' in row)[0]['SCOPE_REQUEST'],
                SCOPE_SERVER :  JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_SERVER' in row)[0]['SCOPE_SERVER'],
                SCOPE_SERVICE : JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_SERVICE' in row)[0]['SCOPE_SERVICE'],
                SCOPE_APP :     JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_APP' in row)[0]['SCOPE_APP'],
                SCOPE_DB :      JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_DB' in row)[0]['SCOPE_DB'],
                REQUEST_LEVEL : JSON.parse(result).data.filter((/**@type{*}*/row)=>'REQUEST_LEVEL' in row)[0]['REQUEST_LEVEL'],
                SERVICE_LEVEL : JSON.parse(result).data.filter((/**@type{*}*/row)=>'SERVICE_LEVEL' in row)[0]['SERVICE_LEVEL'],
                DB_LEVEL :      JSON.parse(result).data.filter((/**@type{*}*/row)=>'DB_LEVEL' in row)[0]['DB_LEVEL'],
                APP_LEVEL :     JSON.parse(result).data.filter((/**@type{*}*/row)=>'APP_LEVEL' in row)[0]['APP_LEVEL'],
                LEVEL_INFO :    JSON.parse(result).data.filter((/**@type{*}*/row)=>'LEVEL_INFO' in row)[0]['LEVEL_INFO'],
                LEVEL_ERROR :   JSON.parse(result).data.filter((/**@type{*}*/row)=>'LEVEL_ERROR' in row)[0]['LEVEL_ERROR'],
                LEVEL_VERBOSE : JSON.parse(result).data.filter((/**@type{*}*/row)=>'LEVEL_VERBOSE' in row)[0]['LEVEL_VERBOSE'],
                FILE_INTERVAL : JSON.parse(result).data.filter((/**@type{*}*/row)=>'FILE_INTERVAL' in row)[0]['FILE_INTERVAL']
               };
            const logscope_level_options = [
                {log_scope:log_parameters.SCOPE_REQUEST,    log_level: log_parameters.LEVEL_INFO},
                {log_scope:log_parameters.SCOPE_REQUEST,    log_level: log_parameters.LEVEL_ERROR},
                {log_scope:log_parameters.SCOPE_REQUEST,    log_level: log_parameters.LEVEL_VERBOSE},
                {log_scope:log_parameters.SCOPE_SERVER,     log_level: log_parameters.LEVEL_INFO},
                {log_scope:log_parameters.SCOPE_SERVER,     log_level: log_parameters.LEVEL_ERROR},
                {log_scope:log_parameters.SCOPE_APP,        log_level: log_parameters.LEVEL_INFO},
                {log_scope:log_parameters.SCOPE_APP,        log_level: log_parameters.LEVEL_ERROR},
                {log_scope:log_parameters.SCOPE_SERVICE,    log_level: log_parameters.LEVEL_INFO},
                {log_scope:log_parameters.SCOPE_SERVICE,    log_level: log_parameters.LEVEL_ERROR},
                {log_scope:log_parameters.SCOPE_DB,         log_level: log_parameters.LEVEL_INFO},
                {log_scope:log_parameters.SCOPE_DB,         log_level: log_parameters.LEVEL_ERROR}
            ];
            APP_GLOBAL.service_log_file_interval = log_parameters.FILE_INTERVAL;
            resolve({   parameters:log_parameters,
                        logscope_level_options:logscope_level_options});
        });
    })
    .catch(()=>null);
};
/**
 * Show existing logfiles
 * @returns {void}
 */
const show_existing_logfiles = () => {
    /**
     * Event for LOV
     * @param {import('../../../common_types.js').CommonAppEvent} event 
     */
    const function_event = event => {
                            //format: 'LOGSCOPE_LOGLEVEL_20220101.log'
                            //logscope and loglevel
                            let filename = common.commonElementRow(event.target).getAttribute('data-value') ?? '';
                            const logscope = filename.substring(0,filename.indexOf('_'));
                            filename = filename.substring(filename.indexOf('_')+1);
                            const loglevel = filename.substring(0,filename.indexOf('_'));
                            filename = filename.substring(filename.indexOf('_')+1);
                            const year     = parseInt(filename.substring(0, 4));
                            const month    = parseInt(filename.substring(4, 6));
                            const day      = parseInt(filename.substring(6, 8));

                            //logscope and loglevel
                            COMMON_DOCUMENT.querySelector('#select_logscope5 .common_select_dropdown_value').setAttribute('data-value', `${logscope}-${loglevel}`);
                            COMMON_DOCUMENT.querySelector('#select_logscope5 .common_select_dropdown_value').textContent = `${logscope} - ${loglevel}`;
                            //year
                            COMMON_DOCUMENT.querySelector('#select_year_menu5 .common_select_dropdown_value').setAttribute('data-value', year);
                            COMMON_DOCUMENT.querySelector('#select_year_menu5 .common_select_dropdown_value').textContent = year;

                            //month
                            COMMON_DOCUMENT.querySelector('#select_month_menu5 .common_select_dropdown_value').setAttribute('data-value', month);
                            COMMON_DOCUMENT.querySelector('#select_month_menu5 .common_select_dropdown_value').textContent = month;
                            //day if applicable
                            if (APP_GLOBAL.service_log_file_interval=='1D'){
                                COMMON_DOCUMENT.querySelector('#select_day_menu5 .common_select_dropdown_value').setAttribute('data-value', day);
                                COMMON_DOCUMENT.querySelector('#select_day_menu5 .common_select_dropdown_value').textContent = day;
                            }
                                

                            APP_GLOBAL.monitor_detail_server_log('logdate', 'desc');
                            common.commonLovClose();
                        };
    common.commonLovShow({lov:'SERVER_LOG_FILES', function_event:function_event});
};

/**
 * Executes installation rest API and presents the result
 * @param {string} id 
 * @param {boolean|null} db_icon 
 * @param {string} path 
 * @param {string} query
 * @param {import('../../../common_types.js').CommonRESTAPIMethod} method 
 * @param {import('../../../common_types.js').CommonRESTAPIAuthorizationType} tokentype 
 * @param {{demo_password:string}|null} data 
 * @returns {void}
 */
const installation_function = (id, db_icon, path, query, method, tokentype, data) => {
    common.commonFFB({path:path, query:query, method:method, authorization_type:tokentype, body:data, spinner_id:id})
    .then((/**@type{string}*/result)=>{
        if (db_icon!=null)
            if (db_icon)
                COMMON_DOCUMENT.querySelector('#install_db_icon').classList.add('installed');
            else
                COMMON_DOCUMENT.querySelector('#install_db_icon').classList.remove('installed');
        common.commonMessageShow('LOG', null, null, null, JSON.parse(result).info, common.COMMON_GLOBAL.common_app_id);
    });
};
/**
 * Installs DB
 * @returns {void}
 */
const db_install = () =>{
    common.commonComponentRemove('common_dialogue_message');
    installation_function(  'install_db_button_install', true, 
                            '/server-db_admin/database', 
                            `client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}`, 
                            'POST', 'SYSTEMADMIN', null);
};
/**
 * Uninstalls DB
 * @returns {void}
 */
const db_uninstall = () =>{
    common.commonComponentRemove('common_dialogue_message');
    installation_function(  'install_db_button_uninstall', false, 
                            '/server-db_admin/database', 
                            `client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}`, 'DELETE', 'SYSTEMADMIN', null);
};
/**
 * Installs Demo data
 * @returns {void}
 */
const demo_install = () =>{
    if (common.commonInputControl(null,
                        {
                            check_valid_list_elements:[[COMMON_DOCUMENT.querySelector('#install_demo_password'),null]]
                        })==true){
        const json_data = {demo_password: COMMON_DOCUMENT.querySelector('#install_demo_password').textContent};
        installation_function(  'install_demo_button_install', null, 
                                '/server-db_admin/database-demo', 
                                `client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}`,
                                'POST', 'APP_ACCESS', json_data);
    }
};
/**
 * Uninstalls Demo data
 * @returns {void}
 */
const demo_uninstall = () =>{
    installation_function(  'install_demo_button_uninstall', null, 
                            '/server-db_admin/database-demo', 
                            `?client_id=${common.COMMON_GLOBAL.service_socket_client_ID??''}`,
                            'DELETE', 'APP_ACCESS', null);
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
                    if( event_target_id == 'select_app_menu1' ||
                        event_target_id == 'select_year_menu1'||
                        event_target_id == 'select_month_menu1' ||
                        event_target_id == 'select_system_admin_stat'){
                        show_charts();    
                    }
                    if( event_target_id == 'select_broadcast_type')
                        set_broadcast_type();
                    //menu monitor
                    if( event_target_id == 'select_app_menu5'||
                        event_target_id == 'select_year_menu5'||
                        event_target_id == 'select_month_menu5'||
                        event_target_id == 'select_day_menu5'){
                            switch (COMMON_DOCUMENT.querySelector('#list_monitor_nav .list_nav_selected_tab').id){
                                case 'list_monitor_nav_server_log':{
                                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab').classList.remove('list_nav_selected_tab');
                                    COMMON_DOCUMENT.querySelector('#list_monitor_nav_server_log').classList.add('list_nav_selected_tab');
                                    APP_GLOBAL.monitor_detail_server_log('logdate', 'desc');
                                    break;
                                }
                                case 'list_monitor_nav_connected':{
                                    COMMON_DOCUMENT.querySelector('#list_monitor_nav_connected').click();
                                    break;
                                }
                                case 'list_monitor_nav_app_log':{
                                    COMMON_DOCUMENT.querySelector('#list_monitor_nav_app_log').click();
                                    break;
                                }
                                default:{
                                    break;
                                }
                            }
                        }
                    if( event_target_id == 'select_logscope5')
                        APP_GLOBAL.monitor_detail_server_log('logdate', 'desc');
                    break;
                }
                case 'menu_1_broadcast_button':{
                    show_broadcast_dialogue('ALL');
                    break;
                }
                case 'menu_1_checkbox_maintenance':{
                    set_maintenance();
                    break;
                }
                case 'list_user_search_icon':{
                    COMMON_DOCUMENT.querySelector('#list_user_account_search_input').focus();
                    search_users('username', 'asc');
                    break;
                }
                case 'users_save':{
                    button_save('users_save');
                    break;
                }
                case 'apps_save':{
                    button_save('apps_save');
                    break;
                }
                case 'filesearch_menu5':{
                    show_existing_logfiles();
                    break;
                }
                case 'list_server_log_search_icon':{
                    COMMON_DOCUMENT.querySelector('#list_server_log_search_input').focus();
                    APP_GLOBAL.monitor_detail_server_log('logdate','desc');
                    break;
                }
                case 'list_monitor_nav_connected':{
                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab')?.classList.remove('list_nav_selected_tab');
                    COMMON_DOCUMENT.querySelector('#list_monitor_nav_connected').classList.add('list_nav_selected_tab');
                    monitorDetailShow('CONNECTED', '', 'connection_date', 'desc');
                    break;
                }
                case 'list_monitor_nav_app_log':{
                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab')?.classList.remove('list_nav_selected_tab');
                    COMMON_DOCUMENT.querySelector('#list_monitor_nav_app_log').classList.add('list_nav_selected_tab');
                    monitorDetailShow('APP_LOG', '&offset=0', 'date_created', 'desc');
                    break;
                }
                case 'list_monitor_nav_server_log':{
                    COMMON_DOCUMENT.querySelector('.list_nav_selected_tab')?.classList.remove('list_nav_selected_tab');
                    COMMON_DOCUMENT.querySelector('#list_monitor_nav_server_log').classList.add('list_nav_selected_tab');
                    monitorDetailShow('SERVER_LOG', '', 'logdate', 'desc');
                    break;
                }
                case 'list_app_log_first':
                case 'list_app_log_previous':
                case 'list_app_log_next':
                case 'list_app_log_last':{
                    APP_GLOBAL.page_navigation(event_target_id);
                    break;
                }
                case 'config_save':{
                    button_save('config_save');
                    break;
                }
                case 'list_config_nav_config_server' :
                case 'list_config_nav_config_iam_blockip':
                case 'list_config_nav_config_iam_useragent':
                case 'list_config_nav_config_iam_policy':{
                    nav_click(event_target_id);
                    break;
                }
                case 'install_db_button_install':{
                    common.commonMessageShow('CONFIRM',null,db_install, null, null, common.COMMON_GLOBAL.app_id);
                    break;
                }
                case 'install_db_button_uninstall':{
                    common.commonMessageShow('CONFIRM',null,db_uninstall, null, null, common.COMMON_GLOBAL.app_id);
                    break;
                }
                case 'install_demo_button_install':{
                    demo_install();
                    break;
                }
                case 'install_demo_button_uninstall':{
                    demo_uninstall();
                    break;
                }
                case event_list_title && event_list_title.classList.contains('list_sort_click')?event_target_id:'':{
                    event_list_title!=null?list_sort_click(event_target_id, 
                                    event_list_title.getAttribute('data-column') ?? '',
                                    event_list_title.classList.contains('desc')?'asc':'desc'
                                    ):null;
                    break;
                }
                case event.target.classList.contains('gps_click')?event_target_id:'':{
                    list_item_click('GPS',
                                    {
                                        latitude:   event.target.getAttribute('data-latitude') ?? '',
                                        longitude:  event.target.getAttribute('data-longitude') ?? '',
                                        ip:         event.target.getAttribute('data-ip') ?? '',
                                        id:         0
                                    });
                    break;
                }
                case event.target.classList.contains('chat_click')?event_target_id:'':{
                    list_item_click('CHAT', {latitude:'',
                                             longitude:'',
                                             ip:'',
                                             id: Number(event.target.getAttribute('data-id'))});
                    break;
                }
                case 'list_apps':{
                    if (event.target.classList.contains('common_list_lov_click'))
                        common.commonLovEvent(event, 'APP_CATEGORY');
                    break;
                }
                case 'list_user_account':{
                    if (event.target.classList.contains('common_list_lov_click'))
                        common.commonLovEvent(event, 'APP_ROLE');
                    break;
                }
                case 'send_broadcast_send':{
                    sendBroadcast();
                    break;
                }
                case 'send_broadcast_close':{
                    closeBroadcast();
                    break;
                }
            }
            break;
        }
        case 'focus':{
            switch (event_target_id){
                case 'list_apps':{
                    //event on master to automatically show detail records
                    if (APP_GLOBAL.previous_row != common.commonElementRow(event.target)){
                        APP_GLOBAL.previous_row = common.commonElementRow(event.target);
                        common.commonComponentRender({
                            mountDiv:   'list_app_parameter',
                            data:       {app_id_data:parseInt(common.commonElementRow(event.target).getAttribute('data-app_id') ?? '')},
                            methods:    {commonFFB:common.commonFFB},
                            path:       '/component/menu_apps_parameters.js'});
                    }
                    break;
                }
                case 'list_user_account':{
                    //event on master to automatically show detail records
                    if (APP_GLOBAL.previous_row != common.commonElementRow(event.target)){
                        APP_GLOBAL.previous_row = common.commonElementRow(event.target);
                        common.commonComponentRender({
                            mountDiv:   'list_user_account_logon',
                            data:       {user_account_id:parseInt(common.commonElementRow(event.target).getAttribute('data-user_account_id') ?? '')},
                            methods:    {commonFFB:common.commonFFB},
                            path:       '/component/menu_users_logon.js'});
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
                if (common.commonElementRow(event.target).classList.contains('list_apps_row') && event.target.classList.contains('common_input_lov'))
                    if (event.target.textContent=='')
                        event.target.parentNode.nextElementSibling.querySelector('.common_lov_value').textContent = '';
                    else
                        common.commonLovAction(event, 'APP_CATEGORY', null, '/server-db_admin/app_category', `id=${event.target.textContent}`, 'GET', 'APP_ACCESS', null);
                //app role LOV
                if (common.commonElementRow(event.target).classList.contains('list_user_account_row') && event.target.classList.contains('common_input_lov')){
                    let app_role_id_lookup='';
                    const old_value =event.target.textContent;
                    //if empty then lookup default
                    if (event.target.textContent=='')
                        app_role_id_lookup='2';
                    else
                        app_role_id_lookup=event.target.textContent;
                    common.commonLovAction(event, 'APP_ROLE', old_value, '/server-db_admin/app_role', `id=${app_role_id_lookup}`, 'GET', 'APP_ACCESS', null);
                }
            }
            break;
        }
        case 'keyup':{
            switch (event_target_id){
                case 'list_user_account_search_input':{
                    if (!event.code.startsWith('Arrow') && 
                        event.code != 'Home' && 
                        event.code != 'End' &&
                        event.code != 'PageUp' &&
                        event.code != 'PageDown')
                        common.commonTypewatch(search_users, 'username', 'asc');
                    break;
                }
                case 'list_server_log_search_input':{
                    if (!event.code.startsWith('Arrow') && 
                        event.code != 'Home' && 
                        event.code != 'End' &&
                        event.code != 'PageUp' &&
                        event.code != 'PageDown')
                        common.commonTypewatch(APP_GLOBAL.monitor_detail_server_log, 'logdate', 'desc');
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
    APP_GLOBAL.moduleLeafletDiv      ='mapid';
    APP_GLOBAL.service_log_file_interval= '';

    for (let i=1;i<=10;i++){
        COMMON_DOCUMENT.querySelector(`#menu_${i}`).style.display='none';
    }
    if (common.COMMON_GLOBAL.system_admin!=null){
        COMMON_DOCUMENT.querySelector('#menu_secure').classList.add('system_admin');
        show_menu(1);
    }
    else{
        COMMON_DOCUMENT.querySelector('#menu_secure').classList.add('admin');
        show_menu(1);
    }
};
export {delete_globals, show_menu, nav_click, get_log_parameters, show_app_log, map_mount, app_events, init};
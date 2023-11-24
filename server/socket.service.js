/** @module server/socket */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const {ConfigGet, ConfigGetInit} = await import(`file://${process.cwd()}/server/config.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**@type{Types.socket_connect_list[]} */
let CONNECTED_CLIENTS = [];


/**
 * Socket client send
 * Used by EventSource and closes connection
 * @param {Types.res} res
 * @param {string} message
 * @param {string} message_type
 */
 const ClientSend = (res, message, message_type) => {
    res.write (`data: ${btoa(`{"broadcast_type"   : "${message_type}", 
                               "broadcast_message": "${ message }"}`)}\n\n`);
    res.flush();
};
/**
 * Socket client connect
 * Used by EventSource and leaves connection open
 * @param {Types.res} res
 */
 const ClientConnect = (res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
};
/**
 * Socket client close
 * Used by EventSource and closes connection
 * @param {Types.res} res
 * @param {number} client_id
 */
const ClientOnClose = (res, client_id) => {
    res.on('close', ()=>{
        CONNECTED_CLIENTS = CONNECTED_CLIENTS.filter(client => client.id !== client_id);
        res.end();
    });
};
/**
 * Socket client add
 * @param {Types.socket_connect_list} newClient
 */
const ClientAdd = (newClient) => {
    CONNECTED_CLIENTS.push(newClient);
};

/**
 * Socket connected update
 * @param {number} client_id
 * @param {number} user_account_id
 * @param {number} system_admin
 * @param {number} identity_provider_id
 * @param {string} latitude
 * @param {string} longitude
 */
 const ConnectedUpdate = (client_id, user_account_id, system_admin, identity_provider_id, latitude, longitude) => {
    for (let i = 0; i < CONNECTED_CLIENTS.length; i++){
        if (CONNECTED_CLIENTS[i].id==client_id){
            CONNECTED_CLIENTS[i].user_account_id = user_account_id;
            CONNECTED_CLIENTS[i].system_admin = system_admin;
            CONNECTED_CLIENTS[i].connection_date = new Date().toISOString();
            CONNECTED_CLIENTS[i].identity_provider_id = identity_provider_id;
            CONNECTED_CLIENTS[i].gps_latitude = latitude;
            CONNECTED_CLIENTS[i].gps_longitude = longitude;
            return null;
        }
    }
    return null;
};
/**
 * Socket check connected
 * @param {number} user_account_id
 */
 const ConnectedCheck = (user_account_id) => {
    for (let i = 0; i < CONNECTED_CLIENTS.length; i++){
        if (CONNECTED_CLIENTS[i].user_account_id == user_account_id){
            return {online: 1};
        }
    }
    return {online: 0};
};

/**
 * Socket client send as system admin
 * @param {number} app_id
 * @param {number} client_id
 * @param {number} client_id_current
 * @param {string} broadcast_type
 * @param {string} broadcast_message
 */
 const SocketSendSystemAdmin = (app_id, client_id, client_id_current, broadcast_type, broadcast_message) => {
    if (broadcast_type=='INFO' || broadcast_type=='MAINTENANCE'){
        //broadcast INFO or MAINTENANCE to all connected to given app_id 
        //except MAINTENANCE to admin and current user
        for (const client of CONNECTED_CLIENTS){
            if (client.id != client_id_current)
                if (broadcast_type=='MAINTENANCE' && client.app_id ==0)
                    null;
                else
                    if (client.app_id == app_id || app_id == null){
                        ClientSend(client.response, broadcast_message, broadcast_type);
                        return {sent:1};
                    }
        }
    }
    else
        if (broadcast_type=='CHAT'){
            //broadcast CHAT to specific client
            for (const client of CONNECTED_CLIENTS){
                if (client.id == client_id){
                    ClientSend(client.response, broadcast_message, broadcast_type);
                    return {sent:1};
                }
            }
        }
    return {sent:0};
};
/**
 * Socket connected list
 * @param {number} app_id
 * @param {number} app_id_select
 * @param {number} limit
 * @param {number} year
 * @param {number} month
 * @param {string} order_by
 * @param {Types.sort_socket} sort
 * @param {number} dba
 */
 const ConnectedList = async (app_id, app_id_select, limit, year, month, order_by, sort, dba) => {
    limit = Number(limit ?? 0);
    const { app_start } = await import(`file://${process.cwd()}/apps/apps.service.js`);
    //filter    
    /**@type{Types.socket_connect_list_no_res[]} */
    let connected_clients_no_res =[];
    for (const client of CONNECTED_CLIENTS)
        //return keys without response
        connected_clients_no_res.push({ id: client.id,
                                        app_id: client.app_id, 
                                        app_role_icon:'',
                                        app_role_id:'',
                                        user_account_id: client.user_account_id,
                                        identity_provider_id: client.identity_provider_id,
                                        system_admin: client.system_admin,
                                        connection_date: client.connection_date,
                                        gps_latitude: client.gps_latitude ?? '',
                                        gps_longitude: client.gps_longitude ?? '',
                                        ip: client.ip,
                                        user_agent: client.user_agent});
    //return rows controlling limit, app_id, year and month
    connected_clients_no_res = connected_clients_no_res.filter((client, index)=>{
        return index<=limit &&
        (client.app_id == app_id_select || app_id_select==null) &&
        (parseInt(client.connection_date.substring(0,4)) == year && 
         parseInt(client.connection_date.substring(5,7)) == month);
    });
    /**
     * Sort
     * @param {Types.sort_socket} sort
     */
    const sort_and_return = (sort) =>{
        let order_by_num = 0;
        if (order_by =='asc')
            order_by_num = 1;
        else   
            order_by_num = -1;

        return connected_clients_no_res = connected_clients_no_res.sort((first, second)=>{
            //sort default is connection_date if sort missing as argument
            if (typeof first[sort==null?'connection_date':sort] == 'number'){
                //number sort
                const first_sort_num = first[sort==null?'connection_date':sort];
                const second_sort_num = second[sort==null?'connection_date':sort];
                if (first_sort_num< second_sort_num )
                    return -1 * order_by_num;
                else if (first_sort_num> second_sort_num)
                    return 1 * order_by_num;
                else
                    return 0;
            }
            else{
                //string sort with lowercase and localcompare
                const first_sort = first[sort==null?'connection_date':sort].toString().toLowerCase();
                const second_sort = second[sort==null?'connection_date':sort].toString().toLowerCase();
                //using localeCompare as collation method
                if (first_sort.localeCompare(second_sort)<0 )
                    return -1 * order_by_num;
                else if (first_sort.localeCompare(second_sort)>0 )
                    return 1 * order_by_num;
                else
                    return 0;
            }
        });
    };
    if (connected_clients_no_res.length>0){
        //update with user role
        const { getUserRoleAdmin } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account.service.js`);
        for (const client of connected_clients_no_res){
            if (client.system_admin==0)
                if (await app_start()==true){    
                    await getUserRoleAdmin(app_id, client.user_account_id, dba)
                    .then((/**@type{Types.db_result_user_account_getUserRoleAdmin[]}*/result_app_role)=>{
                        if (result_app_role[0]){
                            client.app_role_id = result_app_role[0].app_role_id;
                            client.app_role_icon = result_app_role[0].icon;
                        }
                    });
                }
            else{
                client.app_role_id = '';
                client.app_role_icon = '';
            } 
        }
        return sort_and_return(sort);
    }
    else
        return null;
};
/**
 * Socket client send as admin
 * @param {number} app_id
 * @param {number} client_id
 * @param {number} client_id_current
 * @param {string} broadcast_type
 * @param {string} broadcast_message
 */
 const SocketSendAdmin = (app_id, client_id, client_id_current, broadcast_type, broadcast_message) => {
    if (broadcast_type=='INFO' || broadcast_type=='CHAT'){
        //admin can only broadcast INFO or CHAT
        if (broadcast_type=='INFO'){
            for (const client of CONNECTED_CLIENTS){
                if (client.id != client_id_current)
                    if (client.app_id == app_id || app_id == null){
                        ClientSend(client.response, broadcast_message, broadcast_type);
                        return {sent:1};
                    }
            }
        }
        if (broadcast_type=='CHAT'){
            //broadcast CHAT to specific client
            for (const client of CONNECTED_CLIENTS){
                if (client.id == client_id){
                    ClientSend(client.response, broadcast_message, broadcast_type);
                    return {sent:1};
                }
            }
        }
    }    
    return {sent:0};
};
/**
 * Socket connected count
 * @param {number} identity_provider_id
 * @param {number} count_logged_in
 */
 const ConnectedCount = (identity_provider_id, count_logged_in) => {
    let count_connected=0;
    for (let i = 0; i < CONNECTED_CLIENTS.length; i++){
        if ((count_logged_in==1 &&
                CONNECTED_CLIENTS[i].identity_provider_id == identity_provider_id &&
                identity_provider_id !=null &&
                CONNECTED_CLIENTS[i].user_account_id != null) ||
            (count_logged_in==1 &&
                identity_provider_id ==null &&
                CONNECTED_CLIENTS[i].identity_provider_id ==null &&
                (CONNECTED_CLIENTS[i].user_account_id != null ||
                CONNECTED_CLIENTS[i].system_admin == 1)) ||
            (count_logged_in==0 && 
                identity_provider_id ==null &&
                CONNECTED_CLIENTS[i].identity_provider_id ==null &&
                CONNECTED_CLIENTS[i].user_account_id ==null &&
                CONNECTED_CLIENTS[i].system_admin == 0))
            {
            count_connected = count_connected + 1;
        }
    }
    return {count_connected};
};

/**
 * Socket connect
 * Used by EventSource and leaves connection open
 * @param {number} app_id
 * @param {number} identity_provider_id
 * @param {number} user_account_logon_user_account_id
 * @param {number} system_admin
 * @param {string} latitude
 * @param {string} longitude
 * @param {string} authorization
 * @param {string} headers_user_agent
 * @param {string} ip
 * @param {Types.res} response
 */
 const SocketConnect = async (   app_id, 
                                    identity_provider_id, 
                                    user_account_logon_user_account_id, 
                                    system_admin,
                                    latitude, 
                                    longitude, 
                                    authorization, 
                                    headers_user_agent, 
                                    ip, 
                                    response) =>{
    const {checkDataTokenSocket} = await import(`file://${process.cwd()}/server/auth.service.js`);
    if (checkDataTokenSocket(app_id, authorization)){
        const client_id = Date.now();
        ClientConnect(response);
        ClientOnClose(response, client_id);
        /**@type{Types.socket_connect_list} */
        const newClient = {
                            id:                     client_id,
                            app_id:                 app_id,
                            user_account_id:        user_account_logon_user_account_id,
                            identity_provider_id:   identity_provider_id,
                            system_admin:           system_admin,
                            connection_date:        new Date().toISOString(),
                            gps_latitude:           latitude,
                            gps_longitude:          longitude,
                            ip:                     ip,
                            user_agent:             headers_user_agent,
                            response:               response
                        };
        ClientAdd(newClient);
        ClientSend(response, `{\\"client_id\\": ${client_id}}`, 'CONNECTINFO');
    }
    else
        response.status(401).send('⛔');
};

/**
 * Socket check maintenance
 */
 const SocketCheckMaintenance = () => {
    //start interval if apps are started
    if (ConfigGet('SERVER', 'APP_START')=='1'){
        setInterval(() => {
            if (ConfigGetInit('MAINTENANCE')=='1'){
                CONNECTED_CLIENTS.forEach(client=>{
                    if (client.app_id != getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID'))){
                        ClientSend(client.response, '', 'MAINTENANCE');
                    }
                });
            }
        }, ConfigGet('SERVICE_SOCKET', 'CHECK_INTERVAL'));
    }
};

export {ConnectedUpdate, ConnectedCheck, SocketSendSystemAdmin, ConnectedList, SocketSendAdmin, ConnectedCount, SocketConnect, SocketCheckMaintenance};
/** @module server/broadcast */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const {ConfigGet, ConfigGetInit} = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{Types.broadcast_connect_list[]} */
let CONNECTED_CLIENTS = [];

/**
 * Broadcast connect
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
const BroadcastConnect = async (app_id, 
                                identity_provider_id, 
                                user_account_logon_user_account_id, 
                                system_admin,
                                latitude, 
                                longitude, 
                                authorization, 
                                headers_user_agent, 
                                ip, 
                                response) =>{
    const {checkDataToken} = await import(`file://${process.cwd()}/server/auth/auth.service.js`);
    if (checkDataToken(authorization)){
        const client_id = Date.now();
        ClientConnect(response);
        ClientOnClose(response, client_id);
        /**@type{Types.broadcast_connect_list} */
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
 * Broadcast client connect
 * Used by EventSource and leaves connection open
 * @param {Types.res} res
 */
const ClientConnect = (res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
};
/**
 * Broadcast client close
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
 * Broadcast client add
 * @param {Types.broadcast_connect_list} newClient
 */
const ClientAdd = (newClient) => {
    CONNECTED_CLIENTS.push(newClient);
};
/**
 * Broadcast client send
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
 * Broadcast check maintenance
 */
const BroadcastCheckMaintenance = () => {
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
        }, ConfigGet('SERVICE_BROADCAST', 'CHECK_INTERVAL'));
    }
};
/**
 * Broadcast client send as system admin
 * @param {number} app_id
 * @param {number} client_id
 * @param {number} client_id_current
 * @param {string} broadcast_type
 * @param {string} broadcast_message
 * @param {Types.callBack} callBack
 */
const BroadcastSendSystemAdmin = (app_id, client_id, client_id_current, broadcast_type, broadcast_message, callBack) => {
    if (broadcast_type=='INFO' || broadcast_type=='MAINTENANCE'){
        //broadcast INFO or MAINTENANCE to all connected to given app_id 
        //except MAINTENANCE to admin and current user
        CONNECTED_CLIENTS.forEach(client=>{
            if (client.id != client_id_current)
                if (broadcast_type=='MAINTENANCE' && client.app_id ==0)
                    null;
                else
                    if (client.app_id == app_id || app_id == null){
                        ClientSend(client.response, broadcast_message, broadcast_type);
                        return callBack(null,{sent:1});
                    }
        });
    }
    else
        if (broadcast_type=='CHAT'){
            //broadcast CHAT to specific client
            CONNECTED_CLIENTS.forEach(client=>{
                if (client.id == client_id){
                    ClientSend(client.response, broadcast_message, broadcast_type);
                    return callBack(null,{sent:1});
                }
            });
        }
    callBack(null, {sent:0});
};
/**
 * Broadcast client send as admin
 * @param {number} app_id
 * @param {number} client_id
 * @param {number} client_id_current
 * @param {string} broadcast_type
 * @param {string} broadcast_message
 * @param {Types.callBack} callBack
 */
const BroadcastSendAdmin = (app_id, client_id, client_id_current, broadcast_type, broadcast_message, callBack) => {
    if (broadcast_type=='INFO' || broadcast_type=='CHAT'){
        //admin can only broadcast INFO or CHAT
        if (broadcast_type=='INFO'){
            CONNECTED_CLIENTS.forEach(client=>{
                if (client.id != client_id_current)
                    if (client.app_id == app_id || app_id == null){
                        ClientSend(client.response, broadcast_message, broadcast_type);
                        return callBack(null,{sent:1});
                    }
            });
        }
        if (broadcast_type=='CHAT'){
            //broadcast CHAT to specific client
            CONNECTED_CLIENTS.forEach(client=>{
                if (client.id == client_id){
                    ClientSend(client.response, broadcast_message, broadcast_type);
                    return callBack(null,{sent:1});
                }
            });
        }
    }
    
    callBack(null, {sent:0});
};
/**
 * Broadcast connected list
 * @param {number} app_id
 * @param {number} app_id_select
 * @param {number} limit
 * @param {number} year
 * @param {number} month
 * @param {string} order_by
 * @param {Types.sort_broadcast} sort
 * @param {number} dba
 * @param {Types.callBack} callBack
 */
const ConnectedList = async (app_id, app_id_select, limit, year, month, order_by, sort, dba, callBack) => {
    limit = Number(limit ?? 0);
    const { app_start } = await import(`file://${process.cwd()}/apps/apps.service.js`);
    //filter    
    /**@type{Types.broadcast_connect_list_no_res[]} */
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
     * @param {Types.sort_broadcast} sort
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
                    })
                    .catch((/**@type{Types.error}*/error)=>{
                        return callBack(error, null);
                    });
                }
            else{
                client.app_role_id = '';
                client.app_role_icon = '';
            } 
        }
        callBack(null, sort_and_return(sort));
    }
    else
        callBack(null, null);
};
/**
 * Broadcast connected count
 * @param {number} identity_provider_id
 * @param {number} count_logged_in
 * @param {Types.callBack} callBack
 */
const ConnectedCount = (identity_provider_id, count_logged_in, callBack) => {
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
    callBack(null, count_connected);
};
/**
 * Broadcast connected update
 * @param {number} client_id
 * @param {number} user_account_id
 * @param {number} system_admin
 * @param {number} identity_provider_id
 * @param {string} latitude
 * @param {string} longitude
 * @param {Types.callBack} callBack
 */
const ConnectedUpdate = (client_id, user_account_id, system_admin, identity_provider_id, latitude, longitude, callBack) => {
    for (let i = 0; i < CONNECTED_CLIENTS.length; i++){
        if (CONNECTED_CLIENTS[i].id==client_id){
            CONNECTED_CLIENTS[i].user_account_id = user_account_id;
            CONNECTED_CLIENTS[i].system_admin = system_admin;
            CONNECTED_CLIENTS[i].connection_date = new Date().toISOString();
            CONNECTED_CLIENTS[i].identity_provider_id = identity_provider_id;
            CONNECTED_CLIENTS[i].gps_latitude = latitude;
            CONNECTED_CLIENTS[i].gps_longitude = longitude;
            return callBack(null, null);
        }
    }
    return callBack(null, null);
};
/**
 * Broadcast check connected
 * @param {number} user_account_id
 * @param {Types.callBack} callBack
 */
const ConnectedCheck = (user_account_id, callBack) => {
    for (let i = 0; i < CONNECTED_CLIENTS.length; i++){
        if (CONNECTED_CLIENTS[i].user_account_id == user_account_id){
            return callBack(null, 1);
        }
    }
    return callBack(null, 0);
};
export {BroadcastConnect, ClientConnect, ClientOnClose, ClientAdd, ClientSend, BroadcastCheckMaintenance, BroadcastSendSystemAdmin, BroadcastSendAdmin, 
        ConnectedList, ConnectedCount, ConnectedUpdate, ConnectedCheck};
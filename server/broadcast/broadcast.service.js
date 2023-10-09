const {ConfigGet, ConfigGetInit} = await import(`file://${process.cwd()}/server/server.service.js`);
let CONNECTED_CLIENTS = [];

const ClientConnect = (res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
};
const ClientOnClose = (res, client_id) => {
    res.on('close', ()=>{
        CONNECTED_CLIENTS = CONNECTED_CLIENTS.filter(client => client.id !== client_id);
        res.end();
    });
};
const ClientAdd = (newClient) => {
    CONNECTED_CLIENTS.push(newClient);
};
const ClientSend = (res, message, message_type) => {
    res.write (`data: ${btoa(`{"broadcast_type"   : "${message_type}", 
                               "broadcast_message": "${ message }"}`)}\n\n`);
    res.flush();
};
const BroadcastCheckMaintenance = () => {
    //start interval if apps are started
    if (ConfigGet('SERVER', 'APP_START')=='1'){
        setInterval(() => {
            if (ConfigGetInit('MAINTENANCE')=='1'){
                CONNECTED_CLIENTS.forEach(client=>{
                    if (client.app_id != ConfigGet('SERVER', 'APP_COMMON_APP_ID')){
                        ClientSend(client.response, '', 'MAINTENANCE');
                    }
                });
            }
        }, ConfigGet('SERVICE_BROADCAST', 'CHECK_INTERVAL'));
    }
};
const BroadcastSendSystemAdmin = (app_id, client_id, client_id_current, broadcast_type, broadcast_message, callBack) => {
    if (app_id == '' || app_id == 'null')
        app_id = null;
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
                    }
        });
    }
    else
        if (broadcast_type=='CHAT'){
            //broadcast CHAT to specific client
            CONNECTED_CLIENTS.forEach(client=>{
                if (client.id == client_id){
                    ClientSend(client.response, broadcast_message, broadcast_type);
                }
            });
        }
    callBack(null, null);
};
const BroadcastSendAdmin = (app_id, client_id, client_id_current, broadcast_type, broadcast_message, callBack) => {
    if (app_id == '' || app_id == 'null')
        app_id = null;
    if (broadcast_type=='INFO' || broadcast_type=='CHAT'){
        //admin can only broadcast INFO or CHAT
        if (broadcast_type=='INFO'){
            CONNECTED_CLIENTS.forEach(client=>{
                if (client.id != client_id_current)
                    if (client.app_id == app_id || app_id == null){
                        ClientSend(client.response, broadcast_message, broadcast_type);
                    }
            });
        }
        if (broadcast_type=='CHAT'){
            //broadcast CHAT to specific client
            CONNECTED_CLIENTS.forEach(client=>{
                if (client.id == client_id){
                    ClientSend(client.response, broadcast_message, broadcast_type);
                }
            });
        }
    }
    
    callBack(null, null);
};
const ConnectedList = async (app_id, app_id_select, limit, year, month, order_by, sort, dba, callBack) => {
    if (limit == '')
        limit = 0;
    else
       limit = Number(limit);
    if (app_id_select == '')
        app_id_select = null;
    else
        app_id_select = Number(app_id_select);
    const { apps_start_ok } = await import(`file://${process.cwd()}/apps/apps.service.js`);
    const db_ok = ConfigGet('SERVICE_DB', 'START')=='1' && apps_start_ok()==true;
    //filter    
    
    let connected_clients_no_res =[];
    for (const client of CONNECTED_CLIENTS)
        //return keys without response
        connected_clients_no_res.push({ app_id: client.app_id, 
                                        app_role_icon: client.app_role_icon ?? '',
                                        app_role_id: client.app_role_id ?? '',
                                        connection_date: client.connection_date,
                                        gps_latitude: client.gps_latitude ?? '',
                                        gps_longitude: client.gps_longitude ?? '',
                                        id: client.id,
                                        identity_provider_id: client.identity_provider_id,
                                        ip: client.ip,
                                        system_admin: client.system_admin,
                                        user_account_id: client.user_account_id,
                                        user_agent: client.user_agent});
    //return rows controlling limit, app_id, year and month
    connected_clients_no_res = connected_clients_no_res.filter((client, index)=>{
        return index<=limit &&
        (client.app_id == app_id_select || app_id_select==null) &&
        (parseInt(client.connection_date.substring(0,4)) == parseInt(year) && 
         parseInt(client.connection_date.substring(5,7)) == parseInt(month));
    });
    const sort_and_return = (sort) =>{
        let order_by_num;
        if (order_by =='asc')
            order_by_num = 1;
        else   
            order_by_num = -1;
        return connected_clients_no_res = connected_clients_no_res.sort((first, second)=>{
            let first_sort, second_sort;
            //sort default is connection_date if sort missing as argument
            if (typeof first[sort==null?'connection_date':sort] == 'number'){
                //number sort
                first_sort = first[sort==null?'connection_date':sort];
                second_sort = second[sort==null?'connection_date':sort];
                if (first_sort< second_sort )
                    return -1 * order_by_num;
                else if (first_sort> second_sort)
                    return 1 * order_by_num;
                else
                    return 0;
            }
            else{
                //string sort with lowercase and localcompare
                first_sort = first[sort==null?'connection_date':sort].toLowerCase();
                second_sort = second[sort==null?'connection_date':sort].toLowerCase();
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
        if (db_ok){
            //update with user role
            const { getUserRoleAdmin } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.service.js`);
            let i=0;
            connected_clients_no_res.map(client=>{
                if (client.system_admin=='0')
                    getUserRoleAdmin(app_id, client.user_account_id, dba, (err, result_app_role)=>{
                        if (err)
                            callBack(err, null);
                        else{
                            if (result_app_role){
                                client.app_role_id = result_app_role.app_role_id;
                                client.app_role_icon = result_app_role.icon;
                            }
                            if (i== connected_clients_no_res.length - 1) 
                                callBack(null, sort_and_return(sort));
                            else
                                i++;
                        }
                    });
                else{
                    client.app_role_id = '';
                    client.app_role_icon = '';
                    if (i== connected_clients_no_res.length - 1) 
                        callBack(null, sort_and_return(sort));
                    else
                        i++;
                }
                    
            });
        }
        else
            callBack(null, sort_and_return(sort));
    }
    else
        callBack(null, null);
};
const ConnectedCount = (identity_provider_id, count_logged_in, callBack) => {
    let count_connected=0;
    for (let i = 0; i < CONNECTED_CLIENTS.length; i++){
        if ((count_logged_in==1 &&
                CONNECTED_CLIENTS[i].identity_provider_id == identity_provider_id &&
                identity_provider_id !='' &&
                CONNECTED_CLIENTS[i].user_account_id != '') ||
            (count_logged_in==1 &&
                identity_provider_id =='' &&
                CONNECTED_CLIENTS[i].identity_provider_id =='' &&
                (CONNECTED_CLIENTS[i].user_account_id != '' ||
                CONNECTED_CLIENTS[i].system_admin == 1)) ||
            (count_logged_in==0 && 
                identity_provider_id =='' &&
                CONNECTED_CLIENTS[i].identity_provider_id =='' &&
                CONNECTED_CLIENTS[i].user_account_id =='' &&
                CONNECTED_CLIENTS[i].system_admin == 0))
            {
            count_connected = count_connected + 1;
        }
    }
    return callBack(null, count_connected);
};
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
const ConnectedCheck = (user_account_id, callBack) => {
    for (let i = 0; i < CONNECTED_CLIENTS.length; i++){
        if (CONNECTED_CLIENTS[i].user_account_id == user_account_id){
            return callBack(null, 1);
        }
    }
    return callBack(null, 0);
};
export {ClientConnect, ClientOnClose, ClientAdd, ClientSend, BroadcastCheckMaintenance, BroadcastSendSystemAdmin, BroadcastSendAdmin, 
        ConnectedList, ConnectedCount, ConnectedUpdate, ConnectedCheck};
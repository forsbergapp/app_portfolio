const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
let CONNECTED_CLIENTS = [];

const ClientConnect = (res) => {
    const headers = {
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        };
    res.writeHead(200, headers);
}
const ClientOnClose = (res, client_id) => {
    res.on('close', ()=>{
        CONNECTED_CLIENTS = CONNECTED_CLIENTS.filter(client => client.id !== client_id);
        res.end();
    })
}
const ClientAdd = (newClient) => {
    CONNECTED_CLIENTS.push(newClient);
}
const ClientSend = (res, message, message_type) => {
    res.write (`data: ${btoa(`{"broadcast_type"   : "${message_type}", 
                               "broadcast_message": "${ message }"}`)}\n\n`);
}
const BroadcastCheckMaintenance = () => {
    //start interval if apps are started
    if (ConfigGet(1, 'SERVER', 'APP_START')=='1'){
        const intervalId = setInterval(() => {
            if (ConfigGet(0, null, 'MAINTENANCE')=='1'){
                CONNECTED_CLIENTS.forEach(client=>{
                    if (client.app_id != ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID')){
                        ClientSend(client.response, "", 'MAINTENANCE');
                    }
                })
            }
        }, ConfigGet(1, 'SERVICE_BROADCAST', 'CHECK_INTERVAL'));
    }
}
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
        })
    }
    else
        if (broadcast_type=='CHAT'){
            //broadcast CHAT to specific client
            CONNECTED_CLIENTS.forEach(client=>{
                if (client.id == client_id){
                    ClientSend(client.response, broadcast_message, broadcast_type);
                }
            })
        }
    callBack(null, null);
}
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
            })
        }
        if (broadcast_type=='CHAT'){
            //broadcast CHAT to specific client
            CONNECTED_CLIENTS.forEach(client=>{
                if (client.id == client_id){
                    ClientSend(client.response, broadcast_message, broadcast_type);
                }
            })
        }
    }
    
    callBack(null, null);
}
const ConnectedList = async (app_id, app_id_select, limit, year, month, order_by, sort, system_admin, callBack) => {
    let connected_clients_no_res = [];
    let i=0;
    CONNECTED_CLIENTS.forEach(client=>{
        if (client.app_id == app_id_select || app_id_select == ''){
            i++;
            let copyClient;
            if (limit=='' || (limit!='' && i<=limit)){
                //connection date in ISO8601 format: "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
                //return selected year and month
                if (parseInt(client.connection_date.substring(0,4)) == parseInt(year) && 
                    parseInt(client.connection_date.substring(5,7)) == parseInt(month)){
                        copyClient = {
                            id: client.id,
                            app_id: client.app_id,
                            app_role_id: '',
                            app_role_icon: '',
                            user_account_id: client.user_account_id,
                            system_admin: client.system_admin,
                            user_agent: client.user_agent,
                            connection_date: client.connection_date,
                            ip: client.ip,
                            gps_latitude: client.gps_latitude,
                            gps_longitude: client.gps_longitude,
                            identity_provider_id: client.identity_provider_id
                        };
                        connected_clients_no_res.push(copyClient);
                    }
            }
        }
    })
    const sortByProperty = (property, order_by) => {
        return (a,b) => {
            if(a[property] > b[property])  
                return 1 * order_by;
            else if(a[property] < b[property])  
                return -1 * order_by;
            return 0;  
        }  
    }        
    const sort_and_return = () => {
        let column_sort;
        let order_by_num;
        if (order_by =='asc')
            order_by_num = 1;
        else   
            order_by_num = -1;
        switch (parseInt(sort)){
            case 1:{
                column_sort = 'id';
                break;
            }
            case 2:{
                column_sort = 'connection_date';
                break;
            }
            case 3:{
                column_sort = 'app_id';
                break;
            }
            case 4:{
                column_sort = 'app_role_icon';
                break;
            }
            case 5:{
                column_sort = 'user_account_id';
                break;
            }
            case 6:{
                column_sort = 'system_admin';
                break;
            }
            case 7:{
                column_sort = 'ip';
                break;
            }
            case 8:{
                column_sort = 'gps_latitude';
                break;
            }
            case 9:{
                column_sort = 'gps_longitude';
                break;
            }
            case 10:{
                column_sort = 'user_agent';
                break;
            }
            default:{
                column_sort = 'connection_date';
            }
        }
        callBack(null, connected_clients_no_res.sort(sortByProperty(column_sort, order_by_num)));
    }
    i=0;
    if (connected_clients_no_res.length>0)
        //update list using map with app role icons if database started
        if(ConfigGet(1, 'SERVICE_DB', 'START')==1){
            import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.service.js`).then(({ getUserRoleAdmin }) => {
                connected_clients_no_res.map(client=>{
                    getUserRoleAdmin(app_id, client.user_account_id, system_admin, (err, result_app_role)=>{
                        if (err)
                            callBack(err, null);
                        else{
                            if (result_app_role){
                                client.app_role_id = result_app_role.app_role_id;
                                client.app_role_icon = result_app_role.icon;
                            }
                            if (i== connected_clients_no_res.length - 1) 
                                sort_and_return();
                            else
                                i++;
                        }
                    })
                })
            })
        }
        else
            sort_and_return();
    else
        callBack(null, null);
}
const ConnectedCount = (identity_provider_id, count_logged_in, callBack) => {
    let i=0;
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
}
const ConnectedUpdate = (client_id, user_account_id, system_admin, identity_provider_id, latitude, longitude, callBack) => {
    let i=0;
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
}
const ConnectedCheck = (user_account_id, callBack) => {
    let i=0;
    for (let i = 0; i < CONNECTED_CLIENTS.length; i++){
        if (CONNECTED_CLIENTS[i].user_account_id == user_account_id){
            return callBack(null, 1);
        }
    }
    return callBack(null, 0)
}
export {ClientConnect, ClientOnClose, ClientAdd, ClientSend, BroadcastCheckMaintenance, BroadcastSendSystemAdmin, BroadcastSendAdmin, 
        ConnectedList, ConnectedCount, ConnectedUpdate, ConnectedCheck}
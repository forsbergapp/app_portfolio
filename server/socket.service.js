/** @module server/socket/service */

/**@type{import('./server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{import('./config.service.js')} */
const {ConfigGet, ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);
/**@type{import('./db/file.service.js')} */
const {fileCache} = await import(`file://${process.cwd()}/server/db/file.service.js`);
/**@type{import('./iam.service.js')} */
const {expired_token} = await import(`file://${process.cwd()}/server/iam.service.js`);

/**@type{import('./types.js').server_socket_connected_list[]} */
let CONNECTED_CLIENTS = [];

/**
     * 
     * @param {number} app_id 
     * @param {number|null} user_account_id 
     * @param {string} ip
     * @param {string} headers_user_agent 
     * @param {string} headers_accept_language 
     * @returns {Promise.<{  latitude:string,
 *              longitude:string,
 *               place:string,
 *               timezone:string,
 *               identity_provider_id:number|null}>}
 */
const getConnectedUserData = async (app_id, user_account_id, ip, headers_user_agent, headers_accept_language) =>{
    /**@type{import('./bff.service.js')} */
    const { BFF_server } = await import(`file://${process.cwd()}/server/bff.service.js`);
    //get GPS from IP
    /**@type{import('./types.js').server_bff_parameters}*/
    const parameters = {endpoint:'SERVER_SOCKET',
                        host:null,
                        url:'/geolocation/ip',
                        route_path:'/geolocation/ip',
                        method:'GET', 
                        query:`ip=${ip}`,
                        body:{},
                        authorization:null,
                        ip:ip, 
                        user_agent:headers_user_agent, 
                        accept_language:headers_accept_language,
                        /**@ts-ignore */
                        res:null};
    
    const result_geodata = await BFF_server(app_id, parameters)
                                    .then((/**@type{*}*/result_gps)=>JSON.parse(result_gps))
                                    .catch(()=>null);
    const place = result_geodata?
                    (result_geodata.geoplugin_city + ', ' +
                    result_geodata.geoplugin_regionName + ', ' +
                    result_geodata.geoplugin_countryName):'';
    /**@type{import('./db/sql/user_account.service.js')} */
    const {getUserByUserId} = await import(`file://${process.cwd()}/server/db/sql/user_account.service.js`);
    const identity_provider_id = user_account_id?await getUserByUserId(app_id, user_account_id)
                                                    .then(result=>result[0].identity_provider_id)
                                                    .catch(()=>null):null;
    return {latitude:result_geodata?result_geodata.geoplugin_latitude ?? '':'',
            longitude:result_geodata?result_geodata.geoplugin_longitude ?? '':'',
            place:place,
            timezone:result_geodata?result_geodata.geoplugin_timezone ?? '':'',
            identity_provider_id:identity_provider_id};
};
/**
 * Socket client send
 * Used by EventSource and closes connection
 * @param {import('./types.js').server_server_res} res
 * @param {string} message
 * @param {import('./types.js').server_socket_broadcast_type_all} message_type
 * @returns {void}
 */
 const ClientSend = (res, message, message_type) => {
    res.write (`data: ${btoa(`{"broadcast_type"   : "${message_type}", 
                               "broadcast_message": "${ message }"}`)}\n\n`);
    res.flush();
};
/**
 * Socket client connect
 * Used by EventSource and leaves connection open
 * @param {import('./types.js').server_server_res} res
 * @returns {void}
 */
 const ClientConnect = (res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
};
/**
 * Socket client close
 * Used by EventSource and closes connection
 * @param {import('./types.js').server_server_res} res
 * @param {number} client_id
 * @returns {void}
 */
const ClientOnClose = (res, client_id) => {
    res.on('close', ()=>{
        CONNECTED_CLIENTS = CONNECTED_CLIENTS.filter(client => client.id !== client_id);
        res.end();
    });
};
/**
 * Socket client add
 * @param {import('./types.js').server_socket_connected_list} newClient
 * @returns {void}
 */
const ClientAdd = (newClient) => {
    CONNECTED_CLIENTS.push(newClient);
};

/**
 * Socket connected update
 * @param {number} app_id,
 * @param {number|null} client_id
 * @param {number|null} user_account_id
 * @param {string|null} system_admin
 * @param {string|null} authorization_bearer
 * @param {string|null} token_access
 * @param {string|null} token_systemadmin
 * @param {string} ip
 * @param {string} headers_user_agent
 * @param {string} headers_accept_language
 * @param {import('./types.js').server_server_res} res
 * @returns {Promise.<void>}
 */
 const ConnectedUpdate = async (app_id, client_id, user_account_id, system_admin, authorization_bearer, token_access, token_systemadmin, ip, headers_user_agent, headers_accept_language, res) => {
    if (CONNECTED_CLIENTS.filter(row=>row.id==client_id && row.authorization_bearer == authorization_bearer).length==0){
        /**@type{import('./iam.service.js')} */
        const {not_authorized} = await import(`file://${process.cwd()}/server/iam.service.js`);
        throw not_authorized(res, 401, 'ConnectedUpdate, authorization', true);
    }
    else
        for (const connected of CONNECTED_CLIENTS){
            if (connected.id==client_id && connected.authorization_bearer == authorization_bearer){
                const connectUserData =  await getConnectedUserData(app_id, user_account_id, ip, headers_user_agent, headers_accept_language);
                connected.connection_date = new Date().toISOString();
                connected.user_account_id = user_account_id;
                connected.token_access = token_access;
                connected.identity_provider_id = connectUserData.identity_provider_id;
                connected.system_admin = system_admin ?? '';
                connected.token_systemadmin = token_systemadmin;
                connected.gps_latitude = connectUserData.latitude;
                connected.gps_longitude = connectUserData.longitude;
                connected.place = connectUserData.place;
                connected.timezone = connectUserData.timezone;
                //send message to client with updated data
                ClientSend( connected.response, 
                            btoa(JSON.stringify({   client_id: client_id, 
                                                    latitude: connectUserData.latitude,
                                                    longitude: connectUserData.longitude,
                                                    place: connectUserData.place,
                                                    timezone: connectUserData.timezone})), 'CONNECTINFO');
            }
        }
};
/**
 * Socket check connected
 * @param {number} user_account_id
 * @returns {import('./types.js').server_socket_connected_list[]}
 */
 const ConnectedGet = user_account_id => {
    return CONNECTED_CLIENTS.filter(client => client.user_account_id == user_account_id);
};

/**
 * Socket client send as system admin
 * @param {number|null} app_id
 * @param {number|null} client_id
 * @param {number|null} client_id_current
 * @param {import('./types.js').server_socket_broadcast_type_all} broadcast_type
 * @param {string} broadcast_message
 * @returns {{sent:number}}
 */
 const SocketSendSystemAdmin = (app_id, client_id, client_id_current, broadcast_type, broadcast_message) => {
    if (broadcast_type=='ALERT' || broadcast_type=='MAINTENANCE'){
        //broadcast INFO or MAINTENANCE to all connected to given app_id 
        //except MAINTENANCE to admin and current user
        let sent = 0;
        for (const client of CONNECTED_CLIENTS){
            if (client.id != client_id_current)
                if (broadcast_type=='MAINTENANCE' && client.app_id ==getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')))
                    null;
                else
                    if (client.app_id == app_id || app_id == null){
                        ClientSend(client.response, broadcast_message, broadcast_type);
                        sent++;
                    }
        }
        return {sent:sent};
    }
    else
        if (broadcast_type=='CHAT' || broadcast_type=='PROGRESS'){
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
 * @param {number|null} app_id_select
 * @param {number|null} limit
 * @param {number|null} year
 * @param {number|null} month
 * @param {number|null} day
 * @param {string} order_by
 * @param {import('./types.js').server_socket_connected_list_sort} sort
 * @param {number} dba
 * @returns {Promise.<import('./types.js').server_socket_connected_list_no_res[]>}
 */
 const ConnectedList = async (app_id, app_id_select, limit, year, month, day, order_by, sort, dba) => {
    
    /**@type{import('../apps/common/src/common.service.js')} */
    const { commonAppStart } = await import(`file://${process.cwd()}/apps/common/src/common.service.js`);
    //filter    
    /**@type{import('./types.js').server_socket_connected_list_no_res[]} */
    let connected_clients_no_res =[];
    for (const client of CONNECTED_CLIENTS)
        //return keys without response
        connected_clients_no_res.push({ id: client.id,
                                        app_id: client.app_id, 
                                        authorization_bearer:client.authorization_bearer,
                                        app_role_icon:'',
                                        app_role_id:'',
                                        user_account_id: client.user_account_id,
                                        identity_provider_id: client.identity_provider_id,
                                        system_admin: client.system_admin,
                                        connection_date: client.connection_date,
                                        gps_latitude: client.gps_latitude ?? '',
                                        gps_longitude: client.gps_longitude ?? '',
                                        place: client.place ?? '',
                                        timezone: client.timezone ?? '',
                                        ip: client.ip,
                                        user_agent: client.user_agent});
    //return rows controlling limit, app_id, year and month
    connected_clients_no_res = connected_clients_no_res.filter((client, index)=>{
        return index<=Number(limit ?? 0) &&
        (client.app_id == app_id_select || app_id_select==null) &&
        (parseInt(client.connection_date.substring(0,4)) == year && 
         parseInt(client.connection_date.substring(5,7)) == month &&
         parseInt(client.connection_date.substring(8,10)) == day);
    });
    /**
     * Sort
     * @param {import('./types.js').server_socket_connected_list_sort} sort
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
                if ((first_sort_num??0) < (second_sort_num??0) )
                    return -1 * order_by_num;
                else if ((first_sort_num??0) > (second_sort_num??0))
                    return 1 * order_by_num;
                else
                    return 0;
            }
            else{
                //string sort with lowercase and localcompare
                const first_sort = (first[sort==null?'connection_date':sort] ?? '').toString().toLowerCase();
                const second_sort = (second[sort==null?'connection_date':sort] ?? '').toString().toLowerCase();
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
        /**@type{import('./db/sql/user_account.service.js')} */
        const { getUserRoleAdmin } = await import(`file://${process.cwd()}/server/db/sql/user_account.service.js`);
        for (const client of connected_clients_no_res){
            if (client.system_admin=='')
                if (await commonAppStart()==true){    
                    await getUserRoleAdmin(app_id, client.user_account_id, dba)
                    .then((/**@type{import('./types.js').server_db_sql_result_user_account_getUserRoleAdmin[]}*/result_app_role)=>{
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
        return [];
};
/**
 * Socket client send as admin
 * @param {number|null} app_id
 * @param {number|null} client_id
 * @param {number|null} client_id_current
 * @param {import('./types.js').server_socket_broadcast_type_admin} broadcast_type
 * @param {string} broadcast_message
 * @returns {{sent:number}}
 */
 const SocketSendAdmin = (app_id, client_id, client_id_current, broadcast_type, broadcast_message) => {
    if (broadcast_type=='ALERT' || broadcast_type=='CHAT' || broadcast_type=='PROGRESS'){
        //admin can only broadcast INFO or CHAT
        if (broadcast_type=='ALERT'){
            let sent = 0;
            for (const client of CONNECTED_CLIENTS){
                if (client.id != client_id_current)
                    if (client.app_id == app_id || app_id == null){
                        ClientSend(client.response, broadcast_message, broadcast_type);
                        sent++;
                    }
            }
            return {sent:sent};
        }
        if (broadcast_type=='CHAT' || broadcast_type=='PROGRESS'){
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
 * 
 * Sends message to given app having the correct authorization_header
 * Used for sending server side event from an app server function
 * @param {number} app_id
 * @param {string} iam
 * @param {import('./types.js').server_socket_broadcast_type_app_function} message_type
 * @param {string} message
 * @returns {Promise.<{sent:number}>}
 */
const SocketSendAppServerFunction = async (app_id, iam, message_type, message) =>{
    /**@type{import('./iam.service.js')} */
    const { iam_decode } = await import(`file://${process.cwd()}/server/iam.service.js`);

    const client = CONNECTED_CLIENTS.filter(client=>client.app_id == app_id && client.authorization_bearer == iam_decode(iam).get('authorization_bearer'));
    if (client.length == 1){
        ClientSend(client[0].response, message, message_type);
        return {sent:1};
    }
    else
        return {sent:0};
};
/**
 * Socket connected count
 * @param {number|null} identity_provider_id
 * @param {number|null} logged_in
 * @returns {{count_connected:number}}
 */
 const ConnectedCount = (identity_provider_id, logged_in) => {
    if (logged_in == 1)
        return {count_connected:CONNECTED_CLIENTS.filter(connected =>   (connected.identity_provider_id == identity_provider_id &&
                                                        identity_provider_id !=null &&
                                                        connected.user_account_id != null)||
                                                        (identity_provider_id ==null &&
                                                        connected.identity_provider_id ==null &&
                                                        (connected.user_account_id != null ||connected.system_admin != ''))).length};
    else
        return {count_connected:CONNECTED_CLIENTS.filter(connected =>identity_provider_id ==null &&
                                                    connected.identity_provider_id ==null &&
                                                    connected.user_account_id ==null &&
                                                    connected.system_admin == '').length};
};

/**
 * Socket connect
 * Used by EventSource and leaves connection open
 * @param {number} app_id
 * @param {number|null} user_account_id
 * @param {string|null} system_admin
 * @param {string|null} authorization_bearer
 * @param {string} headers_user_agent
 * @param {string} headers_accept_language
 * @param {string} ip
 * @param {import('./types.js').server_server_res} response
 * @returns {Promise.<void>}
 */
 const SocketConnect = async (  app_id, 
                                user_account_id, 
                                system_admin,
                                authorization_bearer,
                                headers_user_agent, 
                                headers_accept_language,
                                ip, 
                                response) =>{
  //no authorization for repeated request using same id token or requesting from browser
    if (CONNECTED_CLIENTS.filter(row=>row.authorization_bearer == authorization_bearer).length>0 ||response.req.headers['sec-fetch-mode']!='cors'){
        /**@type{import('./iam.service.js')} */
        const {not_authorized} = await import(`file://${process.cwd()}/server/iam.service.js`);
        throw not_authorized(response, 401, 'SocketConnect, authorization', true);
    }
    else{
        const client_id = Date.now();
        ClientConnect(response);
        ClientOnClose(response, client_id);
    
        const connectUserData =  await getConnectedUserData(app_id, user_account_id, ip, headers_user_agent, headers_accept_language);
        /**@type{import('./types.js').server_socket_connected_list} */
        const newClient = {
                            id:                     client_id,
                            app_id:                 app_id,
                            authorization_bearer:   authorization_bearer,
                            user_account_id:        user_account_id,
                            token_access:           null,
                            identity_provider_id:   connectUserData.identity_provider_id,
                            system_admin:           system_admin,
                            token_systemadmin:      null,
                            connection_date:        new Date().toISOString(),
                            gps_latitude:           connectUserData.latitude,
                            gps_longitude:          connectUserData.longitude,
                            place:                  connectUserData.place,
                            timezone:               connectUserData.timezone,
                            ip:                     ip,
                            user_agent:             headers_user_agent,
                            response:               response
                        };
    
        ClientAdd(newClient);
        //send message to client with data
        
        ClientSend(response, btoa(JSON.stringify({  client_id: client_id, 
                                                    latitude: connectUserData.latitude,
                                                    longitude: connectUserData.longitude,
                                                    place: connectUserData.place,
                                                    timezone: connectUserData.timezone})), 'CONNECTINFO');
    }
};

/**
 * Socket check interval
 * @returns {void}
 */
 const SocketCheckInterval = () => {
    //start interval if apps are started
    const app_id = getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID'));
    if (ConfigGetApp(app_id, app_id, 'PARAMETERS').filter((/**@type{*}*/parameter)=>'APP_START' in parameter)[0].APP_START =='1'){
        setInterval(() => {
            if (getNumberValue(fileCache('CONFIG_SERVER').METADATA.MAINTENANCE)==1){
                SocketSendSystemAdmin(null, null, null, 'MAINTENANCE', '');
            }
            SocketUpdateExpiredTokens();
        //set default interval to 5 seconds if no parameter is set
        }, getNumberValue(ConfigGet('SERVICE_SOCKET', 'CHECK_INTERVAL'))??5000);
    }
};
/**
 * Sends SESSIONE_EXPIRED message to clients with expired token
 * @returns {void}
 */
const SocketUpdateExpiredTokens = () =>{
    for (const client of CONNECTED_CLIENTS){
        if (client.token_access && expired_token(client.app_id, 'APP_ACCESS', client.token_access)||
            client.token_systemadmin && expired_token(null, 'SYSTEMADMIN', client.token_systemadmin))
            ClientSend(client.response, '', 'SESSION_EXPIRED');
    }
};

export {ClientSend, ConnectedUpdate, ConnectedGet, SocketSendSystemAdmin, ConnectedList, SocketSendAdmin, SocketSendAppServerFunction, ConnectedCount, SocketConnect, SocketCheckInterval};
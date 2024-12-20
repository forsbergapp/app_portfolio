/** @module server/socket */

/**
 * @import {server_socket_broadcast_type_all, server_server_res, server_bff_parameters, 
 *          server_socket_broadcast_type_app_function,
 *          server_socket_connected_list, server_socket_connected_list_no_res, server_socket_connected_list_sort} from './types.js'
 */


/**@type{import('./server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**@type{import('./iam.service.js')} */
const {iamUtilTokenExpired} = await import(`file://${process.cwd()}/server/iam.service.js`);

/**@type{import('./db/fileModelAppParameter.js')} */
const fileModelAppParameter = await import(`file://${process.cwd()}/server/db/fileModelAppParameter.js`);
/**@type{import('./db/fileModelConfig.js')} */
const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

/**@type{server_socket_connected_list[]} */
let SOCKET_CONNECTED_CLIENTS = [];

/**
 * Get geodata and user account data for connected user
 * @function
 * @param {number} app_id 
 * @param {number|null} user_account_id 
 * @param {string} ip
 * @param {string} headers_user_agent 
 * @param {string} headers_accept_language 
 * @param {server_server_res} res
 * @returns {Promise.<{  latitude:string,
 *              longitude:string,
 *               place:string,
 *               timezone:string,
 *               identity_provider_id:number|null}>}
 */
const socketConnectedUserDataGet = async (app_id, user_account_id, ip, headers_user_agent, headers_accept_language, res) =>{
    /**@type{import('./bff.service.js')} */
    const { bffServer } = await import(`file://${process.cwd()}/server/bff.service.js`);
    //get GPS from IP
    /**@type{server_bff_parameters}*/
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
    
    const result_geodata = await bffServer(app_id, parameters)
                                    .then((/**@type{*}*/result_gps)=>result_gps)
                                    .catch(()=>null);
    const place = result_geodata?
                    (result_geodata.geoplugin_city + ', ' +
                    result_geodata.geoplugin_regionName + ', ' +
                    result_geodata.geoplugin_countryName):'';
    /**@type{import('./db/dbModelUserAccount.js')} */
    const {getUserByUserId} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);
    const identity_provider_id = user_account_id?await getUserByUserId(app_id, user_account_id, null,res)
                                                    .then(result=>result.identity_provider_id)
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
 * @function
 * @param {server_server_res} res
 * @param {string} message
 * @param {server_socket_broadcast_type_all} message_type
 * @returns {void}
 */
 const socketClientSend = (res, message, message_type) => {
    res.write (`data: ${btoa(`{"broadcast_type"   : "${message_type}", 
                               "broadcast_message": "${ message }"}`)}\n\n`);
    res.flush();
};
/**
 * Socket client connect
 * Used by EventSource and leaves connection open
 * @function
  * @param {server_server_res} res
 * @returns {void}
 */
 const socketClientConnect = (res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
};
/**
 * Socket client close
 * Used by EventSource and closes connection
 * @function
 * @param {server_server_res} res
 * @param {number} client_id
 * @returns {void}
 */
const socketClientOnClose = (res, client_id) => {
    res.on('close', ()=>{
        SOCKET_CONNECTED_CLIENTS = SOCKET_CONNECTED_CLIENTS.filter(client => client.id !== client_id);
        res.end();
    });
};
/**
 * Socket client add
 * @function
 * @param {server_socket_connected_list} newClient
 * @returns {void}
 */
const socketClientAdd = (newClient) => {
    SOCKET_CONNECTED_CLIENTS.push(newClient);
};

/**
 * Socket connected update
 * @function
 * @param {number} app_id,
 * @param {{iam:string,
 *          user_account_id:number|null,
 *          iam_user_id:number|null,
 *          iam_user_username:string|null,
 *          iam_user_type:'ADMIN'|'USER'|null,
 *          token_access:string|null,
 *          token_admin:string|null,
 *          ip:string,
 *          headers_user_agent:string,
 *          headers_accept_language:string,
 *          res: server_server_res}} parameters
 * @returns {Promise.<void>}
 */
 const socketConnectedUpdate = async (app_id, parameters) => {
    /**@type{import('./iam.service.js')} */
    const { iamUtilDecode } = await import(`file://${process.cwd()}/server/iam.service.js`);

    const client_id = serverUtilNumberValue(iamUtilDecode(parameters.iam).get('client_id'));
    const authorization_bearer = iamUtilDecode(parameters.iam).get('authorization_bearer');
    if (SOCKET_CONNECTED_CLIENTS.filter(row=>row.id==client_id && row.authorization_bearer == authorization_bearer).length==0){
        /**@type{import('./iam.service.js')} */
        const {iamUtilResponseNotAuthorized} = await import(`file://${process.cwd()}/server/iam.service.js`);
        throw iamUtilResponseNotAuthorized(parameters.res, 401, 'socketConnectedUpdate, authorization', true);
    }
    else
        for (const connected of SOCKET_CONNECTED_CLIENTS){
            if (connected.id==client_id && connected.authorization_bearer == authorization_bearer){
                const connectUserData =  await socketConnectedUserDataGet(app_id, parameters.user_account_id, parameters.ip, parameters.headers_user_agent, parameters.headers_accept_language, parameters.res);
                connected.connection_date = new Date().toISOString();
                connected.user_account_id = parameters.user_account_id;
                connected.token_access = parameters.token_access;
                connected.identity_provider_id = connectUserData.identity_provider_id;
                connected.iam_user_id = parameters.iam_user_id;
                connected.iam_user_username = parameters.iam_user_username;
                connected.iam_user_type = parameters.iam_user_type;
                connected.token_admin = parameters.token_admin;
                connected.gps_latitude = connectUserData.latitude;
                connected.gps_longitude = connectUserData.longitude;
                connected.place = connectUserData.place;
                connected.timezone = connectUserData.timezone;
                //send message to client with updated data
                socketClientSend( connected.response, 
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
 * @function
 * @param {number} user_account_id
 * @returns {server_socket_connected_list[]}
 */
 const socketConnectedGet = user_account_id => {
    return SOCKET_CONNECTED_CLIENTS.filter(client => client.user_account_id == user_account_id);
};

/**
 * Socket client send as admin
 * @function
 * @param {number|null} app_id
 * @param {{app_id:number|null,
 *          client_id:number|null,
 *          client_id_current:number|null,
 *          broadcast_type:server_socket_broadcast_type_all,
 *          broadcast_message:string}} data
 * @returns {{sent:number}}
 */
 const socketAdminSend = (app_id, data) => {
    data.client_id = serverUtilNumberValue(data.client_id);
    data.client_id_current = serverUtilNumberValue(data.client_id_current);

    if (data.broadcast_type=='ALERT' || data.broadcast_type=='MAINTENANCE'){
        //broadcast INFO or MAINTENANCE to all connected to given app_id 
        //except MAINTENANCE to admin and current user
        let sent = 0;
        for (const client of SOCKET_CONNECTED_CLIENTS){
            if (client.id != data.client_id_current)
                if (data.broadcast_type=='MAINTENANCE' && client.app_id ==serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')))
                    null;
                else
                    if (client.app_id == data.app_id || data.app_id == null){
                        socketClientSend(client.response, data.broadcast_message, data.broadcast_type);
                        sent++;
                    }
        }
        return {sent:sent};
    }
    else
        if (data.broadcast_type=='CHAT' || data.broadcast_type=='PROGRESS'){
            //broadcast CHAT to specific client
            for (const client of SOCKET_CONNECTED_CLIENTS){
                if (client.id == data.client_id){
                    socketClientSend(client.response, data.broadcast_message, data.broadcast_type);
                    return {sent:1};
                }
            }
        }
    return {sent:0};
};
/**
 * Socket connected list
 * @function
 * @param {number} app_id
 * @param {*} query
 * @returns{Promise.<{page_header:{total_count:number, offset:number, count:number}, rows:server_socket_connected_list_no_res[]}>}
 */
 const socketConnectedList = async (app_id, query) => {
    const app_id_select = serverUtilNumberValue(query.get('select_app_id'));
    /**@type{number} */
    const limit = serverUtilNumberValue(query.get('limit')) ?? 0;
    /**@type{number} */
    const offset = serverUtilNumberValue(query.get('offset')) ?? 0;
    /**@type{number|null} */
    const year = serverUtilNumberValue(query.get('year'));
    /**@type{number|null} */
    const month = serverUtilNumberValue(query.get('month'));
    /**@type{number|null} */
    const day= serverUtilNumberValue(query.get('day'));
    /**@type{string} */
    const order_by = query.get('order_by');
    /**@type{server_socket_connected_list_sort} */
    const sort = query.get('sort');

    const order_by_num = order_by =='asc'?1:-1;
    const result =  SOCKET_CONNECTED_CLIENTS
        .filter(client =>
            //filter rows
            (client.app_id == app_id_select || app_id_select==null) &&
            parseInt(client.connection_date.substring(0,4)) == year && 
            parseInt(client.connection_date.substring(5,7)) == month &&
            parseInt(client.connection_date.substring(8,10)) == day
            )
        .map(client=>{
            return {id:                     client.id,
                    app_id:                 client.app_id, 
                    authorization_bearer:   client.authorization_bearer,
                    iam_user_id:            client.iam_user_id,
                    iam_user_username:      client.iam_user_username,
                    iam_user_type:          client.iam_user_type,
                    user_account_id:        client.user_account_id,
                    identity_provider_id:   client.identity_provider_id,
                    connection_date:        client.connection_date,
                    gps_latitude:           client.gps_latitude ?? '',
                    gps_longitude:          client.gps_longitude ?? '',
                    place:                  client.place ?? '',
                    timezone:               client.timezone ?? '',
                    ip:                     client.ip,
                    user_agent:             client.user_agent};
        })
        //sort result
        .sort((first, second)=>{
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
        return { page_header:  {
                                    total_count:	result.length,
                                    offset: 		offset,
                                    count:			result
                                                    //set offset
                                                    .filter((client, index)=>offset>0?index+1>=offset:true)
                                                    //set limit
                                                    .filter((client, index)=>limit>0?index+1<=limit:true).length
                                    },
                    rows:           result
                                    //set offset
                                    .filter((client, index)=>offset>0?index+1>=offset:true)
                                    //set limit
                                    .filter((client, index)=>limit>0?index+1<=limit:true)
                };
};
/**
 * 
 * Sends message to given app having the correct authorization_header
 * Used for sending server side event from an app server function
 * @function
 * @param {number} app_id
 * @param {string} iam
 * @param {server_socket_broadcast_type_app_function} message_type
 * @param {string} message
 * @returns {Promise.<{sent:number}>}
 */
const socketAppServerFunctionSend = async (app_id, iam, message_type, message) =>{
    /**@type{import('./iam.service.js')} */
    const { iamUtilDecode } = await import(`file://${process.cwd()}/server/iam.service.js`);

    const client = SOCKET_CONNECTED_CLIENTS.filter(client=>client.app_id == app_id && client.authorization_bearer == iamUtilDecode(iam).get('authorization_bearer'));
    if (client.length == 1){
        socketClientSend(client[0].response, message, message_type);
        return {sent:1};
    }
    else
        return {sent:0};
};
/**
 * Socket connected count
 * @function
 * @param {*} query
 * @returns {{count_connected:number}}
 */
 const socketConnectedCount = query => {
    const identity_provider_id = serverUtilNumberValue(query.get('identity_provider_id'));
    const logged_in = serverUtilNumberValue(query.get('logged_in'));
    if (logged_in == 1)
        return {count_connected:SOCKET_CONNECTED_CLIENTS.filter(connected =>   (connected.identity_provider_id == identity_provider_id &&
                                                        identity_provider_id !=null &&
                                                        connected.user_account_id != null)||
                                                        (identity_provider_id ==null &&
                                                        connected.identity_provider_id ==null &&
                                                        (connected.user_account_id != null ||connected.iam_user_id != null))).length};
    else
        return {count_connected:SOCKET_CONNECTED_CLIENTS.filter(connected =>identity_provider_id ==null &&
                                                    connected.identity_provider_id ==null &&
                                                    connected.user_account_id ==null &&
                                                    connected.iam_user_id == null).length};
};

/**
 * Socket connect
 * Used by EventSource and leaves connection open
 * @function
 * @param {number} app_id
 * @param {{iam:string,
 *          headers_user_agent:string,
 *          headers_accept_language:string,
 *          ip:string,
 *          response:server_server_res}} parameters
 * @returns {Promise.<void>}
 */
 const socketConnect = async (  app_id, parameters) =>{
    /**@type{import('./iam.service.js')} */
    const { iamUtilDecode } = await import(`file://${process.cwd()}/server/iam.service.js`);
    /**@type{import('./db/fileModelIamUser.js')} */
    const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
    const user_account_id = serverUtilNumberValue(iamUtilDecode(parameters.iam).get('user_id'));
    const iam_user = serverUtilNumberValue(iamUtilDecode(parameters.iam).get('iam_user_id'))?
                    fileModelIamUser.get(app_id, serverUtilNumberValue(iamUtilDecode(parameters.iam).get('iam_user_id')), parameters.response)[0]:
                        null;
    const authorization_bearer = iamUtilDecode(parameters.iam).get('authorization_bearer');
    //no authorization for repeated request using same id token or requesting from browser
    if (SOCKET_CONNECTED_CLIENTS.filter(row=>row.authorization_bearer == authorization_bearer).length>0 ||parameters.response.req.headers['sec-fetch-mode']!='cors'){
        /**@type{import('./iam.service.js')} */
        const {iamUtilResponseNotAuthorized} = await import(`file://${process.cwd()}/server/iam.service.js`);
        throw iamUtilResponseNotAuthorized(parameters.response, 401, 'socketConnect, authorization', true);
    }
    else{
        const client_id = Date.now();
        socketClientConnect(parameters.response);
        socketClientOnClose(parameters.response, client_id);
    
        const connectUserData =  await socketConnectedUserDataGet(app_id, user_account_id, parameters.ip, parameters.headers_user_agent, parameters.headers_accept_language, parameters.response);
        /**@type{server_socket_connected_list} */
        const newClient = {
                            id:                     client_id,
                            connection_date:        new Date().toISOString(),
                            app_id:                 app_id,
                            authorization_bearer:   authorization_bearer,
                            user_account_id:        user_account_id,
                            token_access:           null,
                            identity_provider_id:   connectUserData.identity_provider_id,
                            iam_user_id:            iam_user?iam_user.id:null,
                            iam_user_username:      iam_user?iam_user.username:null,
                            iam_user_type:          iam_user?iam_user.type:null,
                            token_admin:            null,
                            gps_latitude:           connectUserData.latitude,
                            gps_longitude:          connectUserData.longitude,
                            place:                  connectUserData.place,
                            timezone:               connectUserData.timezone,
                            ip:                     parameters.ip,
                            user_agent:             parameters.headers_user_agent,
                            response:               parameters.response
                        };
    
        socketClientAdd(newClient);
        //send message to client with data
        
        socketClientSend(parameters.response, btoa(JSON.stringify({ client_id: client_id, 
                                                                    latitude: connectUserData.latitude,
                                                                    longitude: connectUserData.longitude,
                                                                    place: connectUserData.place,
                                                                    timezone: connectUserData.timezone})), 'CONNECTINFO');
    }
};

/**
 * Socket start setInterval to check maintenance and logout users with expired tokens using server side event
 * @function
 * @returns {void}
 */
 const socketIntervalCheck = () => {
    //start interval if apps are started
    const app_id = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))??0;
    if (fileModelAppParameter.get(app_id, null)[0].common_app_start.value =='1'){
        setInterval(() => {
            if (serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','METADATA','MAINTENANCE'))==1){
                socketAdminSend(null, { app_id:null,
                                        client_id:null,
                                        client_id_current:null,
                                        broadcast_type:'MAINTENANCE',
                                        broadcast_message:''});
            }
            socketExpiredTokensUpdate();
        //set default interval to 5 seconds if no parameter is set
        }, serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_SOCKET', 'CHECK_INTERVAL'))??5000);
    }
};
/**
 * Sends SESSION_EXPIRED message to clients with expired token
 * @function
 * @returns {void}
 */
const socketExpiredTokensUpdate = () =>{
    for (const client of SOCKET_CONNECTED_CLIENTS){
        if (client.token_access && iamUtilTokenExpired(client.app_id, 'APP_ACCESS', client.token_access)||
            client.token_admin && iamUtilTokenExpired(null, 'ADMIN', client.token_admin))
            socketClientSend(client.response, '', 'SESSION_EXPIRED');
    }
};
/**
 * Checks if user is online
 * @function
 * @param {number} resource_id 
 * @returns {{online:1|0}}
 */
const CheckOnline = resource_id =>socketConnectedGet(resource_id).length>0?{online:1}:{online:0};

export {socketClientSend, socketConnectedUpdate, socketConnectedGet, socketConnectedList, socketAdminSend, socketAppServerFunctionSend, socketConnectedCount, socketConnect, socketIntervalCheck, CheckOnline};
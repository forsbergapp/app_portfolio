/** @module server/socket */

/**
 * @import {server_server_response,
 *          server_socket_broadcast_type_all, server_server_res, server_bff_parameters, 
 *          server_socket_broadcast_type_app_function,
 *          server_socket_connected_list, server_socket_connected_list_no_res, server_socket_connected_list_sort} from './types.js'
 */


/**@type{import('./server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**@type{import('./iam.js')} */
const {iamUtilTokenExpired} = await import(`file://${process.cwd()}/server/iam.js`);

/**@type{import('./db/Config.js')} */
const Config = await import(`file://${process.cwd()}/server/db/Config.js`);

/**@type{server_socket_connected_list[]} */
let SOCKET_CONNECTED_CLIENTS = [];

/**
 * @name socketConnectedUserDataGet
 * @description Get geodata and user account data for connected user
 * @function
 * @param {number} app_id 
 * @param {number|null} user_account_id 
 * @param {string} ip
 * @param {string} headers_user_agent 
 * @param {string} headers_accept_language
 * @returns {Promise.<{  latitude:string,
 *              longitude:string,
 *               place:string,
 *               timezone:string}>}
 */
const socketConnectedUserDataGet = async (app_id, user_account_id, ip, headers_user_agent, headers_accept_language) =>{
    /**@type{import('./bff.js')} */
    const { bffServer } = await import(`file://${process.cwd()}/server/bff.js`);
    //get GPS from IP
    /**@type{server_bff_parameters}*/
    const parameters = {endpoint:'SERVER',
                        host:null,
                        url:'/bff/app_id/v1/geolocation/ip',
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
                                    .then((/**@type{*}*/result_gps)=>result_gps.http?null:result_gps.result)
                                    .catch(()=>null);
    const place = result_geodata?
                    (result_geodata.city + ', ' +
                    result_geodata.regionName + ', ' +
                    result_geodata.countryName):'';
    return {latitude:result_geodata?result_geodata.latitude ?? '':'',
            longitude:result_geodata?result_geodata.longitude ?? '':'',
            place:place,
            timezone:result_geodata?result_geodata.timezone ?? '':''};
};
/**
 * @name socketClientSend
 * @description Socket client send
 *              Used by SSE and closes connection
 * @function
 * @param {server_server_res} res
 * @param {string} message
 * @param {server_socket_broadcast_type_all} message_type
 * @returns {void}
 */
 const socketClientSend = (res, message, message_type) => {
    res.write (`data: ${Buffer.from(JSON.stringify({broadcast_type : message_type, broadcast_message: message})).toString('base64')}\n\n`);
    res.flush();
};
/**
 * @name socketClientGet
 * @description Socket client get client_id for given id token
 *              
 * @function
 * @param {string} idtoken
 * @returns {server_socket_connected_list['id']}
 */
const socketClientGet = idtoken => SOCKET_CONNECTED_CLIENTS.filter(client => client.authorization_bearer == idtoken)[0]?.id;
/**
 * @name socketClientConnect
 * @description Socket client connect
 *              Used by SSE and leaves connection open
 * @function
 * @param {server_server_res} res
 * @returns {void}
 */
 const socketClientConnect = (res) => {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
};
/**
 * @name socketClientOnClose
 * @description Socket client close
 *              Used by SSE and closes connection
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
 * @name socketClientAdd
 * @description Socket client add
 * @function
 * @param {server_socket_connected_list} newClient
 * @returns {void}
 */
const socketClientAdd = (newClient) => {
    SOCKET_CONNECTED_CLIENTS.push(newClient);
};

/**
 * @name socketConnectedUpdate
 * @description Socket connected update
 * @function
 * @param {number} app_id,
 * @param {{idToken:string,
 *          user_account_id:number|null,
 *          iam_user_id:number|null,
 *          iam_user_username:string|null,
 *          iam_user_type:'ADMIN'|'USER'|null,
 *          token_access:string|null,
 *          token_admin:string|null,
 *          ip:string,
 *          headers_user_agent:string,
 *          headers_accept_language:string}} parameters
 * @returns {Promise.<server_server_response>}
 */
 const socketConnectedUpdate = async (app_id, parameters) => {
    /**@type{import('./iam.js')} */
    const { iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
    if (SOCKET_CONNECTED_CLIENTS.filter(row=>row.authorization_bearer == parameters.idToken).length==0){
        return {http:401,
                code:'IAM',
                text:iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
        };
    }
    else{
        for (const connected of SOCKET_CONNECTED_CLIENTS){
            if (connected.authorization_bearer == parameters.idToken){
                const connectUserData =  await socketConnectedUserDataGet(app_id, parameters.user_account_id, parameters.ip, parameters.headers_user_agent, parameters.headers_accept_language);
                connected.connection_date = new Date().toISOString();
                connected.user_account_id = parameters.user_account_id;
                connected.token_access = parameters.token_access;
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
                                    Buffer.from(JSON.stringify({   client_id: connected.id, 
                                        latitude: connectUserData.latitude,
                                        longitude: connectUserData.longitude,
                                        place: connectUserData.place,
                                        timezone: connectUserData.timezone})).toString('base64')
                                    , 'CONNECTINFO');
            }
        }
        return {result:null, type:'JSON'};
    }
};
/**
 * @name socketConnectedGet
 * @description Socket check connected
 * @function
 * @param {number} user_account_id
 * @returns {server_socket_connected_list[]}
 */
 const socketConnectedGet = user_account_id => {
    return SOCKET_CONNECTED_CLIENTS.filter(client => client.user_account_id == user_account_id);
};

/**
 * @name socketAdminSend
 * @description Socket client send as admin
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number|null,
 *          idToken:string,
 *          data:{  app_id:number|null,
 *                  client_id:number|null,
 *                  broadcast_type:server_socket_broadcast_type_all,
 *                  broadcast_message:string}}} parameters
 * @returns {Promise.<server_server_response & {result?:{sent:number} }>}
 */
 const socketAdminSend = async parameters => {
    parameters.data.client_id = serverUtilNumberValue(parameters.data.client_id);

    if (parameters.data.broadcast_type=='ALERT' || parameters.data.broadcast_type=='MAINTENANCE'){
        //broadcast INFO or MAINTENANCE to all connected to given app_id 
        //except MAINTENANCE to admin and current user
        let sent = 0;
        for (const client of SOCKET_CONNECTED_CLIENTS){
            if (client.id != socketClientGet(parameters.idToken))
                if (parameters.data.broadcast_type=='MAINTENANCE' && client.app_id ==serverUtilNumberValue(Config.get('ConfigServer','SERVER', 'APP_ADMIN_APP_ID')))
                    null;
                else
                    if (client.app_id == parameters.data.app_id || parameters.data.app_id == null){
                        socketClientSend(client.response, parameters.data.broadcast_message, parameters.data.broadcast_type);
                        sent++;
                    }
        }
        return {result:{sent:sent}, type:'JSON'};
    }
    else
        if (parameters.data.broadcast_type=='CHAT' || parameters.data.broadcast_type=='PROGRESS'|| parameters.data.broadcast_type=='SESSION_EXPIRED'){
            //broadcast CHAT to specific client
            for (const client of SOCKET_CONNECTED_CLIENTS){
                if (client.id == parameters.data.client_id){
                    socketClientSend(client.response, parameters.data.broadcast_message, parameters.data.broadcast_type);
                    return {result:{sent:1}, type:'JSON'};
                }
            }
        }
    return {result:{sent:0}, type:'JSON'};
};
/**
 * @name socketConnectedList
 * @description Socket connected list
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{  select_app_id?:string|null,
 *                  offset?:string|null,
 *                  year?:string|null,
 *                  month?:string|null,
 *                  day?:string|null,
 *                  order_by?:string|null,
 *                  sort?:*}
 *          }} parameters
 * @returns{Promise.<server_server_response & {result?:server_socket_connected_list_no_res[]}>}
 */
 const socketConnectedList = async parameters => {
    const app_id_select = serverUtilNumberValue(parameters.data.select_app_id);
    /**@type{number|null} */
    const year = serverUtilNumberValue(parameters.data.year);
    /**@type{number|null} */
    const month = serverUtilNumberValue(parameters.data.month);
    /**@type{number|null} */
    const day= serverUtilNumberValue(parameters.data.day);
    /**@type{string} */
    const order_by = parameters.data.order_by ?? '';
    /**@type{server_socket_connected_list_sort} */
    const sort = parameters.data.sort;

    const order_by_num = order_by =='asc'?1:-1;
    return {result:SOCKET_CONNECTED_CLIENTS
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
                    }),
            type:'JSON'};
};
/**
 * @name socketAppServerFunctionSend
 * @description Sends message to given app having the correct authorization_header
 *              Used for sending server side event from an app server function
 * @function
 * @param {number} app_id
 * @param {string} idToken
 * @param {server_socket_broadcast_type_app_function} message_type
 * @param {string} message
 * @returns {Promise.<{sent:number}>}
 */
const socketAppServerFunctionSend = async (app_id, idToken, message_type, message) =>{

    const client = SOCKET_CONNECTED_CLIENTS.filter(client=>client.app_id == app_id && client.authorization_bearer == idToken);
    if (client.length == 1){
        socketClientSend(client[0].response, message, message_type);
        return {sent:1};
    }
    else
        return {sent:0};
};
/**
 * @name socketConnectedCount
 * @description Socket connected count
 * @function
 * @memberof ROUTE_REST_API
 * @param {{data:{  logged_in?:string|null}}} parameters
 * @returns {server_server_response & {result?:{count_connected:number} }}
 */
 const socketConnectedCount = parameters => {
    const logged_in = serverUtilNumberValue(parameters.data.logged_in);
    if (logged_in == 1)
        return {result:{count_connected:SOCKET_CONNECTED_CLIENTS.filter(connected =>  connected.iam_user_id != null).length}, type:'JSON'};
    else
        return {result:{count_connected:SOCKET_CONNECTED_CLIENTS.filter(connected =>connected.iam_user_id == null).length}, type:'JSON'};
};

/**
 * @name socketConnect
 * @description Socket connect
 *              Used by SSE and leaves connection open
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          idToken:string,
 *          authorization:string,
 *          user_agent:string,
 *          accept_language:string,
 *          ip:string,
 *          data:{res:server_server_res},
 *          }} parameters
 * @returns {Promise.<void>}
 */
 const socketConnect = async parameters =>{
    /**@type{import('./iam.js')} */
    const { iamUtilTokenGet } = await import(`file://${process.cwd()}/server/iam.js`);
    /**@type{import('./db/IamUser.js')} */
    const IamUser = await import(`file://${process.cwd()}/server/db/IamUser.js`);

    //get access token if any
    const access_token =    parameters.authorization?iamUtilTokenGet(   parameters.app_id,
                                            parameters.authorization, 
                                            parameters.app_id==serverUtilNumberValue(Config.get('ConfigServer','SERVER', 'APP_ADMIN_APP_ID'))?'ADMIN':'APP_ACCESS'):null;
    const user_account_id = parameters.authorization?serverUtilNumberValue(access_token?.user_account_id):null;
    const iam_user =        parameters.authorization?
                                (serverUtilNumberValue(access_token?.iam_user_id)?
                                    IamUser.get(parameters.app_id, serverUtilNumberValue(access_token?.iam_user_id)).result?.[0]:null):
                                        null;
    //no authorization for repeated request using same id token or requesting from browser
    if (SOCKET_CONNECTED_CLIENTS.filter(row=>row.authorization_bearer == parameters.idToken).length>0 ||parameters.data.res.req.headers['sec-fetch-mode']!='cors'){
        /**@type{import('./iam.js')} */
        const {iamUtilResponseNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
        throw iamUtilResponseNotAuthorized(parameters.data.res, 401, 'socketConnect, authorization', true);
    }
    else{
        const client_id = Date.now();
        socketClientConnect(parameters.data.res);
        socketClientOnClose(parameters.data.res, client_id);
    
        const connectUserData =  await socketConnectedUserDataGet(parameters.app_id, user_account_id, parameters.ip, parameters.user_agent, parameters.accept_language);
        /**@type{server_socket_connected_list} */
        const newClient = {
                            id:                     client_id,
                            connection_date:        new Date().toISOString(),
                            app_id:                 parameters.app_id,
                            authorization_bearer:   parameters.idToken,
                            user_account_id:        user_account_id,
                            token_access:           null,
                            iam_user_id:            iam_user?iam_user.id:null,
                            iam_user_username:      iam_user?iam_user.username:null,
                            iam_user_type:          iam_user?iam_user.type:null,
                            token_admin:            null,
                            gps_latitude:           connectUserData.latitude,
                            gps_longitude:          connectUserData.longitude,
                            place:                  connectUserData.place,
                            timezone:               connectUserData.timezone,
                            ip:                     parameters.ip,
                            user_agent:             parameters.user_agent,
                            response:               parameters.data.res
                        };
    
        socketClientAdd(newClient);
        //send message to client with data
        socketClientSend(parameters.data.res, Buffer.from(JSON.stringify({ latitude: connectUserData.latitude,
                                                                            longitude: connectUserData.longitude,
                                                                            place: connectUserData.place,
                                                                            timezone: connectUserData.timezone})).toString('base64'), 'CONNECTINFO');
    }
};

/**
 * @name socketIntervalCheck
 * @description Socket start setInterval to check maintenance and logout users with expired tokens using server side event
 * @function
 * @returns {void}
 */
 const socketIntervalCheck = () => {
    setInterval(() => {
        if (serverUtilNumberValue(Config.get('ConfigServer','METADATA','MAINTENANCE'))==1){
            socketAdminSend({   app_id:null,
                                idToken:'',
                                data:{app_id:null,
                                    client_id:null,
                                    broadcast_type:'MAINTENANCE',
                                    broadcast_message:''}}
                                );
        }
        socketExpiredTokensUpdate();
    //set default interval to 5 seconds if no parameter is set
    }, serverUtilNumberValue(Config.get('ConfigServer','SERVICE_SOCKET', 'CHECK_INTERVAL'))??5000);
};
/**
 * @name socketExpiredTokensUpdate
 * @description Sends SESSION_EXPIRED message to clients with expired token
 * @function
 * @returns {void}
 */
const socketExpiredTokensUpdate = () =>{
    for (const client of SOCKET_CONNECTED_CLIENTS){
        if ((client.token_access && iamUtilTokenExpired(client.app_id, 'APP_ACCESS', client.token_access)&&
            client.token_access && iamUtilTokenExpired(client.app_id, 'APP_ACCESS_VERIFICATION', client.token_access)) ||
            client.token_admin && iamUtilTokenExpired(client.app_id, 'ADMIN', client.token_admin)){
                client.iam_user_id=null;
                client.user_account_id=null;
                client.iam_user_type=null;
                client.iam_user_username=null;
                client.token_access=null;
                client.token_admin=null;
                socketClientSend(client.response, '', 'SESSION_EXPIRED');
            }
    }
};
/**
 * @name CheckOnline
 * @description Checks if user is online
 * @function
 * @memberof ROUTE_REST_API
 * @param {{resource_id :number|null}} parameters
 * @returns {server_server_response & {result?:{online:1|0} }}
 */
const CheckOnline = parameters => { /**@ts-ignore */
                                    return { result:parameters.resource_id?
                                                    (socketConnectedGet(parameters.resource_id).length>0?{online:1}:{online:0}):
                                                        {online:0}, 
                                            type:'JSON'};};

export {socketClientSend, socketClientGet, socketConnectedUpdate, socketConnectedGet, socketConnectedList, socketAdminSend, socketAppServerFunctionSend, socketConnectedCount, socketConnect, socketIntervalCheck, CheckOnline, socketExpiredTokensUpdate};
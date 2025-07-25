/** @module server/socket */

/**
 * @import {server_server_response,
 *          server_socket_broadcast_type_all, 
 *          server_socket_broadcast_type_admin,
 *          server_server_res,
 *          server_db_table_IamEncryption,
 *          server_db_table_IamAppIdToken,
 *          server_socket_connected_list, server_socket_connected_list_no_res, server_socket_connected_list_sort} from './types.js'
 */

const {serverResponse, serverUtilNumberValue} = await import('./server.js');
const {iamUtilTokenExpired, iamUtilMessageNotAuthorized} = await import('./iam.js');
const ConfigServer = await import('./db/ConfigServer.js');
const {microserviceRequest} = await import('../serviceregistry/microservice.js');

/**@type{server_socket_connected_list[]} */
let SOCKET_CONNECTED_CLIENTS = [];

/**
 * @name socketConnectedUserDataGet
 * @description Get geodata and user account data for connected user
 * @function
 * @param {number} app_id 
 * @param {string} ip
 * @param {string} headers_user_agent 
 * @param {string} headers_accept_language
 * @returns {Promise.<{  latitude:string,
 *              longitude:string,
 *               place:string,
 *               timezone:string}>}
 */
const socketConnectedUserDataGet = async (app_id, ip, headers_user_agent, headers_accept_language) =>{
    //get GPS from IP
    const result_geodata = await microserviceRequest({  app_id:app_id,
                                                        microservice:'GEOLOCATION',
                                                        service:'IP', 
                                                        method:'GET',
                                                        data:{ip:ip},
                                                        ip:ip,
                                                        user_agent:headers_user_agent,
                                                        accept_language:headers_accept_language,
                                                        endpoint:'SERVER'
                                                    })
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
 * @name socketClientGet
 * @description Socket client get client_id for given id token
 *              
 * @function
 * @param {string} idtoken
 * @returns {server_socket_connected_list}
 */
const socketClientGet = idtoken => SOCKET_CONNECTED_CLIENTS.filter(client => client.idToken == idtoken)[0];

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
 *          app_only?:boolean|null,
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
    if (SOCKET_CONNECTED_CLIENTS.filter(row=>row.idToken == parameters.idToken).length==0){
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
            if (connected.idToken == parameters.idToken){
                if (parameters.app_only == true){
                    connected.app_id = app_id;
                    connected.ip = parameters.ip;
                    connected.user_agent = parameters.headers_user_agent;
                }
                else{
                    const connectUserData =  await socketConnectedUserDataGet(app_id, parameters.ip, parameters.headers_user_agent, parameters.headers_accept_language);
                    connected.app_id = app_id;
                    connected.connection_date = new Date().toISOString();
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
                    socketClientPostMessage({   app_id:app_id,
                                                resource_id:connected.id,
                                                data:{  data_app_id:null,
                                                        iam_user_id:null,
                                                        idToken:null,
                                                        message:JSON.stringify({client_id:  connected.id, 
                                                                                latitude:   connectUserData.latitude,
                                                                                longitude:  connectUserData.longitude,
                                                                                place:      connectUserData.place,
                                                                                timezone:   connectUserData.timezone}),
                                                        message_type:'CONNECTINFO'}});
                }
            }
        }
        return {result:null, type:'JSON'};
    }
};

/**
 * @name socketAdminSend
 * @description Socket client send as admin
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          idToken:string,
 *          data:{  app_id:number|null,
 *                  client_id:number|null,
 *                  broadcast_type:server_socket_broadcast_type_admin,
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
            if (client.idToken != parameters.idToken)
                if (parameters.data.broadcast_type=='MAINTENANCE' && client.app_id ==serverUtilNumberValue(ConfigServer.get({app_id:parameters.app_id, data:{config_group:'SERVICE_APP', parameter:'APP_ADMIN_APP_ID'}}).result))
                    null;
                else
                    if (client.app_id == parameters.data.app_id || parameters.data.app_id == null){
                        socketClientPostMessage({   app_id:parameters.app_id,
                                                    resource_id:client.id,
                                                    data:{  data_app_id:null,
                                                            iam_user_id:null,
                                                            idToken:null,
                                                            message:parameters.data.broadcast_message,
                                                            message_type:parameters.data.broadcast_type}});
                        sent++;
                    }
        }
        return {result:{sent:sent}, type:'JSON'};
    }
    else
        if (parameters.data.broadcast_type=='CHAT'){
            //broadcast CHAT to specific client
            for (const client of SOCKET_CONNECTED_CLIENTS){
                if (client.id == parameters.data.client_id){
                    socketClientPostMessage({   app_id:parameters.app_id,
                                                resource_id:client.id,
                                                data:{  data_app_id:null,
                                                        iam_user_id:null,
                                                        idToken:null,
                                                        message:parameters.data.broadcast_message,
                                                        message_type:parameters.data.broadcast_type}});
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
 *          data:{  data_app_id?:string|null,
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
    const app_id_select = serverUtilNumberValue(parameters.data.data_app_id);
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
                                authorization_bearer:   client.idToken,
                                iam_user_id:            client.iam_user_id,
                                iam_user_username:      client.iam_user_username,
                                iam_user_type:          client.iam_user_type,
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
 * @param {{app_id:number,
 *          idToken:string,
 *          authorization:string,
 *          uuid:string|null,
 *          user_agent:string,
 *          accept_language:string,
 *          ip:string,
 *          response:server_server_res
 *          }} parameters
 * @returns {Promise.<{ insertId:number,
 *                      latitude:string,
 *                      longitude: string,
 *                      place: string,
 *                      timezone: string}>}
 */
const socketPost = async parameters =>{
    const { iamUtilTokenGet } = await import('./iam.js');
    const IamUser = await import('./db/IamUser.js');

    //get access token if any
    const access_token =    parameters.authorization?iamUtilTokenGet(   parameters.app_id,
                                            parameters.authorization, 
                                            parameters.app_id==serverUtilNumberValue(ConfigServer.get({app_id:parameters.app_id, data:{config_group:'SERVICE_APP', parameter:'APP_ADMIN_APP_ID'}}).result)?'ADMIN':'APP_ACCESS'):null;

    const iam_user =        parameters.authorization?
                                /**@ts-ignore */
                                (serverUtilNumberValue(access_token?.iam_user_id)?
                                    /*@ts-ignore*/
                                    IamUser.get(parameters.app_id, serverUtilNumberValue(access_token?.iam_user_id)).result?.[0]:null):
                                        null;
    if (SOCKET_CONNECTED_CLIENTS
            .filter(row=>row.idToken == parameters.idToken).length>0){
        const {iamUtilResponseNotAuthorized} = await import('./iam.js');
        throw await iamUtilResponseNotAuthorized(parameters.response, 401, 'socketConnect, authorization', true);
    }
    else{
        const client_id = Date.now();
        
        parameters.response.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        parameters.response.setHeader('Cache-control', 'no-cache');
        parameters.response.setHeader('Connection', 'keep-alive');

        parameters.response.on('close', ()=>{
            SOCKET_CONNECTED_CLIENTS = SOCKET_CONNECTED_CLIENTS.filter(client => client.id !== client_id);
            parameters.response.end();
        });
    
        const connectUserData =  await socketConnectedUserDataGet(  parameters.app_id, 
                                                                    parameters.ip, 
                                                                    parameters.user_agent, 
                                                                    parameters.accept_language);
        /**@type{server_socket_connected_list} */
        const newClient = {
                            id:                     client_id,
                            connection_date:        new Date().toISOString(),
                            app_id:                 parameters.app_id,
                            idToken:                parameters.idToken,
                            uuid:                   parameters.uuid,
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
                            response:               parameters.response
                        };
    
        socketClientAdd(newClient);
        return {    insertId:client_id,
                    latitude:connectUserData.latitude,
                    longitude: connectUserData.longitude,
                    place: connectUserData.place,
                    timezone:connectUserData.timezone};
    }
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
 *          resource_id:string|null,
 *          user_agent:string,
 *          accept_language:string,
 *          ip:string,
 *          response:server_server_res
 *          }} parameters
 * @returns {Promise.<void>}
 */
 const socketConnect = async parameters =>{   
    const connectUserData = await socketPost({  app_id:parameters.app_id,
                                                idToken:parameters.idToken,
                                                authorization:parameters.authorization,
                                                uuid:parameters.resource_id,
                                                user_agent:parameters.user_agent,
                                                accept_language:parameters.accept_language,
                                                ip:parameters.ip,
                                                response:parameters.response
                                                });
    //send CONNECTINFO message
    socketClientPostMessage({   app_id:parameters.app_id,
                                resource_id:connectUserData.insertId,
                                data:{  data_app_id:null,
                                        iam_user_id:null,
                                        idToken:null,
                                        message:JSON.stringify({latitude: connectUserData.latitude,
                                                                longitude: connectUserData.longitude,
                                                                place: connectUserData.place,
                                                                timezone: connectUserData.timezone}),
                                        message_type:'CONNECTINFO'}});
};

/**
 * @name socketIntervalCheck
 * @description Socket start setInterval to check maintenance and logout users with expired tokens using server side event
 * @function
 * @returns {Promise.<void>}
 */
 const socketIntervalCheck = async () => {
    setInterval(async () => {
        //server interval run as app 0
        if (serverUtilNumberValue(ConfigServer.get({app_id:0, data:{config_group:'METADATA',parameter:'MAINTENANCE'}}).result)==1){
            await socketAdminSend({ app_id:0,
                                    idToken:'',
                                    data:{app_id:null,
                                        client_id:null,
                                        broadcast_type:'MAINTENANCE',
                                        broadcast_message:''}}
                                    );
        }
        await socketExpiredTokensUpdate();
    //set default interval to 5 seconds if no parameter is set
    }, serverUtilNumberValue(ConfigServer.get({app_id:0, data:{config_group:'SERVICE_SOCKET', parameter:'CHECK_INTERVAL'}}).result)??5000);
};

/**
 * @name socketExpiredTokensUpdate
 * @description Sends SESSION_EXPIRED message to clients with expired token
 * @function
 * @returns {Promise.<void>}
 */
const socketExpiredTokensUpdate = async () =>{
    for (const client of SOCKET_CONNECTED_CLIENTS){
        if ((client.token_access && iamUtilTokenExpired(client.app_id, 'APP_ACCESS', client.token_access)&&
            client.token_access && iamUtilTokenExpired(client.app_id, 'APP_ACCESS_VERIFICATION', client.token_access)) ||
            client.token_admin && iamUtilTokenExpired(client.app_id, 'ADMIN', client.token_admin)){
                client.iam_user_id=null;
                client.iam_user_type=null;
                client.iam_user_username=null;
                client.token_access=null;
                client.token_admin=null;
                socketClientPostMessage({   app_id:0,
                                            resource_id:client.id,
                                            data:{  data_app_id:null,
                                                    iam_user_id:null,
                                                    idToken:null,
                                                    message:'',
                                                    message_type:'SESSION_EXPIRED'}});
            }
    }
};
/**
 * @name CheckOnline
 * @description Checks if user is online
 * @function
 * @memberof ROUTE_REST_API
 * @param {{resource_id :number|null}} parameters
 * @returns {server_server_response & {result:{online:1|0} }}
 */
const CheckOnline = parameters => { 
                                    /**@ts-ignore */
                                    return { result:parameters.resource_id?
                                                (SOCKET_CONNECTED_CLIENTS
                                                    .filter(client => client.iam_user_id == parameters.resource_id).length>0?
                                                        {online:1}:
                                                            {online:0}):
                                                    {online:0}, 
                                            type:'JSON'};};
/**
 * @name socketClientPostMessage
 * @decription Post message for given client_id, app_id, iam_user_id or idToken or for admin: all or for all given app id
 * @function
 * @param {{app_id:Number,
 *          resource_id:number|null,
 *          data:{  data_app_id:number|null,
 *                  iam_user_id:number|null,
 *                  idToken:string|null,
 *                  message:String,
 *                  message_type:server_socket_broadcast_type_all}}} parameters
 */
const socketClientPostMessage = async parameters => {
    const Security = await import('./security.js');
    const IamEncryption = await import('./db/IamEncryption.js');
    const IamAppIdToken = await import ('./db/IamAppIdToken.js');
    for (const client of SOCKET_CONNECTED_CLIENTS
                        .filter(row=>
                            row.id == (parameters.resource_id??row.id) &&
                            row.app_id == (parameters.data.data_app_id ?? row.app_id) && 
                            row.iam_user_id == (parameters.data.iam_user_id ?? row.iam_user_id) && 
                            row.idToken == (parameters.data.idToken ?? row.idToken) 
                        )){
        //get id for token in the record found
        const token_id = IamAppIdToken.get({  app_id:parameters.app_id, 
                                        resource_id:null, 
                                        data:{data_app_id:null}}).result
                    .filter((/**@type{server_db_table_IamAppIdToken}*/row)=>row.token == client.idToken)?.[0].id;
        //get secrets from IamEncryption using uuid saved at record creation and token id
        const {jwk, iv} = IamEncryption.get({app_id:parameters.app_id, resource_id:null, data:{data_app_id:null}}). result
                            .filter((/**@type{server_db_table_IamEncryption}*/row)=>
                                row.uuid == client.uuid && 
                                row.iam_app_id_token_id == token_id)
                            .map((/**@type{server_db_table_IamEncryption}*/row)=>{
                                return {jwk:JSON.parse(atob(row.secret)).jwk,
                                        iv:JSON.parse(atob(row.secret)).iv
                                };
                            })[0];
        //encrypt message using secrets for curent app id and token found in IamEncryption
        const encrypted = 'data: ' + (await Security.securityTransportEncrypt({   
                                        app_id: parameters.app_id,
                                        data:   Buffer.from(JSON.stringify({   
                                                            sse_type :    parameters.data.message_type, 
                                                            sse_message:  parameters.data.message}))
                                                        .toString('base64'),
                                        jwk:    jwk,
                                        iv:     iv})) + '\n\n';
                                    
        
        await serverResponse ({
            app_id:null,
            type:'JSON',
            result:'',
            route:null,
            method:'',
            statusMessage:'',
            statusCode:200,
            sse_message:encrypted,
            res:client.response});
    }
};
export {socketClientGet, socketConnectedUpdate, socketConnectedList, socketConnectedCount, socketPost, socketConnect, 
        socketAdminSend, 
        socketIntervalCheck, socketExpiredTokensUpdate, CheckOnline, 
        socketClientPostMessage};
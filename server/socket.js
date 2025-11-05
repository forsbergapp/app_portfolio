/** @module server/socket */

/**
 * @import {server} from './types.js'
 */

const {server} = await import('./server.js');
const {commonGeodataUser} = await import('../apps/common/src/common.js')

/**@type{server['socket']['SocketConnectedServer'][]} */
let SOCKET_CONNECTED_CLIENTS = [];

/**
 * @name socketClientGet
 * @description Socket client get client_id for given id token
 *              
 * @function
 * @param {string} idtoken
 * @returns {server['socket']['SocketConnectedServer']}
 */
const socketClientGet = idtoken => SOCKET_CONNECTED_CLIENTS.filter(client => client.IdToken == idtoken)[0];

/**
 * @name socketClientAdd
 * @description Socket client add
 * @function
 * @param {server['socket']['SocketConnectedServer']} newClient
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
 * @returns {Promise.<server['server']['response']>}
 */
 const socketConnectedUpdate = async (app_id, parameters) => {
    if (SOCKET_CONNECTED_CLIENTS.filter(row=>row.IdToken == parameters.idToken).length==0){
        return {http:401,
                code:'IAM',
                text:server.iam.iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
        };
    }
    else{
        for (const connected of SOCKET_CONNECTED_CLIENTS){
            if (connected.IdToken == parameters.idToken){
                if (parameters.app_only == true){
                    connected.AppId = app_id;
                    connected.Ip = parameters.ip;
                    connected.UserAgent = parameters.headers_user_agent;
                }
                else{
                    const connectUserData =  await commonGeodataUser(app_id, parameters.ip);
                    connected.TokenAccess = parameters.token_access;
                    connected.IamUserUsername = parameters.iam_user_username;
                    connected.IamUserType = parameters.iam_user_type;
                    connected.TokenAdmin = parameters.token_admin;
                    connected.GpsLatitude = connectUserData.latitude;
                    connected.GpsLongitude = connectUserData.longitude;
                    connected.Place = connectUserData.place;
                    connected.Timezone = connectUserData.timezone;
                    connected.Created = new Date().toISOString();
                    connected.AppId = app_id;
                    connected.IamUserid = parameters.iam_user_id;
                    //send message to client with updated data
                    socketClientPostMessage({   app_id:app_id,
                                                resource_id:connected.Id,
                                                data:{  data_app_id:null,
                                                        iam_user_id:null,
                                                        idToken:null,
                                                        message:JSON.stringify({client_id:  connected.Id, 
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
 *                  broadcast_type: Extract<server['socket']['broadcast_type'],'CHAT'|'ALERT'|'MAINTENANCE'>,
 *                  broadcast_message:string}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{sent:number} }>}
 */
 const socketAdminSend = async parameters => {
    parameters.data.client_id = server.ORM.UtilNumberValue(parameters.data.client_id);

    if (parameters.data.broadcast_type=='ALERT' || parameters.data.broadcast_type=='MAINTENANCE'){
        //broadcast INFO or MAINTENANCE to all connected to given app_id 
        //except MAINTENANCE to admin and current user
        let sent = 0;
        for (const client of SOCKET_CONNECTED_CLIENTS){
            if (client.IdToken != parameters.idToken)
                if (parameters.data.broadcast_type=='MAINTENANCE' && 
                    client.AppId ==server.ORM.UtilNumberValue(server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{parameter:'APP_ADMIN_APP_ID'}}).result))
                    null;
                else
                    if (client.AppId == parameters.data.app_id || parameters.data.app_id == null){
                        socketClientPostMessage({   app_id:parameters.app_id,
                                                    resource_id:client.Id,
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
                if (client.Id == parameters.data.client_id){
                    socketClientPostMessage({   app_id:parameters.app_id,
                                                resource_id:client.Id,
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
 * @returns{Promise.<server['server']['response'] & {result?:server['socket']['SocketConnectedClient'][]}>}
 */
 const socketConnectedList = async parameters => {
    const app_id_select = server.ORM.UtilNumberValue(parameters.data.data_app_id);
    /**@type{number|null} */
    const year = server.ORM.UtilNumberValue(parameters.data.year);
    /**@type{number|null} */
    const month = server.ORM.UtilNumberValue(parameters.data.month);
    /**@type{number|null} */
    const day= server.ORM.UtilNumberValue(parameters.data.day);
    /**@type{string} */
    const order_by = parameters.data.order_by ?? '';
    /**@type{keyof server['socket']['SocketConnectedClient']} */
    const sort = parameters.data.sort;

    const order_by_num = order_by =='asc'?1:-1;
    return {result:SOCKET_CONNECTED_CLIENTS
                    .filter(client =>
                        //filter rows
                        (client.AppId == app_id_select || app_id_select==null) &&
                        parseInt(client.Created.substring(0,4)) == year && 
                        parseInt(client.Created.substring(5,7)) == month &&
                        parseInt(client.Created.substring(8,10)) == day
                        )
                    .map(client=>{
                        return {Id:                 client.Id,
                                IdToken:            client.IdToken,
                                IamUserUsername:    client.IamUserUsername,
                                IamUserType:        client.IamUserType,
                                Created:            client.Created,
                                GpsLatitude:        client.GpsLatitude ?? '',
                                GpsLongitude:       client.GpsLongitude ?? '',
                                Place:              client.Place ?? '',
                                Timezone:           client.Timezone ?? '',
                                Ip:                 client.Ip,
                                UserAgent:          client.UserAgent,
                                AppId:              client.AppId, 
                                IamUserid:          client.IamUserid};
                    })
                    //sort result
                    .sort((first, second)=>{
                        //sort default is connection_date if sort missing as argument
                        if (typeof first[sort==null?'Created':sort] == 'number'){
                            //number sort
                            const first_sort_num = first[sort==null?'Created':sort];
                            const second_sort_num = second[sort==null?'Created':sort];
                            if ((first_sort_num??0) < (second_sort_num??0) )
                                return -1 * order_by_num;
                            else if ((first_sort_num??0) > (second_sort_num??0))
                                return 1 * order_by_num;
                            else
                                return 0;
                        }
                        else{
                            //string sort with lowercase and localcompare
                            const first_sort = (first[sort==null?'Created':sort] ?? '').toString().toLowerCase();
                            const second_sort = (second[sort==null?'Created':sort] ?? '').toString().toLowerCase();
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
 * @returns {server['server']['response'] & {result?:{count_connected:number} }}
 */
 const socketConnectedCount = parameters => {
    const logged_in = server.ORM.UtilNumberValue(parameters.data.logged_in);
    if (logged_in == 1)
        return {result:{count_connected:SOCKET_CONNECTED_CLIENTS.filter(connected =>  connected.IamUserid != null).length}, type:'JSON'};
    else
        return {result:{count_connected:SOCKET_CONNECTED_CLIENTS.filter(connected =>connected.IamUserid== null).length}, type:'JSON'};
};

/**
 * @param {{app_id:number,
 *          idToken:string,
 *          authorization:string,
 *          uuid:string|null,
 *          user_agent:string,
 *          ip:string,
 *          response:server['server']['res']
 *          }} parameters
 * @returns {Promise.<{ insertId:number,
 *                      latitude:string,
 *                      longitude: string,
 *                      place: string,
 *                      timezone: string}>}
 */
const socketPost = async parameters =>{
    //get access token if any
    const access_token =    parameters.authorization?server.iam.iamUtilTokenGet(   parameters.app_id,
                                            parameters.authorization, 
                                            parameters.app_id==server.ORM.UtilNumberValue(server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{parameter:'APP_ADMIN_APP_ID'}}).result)?'ADMIN':'APP_ACCESS'):null;

    const iam_user =        parameters.authorization?
                                /**@ts-ignore */
                                (server.ORM.UtilNumberValue(access_token?.iam_user_id)?
                                    /*@ts-ignore*/
                                    server.ORM.db.IamUser.get(parameters.app_id, server.ORM.UtilNumberValue(access_token?.iam_user_id)).result?.[0]:null):
                                        null;
    if (SOCKET_CONNECTED_CLIENTS
            .filter(row=>row.IdToken == parameters.idToken).length>0){
        throw await server.iam.iamUtilResponseNotAuthorized(parameters.response, 401, 'socketConnect, authorization', true);
    }
    else{
        const client_id = Date.now();
        
        parameters.response.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        parameters.response.setHeader('Cache-control', 'no-cache');
        parameters.response.setHeader('Connection', 'keep-alive');

        parameters.response.on('close', ()=>{
            SOCKET_CONNECTED_CLIENTS = SOCKET_CONNECTED_CLIENTS.filter(client => client.Id !== client_id);
            parameters.response.end();
        });
        const connectUserData =  await commonGeodataUser(  parameters.app_id, parameters.ip);
        /**@type{server['socket']['SocketConnectedServer']} */
        const newClient = {
                            Id:                 client_id,
                            IdToken:            parameters.idToken,
                            Uuid:               parameters.uuid,
                            TokenAccess:        null,
                            IamUserUsername:    iam_user?iam_user.username:null,
                            IamUserType:        iam_user?iam_user.type:null,
                            TokenAdmin:         null,
                            GpsLatitude:        connectUserData.latitude,
                            GpsLongitude:       connectUserData.longitude,
                            Place:              connectUserData.place,
                            Timezone:           connectUserData.timezone,
                            Ip:                 parameters.ip,
                            UserAgent:          parameters.user_agent,
                            Response:           parameters.response,
                            Created:            new Date().toISOString(),
                            AppId:              parameters.app_id,
                            IamUserid:          iam_user?iam_user.id:null
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
 *          ip:string,
 *          response:server['server']['res']
 *          }} parameters
 * @returns {Promise.<void>}
 */
 const socketConnect = async parameters =>{   
    const connectUserData = await socketPost({  app_id:parameters.app_id,
                                                idToken:parameters.idToken,
                                                authorization:parameters.authorization,
                                                uuid:parameters.resource_id,
                                                user_agent:parameters.user_agent,
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
        if (server.ORM.UtilNumberValue(server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{parameter:'SERVER_MAINTENANCE'}}).result)==1){
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
    }, server.ORM.UtilNumberValue(server.ORM.db.OpenApi.getViewConfig({app_id:0, data:{parameter:'SOCKET_CHECK_INTERVAL'}}).result)??5000);
};

/**
 * @name socketExpiredTokensUpdate
 * @description Sends SESSION_EXPIRED message to clients with expired token
 * @function
 * @returns {Promise.<void>}
 */
const socketExpiredTokensUpdate = async () =>{
    for (const client of SOCKET_CONNECTED_CLIENTS){
        if ((client.TokenAccess && server.iam.iamUtilTokenExpired(client.AppId, 'APP_ACCESS', client.TokenAccess)&&
            client.TokenAccess && server.iam.iamUtilTokenExpired(client.AppId, 'APP_ACCESS_VERIFICATION', client.TokenAccess)) ||
            client.TokenAdmin && server.iam.iamUtilTokenExpired(client.AppId, 'ADMIN', client.TokenAdmin)){
                client.IamUserid=null;
                client.IamUserType=null;
                client.IamUserUsername=null;
                client.TokenAccess=null;
                client.TokenAdmin=null;
                socketClientPostMessage({   app_id:0,
                                            resource_id:client.Id,
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
 * @returns {server['server']['response'] & {result:{online:1|0} }}
 */
const CheckOnline = parameters => { 
                                    /**@ts-ignore */
                                    return { result:parameters.resource_id?
                                                (SOCKET_CONNECTED_CLIENTS
                                                    .filter(client => client.IamUserid == parameters.resource_id).length>0?
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
 *                  message_type:server['socket']['broadcast_type']}}} parameters
 */
const socketClientPostMessage = async parameters => {

    for (const client of SOCKET_CONNECTED_CLIENTS
                        .filter(row=>
                            row.Id == (parameters.resource_id??row.Id) &&
                            row.AppId == (parameters.data.data_app_id ?? row.AppId) && 
                            row.IamUserid == (parameters.data.iam_user_id ?? row.IamUserid) && 
                            row.IdToken == (parameters.data.idToken ?? row.IdToken) 
                        )){
        //get id for token in the record found
        const token_id = server.ORM.db.IamAppIdToken.get({  app_id:parameters.app_id, 
                                        resource_id:null, 
                                        data:{data_app_id:null}}).result
                    .filter((/**@type{server['ORM']['Object']['IamAppIdToken']}*/row)=>row.Token == client.IdToken)?.[0].Id;
        //get secrets from IamEncryption using uuid saved at record creation and token id
        const {jwk, iv} = server.ORM.db.IamEncryption.get({app_id:parameters.app_id, resource_id:null, data:{data_app_id:null}}). result
                            .filter((/**@type{server['ORM']['Object']['IamEncryption']}*/row)=>
                                row.Uuid == client.Uuid && 
                                row.IamAppIdTokenId == token_id)
                            .map((/**@type{server['ORM']['Object']['IamEncryption']}*/row)=>{
                                return {jwk:JSON.parse(atob(row.Secret)).jwk,
                                        iv:JSON.parse(atob(row.Secret)).iv
                                };
                            })[0];
        //encrypt message using secrets for curent app id and token found in IamEncryption
        const encrypted = 'data: ' + (await server.security.securityTransportEncrypt({   
                                        app_id: parameters.app_id,
                                        data:   Buffer.from(JSON.stringify({   
                                                            sse_type :    parameters.data.message_type, 
                                                            sse_message:  parameters.data.message}))
                                                        .toString('base64'),
                                        jwk:    jwk,
                                        iv:     iv})) + '\n\n';
                                    
        
        await server.response ({
            app_id:null,
            type:'JSON',
            result:'',
            route:null,
            statusMessage:'',
            statusCode:200,
            sse_message:encrypted,
            res:client.Response});
    }
};
export {socketClientGet, socketConnectedUpdate, socketConnectedList, socketConnectedCount, socketPost, socketConnect, 
        socketAdminSend, 
        socketIntervalCheck, socketExpiredTokensUpdate, CheckOnline, 
        socketClientPostMessage};
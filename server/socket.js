/** @module server/socket */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import(`file://${process.cwd()}/server/socket.service.js`);

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
const {iam_decode} = await import(`file://${process.cwd()}/server/iam.service.js`);

/**
 * Updates socket connection info removing user_id, systemadmin, token_access and token_systemadmin
 * @param {number} app_id
 * @param {string} iam
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {Types.res} res
 * @returns 
 */
 const ConnectedUpdate = (app_id, iam, ip, user_agent, accept_language, res) => service.ConnectedUpdate(app_id, 
                                                                                                        getNumberValue(iam_decode(iam).get('client_id')), 
                                                                                                        null, 
                                                                                                        null,
                                                                                                        iam_decode(iam).get('authorization_bearer'),
                                                                                                        null,
                                                                                                        null,
                                                                                                        ip,
                                                                                                        user_agent,
                                                                                                        accept_language,
                                                                                                        res);
/**
 * 
 * @param {number} resource_id 
 */
const CheckOnline = resource_id =>service.ConnectedGet(resource_id).length>0?{online:1}:{online:0};

/**
 * 
 * @param {*} data 
 */
const SocketSendSystemAdmin = (data) =>service.SocketSendSystemAdmin(   getNumberValue(data.app_id), 
                                                                        getNumberValue(data.client_id), 
                                                                        getNumberValue(data.client_id_current),
                                                                        data.broadcast_type, 
                                                                        data.broadcast_message);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const ConnectedListSystemadmin = (app_id, query) =>{
    return new Promise((resolve, reject)=>{
        service.ConnectedList(  app_id, getNumberValue(query.get('select_app_id')), 
                                        getNumberValue(query.get('limit')), 
                                        getNumberValue(query.get('year')), 
                                        getNumberValue(query.get('month')), 
                                        query.get('order_by'), 
                                        query.get('sort'),  
                                        1)
        .then ((/**@type{Types.socket_connect_list_no_res[]} */result)=>{
            if (result && result.length>0)
                resolve(result);
            else
                reject('Record not found');
        });
    });
};

/**
 * 
 * @param {*} data 
 * @returns 
 */
const SocketSendAdmin = (data) => service.SocketSendAdmin(  getNumberValue(data.app_id), 
                                                            getNumberValue(data.client_id), 
                                                            getNumberValue(data.client_id_current),
                                                            data.broadcast_type, 
                                                            data.broadcast_message);
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {Types.res} res
 * @returns 
 */
const ConnectedListAdmin = (app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.ConnectedList(  app_id, getNumberValue(query.get('select_app_id')), 
                                        getNumberValue(query.get('limit')), 
                                        getNumberValue(query.get('year')), 
                                        getNumberValue(query.get('month')), 
                                        query.get('order_by'), 
                                        query.get('sort'), 0)
        .then ((/**@type{Types.socket_connect_list_no_res[]} */result)=>{
            if (result && result.length>0)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found( app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * 
 * @param {*} query 
 * @returns 
 */
const ConnectedCount = (query) => service.ConnectedCount(   getNumberValue(query.get('identity_provider_id')), 
                                                            getNumberValue(query.get('logged_in')));
                                                            
/**
 * 
 * @param {number} app_id 
 * @param {string} iam
 * @param {string} ip  
 * @param {string} user_agent 
 * @param {string} accept_language 
 * @param {Types.res} res
 */
const SocketConnect = (app_id, iam, ip, user_agent, accept_language, res) => service.SocketConnect( app_id, 
                                                                                                    getNumberValue(iam_decode(iam).get('user_id')),
                                                                                                    iam_decode(iam).get('system_admin'),
                                                                                                    iam_decode(iam).get('authorization_bearer'),
                                                                                                    user_agent,
                                                                                                    accept_language,
                                                                                                    ip,
                                                                                                    res); 

export{ConnectedUpdate, CheckOnline, SocketSendSystemAdmin, ConnectedListSystemadmin, SocketSendAdmin, ConnectedListAdmin, ConnectedCount, SocketConnect};
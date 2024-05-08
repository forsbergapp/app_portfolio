/** @module server/socket */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import(`file://${process.cwd()}/server/socket.service.js`);

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * @param {number} resource_id
 * @param {*} query 
 * @returns 
 */
const ConnectedUpdate = (resource_id, query) => service.ConnectedUpdate( resource_id, 
                                                            getNumberValue(query.get('user_account_logon_user_account_id')), 
                                                            query.get('system_admin'), 
                                                            getNumberValue(query.get('identity_provider_id')), 
                                                            query.get('latitude'), 
                                                            query.get('longitude'));
/**
 * 
 * @param {*} query 
 */
const ConnectedCheck = (query) =>service.ConnectedCheck(getNumberValue(query.get('user_account_id')));

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
                                                            getNumberValue(query.get('count_logged_in')));
                                                            
/**
 * 
 * @param {number} app_id 
 * @param {string} ip  
 * @param {string} user_agent 
 * @param {*} query
 * @param {Types.res} res
 */

const SocketConnect = (app_id, ip, user_agent, query, res) => service.SocketConnect(app_id, 
                                                                                    getNumberValue(query.get('identity_provider_id')),
                                                                                    getNumberValue(query.get('user_account_logon_user_account_id')),
                                                                                    query.get('system_admin'),
                                                                                    query.get('latitude'),
                                                                                    query.get('longitude'),
                                                                                    query.get('authorization'),
                                                                                    user_agent,
                                                                                    ip,
                                                                                    res); 

export{ConnectedUpdate, ConnectedCheck, SocketSendSystemAdmin, ConnectedListSystemadmin, SocketSendAdmin, ConnectedListAdmin, ConnectedCount, SocketConnect};
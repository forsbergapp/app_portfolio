/** @module server/socket */

/**@type{import('./server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{import('./socket.service.js')} */
const service = await import(`file://${process.cwd()}/server/socket.service.js`);
/**@type{import('./iam.service.js')} */
const {iam_decode} = await import(`file://${process.cwd()}/server/iam.service.js`);

/**
 * Updates socket connection info removing user_id, systemadmin, token_access and token_systemadmin
 * @param {number} app_id
 * @param {string} iam
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {import('../types.js').server_server_res} res
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
const ConnectedListSystemadmin = (app_id, query) =>service.ConnectedList(   app_id, 
                                                                            getNumberValue(query.get('select_app_id')), 
                                                                            getNumberValue(query.get('limit')), 
                                                                            getNumberValue(query.get('year')), 
                                                                            getNumberValue(query.get('month')), 
                                                                            getNumberValue(query.get('day')), 
                                                                            query.get('order_by'), 
                                                                            query.get('sort'),  
                                                                            1);

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
 * @returns 
 */
const ConnectedListAdmin = (app_id, query) =>service.ConnectedList(app_id, 
                                                                        getNumberValue(query.get('select_app_id')), 
                                                                        getNumberValue(query.get('limit')), 
                                                                        getNumberValue(query.get('year')), 
                                                                        getNumberValue(query.get('month')), 
                                                                        getNumberValue(query.get('day')), 
                                                                        query.get('order_by'), 
                                                                        query.get('sort'), 0);
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
 * @param {import('../types.js').server_server_res} res
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
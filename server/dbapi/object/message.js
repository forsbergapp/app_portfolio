/** @module server/dbapi/object/message */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/message.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 */
const getMessage = (app_id, query) => service.getMessage(app_id, getNumberValue(query.get('data_app_id')), query.get('code'), query.get('lang_code'))
                                        .catch((/**@type{Types.error}*/error)=>{throw error;});

export{getMessage};
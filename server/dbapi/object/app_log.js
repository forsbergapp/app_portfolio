/** @module server/dbapi/object/app_log */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_log.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query
 * @param {Types.res} res
 * @returns Promise.<{Types.db_result_app_log_getLogsAdmin[]}>
 */
const getLogsAdmin = (app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getLogsAdmin(   app_id, getNumberValue(query.get('select_app_id')), getNumberValue(query.get('year')), getNumberValue(query.get('month')), 
                                getNumberValue(query.get('sort')), query.get('order_by'), getNumberValue(query.get('offset')), getNumberValue(query.get('limit')))
        .then((/**@type{Types.db_result_app_log_getLogsAdmin[]}*/result) =>{
            if (result.length>0)
                resolve(result);
            else{
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {Types.res} res
 * @returns Promise.<{Types.db_result_app_log_getStatUniqueVisitorAdmin[]}>
 */
const getStatUniqueVisitorAdmin = (app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getStatUniqueVisitorAdmin(app_id, getNumberValue(query.get('select_app_id')), getNumberValue(query.get('year')), getNumberValue(query.get('month')))
        .then((/**@type{Types.db_result_app_log_getStatUniqueVisitorAdmin[]}*/result) =>{
            if (result.length>0)
                resolve(result);
            else{
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};             
export{getLogsAdmin, getStatUniqueVisitorAdmin};
    
/** @module server/db/components */

/**@type{import('../sql/app_log.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/app_log.service.js`);

/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query
 * @param {import('../../../types.js').res} res
 * @returns Promise.<{import('../../../types.js').db_result_app_log_getLogsAdmin[]}>
 */
const getLogsAdmin = (app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getLogsAdmin(   app_id, getNumberValue(query.get('select_app_id')), getNumberValue(query.get('year')), getNumberValue(query.get('month')), 
                                query.get('sort'), query.get('order_by'), getNumberValue(query.get('offset')), getNumberValue(query.get('limit')))
        .then((/**@type{import('../../../types.js').db_result_app_log_getLogsAdmin[]}*/result_logs) =>{
            if (result_logs.length>0)
                resolve(
                            result_logs.map(log=>{return {...log, ...JSON.parse(log.json_data)}})
                        );
            else{
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../common.service.js')} */{record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {import('../../../types.js').res} res
 * @returns Promise.<{import('../../../types.js').db_result_app_log_getStatUniqueVisitorAdmin[]}>
 */
const getStatUniqueVisitorAdmin = (app_id, query, res) =>{
    /**
     * Convert to array with object
     * @param {*} log
     * @param {boolean} log_amount
     * @returns {*}
     */
     const to_object = (log, log_amount) => {
        /**@type{*} */
        let log_array_with_object = [];
        log.forEach((/**@type{*}*/log_row)=>
                {
                    const log_split = log_row.split(';');
                    log_array_with_object.push({chart:Number(log_split[0]),
                                                app_id:log_split[1]=='null'?null:Number(log_split[1]),
                                                year:Number(log_split[2]),
                                                month:Number(log_split[3]),
                                                day:log_split[4]=='null'?null:Number(log_split[4]),
                                                amount:log_amount?Number(log_split[5]):null})
                }
        )
        return log_array_with_object;
    }
    return new Promise((resolve, reject)=>{
        service.getStatUniqueVisitorAdmin(app_id, getNumberValue(query.get('select_app_id')), getNumberValue(query.get('year')), getNumberValue(query.get('month')))
        .then((/**@type{import('../../../types.js').db_result_app_log_getStatUniqueVisitorAdmin[]}*/result_logs) =>{
            if (result_logs.length>0){
                //use SQL group by and count() in javascript
                //save unique server_remote_addr in a set
                const log_unique_ip = new Set();
                for (const log of result_logs){
                    log_unique_ip.add( `${log.chart};${log.app_id};${log.year};${log.month};${log.day};${JSON.parse(log.json_data).server_remote_addr}`);
                }
                //convert to array with objects
                const log_unique = to_object(log_unique_ip, false);
                //save amount in unique server_remote_addr list in a set
                let log_unique_with_amount = new Set();
                log_unique.forEach((/**@type{*}*/log)=>{
                    log_unique_with_amount.add( `${log.chart};${log.app_id};${log.year};${log.month};${log.day};${log_unique.filter((/**@type{*}*/log_amount)=>   
                                                                                                                        log_amount.chart==log.chart && 
                                                                                                                        log_amount.app_id == log.app_id &&
                                                                                                                        log_amount.year == log.year &&
                                                                                                                        log_amount.month == log.month &&
                                                                                                                        log_amount.day == log.day).length}`);
                })
                //convert to array with objects
                const result_getStatUniqueVisitorAdmin = to_object(log_unique_with_amount, true);
                //return result
                resolve(result_getStatUniqueVisitorAdmin);
            }
            else{
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../common.service.js')} */{record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
    });
};             
export{getLogsAdmin, getStatUniqueVisitorAdmin};
    
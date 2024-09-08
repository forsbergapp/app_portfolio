/** @module server/db/components/app_data_stat */

/**@type{import('../sql/app_data_stat.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/app_data_stat.service.js`);

/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query
 */
const get = (app_id, query) => service.get( app_id, 
                                            getNumberValue(query.get('id')),
                                            getNumberValue(query.get('data_app_id')), 
                                            query.get('resource_name_entity'),
                                            query.get('lang_code'))
                                            .catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {*} query
 */
const getLogs = (app_id, query) => service.getLogs( app_id, getNumberValue(query.get('select_app_id')), getNumberValue(query.get('year')), getNumberValue(query.get('month')), 
                                                    query.get('sort'), query.get('order_by'), getNumberValue(query.get('offset')), getNumberValue(query.get('limit')))
                                                .then(result =>{
                                                        if (query.get('sort')!='date_created' && query.get('sort')!='app_id'){
                                                            //sort json_data columns
                                                            /**@ts-ignore*/
                                                            result.rows = result.rows.sort((first, second)=>{
                                                                //sort column inside json string
                                                                const first_sort = JSON.parse(first.json_data)[query.get('sort')]?.toLowerCase();
                                                                const second_sort = JSON.parse(second.json_data)[query.get('sort')]?.toLowerCase();
                                                                //using localeCompare as collation method for strings
                                                                if (first_sort !=null && second_sort != null && 
                                                                    ((  typeof first_sort == 'number' && first_sort < second_sort) || 
                                                                    (  typeof first_sort == 'string' && first_sort.localeCompare(second_sort)<0) ))
                                                                    return query.get('order_by').toLowerCase()=='asc'?-1:1;
                                                                else if (first_sort !=null && second_sort != null && 
                                                                    ((  typeof first_sort == 'number' && first_sort > second_sort) || 
                                                                    (  typeof first_sort == 'string' && first_sort.localeCompare(second_sort)>0) ))
                                                                    return query.get('order_by').toLowerCase()=='asc'?1:-1;
                                                                else
                                                                    return 0;
                                                            });
                                                        }
                                                        
                                                        return result;
                                                })
                                                .catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});
/**
 * 
 * @param {number} app_id 
 * @param {*} query
 */
const getStatUniqueVisitor = (app_id, query) =>{
    /**
     * Convert to array with object
     * @param {*} log
     * @param {boolean} log_amount
     * @returns {*}
     */
     const to_object = (log, log_amount) => {
        /**@type{*} */
        const log_array_with_object = [];
        log.forEach((/**@type{*}*/log_row)=>
                {
                    const log_split = log_row.split(';');
                    log_array_with_object.push({chart:Number(log_split[0]),
                                                app_id:log_split[1]=='null'?null:Number(log_split[1]),
                                                year:Number(log_split[2]),
                                                month:Number(log_split[3]),
                                                day:log_split[4]=='null'?null:Number(log_split[4]),
                                                amount:log_amount?Number(log_split[5]):null});
                }
        );
        return log_array_with_object;
    };
    return new Promise((resolve, reject)=>{
        service.getStatUniqueVisitor(app_id, getNumberValue(query.get('select_app_id')), getNumberValue(query.get('year')), getNumberValue(query.get('month')))
        .then(result_logs =>{
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
                const log_unique_with_amount = new Set();
                log_unique.forEach((/**@type{*}*/log)=>{
                    log_unique_with_amount.add( `${log.chart};${log.app_id};${log.year};${log.month};${log.day};${log_unique.filter((/**@type{*}*/log_amount)=>   
                                                                                                                        log_amount.chart==log.chart && 
                                                                                                                        log_amount.app_id == log.app_id &&
                                                                                                                        log_amount.year == log.year &&
                                                                                                                        log_amount.month == log.month &&
                                                                                                                        log_amount.day == log.day).length}`);
                });
                //convert to array with objects
                const result_getStatUniqueVisitorAdmin = to_object(log_unique_with_amount, true);
                resolve(result_getStatUniqueVisitorAdmin);
            }
            else{
                resolve([]);
            }
        })
        .catch((/**@type{import('../../../types.js').server_server_error}*/error)=>reject(error));
    });
};  
export{get, getLogs, getStatUniqueVisitor};

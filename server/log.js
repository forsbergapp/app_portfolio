/** @module server/log */

/**@type{import('./log.service.js')} */
const service = await import(`file://${process.cwd()}/server/log.service.js`);
/**@type{import('./server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query
 */
const getLogs = (app_id, query) => {
    return new Promise((resolve, reject)=>{
        /**@type{import('../types.js').admin_log_data_parameters} */
        const data = {  app_id:			app_id,
            select_app_id:	getNumberValue(query.get('select_app_id')),
            logscope:		query.get('logscope'),
            loglevel:		query.get('loglevel'),
            search:			query.get('search'),
            sort:			query.get('sort'),
            order_by:		query.get('order_by'),
            year: 			query.get('year').toString(),
            month:			query.get('month').toString(),
            day:			query.get('day')};
        service.getLogs(data).then((/**@type{object[]} */result)=>{
            resolve(result);
        })
        .catch((/**@type{import('../types.js').error}*/error)=>reject(error));
    });  
};
/**
 * 
 * @param {*} query 
 */
const getLogStats = (query) =>{
    return new Promise((resolve, reject)=>{
        /**@type{import('../types.js').log_parameter_getLogStats} */
        const data = {	app_id:			getNumberValue(query.get('select_app_id')),
                        statGroup:		query.get('statGroup')==''?null:query.get('statGroup'),
                        unique:		    getNumberValue(query.get('unique')),
                        statValue:		getNumberValue(query.get('statValue')),
                        year: 			getNumberValue(query.get('year')) ?? new Date().getFullYear(),
                        month:			getNumberValue(query.get('month')) ?? new Date().getMonth() +1
                        };
        service.getLogsStats(data).then ((/**@type{import('../types.js').admin_log_stats_data[]} */result)=>{
            resolve(result);
        })
        .catch((/**@type{import('../types.js').error}*/error)=>reject(error));
    });
};
/**
 *
 */
const getStatusCodes =() => service.getStatusCodes();

/**
 * 
 */
const getFiles = () =>{
    return new Promise((resolve, reject)=>{
        service.getFiles().then((/**@type{import('../types.js').admin_log_files[]}*/result) =>{
            resolve(result);
        })
        .catch((/**@type{import('../types.js').error}*/error)=>reject(error));
    });
};
export {getLogs, getStatusCodes, getLogStats, getFiles};
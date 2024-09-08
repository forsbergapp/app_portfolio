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
        /**@type{import('../types.js').server_log_data_parameter_getLogs} */
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
        service.getLogs(data).then(result=>{
            resolve(result);
        })
        .catch((/**@type{import('../types.js').server_server_error}*/error)=>reject(error));
    });  
};
/**
 * Get log stat
 * @param {*} query 
 */
const getLogStats = query =>{
    return new Promise((resolve, reject)=>{
        /**@type{import('../types.js').server_log_data_parameter_getLogStats} */
        const data = {	app_id:			getNumberValue(query.get('select_app_id')),
                        statGroup:		query.get('statGroup')==''?null:query.get('statGroup'),
                        unique:		    getNumberValue(query.get('unique')),
                        statValue:		getNumberValue(query.get('statValue')),
                        year: 			getNumberValue(query.get('year')) ?? new Date().getFullYear(),
                        month:			getNumberValue(query.get('month')) ?? new Date().getMonth() +1
                        };
        service.getLogsStats(data).then (result=>{
            resolve(result);
        })
        .catch((/**@type{import('../types.js').server_server_error}*/error)=>reject(error));
    });
};
/**
 * Get status codes
 */
const getStatusCodes =() => service.getStatusCodes();

/**
 * Get log files
 */
const getFiles = () =>service.getFiles();

export {getLogs, getStatusCodes, getLogStats, getFiles};
/** @module server/log */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import(`file://${process.cwd()}/server/log.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @returns 
 */
const getLogParameters = (app_id) => service.getLogParameters(app_id);

/**
 * 
 * @param {number} app_id 
 * @param {*} query
 */
const getLogs = (app_id, query) => {
    return new Promise((resolve, reject)=>{
        /**@type{Types.admin_log_data_parameters} */
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
            if (result.length>0)
                resolve(result);
            else
                reject('Record not found');
        });
    });
    
};
/**
 * 
 * @param {*} query 
 */
const getLogStats = (query) =>{
    return new Promise((resolve, reject)=>{
        /**@type{Types.log_parameter_getLogStats} */
        const data = {	app_id:			getNumberValue(query.get('select_app_id')),
                        statGroup:		query.get('statGroup')==''?null:query.get('statGroup'),
                        statValue:		getNumberValue(query.get('statValue')),
                        year: 			getNumberValue(query.get('year')) ?? new Date().getFullYear(),
                        month:			getNumberValue(query.get('month')) ?? new Date().getMonth() +1
                        };
        service.getLogsStats(data).then ((/**@type{Types.log_parameter_getLogStats[]} */result)=>{
            if (result.length>0)
                resolve(result);
            else
                reject('Record not found');
        });
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
    service.getFiles().then((/**@type{Types.admin_log_files[]}*/result) =>{
        if (result.length>0)
            return result;
        else{
            throw 'Record not found';
        }
    });
};
export {getLogParameters, getLogs, getStatusCodes, getLogStats, getFiles};
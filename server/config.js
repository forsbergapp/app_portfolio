/** @module server/config */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import(`file://${process.cwd()}/server/config.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**
 * 
 * @param {*} data
 */
const ConfigSave =  data => service.ConfigSave(data.file, data.config_json, false);
/**
 * 
 * @param {*} query
 */
const ConfigGet = query => {return {data: service.ConfigGet(query.get('config_group'), query.get('parameter'))};};
/**
 * 
 */
const ConfigGetApps = () => service.ConfigGetApps();
/**
 * 
 * @param {*} query
 */
const ConfigGetSaved = query => service.ConfigGetSaved(query.get('file'));
/**
 * 
 */
const ConfigMaintenanceGet = () => service.ConfigMaintenanceGet();
/**
 * 
 * @param {*} data
 */
const ConfigMaintenanceSet = data => service.ConfigMaintenanceSet(getNumberValue(data.value));
        
export {ConfigSave, ConfigGet, ConfigGetApps, ConfigGetSaved, ConfigMaintenanceGet, ConfigMaintenanceSet};
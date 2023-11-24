/** @module server/config */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import(`file://${process.cwd()}/server/config.service.js`);
/**
 * 
 * @param {string} config_no 
 * @param {string} config_json 
 * @returns 
 */
const ConfigSave = (config_no, config_json) => service.ConfigSave(config_no, config_json, false);
/**
 * 
 * @param {string} config_group 
 * @param {string} parameter 
 * @returns 
 */
const ConfigGet = (config_group, parameter) => {return {data: service.ConfigGet(config_group, parameter)};};
/**
 * 
 */
const ConfigGetApps = () => service.ConfigGetApps();
/**
 * 
 * @param {string} config_type_no 
 * @returns 
 */
const ConfigGetSaved = (config_type_no) => service.ConfigGetSaved(config_type_no);
/**
 * 
 */
const ConfigMaintenanceGet = () => service.ConfigMaintenanceGet();
/**
 * 
 * @param {string} value 
 * @returns 
 */
const ConfigMaintenanceSet = (value) => service.ConfigMaintenanceSet(value);
        
export {ConfigSave, ConfigGet, ConfigGetApps, ConfigGetSaved, ConfigMaintenanceGet, ConfigMaintenanceSet};
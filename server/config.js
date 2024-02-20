/** @module server/config */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import(`file://${process.cwd()}/server/config.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**
 * Config save
 * @param {*} data
 */
const ConfigSave =  data => service.ConfigSave(data.config_json);
/**
 * Config get
 * @param {*} query
 */
const ConfigGet = query => {return {data: service.ConfigGet(query.get('config_group'), query.get('parameter'))};};
/**
 * Config get app
 * @param {number} app_id
 * @param {*} query
 */
 const ConfigGetApp = (app_id, query) => service.ConfigGetApp(app_id, getNumberValue(query.get('data_app_id')), query.get('key'));
 /**
 * Config app update
 * @param {number} app_id
 * @param {*} data
 */
  const ConfigAppParameterUpdate = (app_id, data) => service.ConfigAppParameterUpdate(app_id, data);
/**
 * Config get apps 
 */
const ConfigGetApps = () => service.ConfigGetApps();
/**
 * Config get saved
 * @param {*} query
 */
const ConfigGetSaved = query => service.ConfigGetSaved(query.get('file'));
/**
 * Config get maintenance value
 */
const ConfigMaintenanceGet = () => service.ConfigMaintenanceGet();
/**
 * Config set maintenance value
 * @param {*} data
 */
const ConfigMaintenanceSet = data => service.ConfigMaintenanceSet(getNumberValue(data.value));
        
export {ConfigSave, ConfigGet, ConfigGetApp, ConfigAppParameterUpdate, ConfigGetApps, ConfigGetSaved, ConfigMaintenanceGet, ConfigMaintenanceSet};
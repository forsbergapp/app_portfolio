/** @module server/config */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import(`file://${process.cwd()}/server/config.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**
 * Config file save
 * @param {string} resource_id
 * @param {*} data
 */
const ConfigFileSave =  (resource_id, data) => service.ConfigFileSave(resource_id, data.config, getNumberValue(data.maintenance), data.configuration, data.comment);
/**
 * Config file get
 * @param {Types.db_file_db_name} resource_id
 * @param {*} query
 */
 const ConfigFileGet = async (resource_id, query) => {
    return {data:await service.ConfigFileGet(resource_id, getNumberValue(query.get('cached')), query.get('config_group'), query.get('parameter'))}
 }
/**
 * Config get app
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} query
 */
 const ConfigGetApp = (app_id, resource_id, query) => service.ConfigGetApp(app_id, resource_id, query.get('key'));
 /**
 * Config app update
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 */
  const ConfigAppParameterUpdate = (app_id, resource_id, data) => service.ConfigAppParameterUpdate(app_id, resource_id, data);
/**
 * Config get apps 
 * @param {*} query
 */
const ConfigGetApps = query => service.ConfigGetApps(getNumberValue(query.get('app_id')));

export {ConfigFileSave, ConfigFileGet, ConfigGetApp, ConfigAppParameterUpdate, ConfigGetApps};
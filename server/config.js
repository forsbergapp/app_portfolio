/** @module server/config */

/**@type{import('./server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{import('./config.service.js')} */
const service = await import(`file://${process.cwd()}/server/config.service.js`);

/**
 * Config file save
 * @param {import('./types.js').server_db_file_db_name} resource_id
 * @param {*} data
 */
const ConfigFileSave =  (resource_id, data) => service.ConfigFileSave(resource_id, data.config, getNumberValue(data.maintenance), data.configuration, data.comment);
/**
 * Config file get
 * @param {import('./types.js').server_db_file_db_name} resource_id
 * @param {*} query
 */
 const ConfigFileGet = async (resource_id, query) => {
    return {data:await service.ConfigFileGet(resource_id, getNumberValue(query.get('saved'))==1, query.get('config_group'), query.get('parameter'))};
 };
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
 * @param {number} resource_id
 * @param {*} query
 */
const ConfigGetApps = (resource_id, query) => service.ConfigGetApps(resource_id, query.get('key'));

export {ConfigFileSave, ConfigFileGet, ConfigGetApp, ConfigAppParameterUpdate, ConfigGetApps};
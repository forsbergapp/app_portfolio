/** @module server/db/OpenApi */

/**
 * @import {server} from '../types.js'
 */

const {server} = await import ('../server.js');

/**
 * @name get
 * @description Get
 * @function
 * @param {{app_id:number}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['OpenApi'] }}
 */
const get = parameters => {
    return {result:server.ORM.getObject(parameters.app_id, 'OpenApi',null, null), 
            type:'JSON'};
};

/**
 * @name getViewConfig
 * @description Returns #/compomnents/parameters/config or given parameter
 * @function
 * @param {{app_id:number,
 *          data:{parameter?:string|null}}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['OpenApi']['components']['parameters']['config'] }}
 */
const getViewConfig = parameters =>{
    return parameters.data.parameter!=null?
        //return value
        {result:server.ORM.getObject(parameters.app_id, 'OpenApi',null, null).components.parameters.config[parameters.data.parameter]?.default, 
                type:'JSON'}:
            //return all configuration
            {result:server.ORM.getObject(parameters.app_id, 'OpenApi',null, null).components.parameters.config,
                    type:'JSON'};
}

/**
 * @name getViewServers
 * @description Returns #/servers for given pathType or all servers without variables.config for each server
 * @function
 * @param {{app_id:number,
 *          data:{pathType?:server['ORM']['Object']['OpenApi']['servers'][0]['variables']['type']['default']|null}}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['OpenApi']['servers'] }}
 */
const getViewServers = parameters =>{
    return {result:server.ORM.getObject(parameters.app_id, 'OpenApi',null, null).servers
                    .filter((/**@type{server['ORM']['Object']['OpenApi']['servers'][0] }*/server)=>server.variables.type.default==(parameters.data.pathType??server.variables.type.default))
                    .map((/**@type{server['ORM']['Object']['OpenApi']['servers'][0]}*/server)=>{
                        /**@type{server['ORM']['Object']['OpenApi']['servers'][0]} */
                        const serverReturn = {
                            "url":          server.url,
                            "description":  server.description,
                            "variables":{
                                "type":     server.variables.type,
                                "protocol": server.variables.protocol,
                                "host":     server.variables.host,
                                "port":     server.variables.port,
                                "basePath": server.variables.basePath
                            }
                        }
                        return serverReturn;
                    }),
            type:'JSON'};
}

/**
 * @name getViewWithoutConfig
 * @description OpenApi get without #/components/parameters/config
 * @function
 * @param {{app_id:number}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['OpenApi'] }}
 */
const getViewWithoutConfig = parameters => {
    const openApi = server.ORM.getObject(parameters.app_id, 'OpenApi',null, null);
    openApi.components.parameters.config = '[AVAILABLE TO ADMIN]';
    return {result:openApi, 
            type:'JSON'};
};

/**
 * @name update
 * @description Update a key in openApi
 * @function
 * @param {{app_id:number,
 *          data:{  openApiKey: keyof server['ORM']['Object']['OpenApi'],
 *                  openApiValue: *}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const update = async parameters => {
    /**@type{server['ORM']['Object']['OpenApi']} */
    const OpenApi = get({app_id:parameters.app_id}).result;
    const created = OpenApi.info['x-created'];
    OpenApi[parameters.data.openApiKey] = parameters.data.openApiValue
    OpenApi.info['x-created'] = created;
    OpenApi.info['x-modified'] = new Date().toISOString();

    return {result:await server.ORM.Execute({app_id:parameters.app_id, 
                                    object:'OpenApi',
                                    dml:'UPDATE',                  
                                    update:{resource_id:null, 
                                            data_app_id:null, 
                                            data:OpenApi}}),
            type:'JSON'};    
    
};
/**
 * @name updateConfig
 * @description Update config
 *              Updates #/components/parameters/config/[key].default
 *              Only one key allowed to be updated for each request.
 * @function
 * @param {{app_id:number,
 *         data:{config_key:keyof server['ORM']['Object']['OpenApi']['servers'][0]['variables']['config'],
 *               config_value:*}
 *          }} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const updateConfig = async parameters =>{
    const old = server.ORM.getObject(parameters.app_id, 'OpenApi',null, null);
    if (parameters.data.config_key!=null){
        old.components.parameters.config[parameters.data.config_key].default = parameters.data.config_value;
        return update({app_id:parameters.app_id,
                        data:{  openApiKey: 'components',
                                openApiValue: old.components}});
    }
    else
        return server.ORM.getError(parameters.app_id, 404);
}

/**
 * @name updateServersVariables
 * @description Update server variables
 *              Updates #/servers/[APP or ADMIN]/variables/[key].default
 *              Allowed keys to update: host, port and basePath.
 *              Only one key allowed to be updated for each request.
 *              if variable_name = host, port, basePath and pathType is APP or ADMIN
 *                  update record given pathType record
 *              else
 *                  return 400
 * @function
 * @param {{app_id:number,
 *         data:{pathType:server['ORM']['Object']['OpenApi']['servers'][0]['variables']['type']['default'],
 *               host: string,
 *               port: number,
 *               basePath: string}
 *          }} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const updateServersVariables = async parameters =>{
    const old = server.ORM.getObject(parameters.app_id, 'OpenApi',null, null);
    
    if (['APP','ADMIN'].includes(parameters.data.pathType)){
        for (const server of old.servers)
            if (server.variables.type.default == parameters.data.pathType){
                server.variables.host.default = parameters.data.host;
                server.variables.port.default = parameters.data.port;
                server.variables.basePath.default = parameters.data.basePath;
            }
        return update({app_id:parameters.app_id,
                        data:{  openApiKey: 'servers',
                                openApiValue: old.servers}})
    }
    else
        return server.ORM.getError(parameters.app_id, 404);
}

export{ get,getViewConfig, getViewServers, getViewWithoutConfig, update, updateConfig, updateServersVariables};
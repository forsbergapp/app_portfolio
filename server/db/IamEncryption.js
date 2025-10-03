/** @module server/db/IamEncryption */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{data_app_id:number|null}}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamEncryption'][] }}
 */
const get = parameters =>server.ORM.getObject(parameters.app_id, 'IamEncryption',parameters.resource_id, parameters.data.data_app_id);
    
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server['ORM']['Object']['IamEncryption']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null &&
        data.AppId != null &&
        data.Uuid != null &&
        data.Secret != null){
        /**@type{server['ORM']['Object']['IamEncryption']} */
        const data_new = {};
        data_new.Id = Date.now();
        data_new.AppId = data.AppId;
        data_new.IamAppIdTokenId = data.IamAppIdTokenId;
        data_new.Uuid = data.Uuid;
        data_new.Secret = data.Secret;
        data_new.Type = data.Type;
        data_new.Url = data.Url;
        data_new.Created = new Date().toISOString();
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamEncryption', post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
            if (result.AffectedRows>0)
                return {result:result, type:'JSON'};
            else
                return server.ORM.getError(app_id, 404);
        });
    }
    else
        return server.ORM.getError(app_id, 400);
};

export {get, post};
/** @module server/db/IamAppIdToken */

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
 * @returns {server['server']['response'] & {result?:server['ORM']['IamAppIdToken'][] }}
 */
const get = parameters =>server.ORM.getObject(parameters.app_id, 'IamAppIdToken',parameters.resource_id, parameters.data.data_app_id);
    
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server['ORM']['IamAppIdToken']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORMMetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null &&
        data.app_id != null &&
        data.res != null &&
        data.token != null &&
        data.ip != null){
        //security check that token is not used already
        if (server.ORM.getObject(app_id, 'IamAppIdToken', null, null).result.filter((/**@type{server['ORM']['IamAppIdToken']} */row)=>row.token==data.token).length==0){
            /**@type{server['ORM']['IamAppIdToken']} */
            const data_new = {};
            data_new.id = Date.now();
            //required
            data_new.app_id = data.app_id;
            data_new.app_id_token = data.app_id_token;
            data_new.res = data.res;
            data_new.token = data.token;
            data_new.ip = data.ip;
            //optional
            if (data.ua!=null)
                data_new.ua = data.ua;
            data_new.created = new Date().toISOString();
            return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamAppIdToken', post:{data:data_new}}).then((/**@type{server['ORMMetaData']['common_result_insert']}*/result)=>{
                if (result.affectedRows>0){
                    result.insertId = data_new.id;
                    return {result:result, type:'JSON'};
                }
                else
                    return server.ORM.getError(app_id, 404);
            });
        }
        else
            return server.ORM.getError(app_id, 401);
    }
    else
        return server.ORM.getError(app_id, 400);
};

export {get, post};
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
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamAppIdToken'][] }}
 */
const get = parameters =>server.ORM.getObject(parameters.app_id, 'IamAppIdToken',parameters.resource_id, parameters.data.data_app_id);
    
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server['ORM']['Object']['IamAppIdToken']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null &&
        data.AppId != null &&
        data.Res != null &&
        data.Token != null &&
        data.Ip != null){
        //security check that token is not used already
        if (server.ORM.getObject(app_id, 'IamAppIdToken', null, null).result.filter((/**@type{server['ORM']['Object']['IamAppIdToken']} */row)=>row.Token==data.Token).length==0){
            /**@type{server['ORM']['Object']['IamAppIdToken']} */
            const data_new = {};
            data_new.Id = Date.now();
            //required
            data_new.AppId = data.AppId;
            data_new.AppIdToken = data.AppIdToken;
            data_new.Res = data.Res;
            data_new.Token = data.Token;
            data_new.Ip = data.Ip;
            //optional
            if (data.Ua!=null)
                data_new.Ua = data.Ua;
            data_new.Created = new Date().toISOString();
            return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamAppIdToken', post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
                if (result.AffectedRows>0){
                    result.InsertId = data_new.Id;
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
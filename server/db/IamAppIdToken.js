/** @module server/db/IamAppIdToken */

/**
 * @import types_server from '../types.d.ts'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{data_app_id:number|null}}} parameters
 * @returns {types_server.server['response'] & {result:types_server.ORM['Object']['IamAppIdToken'][] }}
 */
const get = parameters =>server.ORM.getObject(parameters.app_id, 'IamAppIdToken',parameters.resource_id, parameters.data.data_app_id);
    
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {types_server.ORM['Object']['IamAppIdToken']} data
 * @returns {Promise.<types_server.server['response'] & {result?:types_server.ORM['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null &&
        data.AppId != null &&
        data.Res != null &&
        data.Token != null &&
        data.Ip != null){
        //security check that token is not used already
        if (server.ORM.getObject(app_id, 'IamAppIdToken', null, null).result.filter((/**@type{types_server.ORM['Object']['IamAppIdToken']} */row)=>row.Token==data.Token).length==0){
            /**@type{types_server.ORM['Object']['IamAppIdToken']} */
            const data_new = {};
            data_new.Id = Date.now();
            //required
            data_new.AppId = data.AppId;
            data_new.AppIdToken = data.AppIdToken;
            data_new.Res = data.Res;
            data_new.Token = data.Token;
            data_new.Ip = data.Ip;
            data_new.Ua = data.Ua;
            data_new.Created = new Date().toISOString();
            return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamAppIdToken', post:{data:data_new}});
        }
        else
            return server.getError({statusCode: 401});
    }
    else
        return server.getError({statusCode: 400});
};

export {get, post};
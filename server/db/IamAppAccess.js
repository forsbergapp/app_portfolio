/** @module server/db/IamAppAccess */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamAppAccess'][] }}
 */
const get = (app_id, resource_id) =>server.ORM.getObject(app_id, 'IamAppAccess',resource_id, null);
    
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server['ORM']['Object']['IamAppAccess']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) =>{
    //check required attributes
    if (app_id!=null &&
        data.AppId != null &&
        data.Res != null &&
        data.Ip != null){
        //security check that token is not used already
        if (server.ORM.getObject(app_id, 'IamAppAccess', null, null).result.filter((/**@type{server['ORM']['Object']['IamAppAccess']} */row)=>row.Token==data.Token && data.Token !=null).length==0){
            /**@type{server['ORM']['Object']['IamAppAccess']} */
            const data_new = {};
            data_new.Id =  Date.now();
            //required
            data_new.AppId =                data.AppId;
            data_new.AppIdToken =           data.AppIdToken;
            data_new.Res =                  data.Res;
            data_new.Ip =                   data.Ip;
            data_new.Type =                 data.Type;
            //optional
            data_new.IamUserAppId =         data.IamUserAppId;
            data_new.IamUserId =            data.IamUserId;
            data_new.IamUserUsername =      data.IamUserUsername; //for security reason can be omitted in a user verification process
            data_new.AppCustomId =          data.AppCustomId; //used by app_access_external
            data_new.Token =                data.Token;
            data_new.Ua =                   data.Ua;
            //required server value
            data_new.Created =              new Date().toISOString();
            return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamAppAccess',post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
                if (result.AffectedRows>0){
                    result.InsertId=data_new.Id;
                    return {result:result,type:'JSON'};
                }
                else
                    return server.ORM.getError(app_id, 404);
            });
        }
        else{
            //token already used, user can not login
            return server.ORM.getError(app_id, 401);
        }
    }
    else
        return server.ORM.getError(app_id, 400);
}; 

/**
 * @name update
 * @description Update record
 * @function
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const update = async (app_id, resource_id, data) =>{
    //check required attributes
    if (app_id!=null && resource_id != null){
        /**@type{server['ORM']['Object']['IamAppAccess']} */
        const data_update = {};
        //check allowed attributes to update
        if (data.res!=null)
            data_update.Res = data.res;
        data_update.Modified = data.modified;
        if (Object.entries(data_update).length>1){
            /**@type{server['ORM']['MetaData']['common_result_update']}*/
            const result = await server.ORM.Execute({app_id:app_id, dml:'UPDATE', object:'IamAppAccess', update:{resource_id:resource_id, data_app_id:null, data:data}});
            if (result.AffectedRows>0)
                return {result:result, type:'JSON'};
            else
                return server.ORM.getError(app_id, 404);
        }
        else
            return server.ORM.getError(app_id, 400);
    }
    else
        return server.ORM.getError(app_id, 400);
};

/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async (app_id, resource_id) => {
    return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'IamAppAccess', delete:{resource_id:resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(app_id, 404);
    });
};
export {get, post, update, deleteRecord};
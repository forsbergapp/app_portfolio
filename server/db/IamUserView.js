/** @module server/db/IamUserView */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  iam_user_id:number|null,
 *                  iam_user_id_view:number|null}}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamUserView'][] }}
 */
const get = parameters =>{
    const result = (server.ORM.getObject(parameters.app_id, 'IamUserView',parameters.resource_id, null).result??[])
                    .filter((/**@type{server['ORM']['Object']['IamUserView']}*/row)=>
                        row.IamUserId == (parameters.data.iam_user_id ?? row.IamUserId) &&
                        row.IamUserIdView == (parameters.data.iam_user_id_view ?? row.IamUserIdView) );
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return server.ORM.getError(parameters.app_id, 404);
};

/**
 * @name post
 * @description Create record
 * @function
 * @function
 * @param {number} app_id,
 * @param {server['ORM']['Object']['IamUserView']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) =>{
    //check required attributes
    if (data.IamUserIdView==null){
        return server.ORM.getError(app_id, 400);
    }
    else{
        /**@type{server['ORM']['Object']['IamUserView']} */
        const data_new =     {
                                Id:Date.now(),
                                IamUserId:data.IamUserId, 
                                IamUserIdView:data.IamUserIdView,
                                ClientIp:data.ClientIp,
                                ClientUserAgent:data.ClientUserAgent,
                                Created:new Date().toISOString()
                        };
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamUserView', post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
            if (result.AffectedRows>0){
                result.InsertId=data_new.Id;
                return {result:result, type:'JSON'};
            }
            else
                return server.ORM.getError(app_id, 404);
        });
    }
};

/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async parameters =>{
    return server.ORM.Execute({  app_id:parameters.app_id, 
                                dml:'DELETE', 
                                object:'IamUserView', 
                                delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(parameters.app_id, 404);
    });
};

export {get, post, deleteRecord};
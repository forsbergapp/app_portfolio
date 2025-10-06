/** @module server/db/IamUserLike */

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
 *                  iam_user_id_like:number|null}}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamUserLike'][] }}
 */
const get = parameters =>{
    const result = (server.ORM.getObject(parameters.app_id, 'IamUserLike',parameters.resource_id, null).result??[])
                    .filter((/**@type{server['ORM']['Object']['IamUserLike']}*/row)=>
                        row.IamUserId == (parameters.data.iam_user_id ?? row.IamUserId) &&
                        row.IamUserIdLike == (parameters.data.iam_user_id_like ?? row.IamUserIdLike) );
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
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{iam_user_id:server['ORM']['Object']['IamUserLike']['IamUserId'],
 *                iam_user_id_like:server['ORM']['Object']['IamUserLike']['IamUserIdLike']}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async parameters =>{
    //check required attributes
    if (parameters.data.iam_user_id==null || parameters.data.iam_user_id_like==null){
        return server.ORM.getError(parameters.app_id, 400);
    }
    else{
        /**@type{server['ORM']['Object']['IamUserLike']} */
        const data_new =     {
                                Id:Date.now(),
                                IamUserId:parameters.data.iam_user_id, 
                                IamUserIdLike:parameters.data.iam_user_id_like,
                                Created:new Date().toISOString()
                        };
        return server.ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'IamUserLike', post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
            if (result.AffectedRows>0){
                result.InsertId=data_new.Id;
                return {result:result, type:'JSON'};
            }
            else
                return server.ORM.getError(parameters.app_id, 404);
        });
    }
};

/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{iam_user_id:number}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async parameters =>{
    if (parameters.resource_id==null){
        return server.ORM.getError(parameters.app_id, 400);
    }
    else
        if (get({   app_id:parameters.app_id, 
                    resource_id:parameters.resource_id, 
                    data:{  iam_user_id:parameters.data.iam_user_id, 
                            iam_user_id_like:null}}).result?.[0])
            return server.ORM.Execute({  app_id:parameters.app_id, 
                                        dml:'DELETE', 
                                        object:'IamUserLike', 
                                        delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
                if (result.AffectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return server.ORM.getError(parameters.app_id, 404);
            });
        else
            return server.ORM.getError(parameters.app_id, 401);
};

export {get, post, deleteRecord};
/** @module server/db/IamUserFollow */

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
 *                  iam_user_id_follow:number|null}}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamUserFollow'][] }}
 */
const get = parameters =>{
    const result = (server.ORM.getObject(parameters.app_id, 'IamUserFollow',parameters.resource_id, null).result??[])
                    .filter((/**@type{server['ORM']['Object']['IamUserFollow']}*/row)=>
                        row.IamUserId == (parameters.data.iam_user_id ?? row.IamUserId) &&
                        row.IamUserIdFollow == (parameters.data.iam_user_id_follow ?? row.IamUserIdFollow) );
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
 *          data:server['ORM']['Object']['IamUserFollow']}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async parameters =>{
    //check required attributes
    if (parameters.data.IamUserId==null || parameters.data.IamUserIdFollow==null){
        return server.ORM.getError(parameters.app_id, 400);
    }
    else{
        /**@type{server['ORM']['Object']['IamUserFollow']} */
        const data_new =     {
                                Id:Date.now(),
                                IamUserId:parameters.data.IamUserId, 
                                IamUserIdFollow:parameters.data.IamUserIdFollow,
                                Created:new Date().toISOString()
                        };
        return server.ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'IamUserFollow', post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
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
                    iam_user_id_follow:null}}).result?.[0])
            return server.ORM.Execute({  app_id:parameters.app_id, 
                                        dml:'DELETE', 
                                        object:'IamUserFollow', 
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
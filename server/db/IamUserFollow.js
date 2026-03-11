/** @module server/db/IamUserFollow */

/**
 * @import types_server from '../types.d.ts'
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
 * @returns {types_server.server['response'] & {result?:types_server.ORM['Object']['IamUserFollow'][] }}
 */
const get = parameters =>{
    const result = (server.ORM.getObject(parameters.app_id, 'IamUserFollow',parameters.resource_id, null).result??[])
                    .filter((/**@type{types_server.ORM['Object']['IamUserFollow']}*/row)=>
                        row.IamUserId == (parameters.data.iam_user_id ?? row.IamUserId) &&
                        row.IamUserIdFollow == (parameters.data.iam_user_id_follow ?? row.IamUserIdFollow) );
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return server.getError({statusCode: 404});
};

/**
 * @name post
 * @description Create record
 * @function
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{iam_user_id:types_server.ORM['Object']['IamUserFollow']['IamUserId'],
 *                iam_user_id_follow:types_server.ORM['Object']['IamUserFollow']['IamUserIdFollow']}}} parameters
 * @returns {Promise.<types_server.server['response'] & {result?:types_server.ORM['MetaData']['common_result_insert'] }>}
 */
const post = async parameters =>{
    //check required attributes
    if (parameters.data.iam_user_id==null || parameters.data.iam_user_id_follow==null){
        return server.getError({statusCode: 400});
    }
    else{
        /**@type{types_server.ORM['Object']['IamUserFollow']} */
        const data_new =     {
                                Id:Date.now(),
                                IamUserId:parameters.data.iam_user_id, 
                                IamUserIdFollow:parameters.data.iam_user_id_follow,
                                Created:new Date().toISOString()
                        };
        return server.ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'IamUserFollow', post:{data:data_new}});
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
 * @returns {Promise.<types_server.server['response'] & {result?:types_server.ORM['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async parameters =>{
    if (parameters.resource_id==null){
        return server.getError({statusCode: 400});
    }
    else
        if (get({   app_id:parameters.app_id, 
            resource_id:parameters.resource_id, 
            data:{  iam_user_id:parameters.data.iam_user_id, 
                    iam_user_id_follow:null}}).result?.[0])
            return server.ORM.Execute({  app_id:parameters.app_id, 
                                        dml:'DELETE', 
                                        object:'IamUserFollow', 
                                        delete:{resource_id:parameters.resource_id, data_app_id:null}});
        else
            return server.getError({statusCode: 401});
};

export {get, post, deleteRecord};
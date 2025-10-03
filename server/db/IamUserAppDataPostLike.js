/** @module server/db/IamUserAppDataPostLike */

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
 *                  data_app_id:number|null,
 *                  iam_user_app_data_post_id:number|null}}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamUserAppDataPostLike'][] }}
 */
const get = parameters =>{
    const IamUserApp_records =  server.ORM.db.IamUserApp.get({ app_id:parameters.app_id,
                                                resource_id:null, 
                                                data:{iam_user_id:parameters.data.iam_user_id, data_app_id:parameters.data.data_app_id}}).result;
    const result = (server.ORM.getObject(parameters.app_id, 'IamUserAppDataPostLike',parameters.resource_id, null).result ??[])
                        .filter((/**@type{server['ORM']['Object']['IamUserAppDataPostLike']}*/row)=>
                            row.IamUserAppDataPostId == (parameters.data.iam_user_app_data_post_id ?? row.IamUserAppDataPostId) &&
                            IamUserApp_records
                            .filter((/**@type{server['ORM']['Object']['IamUserApp']}*/rowIamUserApp)=>
                                row.IamUserAppId == rowIamUserApp.Id
                            )
                            .length>0
                        );
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return server.ORM.getError(parameters.app_id, 404);
};

/**
 * @name post
 * @description Create record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data: { iam_user_app_data_post_id:server['ORM']['Object']['IamUserAppDataPostLike']['IamUserAppDataPostId'],
 *                  iam_user_id:server['ORM']['Object']['IamUserApp']['IamUserId'],
 *                  data_app_id:server['ORM']['Object']['IamUserApp']['AppId'],}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async parameters =>{
    //check required attributes
    if (parameters.data.iam_user_id==null || parameters.data.data_app_id==null || parameters.data.iam_user_app_data_post_id==null){
        return server.ORM.getError(parameters.app_id, 400);
    }
    else{
        /**@type{server['ORM']['Object']['IamUserApp']} */
        const result = server.ORM.db.IamUserApp.get({app_id:parameters.app_id, resource_id:null, data:{   iam_user_id:parameters.data.iam_user_id, 
                                                                                            data_app_id:parameters.data.data_app_id}}).result[0];
        /**@type{server['ORM']['Object']['IamUserAppDataPostLike']} */
        const data_new =     {
                                Id:Date.now(),
                                /**@ts-ignore */
                                IamUserAppId:result.Id, 
                                IamUserAppDataPostId:parameters.data.iam_user_app_data_post_id,
                                Created:new Date().toISOString()
                        };
        return server.ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'IamUserAppDataPostLike', post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
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
 *          data: { iam_user_app_data_post_id:server['ORM']['Object']['IamUserAppDataPostLike']['IamUserAppDataPostId'],
 *                  iam_user_id:server['ORM']['Object']['IamUserApp']['IamUserId'],
 *                  data_app_id:server['ORM']['Object']['IamUserApp']['IamUserId'],}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async parameters =>{
    const result = get({app_id:parameters.app_id, resource_id:null, data:{  iam_user_id:parameters.data.iam_user_id, 
                                                                            data_app_id:parameters.data.data_app_id,
                                                                            iam_user_app_data_post_id:parameters.data.iam_user_app_data_post_id}}).result[0];
    return server.ORM.Execute({  app_id:parameters.app_id, 
                                dml:'DELETE', 
                                object:'IamUserAppDataPostLike', 
                                delete:{resource_id:parameters.resource_id ?? result.id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(parameters.app_id, 404);
    });
};

export {get, post, deleteRecord};
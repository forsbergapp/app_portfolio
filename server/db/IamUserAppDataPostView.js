/** @module server/db/IamUserAppDataPostView */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamUserAppDataPostView'][] }}
 */
const get = parameters =>{
    const result = server.ORM.getObject(parameters.app_id, 'IamUserAppDataPostView',parameters.resource_id, null).result
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return server.ORM.getError(parameters.app_id, 404);
};

/**
 * @name getViewUser
 * @description getViewUser
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  iam_user_app_data_post_id:number|null,
 *                  iam_user_id:number|null,
 *                  data_app_id:number}}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamUserAppDataPostView'][] }}
 */
const getViewUser = parameters =>{
    const IamUserApp_records =  server.ORM.db.IamUserApp.get({ app_id:parameters.app_id,
                                                resource_id:null, 
                                                data:{iam_user_id:parameters.data.iam_user_id, data_app_id:parameters.data.data_app_id}}).result;
    const result = (server.ORM.getObject(parameters.app_id, 'IamUserAppDataPostView',parameters.resource_id, null).result??[])
                    .filter((/**@type{server['ORM']['Object']['IamUserAppDataPostView']}*/row)=>
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
 * @param {number} app_id  
 * @param {server['ORM']['Object']['IamUserAppDataPostView']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) =>{
    //check required attributes
    if (data.IamUserAppDataPostId==null){
        return server.ORM.getError(app_id, 400);
    }
    else{
        /**@type{server['ORM']['Object']['IamUserAppDataPostView']} */
        const data_new =     {
                                Id:Date.now(),
                                Document:{  client_ip: data.Document.client_ip,
                                            client_user_agent: data.Document.client_user_agent},
                                IamUserAppId:data.IamUserAppId, 
                                IamUserAppDataPostId:data.IamUserAppDataPostId,
                                Created:new Date().toISOString()
                        };
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamUserAppDataPostView', post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
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
 * @param {{app_id:number,
 *          resource_id:number}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async parameters =>{   
    return server.ORM.Execute({  app_id:parameters.app_id, 
                                dml:'DELETE', 
                                object:'IamUserAppDataPostView', 
                                delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(parameters.app_id, 404);
    });
};

export {get, getViewUser, post, deleteRecord};
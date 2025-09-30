/** @module server/db/IamUserAppDataPostView */

/**
 * @import {server_server_response,
 *          server_db_table_IamUserAppDataPostView,
 *          server_db_table_IamUserApp,
 *          server_db_common_result_delete,
 *          server_db_common_result_insert} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  iam_user_app_data_post_id:number|null,
 *                  iam_user_id:number|null,
 *                  data_app_id:number}}} parameters
 * @returns {server_server_response & {result?:server_db_table_IamUserAppDataPostView[] }}
 */
const get = parameters =>{
    const IamUserApp_records =  server.ORM.db.IamUserApp.get({ app_id:parameters.app_id,
                                                resource_id:null, 
                                                data:{iam_user_id:parameters.data.iam_user_id, data_app_id:parameters.data.data_app_id}}).result;
    const result = (server.ORM.getObject(parameters.app_id, 'IamUserAppDataPostView',parameters.resource_id, null).result??[])
                    .filter((/**@type{server_db_table_IamUserAppDataPostView}*/row)=>
                        row.iam_user_app_data_post_id == (parameters.data.iam_user_app_data_post_id ?? row.iam_user_app_data_post_id) && 
                        IamUserApp_records
                        .filter((/**@type{server_db_table_IamUserApp}*/rowIamUserApp)=>
                            row.iam_user_app_id == rowIamUserApp.id
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
 * @param {server_db_table_IamUserAppDataPostView} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) =>{
    //check required attributes
    if (data.iam_user_app_data_post_id==null){
        return server.ORM.getError(app_id, 400);
    }
    else{
        /**@type{server_db_table_IamUserAppDataPostView} */
        const data_new =     {
                                id:Date.now(),
                                Document:{  client_ip: data.Document.client_ip,
                                            client_user_agent: data.Document.client_user_agent},
                                iam_user_app_id:data.iam_user_app_id, 
                                iam_user_app_data_post_id:data.iam_user_app_data_post_id,
                                created:new Date().toISOString()
                        };
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamUserAppDataPostView', post:{data:data_new}}).then((/**@type{server_db_common_result_insert}*/result)=>{
            if (result.affectedRows>0){
                result.insertId=data_new.id;
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
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async parameters =>{   
    return server.ORM.Execute({  app_id:parameters.app_id, 
                                dml:'DELETE', 
                                object:'IamUserAppDataPostView', 
                                delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((/**@type{server_db_common_result_delete}*/result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(parameters.app_id, 404);
    });
};

export {get, post, deleteRecord};
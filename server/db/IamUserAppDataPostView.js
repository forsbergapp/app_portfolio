/** @module server/db/IamUserAppDataPostView */

/**
 * @import {server_server_response,
 *          server_db_table_IamUserAppDataPostView,
 *          server_db_table_IamUserApp,
 *          server_db_common_result_delete,
 *          server_db_common_result_insert} from '../types.js'
 */
/**@type{import('./ORM.js')} */
const ORM = await import(`file://${process.cwd()}/server/db/ORM.js`);

/**@type{import('./IamUserApp.js')} */
const IamUserApp = await import(`file://${process.cwd()}/server/db/IamUserApp.js`);
/**
 * @name get
 * @description Get user account app
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  iam_user_app_data_post_id:number|null,
 *                  iam_user_id:number|null,
 *                  data_app_id:number}}} parameters
 * @returns {server_server_response & {result?:server_db_table_IamUserAppDataPostView[] }}
 */
const get = parameters =>{
    const result = ORM.getObject(parameters.app_id, 'IamUserAppDataPostView',parameters.resource_id, null).rows
                    .filter((/**@type{server_db_table_IamUserAppDataPostView}*/row)=>
                        row.iam_user_app_data_post_id == (parameters.data.iam_user_app_data_post_id ?? row.iam_user_app_data_post_id) && 
                        IamUserApp.get({ app_id:parameters.app_id,
                            resource_id:null, 
                            data:{iam_user_id:parameters.data.iam_user_id, data_app_id:parameters.data.data_app_id}}).result
                        .filter((/**@type{server_db_table_IamUserApp}*/rowIamUserApp)=>
                            row.iam_user_app_id == rowIamUserApp.id
                        )
                        .length>0
                    );
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return ORM.getError(parameters.app_id, 404);
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
        return ORM.getError(app_id, 400);
    }
    else{
        /**@type{server_db_table_IamUserAppDataPostView} */
        const data_new =     {
                                id:Date.now(),
                                iam_user_app_id:data.iam_user_app_id, 
                                iam_user_app_data_post_id:data.iam_user_app_data_post_id,
                                client_ip: data.client_ip,
                                client_user_agent: data.client_user_agent,
                                created:new Date().toISOString()
                        };
        return ORM.Execute({app_id:app_id, dml:'POST', object:'IamUserAppDataPostView', post:{data:data_new}}).then((result)=>{
            if (result.affectedRows>0){
                result.insertId=data_new.id;
                return {result:result, type:'JSON'};
            }
            else
                return ORM.getError(app_id, 404);
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
    return ORM.Execute({  app_id:parameters.app_id, 
                                dml:'DELETE', 
                                object:'IamUserAppDataPostView', 
                                delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return ORM.getError(parameters.app_id, 404);
    });
};

export {get, post, deleteRecord};
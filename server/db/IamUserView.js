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
 * @returns {server['server']['response'] & {result?:server['ORM']['IamUserView'][] }}
 */
const get = parameters =>{
    const result = (server.ORM.getObject(parameters.app_id, 'IamUserView',parameters.resource_id, null).result??[])
                    .filter((/**@type{server['ORM']['IamUserView']}*/row)=>
                        row.iam_user_id == (parameters.data.iam_user_id ?? row.iam_user_id) &&
                        row.iam_user_id_view == (parameters.data.iam_user_id_view ?? row.iam_user_id_view) );
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
 * @param {server['ORM']['IamUserView']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORMMetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) =>{
    //check required attributes
    if (data.iam_user_id_view==null){
        return server.ORM.getError(app_id, 400);
    }
    else{
        /**@type{server['ORM']['IamUserView']} */
        const data_new =     {
                                id:Date.now(),
                                iam_user_id:data.iam_user_id, 
                                iam_user_id_view:data.iam_user_id_view,
                                client_ip:data.client_ip,
                                client_user_agent:data.client_user_agent,
                                created:new Date().toISOString()
                        };
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamUserView', post:{data:data_new}}).then((/**@type{server['ORMMetaData']['common_result_insert']}*/result)=>{
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
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORMMetaData']['common_result_delete'] }>}
 */
const deleteRecord = async parameters =>{
    return server.ORM.Execute({  app_id:parameters.app_id, 
                                dml:'DELETE', 
                                object:'IamUserView', 
                                delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((/**@type{server['ORMMetaData']['common_result_delete']}*/result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(parameters.app_id, 404);
    });
};

export {get, post, deleteRecord};
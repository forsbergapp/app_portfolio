/** @module server/db/AppDataEntity */

/**
 * @import {server_server_response,server_db_table_AppDataEntity, server_db_common_result_insert, server_db_common_result_update, server_db_common_result_delete} from '../types.js'
 */

const ORM = await import('./ORM.js');

/**
 * @name get
 * @description Get record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{data_app_id?:number|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_AppDataEntity[] }}
 */
const get = parameters =>{ 
    const result = ORM.getObject(parameters.app_id, 'AppDataEntity',parameters.resource_id, parameters.data.data_app_id??null);
    if (result.rows.length>0 || parameters.resource_id==null)
        return {result:result.rows, type:'JSON'};
    else
        return ORM.getError(parameters.app_id, 404);
};
/**
 * @name post
 * @description Create record
 * @function
 * @param {{app_id:number,
 *          data:server_db_table_AppDataEntity}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert}>}
 */
const post = async parameters => {
    //check required attributes
    if (parameters.data.app_id==null){
        return ORM.getError(parameters.app_id, 400);
    }
    else{
        /**@type{server_db_table_AppDataEntity} */
        const data_new =     {
                                id:Date.now(),
                                app_id:parameters.data.app_id, 
                                json_data:parameters.data.json_data,
                                created:new Date().toISOString(),
                                modified:null
                        };
        return ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'AppDataEntity', post:{data:data_new}}).then((result)=>{
            if (result.affectedRows>0){
                result.insertId=data_new.id;
                return {result:result, type:'JSON'};
            }
            else
                return ORM.getError(parameters.app_id, 404);
        });
    }
};
/**
 * @name update
 * @description Update record
 * @function
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:server_db_table_AppDataEntity}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters =>{
    //check required attributes
    if (parameters.resource_id==null){
        return ORM.getError(parameters.app_id, 400);
    }
    else{
        /**@type{server_db_table_AppDataEntity} */
        const data_update = {};
        //allowed parameters to update:
        if (parameters.data.json_data!=null)
            data_update.json_data = parameters.data.json_data;
        data_update.modified = new Date().toISOString();
        if (Object.entries(data_update).length>0)
            return ORM.Execute({app_id:parameters.app_id, dml:'UPDATE',object:'AppDataEntity', update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((result)=>{
                if (result.affectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return ORM.getError(parameters.app_id, 404);
            });
        else
            return ORM.getError(parameters.app_id, 400);
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
    return ORM.Execute({app_id:parameters.app_id, dml:'DELETE', object:'AppDataEntity', delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return ORM.getError(parameters.app_id, 404);
    });
};
export {get, post, update, deleteRecord};
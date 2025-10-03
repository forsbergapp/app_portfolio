/** @module server/db/IamUserEvent */

/**
 * @import {server} from '../types.js'
 */

const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get record 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamUserEvent'][] }}
 */
const get = (app_id, resource_id) =>server.ORM.getObject(app_id, 'IamUserEvent',resource_id, null);

/**
 * @name post
 * @description Create record
 * @function
 * @param {number} app_id 
 * @param {server['ORM']['Object']['IamUserEvent']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (data.IamUserId==null || data.Event==null || data.EventStatus==null||
        //check not allowed attributes when creating a user
        data.Id||data.Created){
            return server.ORM.getError(app_id, 400);
    }
    else{
        /**@type{server['ORM']['Object']['IamUserEvent']} */
        const data_new =     {
                                Id:Date.now(),
                                IamUserId:data.IamUserId, 
                                Event:data.Event,
                                EventStatus:data.EventStatus,
                                Created:new Date().toISOString()
                        };
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamUserEvent', post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
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
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async (app_id, resource_id) => {
    return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'IamUserEvent', delete:{resource_id:resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(app_id, 404);
    });
};

export {get, post, deleteRecord };
/** @module server/db/AppData */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get record
 *              Returns records in base64 format to avoid records limit
 *              Data key contains:
 *              server['ORM']['Object']['AppData'][]
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  name?:string,
 *                  value?:string,
 *                  data_app_id?:string|number|null}}} parameters
 * @returns {server['server']['response'] & {result?:{data:string}[]}}
 */
const get = parameters => {
    const result = getServer({app_id:parameters.app_id, resource_id:parameters.resource_id, data:parameters.data})
    if (result.result)
        return {result:[{
                            data:Buffer.from (JSON.stringify(result.result)).toString('base64')
                        }], 
                type:'JSON'};
    else
        return result;
};

/**
 * @name getServer
 * @description Get record, called from server without base64 encoding
 * @function
 * @param {{app_id:Number,
*          resource_id:number|null,
*          data:{  name?:string,
*                  value?:string,
*                  data_app_id?:string|number|null}}} parameters
* @returns {server['server']['response'] & {result?:server['ORM']['Object']['AppData'][]}}
*/
const getServer = parameters => {
   const result = server.ORM.getObject(parameters.app_id, 'AppData',parameters.resource_id, server.ORM.UtilNumberValue(parameters.data.data_app_id));
   if (result.result)
       return {result:result.result.filter((/**@type{server['ORM']['Object']['AppData']}*/row)=>row.Name==(parameters.data?.name ?? row.Name) && row.Value==(parameters.data?.value ?? row.Value)), 
               type:'JSON'};
   else
       return result;
};

/**
 * @name post
 * @description Create record
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null && data.app_id!=null){
        /**@type{server['ORM']['Object']['AppData']} */
        const data_new ={
            Id:                 Date.now(),
            AppId:              data.app_id,
            Name:               data.name,
            Value:              data.value,
            DisplayData:        data.DisplayData,
            Data2:              data.data2,
            Data3:              data.data3,
            Data4:              data.data4,
            Data5:              data.data5
        };
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'AppData', post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
            if (result.AffectedRows>0){
                result.InsertId = data_new.Id;
                return {result:result, type:'JSON'};
            }
            else
                return server.ORM.getError(app_id, 404);
        });
    }
    else{
        return server.ORM.getError(app_id, 400);
    }
};
/**
 * @name update
 * @description Update record
 * @function
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:server['ORM']['Object']['AppData']}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const update = async parameters => {
    /**@type{server['ORM']['Object']['AppData']} */
    const data_update = {};
    //allowed parameters to update:
    if (parameters.data.Name!=null)
        data_update.Name = parameters.data.Name;
    if (parameters.data.Value!=null)
        data_update.Value = parameters.data.Value;
    if (parameters.data.DisplayData!=null)
        data_update.DisplayData = parameters.data.DisplayData;
    if (parameters.data.Data2!=null)
        data_update.Data2 = parameters.data.Data2;
    if (parameters.data.Data3!=null)
        data_update.Data3 = parameters.data.Data3;
    if (parameters.data.Data4!=null)
        data_update.Data4 = parameters.data.Data4;
    if (parameters.data.Data5!=null)
        data_update.Data5 = parameters.data.Data5;
    if (Object.entries(data_update).length>0)
        return server.ORM.Execute({app_id:parameters.app_id, dml:'UPDATE', object:'AppData', update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((/**@type{server['ORM']['MetaData']['common_result_update']}*/result)=>{
            if (result.AffectedRows>0)
                return {result:result, type:'JSON'};
            else
                return server.ORM.getError(parameters.app_id, 404);
        });
    else
        return server.ORM.getError(parameters.app_id, 400);
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
    return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'AppData', delete:{resource_id:resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(app_id, 404);
    });
};
                   
export {get, getServer, post, update, deleteRecord};
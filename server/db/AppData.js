/** @module server/db/AppData */

/**
 * @import types_server from '../types.d.ts'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get record
 *              Returns records in base64 format to avoid records limit
 *              Data key contains:
 *              types_server.ORM['Object']['AppData'][]
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  name?:string,
 *                  value?:string,
 *                  data_app_id?:string|number|null}}} parameters
 * @returns {types_server.server['response'] & {result?:{data:string}[]}}
 */
const get = parameters => {
    const result = getServer({app_id:parameters.app_id, resource_id:parameters.resource_id, data:parameters.data})
    if (result.result)
        return {result:[{
                            data:Buffer.from (JSON.stringify(result.result)).toString('base64')
                        }], 
                type:'JSON'};
    else
        /**@ts-ignore */
        return result;
};

/**
 * @name getServer
 * @description Get record, called from server without base64 encoding
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
 *          resource_id:number|null,
 *          data:{  name?:string,
 *                  value?:string,
 *                  data_app_id?:string|number|null}}} parameters
 * @returns {types_server.server['response'] & {result:types_server.ORM['Object']['AppData'][]}}
 */
const getServer = parameters => {
   const result = server.ORM.getObject(parameters.app_id, 'AppData',parameters.resource_id, server.ORM.UtilNumberValue(parameters.data.data_app_id));
   if (result.result)
       return {result:result.result.filter((/**@type{types_server.ORM['Object']['AppData']}*/row)=>row.Name==(parameters.data?.name ?? row.Name) && row.Value==(parameters.data?.value ?? row.Value)), 
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
 * @returns {Promise.<types_server.server['response'] & {result?:types_server.ORM['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null && data.app_id!=null){
        /**@type{types_server.ORM['Object']['AppData']} */
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
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'AppData', post:{data:data_new}});
    }
    else
        return server.getError({statusCode: 400});
};
/**
 * @name update
 * @description Update record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{  name: types_server.ORM['Object']['AppData']['Name'],
 *                  value: types_server.ORM['Object']['AppData']['Value'],
 *                  display_data: types_server.ORM['Object']['AppData']['DisplayData'],
 *                  data2: types_server.ORM['Object']['AppData']['Data2'],
 *                  data3: types_server.ORM['Object']['AppData']['Data3'],
 *                  data4: types_server.ORM['Object']['AppData']['Data4'],
 *                  data5: types_server.ORM['Object']['AppData']['Data5']}}} parameters
 * @returns {Promise.<types_server.server['response'] & {result?:types_server.ORM['MetaData']['common_result_update'] }>}
 */
const update = async parameters => {
    /**@type{types_server.ORM['Object']['AppData']} */
    const data_update = {};
    //allowed parameters to update:
    if (parameters.data.name!=null)
        data_update.Name = parameters.data.name;
    if (parameters.data.value!=null)
        data_update.Value = parameters.data.value;
    if (parameters.data.display_data!=null)
        data_update.DisplayData = parameters.data.display_data;
    if (parameters.data.data2!=null)
        data_update.Data2 = parameters.data.data2;
    if (parameters.data.data3!=null)
        data_update.Data3 = parameters.data.data3;
    if (parameters.data.data4!=null)
        data_update.Data4 = parameters.data.data4;
    if (parameters.data.data5!=null)
        data_update.Data5 = parameters.data.data5;
    if (Object.entries(data_update).length>0)
        return server.ORM.Execute({app_id:parameters.app_id, dml:'UPDATE', object:'AppData', update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}});
    else
        return server.getError({statusCode: 400});
};

/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<types_server.server['response'] & {result?:types_server.ORM['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async (app_id, resource_id) =>
    server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'AppData', delete:{resource_id:resource_id, data_app_id:null}});

                   
export {get, getServer, post, update, deleteRecord};
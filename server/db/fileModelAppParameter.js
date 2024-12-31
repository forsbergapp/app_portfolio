/** @module server/db/fileModelAppParameter */

/**
 * @import {server_server_res,
 *          server_db_file_app_parameter} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileCommonRecordNotFound, fileDBGet, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);

/**
 * @name get
 * @description Get records for given appid
 * @function
 * @param {{app_id:number,
 *          res:server_server_res|null}} parameters
 * @returns {server_db_file_app_parameter[]}
 */
const get = parameters =>{
    const result = fileDBGet(parameters.app_id, 'APP_PARAMETER',null, parameters.app_id);
    if (result.length>0)
        return result;
    else
        throw fileCommonRecordNotFound(parameters.res);
};

/**
 * @name post
 * @description Add record
 *              Table is designed to add one parameter in the same record
 *              so update function is called  and returns same resource id
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 * @param {server_server_res} res
 * @returns {Promise.<{id:number}>}
 */
const post = async (app_id, resource_id, data, res) => update({app_id:app_id, resource_id:resource_id, data:data, res:res}).then(()=>{return {id:resource_id};}) ;
/**
 * @name update
 * @description Update
 * Table is designed to update one parameter in the same record
 * @function
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{  parameter_name:string,
 *                  parameter_value:string,
 *                  parameter_comment:string},
 *          res:server_server_res}} parameters
 * @returns {Promise.<{affectedRows:number}>}
 */
const update = async parameters => {
    if  (parameters.data.parameter_name=='app_id'){
        /**@type{import('../iam.service.js')} */
        const  {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.service.js`);
        parameters.res.statusCode = 400;
        throw iamUtilMesssageNotAuthorized();
    }
    else{
        //updates only one key in the record
        return fileDBUpdate(parameters.app_id, 'APP_PARAMETER', null, parameters.resource_id, {[parameters.data.parameter_name]:{value:parameters.data.parameter_value, 
                                                                                                comment:parameters.data.parameter_comment}}).then((result)=>{
            if (result.affectedRows>0)
                return result;
            else
                throw fileCommonRecordNotFound(parameters.res);
        });
    }
};

/**
 * @name deleteRecord
 * @description Delete
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {server_server_res} res
 * @returns {Promise.<{affectedRows:number}>}
 */
const deleteRecord = async (app_id, resource_id, res) => {
    return fileDBDelete(app_id, 'APP_PARAMETER', null, resource_id).then((result)=>{
        if (result.affectedRows>0)
            return result;
        else
            throw fileCommonRecordNotFound(res);
    });
};
                   
export {get, post, update, deleteRecord};
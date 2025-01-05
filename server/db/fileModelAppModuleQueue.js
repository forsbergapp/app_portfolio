/** @module server/db/fileModelAppModuleQueue */

/**
 * @import {server_server_res,server_db_file_app_module_queue_status,
 *          server_db_file_app_module_queue} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileCommonRecordNotFound, SLASH, fileRecord, fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);

/**
 * @name get
 * @description Get records for given appid
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          res:server_server_res}} parameters
 * @returns {server_db_file_app_module_queue[]}
 */
const get = parameters =>{ 
    const result = fileDBGet(parameters.app_id, 'APP_MODULE_QUEUE',parameters.resource_id, parameters.app_id);
    if (result.length>0 || parameters.resource_id==null)
        return result;
    else
        throw fileCommonRecordNotFound(parameters.res);
};

/**
 * @name getResult
 * @description Get result for given resource_id
 *              (bff controls if file exists)
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {Promise.<{STATIC:Boolean, SENDFILE:String, SENDCONTENT:null}>}
 */
const getResult = async parameters => {
    return {STATIC:true, SENDFILE:process.cwd() + `${fileRecord('DB_FILE').PATH}${SLASH}jobs${SLASH}${parameters.resource_id}.html`, SENDCONTENT:null};
};
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {{type:'REPORT',
 *          name:string,
 *          parameters:string,
 *          user:string}} data
 * @param {server_server_res} res
 * @returns {Promise.<server_db_file_app_module_queue>}
 */
const post = async (app_id, data, res) => {
    //check required attributes
    if (app_id!=null && data.type!=null && data.name!=null && data.parameters!=null && data.user!=null){
        /**@type{server_db_file_app_module_queue} */
        const job =     {
                            id:Date.now(),
                            app_id:app_id,                            
                            type: data.type, 
                            name:data.name,
                            parameters:data.parameters,
                            user: data.user,
                            start:null,
                            end:null,
                            progress:null,
                            status:'PENDING',
                            message:null
                        };
        return fileDBPost(app_id, 'APP_MODULE_QUEUE', job).then((result)=>{
            if (result.affectedRows>0)
                return job;
            else
                throw fileCommonRecordNotFound(res);
        });
    }
    else{
        /**@type{import('../iam.service.js')} */
        const  {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.service.js`);
        res.statusCode = 400;
        throw iamUtilMesssageNotAuthorized();
    }
};
/**
 * @name postResult
 * @description Post result
 * @function
 * @param {number} app_id
 * @param {number} id
 * @param {string} result
 * @returns {Promise.<void>}
 */
const postResult = async (app_id, id, result) =>{
    const fs = await import('node:fs');
    const filepath = `${fileRecord('DB_FILE').PATH}${SLASH}jobs${SLASH}${id}.html`;
    await fs.promises.writeFile(process.cwd() + filepath, result,  'utf8');
};
/**
 * @name update
 * @description Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {{start?:string|null,
 *          end?:string|null,
 *          progress?:number|null,
 *          status?:server_db_file_app_module_queue_status,
 *          message?:string|null}} data
 * @param {server_server_res|null} res
 * @returns {Promise.<{affectedRows:number}>}
 */
const update = async (app_id, resource_id, data, res) => {
    const data_update = {};
    //allowed parameters to update:
    if (data.start!=null)
        data_update.start = data.start;
    if (data.end!=null)
        data_update.end = data.end;
    if (data.progress!=null)
        data_update.progress = data.progress;
    if (data.status!=null)
        data_update.status = data.status;
    if (data.message!=null)
        data_update.message = data.message;
    if (Object.entries(data_update).length>0)
        return fileDBUpdate(app_id, 'APP_MODULE_QUEUE', resource_id, null, data_update).then((result)=>{
            if (result.affectedRows>0)
                return result;
            else
                throw fileCommonRecordNotFound(res);
        });
    else{
        /**@type{import('../iam.service.js')} */
        const  {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.service.js`);
        if (res)
            res.statusCode = 404;
        throw iamUtilMesssageNotAuthorized();
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
    return fileDBDelete(app_id, 'APP_MODULE_QUEUE', resource_id, null).then((result)=>{
        if (result.affectedRows>0)
            return result;
        else
            throw fileCommonRecordNotFound(res);
    });
};
                   
export {get, getResult, post, postResult, update, deleteRecord};
/** @module server/db/fileModelApp */

/**
 * @import {server_server_res,
 *          server_db_file_app} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileCommonRecordNotFound, fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);

/**
 * @name get
 * @description Get records for given appid
 * @function
 * @memberof REST_API
 * @param {{app_id:number|null,
 *          resource_id:number|null,
 *          res:server_server_res|null}} parameters
 * @returns {server_db_file_app[]}
 */
const get = parameters =>{ 
    const result = fileDBGet(parameters.app_id, 'APP',parameters.resource_id, null);
    if (result.length>0 || parameters.resource_id==null)
        return result;
    else
        throw fileCommonRecordNotFound(parameters.res);
};

/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @param {server_server_res} res
 * @returns {Promise.<{id:number}>}
 */
const post = async (app_id, data, res) => {
    //check required attributes
    if (app_id!=null){
        /**@type{server_db_file_app} */
        const app =     {
            //fetch max app id + 1
            id:Math.max(...fileDBGet(app_id, 'APP',null, null).map((/**@type{server_db_file_app}*/app)=>app.id)) +1,
            name: data.name,
            subdomain: data.subdomain,
            path: data.path,
            logo: data.logo,
            showparam: data.showparam,
            manifest: data.manifest,
            js: data.js,
            css: data.css,
            css_report: data.css_report,
            favicon_32x32: data.favicon_32x32,
            favicon_192x192: data.favicon_192x192,
            status: 'ONLINE'
        };
        return fileDBPost(app_id, 'APP', app).then((result)=>{
            if (result.affectedRows>0)
                return {id:app.id};
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
 * @name update
 * @description Update
 * @function
 * @memberof REST_API
 * @param {{app_id:Number,
 *          resource_id:number,
 *          data:{  name:string,
 *                  subdomain:string,
 *                  path:string,
 *                  logo:string,
 *                  showparam:number,
 *                  manifest:string,
 *                  js:string,
 *                  css:string,
 *                  css_report:string,
 *                  favicon_32x32:string,
 *                  favicon_192x192:string,
 *                  status:'ONLINE'|'OFFLINE'},
 *          res:server_server_res}} parameters
 * @returns {Promise.<{affectedRows:number}>}
 */
const update = async parameters => {
    /**@type{import('../iam.service.js')} */
    const  {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.service.js`);

    if (parameters.app_id!=null){
        /**@type{server_db_file_app} */
        const data_update = {};
        //allowed parameters to update:
        if (parameters.data.name!=null)
            data_update.name = parameters.data.name;
        if (parameters.data.subdomain!=null)
            data_update.subdomain = parameters.data.subdomain;
        if (parameters.data.path!=null)
            data_update.path = parameters.data.path;
        if (parameters.data.logo!=null)
            data_update.logo = parameters.data.logo;
        if (parameters.data.showparam!=null)
            data_update.showparam = parameters.data.showparam;
        if (parameters.data.manifest!=null)
            data_update.manifest = parameters.data.manifest;
        if (parameters.data.js!=null)
            data_update.js = parameters.data.js;
        if (parameters.data.css!=null)
            data_update.css = parameters.data.css;
        if (parameters.data.css_report!=null)
            data_update.css_report = parameters.data.css_report;
        if (parameters.data.favicon_32x32!=null)
            data_update.favicon_32x32 = parameters.data.favicon_32x32;
        if (parameters.data.favicon_192x192!=null)
            data_update.favicon_192x192 = parameters.data.favicon_192x192;
        if (parameters.data.status!=null)
            data_update.status = parameters.data.status;
        if (Object.entries(data_update).length>0)
            return fileDBUpdate(parameters.app_id, 'APP', parameters.resource_id, null, data_update).then((result)=>{
                if (result.affectedRows>0)
                    return result;
                else
                    throw fileCommonRecordNotFound(parameters.res);
            });
        else{
            parameters.res.statusCode = 404;
            throw iamUtilMesssageNotAuthorized();
        }
    }
    else{
        parameters.res.statusCode = 400;
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
    return fileDBDelete(app_id, 'APP', resource_id, null).then((result)=>{
        if (result.affectedRows>0)
            return result;
        else
            throw fileCommonRecordNotFound(res);
    });
};
                   
export {get, post, update, deleteRecord};
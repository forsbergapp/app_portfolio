/** @module server/db/fileModelApp */

/**
 * @import {server_server_res,
 *          server_db_file_app} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileCommonRecordNotFound, fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);

/**
 * Get records for given appid
 * @function
 * @param {number|null} app_id
 * @param {number|null} resource_id //if empty then fetch all apps
 * @param {server_server_res|null} res
 * @returns {server_db_file_app[]}
 */
const get = (app_id, resource_id, res) =>{ 
    const result = fileDBGet(app_id, 'APP',resource_id, null);
    if (result.length>0 || resource_id==null)
        return result;
    else
        throw fileCommonRecordNotFound(res);
};

/**
 * Add record
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
        res.statusCode = 400;
        throw '⛔';    
    }
};
/**
 * Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 * @param {server_server_res} res
 * @returns {Promise.<{affectedRows:number}>}
 */
const update = async (app_id, resource_id, data, res) => {
    if (app_id!=null){
        /**@type{server_db_file_app} */
        const data_update = {};
        //allowed parameters to update:
        if (data.name!=null)
            data_update.name = data.name;
        if (data.subdomain!=null)
            data_update.subdomain = data.subdomain;
        if (data.path!=null)
            data_update.path = data.path;
        if (data.logo!=null)
            data_update.logo = data.logo;
        if (data.showparam!=null)
            data_update.showparam = data.showparam;
        if (data.manifest!=null)
            data_update.manifest = data.manifest;
        if (data.js!=null)
            data_update.js = data.js;
        if (data.css!=null)
            data_update.css = data.css;
        if (data.css_report!=null)
            data_update.css_report = data.css_report;
        if (data.favicon_32x32!=null)
            data_update.favicon_32x32 = data.favicon_32x32;
        if (data.favicon_192x192!=null)
            data_update.favicon_192x192 = data.favicon_192x192;
        if (data.status!=null)
            data_update.status = data.status;
        if (Object.entries(data_update).length>0)
            return fileDBUpdate(app_id, 'APP', resource_id, null, data_update).then((result)=>{
                if (result.affectedRows>0)
                    return result;
                else
                    throw fileCommonRecordNotFound(res);
            });
        else{
            res.statusCode = 404;
            throw '⛔';    
        }
    }
    else{
        res.statusCode = 400;
        throw '⛔';
    }
};

/**
 * Delete
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
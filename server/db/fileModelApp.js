/** @module server/db/fileModelApp */

/**
 * @import {server_server_res,
 *          server_db_file_app} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get records for given appid
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id //if empty then fetch all apps
 * @param {server_server_res|null} res
 * @returns {server_db_file_app[]}
 */
const get = (app_id, resource_id, res) => fileDBGet(app_id, 'APP',resource_id, null, res);

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
    if (!app_id){
        res.statusCode = 400;
        throw '⛔';    
    }
    else{
        /**@type{server_db_file_app} */
        const app =     {
                            //fetch max app id + 1
                            id:Math.max(...fileDBGet(app_id, 'APP',null, null, res).map((/**@type{server_db_file_app}*/app)=>app.id)) +1,
                            name: data.NAME,
                            subdomain: data.subdomain,
                            path: data.PATH,
                            logo: data.LOGO,
                            showparam: data.SHOWPARAM,
                            manifest: data.MANIFEST,
                            js: data.JS,
                            css: data.CSS,
                            css_report: data.CSS_REPORT,
                            favicon_32x32: data.FAVICON_32x32,
                            favicon_192x192: data.FAVICON_192x192,
                            status: 'ONLINE'
                        };
        return fileDBPost(app_id, 'APP', app, res).then(()=>{return {id:app.id};});
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
    if (!app_id){
        res.statusCode = 400;
        throw '⛔';    
    }
    else{
        /**@type{server_db_file_app} */
        const data_update = {};
        //allowed parameters to update:
        if (data.NAME)
            data_update.name = data.NAME;
        if (data.subdomain)
            data_update.subdomain = data.subdomain;
        if (data.PATH)
            data_update.path = data.PATH;
        if (data.LOGO)
            data_update.logo = data.LOGO;
        if (data.SHOWPARAM)
            data_update.showparam = data.SHOWPARAM;
        if (data.MANIFEST)
            data_update.manifest = data.MANIFEST;
        if (data.JS)
            data_update.js = data.JS;
        if (data.CSS)
            data_update.css = data.CSS;
        if (data.CSS_REPORT)
            data_update.css_report = data.CSS_REPORT;
        if (data.FAVICON_32x32)
            data_update.favicon_32x32 = data.FAVICON_32x32;
        if (data.FAVICON_192x192)
            data_update.favicon_192x192 = data.FAVICON_192x192;
        if (data.STATUS)
            data_update.status = data.STATUS;
        if (Object.entries(data_update).length>0)
            return fileDBUpdate(app_id, 'APP', resource_id, null, data_update, res);
        else{
            res.statusCode = 404;
            throw '⛔';    
        }
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
    return fileDBDelete(app_id, 'APP_MODULE_QUEUE', resource_id, null, res);
};
                   
export {get, post, update, deleteRecord};
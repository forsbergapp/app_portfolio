/** @module server/db/App */

/**
 * @import {server_server_response,server_db_common_result_update, server_db_common_result_delete, 
 *          server_db_table_App, server_db_table_AppTranslation,
 *          server_config_apps_with_db_columns} from '../types.js'
 */

/**@type{import('./ORM.js')} */
const ORM = await import(`file://${process.cwd()}/server/db/ORM.js`);

/**
 * @name get
 * @description Get records for given appid
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {server_server_response & {result?:server_db_table_App[] }}
 */
const get = parameters =>{ 
    const result = ORM.getObject(parameters.app_id, 'App',parameters.resource_id, null);
    if (result.rows.length>0 || parameters.resource_id==null)
        return {result:result.rows, type:'JSON'};
    else
        return ORM.getError(parameters.app_id, 404);
};

/**
 * @name getViewInfo
 * @description Get all apps with translated name if any, logo from file and info to create url links
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
*          resource_id:number|null,
*          locale:string}} parameters
* @returns {Promise.<server_server_response & {result?:server_config_apps_with_db_columns[] }>}
*/
const getViewInfo = async parameters =>{
    /**@type{import('./AppTranslation.js')} */
    const AppTranslation = await import(`file://${process.cwd()}/server/db/AppTranslation.js`);
    /**@type{import('./Config.js')} */
    const Config = await import(`file://${process.cwd()}/server/db/Config.js`);

    /**@type{import('../server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
    
    const fs = await import('node:fs');

    /**@type{server_db_table_App[]}*/
    const apps = get({app_id:parameters.app_id, resource_id:null}).result
                    //do not show common app id
                    .filter((/**@type{server_db_table_App}*/app)=>app.id != serverUtilNumberValue(Config.get('ConfigServer','SERVER', 'APP_COMMON_APP_ID')));
    for (const app of apps){
        const image = await fs.promises.readFile(`${process.cwd()}${app.path + app.logo}`);
        /**@ts-ignore */
        app.logo        = 'data:image/webp;base64,' + Buffer.from(image, 'binary').toString('base64');
       }
    const HTTPS_ENABLE = Config.get('ConfigServer','SERVER','HTTPS_ENABLE');
    return {result:apps
            .filter(app=>app.id == (parameters.resource_id ?? app.id))
            .map(app=>{
                return {
                            app_id:app.id,
                            name:app.name,
                            subdomain:app.subdomain,
                            protocol : HTTPS_ENABLE =='1'?'https://':'http://',
                            host : Config.get('ConfigServer','SERVER','HOST'),
                            port : serverUtilNumberValue(HTTPS_ENABLE=='1'?
                                                Config.get('ConfigServer','SERVER','HTTPS_PORT'):
                                                    Config.get('ConfigServer','SERVER','HTTP_PORT')),
                            app_name_translation : AppTranslation.get(parameters.app_id,null,parameters.locale, app.id).result.filter((/**@type{server_db_table_AppTranslation}*/appTranslation)=>appTranslation.app_id==app.id)[0].json_data.name,
                            logo:app.logo
                        };
            }), type:'JSON'};
};

/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @returns {Promise.<server_server_response & {result?:{id:number} }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null){
        /**@type{server_db_table_App} */
        const app =     {
            //fetch max app id + 1
            id:Math.max(...ORM.getObject(app_id, 'App',null, null).rows.map((/**@type{server_db_table_App}*/app)=>app.id)) +1,
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
            text_edit:data.app_text_edit,
            copyright:data.app_copyright,
            email:data.app_email,
            link_title:data.app_link_title,
            link_url:data.app_link_url,
            status: 'ONLINE'
        };
        return ORM.Execute({app_id:app_id, dml:'POST', object:'App', post:{data:app}}).then((result)=>{
            if (result.affectedRows>0){
                result.insertId = app.id;
                return {result:result, type:'JSON'};
            }
            else
                return ORM.getError(app_id, 404);
        });
    }
    else
        return ORM.getError(app_id, 401);
};
/**
 * @name update
 * @description Update
 * @function
 * @memberof ROUTE_REST_API
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
 *                  text_edit:string,
 *                  copyright:string,
 *                  email:string,
 *                  link_title:string,
 *                  link_url:string,
 *                  status:'ONLINE'|'OFFLINE'}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters => {
    if (parameters.app_id!=null){
        /**@type{server_db_table_App} */
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

        if (parameters.data.text_edit!=null)
            data_update.text_edit = parameters.data.text_edit;
        if (parameters.data.copyright!=null)
            data_update.copyright = parameters.data.copyright;
        if (parameters.data.email!=null)
            data_update.email = parameters.data.email;
        if (parameters.data.link_title!=null)
            data_update.link_title = parameters.data.link_title;
        if (parameters.data.link_url!=null)
            data_update.link_url = parameters.data.link_url;

        if (parameters.data.status!=null)
            data_update.status = parameters.data.status;
        if (Object.entries(data_update).length>0)
            return ORM.Execute({app_id:parameters.app_id, dml:'UPDATE', object:'App', update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((result)=>{
                if (result.affectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return ORM.getError(parameters.app_id, 404);
            });
        else
            return ORM.getError(parameters.app_id, 400);
    }
    else
        return ORM.getError(parameters.app_id, 400);
};

/**
 * @name deleteRecord
 * @description Delete
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async (app_id, resource_id) => {
    return ORM.Execute({app_id:app_id, dml:'DELETE', object:'App', delete:{resource_id:resource_id, data_app_id:null}}).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return ORM.getError(app_id, 404);
    });
};
                   
export {get, getViewInfo, post, update, deleteRecord};
/** @module server/db/App */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get records for given appid
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['App'][] }}
 */
const get = parameters =>server.ORM.getObject(parameters.app_id, 'App',parameters.resource_id, null);

/**
 * @name getViewInfo
 * @description Get all apps with translated name if any, logo from file and info to create url links
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
*          resource_id:number|null}} parameters
* @returns {Promise.<server['server']['response'] & {result?:server['ORM']['View']['AppGetInfo'][] }>}
*/
const getViewInfo = async parameters =>{
    return {result:get({app_id:parameters.app_id, resource_id:null}).result
                    .filter((/**@type{server['ORM']['Object']['App']}*/app)=>app.Id == (parameters.resource_id ?? app.Id))
                    .map((/**@type{server['ORM']['Object']['App']}*/app)=>{
                        return {
                                    Id:app.Id,
                                    Name:app.Name,
                                    Logo:app.Logo,
                                    Js:app.Js,
                                    Css:app.Css,
                                    CssReport:app.CssReport,
                                    TextEdit: app.TextEdit,
                                    Copyright:app.Copyright,
                                    LinkTitle:app.LinkTitle,
                                    LinkUrl: app.LinkUrl
                                };
                    }), 
            type:'JSON'};
};

/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @returns {Promise.<server['server']['response'] & {result?:{id:number} }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null){
        /**@type{server['ORM']['Object']['App']} */
        const app =     {
            //fetch max app id + 1
            Id:Math.max(...server.ORM.getObject(app_id, 'App',null, null).result.map((/**@type{server['ORM']['Object']['App']}*/app)=>app.Id)) +1,
            Name: data.name,
            Path: data.path,
            Logo: data.logo,
            Js: data.js,
            Css: data.css,
            CssReport: data.css_report,
            TextEdit:data.app_text_edit,
            Copyright:data.app_copyright,
            LinkTitle:data.app_link_title,
            LinkUrl:data.app_link_url,
            Status: 'ONLINE'
        };
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'App', post:{data:app}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
            if (result.AffectedRows>0){
                result.InsertId = app.Id;
                return {result:result, type:'JSON'};
            }
            else
                return server.ORM.getError(app_id, 404);
        });
    }
    else
        return server.ORM.getError(app_id, 401);
};
/**
 * @name update
 * @description Update
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
 *          resource_id:number,
 *          data:{  name:string,
 *                  path:string,
 *                  logo:string,
 *                  js:string,
 *                  css:string,
 *                  css_report:string,
 *                  text_edit:string,
 *                  copyright:string,
 *                  link_title:string,
 *                  link_url:string,
 *                  status:'ONLINE'|'OFFLINE'}}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const update = async parameters => {
    if (parameters.app_id!=null){
        /**@type{server['ORM']['Object']['App']} */
        const data_update = {};
        //allowed parameters to update:
        if (parameters.data.name!=null)
            data_update.Name = parameters.data.name;
        if (parameters.data.path!=null)
            data_update.Path = parameters.data.path;
        if (parameters.data.logo!=null)
            data_update.Logo = parameters.data.logo;
        if (parameters.data.js!=null)
            data_update.Js = parameters.data.js;
        if (parameters.data.css!=null)
            data_update.Css = parameters.data.css;
        if (parameters.data.css_report!=null)
            data_update.CssReport = parameters.data.css_report;
        if (parameters.data.text_edit!=null)
            data_update.TextEdit = parameters.data.text_edit;
        if (parameters.data.copyright!=null)
            data_update.Copyright = parameters.data.copyright;
        if (parameters.data.link_title!=null)
            data_update.LinkTitle = parameters.data.link_title;
        if (parameters.data.link_url!=null)
            data_update.LinkUrl = parameters.data.link_url;

        if (parameters.data.status!=null)
            data_update.Status = parameters.data.status;
        if (Object.entries(data_update).length>0)
            return server.ORM.Execute({app_id:parameters.app_id, dml:'UPDATE', object:'App', update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((/**@type{server['ORM']['MetaData']['common_result_update']}*/result)=>{
                if (result.AffectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return server.ORM.getError(parameters.app_id, 404);
            });
        else
            return server.ORM.getError(parameters.app_id, 400);
    }
    else
        return server.ORM.getError(parameters.app_id, 400);
};

/**
 * @name deleteRecord
 * @description Delete
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async (app_id, resource_id) => {
    return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'App', delete:{resource_id:resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(app_id, 404);
    });
};
                   
export {get, getViewInfo, post, update, deleteRecord};
/** @module server/db/AppTranslation */

/**
 * @import {server_server_response,
 *          server_db_table_AppTranslation} from '../types.js'
 */

const {ORM} = await import ('../server.js');

/**
 * @name get
 * @description Get record
 *              Returns translation in found order
 *              1 = requested locale
 *              2 = language and region/script of locale containing language, region/script and country, zh-hant from zh-hant-cn
 *              3 = language of locale containing language and region/country/script ex zh from zh-hant, en from en-us or sr from sr-cyrl
 *              4 = default language
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @param {string|null} locale
 * @param {number} data_app_id
 * @returns {server_server_response & {result?:server_db_table_AppTranslation[] }}
 */
const get = (app_id, resource_id, locale, data_app_id) =>{
    //all locales should be saved with '-' if used
    const SPLIT = '-';
    const result = ORM.getObject(app_id, 'AppTranslation',resource_id, data_app_id).result.filter((/**@type{server_db_table_AppTranslation}*/row)=>row.app_id == data_app_id);
    if ((result ??[]).filter((/**@type{server_db_table_AppTranslation}*/row)=>row.locale == locale)[0]){
        //return found for requested locale
        return {result:result.filter((/**@type{server_db_table_AppTranslation}*/row)=>(row.locale == locale)), type:'JSON'};
    }        
    else
        if (locale?.split(SPLIT).length==3 && (result ??[]).filter((/**@type{server_db_table_AppTranslation}*/row)=>row.locale == (locale.split(SPLIT)[0] + SPLIT + locale.split(SPLIT)[1]))[0]){
            //return found for first and second part of locale
            return {result:result.filter((/**@type{server_db_table_AppTranslation}*/row)=>row.locale == (locale.split(SPLIT)[0] + SPLIT + locale.split(SPLIT)[1])), type:'JSON'};
        }            
        else
            if (locale?.split(SPLIT).length==2 && (result ??[]).filter((/**@type{server_db_table_AppTranslation}*/row)=>row.locale == locale.split(SPLIT)[0])[0]){
                //return found for first part of locale 
                return {result:result.filter((/**@type{server_db_table_AppTranslation}*/row)=>row.locale == locale.split(SPLIT)[0]), type:'JSON'};
            }
            else
                if ((result ??[]).filter((/**@type{server_db_table_AppTranslation}*/row)=>row.locale == 'en')){
                    //return found for default language
                    return {result:result.filter((/**@type{server_db_table_AppTranslation}*/row)=>row.locale == 'en'), type:'JSON'};
                }
                else
                    return ORM.getError(app_id, 404);
};
                   
export {get};
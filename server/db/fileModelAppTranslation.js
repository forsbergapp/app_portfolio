/** @module server/db/fileModelAppTranslation */

/**
 * @import {server_server_res,
 *          server_db_file_app_translation} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileCommonRecordNotFound, fileDBGet} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get records for given appid
 * Returns translation in found order
 * 1 = requested locale
 * 2 = language and region/script of locale containing language, region/script and country, zh-hant from zh-hant-cn
 * 3 = language of locale containing language and region/country/script ex zh from zh-hant, en from en-us or sr from sr-cyrl
 * 4 = default language
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @param {string|null} locale
 * @param {number} data_app_id
 * @param {server_server_res|null} res
 * @returns {server_db_file_app_translation[]}
 */
const get = (app_id, resource_id, locale, data_app_id, res) =>{
    //all locales should be saved with '-' if used
    const SPLIT = '-';
    const result = fileDBGet(app_id, 'APP_TRANSLATION',resource_id, data_app_id).filter((/**@type{server_db_file_app_translation}*/row)=>row.app_id == data_app_id);
    if (result.filter((/**@type{server_db_file_app_translation}*/row)=>row.locale == locale)[0]){
        //return found for requested locale
        return result.filter((/**@type{server_db_file_app_translation}*/row)=>(row.locale == locale));
    }        
    else
        if (locale?.split(SPLIT).length==3 && result.filter((/**@type{server_db_file_app_translation}*/row)=>row.locale == (locale.split(SPLIT)[0] + SPLIT + locale.split(SPLIT)[1]))[0]){
            //return found for first and second part of locale
            return result.filter((/**@type{server_db_file_app_translation}*/row)=>row.locale == (locale.split(SPLIT)[0] + SPLIT + locale.split(SPLIT)[1]));
        }            
        else
            if (locale?.split(SPLIT).length==2 && result.filter((/**@type{server_db_file_app_translation}*/row)=>row.locale == locale.split(SPLIT)[0])[0]){
                //return found for first part of locale 
                return result.filter((/**@type{server_db_file_app_translation}*/row)=>row.locale == locale.split(SPLIT)[0]);
            }
            else
                if (result.filter((/**@type{server_db_file_app_translation}*/row)=>row.locale == 'en')){
                    //return found for default language
                    return result.filter((/**@type{server_db_file_app_translation}*/row)=>row.locale == 'en');
                }
                else
                    throw fileCommonRecordNotFound(res);
};
                   
export {get};
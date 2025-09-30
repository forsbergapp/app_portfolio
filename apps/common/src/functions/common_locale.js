/**
 * @module apps/common/src/functions/common_locale
*/
/**
 * @import {server} from '../../../../server/types.js'
 */

const {getData} = await import('./common_data.js');
/**
 * @name formatLocale
 * @description Converts locale format
 *              Locales are saved in locale.json using this case sensitive structure:
 *              locale-list\data\[language]\language.json
 *              locale-list\data\[language_Script_COUNTRYCODE]\locale.json
 *              locale-list\data\[language_Script]\locale.json
 *              locale-list\data\[language_COUNTRYCODE]\locale.json
 *              {"de":"German", [code]:[Text], [code]:[Text], ...}
 * @function
 * @param {string} locale
 * @returns {string}
 */
const formatLocale = locale =>{
    //adjust from accept language if used  [locale],[locale],...;[browser options]
    const localeAdjust = (locale == null || locale=='' || !locale.split(',')[0])?'en-US':locale.split(',')[0];
    const SPLIT_IN  = '-';
    const SPLIT_OUT = '_';
    switch (localeAdjust.split('-').length){
        case 1:{
                    //language
            return  localeAdjust.toLowerCase();
        }
        case 2:{
                    //language
            return  localeAdjust.split(SPLIT_IN)[0].toLowerCase() + SPLIT_OUT + 
                    //country or region without country
                    ((localeAdjust.split(SPLIT_IN)[1].toLowerCase()=='cyrl'||
                    localeAdjust.split(SPLIT_IN)[1].toLowerCase()=='latn'||
                    localeAdjust.split(SPLIT_IN)[1].toLowerCase()=='arab'||
                    localeAdjust.split(SPLIT_IN)[1].toLowerCase()=='guru'||
                    localeAdjust.split(SPLIT_IN)[1].toLowerCase()=='hans'||
                    localeAdjust.split(SPLIT_IN)[1].toLowerCase()=='hant')?
                        localeAdjust.split(SPLIT_IN)[1][0].toUpperCase() + localeAdjust.split(SPLIT_IN)[1].substring(1).toLowerCase():
                            localeAdjust.split(SPLIT_IN)[1].toUpperCase());
        }
        case 3:{
                    //language
            return  localeAdjust.split(SPLIT_IN)[0].toLowerCase() + SPLIT_OUT + 
                    //region
                    //first letter uppercase, the rest lowercase
                    localeAdjust.split(SPLIT_IN)[1][0].toUpperCase() + localeAdjust.split(SPLIT_IN)[1].substring(1).toLowerCase() + SPLIT_OUT + 
                    //country
                    localeAdjust.split(SPLIT_IN)[2].toUpperCase();
        }
        default:
            return 'en-US';
    }
};

/**
 * @name appFunction
 * @description Get locales using ISO 639-1 for language code and ISO 3166-1 for country code
 *              Returns records in base64 format to avoid records limit
 *              Data key contains array with:
 *              locale:string
 *              text:string
 *              
 * @function
 * @param {{app_id:number,
 *          data:*,
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{data: string}[]}>}
 */
const appFunction = async parameters =>{
    
    const locales = getData('LOCALE').filter((/**@type {{   locale:string,
                                                            countries:[key:string]}}*/row)=>
                                                                row.locale == formatLocale(parameters.locale))[0].locales
                    ??
                    getData('LOCALE').filter((/**@type {{   locale:string,
                                                            countries:[key:string]}}*/row)=>
                                                                row.locale == 'en')[0].locales
                    ;
    //format result and order by text using base 64 to avoid record limit
    return {result:[{data:Buffer.from (JSON.stringify(Object.entries(locales)
                                                        .map(locale => {
                                                            return { locale:locale[0].replaceAll('_','-').toLowerCase(), text:locale[1]};
                                                        })
                                                        .sort((first, second)=>{
                                                            const first_sort = first.text.toLowerCase();
                                                            const second_sort = second.text.toLowerCase();
                                                            //using localeCompare as collation method
                                                            if (first_sort.localeCompare(second_sort)<0 )
                                                                return -1;
                                                            else if (first_sort.localeCompare(second_sort)>0 )
                                                                return 1;
                                                            else
                                                                return 0;
                                                        }))).toString('base64')}], type:'JSON'};

};
export {formatLocale};
export default appFunction;
/**
 * @module apps/common/src/functions/common_locale
*/

/**
 * Converts locale format
 * @param {string} locale
 * @returns {string}
 */
const formatLocale = locale =>{
    const SPLIT_IN  = '-';
    const SPLIT_OUT = '_';
    switch (locale.split('-').length){
        case 1:{
                    //language
            return  locale.toLowerCase();
        }
        case 2:{
                    //language
            return  locale.split(SPLIT_IN)[0].toLowerCase() + SPLIT_OUT + 
                    //country
                    locale.split(SPLIT_IN)[1].toUpperCase();
        }
        case 3:{
                    //language
            return  locale.split(SPLIT_IN)[0].toLowerCase() + SPLIT_OUT + 
                    //region
                    //first letter uppercase, the rest lowercase
                    locale.split(SPLIT_IN)[1][0].toUpperCase() + locale.split(SPLIT_IN)[1].substring(1).toLowerCase() + SPLIT_OUT + 
                    //country
                    locale.split(SPLIT_IN)[2].toUpperCase();
        }
        default:
            return locale;
    }
};

/**
 * Get locales using ISO 639-1 for language code and ISO 3166-1 for country code
 * 
 * @param {number} app_id
 * @param {*} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<{locale: string, text:string}[]>}
 */
const appFunction = async (app_id, data, user_agent, ip, locale, res) =>{
    res;
    /**
     *  Get locale from locale.json and this structure:
     *  locale-list\data\[language]\language.json
	 *  locale-list\data\[language_Region_COUNTRYCODE]\locale.json
	 *  locale-list\data\[language_COUNTRYCODE]\locale.json
	 *	{"de":"German", [code]:[Text], [code]:[Text], ...}
     */
    /**@ts-ignore */
    const PATH = `${import.meta.dirname.replaceAll('\\', '/')}/locale-list/data/`;
    const FILE = 'locales.json';
    const fs = await import('node:fs');
    /**@type {[key:string]} */
    const locales = await fs.promises.readFile(`${PATH}${formatLocale(locale)}/${FILE}`, 'utf8')
                                 .then(file=>JSON.parse(file.toString()));
    //format result and order by text
    return Object.entries(locales)
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
            });
};
export {formatLocale};
export default appFunction;
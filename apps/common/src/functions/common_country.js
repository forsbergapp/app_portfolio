/**
 * @module apps/common/src/functions/common_country
 */

/**
 * @import types_server from '../../../../server/types.d.ts'
 */
const {server} = await import('../../../../server/server.js');
const {formatLocale} = await import('./common_locale.js');

/**
 * @name appFunction
 * @description Get countries using ISO 3166-1 country code and language code using ISO 639-1
 *              Returns records in base64 format to avoid records limit
 *              Data key contains array with:
 *              value:string,
 *              group_name:string, 
 *              country_code:string, 
 *              flag_emoji:string, 
 *              text:string
 * @function
 * @param {{app_id:number,
 *          data:*,
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<types_server.server['response'] & {result:{data:string}[]}>}
 */
const appFunction = async parameters =>{

    /**
     * @param {number} code
     */
    const countryGroup = code =>{
        switch (code){
            case 1:return 'Africa';
            case 2:return 'Americas';
            case 3:return 'Asia';
            case 4:return 'Europe';
            case 5:return 'Oceania';
            default:return '';
        }
    };
    /**
     * @param {string} code
     * @returns {{code:string, flag_emoji:string, country_group:number}}
     */
    const countryData = code =>{
        return [
                    {code:'af',flag_emoji:'🇦🇫',country_group:3},
                    {code:'ax',flag_emoji:'🇦🇽',country_group:4},
                    {code:'al',flag_emoji:'🇦🇱',country_group:4},
                    {code:'dz',flag_emoji:'🇩🇿',country_group:1},
                    {code:'as',flag_emoji:'🇦🇸',country_group:5},
                    {code:'ad',flag_emoji:'🇦🇩',country_group:4},
                    {code:'ao',flag_emoji:'🇦🇴',country_group:1},
                    {code:'ai',flag_emoji:'🇦🇮',country_group:2},
                    {code:'aq',flag_emoji:'🇦🇶',country_group:5},
                    {code:'ag',flag_emoji:'🇦🇬',country_group:2},
                    {code:'ar',flag_emoji:'🇦🇷',country_group:2},
                    {code:'am',flag_emoji:'🇦🇲',country_group:3},
                    {code:'aw',flag_emoji:'🇦🇼',country_group:2},
                    {code:'au',flag_emoji:'🇦🇺',country_group:5},
                    {code:'at',flag_emoji:'🇦🇹',country_group:4},
                    {code:'az',flag_emoji:'🇦🇿',country_group:3},
                    {code:'bs',flag_emoji:'🇧🇸',country_group:2},
                    {code:'bh',flag_emoji:'🇧🇭',country_group:3},
                    {code:'bd',flag_emoji:'🇧🇩',country_group:3},
                    {code:'bb',flag_emoji:'🇧🇧',country_group:2},
                    {code:'by',flag_emoji:'🇧🇾',country_group:4},
                    {code:'be',flag_emoji:'🇧🇪',country_group:4},
                    {code:'bz',flag_emoji:'🇧🇿',country_group:2},
                    {code:'bj',flag_emoji:'🇧🇯',country_group:1},
                    {code:'bm',flag_emoji:'🇧🇲',country_group:2},
                    {code:'bt',flag_emoji:'🇧🇹',country_group:3},
                    {code:'bo',flag_emoji:'🇧🇴',country_group:2},
                    {code:'ba',flag_emoji:'🇧🇦',country_group:4},
                    {code:'bw',flag_emoji:'🇧🇼',country_group:1},
                    {code:'bv',flag_emoji:'🇧🇻',country_group:5},
                    {code:'br',flag_emoji:'🇧🇷',country_group:2},
                    {code:'io',flag_emoji:'🇮🇴',country_group:5},
                    {code:'vg',flag_emoji:'🇻🇬',country_group:2},
                    {code:'bn',flag_emoji:'🇧🇳',country_group:3},
                    {code:'bg',flag_emoji:'🇧🇬',country_group:4},
                    {code:'bf',flag_emoji:'🇧🇫',country_group:1},
                    {code:'bi',flag_emoji:'🇧🇮',country_group:1},
                    {code:'kh',flag_emoji:'🇰🇭',country_group:3},
                    {code:'cm',flag_emoji:'🇨🇲',country_group:1},
                    {code:'ca',flag_emoji:'🇨🇦',country_group:2},
                    {code:'cv',flag_emoji:'🇨🇻',country_group:1},
                    {code:'bq',flag_emoji:'🇧🇶',country_group:2},
                    {code:'ky',flag_emoji:'🇰🇾',country_group:2},
                    {code:'cf',flag_emoji:'🇨🇫',country_group:1},
                    {code:'td',flag_emoji:'🇹🇩',country_group:1},
                    {code:'cl',flag_emoji:'🇨🇱',country_group:2},
                    {code:'cn',flag_emoji:'🇨🇳',country_group:3},
                    {code:'cx',flag_emoji:'🇨🇽',country_group:5},
                    {code:'cc',flag_emoji:'🇨🇨',country_group:5},
                    {code:'co',flag_emoji:'🇨🇴',country_group:2},
                    {code:'km',flag_emoji:'🇰🇲',country_group:1},
                    {code:'cg',flag_emoji:'🇨🇬',country_group:1},
                    {code:'cd',flag_emoji:'🇨🇩',country_group:1},
                    {code:'ck',flag_emoji:'🇨🇰',country_group:5},
                    {code:'cr',flag_emoji:'🇨🇷',country_group:2},
                    {code:'ci',flag_emoji:'🇨🇮',country_group:1},
                    {code:'hr',flag_emoji:'🇭🇷',country_group:4},
                    {code:'cu',flag_emoji:'🇨🇺',country_group:2},
                    {code:'cw',flag_emoji:'🇨🇼',country_group:2},
                    {code:'cy',flag_emoji:'🇨🇾',country_group:4},
                    {code:'cz',flag_emoji:'🇨🇿',country_group:4},
                    {code:'dk',flag_emoji:'🇩🇰',country_group:4},
                    {code:'dj',flag_emoji:'🇩🇯',country_group:1},
                    {code:'dm',flag_emoji:'🇩🇲',country_group:2},
                    {code:'do',flag_emoji:'🇩🇴',country_group:2},
                    {code:'ec',flag_emoji:'🇪🇨',country_group:2},
                    {code:'eg',flag_emoji:'🇪🇬',country_group:1},
                    {code:'sv',flag_emoji:'🇸🇻',country_group:2},
                    {code:'gq',flag_emoji:'🇬🇶',country_group:1},
                    {code:'er',flag_emoji:'🇪🇷',country_group:1},
                    {code:'ee',flag_emoji:'🇪🇪',country_group:4},
                    {code:'sz',flag_emoji:'🇸🇿',country_group:1},
                    {code:'et',flag_emoji:'🇪🇹',country_group:1},
                    {code:'fk',flag_emoji:'🇫🇰',country_group:2},
                    {code:'fo',flag_emoji:'🇫🇴',country_group:4},
                    {code:'fj',flag_emoji:'🇫🇯',country_group:5},
                    {code:'fi',flag_emoji:'🇫🇮',country_group:4},
                    {code:'fr',flag_emoji:'🇫🇷',country_group:4},
                    {code:'gf',flag_emoji:'🇬🇫',country_group:2},
                    {code:'pf',flag_emoji:'🇵🇫',country_group:5},
                    {code:'tf',flag_emoji:'🇹🇫',country_group:5},
                    {code:'ga',flag_emoji:'🇬🇦',country_group:1},
                    {code:'gm',flag_emoji:'🇬🇲',country_group:1},
                    {code:'ge',flag_emoji:'🇬🇪',country_group:3},
                    {code:'de',flag_emoji:'🇩🇪',country_group:4},
                    {code:'gh',flag_emoji:'🇬🇭',country_group:1},
                    {code:'gi',flag_emoji:'🇬🇮',country_group:4},
                    {code:'gr',flag_emoji:'🇬🇷',country_group:4},
                    {code:'gl',flag_emoji:'🇬🇱',country_group:2},
                    {code:'gd',flag_emoji:'🇬🇩',country_group:2},
                    {code:'gp',flag_emoji:'🇬🇵',country_group:2},
                    {code:'gu',flag_emoji:'🇬🇺',country_group:5},
                    {code:'gt',flag_emoji:'🇬🇹',country_group:2},
                    {code:'gg',flag_emoji:'🇬🇬',country_group:4},
                    {code:'gn',flag_emoji:'🇬🇳',country_group:1},
                    {code:'gw',flag_emoji:'🇬🇼',country_group:1},
                    {code:'gy',flag_emoji:'🇬🇾',country_group:2},
                    {code:'ht',flag_emoji:'🇭🇹',country_group:2},
                    {code:'hm',flag_emoji:'🇭🇲',country_group:5},
                    {code:'hn',flag_emoji:'🇭🇳',country_group:2},
                    {code:'hk',flag_emoji:'🇭🇰',country_group:3},
                    {code:'hu',flag_emoji:'🇭🇺',country_group:4},
                    {code:'is',flag_emoji:'🇮🇸',country_group:4},
                    {code:'in',flag_emoji:'🇮🇳',country_group:3},
                    {code:'id',flag_emoji:'🇮🇩',country_group:3},
                    {code:'ir',flag_emoji:'🇮🇷',country_group:3},
                    {code:'iq',flag_emoji:'🇮🇶',country_group:3},
                    {code:'ie',flag_emoji:'🇮🇪',country_group:4},
                    {code:'im',flag_emoji:'🇮🇲',country_group:4},
                    {code:'il',flag_emoji:'🇮🇱',country_group:3},
                    {code:'it',flag_emoji:'🇮🇹',country_group:4},
                    {code:'jm',flag_emoji:'🇯🇲',country_group:2},
                    {code:'jp',flag_emoji:'🇯🇵',country_group:3},
                    {code:'je',flag_emoji:'🇯🇪',country_group:4},
                    {code:'jo',flag_emoji:'🇯🇴',country_group:3},
                    {code:'kz',flag_emoji:'🇰🇿',country_group:3},
                    {code:'ke',flag_emoji:'🇰🇪',country_group:1},
                    {code:'ki',flag_emoji:'🇰🇮',country_group:5},
                    {code:'kw',flag_emoji:'🇰🇼',country_group:3},
                    {code:'kg',flag_emoji:'🇰🇬',country_group:3},
                    {code:'la',flag_emoji:'🇱🇦',country_group:3},
                    {code:'lv',flag_emoji:'🇱🇻',country_group:4},
                    {code:'lb',flag_emoji:'🇱🇧',country_group:3},
                    {code:'ls',flag_emoji:'🇱🇸',country_group:1},
                    {code:'lr',flag_emoji:'🇱🇷',country_group:1},
                    {code:'ly',flag_emoji:'🇱🇾',country_group:1},
                    {code:'li',flag_emoji:'🇱🇮',country_group:4},
                    {code:'lt',flag_emoji:'🇱🇹',country_group:4},
                    {code:'lu',flag_emoji:'🇱🇺',country_group:4},
                    {code:'mo',flag_emoji:'🇲🇴',country_group:3},
                    {code:'mg',flag_emoji:'🇲🇬',country_group:1},
                    {code:'mw',flag_emoji:'🇲🇼',country_group:1},
                    {code:'my',flag_emoji:'🇲🇾',country_group:3},
                    {code:'mv',flag_emoji:'🇲🇻',country_group:3},
                    {code:'ml',flag_emoji:'🇲🇱',country_group:1},
                    {code:'mt',flag_emoji:'🇲🇹',country_group:4},
                    {code:'mh',flag_emoji:'🇲🇭',country_group:5},
                    {code:'mq',flag_emoji:'🇲🇶',country_group:2},
                    {code:'mr',flag_emoji:'🇲🇷',country_group:1},
                    {code:'mu',flag_emoji:'🇲🇺',country_group:1},
                    {code:'yt',flag_emoji:'🇾🇹',country_group:1},
                    {code:'mx',flag_emoji:'🇲🇽',country_group:2},
                    {code:'fm',flag_emoji:'🇫🇲',country_group:5},
                    {code:'md',flag_emoji:'🇲🇩',country_group:4},
                    {code:'mc',flag_emoji:'🇲🇨',country_group:4},
                    {code:'mn',flag_emoji:'🇲🇳',country_group:3},
                    {code:'me',flag_emoji:'🇲🇪',country_group:4},
                    {code:'ms',flag_emoji:'🇲🇸',country_group:2},
                    {code:'ma',flag_emoji:'🇲🇦',country_group:1},
                    {code:'mz',flag_emoji:'🇲🇿',country_group:1},
                    {code:'mm',flag_emoji:'🇲🇲',country_group:3},
                    {code:'na',flag_emoji:'🇳🇦',country_group:1},
                    {code:'nr',flag_emoji:'🇳🇷',country_group:5},
                    {code:'np',flag_emoji:'🇳🇵',country_group:3},
                    {code:'nl',flag_emoji:'🇳🇱',country_group:4},
                    {code:'nc',flag_emoji:'🇳🇨',country_group:5},
                    {code:'nz',flag_emoji:'🇳🇿',country_group:5},
                    {code:'ni',flag_emoji:'🇳🇮',country_group:2},
                    {code:'ne',flag_emoji:'🇳🇪',country_group:1},
                    {code:'ng',flag_emoji:'🇳🇬',country_group:1},
                    {code:'nu',flag_emoji:'🇳🇺',country_group:5},
                    {code:'nf',flag_emoji:'🇳🇫',country_group:5},
                    {code:'kp',flag_emoji:'🇰🇵',country_group:3},
                    {code:'mk',flag_emoji:'🇲🇰',country_group:4},
                    {code:'mp',flag_emoji:'🇲🇵',country_group:5},
                    {code:'no',flag_emoji:'🇳🇴',country_group:4},
                    {code:'om',flag_emoji:'🇴🇲',country_group:3},
                    {code:'pk',flag_emoji:'🇵🇰',country_group:3},
                    {code:'pw',flag_emoji:'🇵🇼',country_group:5},
                    {code:'ps',flag_emoji:'🇵🇸',country_group:3},
                    {code:'pa',flag_emoji:'🇵🇦',country_group:2},
                    {code:'pg',flag_emoji:'🇵🇬',country_group:5},
                    {code:'py',flag_emoji:'🇵🇾',country_group:2},
                    {code:'pe',flag_emoji:'🇵🇪',country_group:2},
                    {code:'ph',flag_emoji:'🇵🇭',country_group:3},
                    {code:'pn',flag_emoji:'🇵🇳',country_group:5},
                    {code:'pl',flag_emoji:'🇵🇱',country_group:4},
                    {code:'pt',flag_emoji:'🇵🇹',country_group:4},
                    {code:'pr',flag_emoji:'🇵🇷',country_group:2},
                    {code:'qa',flag_emoji:'🇶🇦',country_group:3},
                    {code:'re',flag_emoji:'🇷🇪',country_group:1},
                    {code:'ro',flag_emoji:'🇷🇴',country_group:4},
                    {code:'ru',flag_emoji:'🇷🇺',country_group:4},
                    {code:'rw',flag_emoji:'🇷🇼',country_group:1},
                    {code:'ws',flag_emoji:'🇼🇸',country_group:5},
                    {code:'sm',flag_emoji:'🇸🇲',country_group:4},
                    {code:'st',flag_emoji:'🇸🇹',country_group:1},
                    {code:'sa',flag_emoji:'🇸🇦',country_group:3},
                    {code:'sn',flag_emoji:'🇸🇳',country_group:1},
                    {code:'rs',flag_emoji:'🇷🇸',country_group:4},
                    {code:'sc',flag_emoji:'🇸🇨',country_group:1},
                    {code:'sl',flag_emoji:'🇸🇱',country_group:1},
                    {code:'sg',flag_emoji:'🇸🇬',country_group:3},
                    {code:'sx',flag_emoji:'🇸🇽',country_group:2},
                    {code:'sk',flag_emoji:'🇸🇰',country_group:4},
                    {code:'si',flag_emoji:'🇸🇮',country_group:4},
                    {code:'sb',flag_emoji:'🇸🇧',country_group:5},
                    {code:'so',flag_emoji:'🇸🇴',country_group:1},
                    {code:'za',flag_emoji:'🇿🇦',country_group:1},
                    {code:'gs',flag_emoji:'🇬🇸',country_group:5},
                    {code:'kr',flag_emoji:'🇰🇷',country_group:3},
                    {code:'ss',flag_emoji:'🇸🇸',country_group:1},
                    {code:'es',flag_emoji:'🇪🇸',country_group:4},
                    {code:'lk',flag_emoji:'🇱🇰',country_group:3},
                    {code:'bl',flag_emoji:'🇧🇱',country_group:2},
                    {code:'sh',flag_emoji:'🇸🇭',country_group:1},
                    {code:'kn',flag_emoji:'🇰🇳',country_group:2},
                    {code:'lc',flag_emoji:'🇱🇨',country_group:2},
                    {code:'mf',flag_emoji:'🇲🇫',country_group:2},
                    {code:'pm',flag_emoji:'🇵🇲',country_group:2},
                    {code:'vc',flag_emoji:'🇻🇨',country_group:2},
                    {code:'sd',flag_emoji:'🇸🇩',country_group:1},
                    {code:'sr',flag_emoji:'🇸🇷',country_group:2},
                    {code:'sj',flag_emoji:'🇸🇯',country_group:4},
                    {code:'se',flag_emoji:'🇸🇪',country_group:4},
                    {code:'ch',flag_emoji:'🇨🇭',country_group:4},
                    {code:'sy',flag_emoji:'🇸🇾',country_group:3},
                    {code:'tw',flag_emoji:'🇹🇼',country_group:3},
                    {code:'tj',flag_emoji:'🇹🇯',country_group:3},
                    {code:'tz',flag_emoji:'🇹🇿',country_group:1},
                    {code:'th',flag_emoji:'🇹🇭',country_group:3},
                    {code:'tl',flag_emoji:'🇹🇱',country_group:3},
                    {code:'tg',flag_emoji:'🇹🇬',country_group:1},
                    {code:'tk',flag_emoji:'🇹🇰',country_group:5},
                    {code:'to',flag_emoji:'🇹🇴',country_group:5},
                    {code:'tt',flag_emoji:'🇹🇹',country_group:2},
                    {code:'tn',flag_emoji:'🇹🇳',country_group:1},
                    {code:'tr',flag_emoji:'🇹🇷',country_group:3},
                    {code:'tm',flag_emoji:'🇹🇲',country_group:3},
                    {code:'tc',flag_emoji:'🇹🇨',country_group:2},
                    {code:'tv',flag_emoji:'🇹🇻',country_group:5},
                    {code:'um',flag_emoji:'🇺🇲',country_group:5},
                    {code:'vi',flag_emoji:'🇻🇮',country_group:2},
                    {code:'ug',flag_emoji:'🇺🇬',country_group:1},
                    {code:'ua',flag_emoji:'🇺🇦',country_group:4},
                    {code:'ae',flag_emoji:'🇦🇪',country_group:3},
                    {code:'gb',flag_emoji:'🇬🇧',country_group:4},
                    {code:'us',flag_emoji:'🇺🇸',country_group:2},
                    {code:'uy',flag_emoji:'🇺🇾',country_group:2},
                    {code:'uz',flag_emoji:'🇺🇿',country_group:3},
                    {code:'vu',flag_emoji:'🇻🇺',country_group:5},
                    {code:'va',flag_emoji:'🇻🇦',country_group:4},
                    {code:'ve',flag_emoji:'🇻🇪',country_group:2},
                    {code:'vn',flag_emoji:'🇻🇳',country_group:3},
                    {code:'wf',flag_emoji:'🇼🇫',country_group:5},
                    {code:'eh',flag_emoji:'🇪🇭',country_group:1},
                    {code:'ye',flag_emoji:'🇾🇪',country_group:3},
                    {code:'zm',flag_emoji:'🇿🇲',country_group:1},
                    {code:'zw',flag_emoji:'🇿🇼',country_group:1},
                    {code:'xk',flag_emoji:'🇽🇰',country_group:4}
        ].filter(country=>country.code == code)[0];
    };
    
    /**
     *  Get country from country.json and this structure:
     *  country-list\data\[language]\country.json
	 *  country-list\data\[language_Region_COUNTRYCODE]\country.json
	 *  country-list\data\[language_COUNTRYCODE]\country.json
	 *	{"DE":"Germany", [CODE]:[Text], [CODE]:[Text], ...}
     */
    
    /**@type {[key:string]} */
    const countries =   server.ORM.getExternal('COUNTRY', formatLocale(parameters.accept_language))[0].countries
                        ??
                        server.ORM.getExternal('COUNTRY', 'en')[0].countries;
    //format result and order by group name, country code
    const countries_map = Object.entries(countries)
                                 .map(country => {
                                    const data = {  value:country[0].toLowerCase(), 
                                                    country_code:country[0].toLowerCase(), 
                                                    flag_emoji:countryData(country[0].toLowerCase()).flag_emoji, 
                                                    group_name:countryGroup(countryData(country[0].toLowerCase()).country_group),
                                                    text: ''
                                                };
                                    data.text = `${data.group_name} - ${data.flag_emoji} ${country[1]}`;
                                    return data;
                                 })
                                 .sort((first, second)=>{
                                    const first_sort = first.group_name.toLowerCase() +  first.country_code.toLowerCase();
                                    const second_sort = second.group_name.toLowerCase() +  second.country_code.toLowerCase();
                                    //using localeCompare as collation method
                                    if (first_sort.localeCompare(second_sort)<0 )
                                        return -1;
                                    else if (first_sort.localeCompare(second_sort)>0 )
                                        return 1;
                                    else
                                        return 0;
                                });
    
    return {result:[{data:Buffer.from (JSON.stringify(countries_map)).toString('base64')}], type:'JSON'};
};
export default appFunction;
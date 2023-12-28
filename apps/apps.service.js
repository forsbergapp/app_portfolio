/** @module apps */
// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';


const {CheckFirstTime, ConfigGet, ConfigGetAppHost, ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);
const {file_get_cached} = await import(`file://${process.cwd()}/server/db/file.service.js`);
const { LogAppI, LogAppE } = await import(`file://${process.cwd()}/server/log.service.js`);
const fs = await import('node:fs');

const {COMMON, getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * Checks if ok to start app
 * @param {number|null} app_id
 * @returns {boolean}
 */
 const app_start = (app_id=null)=>{
    if (getNumberValue(file_get_cached('CONFIG').MAINTENANCE)==0 && ConfigGet('SERVICE_DB', 'START')=='1' && ConfigGet('SERVER', 'APP_START')=='1' &&
        ConfigGet('SERVICE_DB', `DB${ConfigGet('SERVICE_DB', 'USE')}_APP_ADMIN_USER`))
        if (app_id == null)
            return true;
        else{
            if (ConfigGetApp(app_id, 'STATUS')=='ONLINE')
                return true;
            else
                return false;
        }
    else
        return false;
};
/**
 * Get client locale from accept language from request
 * 
 * @param {string} accept_language  - Accept language from request
 * @returns {string}                - lowercase locale, can be default 'en' or with syntax 'en-us' or 'zh-hant-cn'
 */
const client_locale = (accept_language) =>{
    let locale;
    if (accept_language.startsWith('text') || accept_language=='*')
        locale = 'en';
    else{
        //check first lang ex syntax 'en-US,en;'
        locale = accept_language.split(',')[0].toLowerCase();
        if (locale.length==0){
            //check first lang ex syntax 'en;'
            locale = accept_language.split(';')[0].toLowerCase();
            if (locale.length==0 && accept_language.length>0)
                //check first lang ex syntax 'en' or 'zh-cn'
                locale = accept_language.toLowerCase();
            else{
                locale = 'en';
            }
        }
    }
    return locale;
};
/**
 * @param {number} app_id
 * @param { 'APP'|'APP_COMMON'|
 *          'REPORT'|'REPORT_COMMON'|
 *          'MAINTENANCE'|'MAIL'} type
 * @param {string|null} component
 */ 
const render_files = (app_id, type, component=null) => {
    /**@type{Types.config_apps_render_files[]} */
    const files = ConfigGetApp(app_id, 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]==type && (filetype[1] == component || component == null));
    let app ='';
    files.forEach(file => {
        if (app=='')
            app = file[4] ?? '';
        else
            app = app.replace(`<${file[2]}/>`, file[4] ?? '');
    });
    return app;
};

/**
 * Render html for APP or REPORT
 * 
 * @param {number} app_id
 * @param {'APP'} type
 * @param {string|null} locale
 * @param {Types.callBack} callBack
 * 
 */
 const render_app_html = (app_id, type, locale, callBack) => {
        render_common_html(app_id, render_files(app_id, type), locale ?? '').then((app_with_common)=>{
            callBack(null, app_with_common);
        });
};
/**
 * Render html for REPORT
 * 
 * @param {number} app_id
 * @param {string} reportname
 */
const render_report_html = (app_id, reportname) => {
    const report = render_files(app_id, 'REPORT', reportname);
    //list config files and return only tag and file content
    /**@type {[string,string][]} */
    const common_files = ConfigGetApp(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]=='REPORT_COMMON').map((/**@type{Types.config_apps_render_files}*/row)=> {return [row[2],row[4]];});
    const report_with_common = render_app_with_data(report, common_files);
    /** @type {[string, string][]} */
    const render_variables = [];
    if (ConfigGetApp(app_id, 'CSS_REPORT') != '')
        render_variables.push(['APP_CSS_REPORT',`<link rel='stylesheet' type='text/css' href='${ConfigGetApp(app_id, 'CSS_REPORT')}'/>`]);
    else
        render_variables.push(['APP_CSS_REPORT','']);
    return render_app_with_data(report_with_common, render_variables);
};

/**
 * Renders app html with data
 * 
 * @param {string} app              - html
 * @param {[string, string][]} data - array with tags and data
 * @returns {string}                - app html with data
 */
const render_app_with_data = (app, data)=>{
    for (const variable of data){
        //add < and /> around tag variablename
        //replace all tags found with given searched tag with given value
        //ES2021 replaceAll
        app = app.replaceAll(`<${variable[0]}/>`,variable[1]);
    }
    return app;
};
/**
 * Render html for APP or REPORT
 * 
 * @async
 * @param {number} app_id                   - application_id
 * @param {string} module                   - html
 * @param {string} locale                   - locale
 * @returns {Promise<Types.render_common>}  - app HTML with rendered data
 */
const render_common_html = async (app_id, module, locale) =>{
    /**@type{Types.config_apps_config} */
    const app_config = ConfigGetApp(app_id, 'CONFIG');

    /** @type {string}*/
    let user_locales='';
    /** @type {Types.render_common_settings}*/
    let settings;
    let user_timezones = '';
    let user_directions = '';
    let user_arabic_scripts = '';
    /** @type {Types.map_styles[]} */
    const map_styles = [];
    /** @type {[string, string][]} */
    const render_variables = [];

    if ((app_id== getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')) && app_start()==false)){
            //if admin app and system admin only
            app_config.RENDER_LOCALES = false;
            app_config.RENDER_SETTINGS = false;
            app_config.RENDER_PROVIDER_BUTTONS = false;
    }

    if (app_config.RENDER_LOCALES){
        const {getLocales}  = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/locale.service.js`);            
        await getLocales(app_id, locale)
        .then((/**@type{Types.db_result_locale_getLocales[]} */result_user_locales)=> {
            result_user_locales.forEach((locale, i) => {
                user_locales += `<option id=${i} value=${locale.locale}>${locale.text}</option>`;
            });
            render_variables.push(['COMMON_USER_LOCALE',user_locales]);
        })
        .catch((/**@type{Types.error}*/error)=>{
            throw error;
        });
    }
    else
        render_variables.push(['COMMON_USER_LOCALE','']);

    if (app_config.RENDER_SETTINGS){
        const {getSettings} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_setting.service.js`);
        /** @type {Types.db_result_app_setting_getSettings[]}*/
        const app_settings_db = await getSettings(app_id, locale, null);
        let option;
        for (const app_setting of app_settings_db) {
            option = `<option id=${app_setting.id} value='${app_setting.value}'>${app_setting.text}</option>`;
            switch (app_setting.app_setting_type_name){
                //static content
                case 'TIMEZONE':{
                    user_timezones += option;
                    break;
                }
                //will be translated in app
                case 'DIRECTION':{
                    user_directions += option;
                    break;
                }
                //static content
                case 'ARABIC_SCRIPT':{
                    user_arabic_scripts += option;
                    break;
                }
                //map styles
                case 'MAP_STYLE':{
                    map_styles.push({  id:app_setting.id, 
                                        description:app_setting.text, 
                                        data:app_setting.value, 
                                        data2:app_setting.data2, 
                                        data3:app_setting.data3, 
                                        data4:app_setting.data4, 
                                        session_map_layer:null});
                    break;
                }
            }
        }
        settings = {settings: app_settings_db, 
                    user_timezones: user_timezones, 
                    user_directions: user_directions, 
                    user_arabic_scripts: user_arabic_scripts,
                    map_styles: app_config.MAP==true?map_styles:null};

        render_variables.push(['COMMON_USER_TIMEZONE',user_timezones]);
        render_variables.push(['COMMON_USER_DIRECTION',`<option id='' value=''></option>${user_directions}`]);
        render_variables.push(['COMMON_USER_ARABIC_SCRIPT',`<option id='' value=''></option>${user_arabic_scripts}`]);
    }
    else{
        render_variables.push(['COMMON_USER_TIMEZONE','']);
        render_variables.push(['COMMON_USER_DIRECTION','']);
        render_variables.push(['COMMON_USER_ARABIC_SCRIPT','']);
    }
    if (app_config.RENDER_PROVIDER_BUTTONS){
        await providers_buttons(app_id).then((buttons)=>{
            render_variables.push(['COMMON_PROVIDER_BUTTONS',buttons]);
        });
    }
    else
        render_variables.push(['COMMON_PROVIDER_BUTTONS','']);
    
    return new Promise((resolve)=>{
        //list config files and return only tag and file content
        /**@type {[string, string][]} */
        const common_files = ConfigGetApp(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]=='APP_COMMON').map((/**@type{Types.config_apps_render_files}*/row)=> {return [row[2],row[4]];} );

        if (app_config.RENDER_PROFILE_SEARCH==true){
            const common_file = ConfigGetApp(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]=='APP_COMMON_OPTIONAL' && filetype[2]=='CommonBodyProfileSearch')[0][4];
            if (app_config.CUSTOM_TAG_PROFILE_SEARCH){
                common_files.push([app_config.CUSTOM_TAG_PROFILE_SEARCH, common_file]);
                common_files.push(['CommonBodyProfileSearch', '']);
            }
            else
                common_files.push(['CommonBodyProfileSearch', common_file]);
        }
        else
            common_files.push(['CommonBodyUserAccount', '']);
        if (app_config.RENDER_USER_ACCOUNT==true){
            const common_file = ConfigGetApp(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]=='APP_COMMON_OPTIONAL' && filetype[2]=='CommonBodyUserAccount')[0][4];
            if (app_config.CUSTOM_TAG_USER_ACCOUNT){
                common_files.push([app_config.CUSTOM_TAG_USER_ACCOUNT, common_file]);
                common_files.push(['CommonBodyUserAccount', '']);
            }
            else
                common_files.push(['CommonBodyUserAccount', common_file]);
        }
        else
            common_files.push(['CommonBodyUserAccount', '']);
        if (app_config.RENDER_PROFILE_TOP==true){
            const common_file = ConfigGetApp(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]=='APP_COMMON_OPTIONAL' && filetype[2]=='CommonBodyProfileBtnTop')[0][4];
            if (app_config.CUSTOM_TAG_PROFILE_TOP){
                common_files.push([app_config.CUSTOM_TAG_PROFILE_TOP, common_file]);
                common_files.push(['CommonBodyProfileBtnTop', '']);
            }
            else
                common_files.push(['CommonBodyProfileBtnTop', common_file]);
        }
        else
            common_files.push(['CommonBodyProfileBtnTop', '']);
        
        if (app_config.MAP==true){
            const common_file = ConfigGetApp(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]=='APP_COMMON_OPTIONAL' && filetype[2]=='CommonHeadMap')[0][4];
            common_files.push(['CommonHeadMap', common_file]);
        }
        else
            common_files.push(['CommonHeadMap', '']);

        if (app_config.RENDER_APP_THEMES==true){
            //themes always in same place but choose what content to display
            if (ConfigGetApp(app_id, 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]=='APP_OPTIONAL' && filetype[2]=='CommonBodyThemes')[0])
                common_files.push(['CommonBodyThemes', ConfigGetApp(app_id, 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]=='APP_OPTIONAL' && filetype[2]=='CommonBodyThemes')[0][4]]);
            else{
                const common_file = ConfigGetApp(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]=='APP_COMMON_OPTIONAL' && filetype[2]=='CommonBodyThemes')[0][4];
                common_files.push(['CommonBodyThemes', common_file]);
            }
        }
        else
            common_files.push(['CommonBodyThemes', '']);

                //app optional content
                if (ConfigGetApp(app_id, 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]=='APP_OPTIONAL' && filetype[2]=='AppProfileInfo')[0])
                common_files.push(['AppProfileInfo', ConfigGetApp(app_id, 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]=='APP_OPTIONAL' && filetype[2]=='AppProfileInfo')[0][4]]);
            else
                common_files.push(['AppProfileInfo', '']);
    
        if (app_config.RENDER_PROFILE_APPS==true){
            const common_file = ConfigGetApp(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]=='APP_COMMON_OPTIONAL' && filetype[2]=='CommonBodyProfileInfoApps')[0][4];
            if (app_config.CUSTOM_TAG_PROFILE_APPS){
                common_files.push([app_config.CUSTOM_TAG_PROFILE_APPS, common_file]);
                common_files.push(['CommonBodyProfileInfoApps', '']);
            }
            else
                common_files.push(['CommonBodyProfileInfoApps', common_file]);
        }
        else
            common_files.push(['CommonBodyProfileInfoApps', '']);
    
        if (ConfigGetApp(app_id, 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]=='APP_OPTIONAL' && filetype[2]=='AppProfileTop')[0])
            common_files.push(['AppProfileTop', ConfigGetApp(app_id, 'RENDER_FILES').filter((/**@type{Types.config_apps_render_files}*/filetype)=>filetype[0]=='APP_OPTIONAL' && filetype[2]=='AppProfileTop')[0][4]]);
        else
            common_files.push(['AppProfileTop', '']);
        
        const app = render_app_with_data(module, common_files);
        
        //render app parameters from apps.json
        if (ConfigGetApp(app_id, 'JS') != '')
            render_variables.push(['APP_JS',`"app" 			: "${ConfigGetApp(app_id, 'JS')}",`]);
        else
            render_variables.push(['APP_JS','']);
        if (ConfigGetApp(app_id, 'JS_SECURE') != '')
            render_variables.push(['APP_JS_SECURE',`"app_secure" 			: "${ConfigGetApp(app_id, 'JS_SECURE')}",`]);
        else
            render_variables.push(['APP_JS_SECURE','']);
        if (ConfigGetApp(app_id, 'JS_REPORT') != '')
            render_variables.push(['APP_JS_REPORT',`"app_report" 			: "${ConfigGetApp(app_id, 'JS_REPORT')}",`]);
        else
            render_variables.push(['APP_JS_REPORT','']);
        if (ConfigGetApp(app_id, 'CSS') != '')
            render_variables.push(['APP_CSS',`<link rel='stylesheet' type='text/css' href='${ConfigGetApp(app_id, 'CSS')}'/>`]);
        else
            render_variables.push(['APP_CSS','']);
        if (ConfigGetApp(app_id, 'CSS_REPORT') != '')
            render_variables.push(['APP_CSS_REPORT',`<link rel='stylesheet' type='text/css' href='${ConfigGetApp(app_id, 'CSS_REPORT')}'/>`]);
        else
            render_variables.push(['APP_CSS_REPORT','']);
        if (app_config.MANIFEST == true)
            render_variables.push(['APP_MANIFEST','<link rel=\'manifest\' href=\'/manifest.json\'/>']);
        else
            render_variables.push(['APP_MANIFEST','']);
        if (ConfigGetApp(app_id, 'FAVICON_32x32') != '')
            render_variables.push(['APP_FAVICON_32x32',`<link rel='icon' type='image/png' href='${ConfigGetApp(app_id, 'FAVICON_32x32')}' sizes='32x32'/>`]);
        else
            render_variables.push(['APP_FAVICON_32x32','']);
        if (ConfigGetApp(app_id, 'FAVICON_1922x192') != '')
            render_variables.push(['APP_FAVICON_192x192',`<link rel='icon' type='image/png' href='${ConfigGetApp(app_id, 'FAVICON_192x192')}' sizes='192x192'/>`]);
        else
            render_variables.push(['APP_FAVICON_192x192','']);

        resolve({   app:render_app_with_data(app, render_variables),
                    locales: user_locales, 
                    settings: settings});
    });
};
/**
 * Returns countries in HTML option format for select item in client html
 * 
 * @param {number} app_id       - application id
 * @param {string} locale       - locale
 * @returns {Promise<string>}   - HTML in option format
 */
const countries = (app_id, locale) => {
    return new Promise((resolve, reject) => {
        import(`file://${process.cwd()}/server/dbapi/app_portfolio/country.service.js`).then(({getCountries})=>{
            getCountries(app_id, locale)
            .then((/** @type {Types.db_result_country_getCountries[]}*/ result)=>{
                /** @type {string}*/
                let select_countries;
                /** @type {string}*/
                let current_group_name;
                select_countries  =`<option value='' id='' label='…' selected='selected'>…
                                    </option>`;
        
                result.map( (/** @type Types.db_result_country_getCountries}*/ countries_map, /** @type {number}*/ i) => {
                    if (i === 0){
                    select_countries += `<optgroup label=${countries_map.group_name} />`;
                    current_group_name = countries_map.group_name;
                    }
                    else{
                    if (countries_map.group_name !== current_group_name){
                        select_countries += `<optgroup label=${countries_map.group_name} />`;
                        current_group_name = countries_map.group_name;
                    }
                    select_countries +=
                    `<option value=${i}
                            id=${countries_map.id} 
                            country_code=${countries_map.country_code} 
                            flag_emoji=${countries_map.flag_emoji} 
                            group_name=${countries_map.group_name}>${countries_map.flag_emoji} ${countries_map.text}
                    </option>`;
                    }
                });
                resolve (select_countries);
            })
            .catch((/**@type{Types.error}*/error)=> {
                //ignore error here
                reject (error);
            });
        });
    });
};
/**
 * Gets module with application name, app service parameters with optional countries
 * 
 * @async
 * @param {Types.app_info} app_info - app info configuration
 * @returns {Promise.<string>}
 */
const get_module_with_initBFF = async (app_info) => {
    /**@type {[string, string][]} */
    const render_variables = [];
    /**
     * 
     * @param {string} module 
     * @param {string|null} countries 
     * @param {Types.db_result_app_parameter_getAppStartParameters[]|null} app_parameters 
     * @param {number} first_time 
     * @returns {string}
     */
    const return_with_parameters = (module, countries, app_parameters, first_time)=>{
        /**@type{Types.app_service_parameters} */
        const app_service_parameters = {   
            app_id: app_info.app_id,
            app_logo:ConfigGetApp(app_info.app_id, 'LOGO'),
            app_datatoken: app_info.datatoken,
            countries:countries,
            map_styles: app_info.map_styles,
            locale: app_info.locale,
            ui: app_info.ui,
            system_admin_only: app_info.system_admin_only,
            client_latitude: app_info.latitude,
            client_longitude: app_info.longitude,
            client_place: app_info.place,
            client_timezone: app_info.timezone,
            app_sound: getNumberValue(ConfigGet('SERVER', 'APP_SOUND')),
            common_app_id: getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
            rest_resource_bff: ConfigGet('SERVER', 'REST_RESOURCE_BFF'),
            first_time: first_time
        };
        render_variables.push(['ITEM_COMMON_PARAMETERS',JSON.stringify({
                                                            app_service: app_service_parameters,
                                                            app: app_parameters
                                                        })]);
        return render_app_with_data(module, render_variables);
    };
    
    if (app_info.system_admin_only==1){
        render_variables.push(['APP_NAME','SYSTEM ADMIN']);
        return return_with_parameters(app_info.module, null, null, CheckFirstTime()==true?1:0);
    }
    else{
        const { getAppStartParameters } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter.service.js`);
        
        //fetch parameters for common_app_id and current app_id
        /** @type {Types.db_result_app_parameter_getAppStartParameters[]}*/
        const app_parameters = await getAppStartParameters(app_info.app_id)
        .catch((/**@type{Types.error}*/error)=>{
            throw error;
        });
        render_variables.push(['APP_NAME',ConfigGetApp(app_info.app_id, 'NAME')]);
        if (app_info.map == true){
            //fetch countries and return map styles
            return return_with_parameters(app_info.module, await countries(app_info.app_id, app_info.locale), app_parameters, 0);
        }
        else{
            //no countries or map styles
            return return_with_parameters(app_info.module, null, app_parameters, 0);
        }
    }        
};

/**
 * Creates email
 * @async
 * @param {number} app_id                       - Application id
 * @param {Types.email_param_data} data         - Email param data
 * @returns {Promise<Types.email_return_data>}  - Email return data
 */
const createMail = async (app_id, data) =>{
    const {getParameters_server} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter.service.js`);
    return new Promise((resolve, reject) => {
        /** @type {string} */
        let db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
        /** @type {string} */
        let db_SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME;
        /** @type {string} */
        let db_SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME;
        /** @type {string} */
        let db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME;
        /** @type {string} */
        let db_SERVICE_MAIL_HOST;
        /** @type {string} */
        let db_SERVICE_MAIL_PORT;
        /** @type {string} */
        let db_SERVICE_MAIL_SECURE;
        /** @type {string} */
        let db_SERVICE_MAIL_USERNAME;
        /** @type {string} */
        let db_SERVICE_MAIL_PASSWORD;
        //email type 1-4 implemented are emails with verification code
        if (parseInt(data.emailtype)==1 || 
            parseInt(data.emailtype)==2 || 
            parseInt(data.emailtype)==3 ||
            parseInt(data.emailtype)==4){

            getParameters_server(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')))
            .then((/** @type {Types.db_result_app_parameter_getParameters_server[]}*/ result_parameters)=>{
                for (const parameter of result_parameters){
                    if (parameter.parameter_name=='SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME')
                        db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME = parameter.parameter_value;
                    if (parameter.parameter_name=='SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME')
                        db_SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME = parameter.parameter_value;
                    if (parameter.parameter_name=='SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME')
                        db_SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME = parameter.parameter_value;
                    if (parameter.parameter_name=='SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME')
                        db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME = parameter.parameter_value;

                    if (parameter.parameter_name=='SERVICE_MAIL_HOST')
                        db_SERVICE_MAIL_HOST = parameter.parameter_value;
                    if (parameter.parameter_name=='SERVICE_MAIL_PORT')
                        db_SERVICE_MAIL_PORT = parameter.parameter_value;
                    if (parameter.parameter_name=='SERVICE_MAIL_SECURE')
                        db_SERVICE_MAIL_SECURE = parameter.parameter_value;
                    if (parameter.parameter_name=='SERVICE_MAIL_USERNAME')
                        db_SERVICE_MAIL_USERNAME = parameter.parameter_value;
                    if (parameter.parameter_name=='SERVICE_MAIL_PASSWORD')
                        db_SERVICE_MAIL_PASSWORD = parameter.parameter_value;                                        
                }
                /** @type {string} */
                let email_from = '';
                switch (parseInt(data.emailtype)){
                    case 1:{
                        email_from = db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
                        break;
                    }
                    case 2:{
                        email_from = db_SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME;
                        break;
                    }
                    case 3:{
                        email_from = db_SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME;
                        break;
                    }
                    case 4:{
                        email_from = db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME;
                        break;
                    }
                }
                /** @type {[string, string][]} */
                const render_variables = [];
                render_variables.push(['Logo','<img id=\'app_logo\' src=\'/apps/common/images/logo.png\'>']);
                render_variables.push(['Verification_code',data.verificationCode]);
                render_variables.push(['Footer',`<a target='_blank' href='https://${data.host}'>${data.host}</a>`]);

                resolve ({
                    'email_host':         db_SERVICE_MAIL_HOST,
                    'email_port':         db_SERVICE_MAIL_PORT,
                    'email_secure':       db_SERVICE_MAIL_SECURE,
                    'email_auth_user':    db_SERVICE_MAIL_USERNAME,
                    'email_auth_pass':    db_SERVICE_MAIL_PASSWORD,
                    'from':               email_from,
                    'to':                 data.to,
                    'subject':            '❂❂❂❂❂❂',
                    'html':               render_app_with_data( render_files(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'MAIL'), render_variables)
                });
            })
            .catch((/**@type{Types.error}*/err)=>{
                reject(err);
            });
        }
        else
            reject ('not implemented');
    });
};

/**
 * Gets info page with rendered data
 * @async
 * @param {number} app_id       - Application id
 * @param {string} info         - 'privacy_policy', 'disclaimer', 'terms', 'about'
 * @param {string} lang_code    - Locale
 * @param {Types.callBack} callBack   - CallBack with error and success info or null in both info parameter is unknown
 */
const getInfo = async (app_id, info, lang_code, callBack) => {
    const {getParameters_server} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter.service.js`);
    /**
     * @param {number} app_id
     * @param {Types.callBack} callBack
     */
    const get_parameters = (app_id, callBack) => {
        getApps(app_id, app_id, lang_code)
        .then((/** @type{Types.config_apps_with_db_columns[]}*/result_app)=> {
            getParameters_server(app_id, app_id)
            .then((/** @type {Types.db_result_app_parameter_getParameters_server[]}*/ result_parameters)=>{
                //app_parameter table
                let db_info_email_policy;
                let db_info_email_disclaimer;
                let db_info_email_terms;
                let db_info_link_policy_url;
                let db_info_link_disclaimer_url;
                let db_info_link_terms_url;
                let db_info_link_about_url;
                for (const parameter of result_parameters){
                    if (parameter.parameter_name=='INFO_EMAIL_POLICY')
                        db_info_email_policy = parameter.parameter_value;
                    if (parameter.parameter_name=='INFO_EMAIL_DISCLAIMER')
                        db_info_email_disclaimer = parameter.parameter_value;
                    if (parameter.parameter_name=='INFO_EMAIL_TERMS')
                        db_info_email_terms = parameter.parameter_value;
                    if (parameter.parameter_name=='INFO_LINK_POLICY_URL')
                        db_info_link_policy_url = parameter.parameter_value;
                    if (parameter.parameter_name=='INFO_LINK_DISCLAIMER_URL')
                        db_info_link_disclaimer_url = parameter.parameter_value;
                    if (parameter.parameter_name=='INFO_LINK_TERMS_URL')
                        db_info_link_terms_url = parameter.parameter_value;
                    if (parameter.parameter_name=='INFO_LINK_ABOUT_URL')
                        db_info_link_about_url = parameter.parameter_value;
                }
                callBack(null, {app_name: result_app[0].NAME,
                                app_url:    result_app[0].PROTOCOL +
                                            result_app[0].SUBDOMAIN + '.' + result_app[0].HOST + ':' + result_app[0].PORT,
                                info_email_policy: db_info_email_policy,
                                info_email_disclaimer: db_info_email_disclaimer,
                                info_email_terms: db_info_email_terms,
                                info_link_policy_url: db_info_link_policy_url,
                                info_link_disclaimer_url: db_info_link_disclaimer_url,
                                info_link_terms_url: db_info_link_terms_url,
                                info_link_about_url: db_info_link_about_url
                                });
            })
            .catch((/**@type{Types.error}*/err)=> {
                callBack(err, null);
            });
        })
        .catch((/**@type{Types.error}*/error)=> {
            callBack(error, null); 
        });
    };
    const info_html1 = `<!DOCTYPE html>
                      <html>
                        <head>
                            <meta charset='UTF-8'>
                            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet">
                            <link rel='stylesheet' type='text/css' href='/common/css/common_info.css' />
                        </head>	
                        <body >`;
    const info_html2 = `  </body>
                      </html>`;
    /** @type {[string, string][]} */
    const render_variables = [];
    const fs = await import('node:fs');
    if (info=='privacy_policy'||info=='disclaimer'||info=='terms'||info=='about' )
        get_parameters(app_id, (/** @type {Types.error}*/ err, /** @type{Types.info_page_data}*/ result)=>{
            switch (info){
                case 'privacy_policy':{
                    fs.readFile(process.cwd() + `/apps/app${app_id}/src${result.info_link_policy_url}.html`, 'utf8', ( error, fileBuffer) => {
                        const infopage = fileBuffer.toString();
                        render_variables.push(['APPNAME1', result.app_name ]);
                        render_variables.push(['APPNAME2', result.app_name ]);
                        render_variables.push(['APPURL_HREF', result.app_url ]);
                        render_variables.push(['APPURL_INNERTEXT', result.app_url ]);
                        render_variables.push(['APPEMAIL_HREF', 'mailto:' + result.info_email_policy ]);
                        render_variables.push(['APPEMAIL_INNERTEXT', result.info_email_policy ]);
                        callBack(null, info_html1 + render_app_with_data(infopage, render_variables) + info_html2);
                    });
                    break;
                }
                case 'disclaimer':{
                    fs.readFile(process.cwd() + `/apps/app${app_id}/src${result.info_link_disclaimer_url}.html`, 'utf8', (error, fileBuffer) => {
                        const infopage = fileBuffer.toString();
                        render_variables.push(['APPNAME1', result.app_name ]);
                        render_variables.push(['APPNAME2', result.app_name ]);
                        render_variables.push(['APPNAME3', result.app_name ]);
                        render_variables.push(['APPEMAIL_HREF', 'mailto:' + result.info_email_disclaimer ]);
                        render_variables.push(['APPEMAIL_INNERTEXT', result.info_email_disclaimer ]);
                        callBack(null, info_html1 + render_app_with_data(infopage, render_variables) + info_html2);
                    });
                    break;
                }
                case 'terms':{
                    fs.readFile(process.cwd() + `/apps/app${app_id}/src${result.info_link_terms_url}.html`, 'utf8', (error, fileBuffer) => {
                        const infopage = fileBuffer.toString();
                        render_variables.push(['APPNAME', result.app_name ]);
                        render_variables.push(['APPURL_HREF', result.app_url ]);
                        render_variables.push(['APPURL_INNERTEXT', result.app_url ]);
                        render_variables.push(['APPEMAIL_HREF', 'mailto:' + result.info_email_terms ]);
                        render_variables.push(['APPEMAIL_INNERTEXT', result.info_email_terms ]);
                        callBack(null, info_html1 + render_app_with_data(infopage, render_variables) + info_html2);
                    });
                    break;
                }
                case 'about':{
                    fs.readFile(process.cwd() + `/apps/app${app_id}/src${result.info_link_about_url}.html`, 'utf8', (error, fileBuffer) => {
                        callBack(null, info_html1 + fileBuffer.toString() + info_html2);
                    });
                    break;
                }
            }
        });
    else
        callBack(null, null);
};
/**
 * Get app
 * @param {number} app_id 
 * @param {{param:string|null,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string,
 *          host:string}} app_parameters
 * @returns {Promise.<string|null>}
 */
const getAppBFF = async (app_id, app_parameters) =>{
    //Data token
    const { AuthorizeTokenApp } = await import(`file://${process.cwd()}/server/iam.service.js`);
    const { COMMON } = await import(`file://${process.cwd()}/server/server.service.js`);
    await LogAppI(app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(Error().stack), COMMON.app_line(), '1 ' + new Date().toISOString());
    const datatoken = await AuthorizeTokenApp(app_id, app_parameters.ip);
    const result_geodata = await getAppGeodata(app_id, app_parameters.ip, app_parameters.user_agent, app_parameters.accept_language);
    await LogAppI(app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(Error().stack), COMMON.app_line(), '2 ' +new Date().toISOString());
    /** @type {number} */
    let system_admin_only;
    /** @type {string} */
    let app_module_type;
    /** @type {Types.app_create} */
    let app;
    let config_map;
    /** @type {Types.map_styles} */
    let config_map_styles;
    let config_ui;
    /**@type {[string, string][]} */
    const render_variables = [];

    if (app_id == 0){
        //get app admin
        const{createAdmin } = await import(`file://${process.cwd()}/apps/admin/src/app.js`);
        app = await createAdmin(app_id, client_locale(app_parameters.accept_language));
        if (app_start()==true){
            system_admin_only = 0;
        }
        else{
            system_admin_only = 1;
        }
        app_module_type = 'ADMIN';
        config_map = app.map;
        config_map_styles = app.map_styles;
        config_ui = true;
        const result_objects = [];
        result_objects.push({object_item_name:'PASSWORD_NEW', text:'New password'});
        result_objects.push({object_item_name:'PASSWORD_NEW_CONFIRM', text:'New password confirm'});
        result_objects.push({object_item_name:'USERNAME', text:'Username'});
        result_objects.push({object_item_name:'PASSWORD', text:'Password'});
        result_objects.push({object_item_name:'EMAIL', text:'Email'});
        result_objects.push({object_item_name:'NEW_EMAIL', text:'New email'});
        result_objects.push({object_item_name:'PASSWORD_CONFIRM', text:'Password confirm'});
        result_objects.push({object_item_name:'PASSWORD_REMINDER', text:'Password reminder'});
        result_objects.push({object_item_name:'BIO', text:'Bio'});
        result_objects.push({object_item_name:'CONFIRM_QUESTION', text:'Are you sure?'});
        for (const row of result_objects){
            render_variables.push([`COMMON_TRANSLATION_${row.object_item_name.toUpperCase()}`, row.text]);
        }
        app.app = render_app_with_data(app.app, render_variables);
    }
    else{
        system_admin_only = 0;
        await LogAppI(app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(Error().stack), COMMON.app_line(), '3 ' +new Date().toISOString());
        const {createApp} = await import(`file://${process.cwd()}/apps/app${app_id}/src/app.js`);
        app = await createApp(app_id, app_parameters.param, client_locale(app_parameters.accept_language));
        await LogAppI(app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(Error().stack), COMMON.app_line(), '4 ' +new Date().toISOString());
        if (app.app == null)
            return null;
        app_module_type = 'APP';
        config_map = app.map;
        config_map_styles = app.map_styles;
        config_ui = true;
        //get translation data
        const {getObjects} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_object.service.js`);
        const result_objects = await getObjects(app_id, client_locale(app_parameters.accept_language), 'APP', null);
        await LogAppI(app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(Error().stack), COMMON.app_line(), '5 ' +new Date().toISOString());
        for (const row of result_objects){
            render_variables.push([`COMMON_TRANSLATION_${row.object_item_name.toUpperCase()}`, row.text]);
        }
        app.app = render_app_with_data(app.app, render_variables);
    }
    await LogAppI(app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(Error().stack), COMMON.app_line(), '6 ' +new Date().toISOString());
    const app_with_init = await get_module_with_initBFF({   app_id:             app_id, 
                                                            locale:             client_locale(app_parameters.accept_language),
                                                            system_admin_only:  system_admin_only,
                                                            map:                config_map, 
                                                            map_styles:         config_map_styles,
                                                            ui:                 config_ui,
                                                            datatoken:          datatoken,
                                                            latitude:           result_geodata.latitude,
                                                            longitude:          result_geodata.longitude,
                                                            place:              result_geodata.place,
                                                            timezone:           result_geodata.timezone,
                                                            module:             app.app});
    //if app admin then log, system does not log in database
    if (ConfigGet('SERVICE_DB', 'START')=='1' && ConfigGet('SERVICE_DB', `DB${ConfigGet('SERVICE_DB', 'USE')}_APP_ADMIN_USER`)){
        const {createLog} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_log.service.js`);
        await createLog(app_id,
            { app_id : app_id,
                app_module : 'APPS',
                app_module_type : app_module_type,
                app_module_request : app_parameters.param,
                app_module_result : result_geodata.place,
                app_user_id : null,
                user_language : client_locale(app_parameters.accept_language),
                user_timezone : result_geodata.timezone,
                user_number_system : null,
                user_platform : null,
                server_remote_addr : app_parameters.ip,
                server_user_agent : app_parameters.user_agent,
                server_http_host : app_parameters.host,
                server_http_accept_language : app_parameters.accept_language,
                client_latitude : result_geodata.latitude,
                client_longitude : result_geodata.longitude
            });
    }
    return app_with_init;
};
/**
 * 
 * @param {number} app_id 
 * @param {string} ip
 * @param {string} host
 * @param {string} user_agent 
 * @param {string} accept_language 
 * @param {string} reportid
 * @param {number} messagequeue
 * @returns {Promise.<{type: string, report:string}>}
 */
const getReport = async (app_id, ip, host, user_agent, accept_language, reportid, messagequeue) => {
    const { AuthorizeTokenApp } = await import(`file://${process.cwd()}/server/iam.service.js`);
    await AuthorizeTokenApp(app_id, ip);
    const result_geodata = await getAppGeodata(app_id, ip, user_agent, accept_language);

    const decodedparameters = Buffer.from(reportid, 'base64').toString('utf-8');
    
    let query_parameters = '{';
    decodedparameters.split('&').forEach((parameter, index)=>{
        query_parameters += `"${parameter.split('=')[0]}": "${parameter.split('=')[1]}"`;
        if (index < decodedparameters.split('&').length - 1)
            query_parameters += ',';
    });
    query_parameters += '}';
    /** @type {Types.report_query_parameters}*/
    const query_parameters_obj = JSON.parse(query_parameters);

    const ps = query_parameters_obj.ps; //papersize     A4/Letter
    const hf = (query_parameters_obj.hf==1); //header/footer 1/0    1= true
    
    if (query_parameters_obj.format.toUpperCase() == 'PDF' && typeof messagequeue == 'undefined' ){
        //PDF
        const url = `${host}/reports?ps=${ps}&hf=${hf}&reportid=${reportid}&messagequeue=1`;
        //call message queue
        const { MessageQueue } = await import(`file://${process.cwd()}/microservice/microservice.service.js`);
        return {type:'PDF',
                report:await MessageQueue('PDF', 'PUBLISH', {url:url, ps:ps, hf:hf}, null)
                .catch((/**@type{string}*/error)=>{
                        throw error;
                })};
    }
    else{
        const {createReport} = await import(`file://${process.cwd()}/apps/app${app_id}/src/report/index.js`);
        /**@type{Types.report_create_parameters} */
        const data = {  app_id:         app_id,
                        reportid:       reportid,
                        reportname:     query_parameters_obj.module,
                        ip:             ip,
                        user_agent:     user_agent,
                        accept_language:accept_language,
                        latitude:       result_geodata.latitude,
                        longitude:      result_geodata.longitude,
                        report:         null};
        return {    type:'HTML',
                    report:await createReport(app_id, data)
                };
    }
};
/**
 * 
 * @param {number} app_id 
 * @param {string} ip 
 * @param {string} user_agent 
 * @param {string} accept_language
 * @returns 
 */
const getAppGeodata = async (app_id, ip, user_agent, accept_language) =>{
    const { BFF_microservices } = await import(`file://${process.cwd()}/server/bff.service.js`);
    //get GPS from IP
    /**@type{Types.bff_parameters_microservices}*/
    const parameters = {app_id:app_id, 
                        endpoint: 'APP', 
                        service:'GEOLOCATION', 
                        ip:ip, 
                        method:'GET', 
                        user_agent:user_agent, 
                        accept_language:accept_language,
                        parameters:new Buffer(`/ip?ip=${ip}`).toString('base64'), 
                        body:null};
    const result_gps = await BFF_microservices(parameters)
    .catch((/**@type{Types.error}*/error)=>error);
    const result_geodata = {};
    if (result_gps){
        result_geodata.latitude =   JSON.parse(result_gps).geoplugin_latitude;
        result_geodata.longitude=   JSON.parse(result_gps).geoplugin_longitude;
        result_geodata.place    =   JSON.parse(result_gps).geoplugin_city + ', ' +
                                    JSON.parse(result_gps).geoplugin_regionName + ', ' +
                                    JSON.parse(result_gps).geoplugin_countryName;
        result_geodata.timezone =   JSON.parse(result_gps).geoplugin_timezone;
    }
    else{
        /**@type{Types.bff_parameters_microservices}*/
        const parameters = {app_id:app_id, 
                            endpoint: 'APP', 
                            service:'WORLDCITIES', 
                            ip:ip, 
                            method:'GET', 
                            user_agent:user_agent, 
                            accept_language:accept_language,
                            parameters:new Buffer('/city/random?').toString('base64'), 
                            body:null};
        const result_city = await BFF_microservices(parameters);
        result_geodata.latitude =   JSON.parse(result_city).lat;
        result_geodata.longitude=   JSON.parse(result_city).lng;
        result_geodata.place    =   JSON.parse(result_city).city + ', ' + JSON.parse(result_city).admin_name + ', ' + JSON.parse(result_city).country;
        result_geodata.timezone =   null;
    }
    return result_geodata;
};

/**
 * Gets module maintenance
 * 
 * @param {number} app_id
 * @returns {string}
 */
const getMaintenance = (app_id) => {
    //maintenance can be used from all app_id
    const parameters = {   
        app_id: app_id,
        rest_resource_bff: ConfigGet('SERVER', 'REST_RESOURCE_BFF')
    };
    /** @type {[string, string][]} */
    const render_variables = [];
    render_variables.push(['ITEM_COMMON_PARAMETERS',JSON.stringify(parameters)]);
    return render_app_with_data(render_files(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'MAINTENANCE'), render_variables);
};
/**
 * Renders provider buttons
 * @async
 * @param {number} app_id
 * @returns {Promise<string>}
 */
const providers_buttons = async (app_id) =>{
    const { getIdentityProviders } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/identity_provider.service.js`);
    return new Promise((resolve, reject)=>{
        getIdentityProviders(app_id)
        .then((/**@type{Types.db_result_identity_provider_getIdentityProviders[]}*/result)=>{
            let html = '';
            for (const provider of result){
                html += `<button class='common_login_button common_login_provider_button' >
                            <div class='common_login_provider_id'>${provider.id}</div>
                            <div class='common_login_provider_name'>${provider.provider_name}</div>
                        </button>`;
            }
            if (html)
                resolve(`<div id='identity_provider_login'>${html}</div>`);
            else
                resolve('');
        })
        .catch ((/**@type{Types.error} */err)=>{
            reject(err);
        });
    });	
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {string} lang_code 
 */
const getApps = async (app_id, id, lang_code) =>{
    const {getApp} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app.service.js`);
    const {ConfigGetApps} = await import(`file://${process.cwd()}/server/config.service.js`);
    const fs = await import('node:fs');

    /**@type{Types.db_result_app_getApp[]}*/
    const apps_db =  await getApp(app_id, id, lang_code);
    const apps_registry = ConfigGetApps().filter((/**@type{Types.config_apps_record}*/app)=>app.APP_ID==id || id == 0);
    /**@type{Types.config_apps_with_db_columns[]}*/
    const apps = apps_registry.reduce(( /**@type{Types.config_apps_record} */app, /**@type {Types.config_apps_record}*/current)=>
                                        app.concat({APP_ID:current.APP_ID,
                                                    NAME:current.NAME,
                                                    SUBDOMAIN:current.SUBDOMAIN,
                                                    LOGO:current.PATH + current.LOGO,
                                                    STATUS:current.STATUS
                                                    }) , []);
    
    for (const app of apps){
        app.PROTOCOL = ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'?'https://':'http://';
        app.HOST = ConfigGet('SERVER', 'HOST');
        app.PORT = getNumberValue(ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'?ConfigGet('SERVER', 'HTTPS_PORT'):ConfigGet('SERVER', 'HTTP_PORT'));
        app.APP_CATEGORY = apps_db.filter(app_db=>app_db.id==app.APP_ID)[0].app_category;
        app.APP_DESCRIPTION = apps_db.filter(app_db=>app_db.id==app.APP_ID)[0].app_description;
        const image = await fs.promises.readFile(`${process.cwd()}${app.LOGO}`);
        /**@ts-ignore */
        app.LOGO = 'data:image/webp;base64,' + Buffer.from(image, 'binary').toString('base64');
    }
	return apps;
};

/**
 * 
 * @param {number} app_id 
 * @param {string} lang_code 
 */
 const getAppsAdmin = async (app_id, lang_code) =>{
    const {getAppsAdmin} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app.service.js`);
    const {ConfigGetApps} = await import(`file://${process.cwd()}/server/config.service.js`);

    /**@type{Types.db_result_app_getAppsAdmin[]}*/
    const apps_db =  await getAppsAdmin(app_id, lang_code);
    const apps_registry = ConfigGetApps();
    /**@type{Types.config_apps_admin_with_db_columns[]}*/
    const apps = apps_registry.reduce(( /**@type{Types.config_apps_record} */app, /**@type {Types.config_apps_record}*/current)=> 
                                        app.concat({ID:current.APP_ID,
                                                    NAME:current.NAME,
                                                    SUBDOMAIN:current.SUBDOMAIN,
                                                    LOGO:current.LOGO,
                                                    STATUS:current.STATUS,
                                                    }) , []);    
    
    apps.map(app=>{
        app.PROTOCOL = ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'?'https://':'http://';
        app.HOST = ConfigGet('SERVER', 'HOST');
        app.PORT = getNumberValue(ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'?ConfigGet('SERVER', 'HTTPS_PORT'):ConfigGet('SERVER', 'HTTP_PORT'));
        app.APP_CATEGORY_ID = apps_db.filter(app_db=>app_db.id==app.ID)[0].app_category_id;
        app.APP_CATEGORY_TEXT = apps_db.filter(app_db=>app_db.id==app.ID)[0].app_category_text;
    });
	return apps;
};
/**
 * 
 * @param {number} app_id
 * @param {string} url 
 * @param {string} basepath 
 * @param {Types.res} res 
 */
const getAssetFile = (app_id, url, basepath, res) =>{
    return new Promise((resolve, reject)=>{
        switch (url.toLowerCase().substring(url.lastIndexOf('.'))){
            case '.css':{
                res.type('text/css');
                resolve(fs.promises.readFile(`${process.cwd()}${basepath}${url}`, 'utf8'));
                break;
            }
            case '.js':{
                res.type('text/javascript');
                resolve(fs.promises.readFile(`${process.cwd()}${basepath}${url}`, 'utf8'));
                break;
            }
            case '.html':{
                res.type('text/html');
                resolve(fs.promises.readFile(`${process.cwd()}${basepath}${url}`, 'utf8'));
                break;
            }
            case '.ogg':{
                res.type('audio/ogg');
                resolve(fs.promises.readFile(`${process.cwd()}${basepath}${url}`)
                .then((/**@type{*}*/audio)=>Buffer.from(audio, 'binary')));
                break;
            }
            case '.webp':{
                res.type('image/webp');
                resolve(fs.promises.readFile(`${process.cwd()}${basepath}${url}`)
                .then((/**@type{*}*/image)=>Buffer.from(image, 'binary')));
                break;
            }
            case '.png':{
                res.type('image/png');
                resolve(fs.promises.readFile(`${process.cwd()}${basepath}${url}`)
                .then((/**@type{*}*/image)=>Buffer.from(image, 'binary')));
                break;
            }
            case '.woff2':{
                res.type('font/woff');
                resolve(fs.promises.readFile(`${process.cwd()}${basepath}${url}`)
                .then((/**@type{*}*/font)=>Buffer.from(font, 'binary')));
                break;
            }
            case '.ttf':{
                res.type('font/ttf');
                resolve(fs.promises.readFile(`${process.cwd()}${basepath}${url}`)
                .then((/**@type{*}*/font)=>Buffer.from(font, 'binary')));
                break;
            }
            case '.json':{
                res.type('application/json');
                resolve(fs.promises.readFile(`${process.cwd()}${basepath}${url}`, 'utf8'));
                break;
            }
            default:{
                LogAppE(app_id, COMMON.app_filename(import.meta.url), 'app.get("/")', COMMON.app_line(), `Invalid file type ${url}`)
                .then(()=>{
                    res.statusCode = 403;
                    res.statusMessage = null;
                    reject(null);
                });
            }
        }
    });
};
/**
 * Get app asset, common asset, app info page, app report or app
 * @param {string} ip
 * @param {string} host
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {string} url
 * @param {string} reportid
 * @param {number} messagequeue
 * @param {string} info
 * @param {string} lang_code
 * @param {Types.res} res
 */
const getAppMain = async (ip, host, user_agent, accept_language, url, reportid, messagequeue, info, lang_code, res) =>{
    const app_id = ConfigGetAppHost(host, 'SUBDOMAIN');
    if (app_id==null){
        res.statusCode = 301;
        return null;
    }
    else
        if (url.toLowerCase().startsWith('/maintenance'))
            return getAssetFile(app_id, url.substring('/maintenance'.length), '/apps/common/public', res)
                    .catch(()=>null);
        else
            if (app_id == getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')) || app_start(app_id) ==true)
                return new Promise((resolve, reject)=>{
                    if (url.toLowerCase().startsWith('/css')||
                        url.toLowerCase().startsWith('/images')||
                        url.toLowerCase().startsWith('/js')||
                        url.toLowerCase().startsWith('/common')||
                        url == '/manifest.json'||
                        url == '/sw.js')
                        if (url.toLowerCase().startsWith('/common'))
                            resolve(getAssetFile(app_id, url.substring('/common'.length), '/apps/common/public', res)
                                    .catch(()=>null));
                        else
                            resolve(getAssetFile(app_id, url, ConfigGetApp(app_id,'PATH'), res)
                                    .catch(()=>null));
                    else
                        if (info)
                            if (ConfigGetApp(app_id, 'SHOWINFO')==1)
                                switch (info){
                                    case 'about':
                                    case 'disclaimer':
                                    case 'privacy_policy':
                                    case 'terms':{
                                        if (typeof lang_code !='undefined'){
                                            lang_code = 'en';
                                        }
                                        getInfo(app_id, info, lang_code, (/**@type{Types.error}*/err, /**@type{Types.info_page_data}}*/info_result)=>{
                                            //show empty if any error
                                            if (err){
                                                res.statusCode = 500;
                                                res.statusMessage = err;
                                                reject(err);
                                            }
                                            else
                                                resolve(info_result);
                                        });
                                        break;
                                    }
                                    default:{
                                        resolve(null);
                                        break;
                                    }
                                }
                            else
                                resolve(null);
                        else
                            if (url.toLowerCase().startsWith('/report'))
                                getReport(app_id, ip, host, user_agent, accept_language, reportid, messagequeue)
                                .then((report_result)=>{
                                    if (report_result.type=='PDF')
                                        res.type('application/pdf');
                                    resolve(report_result.report);
                                });
                            else
                                if ((ConfigGetApp(app_id, 'SHOWPARAM') == 1 && url.substring(1) !== '') ||
                                    url == '/')
                                    LogAppI(app_id, COMMON.app_filename(import.meta.url), url, COMMON.app_line(), '1 ' + new Date().toISOString())
                                    .then(()=>{
                                        getAppBFF(app_id, 
                                                    {   param:          url.substring(1)==''?null:url.substring(1),
                                                        ip:             ip, 
                                                        user_agent:     user_agent,
                                                        accept_language:accept_language,
                                                        host:           host}).then(app_result=>{
                                            LogAppI(app_id, COMMON.app_filename(import.meta.url), url, COMMON.app_line(), '2 ' + new Date().toISOString())
                                            .then(()=>{
                                                resolve(app_result);
                                            })
                                            .catch((/**@type{Types.error}*/err)=>{
                                                res.statusCode = 500;
                                                res.statusMessage = err;
                                                reject(err);
                                            });
                                        });
                                    });
                                else{
                                    res.statusCode = 301;
                                    resolve(null);
                                }
                });
            else
                return getMaintenance(app_id);
    
};
export {/*APP functions */
        app_start, render_app_html,render_report_html ,render_app_with_data,
        /*APP EMAIL functions*/
        createMail,
        /*APP ROUTER functiontions */
        getReport, getInfo,getMaintenance,
        getApps, getAppsAdmin,
        getAppMain};
/** @module server/apps */

/**@type{import('../server/config.service.js')} */
const {ConfigGet, ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);
/**@type{import('../server/server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const fs = await import('node:fs');

/**
 * Creates email
 * @async
 * @param {number} app_id                       - Application id
 * @param {import('../server/types.js').server_apps_email_param_data} data         - Email param data
 * @returns {Promise<import('../server/types.js').server_apps_email_return_createMail>}  - Email return data
 */
const createMail = async (app_id, data) =>{
    const {default:ComponentCreate} = await import('./common/src/component/common_mail.js');
    const email_html = await ComponentCreate({data:{host:data.host ?? '', verification_code:data.verificationCode ?? ''}, methods:null});
    return new Promise((resolve, reject) => {
        //email type 1-4 implemented are emails with verification code
        if (parseInt(data.emailtype)==1 || 
            parseInt(data.emailtype)==2 || 
            parseInt(data.emailtype)==3 ||
            parseInt(data.emailtype)==4){

            /** @type {string} */
            let email_from = '';
            switch (parseInt(data.emailtype)){
                case 1:{
                    email_from = ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
                    break;
                }
                case 2:{
                    email_from = ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME;
                    break;
                }
                case 3:{
                    email_from = ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME;
                    break;
                }
                case 4:{
                    email_from = ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME;
                    break;
                }
            }
            
            
            resolve ({
                'email_host':         ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_HOST,
                'email_port':         ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_PORT,
                'email_secure':       ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_SECURE,
                'email_auth_user':    ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_USERNAME,
                'email_auth_pass':    ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_PASSWORD,
                'from':               email_from,
                'to':                 data.to,
                'subject':            '❂❂❂❂❂❂',
                'html':               email_html
            });
        }
        else
            reject ('not implemented');
    });
};


/**
 * Get all aps from app registry and translated names
 * @param {number} app_id 
 * @param {number|null} resource_id 
 * @param {string} lang_code 
 */
const getApps = async (app_id, resource_id, lang_code) =>{
    /**@type{import('../server/db/sql/app.service.js')} */
    const {getApp} = await import(`file://${process.cwd()}/server/db/sql/app.service.js`);
    /**@type{import('../server/config.service.js')} */
    const {ConfigGetApps} = await import(`file://${process.cwd()}/server/config.service.js`);

    const apps_db =  await getApp(app_id, resource_id, lang_code);
    const apps_registry = ConfigGetApps().filter((/**@type{import('../server/types.js').server_config_apps_record}*/app)=>app.APP_ID==resource_id || resource_id == null);
    /**@type{import('../server/types.js').server_config_apps_with_db_columns[]}*/
    const apps = apps_registry.reduce(( /**@type{import('../server/types.js').server_config_apps_record} */app, /**@type {import('../server/types.js').server_config_apps_record}*/current)=>
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
        app.APP_NAME_TRANSLATION = JSON.parse(apps_db.filter(app_db=>app_db.id==app.APP_ID)[0].app_translation.toString()).name;
        const image = await fs.promises.readFile(`${process.cwd()}${app.LOGO}`);
        /**@ts-ignore */
        app.LOGO = 'data:image/webp;base64,' + Buffer.from(image, 'binary').toString('base64');
    }
    return apps;
};

/**
 * Get all apps from app registry
 */
 const getAppsAdmin = async () =>{
    /**@type{import('../server/db/file.service.js')} */
    const {fileCache} = await import(`file://${process.cwd()}/server/db/file.service.js`);
    /**@type{import('../server/types.js').server_config_apps_admin[]}*/
    const apps = fileCache('CONFIG_APPS').APPS.map((/**@type{import('../server/types.js').server_config_apps_admin}*/app)=>{
        return {ID:app.ID,
                NAME:app.NAME,
                SUBDOMAIN:app.SUBDOMAIN,
                LOGO:app.LOGO,
                STATUS:app.STATUS,
    };});
    const HTTPS_ENABLE = fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/row)=>'HTTPS_ENABLE' in row)[0].HTTPS_ENABLE;
    apps.map(app=>{
        app.PROTOCOL = HTTPS_ENABLE =='1'?'https://':'http://';
        app.HOST = fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/row)=>'HOST' in row)[0].HOST;
        app.PORT = getNumberValue(HTTPS_ENABLE=='1'?
                                    fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/row)=>'HTTPS_PORT' in row)[0].HTTPS_PORT:
                                        fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/row)=>'HTTP_PORT' in row)[0].HTTP_PORT);
    });
    return apps;
};


export {/*APP EMAIL functions*/
        createMail,
        /*APP ROUTER functiontions */
        getApps, getAppsAdmin,
};
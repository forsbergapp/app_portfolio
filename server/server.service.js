const { createLogAppSE } = require(global.SERVER_ROOT + "/service/log/log.controller");

//save config variables with json as module variable for faster performance
//to avoid readfile async and diskusage
//variables only available from ConfigGet function
//variables are updated when admin updates config
let CONFIG_INIT;
let CONFIG;
let CONFIG_BLOCKIP;
let CONFIG_USERAGENT;
let CONFIG_POLICY;
let CONFIG_USER;

//initial config with file paths and maintenance parameter
let SERVER_CONFIG_INIT_PATH;

function config_files(){
    //const fs = require('fs');
    let slash;
    if (process.platform == 'win32')
        slash = '\\';
    else
        slash = '/';
    return [
        [0, `${slash}config${slash}config_init.json`],
        [1, `${slash}config${slash}config.json`],
        [2, `${slash}config${slash}auth_blockip.json`],
        [3, `${slash}config${slash}auth_useragent.json`],
        [4, `${slash}config${slash}auth_policy.json`],
        [5, `${slash}logs${slash}`],
        [6, `${slash}config${slash}auth_user.json`] 
        ];
    /*
    //enable when server.js has implemented default config process
     fs.readFile(global.SERVER_ROOT + SERVER_CONFIG_INIT_PATH, 'utf8', (err, fileBuffer) => {
            let config_init = JSON.parse(fileBuffer.toString());
            //returns filenames and relative path
            return [
                [1, config_init['file_config_server']],
                [2, config_init['file_config_blockip']],
                [3, config_init['file_config_useragent']],
                [4, config_init['file_config_policy']],
                [5, config_init['path_log']] 
              ];
     })
    */
}
async function setVariables(){
    return await new Promise(function(resolve, reject){
        let files = config_files();
        let i=0;
        let slash;
        if (process.platform == 'win32')
            slash = '\\';
        else
            slash = '/';
        SERVER_CONFIG_INIT_PATH = `${slash}config${slash}config_init.json`;
        const fs = require('fs');
        for (const file of files){
            //skip log path
            if (file[0]!=5){
                fs.readFile(global.SERVER_ROOT + file[1], 'utf8', (err, fileBuffer) => {
                    if (err)
                        reject(err);
                    else{
                        switch (file[0]){
                            case 0:{
                                CONFIG_INIT = fileBuffer.toString();
                            }
                            case 1:{
                                CONFIG = fileBuffer.toString();
                                break;
                            }
                            case 2:{
                                CONFIG_BLOCKIP = fileBuffer.toString();
                                break;
                            }
                            case 3:{
                                CONFIG_USERAGENT = fileBuffer.toString();
                                break;
                            }
                            case 4:{
                                CONFIG_POLICY = fileBuffer.toString();
                                break;
                            }
                            case 6:{
                                CONFIG_USER = fileBuffer.toString();
                                break;
                            }
                        }
                        //check if last, dont count skipped log path
                        if (i == files.length -2)
                            resolve();
                        else
                            i++;
                    }
                })
            }
        }
    })
}
function ConfigGet(config_no, config_group = null, parameter = null){
    switch (parseInt(config_no)){
        case 0:{
            //CONFIG INIT
            return JSON.parse(CONFIG_INIT)[parameter];
        }
        case 1:{
            //SERVER
            let json = JSON.parse(CONFIG);
            if (config_group ==null && parameter==null)
                return json;
            else{
                for (config_parameter_row of json[config_group]){
                    for (let i=0; i < Object.keys(config_parameter_row).length;i++){
                        if (Object.keys(config_parameter_row)[i]==parameter){
                            return Object.values(config_parameter_row)[i];
                        }
                    }
                }   
                return null;
            }
        }
        case 2:{
            //BLOCKIP json
            return JSON.parse(CONFIG_BLOCKIP);
        } 
        case 3:{
            //USERAGENT json
            return JSON.parse(CONFIG_USERAGENT);
        } 
        case 4:{
            //POLICY json
            return JSON.parse(CONFIG_POLICY);
        } 
        case 5:{
            //LOGS path
            return config_files()[5];
        } 
        case 6:{
            //ADMIN username and password
            return JSON.parse(CONFIG_USER);
            /*async issue
            let fs = require('fs');
            fs.readFile(global.SERVER_ROOT + config_files()[config_no][1], 'utf8', (err, fileBuffer) => {
                return JSON.parse(fileBuffer.toString());
            })
            */
        } 
    }
}
module.exports = {
    ConfigGetCallBack:(config_no, config_group, parameter, callBack) =>{
        callBack(null, ConfigGet(config_no, config_group, parameter));
    },
    ConfigMaintenanceSet:(value, callBack)=>{
        const fs = require('fs');
        fs.readFile(global.SERVER_ROOT + SERVER_CONFIG_INIT_PATH, 'utf8', (err, fileBuffer) => {
            if (err)
                callBack(err, null);
            else{
                let config_init_json = JSON.parse(fileBuffer.toString());
                config_init_json['MAINTENANCE'] = value;
                config_init_json['MODIFIED'] = new Date().toISOString();
                config_init_json = JSON.stringify(config_init_json, undefined, 2);
                //maintenance in this config file is only updated so no need for backup files
                fs.writeFile(global.SERVER_ROOT + SERVER_CONFIG_INIT_PATH, config_init_json,  'utf8', (err, result_write_config) => {
                    if (err)
                        callBack(err, null);
                    else{
                        CONFIG_INIT = config_init_json;
                        callBack(null, null);
                    }
                })
            }
        })
    },
    ConfigMaintenanceGet:(callBack)=>{
        const fs = require('fs');
        fs.readFile(global.SERVER_ROOT + SERVER_CONFIG_INIT_PATH, 'utf8', (err, fileBuffer) => {
            if (err)
                callBack(err, null);
            else
                callBack(null, JSON.parse(fileBuffer.toString())['MAINTENANCE']);
        })
    },
    ConfigGetSaved: (config_type_no, callBack)=>{
        /*
        config_type_no
        0 = config_init     path + file
        1 = config          path + file
        2 = auth blockip    path + file
        3 = auth useragent  path + file
        4 = auth policy     path + file
        5 = log path        path
        6 = auth user       path + file
        */

        const fs = require('fs');
        let config_file = config_files().filter(function(file) {
            return (parseInt(file[0]) == config_type_no);
        })[0][1];
        fs.readFile(global.SERVER_ROOT + config_file, 'utf8', (err, fileBuffer) => {
            if (err)
                callBack(err, null);
            else
                callBack(null, JSON.parse(fileBuffer.toString()));
        })
    },
    ConfigSave: (app_id, config_no, config_json, callBack) =>{
        try {
            const fs = require("fs");
            let config_file;
            if (config_no){
                config_file = config_files().filter(function(file) {
                    return (parseInt(file[0]) == parseInt(config_no));
                })[0][1];
                //get old config file
                fs.readFile(global.SERVER_ROOT + config_file,  'utf8', (err, result_read) => {
                    if (err)
                        callBack(err, null);
                    else{
                        let old_config = result_read.toString();
                        //write backup of old file
                        fs.writeFile(global.SERVER_ROOT + `${config_file}.${new Date().toISOString().replace(new RegExp(':', 'g'),'.')}`, old_config,  'utf8', (err, result_write_backup) => {
                            if (err)
                                callBack(err, null);
                            else{
                                if (config_no == 1){
                                    //add metadata to server config
                                    config_json = JSON.parse(config_json);
                                    config_json['configuration'] = 'App Portfolio';
                                    config_json['comment'] = '';
                                    config_json['created'] = JSON.parse(old_config)['created'];
                                    config_json['modified'] = new Date().toISOString();
                                    config_json = JSON.stringify(config_json, undefined, 2);
                                }                    
                                //write new config
                                fs.writeFile(global.SERVER_ROOT + config_file, config_json,  'utf8', (err, result_write) => {
                                    if (err)
                                        callBack(err, null);
                                    else{
                                        //update module variables for faster access
                                        switch (config_no){
                                            case 1:{
                                                CONFIG = config_json;
                                                break;
                                            }
                                            case 2:{
                                                CONFIG_BLOCKIP = config_json;
                                                break;
                                            }
                                            case 3:{
                                                CONFIG_USERAGENT = config_json;
                                                break;
                                            }
                                            case 4:{
                                                CONFIG_POLICY = config_json;
                                                break;
                                            }
                                        }
                                        callBack(null, null);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        } catch (error) {
            createLogAppSE(app_id, __appfilename, __appfunction, __appline, err).then(function(){
                callBack(err, null);
            })
        }
    },
    DefaultConfig:(admin_name, admin_password, callBack)=>{

        try {
            let check_text = JSON.parse(JSON.stringify(admin_name));
            if (admin_name.includes('"') || admin_name.includes('\\'))
                return callBack(window.global_icon_message_error, null);
            check_text = JSON.parse(JSON.stringify(admin_password));
            if (admin_password.includes('"') || admin_password.includes('\\'))
                return callBack(window.global_icon_message_error, null);
        } catch (error) {
            return callBack(window.global_icon_message_error, null);
        }
        
        const { createHash } = require('crypto');			
        function hash(string) {
            return createHash('sha256').update(string).digest('hex');
        }
        let slash;
        if (process.platform == 'win32')
            slash = '\\';
        else
            slash = '/';
        let config_file = [];
        config_file.push(`{ "SERVER":[
                                                    {"HTTPS_KEY": "${slash}config${slash}ssl${slash}privkey.pem", "COMMENT": ""},
                                                    {"HTTPS_CERT": "${slash}config${slash}ssl${slash}fullchain.pem", "COMMENT": ""},
                                                    {"PORT": "80", "COMMENT": ""},
                                                    {"HTTPS_ENABLE": "0", "COMMENT": ""},
                                                    {"HTTPS_PORT": "443", "COMMENT": ""},
                                                    {"JSON_LIMIT": "10MB", "COMMENT": ""},
                                                    {"TEST_SUBDOMAIN": "test", "COMMENT": "test.[domain] test network with subdomains for test environment
                                                                                            update DNS to point to test.[domain], *.test.[domain]/admin,  app1.test.[domain] etc
                                                                                            create SSL for *.test.[domain], *.[domain], [domain]"},
                                                    {"APP_START": "0", "COMMENT": "0=NO, 1=YES, when 0 then only admin is started"},
                                                    {"APP_COMMON_APP_ID": "0", "COMMENT": "admin and common app id"}
                                         ],
                            "SERVICE_AUTH":[
                                                    {"ACCESS_CONTROL_ENABLE": "1", "COMMENT": "0=NO, 1=YES"},
                                                    {"ACCESS_CONTROL_IP": "0", "COMMENT": "0=NO, 1=YES, check IP v4 range to block. Could be integrated with iptables on Linux."},
                                                    {"ACCESS_CONTROL_HOST_EXIST": "1", "COMMENT": "0=NO, 1=YES"},
                                                    {"ACCESS_CONTROL_ACCESS_FROM": "1", "COMMENT": "0=NO, 1=YES, check if accessed from domain and not os hostname"},
                                                    {"ACCESS_CONTROL_USER_AGENT": "0", "COMMENT": "0=NO, 1=YES, check user agents"},
                                                    {"ACCESS_CONTROL_USER_AGENT_EXIST": "1", "COMMENT": "0=NO, 1=YES, check if ok to have empty user agent or not"},
                                                    {"ACCESS_CONTROL_ACCEPT_LANGUAGE": "1", "COMMENT": "0=NO, 1=YES"},
                                                    {"ADMIN_TOKEN_EXPIRE_ACCESS": "1d", "COMMENT": "setting jsonwebtoken"},
                                                    {"ADMIN_TOKEN_SECRET": "${hash(Date.now())}", "COMMENT": "setting jsonwebtoken"},
                                                    {"ENABLE_POLICY": "1", "COMMENT": "0=NO, 1=YES, setting helmet"},
                                                    {"ENABLE_GEOLOCATION": "0", "COMMENT": "0=NO, 1=YES, get geodata from clients and from chosen places in apps, client geodata is saved if enabled"},
                                                    {"ENABLE_USER_REGISTRATION": "0", "COMMENT": "0=NO, 1=YES"},
                                                    {"ENABLE_USER_LOGIN": "1", "COMMENT": "0=NO, 1=YES"},
                                                    {"ENABLE_DBLOG": "0", "COMMENT": "0=NO, 1=YES, if services should be enabled to log all activity in app_log table in database"}
                                               ],
                            "SERVICE_BROADCAST":[
                                                    {"CHECK_INTERVAL": "5000", "COMMENT": "maintenance check interval in milliseconds"}
                                                ],
                            "SERVICE_DB":[
                                                    {"START": "0", "COMMENT": "0=NO, 1=YES, when 0 then only system admin can login in admin"},
                                                    {"REST_API_PATH": "/service/db/app_portfolio", "COMMENT": ""},
                                                    {"USE": "1", "COMMENT": "1=MariaDB/MySQL(mysql module), 2=Oracle(oracledb module), 3=PostgreSQL(pg module)"},
                                                    {"LIMIT_LIST_SEARCH": "100", "COMMENT": ""},
                                                    {"LIMIT_LIST_PROFILE_TOP": "100", "COMMENT": ""},
                                                    {"DB1_VARIANT": "2", "COMMENT": "1=MySQL (global variables in PERFORMANCE_SCHEMA), 2=MariaDB (global variables in INFORMATION_SCHEMA). Both use npm MySQL module "},
                                                    {"DB1_APP_ADMIN_USER": "app_admin", "COMMENT": ""},
                                                    {"DB1_APP_ADMIN_PASS": "APP_1_portfolio", "COMMENT": ""},
                                                    {"DB1_PORT": "3306", "COMMENT": ""},
                                                    {"DB1_HOST": "localhost", "COMMENT": ""},
                                                    {"DB1_NAME": "app_portfolio", "COMMENT": ""},
                                                    {"DB1_CHARACTERSET": "utf8mb4", "COMMENT": ""},
                                                    {"DB1_CONNECTION_LIMIT": "10", "COMMENT": ""},
                                                    {"DB2_APP_ADMIN_USER": "app_admin", "COMMENT": ""},
                                                    {"DB2_APP_ADMIN_PASS": "APP_1_portfolio", "COMMENT": ""},
                                                    {"DB2_NAME": "app_portfolio", "COMMENT": ""},
                                                    {"DB2_CONNECTSTRING": "", "COMMENT": ""},
                                                    {"DB2_POOL_MIN": "1", "COMMENT": ""},
                                                    {"DB2_POOL_MAX": "1", "COMMENT": ""},
                                                    {"DB2_POOL_INCREMENT": "0", "COMMENT": ""},
                                                    {"DB2_LIBDIR": "", "COMMENT": "Oracle Instant Client path"},
                                                    {"DB2_CONFIGDIR": "", "COMMENT": "Oracle tnsnames, sqlnet or wallet file content path"},
                                                    {"DB3_APP_ADMIN_USER": "app_admin", "COMMENT": ""},
                                                    {"DB3_APP_ADMIN_PASS": "APP_1_portfolio", "COMMENT": ""},
                                                    {"DB3_HOST": "localhost", "COMMENT": ""},
                                                    {"DB3_PORT": "5432", "COMMENT": ""},
                                                    {"DB3_NAME": "app_portfolio", "COMMENT": ""},
                                                    {"DB3_TIMEOUT_CONNECTION": "5000", "COMMENT": ""},
                                                    {"DB3_TIMEOUT_IDLE": "30000", "COMMENT": ""},
                                                    {"DB3_MAX": "5", "COMMENT": ""}
                                         ],
                            "SERVICE_LOG":[
                                                    {"SCOPE_SERVER": "SERVER", "COMMENT": ""},
                                                    {"SCOPE_SERVICE": "SERVICE", "COMMENT": ""},
                                                    {"SCOPE_DB": "DB", "COMMENT": ""},
                                                    {"SCOPE_ROUTER": "ROUTER", "COMMENT": ""},
                                                    {"SCOPE_CONTROLLER": "CONTROLLER", "COMMENT": ""},
                                                    {"ENABLE_SERVER_INFO": "1", "COMMENT": "0=NO, 1=YES"},
                                                    {"ENABLE_SERVER_VERBOSE": "0", "COMMENT": "0=NO, 1=YES"},
                                                    {"ENABLE_DB": "0", "COMMENT": "0=NO, 1=YES"},
                                                    {"ENABLE_ROUTER": "0", "COMMENT": "0=NO, 1=YES"},
                                                    {"LEVEL_VERBOSE": "VERBOSE", "COMMENT": ""},
                                                    {"LEVEL_ERROR": "ERROR", "COMMENT": ""},
                                                    {"LEVEL_INFO": "INFO", "COMMENT": ""},
                                                    {"DESTINATION": "0", "COMMENT": "0=File only, 1=URL REST API only method POST, 2=File and URL"},
                                                    {"URL_DESTINATION": "", "COMMENT": "URL to REST API method POST"},
                                                    {"URL_DESTINATION_USERNAME": "", "COMMENT": "Basic authorization username"},
                                                    {"URL_DESTINATION_PASSWORD": "", "COMMENT": "Basic authorization password"},
                                                    {"FILE_INTERVAL": "1D", "COMMENT": "1D or 1M"},
                                                    {"DATE_FORMAT": "", "COMMENT": "empty uses ISO8601 format 'yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z' "},
                                                    {"PM2_FILE": "PM2_LOG.json", "COMMENT": ""}
                                          ],
                            "SERVICE_REPORT":[
                                                    {"PDF_TIMEOUT": "20000", "COMMENT": "milliseconds"},
                                                    {"PDF_WAIT_INTERVAL": "100", "COMMENT": "milliseconds"},
                                                    {"PDF_WAIT_ATTEMPTS": "100", "COMMENT": "number of attempts"},
                                                    {"PDF_EMPTY_SIZE_CHECK": "900", "COMMENT": "bytes, PDF with content should be bigger than this"},
                                                    {"EXECUTABLE_PATH": "", "COMMENT": "if using different browser for Puppeteer, ex Linux: /snap/bin/chromium, Windows: C:\\Users\\admin\\AppData\\Local\\Chromium\\Application\\chrome.exe"}
                                             ],
                            "SERVICE_GEOLOCATION":[
                                                    {"URL_GPS_IP": "http://www.geoplugin.net/json.gp", "COMMENT": ""},
                                                    {"URL_GPS_PLACE": "http://www.geoplugin.net/extras/location.gp", "COMMENT": ""}
                                                  ]
                            }`);
        config_file.push(`[
                                    ["0.0.0.0", "0.0.0.0"],
                                    ["0.0.0.0", "0.0.0.0"]
                          ]`);
        config_file.push(`{
                            "user_agent": [
                                    {"Name": "YahooMailProxy", 
                                    "user_agent": "YahooMailProxy; https://help.yahoo.com/kb/yahoo-mail-proxy-SLN28749.html"},
                                    {"Name": "Let's Encrypt validation", 
                                    "user_agent": "Mozilla/5.0 (compatible; Let's Encrypt validation server; +https://www.letsencrypt.org)"}
                                ]
                          }`);
        config_file.push(`{
                            "directives":
                                [
                                    { "type": "script",
                                    "domain": "'self', 'unsafe-inline', 'unsafe-eval'"
                                    },
                                    { "type": "style",
                                    "domain": "'self', 'unsafe-inline', fonts.googleapis.com"
                                    },
                                    { "type": "font",
                                    "domain": "'self', fonts.gstatic.com"
                                    },
                                    { "type": "frame",
                                    "domain": "'self', data:, "
                                    }
                                ]
                          }`);

        //save server metadata
        const fs = require('fs');
        let config_init = `{
                            "CONFIGURATION": "App Portfolio",
                            "CREATED": "${new Date().toISOString()}",
                            "MODIFIED": "${new Date().toISOString()}",
                            "MAINTENANCE": 0,
                            "FILE_CONFIG_AUTH_SERVER":"${slash}config${slash}config.json",
                            "FILE_CONFIG_AUTH_BLOCKIP":"${slash}config${slash}auth_blockip.json",
                            "FILE_CONFIG_AUTH_USERAGENT":"${slash}config${slash}auth_useragent.json",
                            "FILE_CONFIG_AUTH_POLICY":"${slash}config${slash}auth_policy.json",
                            "PATH_LOG":"${slash}logs${slash}",
                            "FILE_CONFIG_AUTH_USER":"${slash}config${slash}auth_user.json"
                            }`;
        async function create_config_dir(){
            return new Promise(function(resolve, reject){
                //create /config directory first time if needed
                fs.access(global.SERVER_ROOT + '/config', (err) => {
                    if (err)
                        fs.mkdir(global.SERVER_ROOT + '/config', (err) => {
                            if (err)
                                reject(err);
                            else
                                resolve();
                        });
                    else
                        resolve();
                });
            })
        }
        create_config_dir()
        .then(function(){
            //save initial config file with metadata including path to config files
            fs.writeFile(global.SERVER_ROOT + SERVER_CONFIG_INIT_PATH, config_init,  'utf8');
            let config_created=0;
            for (let i=0;i<config_file.length;i++){
                module.exports.ConfigSave(config_no, config_file[i], (err, result)=>{
                    if (err)
                        callBack(err, null);
                    else{
                        config_created++;
                        if (config_created== config_file.length - 1)
                            callBack(null, {default_config: 'ok'});
                    }
                })
            }
        })
        .catch(function(err) {
            callBack(err, null);
         });
    },
    Info:(callBack)=>{
        callBack(null, null);
    }
};
module.exports.ConfigGet = ConfigGet;
module.exports.setVariables = setVariables;
const { createLogAppSE } = require(global.SERVER_ROOT + "/service/log/log.controller");

function config_files(){
     const fs = require('fs');
     
    return [
        [1, '/config/config.json'],
        [2, '/config/blockip.json'],
        [3, '/config/safe_user_agent.json'],
        [4, '/config/policy_directives.json'],
        [5, '/logs/'] 
        ];
    /*
    //enable when server.js has implemented default config process
     fs.readFile(global.SERVER_ROOT + global.SERVER_CONFIG_INIT_PATH, 'utf8', (err, fileBuffer) => {
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
module.exports = {
    ConfigServerGlobals: () => {
        global.SERVER_CONFIG_INIT_PATH = '/config/config_init.json';
        global.SERVER_CONFIG_TYPE_SERVER = 1;
        global.SERVER_CONFIG_TYPE_SERVICE_AUTH = 2;
        global.SERVER_CONFIG_TYPE_SERVICE_BROADCAST = 3;
        global.SERVER_CONFIG_TYPE_SERVICE_DB = 4;
        global.SERVER_CONFIG_TYPE_SERVICE_LOG = 5;
        global.SERVER_CONFIG_TYPE_SERVICE_REPORT = 6;
    },
	ConfigGet: (config_no, parameter_name, callBack) => {
        if (parameter_name){
            let parameter_value = eval(`process.env.${parameter_name}`);
            callBack(null, {
                parameter_name:  parameter_name,
                parameter_value : parameter_value
            })
        }
        else{
            const fs = require("fs");
            let config_file;
            if (config_no){
                config_file = config_files().filter(function(file) {
                    return (parseInt(file[0]) == parseInt(config_no));
                })[0][1];
                fs.readFile(global.SERVER_ROOT + config_file, 'utf8', (err, fileBuffer) => {
                    if (err)
                        callBack(err,null);
                    else
                        callBack(null,{config: JSON.parse(fileBuffer.toString())});
                });
            }
            else
                callBack(null, null);
        }
    },
    ConfigMaintenanceSet:(value, callBack)=>{
        const fs = require('fs');
        fs.readFile(global.SERVER_ROOT + global.SERVER_CONFIG_INIT_PATH, 'utf8', (err, fileBuffer) => {
            if (err)
                callBack(err, null);
            else{
                let config_init = JSON.parse(fileBuffer.toString());
                config_init['maintenance'] = value;
                config_init['modified'] = new Date().toISOString();
                callBack(null, null);
            }
        })
    },
    ConfigMaintenanceGet:(callBack)=>{
        const fs = require('fs');
        fs.readFile(global.SERVER_ROOT + global.SERVER_CONFIG_INIT_PATH, 'utf8', (err, fileBuffer) => {
            if (err)
                callBack(err, null);
            else
                callBack(null, JSON.parse(fileBuffer.toString()['maintenance']));
        })
    },
    ConfigServerParameterGet: (config_type_no, parameter_name)=>{
        /*
        config_type_no
        1 = server
        2 = service_auth
        3 = service_broadcast
        4 = service_db
        5 = service_log
        6 = service_report
        */
        const fs = require('fs');
        let config_file = config_files().filter(function(file) {
            return (parseInt(file[0]) == parseInt(1));
        })[0][1];
        fs.readFile(global.SERVER_ROOT + config_file, 'utf8', (err, fileBuffer) => {
            if (err)
                callBack(err, null);
            else{
                let parameter_value = Object.keys(JSON.parse(fileBuffer.toString())[config_type_no][parameter_name])
                callBack(null, parameter_value);
            }
        })
    },
    ConfigUpdateParameter: (parameter_name, parameter_value, callBack) => {
        eval(` process.env.${parameter_name} = ${parameter_value}`);
        callBack(null, {
                            parameter_name  : parameter_name,
                            parameter_value : eval(`process.env.${parameter_name}`)
                        });
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
                                    else
                                        callBack(null, null);
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
        config_file.push(`{ "server":[
                                                    {"HTTPS_KEY": "${slash}ssl${slash}server.key", "COMMENT": ""},
                                                    {"HTTPS_CERT": "${slash}ssl${slash}server.cert", "COMMENT": ""},
                                                    {"PORT": "80", "COMMENT": ""},
                                                    {"HTTPS_ENABLE": 0, "COMMENT": ""},
                                                    {"HTTPS_PORT": 443, "COMMENT": ""},
                                                    {"JSON_LIMIT": "10MB", "COMMENT": ""},
                                                    {"ADMIN_NAME": "${admin_name}", "COMMENT": ""},
                                                    {"ADMIN_PASSWORD": "${admin_password}", "COMMENT": ""},
                                                    {"TEST_SUBDOMAIN": "test", "COMMENT": "test.[domain] test network with subdomains for test environment
                                                                                            update DNS to point to test.[domain], *.test.[domain]/admin,  app1.test.[domain] etc
                                                                                            create SSL for *.test.[domain], *.[domain], [domain]"},
                                                    {"APP_START": 0, "COMMENT": ""},
                                                    {"APP_COMMON_APP_ID": 0, "COMMENT": ""},
                                                    {"SERVER_SERVICE_GEOLOCATION_URL_GPS_IP": "http://www.geoplugin.net/json.gp", "COMMENT": ""},
                                                    {"SERVER_SERVICE_GEOLOCATION_URL_GPS_PLACE": "http://www.geoplugin.net/extras/location.gp", "COMMENT": ""}
                                         ],
                            "service_auth":[
                                                    {"ACCESS_CONTROL_ENABLE": 1, "COMMENT": ""},
                                                    {"ACCESS_CONTROL_IP": 0, "COMMENT": "1=yes, 0=no, check IP v4 range to block. Could be integrated with iptables on Linux."},
                                                    {"ACCESS_CONTROL_HOST_EXIST": 1, "COMMENT": ""},
                                                    {"ACCESS_CONTROL_ACCESS_FROM": 1, "COMMENT": ""},
                                                    {"ACCESS_CONTROL_USER_AGENT": 0, "COMMENT": "check user agents"},
                                                    {"ACCESS_CONTROL_USER_AGENT_EXIST": 1, "COMMENT": "check if ok to have empty user agent or not"},
                                                    {"ACCESS_CONTROL_ACCEPT_LANGUAGE": 1, "COMMENT": ""},
                                                    {"ADMIN_TOKEN_EXPIRE_ACCESS": "1d", "COMMENT": ""},
                                                    {"ADMIN_TOKEN_SECRET": "${hash(Date.now())}", "COMMENT": ""},
                                                    {"ENABLE_GEOLOCATION": 0, "COMMENT": ""},
                                                    {"ENABLE_USER_REGISTRATION": 0, "COMMENT": ""},
                                                    {"ENABLE_USER_LOGIN": 1, "COMMENT": ""},
                                                    {"ENABLE_DBLOG": 0, "COMMENT": ""}
                                               ],
                            "service_broadcast":[
                                                    {"CHECK_INTERVALL": 5000, "COMMENT": ""}
                                                ],
                            "service_db":[
                                                    {"START": 0, "COMMENT": ""},
                                                    {"REST_API_PATH": "/service/db/app_portfolio", "COMMENT": ""},
                                                    {"USE": 1, "COMMENT": "1=MySQL/MariaDB, 2=Oracle, 3=PostgreSQL"},
                                                    {"LIMIT_LIST_SEARCH": 100, "COMMENT": ""},
                                                    {"LIMIT_LIST_PROFILE_TOP": 100, "COMMENT": ""},
                                                    {"DB1_VARIANT": 2, "COMMENT": "1=MySQL (global variables in PERFORMANCE_SCHEMA), 2=MariaDB (global variables in INFORMATION_SCHEMA). Both use npm MySQL module "},
                                                    {"DB1_APP_ADMIN_USER": "app_admin", "COMMENT": ""},
                                                    {"DB1_APP_ADMIN_PASS": "app_1_portfolio", "COMMENT": ""},
                                                    {"DB1_PORT": 3306, "COMMENT": ""},
                                                    {"DB1_HOST": "localhost", "COMMENT": ""},
                                                    {"DB1_NAME": "app_portfolio", "COMMENT": ""},
                                                    {"DB1_CHARACTERSET": "utf8mb4", "COMMENT": ""},
                                                    {"DB1_CONNECTION_LIMIT": 10, "COMMENT": ""},
                                                    {"DB2_APP_ADMIN_USER": "app_admin", "COMMENT": ""},
                                                    {"DB2_APP_ADMIN_PASS": "app_1_portfolio", "COMMENT": ""},
                                                    {"DB2_NAME": "app_portfolio", "COMMENT": ""},
                                                    {"DB2_CONNECTSTRING": "", "COMMENT": ""},
                                                    {"DB2_POOL_MIN": 1, "COMMENT": ""},
                                                    {"DB2_POOL_MAX": 1, "COMMENT": ""},
                                                    {"DB2_POOL_INCREMENT": 0, "COMMENT": ""},
                                                    {"DB2_LIBDIR": "", "COMMENT": "Oracle Instant Client path"},
                                                    {"DB2_CONFIGDIR": "", "COMMENT": "Oracle tnsnames, sqlnet or wallet file content path"},
                                                    {"DB3_APP_ADMIN_USER": "app_admin", "COMMENT": ""},
                                                    {"DB3_APP_ADMIN_PASS": "app_1_portfolio", "COMMENT": ""},
                                                    {"DB3_HOST": "localhost", "COMMENT": ""},
                                                    {"DB3_PORT": "5432", "COMMENT": ""},
                                                    {"DB3_NAME": "app_portfolio", "COMMENT": ""},
                                                    {"DB3_TIMEOUT_CONNECTION": 5000, "COMMENT": ""},
                                                    {"DB3_TIMEOUT_IDLE": 30000, "COMMENT": ""},
                                                    {"DB3_MAX": 5, "COMMENT": ""}
                                         ],
                            "service_log":[
                                                    {"SCOPE_SERVER": "SERVER", "COMMENT": ""},
                                                    {"SCOPE_SERVICE": "SERVICE", "COMMENT": ""},
                                                    {"SCOPE_DB": "DB", "COMMENT": ""},
                                                    {"SCOPE_ROUTER": "ROUTER", "COMMENT": ""},
                                                    {"SCOPE_CONTROLLER": "CONTROLLER", "COMMENT": ""},
                                                    {"ENABLE_SERVER_INFO": 1, "COMMENT": ""},
                                                    {"ENABLE_SERVER_VERBOSE": 0, "COMMENT": ""},
                                                    {"ENABLE_DB": 0, "COMMENT": ""},
                                                    {"ENABLE_ROUTER": 0, "COMMENT": ""},
                                                    {"LEVEL_VERBOSE": "VERBOSE", "COMMENT": ""},
                                                    {"LEVEL_ERROR": "ERROR", "COMMENT": ""},
                                                    {"LEVEL_INFO": "INFO", "COMMENT": ""},
                                                    {"DESTINATION": 0, "COMMENT": "0=File only, 1=URL REST API only method POST, 2=File and URL"},
                                                    {"URL_DESTINATION": "", "COMMENT": ""},
                                                    {"URL_DESTINATION_USERNAME": "", "COMMENT": ""},
                                                    {"URL_DESTINATION_PASSWORD": "", "COMMENT": ""},
                                                    {"FILE_INTERVAL": "1D", "COMMENT": ""},
                                                    {"DATE_FORMAT": "", "COMMENT": "empty uses ISO8601 format 'yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z' "},
                                                    {"PM2_FILE": "PM2_LOG.json", "COMMENT": ""}
                                          ],
                            "service_report":[
                                                    {"PDF_TIMEOUT": 20000, "COMMENT": ""},
                                                    {"PDF_WAIT_INTERVAL": 100, "COMMENT": ""},
                                                    {"PDF_WAIT_ATTEMPTS": 100, "COMMENT": ""},
                                                    {"PDF_EMPTY_SIZE_CHECK": 900, "COMMENT": "bytes, PDF with content should be bigger than this"},
                                                    {"EXECUTABLE_PATH": "", "COMMENT": "if using different browser for Puppeteer, ex Linux: /snap/bin/chromium, Windows: C:\\Users\\admin\\AppData\\Local\\Chromium\\Application\\chrome.exe"}
                                             ]
                            }`);
        config_file.push(`[
                                    ["0.0.0.0", "0.0.0.0"],
                                    ["0.0.0.0", "0.0.0.0"]
                          ]`);
        config_file.push(`{"user_agent": [
                                    {"Name": "YahooMailProxy", 
                                    "user_agent": "YahooMailProxy; https://help.yahoo.com/kb/yahoo-mail-proxy-SLN28749.html"},
                                    {"Name": "Let's Encrypt validation", 
                                    "user_agent": "Mozilla/5.0 (compatible; Let's Encrypt validation server; +https://www.letsencrypt.org)"}
                                ]
                          }`);
        config_file.push(`{"directives":
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
                            "configuration": "App Portfolio",
                            "created": "${new Date().toISOString()}",
                            "modified": "${new Date().toISOString()}",
                            "maintenance": 0,
                            "file_config_server":"${slash}config${slash}config.json",
                            "file_config_blockip":"${slash}config${slash}blockip.json",
                            "file_config_useragent":"${slash}config${slash}useragent.json",
                            "file_config_policy":"${slash}config${slash}policy.json",
                            "path_log":"${slash}logs${slash}"
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
            fs.writeFile(global.SERVER_ROOT + global.SERVER_CONFIG_INIT_PATH, config_init,  'utf8');
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
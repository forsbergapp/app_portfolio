const { createLogAppSE } = require(global.SERVER_ROOT + "/service/log/log.controller");

function config_files(){
    return [
        [1, '/config/config.json'],
        [2, process.env.SERVICE_AUTH_ACCESS_CONTROL_IP_PATH],
        [3, process.env.SERVICE_AUTH_ACCESS_CONTROL_USER_AGENT_PATH],
        [4, process.env.SERVICE_AUTH_POLICY_DIRECTIVES] 
      ];
}
module.exports = {
	ConfigGet: (config_no, parameter_name, callBack) => {
        if (parameter_name){
            let parameter_value = eval(`process.env.${parameter_name}`);
            callBack(null, {
                parameter_name:  parameter_name,
                parameter_value : parameter_value
            })
        }
        else{
            let config=[]
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
    ConfigUpdateParameter: (parameter_name, parameter_value, callBack) => {
        eval(` process.env.${parameter_name} = ${parameter_value}`);
        callBack(null, {
                            parameter_name  : parameter_name,
                            parameter_value : eval(`process.env.${parameter_name}`)
                        });
    },
    ConfigSave: (config_server, config_blockip, config_useragent, config_policy, callBack) =>{
        let config=[]
        const {promises: {readFile}} = require("fs");
        const files = config_files();
        Promise.all(files.map(file => {
            switch (file[0]){
                case 1:{
                    if (config_server){
                        writeFile(`${file[1]}.${new Date().toISOString()}`, config_server,  'utf8');
                        writeFile(file[1], config_server,  'utf8');
                    }
                    break;
                }
                case 2:{
                    if (config_blockip){
                        writeFile(`${file[1]}.${new Date().toISOString()}`, config_blockip,  'utf8');
                        writeFile(file[1], config_blockip,  'utf8');
                    }
                    break;
                }
                case 3:{
                    if (config_useragent){
                        writeFile(`${file[1]}.${new Date().toISOString()}`, config_useragent,  'utf8');
                        writeFile(file[1], config_useragent,  'utf8');
                    }
                    break;
                }
                case 4:{
                    if (config_policy){
                        writeFile(file[1] + `.${new Date().toISOString()}`, config_policy,  'utf8');
                        writeFile(file[1], config_policy,  'utf8');
                    }
                    break;
                }
            }
        })).then(function(){
            callBack(null, null);
        })
        .catch(err => {
            createLogAppSE(app_id, __appfilename, __appfunction, __appline, err).then(function(){
                callBack(err, null);
            })
        });       
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
        let config_server = `{  "configuration": "App Portfolio",
                                "created": "${new Date().toISOString()}",
                                "modified": "",
                                "commment":"",
                                "server":[
                                                        {"MAINTENANCE": 0, "COMMENT": ""},
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
                                                        {"ACCESS_CONTROL_IP_PATH": "${slash}config${slash}blockip.json", "COMMENT": ""},
                                                        {"ACCESS_CONTROL_HOST_EXIST": 1, "COMMENT": ""},
                                                        {"ACCESS_CONTROL_ACCESS_FROM": 1, "COMMENT": ""},
                                                        {"ACCESS_CONTROL_USER_AGENT": 0, "COMMENT": "check user agents"},
                                                        {"ACCESS_CONTROL_USER_AGENT_PATH": "${slash}config${slash}safe_user_agent.json", "COMMENT": "contains user agents that you want to allow"},
                                                        {"ACCESS_CONTROL_USER_AGENT_EXIST": 1, "COMMENT": "check if ok to have empty user agent or not"},
                                                        {"ACCESS_CONTROL_ACCEPT_LANGUAGE": 1, "COMMENT": ""},
                                                        {"POLICY_DIRECTIVES": "${slash}config${slash}policy_directives.json", "COMMENT": "Content Security Policy using helmet middleware"},
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
                                                        {"FILE_PATH_SERVER": "${slash}logs${slash}", "COMMENT": "with slash at the end"},
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
                            }`;
        let config_blockip = `[
                                    ["0.0.0.0", "0.0.0.0"],
                                    ["0.0.0.0", "0.0.0.0"]
                              ]`;
        let config_useragent = `{"user_agent": [
                                    {"Name": "YahooMailProxy", 
                                    "user_agent": "YahooMailProxy; https://help.yahoo.com/kb/yahoo-mail-proxy-SLN28749.html"},
                                    {"Name": "Let's Encrypt validation", 
                                    "user_agent": "Mozilla/5.0 (compatible; Let's Encrypt validation server; +https://www.letsencrypt.org)"}
                                ]
                                }`;
        let config_policy = `{"directives":
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
                             }`;
        module.exports.ConfigSave(config_server, config_blockip, config_useragent, config_policy, (err, result)=>{
            if (err)
                callBack(err, null);
            else
                callBack(null, {default_config: 'ok'});
        })
    },
    Info:(callBack)=>{
        callBack(null, null);
    }
};
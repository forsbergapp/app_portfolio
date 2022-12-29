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
let SLASH;
if (process.platform == 'win32')
    SLASH = '\\';
else
    SLASH = '/';
//initial config with file paths and maintenance parameter
let SERVER_CONFIG_INIT_PATH = `${SLASH}config${SLASH}config_init.json`;

function config_files(){
    return [
            [0, SERVER_CONFIG_INIT_PATH],
            [1, JSON.parse(CONFIG_INIT)['FILE_CONFIG_SERVER']],
            [2, JSON.parse(CONFIG_INIT)['FILE_CONFIG_AUTH_BLOCKIP']],
            [3, JSON.parse(CONFIG_INIT)['FILE_CONFIG_AUTH_USERAGENT']],
            [4, JSON.parse(CONFIG_INIT)['FILE_CONFIG_AUTH_POLICY']],
            [5, JSON.parse(CONFIG_INIT)['PATH_LOG']],
            [6, JSON.parse(CONFIG_INIT)['FILE_CONFIG_AUTH_USER']]
           ];
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
        } 
    }
}
async function ConfigExists(){
    return await new Promise(function(resolve){
        let fs = require('fs');
        //load  initial config_init.json file if exists
        //if exists return
        fs.readFile(global.SERVER_ROOT + SERVER_CONFIG_INIT_PATH, (err, result) => {
            if (err)
                resolve(false);
            else{
                CONFIG_INIT = result.toString();
                resolve(true);
            }
        });
    })
}
async function DefaultConfig(){
    return new Promise(function(resolve, reject){
        const { createHash } = require('crypto');			
        function hash(string) {
            return createHash('sha256').update(string).digest('hex');
        }
        async function create_config_dir(){
            return new Promise(function(resolve, reject){
                let fs = require('fs');
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
            const {promises: {readFile}} = require("fs");
            let i = 0;
            //read all default files
            let default_files = [
                                    [1, `default_config.json`],
                                    [2, `default_auth_blockip.json`],
                                    [3, `default_auth_useragent.json`],
                                    [4, `default_auth_policy.json`],
                                    [6, `default_auth_user.json`]
                                ];
            let config_json = [];
            Promise.all(default_files.map(file => {
                return readFile(global.SERVER_ROOT + '/server/' + file[1], 'utf8');
            })).then(function(config_json){
                //update default file for config 1 server
                config_json[0] = JSON.parse(config_json[0]);
                //update path
                config_json[0]['SERVER'].forEach((row,index)=>{
                    for (let i=0; i < Object.keys(row).length;i++){
                        if (Object.keys(row)[i]=='HTTPS_KEY'){
                            config_json[0]['SERVER'][index][Object.keys(row)[i]] = `${SLASH}config${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
                        }
                    } 
                })
                config_json[0]['SERVER'].forEach((row,index)=>{
                    for (let i=0; i < Object.keys(row).length;i++){
                        if (Object.keys(row)[i]=='HTTPS_CERT'){
                            config_json[0]['SERVER'][index][Object.keys(row)[i]] = `${SLASH}config${SLASH}ssl${SLASH}${Object.values(row)[i]}`;
                        }
                    } 
                })
                //generate hash
                config_json[0]['SERVICE_AUTH'].forEach((row,index)=>{
                    for (let i=0; i < Object.keys(row).length;i++){
                        if (Object.keys(row)[i]=='ADMIN_TOKEN_SECRET'){
                            config_json[0]['SERVICE_AUTH'][index][Object.keys(row)[i]] = `${hash(new Date().toISOString())}`;
                        }
                    } 
                })
                config_json[0] = JSON.stringify(config_json[0]);

                config_json[4] = JSON.parse(config_json[4]);
                config_json[4]['created'] = new Date().toISOString();
                config_json[4] = JSON.stringify(config_json[4], undefined, 2);
                //default server metadata
                const fs = require('fs');
                let config_init = {
                                    "CONFIGURATION": "App Portfolio",
                                    "CREATED": `${new Date().toISOString()}`,
                                    "MODIFIED": "",
                                    "MAINTENANCE": "0",
                                    "FILE_CONFIG_SERVER": `${SLASH}config${SLASH}config.json`,
                                    "FILE_CONFIG_AUTH_BLOCKIP":`${SLASH}config${SLASH}auth_blockip.json`,
                                    "FILE_CONFIG_AUTH_USERAGENT":`${SLASH}config${SLASH}auth_useragent.json`,
                                    "FILE_CONFIG_AUTH_POLICY":`${SLASH}config${SLASH}auth_policy.json`,
                                    "PATH_LOG":`${SLASH}logs${SLASH}`,
                                    "FILE_CONFIG_AUTH_USER":`${SLASH}config${SLASH}auth_user.json`
                                    };
                config_init = JSON.stringify(config_init, undefined, 2);
                //save initial config files with metadata including path to config files
                fs.writeFile(global.SERVER_ROOT + SERVER_CONFIG_INIT_PATH, config_init,  'utf8', (err) => {
                    if (err)
                        reject(err);
                    else{
                        //save json in variable
                        CONFIG_INIT = config_init;
                        let config_created=0;
                        for (let config_no=0;config_no<config_json.length;config_no++){
                            let json_pretty = JSON.stringify(JSON.parse(config_json[config_no]), undefined, 2);
                            //send fileno in file array
                            module.exports.ConfigSave(default_files[config_no][0], json_pretty, true, (err, result)=>{
                                if (err)
                                    reject(err);
                                else{
                                    if (config_created== config_json.length - 1)
                                        resolve();
                                    else
                                        config_created++;
                                }
                            })
                        }
                    }
                })
            })
        })
        .catch(function(err) {
            reject(err);
         });  
    })
}
async function InitConfig(){
    return await new Promise(function(resolve, reject){
        async function setVariables(){
            return await new Promise(function(resolve, reject){
                let files = config_files();
                let i=0;                
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
        ConfigExists().then(function(result){
            if (result==true)
                setVariables().then(function(){
                    resolve();
                })
            else{
                DefaultConfig().then(function(){
                    setVariables().then(function(){
                        resolve();
                    })
                })
            }
        })
    })
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
                fs.writeFile(global.SERVER_ROOT + SERVER_CONFIG_INIT_PATH, config_init_json,  'utf8', (err) => {
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
    ConfigSave: (config_no, config_json, first_time, callBack) =>{
        try {
            const fs = require("fs");
            async function write_config(config_no, config_file, config_json){
                return new Promise(function(resolve, reject){
                    //write new config
                    fs.writeFile(global.SERVER_ROOT + config_file, config_json,  'utf8', (err) => {
                        if (err)
                            reject(err);
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
                                case 5:{
                                    CONFIG_USER = config_json;
                                    break;
                                }
                            }
                            resolve();
                        }
                    });
                })
            }
            let config_file;
            if (config_no){
                config_file = config_files().filter(function(file) {
                    return (parseInt(file[0]) == parseInt(config_no));
                })[0][1];
                if (first_time){
                    if (config_no == 1){
                        //add metadata to server config
                        config_json = JSON.parse(config_json);
                        config_json['configuration'] = 'App Portfolio';
                        config_json['comment'] = '';
                        config_json['created'] = new Date().toISOString();
                        config_json['modified'] = '';
                        config_json = JSON.stringify(config_json, undefined, 2);
                    }                
                    write_config(config_no, config_file, config_json).then(function(){
                        callBack(null, null);
                    });
                }
                else{
                    //get old config file
                    fs.readFile(global.SERVER_ROOT + config_file,  'utf8', (err, result_read) => {
                        if (err)
                            callBack(err, null);
                        else{
                            let old_config = result_read.toString();
                            //write backup of old file
                            fs.writeFile(global.SERVER_ROOT + `${config_file}.${new Date().toISOString().replace(new RegExp(':', 'g'),'.')}`, old_config,  'utf8', (err) => {
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
                                    write_config(config_no, config_file, config_json).then(function(){
                                        callBack(null, null);
                                    });
                                }
                            });
                        }
                    });
                }
            }
        } catch (error) {
            createLogAppSE(0, __appfilename, __appfunction, __appline, err).then(function(){
                callBack(err, null);
            })
        }
    },
    CheckFirstTime: ()=>{
        if (JSON.parse(CONFIG_USER)['username']=='')
            return true;
        else
            return false;
    },
    CreateSystemAdmin:(admin_name, admin_password, callBack) =>{
        let fs = require('fs');
        let json = JSON.parse(CONFIG_USER);
        json['username'] = admin_name;
        json['password'] = admin_password;
        json['modified'] = new Date().toISOString();
        json = JSON.stringify(json, undefined, 2);
        fs.writeFile(global.SERVER_ROOT + config_files()[6][1], json,  'utf8', (err) => {
            if (err)
                callBack(err, null);
            else{
                CONFIG_USER = json;
                callBack(null, null);
            }
        })
    },
    ConfigInfo:(callBack)=>{
        callBack(null, null);
    },
    Info:(callBack)=>{
        let os = require('os');
		let os_json = {
                        "hostname": os.hostname(),
                        "platform": os.platform(),
                        "type": os.type(),
                        "release": os.release(),
                        "cpus": os.cpus(),
                        "arch": os.arch(),
                        "freemem": os.freemem(),
                        "totalmem": os.totalmem(),
                        "homedir": os.homedir(),
                        "tmpdir": os.tmpdir(),
                        "uptime": os.uptime(),
                        "userinfo": os.userInfo(),
                        "version": os.version()
                      };
        let process_json = { 
                                "memoryusage_rss" : process.memoryUsage()['rss'],
                                "memoryusage_heaptotal" : process.memoryUsage()['heapTotal'],
                                "memoryusage_heapused" : process.memoryUsage()['heapUsed'],
                                "memoryusage_external" : process.memoryUsage()['external'],
                                "memoryusage_arraybuffers" : process.memoryUsage()['arrayBuffers'],
                                "uptime" : process.uptime(),
                                "version" : process.version
                           }
        callBack(null, {
                        os: os_json,
                        process: process_json
                       });
    }
};
module.exports.ConfigGet = ConfigGet;
module.exports.InitConfig = InitConfig;
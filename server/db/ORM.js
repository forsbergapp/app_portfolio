/** 
 *  Database using race condition, pessimistic lock, constraints and database transaction pattern
 *  Tables implemented using object mapping relation (ORM), PK, UK and FK patterns
 *  See data model for an overview.
 *  
 *  ORM consists of 3 layers
 *  App layer
 *  *.js                app logic, ex iamAuthenticateUser() in /server/iam.js
 *  Object layer
 *  /server/db/*.js     data model API with constraints, ex IamUser() in /server/db/IamUser.js
 *                      returns server response format
 *  Database layer
 *  ORM.js              file management API using async Execute() with file read and write
 *                      and getObject() reading directly from cached object in memory using closure pattern
 *                      getObjectFile is used if to read from file instead of from memory
 *                      manages objects, constraints, transactions with commit and rollback
 *                      returns database result
 *
 *  File types supported, all files are json format
 * 
 *  DOCUMENT        JSON object with any content
 *  TABLE           JSON object with array of records managed as table identified by id and all records have same attributes
 *                  DOCUMENT with any content can be saved in a record using name Document implemented
 *  TABLE_KEY_VALUE JSON object with array of records managed as table identified by app_id and records can have different attributes
 *  TABLE_LOG       JSON object with array of records, does not use cache_content, only admin should read logs
 *                  does not use temporary transaction_content and does not read file on disk and instead uses WritableStream for performance
 *  TABLE_LOG_DATE  same as TABLE_LOG but uses additional filename partition with date implemented as partition
 * 
 *  Admin uses postFsAdmin to create initial object content
 * 
 * @module server/db/ORM
 */

/**
 * @import {server} from '../types.js'
 * @import {Dirent} from 'node:fs'
 */

const {serverProcess} = await import('../info.js');
const {server} = await import('../server.js');
const fs = await import('node:fs');
//Private properties
/**
 * @name #DB
 * @description File database using ORM pattern, is loaded from external file at server start
 * @constant
 * @type{{  data:server['ORM']['MetaData']['DbObject'][], 
 *          external:{  COUNTRY:*, 
 *                      LOCALE:*, 
 *                      GEOLOCATION_IP:*, 
 *                      GEOLOCATION_PLACE:*}}}
 */
const DB = {
                data: [],
                external:{  COUNTRY:null,
                            LOCALE:null,
                            GEOLOCATION_IP:null,
                            GEOLOCATION_PLACE:null
                }};
Object.seal(DB);
        
/**
 * @name #DB_LOG
 * @description File database log writestreams where all logs files are written using fs.createWriteStream and write()
 *              for high performance og logging
 * @constant
 * @type{{path:string,
 *        writeStream:WritableStream}[]}
 */
const DB_LOG = [];
        
/**
 * @name #DB_DIR
 * @description File database paths
 * @constant
 * @type{{db:string, journal:string}}
 */
const DB_DIR = {db:'/data/db/', journal:'/data/db/journal/'};
Object.seal(DB_DIR);

/**
 * @name ORM_class
 * @description ORM class with Dependency Injection pattern
 * @class
 */
class ORM_class {
    /**
     * @description Using Dependency Injection pattern
     * @param {import('../info.js')['serverProcess']}serverProcess
     */
    constructor (serverProcess) {    
        /** 
         * @description Get all imported ORM objects from file system
         *              Using Dependency Injection pattern
         *              Declare variable first and import in InitAsync with await
         * @type {  {App:import('./App.js'),
         *           AppData:import('./AppData.js'),
         *           AppDataEntity:import('./AppDataEntity.js'),
         *           AppDataEntityResource:import('./AppDataEntityResource.js'),
         *           AppDataResourceDetail:import('./AppDataResourceDetail.js'),
         *           AppDataResourceDetailData:import('./AppDataResourceDetailData.js'),
         *           AppDataResourceMaster:import('./AppDataResourceMaster.js'),
         *           AppModule:import('./AppModule.js'),
         *           AppModuleQueue:import('./AppModuleQueue.js'),
         *           AppTranslation:import('./AppTranslation.js'),
         *           ConfigServer:import('./ConfigServer.js'),
         *           IamAppAccess:import('./IamAppAccess.js'),
         *           IamAppIdToken:import('./IamAppIdToken.js'),
         *           IamControlIp:import('./IamControlIp.js'),
         *           IamControlObserve:import('./IamControlObserve.js'),
         *           IamControlUserAgent:import('./IamControlUserAgent.js'),
         *           IamEncryption:import('./IamEncryption.js'),
         *           IamMicroserviceToken:import('./IamMicroserviceToken.js'),
         *           IamUser:import('./IamUser.js'),
         *           IamUserApp:import('./IamUserApp.js'),
         *           IamUserAppDataPost:import('./IamUserAppDataPost.js'),
         *           IamUserAppDataPostLike:import('./IamUserAppDataPostLike.js'),
         *           IamUserAppDataPostView:import('./IamUserAppDataPostView.js'),
         *           IamUserEvent:import('./IamUserEvent.js'),
         *           IamUserFollow:import('./IamUserFollow.js'),
         *           IamUserLike:import('./IamUserLike.js'),
         *           IamUserView:import('./IamUserView.js'),
         *           Log:import('./Log.js'),
         *           MessageQueueConsume:import('./MessageQueueConsume.js'),
         *           MessageQueueError:import('./MessageQueueError.js'),
         *           MessageQueuePublish:import('./MessageQueuePublish.js'),
         *           OpenApi:import('./OpenApi.js'),
         *           ServiceRegistry:import('./ServiceRegistry.js')}}
         */
        this.db;
        this.init = this.InitAsync;
        this.serverProcess = serverProcess;
    }
    /**
     * @name InitAsync
     * @description Load default database or read existing from disk. Set cache for files in existing database using `cache_content` key to increase performance
     *              Can only be ecxecuted once after ORM objects are loaded and sealed
     * @method
     * @returns {Promise.<void>}
     */
    InitAsync = async () => {
        if (this.db && Object.keys(this.db).length>0){
            throw server.iam.iamUtilMessageNotAuthorized();
        }
        else{
            this.db = {
                        App:await import('./App.js'),
                        AppData:await import('./AppData.js'),
                        AppDataEntity:await import('./AppDataEntity.js'),
                        AppDataEntityResource:await import('./AppDataEntityResource.js'),
                        AppDataResourceDetail:await import('./AppDataResourceDetail.js'),
                        AppDataResourceDetailData:await import('./AppDataResourceDetailData.js'),
                        AppDataResourceMaster:await import('./AppDataResourceMaster.js'),
                        AppModule:await import('./AppModule.js'),
                        AppModuleQueue:await import('./AppModuleQueue.js'),
                        AppTranslation:await import('./AppTranslation.js'),
                        ConfigServer:await import('./ConfigServer.js'),
                        IamAppAccess:await import('./IamAppAccess.js'),
                        IamAppIdToken:await import('./IamAppIdToken.js'),
                        IamControlIp:await import('./IamControlIp.js'),
                        IamControlObserve:await import('./IamControlObserve.js'),
                        IamControlUserAgent:await import('./IamControlUserAgent.js'),
                        IamEncryption:await import('./IamEncryption.js'),
                        IamMicroserviceToken:await import('./IamMicroserviceToken.js'),
                        IamUser:await import('./IamUser.js'),
                        IamUserApp:await import('./IamUserApp.js'),
                        IamUserAppDataPost:await import('./IamUserAppDataPost.js'),
                        IamUserAppDataPostLike:await import('./IamUserAppDataPostLike.js'),
                        IamUserAppDataPostView:await import('./IamUserAppDataPostView.js'),
                        IamUserEvent:await import('./IamUserEvent.js'),
                        IamUserFollow:await import('./IamUserFollow.js'),
                        IamUserLike:await import('./IamUserLike.js'),
                        IamUserView:await import('./IamUserView.js'),
                        Log:await import('./Log.js'),
                        MessageQueueConsume:await import('./MessageQueueConsume.js'),
                        MessageQueueError:await import('./MessageQueueError.js'),
                        MessageQueuePublish:await import('./MessageQueuePublish.js'),
                        OpenApi:await import('./OpenApi.js'),
                        ServiceRegistry:await import('./ServiceRegistry.js')
             }
            Object.seal(this.db);

            const result_data = await this.getFsDataExists();
            if (result_data==false){
                //first time , create default config for microservice and DbObjects
                await server.installation.postConfigDefault();
                //first time, insert default data
                await server.installation.postDataDefault();
            
            }    
            DB.data = await this.getFsDbObject();

            //cache file content in db
            for (const file_db_record of DB.data){
                if ('CacheContent' in file_db_record &&
                    file_db_record.InMemory==false
                ){
                    const file = await this.getFsFile(DB_DIR.db + file_db_record.Name + '.json', file_db_record.Type);
                    file_db_record.CacheContent = file?file:null;
                }
            }
            DB.external = {
                        COUNTRY:		    await this.postExternal('COUNTRY'),
                        LOCALE: 		    await this.postExternal('LOCALE'),
                        GEOLOCATION_IP:     await this.postExternal('GEOLOCATION_IP'),
                        GEOLOCATION_PLACE:  await this.postExternal('GEOLOCATION_PLACE')
                };
        }
    };
    
    /**
     * @name formatContent
     * @description Formats content
     * @method
     * @param {server['ORM']['MetaData']['DbObject']['Type']} object_type
     * @param {*} content
     * @returns {string}
     */
    formatContent = (object_type, content) =>
        object_type.startsWith('TABLE_LOG')?
            //log object, save JSON rows with ',' at the end
            '\n' + content.map((/**@type{*}*/row)=>JSON.stringify(row)).join(',\n') + ',':
                object_type== 'TABLE'?
                    //table, save records in new row and compact format
                    '[\n' + content.map((/**@type{*}*/row)=>JSON.stringify(row)).join(',\n') + '\n]':
                        //not a table, convert to string
                            JSON.stringify(content, undefined, 2);
    /**
     * @name getObjectRecord
     * @description Get file record from file db, uses default not immutable
     *              if record can be updated or no update in calling function using local variable for performance.
     * @method
     * @param {server['ORM']['MetaData']['DbObject']['Name']} object 
     * @param {boolean}  immutable
     * @returns {server['ORM']['MetaData']['DbObject']}
     */
    getObjectRecord = (object, immutable=false) =>immutable?
                                                        JSON.parse(JSON.stringify(DB.data.filter(file_db=>file_db.Name == object)[0])):
                                                            DB.data.filter(file_db=>file_db.Name == object)[0];

    /**
     * @name fileTransactionStart
     * @description Start transaction
     *              Using race condition, pessmistic lock and database transaction pattern
     *              Uses setTimeout loop until lock is available and waits maximum 10 seconds for lock
     *              Reads and sets `transaction_id`, `transaction_content` and `lock` key in DB 
     *              `transaction_content` is used to rollback info if something goes wrong and can also be used for debugging purpose
     * @method
     * @param {server['ORM']['MetaData']['DbObject']['Name']} object 
     * @param {string} filepath
     * @returns {Promise.<{transaction_id:number, transaction_content:*}>}
     */
    fileTransactionStart = async (object, filepath)=>{
        const record = DB.data.filter(file_db=>file_db.Name == object)[0];
        const transaction = async ()=>{
            const transaction_id = Date.now();
            record.TransactionId = transaction_id;
            record.TransactionContent = record.Type.startsWith('TABLE_LOG')?
                                                    null:
                                                        record.InMemory?
                                                            JSON.parse(record.Content?? (record.Type.startsWith('TABLE')?'[]':'{}')):
                                                                await this.getFsFile(filepath,record.Type);
            return {transaction_id:transaction_id,
                    transaction_content:record.TransactionContent
            };
        };
        return new Promise((resolve, reject)=>{
            if  (record.Lock==0){
                record.Lock = 1;
                //add 1ms wait so transaction_id will be guaranteed unique on a fast server
                setTimeout(()=>{
                    transaction().then((result)=>resolve(result)); 
                    }, 1);
            }
            else{
                let tries = 0;
                const lock = () =>{
                    tries++;
                    if (tries > 10000)
                        reject ('timeout');
                    else
                        if (record.Lock==0){
                            record.Lock = 1;
                            transaction().then((result)=>resolve(result)); 
                        }
                        else
                            setTimeout(()=>{lock(), 1;});
                };
                lock();
            }
        });
    };

    /**
     * @name commit
     * @description Transaction commit
     *              Empties `transaction_id` and `TransactionContent`, sets `Lock =0` and updates CacheContent if used
     * @method
     * @param {server['ORM']['MetaData']['DbObject']['Name']} object 
     * @param {number} transaction_id 
     * @param {*} [cache_content]
     * @returns {boolean}
     */
    commit = (object, transaction_id, cache_content=null)=>{
        const record = DB.data.filter(file_db=>file_db.Name == object)[0];
        if (record.TransactionId==transaction_id){
            if (cache_content)
                record.CacheContent = cache_content;
            record.Lock = 0;
            record.TransactionId = null;
            record.TransactionContent = null;
            return true;
        }
        else
            return false;
    };
    /**
     * @name rollback
     * @description Transaction rollback
     *              Empties `transaction_id` and `TransactionContent`, sets `Lock =0` and updates CacheContent if used
     * @method
     * @param {server['ORM']['MetaData']['DbObject']['Name']} object 
     * @param {number} transaction_id 
     * @returns {boolean}
     */
    rollback = (object, transaction_id)=>{
        const record = DB.data.filter(file_db=>file_db.Name == object)[0];
        if (record.TransactionId==transaction_id){
            record.Lock = 0;
            record.TransactionId = null;
            record.TransactionContent = null;
            return true;
        }
        else
            return false;
    };

    /**
     * @name fileNamePartition
     * @description Get given partition or current day partition using YYYYMMDD or YYYYMM format
     * @method
     * @param {string|null} partition
     * @returns 
     */
    fileNamePartition = (partition=null) =>{
        let file_partition = '';
        if (partition)
            file_partition = `${partition}`;
        else{
            const config_file_interval = this.getObject(0,'ConfigServer')['SERVICE_LOG']
                                        .filter((/**@type{server['ORM']['Object']['ConfigServer']['SERVICE_LOG']}*/row)=>'FILE_INTERVAL' in row)[0].FILE_INTERVAL;
            const year = new Date().toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric'});
            const month = new Date().toLocaleString('en-US', { timeZone: 'UTC', month: '2-digit'});
            const day   = new Date().toLocaleString('en-US', { timeZone: 'UTC', day: '2-digit'});
            switch (config_file_interval=='1D'?'YYYYMMDD':'YYYYMM'){
                case 'YYYYMMDD':{
                    file_partition = `${year}${month}${day}`;
                    break;
                }
                case 'YYYYMM':{
                    file_partition = `${year}${month}`;
                    break;
                }
                default:{
                    break;
                }
            }
        }
        return file_partition;
    };
    /**
     * @name getFsDir
     * @description Get files from directory
     * @method
     * @returns {Promise.<Dirent[]>}
     */
    getFsDir = async () => await fs.promises.readdir(`${this.serverProcess.cwd()}${DB_DIR.db}`,{ withFileTypes: true });

    /**
     * @name getFsFile
     * @description Get parsed file for given filepath
     * @method
     * @param {string} filepath
     * @param {server['ORM']['MetaData']['DbObject']['Type']|null} [object_type]
     * @returns {Promise.<*>}
     */
    getFsFile = async (filepath, object_type=null) => fs.promises.readFile(this.serverProcess.cwd() + filepath, 'utf8')
    .then(result=>
        JSON.parse(result==''?
                        (object_type?.startsWith('TABLE')?'[]':
                            '{}'):
                                //logs save as JSON records 
                                object_type?.startsWith('TABLE_LOG')?
                                    //remove last ','
                                    '[' + result.substring(0,result.length-1) + ']':
                                        result)
    )
    .catch(()=>JSON.parse(object_type?.startsWith('TABLE')?'[]':'{}'));
    /**
     * @name getFsDataExists
     * @description Checks if /data directory is created
     * @method
     * @returns {Promise<boolean>}
     */
    getFsDataExists = async () => {    
        try {
            await fs.promises.access(this.serverProcess.cwd() + '/data');
            return true;
        } catch (error) {
            return false;
        }
    };
    /**
     * @name getFsDbObject
     * @description Get DbObjects file content
     * @method
     * @returns {Promise.<server['ORM']['MetaData']['DbObject'][]>}
     */
    getFsDbObject = async () => this.getFsFile(DB_DIR.db + 'DbObjects.json');

    /**
     * @name updateFsFile
     * @description Writes file
     *              Must specify valid transaction id to be able to update a file
     *              Backup of old file will be written to journal directory
     * @method
     * @param {server['ORM']['MetaData']['DbObject']['Name']} object
     * @param {number|null} transaction_id 
     * @param {[]} file_content 
     * @param {string|null} filepath
     * @returns {Promise.<void>}
     */
    updateFsFile = async (object, transaction_id, file_content, filepath=null) =>{  
        const record = this.getObjectRecord(object);
        if (record.InMemory==true)
            record.Content = this.formatContent(record.Type, file_content);
        else
            if (!transaction_id || record.TransactionId != transaction_id){
                throw server.iam.iamUtilMessageNotAuthorized();
            }
            else{
                if (['TABLE', 'TABLE_KEY_VALUE', 'DOCUMENT'].includes(record.Type) && this.getObject(0,'ConfigServer').SERVICE_DB.filter((/**@type{*}*/key)=>'JOURNAL' in key)[0]?.JOURNAL=='1'){
                    //write to journal using format [Date.now()].[ISO Date string].[object].json
                    await this.postFsFile(`${DB_DIR.journal}${Date.now()}.${new Date().toISOString().replace(new RegExp(':', 'g'),'.')}.${object}.json`, file_content, record.Type);
                }
                //write new file content
                await this.postFsFile(filepath ?? (DB_DIR.db + object + '.json'), file_content, record.Type);
            }
    };

    /**
     * @name postFsFile
     * @description Write to a file
     * @method
     * @param {string} path
     * @param {*} content
     * @param {server['ORM']['MetaData']['DbObject']['Type']} object_type
     * @returns{Promise.<void>}
     */
    postFsFile = async (path, content, object_type) => {
        if (['TABLE_LOG', 'TABLE_LOG_DATE'].includes(object_type)){
            if (DB_LOG.filter(row=>row.path==path).length==0){
                //add new write stream with append
                DB_LOG.push({  path:path, 
                                    /**@ts-ignore */
                                    writeStream:fs.createWriteStream(this.serverProcess.cwd() + path, { flags: 'a' })});    
                
            }
            DB_LOG.filter(row=>row.path==path)[0].writeStream
                                                        /**@ts-ignore */
                                                        .write(this.formatContent(object_type, [content]));    
        }
        else
            await fs.promises.writeFile(this.serverProcess.cwd() + path, this.formatContent(object_type, content),'utf8');
    };

    /**
     * @name postFsDir
     * @description Created directories and should be used only when server is started first time
     * @method
     * @param {string[]} paths
     * @returns{Promise.<void>}
     */
    postFsDir = async paths => {
        const mkdir = async (/**@type{string} */dir) =>{
            await fs.promises.mkdir(this.serverProcess.cwd() + dir)
            .catch((error)=>{
                throw error;
            });
        };
        for (const dir of paths){
            await fs.promises.access(this.serverProcess.cwd() + dir)
            .catch(()=>{
                mkdir(dir);  
            });
        }
    };

    /**
     * @name postFsAdmin
     * @description Write to a file in database used in first time installation
     * @method
     * @param {server['ORM']['MetaData']['AllObjects']} object
     * @param {{}} file_content 
     * @param {server['ORM']['MetaData']['DbObject']['Type']} object_type
     * @returns {Promise.<void>}
     */
    postFsAdmin = async (object, file_content, object_type) =>{
        await this.postFsFile(DB_DIR.db + object + '.json', file_content, object_type);
    };

    /**
     * @name postAdmin
     * @description Add table content for memory only table used at server start
     * @method
     * @param {server['ORM']['MetaData']['DbObject']['Name']} object
     * @param {{}} data
     * @returns {Promise.<void>}
     */
    postAdmin = async (object, data) =>{
        const record = this.getObjectRecord(object);
        if (record.InMemory){
            record.CacheContent = data;
            record.Content = this.formatContent(record.Type,data);
        }
        else
            throw this.getError(0, 401);    
    };

    /**
     * @name lockObject
     * @description Locks object in DB
     * @method
     * @param {number} app_id
     * @param {server['ORM']['MetaData']['DbObject']['Name']} object
     * @param {string |null} filepath_partition
     * @returns {Promise.<server['ORM']['MetaData']['result_fileFsRead']>}
     */
    lockObject = async (app_id, object, filepath_partition=null) =>{
        const filepath = filepath_partition ?? (DB_DIR.db + object + '.json');
        const {transaction_id, transaction_content} = await this.fileTransactionStart(object, filepath);
        return {    FileContent:    transaction_content,
                    Lock:           true,
                    TransactionId: transaction_id};
    };

    /**
     * @name getObject
     * @description Gets a record or records in a TABLE from memory only for performance
     *              for given app id and if resource id if specified
     *              TABLE should have column id or app_id as primary key using this function
     *              Uses JSON.stringify and JSON.parse to copy records from DB variable
     *              
     * @method
     * @param {number} app_id
     * @param {server['ORM']['MetaData']['DbObject']['Name']} object
     * @param {number|null} [resource_id]
     * @param {number|null} [data_app_id]
     * @returns {*}
     */
    getObject = (app_id, object, resource_id, data_app_id) =>{
        try {
            //fetch record with already removed object reference
            const record = this.getObjectRecord(object, true);
            switch(record.Type){
                case 'TABLE':
                case 'TABLE_KEY_VALUE':{
                    /**@type{{Id:number, AppId:number}[]} */
                    const records = record.CacheContent
                                    //All tables have Id or AppId or both
                                    .filter((/**@type{*}*/row)=> row.Id ==(resource_id ?? row.Id) && row.AppId == (data_app_id ?? row.AppId))
                                    .map((/**@type{*}*/row)=>{
                                        if ('Document' in row)
                                            return {...row,
                                                    ...{...row.Document}
                                            };
                                        else
                                            return row;
                                    });
                    //log in background without waiting if db log is enabled
                    this.db.Log.post({   app_id:app_id, 
                                                data:{  object:'LogDbInfo', 
                                                        
                                                        db:{Object:object,
                                                            Dml:'GET', 
                                                            Parameters:{resource_id:resource_id, data_app_id:data_app_id}
                                                            }, 
                                                        log:records
                                                    }
                                                });
                    if (records.length>0 || resource_id==null)
                        return {result:records, type:'JSON'};
                    else
                        return ORM.getError(app_id, 404);
                }
                case 'DOCUMENT':
                    return record.CacheContent;
                default:
                    return ORM.getError(app_id, 404);
            }
        } catch (error) {
            return {result:[], type:'JSON'};
        }  
    };
    /**
     * @name getObjectFile
     * @description Returns file content for given file
     *              Microservice uses this function to read table content from file since DB is only loaded in main server
     *              if object type starts with TABLE: filter resource id in rows 
     *              if object type TABLE_LOG and TABLE_LOG_DATE: uses partition 
     *              else returns document
     * @method
     * @param {number} app_id
     * @param {server['ORM']['MetaData']['DbObject']['Name']} object
     * @param {number|null} resource_id
     * @param {string|null} partition
     * @returns {Promise.<{rows:*[]|{}}>}
     */
    getObjectFile = async (app_id, object, resource_id, partition) =>{
        const record = (await this.getFsDbObject()).filter(row=>row.Name==object)[0];
        if (record.InMemory==true)
            if (record.Type.startsWith('TABLE'))
                return this.getObject(app_id, object, resource_id, null);
            else
                return this.getObject(app_id, object, null, null);
        else
            if (record.Type.startsWith('TABLE')){
                const filepath = record.Type.startsWith('TABLE_LOG')?
                                    DB_DIR.db + `${object}_${this.fileNamePartition(partition)}.json`:
                                        DB_DIR.db + `${object}.json`;
                /**@type{{Id:number, AppId:number}[]} */
                const file = await this.getFsFile(filepath, record.Type);
                if (record.Type=='TABLE_KEY_VALUE')
                    return {rows:file.filter(row=>row.AppId == (resource_id??row.AppId))};
                else
                    return {rows:file.filter(row=>row.Id == (resource_id??row.Id))};    
            }
            else
                return await this.getFsFile(DB_DIR.db + object + '.json', record.Type);
    };
    /**
     * @name getData
     * @description Extract transform load
     * @param {'COUNTRY'|'LOCALE'|'GEOLOCATION_IP'|'GEOLOCATION_PLACE'} object
     * @returns {*}
     */
    getExternal = object =>DB.external[object];
    
    /**
     * @name getDataKeys
     * @description Get keys of object
     * @param {'COUNTRY'|'LOCALE'|'GEOLOCATION_IP'|'GEOLOCATION_PLACE'} object
     * @param {string} key
     * @returns {*}
     */
    getExternalKey = (object,key) =>  DB.external[object][key];
    
    /**
     * @name getDataKeys
     * @description Get keys of object
     * @param {'COUNTRY'|'LOCALE'|'GEOLOCATION_IP'|'GEOLOCATION_PLACE'} object
     * @returns {Object.<string,*>}
     */
    getExternalKeys = object => Object.keys(DB.external[object]);
    

    /**
     * @name constraintsValidate
     * @description Validates:
     *              PK constraint that can have one primary key column
     *              UK constraint that can have several columns
     *              FK constraint that should have a value in referref column and object, checked for TABLE and TABLE_KEY_VALUE
     *              Implements contraints pattern using some() function for best performane to check if value already exist
     * @method
     * @param {server['ORM']['MetaData']['DbObject']['Name']} table
     * @param {[]} table_rows
     * @param {*} data
     * @param {'UPDATE'|'POST'} dml
     * @param {number|null} [resource_id]
     * @returns {boolean}
     */
    constraintsValidate = (table, table_rows, data, dml, resource_id) =>{
        const filerecord = this.getObjectRecord(table);
        //check PK for POST
        //update of PK not alllowed
        if (dml=='POST' && filerecord.Pk && table_rows.some((/**@type{server['ORM']['MetaData']['DbObject']}*/record)=>
            /**@ts-ignore */
            record[filerecord.Pk]==data[filerecord.Pk]))
                return false;
        else{
            //check UK for POST
            //no record can exist having given values for POST
            if (dml=='POST' && filerecord.Uk && table_rows.some((/**@type{server['ORM']['MetaData']['DbObject']}*/record)=>
                //ignore empty value
                /**@ts-ignore */
                filerecord.Uk?.filter(column=>record[column] && record[column]==data[column]).length==filerecord.Uk?.length))
                    return false;
            else
                //check UK for UPDATE
                //max one record can exist having given values for UPDATE
                if (dml=='UPDATE' && filerecord.Uk && table_rows.some((/**@type{server['ORM']['MetaData']['DbObject']}*/record)=>
                    //check value is the same, ignore empty UK
                    /**@ts-ignore */
                    filerecord.Uk.filter(column=>record[column] && record[column]==data[column]).length==filerecord.Uk.length &&
                    //check it is NOT the same user
                    /**@ts-ignore */
                    record[filerecord.Pk]!=resource_id))
                        return false;
                else
                    //check FK for POST and UPDATE
                    //for TABLE and TABLE_KEY_VALUE objects for data that should be updated
                    //check if there is a key that does not exists in the referred object in a row in cache_content
                    //ignore empty fk
                    if (	(filerecord.Type=='TABLE'|| filerecord.Type=='TABLE_KEY_VALUE') &&
                            (filerecord.Fk??[])
                                .filter(fk=>
                                    fk[0] in data && data[fk[0]]
                                )
                                .filter(fk=>
                                    DB.data
                                    .filter(object=>
                                        object.Name == fk[2]
                                    )[0].CacheContent
                                    .some((/**@type{*}*/row)=> 
                                        data[fk[0]] && row[fk[1]]==data[fk[0]]
                                    )
                                ).length!=(filerecord.Fk??[]).filter(fk=>fk[0] in data && data[fk[0]]).length
                            )
                        return false;
                    else
                        return true;
        }
    };
    /**
     * @name postObject
     * @description Creates a record in a TABLE
     *              and returns the record
     * @method
     * @param {number} app_id
     * @param {server['ORM']['MetaData']['DbObject']['Name']} object
     * @param {*} data
     * @returns {Promise.<server['ORM']['MetaData']['common_result_insert']>}
     */
    postObject = async (app_id, object, data) =>{
        if (app_id!=null){
            const record = this.getObjectRecord(object);
            if (record.Type.startsWith('TABLE')){
                const filepath = record.Type=='TABLE'?`${DB_DIR.db}${object}.json`:`${DB_DIR.db}${object}_${this.fileNamePartition()}.json`;
                const file = await this.lockObject(app_id, object, record.Type=='TABLE'?null:filepath);
                if ((record.Type !='TABLE' || (record.Type =='TABLE'  && this.constraintsValidate(object, 
                    /**@ts-ignore */
                    file.FileContent, 
                    data, 'POST')))){
                        /**@ts-ignore */
                        const update_data = record.Type =='TABLE'?(record.TransactionContent?? []).concat(data):data;
                        await this.updateFsFile(object, 
                                                file.TransactionId, 
                                                update_data,
                                                record.Type=='TABLE'?null:filepath)
                        .catch(()=>{
                            this.rollback(  object, 
                                            /*@ts-ignore*/
                                            file.TransactionId);
                        });
                        //commit and update cache for TABLE
                        if (this.commit(object, 
                                        /*@ts-ignore*/
                                        file.TransactionId,
                                        record.Type=='TABLE'?update_data:null))
                            return {AffectedRows:1};
                        else{
                            throw server.iam.iamUtilMessageNotAuthorized();
                        }
                }
                else{
                    this.rollback(object, 
                        /*@ts-ignore*/
                        file.TransactionId);
                    return {AffectedRows:0};
                }
            }
            else{
                //no post on documents
                return {AffectedRows:0};
            }
        }
        else{
            return {AffectedRows:0};
        }
    };
    /**
     * @name postData
     * @description Extract transform load
     * @method
     * @param {'COUNTRY'|'LOCALE'|'GEOLOCATION_IP'|'GEOLOCATION_PLACE'} object
     */
    postExternal = async object =>{
        const BASE_DIR = '/server/db/external/';
        /**
         * @param {string} dir
         * @param {boolean} directory
         */
        const getDir = async (dir, directory) =>
            fs.promises.readdir(`${serverProcess.cwd()}${dir}`,{ withFileTypes: true })
                .then(result=>
                    result
                    .filter(row=>row.isDirectory()==directory)
                    .map((file, index)=>{
                                        return {id: index, 
                                                filename:file.name
                                                };
                                        })
                );
        /**
         * @param {string} dir
         * @param {string} file
         */
        const getFile = async (dir, file) =>
            fs.promises.readFile(   (serverProcess.cwd() + `${dir}/${file}`).replaceAll('\\','/'),
                                    'utf8').then(file=>file.toString());
        
        /**
         * @param {string} fileType
         * @returns {Promise.<Object.<string,string[]>>}
         */
        const loadGeolocation = async fileType =>{
            const dir = BASE_DIR + '/geolocation';
                /**@type{Object.<string,string[]>} */
                const data = {};
                for (const file of (await getDir(dir, false))){
                    if (file.filename.startsWith(fileType.toLowerCase()+'_')){
                        const partition =   file.filename
                                            .replace(fileType.toLowerCase()+'_','')
                                            .replace('.csv','');
                        data[partition] = (await getFile(dir , file.filename)).split('\n');
                    }
                }
                return data;
    
        };
        switch (object){
            case 'COUNTRY':{
                //read data directories into variable
                //array with object keys locales
                const records = [];
                const dir = BASE_DIR + '/country-list/data';
                for (const file of (await getDir(dir, true))){
                    records.push({  locale:file.filename,
                                    countries:JSON.parse(await getFile(dir + '/' + file.filename, 'country.json'))
                                });
                }
                return records;
            }
            case 'LOCALE':{
                //read data directories into variable
                //array with object keys locales
                const records = [];
                const dir = BASE_DIR + '/locale-list/data';
                for (const file of (await getDir(dir, true))){
                    records.push({  locale:file.filename,
                                    locales:JSON.parse(await getFile(dir + '/' + file.filename, 'locales.json'))
                                });
                }
                return records;
            }
            case 'GEOLOCATION_IP':{
                /**
                 *  File content:
                 *  ip_start
                 *      First IP v4 address in the block	
                 *  ip_end
                 *      Last IP v4 address in the block	
                 *  latitude
                 *      Decimal latitude	
                 *  longitude
                 *      Decimal longitude
                 * 
                 * Uses partition with arrays to speed up searches
                 */
                return server.ORM.UtilNumberValue(server.ORM.db.ConfigServer.get({app_id:0,data:{ config_group:'SERVICE_IAM'}}).result
                        .filter((/**@type{server['ORM']['Object']['ConfigServer']['SERVICE_IAM']}*/parameter)=>
                                'ENABLE_GEOLOCATION' in parameter)[0].ENABLE_GEOLOCATION)==1?
                        await loadGeolocation(object):
                            null;
            }
            case 'GEOLOCATION_PLACE':{
                /**
                 *  File content:
                 *  country
                 *      ISO 3166-1 alpha-2 country code	
                 *  stateprov
                 *      State or Province name	
                 *  city
                 *      City name	
                 *  latitude
                 *      Decimal latitude	
                 *  longitude
                 *      Decimal longitude	
                 * 
                 * Uses partition with arrays to speed up searches
                 */
                return await loadGeolocation(object);
            }
        }
    };
    /**
     * @name updateObject
     * @description Updates a record in a TABLE
     *              with given values in given columns in data parameter
     *              and returns updated record
     *              TABLE should have column id as primary key using this function
     * @method
     * @param {number} app_id
     * @param {server['ORM']['MetaData']['DbObject']['Name']} object
     * @param {number|null} resource_id
     * @param {number|null} data_app_id
     * @param {*} data
     * @returns {Promise<server['ORM']['MetaData']['common_result_update']>}
     */
    updateObject = async (app_id, object, resource_id, data_app_id, data) =>{    
        if (app_id!=null){
            const object_type = this.getObjectRecord(object).Type;
            if (object_type == 'TABLE_LOG' || object_type == 'TABLE_LOG_DATE'){
                //no update of log tables
                return {AffectedRows:0};
            }
            else{
                /**@type{server['ORM']['MetaData']['result_fileFsRead']} */
                const file = await this.lockObject(app_id, object);
                if (['TABLE','TABLE_KEY_VALUE'].includes(object_type)){
                    if (this.constraintsValidate(object, file.FileContent, data, 'UPDATE', resource_id)){
                        let update = false;
                        let count = 0;
                        for (const index in file.FileContent)
                            //a TABLE must have Id or AppId as PK to be able to update
                            if ((file.FileContent[index].Id==resource_id && resource_id!=null)|| (file.FileContent[index].AppId == data_app_id && data_app_id != null)){
                                count++;
                                //update columns requested
                                for (const key of Object.entries(data)){
                                    update = true;
                                    file.FileContent[index][key[0]] = key[1];
                                }
                            }
                        if (update){
                            await this.updateFsFile(object, file.TransactionId, file.FileContent)
                                    .catch(()=>this.rollback(object, 
                                                        /**@ts-ignore */
                                                        file.TransactionId));
                            //commit and update cache for TABLE
                            if (this.commit( object,
                                        /**@ts-ignore */
                                        file.TransactionId,
                                        file.FileContent))
                                return {AffectedRows:count};
                            else{
                                throw server.iam.iamUtilMessageNotAuthorized();
                            }
                        }
                        else
                            return {AffectedRows:0};
                    }
                    else{
                        this.rollback(object,
                                                /*@ts-ignore*/
                                                file.TransactionId);
                        return {AffectedRows:0};
                    }
                }
                else{
                    //document
                    await this.updateFsFile(object, file.TransactionId, data)
                    .catch(()=>this.rollback(object, 
                                            /**@ts-ignore */
                                            file.TransactionId));
                    //commit and update cache for DOCUMENT
                    if (this.commit(  object, 
                                                /*@ts-ignore*/
                                                file.TransactionId, 
                                                data))
                        return {AffectedRows:1};
                    else{
                        throw server.iam.iamUtilMessageNotAuthorized();
                    }
                }
            }
        }
        else
            return {AffectedRows:0};
    };
    /**
     * @name deleteObject
     * @description Deletes a record in a TABLE
     *              for given resource id and app id
     *              TABLE should have column id as primary key using this function
     * @method
     * @param {number} app_id
     * @param {server['ORM']['MetaData']['DbObject']['Name']} table
     * @param {number|null} resource_id
     * @param {number|null} data_app_id
     * @returns {Promise<server['ORM']['MetaData']['common_result_delete']>}
     */
    deleteObject = async (app_id, table, resource_id, data_app_id) =>{
        /**
         * @param {server['ORM']['MetaData']['result_fileFsRead']} file
         * @param {server['ORM']['MetaData']['DbObject']['Name']} name 
         * @param {*} new_content 
         * @returns 
         */
        const saveChanges = async (file, name, new_content) =>{
            await this.updateFsFile(  name, file.TransactionId, new_content)
                    .catch(()=> this.rollback(name, 
                                        /**@ts-ignore */
                                        file.TransactionId));
                    //commit and update cache without removed record
                    if (this.commit(  name, 
                                                /*@ts-ignore*/
                                                file.TransactionId,
                                                new_content))
                        return {AffectedRows:   file.FileContent.length - new_content.length};
                    else{
                        throw server.iam.iamUtilMessageNotAuthorized();
                    }
        }
        /**
         * @param {{app_id:number,
         *		    object:server['ORM']['MetaData']['DbObject']['Name'],
        *		    pk:number|null}} parameters
        */
        const cascadeDelete = async parameters =>{
            //find referring to object
            for (const objectCascade of DB.data.filter(object=>
                                    (object.Type=='TABLE'||object.Type=='TABLE_KEY_VALUE') && 
                                    (object.Fk??[])
                                    .filter(fk=>
                                        fk[2]==parameters.object
                                    ).length>0
                                    )){
                //remove all rows with FK referring to current PK
                for (const row of (objectCascade.CacheContent??[])
                                    .filter((/**@type{*[]}*/row)=>
                                        (objectCascade.Fk??[]).filter(fk=>
                                                /**@ts-ignore */
                                                row[fk[0]]==parameters.pk
                                            ).length>0
                                    )){
                    //recursive call delete all rows in objects with FK referring to this row
                    await cascadeDelete({   app_id:app_id, 
                                            object:objectCascade.Name,
                                            /**@ts-ignore */
                                            pk:row[objectCascade.Pk]});
                    const file = await this.lockObject(app_id, objectCascade.Name);
                    //get content to update and filter PK
                    const new_content = file.FileContent
                                        .filter((/**@type{*}*/rowFile)=>
                                            (objectCascade.Fk??[])
                                            .filter(fk=>
                                                rowFile[fk[0]]==parameters.pk
                                            ).length==0
                                        );
                    await saveChanges(file, objectCascade.Name, new_content);
                }
            }
        };

        /**@type{server['ORM']['MetaData']['result_fileFsRead']} */
        const file = await this.lockObject(app_id, table);
        if (file.FileContent.filter((/**@type{*}*/row)=>(data_app_id==null && row.Id==resource_id && resource_id!=null)|| (resource_id==null && row.AppId == data_app_id && data_app_id != null)).length>0){
            await cascadeDelete({app_id:app_id, object:table, pk:resource_id??data_app_id})
                    .catch(()=>{
                        null;
                    });
            //get content to update and filter unique id
            const new_content = file.FileContent
                                .filter((/**@type{*}*/row)=>
                                    (   data_app_id==null && 
                                        resource_id!=null && 
                                        row.Id!=resource_id) || 
                                    (resource_id==null && data_app_id!=null && row.AppId!=data_app_id));
            return await saveChanges(file, table, new_content);
            
        }
        else
            return {AffectedRows:0};    
    };
    /**
     * @name Execute
     * @description Execute a db statement
     *              TABLE that saves record uses resource_id as PK with all records using same columns
     *              TABLE_KEY_VALUE that saves key values uses app_id as PK and can have different keys
     * @method
     * @param {{app_id:number,
     *          dml:'GET'|'UPDATE'|'POST'|'DELETE',
     *          object:server['ORM']['MetaData']['DbObject']['Name'],
     *          get?:{resource_id:number|null, partition:string|null},
     *          update?: {resource_id:number|null, data_app_id:number|null, data:*},
     *          post?:   {data:*},
     *          delete?: {resource_id:number|null, data_app_id:number|null}
     *          }} parameters
     * @returns {Promise<*>}
     */
    Execute = async parameters =>{
        try{
            if (parameters.dml!='GET' && parameters.dml!='UPDATE' && parameters.dml!='POST' && parameters.dml!='DELETE')
            {
                throw server.iam.iamUtilMessageNotAuthorized();
            }
            else{
                const result =  parameters.dml=='GET'?  await this.getObjectFile(   parameters.app_id, 
                                                                                    parameters.object, 
                                                                                    parameters.get?.resource_id??null, 
                                                                                    parameters.get?.partition??null):
                                parameters.dml=='UPDATE'?  await this.updateObject( parameters.app_id, 
                                                                                    parameters.object, 
                                                                                    parameters.update?.resource_id??null, 
                                                                                    parameters.update?.data_app_id??null, 
                                                                                    parameters.update?.data):
                                parameters.dml=='POST'?    await this.postObject(   parameters.app_id,   
                                                                                    parameters.object, 
                                                                                    parameters.post?.data):
                                    await this.deleteObject(                        parameters.app_id, 
                                                                                    parameters.object, 
                                                                                    parameters.delete?.resource_id??null, 
                                                                                    parameters.delete?.data_app_id??null);
                if (parameters.object.toString().startsWith('Log'))
                    return result;
                else
                    return this.db.Log.post({app_id:parameters.app_id, 
                                                    data:{  object:'LogDbInfo', 
                                                            db:{Object:parameters.object,
                                                                Dml:parameters.dml, 
                                                                Parameters:parameters
                                                                }, 
                                                            log:result
                                                        }
                                                    }).then(()=>result);
            }
        } 
        catch (error) {
            if (parameters.object.toString().startsWith('Log'))
                throw error;
            else
                return this.db.Log.post({
                                    app_id:parameters.app_id, 
                                    data:{  object:'LogDbError', 
                                            db:{Object:parameters.object,
                                                Dml:parameters.dml, 
                                                Parameters:parameters.update ?? parameters.post ?? parameters.delete
                                                }, 
                                            log:error
                                        }
                                    }).then(()=>{
                                        throw error;
                                    });
        }
    };

    /**
     * @name getError
     * @description Returns error message in ISO20022 format
     * @method
     * @param {number|null} app_id
     * @param {number} statusCode
     * @param {*} error
     * @returns {server['server']['response']}
     */
    getError = (app_id, statusCode, error=null) =>{
        if (error){
            return {http:statusCode,
                    code:'DB',
                    text:error,
                    developerText:null,
                    moreInfo:null,
                    type:'JSON'};
        }
        else{
            return {http:statusCode,
                    code:'DB',
                    text:error?error:statusCode==404?'?!':'⛔',
                    developerText:null,
                    moreInfo:null,
                    type:'JSON'};
        }
    };
    /**
     * @name UtilNumberValue
     * @description Get number value from request key
     *              returns number or null for numbers
     *              so undefined and '' are avoided sending argument to service functions
     * @method
     * @param {server['server']['req_id_number']} param
     * @returns {number|null}
     */
    UtilNumberValue = param => (param==null||param===undefined||param==='undefined'||param==='')?null:Number(param);
    
    /**
     * @name UtilSearchMatch
     * @description Searches for text in given variables without diacrites
     * @method
     * @param {string} col
     * @param {string} search
     * @returns {boolean}
     */
    UtilSearchMatch = (col, search) =>{
        const col_check = col.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
        const search_check = search.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();            
        return col_check.search(search_check)>-1;
    };

    /**
     * @name getViewInfo
     * @description Database info
     * @method
     * @param {{app_id:number}}parameters
     * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['View']['ORMGetInfo'][]}>}
     */
    getViewInfo = async parameters =>{
        return {result: [{
                            DatabaseName:  this.getObject(parameters.app_id,'ConfigServer')['METADATA'].CONFIGURATION,
                            Version:        1,
                            Hostname:       this.getObject(parameters.app_id,'ConfigServer')['SERVER'].filter((/**@type{server['ORM']['Object']['ConfigServer']['SERVER']}*/row)=>'HOST' in row)[0].HOST,
                            Connections:    server.socket.socketConnectedCount({data:{logged_in:'1'}}).result.count_connected??0,
                            Started:        this.serverProcess.uptime()
                        }],
                type:'JSON'};
    };
    /**
     * @name getViewObjects
     * @description Get all objects in ORM
     * @method
     * @param {{app_id:number}}parameters
     * @returns {server['server']['response'] & {result?:server['ORM']['View']['ORMGetObjects'][]}}
     */
    getViewObjects = parameters =>{
        const result = DB.data.map(row=>{
            return {
                Name: row.Name,
                Type: row.Type,
                Lock: row.Lock,
                TransactionId: row.TransactionId,
                Rows: ('CacheContent' in row && (row.Type=='TABLE' ||row.Type=='TABLE_KEY_VALUE'))?
                        row.CacheContent?
                            row.CacheContent.length??0:
                                0:
                                    null,
                Size: ('CacheContent' in row)?
                        row.CacheContent?
                            JSON.stringify(row.CacheContent)?.length??0:
                                0:
                                    null,
                Pk: row.Pk,
                Uk: row.Uk,
                Fk: row.Fk
            };
        });
        if (result.length>0)
            return {result:result, type:'JSON'};
        else
            return this.getError(parameters.app_id, 404);
    };
}
/**
 * @name getViewInfo
 * @description Database info
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number}}parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['View']['ORMGetInfo'][]}>}
 */
const getViewInfo = async parameters =>ORM.getViewInfo(parameters);
/**
 * @name getViewObjects
 * @description Get all objects in ORM
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number}}parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['View']['ORMGetObjects'][]}}
 */
const getViewObjects = parameters =>ORM.getViewObjects(parameters);

const ORM = new ORM_class(serverProcess);

export {ORM_class, ORM, getViewInfo, getViewObjects};
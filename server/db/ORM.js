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
 *                  DOCUMENT with any content can be saved in a record using name json_data implemented
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
 * @import {server_server_response, server_server_error,
 *          server_DbObject, server_DbObject_record, 
 *          server_db_config_server_server,server_db_config_server_service_log,
 *          server_db_result_fileFsRead,
 *          server_db_common_result_update, server_db_common_result_delete,server_db_common_result_insert,
 *          server_db_document_ConfigServer,
 *          server_server_req_id_number} from '../types.js'
 * @import {Dirent} from 'node:fs'
 */

const {serverProcess} = await import('../info.js');
const fs = await import('node:fs');
//Private properties
/**
 * @name #DB
 * @description File database using ORM pattern, is loaded from external file at server start
 * @constant
 * @type{{data:server_DbObject_record[]}}
 */
const DB = {data: []};
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
        /**@type{Object.<String,*>} */
        this.db = {};
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
        if (Object.keys(this.db).length>0){
            const {iamUtilMessageNotAuthorized} = await import('../iam.js');
            throw iamUtilMessageNotAuthorized();
        }
        else{
            /** 
             * @description Get all imported ORM objects from file system
             *              Using Dependency Injection pattern
             * @type {Object.<String,*>}
             */
            this.db = await new Promise(resolve=>{(async () =>{ 
                                const filePaths = await fs.promises.readdir(this.serverProcess.cwd() + 
                                                                            '/server/db', 
                                                                            { withFileTypes: true });
                                /**@type{Object.<String,*>} */
                                const ORMObjects = {};
                                for (const file of filePaths){
                                    //filter directory, ORM file and test spec files
                                    if (!file.isDirectory() && file.name !='ORM.js' && !file.name.endsWith('spec.js')){
                                        ORMObjects[file.name.replace('.js','')] = await import('./' +  file.name); 
                                    }
                                        
                                }
                                resolve(ORMObjects);
                        })();});
            Object.seal(this.db);

            const Installation = await import('../installation.js');            
            const result_data = await this.getFsDataExists();
            if (result_data==false){
                //first time , create default config for microservice and DbObjects
                await Installation.postConfigDefault();
                //first time, insert default data
                await Installation.postDataDefault();
            
            }    
            DB.data = await this.getFsDbObject();

            //cache file content in db
            for (const file_db_record of DB.data){
                if ('cache_content' in file_db_record &&
                    file_db_record.in_memory==false
                ){
                    const file = await this.getFsFile(DB_DIR.db + file_db_record.name + '.json', file_db_record.type);
                    file_db_record.cache_content = file?file:null;
                }
            }
            /**@type{server_db_document_ConfigServer} */
            const configServer = this.db.ConfigServer.get({app_id:0}).result;
            
            const common = await import ('../../apps/common/src/common.js');
            //common font css contain many font urls, return css file with each url replaced with a secure url
            //and save encryption data for all records directly in table at start to speed up performance
            await this.postAdmin('IamEncryption', common.commonCssFonts.db_records);
    
            if (configServer.SERVICE_IAM.filter(parameter=> 'SERVER_UPDATE_SECRETS_START' in parameter)[0].SERVER_UPDATE_SECRETS_START=='1')
                await Installation.updateConfigSecrets();
    
        }
    };
    
    /**
     * @name formatContent
     * @description Formats content
     * @method
     * @param {server_DbObject_record['type']} object_type
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
     * @param {server_DbObject} filename 
     * @param {boolean}  immutable
     * @returns {server_DbObject_record}
     */
    getObjectRecord = (filename, immutable=false) =>immutable?
                                                        JSON.parse(JSON.stringify(DB.data.filter(file_db=>file_db.name == filename)[0])):
                                                            DB.data.filter(file_db=>file_db.name == filename)[0];

    /**
     * @name fileTransactionStart
     * @description Start transaction
     *              Using race condition, pessmistic lock and database transaction pattern
     *              Uses setTimeout loop until lock is available and waits maximum 10 seconds for lock
     *              Reads and sets `transaction_id`, `transaction_content` and `lock` key in DB 
     *              `transaction_content` is used to rollback info if something goes wrong and can also be used for debugging purpose
     * @method
     * @param {server_DbObject} object 
     * @param {string} filepath
     * @returns {Promise.<{transaction_id:number, transaction_content:*}>}
     */
    fileTransactionStart = async (object, filepath)=>{
        const record = DB.data.filter(file_db=>file_db.name == object)[0];
        const transaction = async ()=>{
            const transaction_id = Date.now();
            record.transaction_id = transaction_id;
            record.transaction_content = record.type.startsWith('TABLE_LOG')?
                                                    null:
                                                        record.in_memory?
                                                            JSON.parse(record.content?? (record.type.startsWith('TABLE')?'[]':'{}')):
                                                                await this.getFsFile(filepath,record.type);
            return {transaction_id:transaction_id,
                    transaction_content:record.transaction_content
            };
        };
        return new Promise((resolve, reject)=>{
            if  (record.lock==0){
                record.lock = 1;
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
                        if (record.lock==0){
                            record.lock = 1;
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
     *              Empties `transaction_id` and `transaction_content`, sets `lock =0` and updates cache_content if used
     * @method
     * @param {server_DbObject} file 
     * @param {number} transaction_id 
     * @param {*} [cache_content]
     * @returns {boolean}
     */
    commit = (file, transaction_id, cache_content=null)=>{
        const record = DB.data.filter(file_db=>file_db.name == file)[0];
        if (record.transaction_id==transaction_id){
            if (cache_content)
                record.cache_content = cache_content;
            record.lock = 0;
            record.transaction_id = null;
            record.transaction_content = null;
            return true;
        }
        else
            return false;
    };
    /**
     * @name rollback
     * @description Transaction rollback
     *              Empties `transaction_id` and `transaction_content`, sets `lock =0` and updates cache_content if used
     * @method
     * @param {server_DbObject} file 
     * @param {number} transaction_id 
     * @returns {boolean}
     */
    rollback = (file, transaction_id)=>{
        const record = DB.data.filter(file_db=>file_db.name == file)[0];
        if (record.transaction_id==transaction_id){
            record.lock = 0;
            record.transaction_id = null;
            record.transaction_content = null;
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
                                        .filter((/**@type{server_db_config_server_service_log}*/row)=>row.FILE_INTERVAL)[0].FILE_INTERVAL;
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
     * @param {server_DbObject_record['type']|null} [object_type]
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
     * @returns {Promise.<server_DbObject_record[]>}
     */
    getFsDbObject = async () => this.getFsFile(DB_DIR.db + 'DbObjects.json');

    /**
     * @name updateFsFile
     * @description Writes file
     *              Must specify valid transaction id to be able to update a file
     *              Backup of old file will be written to journal directory
     * @method
     * @param {server_DbObject} object
     * @param {number|null} transaction_id 
     * @param {[]} file_content 
     * @param {string|null} filepath
     * @returns {Promise.<void>}
     */
    updateFsFile = async (object, transaction_id, file_content, filepath=null) =>{  
        const record = this.getObjectRecord(object);
        if (record.in_memory==true)
            record.content = this.formatContent(record.type, file_content);
        else
            if (!transaction_id || record.transaction_id != transaction_id){
                const {iamUtilMessageNotAuthorized} = await import('../iam.js');
                throw iamUtilMessageNotAuthorized();
            }
            else{
                if (['TABLE', 'TABLE_KEY_VALUE', 'DOCUMENT'].includes(record.type) && this.getObject(0,'ConfigServer').SERVICE_DB.filter((/**@type{*}*/key)=>'JOURNAL' in key)[0]?.JOURNAL=='1'){
                    //write to journal using format [Date.now()].[ISO Date string].[object].json
                    await this.postFsFile(`${DB_DIR.journal}${Date.now()}.${new Date().toISOString().replace(new RegExp(':', 'g'),'.')}.${object}.json`, file_content, record.type);
                }
                //write new file content
                await this.postFsFile(filepath ?? (DB_DIR.db + object + '.json'), file_content, record.type);
            }
    };

    /**
     * @name postFsFile
     * @description Write to a file
     * @method
     * @param {string} path
     * @param {*} content
     * @param {server_DbObject_record['type']} object_type
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
     * @param {server_DbObject} object
     * @param {{}} file_content 
     * @param {server_DbObject_record['type']} object_type
     * @returns {Promise.<void>}
     */
    postFsAdmin = async (object, file_content, object_type) =>{
        await this.postFsFile(DB_DIR.db + object + '.json', file_content, object_type);
    };

    /**
     * @name postAdmin
     * @description Add table content for memory only table used at server start
     * @method
     * @param {server_DbObject} object
     * @param {{}} data
     * @returns {Promise.<void>}
     */
    postAdmin = async (object, data) =>{
        const record = this.getObjectRecord(object);
        if (record.in_memory){
            record.cache_content = data;
            record.content = this.formatContent(record.type,data);
        }
        else
            throw this.getError(0, 401);    
    };

    /**
     * @name lockObject
     * @description Locks object in DB
     * @method
     * @param {number} app_id
     * @param {server_DbObject} object
     * @param {string |null} filepath_partition
     * @returns {Promise.<server_db_result_fileFsRead>}
     */
    lockObject = async (app_id, object, filepath_partition=null) =>{
        const filepath = filepath_partition ?? (DB_DIR.db + object + '.json');
        const {transaction_id, transaction_content} = await this.fileTransactionStart(object, filepath);
        return {   file_content:    transaction_content,
                    lock:           true,
                    transaction_id: transaction_id};
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
     * @param {server_DbObject} object
     * @param {number|null} [resource_id]
     * @param {number|null} [data_app_id]
     * @returns {*}
     */
    getObject = (app_id, object, resource_id, data_app_id) =>{
        try {
            //fetch record with already removed object reference
            const record = this.getObjectRecord(object, true);
            switch(record.type){
                case 'TABLE':
                case 'TABLE_KEY_VALUE':{
                    /**@type{*[]} */
                    const records = record.cache_content
                                    .filter((/**@type{*}*/row)=> row.id ==(resource_id ?? row.id) && row.app_id == (data_app_id ?? row.app_id))
                                    .map((/**@type{*}*/row)=>{
                                        if ('json_data' in row)
                                            return {...row,
                                                    ...{...row.json_data}
                                            };
                                        else
                                            return row;
                                    });
                    //log in background without waiting if db log is enabled
                    this.db.Log.post({   app_id:app_id, 
                                                data:{  object:'LogDbInfo', 
                                                        db:{object:object,
                                                            dml:'GET', 
                                                            parameters:{resource_id:resource_id, data_app_id:data_app_id}
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
                    return record.cache_content;
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
     * @param {server_DbObject} object
     * @param {number|null} resource_id
     * @param {string|null} partition
     * @returns {Promise.<{rows:*[]|{}}>}
     */
    getObjectFile = async (app_id, object, resource_id, partition) =>{
        const record = (await this.getFsDbObject()).filter(row=>row.name==object)[0];
        if (record.in_memory==true)
            if (record.type.startsWith('TABLE'))
                return this.getObject(app_id, object, resource_id, null);
            else
                return this.getObject(app_id, object, null, null);
        else
            if (record.type.startsWith('TABLE')){
                const filepath = record.type.startsWith('TABLE_LOG')?
                                    DB_DIR.db + `${object}_${this.fileNamePartition(partition)}.json`:
                                        DB_DIR.db + `${object}.json`;
                /**@type{*[]} */
                const file = await this.getFsFile(filepath, record.type);
                if (record.type=='TABLE_KEY_VALUE')
                    return {rows:file.filter(row=>row.app_id == (resource_id??row.app_id))};    
                else
                    return {rows:file.filter(row=>row.id == (resource_id??row.id))};    
            }
            else
                return await this.getFsFile(DB_DIR.db + object + '.json', record.type);
    };

    /**
     * @name constraintsValidate
     * @description Validates:
     *              PK constraint that can have one primary key column
     *              UK constraint that can have several columns
     *              FK constraint that should have a value in referref column and object, checked for TABLE and TABLE_KEY_VALUE
     *              Implements contraints pattern using some() function for best performane to check if value already exist
     * @method
     * @param {server_DbObject} table
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
        if (dml=='POST' && filerecord.pk && table_rows.some((/**@type{server_DbObject_record}*/record)=>
            /**@ts-ignore */
            record[filerecord.pk]==data[filerecord.pk]))
                return false;
        else{
            //check UK for POST
            //no record can exist having given values for POST
            if (dml=='POST' && filerecord.uk && table_rows.some((/**@type{server_DbObject_record}*/record)=>
                //ignore empty value
                /**@ts-ignore */
                filerecord.uk?.filter(column=>record[column] && record[column]==data[column]).length==filerecord.uk?.length))
                    return false;
            else
                //check UK for UPDATE
                //max one record can exist having given values for UPDATE
                if (dml=='UPDATE' && filerecord.uk && table_rows.some((/**@type{server_DbObject_record}*/record)=>
                    //check value is the same, ignore empty UK
                    /**@ts-ignore */
                    filerecord.uk.filter(column=>record[column] && record[column]==data[column]).length==filerecord.uk.length &&
                    //check it is NOT the same user
                    /**@ts-ignore */
                    record[filerecord.pk]!=resource_id))
                        return false;
                else
                    //check FK for POST and UPDATE
                    //for TABLE and TABLE_KEY_VALUE objects for data that should be updated
                    //check if there is a key that does not exists in the referred object in a row in cache_content
                    //ignore empty fk
                    if (	(filerecord.type=='TABLE'|| filerecord.type=='TABLE_KEY_VALUE') &&
                            (filerecord.fk??[])
                                .filter(fk=>
                                    fk[0] in data && data[fk[0]]
                                )
                                .filter(fk=>
                                    DB.data
                                    .filter(object=>
                                        object.name == fk[2]
                                    )[0].cache_content
                                    .some((/**@type{*}*/row)=> 
                                        data[fk[0]] && row[fk[1]]==data[fk[0]]
                                    )
                                ).length!=(filerecord.fk??[]).filter(fk=>fk[0] in data && data[fk[0]]).length
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
     * @param {server_DbObject} object
     * @param {*} data
     * @returns {Promise.<server_db_common_result_insert>}
     */
    postObject = async (app_id, object, data) =>{
        if (app_id!=null){
            const record = this.getObjectRecord(object);
            if (record.type.startsWith('TABLE')){
                const filepath = record.type=='TABLE'?`${DB_DIR.db}${object}.json`:`${DB_DIR.db}${object}_${this.fileNamePartition()}.json`;
                const file = await this.lockObject(app_id, object, record.type=='TABLE'?null:filepath);
                if ((record.type !='TABLE' || (record.type =='TABLE'  && this.constraintsValidate(object, 
                    /**@ts-ignore */
                    file.file_content, 
                    data, 'POST')))){
                        /**@ts-ignore */
                        const update_data = record.type =='TABLE'?(record.transaction_content?? []).concat(data):data;
                        await this.updateFsFile(object, 
                                                file.transaction_id, 
                                                update_data,
                                                record.type=='TABLE'?null:filepath)
                        .catch(()=>{
                            this.rollback(  object, 
                                            /*@ts-ignore*/
                                            file.transaction_id);
                        });
                        //commit and update cache for TABLE
                        if (this.commit(object, 
                                        /*@ts-ignore*/
                                        file.transaction_id,
                                        record.type=='TABLE'?update_data:null))
                            return {affectedRows:1};
                        else{
                            const {iamUtilMessageNotAuthorized} = await import('../iam.js');
                            throw iamUtilMessageNotAuthorized();
                        }
                }
                else{
                    this.rollback(object, 
                        /*@ts-ignore*/
                        file.transaction_id);
                    return {affectedRows:0};
                }
            }
            else{
                //no post on documents
                return {affectedRows:0};
            }
        }
        else{
            return {affectedRows:0};
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
     * @param {server_DbObject} object
     * @param {number|null} resource_id
     * @param {number|null} data_app_id
     * @param {*} data
     * @returns {Promise<server_db_common_result_update>}
     */
    updateObject = async (app_id, object, resource_id, data_app_id, data) =>{    
        if (app_id!=null){
            const object_type = this.getObjectRecord(object).type;
            if (object_type == 'TABLE_LOG' || object_type == 'TABLE_LOG_DATE'){
                //no update of log tables
                return {affectedRows:0};
            }
            else{
                /**@type{server_db_result_fileFsRead} */
                const file = await this.lockObject(app_id, object);
                if (['TABLE','TABLE_KEY_VALUE'].includes(object_type)){
                    if (this.constraintsValidate(object, file.file_content, data, 'UPDATE', resource_id)){
                        let update = false;
                        let count = 0;
                        for (const index in file.file_content)
                            //a TABLE must have ID or APP_ID as PK to be able to update
                            if ((file.file_content[index].id==resource_id && resource_id!=null)|| (file.file_content[index].app_id == data_app_id && data_app_id != null)){
                                count++;
                                //update columns requested
                                for (const key of Object.entries(data)){
                                    update = true;
                                    file.file_content[index][key[0]] = key[1];
                                }
                            }
                        if (update){
                            await this.updateFsFile(object, file.transaction_id, file.file_content)
                                    .catch(()=>this.rollback(object, 
                                                        /**@ts-ignore */
                                                        file.transaction_id));
                            //commit and update cache for TABLE
                            if (this.commit( object,
                                        /*@ts-ignore*/
                                        file.transaction_id,
                                        file.file_content))
                                return {affectedRows:count};
                            else{
                                const {iamUtilMessageNotAuthorized} = await import('../iam.js');
                                throw iamUtilMessageNotAuthorized();
                            }
                        }
                        else
                            return {affectedRows:0};
                    }
                    else{
                        this.rollback(object,
                                                /*@ts-ignore*/
                                                file.transaction_id);
                        return {affectedRows:0};
                    }
                }
                else{
                    //document
                    await this.updateFsFile(object, file.transaction_id, data)
                    .catch(()=>this.rollback(object, 
                                        /**@ts-ignore */
                                        file.transaction_id));
                    //commit and update cache for DOCUMENT
                    if (this.commit(  object, 
                                                /*@ts-ignore*/
                                                file.transaction_id, 
                                                data))
                        return {affectedRows:1};
                    else{
                        const {iamUtilMessageNotAuthorized} = await import('../iam.js');
                        throw iamUtilMessageNotAuthorized();
                    }
                }
            }
        }
        else
            return {affectedRows:0};
    };
    /**
     * @name deleteObject
     * @description Deletes a record in a TABLE
     *              for given resource id and app id
     *              TABLE should have column id as primary key using this function
     * @method
     * @param {number} app_id
     * @param {server_DbObject} table
     * @param {number|null} resource_id
     * @param {number|null} data_app_id
     * @returns {Promise<server_db_common_result_delete>}
     */
    deleteObject = async (app_id, table, resource_id, data_app_id) =>{
        /**
         * @param {{app_id:number,
         *		    object:server_DbObject,
        *		    pk:number|null}} parameters
        */
        const cascadeDelete = async parameters =>{
            //find referring to object
            for (const objectCascade of DB.data.filter(object=>
                                    (object.type=='TABLE'||object.type=='TABLE_KEY_VALUE') && 
                                    (object.fk??[])
                                    .filter((/**@type{[string,string,server_DbObject]}*/fk)=>
                                        fk[2]==parameters.object
                                    ).length>0
                                    )){
                //remove all rows with FK referring to current PK
                for (const row of (objectCascade.cache_content??[])
                                    .filter((/**@type{*[]}*/row)=>
                                        (objectCascade.fk??[]).filter(fk=>
                                                /**@ts-ignore */
                                                row[fk[0]]==parameters.pk
                                            ).length>0
                                    )){
                    //recursive call delete all rows in objects with FK referring to this row
                    await cascadeDelete({   app_id:app_id, 
                                            object:objectCascade.name,
                                            /**@ts-ignore */
                                            pk:row[objectCascade.pk]});
                    const file = await this.lockObject(app_id, objectCascade.name);
                    //get content to update and filter PK
                    const new_content = file.file_content
                                        .filter((/**@type{*}*/rowFile)=>
                                            (objectCascade.fk??[])
                                            .filter(fk=>
                                                rowFile[fk[0]]==parameters.pk
                                            ).length==0
                                        );
                    await this.updateFsFile(  objectCascade.name, file.transaction_id, new_content)
                    .catch(()=> this.rollback(objectCascade.name, 
                                        /**@ts-ignore */
                                        file.transaction_id));
                    //commit and update cache without removed record
                    if (this.commit(  objectCascade.name, 
                                                /*@ts-ignore*/
                                                file.transaction_id,
                                                new_content))
                        return {affectedRows:   file.file_content.length - new_content.length};
                    else{
                        const {iamUtilMessageNotAuthorized} = await import('../iam.js');
                        throw iamUtilMessageNotAuthorized();
                    }
                }
            }
        };

        /**@type{server_db_result_fileFsRead} */
        const file = await this.lockObject(app_id, table);
        if (file.file_content.filter((/**@type{*}*/row)=>(data_app_id==null && row.id==resource_id && resource_id!=null)|| (resource_id==null && row.app_id == data_app_id && data_app_id != null)).length>0){
            await cascadeDelete({app_id:app_id, object:table, pk:resource_id??data_app_id})
                    .catch(()=>{
                        null;
                    });
            //get content to update and filter unique id
            const new_content = file.file_content
                                .filter((/**@type{*}*/row)=>(data_app_id==null && resource_id!=null && row.id!=resource_id) || (resource_id==null && data_app_id!=null && row.app_id!=data_app_id));
            await this.updateFsFile(  table, 
                                file.transaction_id, 
                                new_content)
                    .catch((/**@type{server_server_error}*/error)=>{
                        this.rollback(table, 
                                /*@ts-ignore*/
                                file.transaction_id);
                        throw error;
                    });
                    //commit and update cache without removed record
                    if (this.commit(  table, 
                                                /*@ts-ignore*/
                                                file.transaction_id,
                                                new_content))
                        return {affectedRows:   file.file_content.length - new_content.length};
                    else{
                        const {iamUtilMessageNotAuthorized} = await import('../iam.js');
                        throw iamUtilMessageNotAuthorized();
                    }
        }
        else
            return {affectedRows:0};    
    };
    /**
     * @name Execute
     * @description Execute a db statement
     *              TABLE that saves record uses resource_id as PK with all records using same columns
     *              TABLE_KEY_VALUE that saves key values uses app_id as PK and can have different keys
     * @method
     * @param {{app_id:number,
     *          dml:'GET'|'UPDATE'|'POST'|'DELETE',
     *          object:server_DbObject,
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
                const {iamUtilMessageNotAuthorized} = await import('../iam.js');
                throw iamUtilMessageNotAuthorized();
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
                if (parameters.object.startsWith('Log'))
                    return result;
                else
                    return this.db.Log.post({app_id:parameters.app_id, 
                                                    data:{  object:'LogDbInfo', 
                                                            db:{object:parameters.object,
                                                                dml:parameters.dml, 
                                                                parameters:parameters
                                                                }, 
                                                            log:result
                                                        }
                                                    }).then(()=>result);
            }
        } 
        catch (error) {
            if (parameters.object.startsWith('Log'))
                throw error;
            else
                return this.db.Log.post({
                                    app_id:parameters.app_id, 
                                    data:{  object:'LogDbError', 
                                            db:{object:parameters.object,
                                                dml:parameters.dml, 
                                                parameters:parameters.update ?? parameters.post ?? parameters.delete
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
     * @returns {server_server_response}
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
     * @param {server_server_req_id_number} param
     * @returns {number|null}
     */
    UtilNumberValue = param => (param==null||param===undefined||param==='undefined'||param==='')?null:Number(param);
    
    /**
     * @name getViewInfo
     * @description Database info
     * @method
     * @param {{app_id:number}}parameters
     * @returns {Promise.<server_server_response & {result?:{   database_name:string, 
     *                                                          version:number,
     *                                                          hostname:string,
     *                                                          connections:Number,
     *                                                          started:number}[]}>}
     */
    getViewInfo = async parameters =>{
        const {socketConnectedCount} = await import('../socket.js');
        return {result: [{
                            database_name:  this.getObject(parameters.app_id,'ConfigServer')['METADATA'].CONFIGURATION,
                            version:        1,
                            hostname:       this.getObject(parameters.app_id,'ConfigServer')['SERVER'].filter((/**@type{server_db_config_server_server}*/row)=>row.HOST)[0].HOST,
                            connections:    socketConnectedCount({data:{logged_in:'1'}}).result.count_connected??0,
                            started:        this.serverProcess.uptime()
                        }],
                type:'JSON'};
    };
    /**
     * @name getViewObjects
     * @description Get all objects in ORM
     * @method
     * @param {{app_id:number}}parameters
     * @returns {server_server_response & {result?:{name:server_DbObject_record['name'],
     *                                              type:server_DbObject_record['type'],
     *                                              lock:server_DbObject_record['lock'],
     *                                              transaction_id:server_DbObject_record['transaction_id'],
     *                                              rows:number|null,
     *                                              size:number|null,
     *                                              pk:server_DbObject_record['pk'],
     *                                              uk:server_DbObject_record['uk'],
     *                                              fk:server_DbObject_record['fk']}[]}}
     */
    getViewObjects = parameters =>{
        const result = DB.data.map(row=>{
            return {
                name: row.name,
                type: row.type,
                lock: row.lock,
                transaction_id: row.transaction_id,
                rows: ('cache_content' in row && (row.type=='TABLE' ||row.type=='TABLE_KEY_VALUE'))?
                        row.cache_content?
                            row.cache_content.length??0:
                                0:
                                    null,
                size: ('cache_content' in row)?
                        row.cache_content?
                            JSON.stringify(row.cache_content)?.length??0:
                                0:
                                    null,
                pk: row.pk,
                uk: row.uk,
                fk: row.fk
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
 * @returns {Promise.<server_server_response & {result?:{   database_name:string, 
 *                                                          version:number,
 *                                                          hostname:string,
 *                                                          connections:Number,
 *                                                          started:number}[]}>}
 */
const getViewInfo = async parameters =>ORM.getViewInfo(parameters);
/**
 * @name getViewObjects
 * @description Get all objects in ORM
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number}}parameters
 * @returns {server_server_response & {result?:{name:server_DbObject_record['name'],
 *                                              type:server_DbObject_record['type'],
 *                                              lock:server_DbObject_record['lock'],
 *                                              transaction_id:server_DbObject_record['transaction_id'],
 *                                              rows:number|null,
 *                                              size:number|null,
 *                                              pk:server_DbObject_record['pk'],
 *                                              uk:server_DbObject_record['uk'],
 *                                              fk:server_DbObject_record['fk']}[]}}
 */
const getViewObjects = parameters =>ORM.getViewObjects(parameters);

const ORM = new ORM_class(serverProcess);

export {ORM_class, ORM, getViewInfo, getViewObjects};
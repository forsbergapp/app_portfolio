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
 *                      in /server/db/ORM.js
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
 *                  uses temporary transaction_content from file on disk to concat new log record
 *  TABLE_LOG_DATE  same as TABLE_LOG but uses additional filename partition with date implemented as partition
 * 
 *  Admin can also use postFsAdmin and deleteFsAdmin without transaction if needed
 * 
 * @module server/db/ORM
 */

/**
 * @import {server_server_response, server_server_error,
 *          server_DbObject, server_DbObject_record, 
 *          server_db_config_server_server,server_db_config_server_service_log,
 *          server_db_result_fileFsRead,
 *          server_db_common_result_update, server_db_common_result_delete,server_db_common_result_insert} from '../types.js'
 * @import {Dirent} from 'node:fs'
 */

const fs = await import('node:fs');

/**
 * @name DB
 * @description File database using ORM pattern, is loaded from external file at server start
 * @constant
 * @type{{data:server_DbObject_record[]}}
 */
const DB = {data: []};
Object.seal(DB);

/**
 * @name DB_DIR
 * @description File database paths
 * @constant
 * @type{{db:string, backup:string}}
 */
const DB_DIR = {db:'/data/db/', backup:'/data/db/backup/'};
Object.seal(DB_DIR);

/**@type{import('./Log.js')}*/
const Log = await import(`file://${process.cwd()}/server/db/Log.js`);

/**
 * @name getObjectRecord
 * @description Get file record from file db
 * @function
 * @param {server_DbObject} filename 
 * @returns {server_DbObject_record}
 */
const getObjectRecord = filename =>JSON.parse(JSON.stringify(DB.data.filter(file_db=>file_db.name == filename)[0]));

/**
 * @name fileTransactionStart
 * @description Start transaction
 *              Using race condition, pessmistic lock and database transaction pattern
 *              Uses setTimeout loop until lock is available and waits maximum 10 seconds for lock
 *              Reads and sets `transaction_id`, `transaction_content` and `lock` key in DB 
 *              `transaction_content` is used to rollback info if something goes wrong and can also be used for debugging purpose
 * @function
 * @param {server_DbObject} file 
 * @param {string} filepath
 * @returns {Promise.<number>}
 */
const fileTransactionStart = async (file, filepath)=>{
    const record = DB.data.filter(file_db=>file_db.name == file)[0];
    const transaction = async ()=>{
        const transaction_id = Date.now();
        record.transaction_id = transaction_id;
        record.transaction_content = await getFsFile(filepath,record.type.startsWith('TABLE'));
        return transaction_id;
    };
    return new Promise((resolve, reject)=>{
        if  (record.lock==0){
            record.lock = 1;
            //add 1ms wait so transaction_id will be guaranteed unique on a fast server
            setTimeout(()=>{
                resolve(transaction()); 
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
                        resolve(transaction());
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
 * @function
 * @param {server_DbObject} file 
 * @param {number} transaction_id 
 * @param {*} [cache_content]
 * @returns {boolean}
 */
const commit = (file, transaction_id, cache_content=null)=>{
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
 * @function
 * @param {server_DbObject} file 
 * @param {number} transaction_id 
 * @returns {boolean}
 */
const rollback = (file, transaction_id)=>{
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
 * @function
 * @param {string|null} partition
 * @returns 
 */
 const fileNamePartition = (partition=null) =>{
    let file_partition = '';
    if (partition)
        file_partition = `${partition}`;
    else{
        const config_file_interval = getObject(0,'ConfigServer')['SERVICE_LOG']
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
 * @function
 * @returns {Promise.<Dirent[]>}
 */
const getFsDir = async () => await fs.promises.readdir(`${process.cwd()}${DB_DIR.db}`,{ withFileTypes: true });

/**
 * @name getFsFile
 * @description Get parsed file for given filepath
 * @param {string} filepath
 * @param {boolean} table
 * @returns {Promise.<*>}
 */
const getFsFile = async (filepath, table=false) => fs.promises.readFile(process.cwd() + filepath, 'utf8')
                                                    .then(result=>
                                                        JSON.parse(result==''?(table?'[]':'{}'):result)
                                                    )
                                                    .catch(()=>JSON.parse(table?'[]':'{}'));

/**
 * @name getFsDataExists
 * @description Checks if /data directory is created
 * @function
 * @returns {Promise<boolean>}
 */
const getFsDataExists = async () => {
    
    try {
        await fs.promises.access(process.cwd() + '/data');
        return true;
    } catch (error) {
        return false;
    }
};
/**
 * @name getFsDbObject
 * @description Get DbObjects file content
 * @returns {Promise.<server_DbObject_record[]>}
 */
const getFsDbObject = async () => getFsFile(DB_DIR.db + 'DbObjects.json');

/**
 * @name updateFsFile
 * @description Writes file
 *              Must specify valid transaction id to be able to update a file
 *              Backup of old file will be written to backup directory
 * @function
 * @param {server_DbObject} file 
 * @param {number|null} transaction_id 
 * @param {[]} file_content 
 * @returns {Promise.<void>}
 */

const updateFsFile = async (file, transaction_id, file_content) =>{  
    const record = getObjectRecord(file);
    if (!transaction_id || record.transaction_id != transaction_id){
        /**@type{import('../iam.js')} */
        const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
        throw iamUtilMessageNotAuthorized();
    }
    else{
        if (record.type=='TABLE'){
            //write backup of old file
            await postFsFile(`${DB_DIR.backup + file + '.json'}.${new Date().toISOString().replace(new RegExp(':', 'g'),'.')}`, file_content, record.type=='TABLE');
        }
        //write new file content
        await postFsFile(DB_DIR.db + file + '.json', file_content, record.type.startsWith('TABLE'));
    }
};

/**
 * @name postFsFile
 * @description Write to a file
 * @function
 * @param {string} path
 * @param {*} content
 * @param {boolean} table
 * @returns{Promise.<void>}
 */
const postFsFile = async (path, content, table) => await fs.promises.writeFile(process.cwd() + path, 
                                                    table?
                                                        //table, save records in new row and compact format
                                                        '[\n' + content.map((/**@type{*}*/row)=>JSON.stringify(row)).join(',\n') + '\n]':
                                                            //not a table, convert to string
                                                            JSON.stringify(content, undefined, 2),
                                                    'utf8');                                            
/**
 * @name postFsDir
 * @description Created directories and should be used only when server is started first time
 * @function
 * @param {string[]} paths
 * @returns{Promise.<void>}
 */
const postFsDir = async paths => {
    const mkdir = async (/**@type{string} */dir) =>{
        await fs.promises.mkdir(process.cwd() + dir)
        .catch((error)=>{
            throw error;
        });
    };
    for (const dir of paths){
        await fs.promises.access(process.cwd() + dir)
        .catch(()=>{
            mkdir(dir);  
        });
    }
};
/**
 * @name postFsAdmin
 * @description Write to a file in database
 *              Should only be used by admin since no transaction is used
 * @function
 * @param {server_DbObject} object
 * @param {{}} file_content 
 * @returns {Promise.<void>}
 */
const postFsAdmin = async (object, file_content) =>{
    await postFsFile(DB_DIR.db + object + '.json', file_content, DB.data.filter(file_db=>file_db.name==object)[0]?.type.startsWith('TABLE'));
    if (DB.data.filter(file_db=>file_db.name == object)[0].cache_content)
        DB.data.filter(file_db=>file_db.name == object)[0].cache_content = file_content;
};

/**
 * @name deleteFsAdmin
 * @description Delete a file in database
 * @function
 * @param {server_DbObject} file 
 * @returns {Promise.<void>}
 */
const deleteFsAdmin = async file => {                                 
    const filepath =    process.cwd() + 
                        DB_DIR.db +
                        file + '.json';
    await fs.promises.rm(filepath)
            .then(()=>{if (DB.data.filter(file_db=>file_db.name == file)[0].cache_content)
                        DB.data.filter(file_db=>file_db.name == file)[0].cache_content = null;
            })
            .catch((error=>{throw error;}));
};

/**
 * @name lockObject
 * @description Locks object in DB
 * @function
 * @param {number} app_id
 * @param {server_DbObject} object
 * @param {string |null} filepath_partition
 * @returns {Promise.<server_db_result_fileFsRead>}
 */
const lockObject = async (app_id, object, filepath_partition=null) =>{
    const filepath = filepath_partition ?? (DB_DIR.db + object + '.json');
    const transaction_id = await fileTransactionStart(object, filepath);
    return {   file_content:    getObjectRecord(object).transaction_content,
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
 * @function
 * @param {number} app_id
 * @param {server_DbObject} object
 * @param {number|null} [resource_id]
 * @param {number|null} [data_app_id]
 * @returns {*}
 */
const getObject = (app_id, object, resource_id, data_app_id) =>{
    try {
        //fetch record with already removed object reference
        const record = getObjectRecord(object);
        switch(record.type){
            case 'TABLE':
            case 'TABLE_KEY_VALUE':{
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
                Log.post({  app_id:app_id, 
                            data:{  object:'LogDbInfo', 
                                    db:{object:object,
                                        dml:'GET', 
                                        parameters:{resource_id:resource_id, data_app_id:data_app_id}
                                        }, 
                                    log:records
                                }
                            });
                if (records.length>0)
                    return {rows:records};
                else
                    return {rows:[]};
            }
            case 'DOCUMENT':
                return record.cache_content;
            default:
                return {};
        }
    } catch (error) {
        return {rows:[]};
    }
    
};
/**
 * @name getObjectFile
 * @description Returns file content for given file
 *              Microservice uses this function to read table content from file since DB is only loaded in main server
 *              if object type starts with TABLE: filter resource id in rows 
 *              if object type TABLE_LOG and TABLE_LOG_DATE: uses partition 
 *              else returns document
 * @function
 * @param {number} app_id
 * @param {server_DbObject} object
 * @param {number|null} resource_id
 * @param {string|null} partition
 * @returns {Promise.<{rows:*[]|{}}>}
 */
const getObjectFile = async (app_id, object, resource_id, partition) =>{
    const record = (await getFsDbObject()).filter(row=>row.name==object)[0];
    if (record.type.startsWith('TABLE')){
        const filepath = record.type.startsWith('TABLE_LOG')?
                            DB_DIR.db + `${object}_${fileNamePartition(partition)}.json`:
                                DB_DIR.db + `${object}.json`;
        /**@type{*[]} */
        const file = await getFsFile(filepath, record.type.startsWith('TABLE'));
        if (record.type=='TABLE_KEY_VALUE')
            return {rows:file.filter(row=>row.app_id == (resource_id??row.app_id))};    
        else
            return {rows:file.filter(row=>row.id == (resource_id??row.id))};    
    }
    else
        return await getFsFile(DB_DIR.db + object + '.json', record.type.startsWith('TABLE'));
};

/**
 * @name constraintsValidate
 * @description Validates:
 *              PK constraint that can have one primary key column
 *              UK constraint that can have several columns
 *              FK constraint that should have a value in referref column and object, checked for TABLE and TABLE_KEY_VALUE
 *              Implements contraints pattern using some() function for best performane to check if value already exist
 * @function
 * @param {server_DbObject} table
 * @param {[]} table_rows
 * @param {*} data
 * @param {'UPDATE'|'POST'} dml
 * @param {number|null} [resource_id]
 * @returns {boolean}
 */
const constraintsValidate = (table, table_rows, data, dml, resource_id) =>{
    const filerecord = getObjectRecord(table);
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
 * @function
 * @param {number} app_id
 * @param {server_DbObject} object
 * @param {*} data
 * @returns {Promise.<server_db_common_result_insert>}
 */
const postObject = async (app_id, object, data) =>{
    if (app_id!=null){
        const object_type = getObjectRecord(object).type;
        if (object_type.startsWith('TABLE')){
            const filepath = object_type=='TABLE'?`${DB_DIR.db}${object}.json`:`${DB_DIR.db}${object}_${fileNamePartition()}.json`;
            const file = await lockObject(app_id, object, object_type=='TABLE'?null:filepath);
            if ((object_type =='TABLE'  && constraintsValidate(object, 
                /**@ts-ignore */
                file.file_content, 
                data, 'POST')) ||object_type !='TABLE' ){
                    await updateFsFile( object, 
                        file.transaction_id, 
                        /**@ts-ignore */
                        (DB.data.filter(row=>row.name==object)[0].transaction_content?? []).concat(data))
                    .catch(()=>{
                        rollback(object, 
                            /*@ts-ignore*/
                            file.transaction_id);
                        
                    });
                    //commit and update cache for TABLE
                    if (commit(  object, 
                                                /*@ts-ignore*/
                                                file.transaction_id,
                                                /*@ts-ignore*/
                                                object_type=='TABLE'?(DB.data.filter(row=>row.name==object)[0].transaction_content?? []).concat(data):null))
                        return {affectedRows:1};
                    else{
                        /**@type{import('../iam.js')} */
                        const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
                        throw (iamUtilMessageNotAuthorized());
                    }
            }
            else{
                rollback(object, 
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
 * @function
 * @param {number} app_id
 * @param {server_DbObject} object
 * @param {number|null} resource_id
 * @param {number|null} data_app_id
 * @param {*} data
 * @returns {Promise<server_db_common_result_update>}
 */
const updateObject = async (app_id, object, resource_id, data_app_id, data) =>{
    
    if (app_id!=null){
        const object_type = getObjectRecord(object).type;
        /**@type{server_db_result_fileFsRead} */
        const file = await lockObject(app_id, object);
        if (object_type == 'TABLE_LOG' || object_type == 'TABLE_LOG_DATE'){
            //no update of log tables
            return {affectedRows:0};
        }
        else
            if (object_type == 'TABLE'){
                if (constraintsValidate(object, file.file_content, data, 'UPDATE', resource_id)){
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
                        await updateFsFile(object, file.transaction_id, file.file_content)
                                .catch(()=>rollback(object, 
                                                    /**@ts-ignore */
                                                    file.transaction_id));
                        //commit and update cache for TABLE
                        if (commit( object,
                                    /*@ts-ignore*/
                                    file.transaction_id,
                                    file.file_content))
                            return {affectedRows:count};
                        else{
                            /**@type{import('../iam.js')} */
                            const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
                            throw (iamUtilMessageNotAuthorized());
                        }
                    }
                    else
                        return {affectedRows:0};
                }
                else{
                    rollback(object,
                                            /*@ts-ignore*/
                                            file.transaction_id);
                    return {affectedRows:0};
                }
            }
            else{
                //document
                await updateFsFile(object, file.transaction_id, data)
                .catch(()=>rollback(object, 
                                    /**@ts-ignore */
                                    file.transaction_id));
                //commit and update cache for DOCUMENT
                if (commit(  object, 
                                            /*@ts-ignore*/
                                            file.transaction_id, 
                                            data))
                    return {affectedRows:1};
                else{
                    /**@type{import('../iam.js')} */
                    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
                    throw (iamUtilMessageNotAuthorized());
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
 * @function
 * @param {number} app_id
 * @param {server_DbObject} table
 * @param {number|null} resource_id
 * @param {number|null} data_app_id
 * @returns {Promise<server_db_common_result_delete>}
 */
const deleteObject = async (app_id, table, resource_id, data_app_id) =>{
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
                const file = await lockObject(app_id, objectCascade.name);
                //get content to update and filter PK
                const new_content = file.file_content
                                    .filter((/**@type{*}*/rowFile)=>
                                        (objectCascade.fk??[])
                                        .filter(fk=>
                                            rowFile[fk[0]]==parameters.pk
                                        ).length==0
                                    );
                await updateFsFile(  objectCascade.name, file.transaction_id, new_content)
                .catch(()=> rollback(objectCascade.name, 
                                    /**@ts-ignore */
                                    file.transaction_id));
                //commit and update cache without removed record
                if (commit(  objectCascade.name, 
                                            /*@ts-ignore*/
                                            file.transaction_id,
                                            new_content))
                    return {affectedRows:   file.file_content.length - new_content.length};
                else{
                    /**@type{import('../iam.js')} */
                    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
                    throw (iamUtilMessageNotAuthorized());
                }
            }
        }
	};

    /**@type{server_db_result_fileFsRead} */
    const file = await lockObject(app_id, table);
    if (file.file_content.filter((/**@type{*}*/row)=>(data_app_id==null && row.id==resource_id && resource_id!=null)|| (resource_id==null && row.app_id == data_app_id && data_app_id != null)).length>0){
        await cascadeDelete({app_id:app_id, object:table, pk:resource_id??data_app_id})
                .catch(()=>{
                    null;
                });
        //get content to update and filter unique id
        const new_content = file.file_content
                            .filter((/**@type{*}*/row)=>(data_app_id==null && resource_id!=null && row.id!=resource_id) || (resource_id==null && data_app_id!=null && row.app_id!=data_app_id));
        await updateFsFile(  table, 
                            file.transaction_id, 
                            new_content)
                .catch((/**@type{server_server_error}*/error)=>{
                    rollback(table, 
                            /*@ts-ignore*/
                            file.transaction_id);
                    throw error;
                });
                //commit and update cache without removed record
                if (commit(  table, 
                                            /*@ts-ignore*/
                                            file.transaction_id,
                                            new_content))
                    return {affectedRows:   file.file_content.length - new_content.length};
                else{
                    /**@type{import('../iam.js')} */
                    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
                    throw (iamUtilMessageNotAuthorized());
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
 * @function
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
const Execute = async parameters =>{
    try{
        if (parameters.dml!='GET' && parameters.dml!='UPDATE' && parameters.dml!='POST' && parameters.dml!='DELETE')
        {
            /**@type{import('../iam.js')} */
            const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
            throw iamUtilMessageNotAuthorized();
        }
        else{
            const result =  parameters.dml=='GET'?  await getObjectFile(parameters.app_id, 
                                                                    parameters.object, 
                                                                    parameters.get?.resource_id??null, 
                                                                    parameters.get?.partition??null):
                            parameters.dml=='UPDATE'?  await updateObject(  parameters.app_id, 
                                                                            parameters.object, 
                                                                            parameters.update?.resource_id??null, 
                                                                            parameters.update?.data_app_id??null, 
                                                                            parameters.update?.data):
                            parameters.dml=='POST'?    await postObject(    parameters.app_id,   
                                                                            parameters.object, 
                                                                            parameters.post?.data):
                                await deleteObject(                         parameters.app_id, 
                                                                            parameters.object, 
                                                                            parameters.delete?.resource_id??null, 
                                                                            parameters.delete?.data_app_id??null);
            if (parameters.object.startsWith('Log'))
                return result;
            else
                return Log.post({   app_id:parameters.app_id, 
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
            return Log.post({   app_id:parameters.app_id, 
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
 * Returns error message in ISO20022 format
 * @param {number|null} app_id
 * @param {number} statusCode
 * @param {*} error
 * @returns {server_server_response}
 */
const getError = (app_id, statusCode, error=null) =>{
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
 * @name Init
 * @description Load default database or read existing from disk. Set cache for files in existing database using `cache_content` key to increase performance
 * @function
 * @param {server_DbObject_record[]|null} default_db
 * @returns {Promise.<void>}
 */
 const Init = async (default_db=null) => {
    
    DB.data = default_db?default_db:await getFsDbObject();
    
    if (default_db == null)
        for (const file_db_record of DB.data){
            if ('cache_content' in file_db_record){
                const file = await getFsFile(DB_DIR.db + file_db_record.name + '.json', file_db_record.type.startsWith('TABLE'));
                file_db_record.cache_content = file?file:null;
            }
        }
 };
 
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
const getViewInfo = async parameters =>{
    /**@type{import('../socket.js')} */
    const {socketConnectedCount} = await import(`file://${process.cwd()}/server/socket.js`);
    return {result: [{
                        database_name:  getObject(parameters.app_id,'ConfigServer')['METADATA'].CONFIGURATION,
                        version:        1,
                        hostname:       getObject(parameters.app_id,'ConfigServer')['SERVER'].filter((/**@type{server_db_config_server_server}*/row)=>row.HOST)[0].HOST,
                        connections:    socketConnectedCount({data:{logged_in:'1'}}).result.count_connected??0,
                        started:        process.uptime()
                    }],
            type:'JSON'};
};
        
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
const getViewObjects = parameters =>{

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
        return getError(parameters.app_id, 404);
};


export {
        getFsDir, getFsDataExists,
        postFsDir,postFsAdmin, 
        deleteFsAdmin,
        getObject,
        getObjectFile,
        Execute,
        getError,
        Init,
        getViewInfo, getViewObjects};
/**
 * @module server/installation
 */

/**
 * @import {server} from './types.js'
 */

const DB_DEMO_PATH              = '/server/install/db/demo/';
const DB_DEMO_FILE              = 'demo_data.json';
const {server} = await import('./server.js');
const fs = await import('node:fs');

/**
 * @description Get default file for given object in default directory
 * @param {server['ORMMetaData']['DbObject']} object
 */
const getDefaultObject = async object => 
    await fs.promises.readFile(server.ORM.serverProcess.cwd() + `/server/install/default/${object}.json`)
            .then(filebuffer=>JSON.parse(filebuffer.toString()));
/**
 * @name postDemo
 * @description Install demo users and sends server side events of progress
 *              Installation steps:
 *              1.Create all users (user_level=2) first and update with id
 *              2.Generate key pairs for each user that can be saved both in resource and apps configuration
 *              3.Loop users created
 *                  3A.Generate vpa for each user that can be saved both in resource and apps configuration            
 *                  3B.Create user_account_app record for all apps except admin
 *                  3C.Create user posts if any
 *                  3D.Create app data master records if any
 *                      3E.Update app data entity record if anything to update
 *                      3F.Create app data detail records if any
 *                          3G.Create app data detail data records if any
 *                  4.Create social record LIKE, VIEW, VIEW_ANONYMOUS, FOLLOWER, POSTS_LIKE, POSTS_VIEW and POSTS_VIEW_ANONYMOUS
 *                      4A.Create random sample
 *                          Random records are created using 2 lists of all users and creates records until two groups both have 50% samples with unique users in each sample of social type
 *                      4B.Loop random users group 1
 *                      4C.Loop random users group 2
 *                      4D.Create user like
 *                      4E.Create user view by a user
 *                      4F.Create user view by anonymous
 *                      4G.Create user follow
 *                      4H.Create user account app data post like
 *                      4I.Create user account app data post view
 *                  5.Return result
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
*          idToken:string,
*          data:{  demo_password?:string|null}}} parameters
* @returns {Promise.<server['server']['response'] & {result?:{info: {}[]} }>}
*/
const postDemo = async parameters=> {

    /**@type{{[key:string]: string|number}[]} */
    const install_result = [];
    install_result.push({'start': new Date().toISOString()});
    const fileBuffer = await fs.promises.readFile(`${server.ORM.serverProcess.cwd()}${DB_DEMO_PATH}${DB_DEMO_FILE}`, 'utf8');
    /**@type{[server_db_database_demo_data]}*/
    const demo_users = JSON.parse(fileBuffer.toString()).demo_users;
    //create social records
    const social_types = ['LIKE', 'VIEW', 'VIEW_ANONYMOUS', 'FOLLOWER', 'POSTS_LIKE', 'POSTS_VIEW', 'POSTS_VIEW_ANONYMOUS'];
    let records_iam_user = 0;
    let records_iam_user_app = 0;
    let records_iam_user_app_data_post = 0;
    let records_app_data_resource_master = 0;
    let records_app_data_resource_detail = 0;
    let records_app_data_resource_detail_data = 0;
    let install_count=0;
    const install_total_count = demo_users.length + social_types.length;
    install_count++;
    const common_app_id = server.ORM.UtilNumberValue(server.ORM.db.ConfigServer.get({app_id:parameters.app_id, data:{config_group:'SERVICE_APP', parameter:'APP_COMMON_APP_ID'}}).result) ?? 0;
    const admin_app_id = server.ORM.UtilNumberValue(server.ORM.db.ConfigServer.get({app_id:parameters.app_id, data:{config_group:'SERVICE_APP', parameter:'APP_ADMIN_APP_ID'}}).result);

    try {
        /**
        * Create demo users
        * @param {[server_db_database_demo_data]} demo_users 
        * @returns {Promise.<void>}
        */
        const create_users = async (demo_users) =>{
                /**
                * 
                * @param {server_db_database_demo_data} demo_user
                * @returns 
                */
                const create_update_id = async demo_user=>{
                    /**@type{{  username:           server['ORM']['IamUser']['username'],
                    *          bio:                server['ORM']['IamUser']['bio'],
                    *          avatar:             server['ORM']['IamUser']['avatar'],
                    *          password:           server['ORM']['IamUser']['password'],
                    *          password_reminder:  server['ORM']['IamUser']['password_reminder'],
                    *          active:             server['ORM']['IamUser']['active'],
                    *          private:            server['ORM']['IamUser']['private'],
                    *          user_level:         server['ORM']['IamUser']['user_level'],
                    *          type:               server['ORM']['IamUser']['type']
                    * 
                    }}*/
                    const data_create = {   username:               demo_user.username,
                                            bio:                    demo_user.bio,
                                            avatar:                 demo_user.avatar,
                                            password:               parameters.data.demo_password ?? '',
                                            password_reminder:      null,
                                            active:                 1,
                                            private:                0,
                                            user_level:             2,
                                            type:                   'USER'
                                        };
                    //create iam user then database user
                    /**@ts-ignore */
                    return await server.ORM.db.IamUser.postAdmin(parameters.app_id,data_create)
                                .then((/**@type{server['server']['response']}*/result)=>{
                                    if (result.result)
                                        return result;
                                    else
                                        throw result;
                                });
                };
                for (const demo_user of demo_users){
                    demo_user.id = await create_update_id(demo_user).then(user=>user.result.insertId);
                    records_iam_user++;
                }
        };
        /**
        * Create iam user app
        * @param {number} app_id 
        * @param {number} iam_user_id
        * @returns {Promise.<server['ORMMetaData']['common_result_insert']>}
        */
        const create_iam_user_app = async (app_id, iam_user_id) =>{
            return new Promise((resolve, reject) => {
                server.ORM.db.IamUserApp.post(parameters.app_id, 
                    /**@ts-ignore */
                    {app_id:app_id, Document:null, iam_user_id:iam_user_id})
                .then((/**@type{server['server']['response']}*/result)=>{
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_iam_user_app++;
                        resolve(result.result);
                    }
                    else
                        reject(result);
                });
            });
        };
        /**
        * Create iam user app data post
        * @param {{ Document:      server['ORM']['IamUserAppDataPost']['Document'],
        *           iam_user_app_id:server['ORM']['IamUserAppDataPost']['iam_user_app_id']}} data 
        * @returns {Promise.<null>}
        */
        const create_iam_user_app_data_post = async (data) => {
            return new Promise((resolve, reject) => {
                server.ORM.db.IamUserAppDataPost.post({app_id:parameters.app_id, 
                                        /**@ts-ignore */
                                        data:data})
                .then((/**@type{server['server']['response']}*/result)=>{
                    if(result.result){
                        if (result.result.data?.affectedRows == 1)
                            records_iam_user_app_data_post++;
                        resolve(null);
                    }
                    else
                        reject(result);
                });
            });
        };

        /**
        * 
        * @param {{ Document:                                      server['ORM']['AppDataResourceMaster']['Document'],
        *           iam_user_app_id:                                server['ORM']['AppDataResourceMaster']['iam_user_app_id'],
        *           app_data_entity_resource_id:                    server['ORM']['AppDataResourceMaster']['app_data_entity_resource_id']}} data 
        * @returns {Promise.<number>}
        */
        const create_app_data_resource_master = async data => {
            return new Promise((resolve, reject) => {
                server.ORM.db.AppDataResourceMaster.post({app_id:parameters.app_id, data:data})
                .then((/**@type{server['server']['response']}*/result)=>{
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_app_data_resource_master++;
                        resolve(result.result.insertId);
                    }
                    else
                        reject(result);
                });
            });
        };
        /**
        * 
        * @param {{app_data_resource_master_id: number;
        *          app_data_entity_resource_id: number;
        *          app_data_resource_master_attribute_id: number|null,
        *          Document: server['ORM']['AppDataResourceDetail']['Document'],}} data 
        * @returns {Promise.<number>}
        */
        const create_app_data_resource_detail = async data => {
            return new Promise((resolve, reject) => {
                server.ORM.db.AppDataResourceDetail.post({app_id:parameters.app_id, data:data})
                .then((/**@type{server['server']['response']}*/result)=>{
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_app_data_resource_detail++;
                        resolve(result.result.insertId);
                    }
                    else
                        reject(result);
                });
            });
        };
        /**
        * Update app_data entity with additional keys
        * @param {number} user_account_post_app_id 
        * @param {server_db_database_demo_data['app_data_resource_master'][0]['app_data_entity']} data 
        * @returns {Promise.<number>}
        */
        const update_app_data_entity = async (user_account_post_app_id,data) => {
            const result_get = server.ORM.db.AppDataEntity.get({   app_id:user_account_post_app_id, 
                                                    /**@ts-ignore */
                                                    resource_id:data.id, 
                                                    data:{data_app_id:null}});
            if(result_get.result){
                const update_Document = result_get.result[0].Document;
                for (const key of Object.entries(data??{}))
                    //skip PK
                    if (key[0]!='id')
                        update_Document[key[0]] = key[1];
                const result_update = await server.ORM.db.AppDataEntity.update({   app_id:user_account_post_app_id, 
                                                                            /**@ts-ignore */
                                                                            resource_id:data.id, 
                                                                            data:{Document:update_Document}});
                if(result_update.result){
                    if (result_update.result.affectedRows == 1)
                        records_app_data_resource_detail++;
                    return result_update.result.affectedRows;
                }
                else
                    throw result_update;
            }
            else
                throw result_get;
        };

        /**
        * 
        * @param {number} user_account_post_app_id 
        * @param {{ Document: server['ORM']['AppDataResourceDetailData']['Document'],
        *           app_data_resource_detail_id: server['ORM']['AppDataResourceDetailData']['app_data_resource_detail_id'],
        *           app_data_resource_master_attribute_id:server['ORM']['AppDataResourceDetailData']['app_data_resource_master_attribute_id']}} data 
        * @returns {Promise.<number>}
        */
        const create_app_data_resource_detail_data = async (user_account_post_app_id, data) => {
            return new Promise((resolve, reject) => {
                server.ORM.db.AppDataResourceDetailData.post({app_id:user_account_post_app_id, data:data})
                .then((/**@type{server['server']['response']}*/result)=>{
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_app_data_resource_detail_data++;
                        resolve(result.result.insertId);
                    }
                    else
                        reject(result);
                });
            });
        };

        //1.Create all users first and update with id
        await create_users(demo_users);
        
        //2.Generate key pairs for each user that can be saved both in resource and apps configuration
        //Use same for all demo users since key creation can be slow
        server.socket.socketClientPostMessage({ app_id:parameters.app_id, 
                                        resource_id:null, 
                                        data:{  data_app_id:null, 
                                                iam_user_id: null,
                                                idToken:parameters.idToken,
                                                message: JSON.stringify({   part:install_count, 
                                                                            total:install_total_count, text:'Generating key pair...'}),
                                                message_type:'PROGRESS'}});
        const {publicKey, privateKey} = await server.security.securityKeyPairCreate();
        const demo_public_key = publicKey;
        const demo_private_key = privateKey;
        //3.Loop users created
        for (const demo_user of demo_users){
            server.socket.socketClientPostMessage({app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{  data_app_id:null, 
                                                    iam_user_id: null,
                                                    idToken:parameters.idToken,
                                                    message: JSON.stringify({   part:install_count, 
                                                                                total:install_total_count, text:demo_user.username}),
                                                    message_type:'PROGRESS'}});
            install_count++;

            //3A.Generate vpa for each user that can be saved both in resource and apps configuration
            const demo_vpa = server.security.securityUUIDCreate();
            //3B.Create iam_user_app record
            //save iam_user_app.id for creating records with this FK
            const iam_user_app_id = await create_iam_user_app(demo_user.iam_user_app.app_id, demo_user.id).then(result=>{
                                            if (result)
                                                return result.insertId;
                                            else
                                                throw server.ORM.db.getError(parameters.app_id, 500, '');
                                        });
            //create for others apps except common, admin and already created
            for (const app of server.ORM.db.App.get({app_id:parameters.app_id,resource_id:null}).result
                            .filter((/**@type{server['ORM']['App']}*/row)=>row.id!=common_app_id && row.id!=admin_app_id && row.id!=demo_user.iam_user_app.app_id)){
                await create_iam_user_app(app.id, demo_user.id);
            }                                    
                
            //3C.Create user posts if any
            for (const demo_user_account_app_data_post of demo_user.iam_user_app_data_post){
                let settings_header_image;
                //use file in settings or if missing then use filename same as demo username
                if (demo_user_account_app_data_post.Document.image_header_image_img)
                    settings_header_image = `${demo_user_account_app_data_post.Document.image_header_image_img}.webp`;
                else
                    settings_header_image = `${demo_user.username}.webp`;
                /**@type{Buffer} */
                const image = await fs.promises.readFile(`${server.ORM.serverProcess.cwd()}${DB_DEMO_PATH}${settings_header_image}`);
                /**@ts-ignore */
                const image_string = 'data:image/webp;base64,' + Buffer.from(image, 'binary').toString('base64');
                //update settings with loaded image into BASE64 format
                demo_user_account_app_data_post.Document.image_header_image_img = image_string;
                //use random day and month themes
                //day 10001-10010
                demo_user_account_app_data_post.Document.design_theme_day_id = Math.floor(10001 + Math.random() * 10);
                //month 20001-20022
                demo_user_account_app_data_post.Document.design_theme_month_id = Math.floor(20001 + Math.random() * 22);
                demo_user_account_app_data_post.Document.design_theme_year_id = 30001;
                const Document_user_account_app_data_post = {
                                                Document: demo_user_account_app_data_post.Document,
                                                iam_user_app_id: iam_user_app_id
                                            };	
                /**@ts-ignore */
                await create_iam_user_app_data_post(Document_user_account_app_data_post);
            }
            /**
            * Updates resource values
            * @param {*} resource
            * @returns {Promise.<{[key:string]:string}>} 
            */
            const demo_data_update = async resource => {
                /**
                * 
                * @param {[string, string]} key_name 
                * @returns {string}
                */
                const value_set = key_name =>{
                        switch (key_name[1]){
                            case '<DATE_NOW/>':
                                return Date.now().toString();
                            case '<DATE_NOW_PADSTART_16/>':
                                return Date.now().toString().padStart(16,'0');
                            case '<DATE_ISO/>':
                                return new Date().toISOString();
                            case '<UUID/>':
                                return demo_vpa;
                            case '<SECRET/>':
                                return server.security.securitySecretCreate();
                            case '<PUBLIC_KEY/>':
                                return demo_public_key;
                            case '<PRIVATE_KEY/>':
                                return demo_private_key;
                            case '<IAM_USER_ID/>':
                                return demo_user.id.toString();
                            default:{
                                //replace if containing HOST parameter
                                if (key_name[1]!=null && typeof key_name[1]=='string' && key_name[1].indexOf('<HOST/>')>-1){
                                    /**@type{server['ORM']['ConfigServer']} */
                                    const {SERVER:config_SERVER} = server.ORM.db.ConfigServer.get({app_id:0}).result;
                                    //use HTTP configuration as default
                                    const HOST = config_SERVER.filter(row=>'HOST' in row)[0].HOST;
                                    const HTTP_PORT = server.ORM.UtilNumberValue(config_SERVER.filter(row=>'HTTP_PORT' in row)[0].HTTP_PORT);
                                    return key_name[1]?.replaceAll('<HOST/>', HOST + ((HTTP_PORT==443)?'':`:${HTTP_PORT}`));
                                }
                                else
                                    return key_name[1];
                            }        
                        }
                };
                //loop Document keys
                for (const key of Object.entries(resource.Document)){
                    resource.Document[key[0]] = value_set(key);
                }
                return resource.Document;
            };
            //3D.Create app data master records if any
            for (const resource_master of demo_user.app_data_resource_master ?? []){
                const data = {  
                                iam_user_app_id:                                 iam_user_app_id,
                                app_data_entity_resource_id:                     resource_master.app_data_entity_resource_id,
                                Document:                                       await demo_data_update(resource_master)
                };
                /**@ts-ignore */
                const master_id = await create_app_data_resource_master(data);
                //3E.Update app data entity record if anything to update
                if (resource_master.app_data_entity && resource_master.app_data_entity.id){
                    //set values used in app data master
                    for (const key of Object.entries(data.Document)){
                        if (key[0]!='id' &&
                            (key[0]=='merchant_id' ||
                            key[0]=='merchant_name' ||
                            key[0]=='merchant_api_url_payment_request_create' ||
                            key[0]=='merchant_api_url_payment_request_get_status' ||
                            key[0]=='merchant_api_secret' ||
                            key[0]=='merchant_public_key' ||
                            key[0]=='merchant_private_key' ||
                            key[0]=='merchant_vpa')
                        )
                            resource_master.app_data_entity[key[0]] = key[1];
                    }
                    //set demo user id values in app data entity if used
                    if (resource_master.app_data_entity.iam_user_id_owner)
                        resource_master.app_data_entity.iam_user_id_owner = demo_user.id;
                    if (resource_master.app_data_entity.iam_user_id_anonymous)
                        resource_master.app_data_entity.iam_user_id_anonymous = demo_user.id;
                    await update_app_data_entity(parameters.app_id, resource_master.app_data_entity);
                }
                    
                //3F.Create app data detail records if any
                for (const resource_detail of resource_master.app_data_resource_detail ?? []){
                    const data = {  app_data_resource_master_id                     : master_id,
                                    app_data_entity_resource_id                     : resource_detail.app_data_entity_resource_id,
                                    app_data_resource_master_attribute_id           : resource_detail.app_data_resource_master_attribute_id,
                                    Document                                       : await demo_data_update(resource_detail)
                                    };
                    const detail_id = await create_app_data_resource_detail(data);
                    //3G.Create app data detail data records if any
                    for (const resource_detail_data of resource_detail.app_data_resource_detail_data ?? []){
                        const data ={   app_data_resource_detail_id             : detail_id,
                                        app_data_resource_master_attribute_id   : resource_detail_data.app_data_resource_master_attribute_id,
                                        Document                               : await demo_data_update(resource_detail_data)
                                        };
                        create_app_data_resource_detail_data(parameters.app_id, data);
                    }
                }
            }
        }
        let records_iam_user_like = 0;
        let records_iam_user_view = 0;
        let records_iam_user_follow = 0;
        let records_iam_user_app_data_post_like = 0;
        let records_iam_user_app_data_post_view = 0;
        
        /**
        * Create like user
        * @param {number} app_id 
        * @param {number} id 
        * @param {number} id_like 
        * @returns {Promise.<null>}
        */
        const create_iam_user_like = async (app_id, id, id_like ) =>{
            return new Promise((resolve, reject) => {
                server.ORM.db.IamUserLike.post({app_id:app_id, data:{iam_user_id:id,iam_user_id_like:id_like}})
                .then((/**@type{server['server']['response']}*/result) => {
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_iam_user_like++;
                        resolve(null);
                    }
                    else
                        reject(result);
                });
            });
        };
        /**
        * Create user account view
        * @param {number} app_id 
        * @param {{ iam_user_id: server['ORM']['IamUserView']['iam_user_id'],
        *           iam_user_id_view: server['ORM']['IamUserView']['iam_user_id_view'],
        *           client_ip: server['ORM']['IamUserView']['client_ip'],
        *           client_user_agent:server['ORM']['IamUserView']['client_user_agent']}} data 
        * @returns {Promise.<null>}
        */
        const create_iam_user_view = async (app_id, data ) =>{
            return new Promise((resolve, reject) => {
                server.ORM.db.IamUserView.post(app_id, data)
                .then((/**@type{server['server']['response']}*/result) => {
                    if(result.result){
                        if (result.result.affectedRows == 1)
                                records_iam_user_view++;
                        resolve(null);
                    }
                    else
                        reject(result);
                });
            });
        };
        /**
        * Create user acccount follow
        * @param {number} app_id 
        * @param {number} id 
        * @param {number} id_follow 
        * @returns {Promise.<null>}
        */
        const create_iam_user_follow = async (app_id, id, id_follow ) =>{
            return new Promise((resolve, reject) => {
                server.ORM.db.IamUserFollow.post({app_id:app_id, 
                                    /**@ts-ignore */
                                    data:{iam_user_id:id, iam_user_id_follow:id_follow}})
                .then((/**@type{server['server']['response']}*/result)=>{
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_iam_user_follow++;
                        resolve(null);
                    }
                    else
                        reject(result);
                });
            });
        };
        /**
        * Create user account app setting like
        * @param {number} app_id 
        * @param {number} user1 
        * @param {number} user2 
        * @returns {Promise.<null>}
        */
        const create_iam_user_app_data_post_like = async (app_id, user1, user2 ) =>{
            return new Promise((resolve, reject) => {
                const result_posts = server.ORM.db.IamUserAppDataPost.get({app_id:parameters.app_id, resource_id:null, data:{iam_user_id:user1,data_app_id:app_id}});
                if (result_posts.result){
                    const random_posts_index = Math.floor(1 + Math.random() * result_posts.result.length - 1 );
                    server.ORM.db.IamUserAppDataPostLike.post({app_id:parameters.app_id, 
                                                            data:{  iam_user_id:user2,
                                                                    data_app_id:app_id,
                                                                    iam_user_app_data_post_id:result_posts.result[random_posts_index].id}})
                    .then((/**@type{server['server']['response']}*/result) => {
                        if (result.result){
                            if (result.result.affectedRows == 1)
                                records_iam_user_app_data_post_like++;
                            resolve(null);
                        }
                        else
                            reject(result_posts);
                    });
                }
                else
                    reject(result_posts);
            });
        };
        /**
        * Create user account app setting view
        * @param {number} app_id 
        * @param {number} user1 
        * @param {number} user2 
        * @param {string} social_type 
        * @returns {Promise.<null>}
        */
        const create_iam_user_app_data_post_view = async (app_id, user1, user2 , social_type) =>{
            return new Promise((resolve, reject) => {
                const result_posts = server.ORM.db.IamUserAppDataPost.get({app_id:parameters.app_id, resource_id:null, data:{iam_user_id:user1, data_app_id:app_id}});
                if (result_posts.result){
                    //choose random post from user
                    const random_index = Math.floor(1 + Math.random() * result_posts.result.length -1);
                    let iam_user_id;
                    if (social_type == 'POSTS_VIEW')
                        iam_user_id = user2;
                    else
                        iam_user_id = null;
                    server.ORM.db.IamUserAppDataPostView.post(parameters.app_id, {
                                                                        Document: { client_ip: null,
                                                                                    client_user_agent: null},
                                                                        iam_user_app_id: iam_user_id?
                                                                                            server.ORM.db.IamUserApp
                                                                                                .get({  app_id:app_id, 
                                                                                                        resource_id:null, 
                                                                                                        data:{  iam_user_id:user2, 
                                                                                                                data_app_id:app_id}}).result[0].id:
                                                                                                null,
                                                                        iam_user_app_data_post_id: result_posts.result[random_index].id
                                                                    })
                    .then((/**@type{server['server']['response']}*/result)=>{
                        if (result.result){
                            if (result.result.affectedRows == 1)
                                records_iam_user_app_data_post_view++;
                            resolve(null);
                        }
                        else
                            reject(result);
                    });
                }
                else
                    reject(result_posts);
            });
        };
        //4.Create social record
        for (const social_type of social_types){
            server.socket.socketClientPostMessage({app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{  data_app_id:null, 
                                                    iam_user_id: null,
                                                    idToken:parameters.idToken,
                                                    message: JSON.stringify({   part:install_count, 
                                                                                total:install_total_count, text:social_type}),
                                                    message_type:'PROGRESS'}});
            //4A.Create random sample
            install_count++;
            //select new random sample for each social type
            /**@type{[number]|[]} */
            const random_users1 = [];
            /**@type{[number]|[]} */
            const random_users2 = [];
            //loop until two groups both have 50% samples with unique users in each sample
            const sample_amount = Math.floor(demo_users.length * 0.5);
            while (random_users1.length < sample_amount || random_users2.length < sample_amount){
                const random_array_index1 = Math.floor(1 + Math.random() * demo_users.length - 1 );
                const random_array_index2 = Math.floor(1 + Math.random() * demo_users.length - 1 );
                const random_include_id1 = demo_users[random_array_index1].id;
                /**@ts-ignore */
                if (random_users1.length <sample_amount && !random_users1.includes(random_include_id1) ){
                    /**@ts-ignore */
                    random_users1.push(demo_users[random_array_index1].id);
                }
                /**@ts-ignore */
                if (random_users2.length <sample_amount && !random_users2.includes(demo_users[random_array_index2].id)){
                    /**@ts-ignore */
                    random_users2.push(demo_users[random_array_index2].id);
                }
            }
            //4B.Loop random users group 1
            for (const user1 of random_users1){
                //4C.Loop random users group 2
                for(const user2 of random_users2){
                    switch (social_type){
                        case 'LIKE':{
                            //4D.Create user like
                            await create_iam_user_like(parameters.app_id, user1, user2);
                            break;
                        }
                        case 'VIEW':{
                            //4E.Create user view by a user
                            await create_iam_user_view(parameters.app_id, 
                                                            {   iam_user_id: user1,
                                                                iam_user_id_view: user2,
                                                                client_ip: null,
                                                                client_user_agent: null
                                                            });
                            break;
                        }
                        case 'VIEW_ANONYMOUS':{
                            //4F.Create user view by anonymous
                            await create_iam_user_view(parameters.app_id, 
                                                            {
                                                                iam_user_id: null,
                                                                iam_user_id_view: user1,
                                                                client_ip: null,
                                                                client_user_agent: null
                                                            });
                            break;
                        }
                        case 'FOLLOWER':{
                            //4G.Create user follow
                            await create_iam_user_follow(parameters.app_id, user1, user2);
                            break;
                        }
                        case 'POSTS_LIKE':{
                            //4H.Create user account app data post like
                            //pick a random user setting from the user and return the app_id
                            const user_account_app_data_posts = demo_users.filter(user=>user.id == user1)[0].iam_user_app_data_post;
                            if (user_account_app_data_posts.length>0){
                                const settings_app_id = user_account_app_data_posts[Math.floor(1 + Math.random() * user_account_app_data_posts.length - 1 )].app_id;
                                await create_iam_user_app_data_post_like(settings_app_id, user1, user2);
                            }
                            break;
                        }
                        case 'POSTS_VIEW':
                        case 'POSTS_VIEW_ANONYMOUS':{
                            //4I.Create user account app data post view
                            //pick a random user setting from the user and return the app_id
                            const user_account_app_data_posts = demo_users.filter(user=>user.id == user1)[0].iam_user_app_data_post;
                            if (user_account_app_data_posts.length>0){
                                const settings_app_id = user_account_app_data_posts[Math.floor(1 + Math.random() * user_account_app_data_posts.length - 1 )].app_id;
                                await create_iam_user_app_data_post_view(settings_app_id, user1, user2 , social_type) ;
                            }
                            break;
                        }
                    }						
                }
            }
        }
        //5.Return result
        install_result.push({'iam_user': records_iam_user});
        install_result.push({'iam_user_app': records_iam_user_app});
        install_result.push({'iam_user_like': records_iam_user_like});
        install_result.push({'iam_user_view': records_iam_user_view});
        install_result.push({'iam_user_follow': records_iam_user_follow});
        install_result.push({'iam_user_app_data_post': records_iam_user_app_data_post});
        install_result.push({'iam_user_app_data_post_like': records_iam_user_app_data_post_like});
        install_result.push({'iam_user_app_data_post_view': records_iam_user_app_data_post_view});
        install_result.push({'app_data_resource_master': records_app_data_resource_master});
        install_result.push({'app_data_resource_detail': records_app_data_resource_detail});
        install_result.push({'app_data_resource_detail_data': records_app_data_resource_detail_data});
        install_result.push({'finished': new Date().toISOString()});
        server.ORM.db.Log.post({   app_id:parameters.app_id, 
                    data:{  object:'LogServerInfo', 
                            log:`Demo install result: ${install_result.reduce((result, current)=> result += `${Object.keys(current)[0]}:${Object.values(current)[0]} `, '')}`
                        }
                    });
        return {result:{info: install_result}, type:'JSON'};
    } catch (error) {
        /**@ts-ignore */
        return error.http?error:server.ORM.db.getError(parameters.app_id, 500, error);
    }
};
/**
* @name deleteDemo
* @description Demo uninstall
*              Deletes all demo users and send server side events of progress
* @function
* @memberof ROUTE_REST_API
* @param {{app_id:number,
*          idToken:string}} parameters
* @returns {Promise.<server['server']['response'] & {result?:{info: {}[]} }>}
*/
const deleteDemo = async parameters => {

    const result_demo_users = server.ORM.db.IamUser.get(parameters.app_id, null).result.filter((/**@type{server['ORM']['IamUser']}*/row)=>row.user_level==2);
    if (result_demo_users){
        let deleted_user = 0;
        if (result_demo_users.length>0){
            const delete_users = async () => {
                for (const user of result_demo_users){
                    server.socket.socketClientPostMessage({app_id:parameters.app_id, 
                                                    resource_id:null, 
                                                    data:{  data_app_id:null, 
                                                            iam_user_id: null,
                                                            idToken:parameters.idToken,
                                                            message: JSON.stringify({   part:deleted_user, 
                                                                                        total:result_demo_users.length, text:user.username}),
                                                            message_type:'PROGRESS'}});
                    //delete iam user
                    await server.ORM.db.IamUser.deleteRecordAdmin(parameters.app_id,user.id)
                    .then((/**@type{server['server']['response']}*/result)=>{
                        if (result.result )
                            deleted_user++;
                    });
                }
            };
            await delete_users().catch(error=>{
                if (error.http)
                    throw error;
                else
                    throw server.ORM.db.getError(parameters.app_id, 500, error);
            });
            //set demo key values to null
            const result_get = server.ORM.db.AppDataEntity.get({ app_id:parameters.app_id, resource_id:null, data:{data_app_id:null}});
            if(result_get.result){
                for (const row of result_get.result){
                    for (const key of Object.entries(row.Document??{})){
                        if (key[0]=='iam_user_id_owner' ||
                            key[0]=='merchant_id' ||
                            key[0]=='merchant_name' ||
                            key[0]=='merchant_api_url_payment_request_create' ||
                            key[0]=='merchant_api_url_payment_request_get_status' ||
                            key[0]=='merchant_api_secret' ||
                            key[0]=='merchant_public_key' ||
                            key[0]=='merchant_private_key' ||
                            key[0]=='merchant_vpa' ||
                            key[0]=='iam_user_id_anonymous' 
                        )
                            row.Document[key[0]] = null;
                    }
                    await server.ORM.db.AppDataEntity.update({ app_id:parameters.app_id,
                                                resource_id:row.id,
                                                /**@ts-ignore */
                                                data:{Document:row.Document}});
                }
            }
            else
                throw result_get;
            server.ORM.db.Log.post({  app_id:parameters.app_id, 
                        data:{  object:'LogServerInfo', 
                                log:`Demo uninstall count: ${deleted_user}`
                            }
                        });
            return {result:{info: [{'count': deleted_user}]}, type:'JSON'};
        }
        else{
            server.ORM.db.Log.post({  app_id:parameters.app_id, 
                data:{  object:'LogServerInfo', 
                        log:`Demo uninstall count: ${result_demo_users.length}`
                    }
                });
            return {result:{info: [{'count': result_demo_users.length}]},type:'JSON'};
        }
    }
    else
        return result_demo_users;
};
/**
 * @name postConfigDefault
 * @description Install default config
 * @function
 * @returns {Promise<void>}
 */
const postConfigDefault = async () => {
    const updatedConfigSecurity = await getConfigSecurityUpdate({   
                                            pathConfigServer:'/server/install/default/ConfigServer.json',
                                            pathServiceRegistry:'/server/install/default/ServiceRegistry.json'
    });
    /**
     * @type{[  [server['ORMMetaData']['DbObject'], server['ORMMetaData']['DbObject'][]],
     *          [server['ORMMetaData']['DbObject'], server['ORM']['ConfigServer']],
     *          [server['ORMMetaData']['DbObject'], server['ORM']['ServiceRegistry'][]]
     *       ]}
     */
    const config_obj = [
                            ['DbObjects',                       await getDefaultObject('DbObjects')],
                            ['ConfigServer',                    updatedConfigSecurity.ConfigServer],
                            ['ServiceRegistry',                 updatedConfigSecurity.ServiceRegistry]
                        ]; 
    //create directories in orm
    await server.ORM.postFsDir(['/data',
                            '/data' + config_obj[1][1].SERVER.filter(key=>'PATH_JOBS' in key)[0].PATH_JOBS,
                            '/data/db',
                            '/data/db/journal',
                            '/data/microservice'
                            ])
    .catch((/**@type{server['server']['error']}*/err) => {
        throw err;
    }); 
    
    //install default microservice configuration
    updateMicroserviceSecurity({serveRegistry:              config_obj[2][1],
                                pathMicroserviceSource:     '/server/install/default/microservice/',
                                pathMicroserviceDestination:'/data/microservice/'});
    //install default microservice files
    for (const file of ['common.js', 'crypto.js', 'types.js'])
        await fs.promises.copyFile( server.ORM.serverProcess.cwd() + `/server/install/default/microservice/${file}`, 
                                    server.ORM.serverProcess.cwd() + `/data/microservice/${file}`)
            .catch(error=>{throw error;});
    
    //write files to ORM
    for (const config_row of config_obj){
                                //Object
        await server.ORM.postFsAdmin(  config_row[0], 
                                //Content
                                config_row[1], 
                                //type
                                config_row[0]=='DbObjects'?'DOCUMENT':config_obj[0][1].filter(row=>row.name==config_row[0])[0].type); 
    }
};
/**
 * @name postDataDefault
 * @description Install default data
 * @function
 * @returns {Promise<void>}
 */
const postDataDefault = async () => {
    
    /**
     * @type{[  [server['ORMMetaData']['DbObject'], server['ORM']['ConfigRestApi']],
     *          [server['ORMMetaData']['DbObject'], server['ORM']['IamUser'][]],
     *          [server['ORMMetaData']['DbObject'], server['ORM']['App'][]],
     *          [server['ORMMetaData']['DbObject'], server['ORM']['AppDataEntityResource'][]],
     *          [server['ORMMetaData']['DbObject'], server['ORM']['AppDataEntity'][]],
     *          [server['ORMMetaData']['DbObject'], server['ORM']['AppDataResourceDetailData'][]],
     *          [server['ORMMetaData']['DbObject'], server['ORM']['AppDataResourceDetail'][]],
     *          [server['ORMMetaData']['DbObject'], server['ORM']['AppDataResourceMaster'][]],
     *          [server['ORMMetaData']['DbObject'], server['ORM']['AppModule'][]],
     *          [server['ORMMetaData']['DbObject'], server['ORM']['AppData'][]],
     *          [server['ORMMetaData']['DbObject'], server['ORM']['AppTranslation'][]]
     *       ]}
     */
    const config_obj = [
                            ['ConfigRestApi',                   await getDefaultObject('ConfigRestApi')],
                            ['IamUser',                         await getDefaultObject('IamUser')],
                            ['App',                             await getDefaultObject('App')],
                            ['AppDataEntityResource',           await getDefaultObject('AppDataEntityResource')],
                            ['AppDataEntity',                   await getDefaultObject('AppDataEntity')],
                            ['AppDataResourceDetailData',       await getDefaultObject('AppDataResourceDetailData')],
                            ['AppDataResourceDetail',           await getDefaultObject('AppDataResourceDetail')],
                            ['AppDataResourceMaster',           await getDefaultObject('AppDataResourceMaster')],
                            ['AppModule',                       await getDefaultObject('AppModule')],
                            ['AppData',                         await getDefaultObject('AppData')],
                            ['AppTranslation',                  await getDefaultObject('AppTranslation')]
                        ]; 
    
    //write files to ORM
    //read default where type is configured
    /**@type{server['ORMMetaData']['DbObject'][]}*/
    const DbObjects = await getDefaultObject('DbObjects');
    
    for (const config_row of config_obj){
        //Object
        await server.ORM.postFsAdmin(  config_row[0], 
            //Content
            config_row[1], 
            //type
            DbObjects.filter(row=>row.name==config_row[0])[0].type); 
    }
};
/**
 * @name updateConfigSecrets
 * @description Updates configuration secrets in ConfigServer, ServiceRegistry and IamUser
 * @function
 * @returns {Promise<void>}
 */
const updateConfigSecrets = async () =>{
    
    //get ConfigServer and ServiceRegistry with new secrets
    const updatedConfigSecurity = await getConfigSecurityUpdate({
                                            pathConfigServer:   null,
                                            pathServiceRegistry:null
                                        });
    //get users and password
    const users = await new Promise(resolve=>{(async () =>{ 
        /**@type{server['ORM']['IamUser'][]} */
        const users = server.ORM.db.IamUser.get(0, null).result??[];
        for (const user of users){
            /**@ts-ignore */
            user.password =  await server.security.securityPasswordGet({app_id:0, password_encrypted:user.password});
        }
        resolve(users);
    })();});                                                              
    //update ConfigServer
    await server.ORM.db.ConfigServer.update({ app_id:0,
                                data:{  config: updatedConfigSecurity.ConfigServer}});
    //update IamUser using new secrets
    for (const user of users){
        await server.ORM.db.IamUser.updateAdmin({ app_id:0, 
                                            resource_id:user.id, 
                                            data:{password:user.password}
                                        });
    }
    //update ServiceRegistry with new secrets
    for(const record of updatedConfigSecurity.ServiceRegistry??[])
        await server.ORM.db.ServiceRegistry.update({app_id:0,
                                            resource_id:record.id,
                                            data:record});

    await updateMicroserviceSecurity({  serveRegistry:               updatedConfigSecurity.ServiceRegistry??[],
                                        pathMicroserviceSource:     '/data/microservice/',
                                        pathMicroserviceDestination:'/data/microservice/'});
};
/**
 * @name updateMicroserviceSecurity
 * @description Reads key pair in serviceregistry and updates them in microservice config files
 * @function
 * @param {{serveRegistry:server['ORM']['ServiceRegistry'][],
 *          pathMicroserviceSource:      string,
 *          pathMicroserviceDestination:   string}} parameters
 * @returns {Promise.<void>}
 */
const updateMicroserviceSecurity = async parameters =>{
    for (const file of ['BATCH']){
        /**@type{server['serviceregistry']['microservice_local_config']} */
        const content = await fs.promises.readFile(server.ORM.serverProcess.cwd() + `${parameters.pathMicroserviceSource}${file}.json`).then(filebuffer=>JSON.parse(filebuffer.toString()));
        content.uuid = parameters.serveRegistry.filter(microservice=>microservice.name==content.name)[0].uuid;
        content.secret = parameters.serveRegistry.filter(microservice=>microservice.name==content.name)[0].secret;
        await fs.promises.writeFile(server.ORM.serverProcess.cwd() + `${parameters.pathMicroserviceDestination}${file}.json`, 
                                                            JSON.stringify(content, undefined, 2),'utf8');
    }
};
/**
 * @name updateConfigSecurity
 * @description Reads config files with security and return documents with updates security values
 *              If path is empty then object is read from db
 * @function
 * @param {{pathConfigServer:      string|null,
 *          pathServiceRegistry:   string|null}} parameters
 * @returns {Promise.<{ ConfigServer:   server['ORM']['ConfigServer'],
 *                      ServiceRegistry:server['ORM']['ServiceRegistry'][]}>}
 */
const getConfigSecurityUpdate = async parameters =>{
    const APP_PORTFOLIO_TITLE = 'App Portfolio';
    
    return {
        ConfigServer:await new Promise(resolve=>{(async () =>{ 
                            /**@type{server['ORM']['ConfigServer']}*/
                            const content = parameters.pathConfigServer?await fs.promises.readFile(server.ORM.serverProcess.cwd() + parameters.pathConfigServer)
                                                .then(file=>JSON.parse(file.toString())):server.ORM.getObject(0,'ConfigServer');
                            //generate secrets
                            content.SERVICE_IAM.map((/**@type{server_db_config_server_service_iam}*/row)=>{
                                for (const key of Object.keys(row)){
                                    if (key== 'MICROSERVICE_TOKEN_SECRET')
                                        row.MICROSERVICE_TOKEN_SECRET = server.security.securitySecretCreate();
                                    if (key== 'ADMIN_TOKEN_SECRET')
                                        row.ADMIN_TOKEN_SECRET = server.security.securitySecretCreate();        
                                    if (key== 'USER_TOKEN_APP_ACCESS_SECRET')
                                        row.USER_TOKEN_APP_ACCESS_SECRET = server.security.securitySecretCreate();
                                    if (key== 'USER_TOKEN_APP_ACCESS_VERIFICATION_SECRET')
                                        row.USER_TOKEN_APP_ACCESS_VERIFICATION_SECRET = server.security.securitySecretCreate();
                                    if (key== 'USER_TOKEN_APP_ID_SECRET')
                                        row.USER_TOKEN_APP_ID_SECRET = server.security.securitySecretCreate();
                                    
                                    
                                    if (key== 'USER_PASSWORD_ENCRYPTION_KEY')
                                        row.USER_PASSWORD_ENCRYPTION_KEY = server.security.securitySecretCreate(false, 32);
                                    if (key== 'USER_PASSWORD_INIT_VECTOR')
                                        row.USER_PASSWORD_INIT_VECTOR = server.security.securitySecretCreate(false, 16);
                                }
                            });
                            //set server metadata
                            content.METADATA.CONFIGURATION = content.METADATA.CONFIGURATION ?? APP_PORTFOLIO_TITLE;
                            content.METADATA.MODIFIED      = content.METADATA.CREATED?`${new Date().toISOString()}`:'';
                            content.METADATA.CREATED       = content.METADATA.CREATED ?? `${new Date().toISOString()}`;
                            resolve(content);
                        })();}),
        ServiceRegistry:parameters.pathServiceRegistry?await new Promise(resolve=>{(async () =>{ 
                                /**@type{server['ORM']['ServiceRegistry'][]}*/
                                const content = await fs.promises.readFile(server.ORM.serverProcess.cwd() + parameters.pathServiceRegistry)
                                                    .then(file=>JSON.parse(file.toString()));
                                for (const row of content){
                                    row.uuid = server.security.securityUUIDCreate();
                                    row.secret = Buffer.from(JSON.stringify(await server.security.securityTransportCreateSecrets()),'utf-8').toString('base64');
                                }
                                resolve(content);
                            })();}):server.ORM.getObject(0,'ServiceRegistry').result
    };
};
export{ postDemo, deleteDemo, 
        postConfigDefault, 
        postDataDefault,
        updateConfigSecrets, 
        updateMicroserviceSecurity};
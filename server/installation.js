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
 * @param {server['ORM']['MetaData']['AllObjects']} object
 */
const getDefaultObject = async object => 
    await fs.promises.readFile(server.info.serverProcess.cwd() + `/server/install/default/${object}.json`)
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
    install_result.push({'⌚': new Date().toISOString()});
    const fileBuffer = await fs.promises.readFile(`${server.info.serverProcess.cwd()}${DB_DEMO_PATH}${DB_DEMO_FILE}`, 'utf8');
    /**@type{server['ORM']['Type']['DemoData'][]}*/
    const demo_users = JSON.parse(fileBuffer.toString()).DemoUsers;
    //create social records
    /**@type{('IamUserLike'|'IamUserView'|'IamUserViewX'|'IamUserFollow'|'IamUserAppDataPostLike'|'IamUserAppDataPostView'|'IamUserAppDataPostViewX')[]} */
    const social_types = ['IamUserLike', 'IamUserView', 'IamUserViewX', 'IamUserFollow', 'IamUserAppDataPostLike', 'IamUserAppDataPostView', 'IamUserAppDataPostViewX'];
    let records_iam_user = 0;
    let records_iam_user_app = 0;
    let records_iam_user_app_data_post = 0;
    let records_app_data_resource_master = 0;
    let records_app_data_resource_detail = 0;
    let records_app_data_resource_detail_data = 0;
    let install_count=0;
    const install_total_count = demo_users.length + social_types.length;
    install_count++;
    const common_app_id = server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_COMMON_APP_ID.default) ?? 0;
    const admin_app_id = server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_ADMIN_APP_ID.default);

    try {
        /**
        * Create demo users
        * @param {server['ORM']['Type']['DemoData'][]} demo_users 
        * @returns {Promise.<void>}
        */
        const create_users = async (demo_users) =>{
                /**
                * 
                * @param {server['ORM']['Type']['DemoData']} demo_user
                * @returns 
                */
                const create_update_id = async demo_user=>{
                    /**@ts-ignore @type{server['ORM']['Object']['IamUser']}}*/
                    const data_create = {   Username:           demo_user.Username,
                                            Bio:                demo_user.Bio,
                                            Avatar:             demo_user.Avatar,
                                            Password:           parameters.data.demo_password ?? '',
                                            PasswordReminder:   null,
                                            Active:             1,
                                            Private:            0,
                                            UserLevel:          2,
                                            Type:               'USER'
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
                    demo_user.Id = await create_update_id(demo_user).then(user=>user.result.InsertId);
                    records_iam_user++;
                }
        };
        /**
        * Create iam user app
        * @param {number} app_id 
        * @param {number} iam_user_id
        * @returns {Promise.<server['ORM']['MetaData']['common_result_insert']>}
        */
        const create_iam_user_app = async (app_id, iam_user_id) =>{
            return new Promise((resolve, reject) => {
                server.ORM.db.IamUserApp.post(parameters.app_id, 
                    /**@ts-ignore */
                    {AppId:app_id, Document:{
                                        PreferenceTheme: null, 
                                        PreferenceLocale: null, 
                                        PreferenceTimezone: null, 
                                        PreferenceDirection: null, 
                                        PreferenceArabicScript: null,
                                        Custom: null}, IamUserId:iam_user_id
                                        })
                .then((/**@type{server['server']['response']}*/result)=>{
                    if(result.result){
                        if (result.result.AffectedRows == 1)
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
        * @param {server['ORM']['Object']['IamUserAppDataPost']} data 
        * @returns {Promise.<null>}
        */
        const create_iam_user_app_data_post = async data => {
            return new Promise((resolve, reject) => {
                server.ORM.db.IamUserAppDataPost.post({ app_id:parameters.app_id, 
                                                        data:{  iam_user_app_id:data.IamUserAppId,
                                                                document:data.Document}})
                .then((/**@type{server['server']['response']}*/result)=>{
                    if(result.result){
                        if (result.result.data?.AffectedRows == 1)
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
         * @param {server['ORM']['Object']['AppDataResourceMaster']} data 
         * @returns {Promise.<number>}
         */
        const create_app_data_resource_master = async data => {
            return new Promise((resolve, reject) => {
                server.ORM.db.AppDataResourceMaster.post({app_id:parameters.app_id, data:data})
                .then((/**@type{server['server']['response']}*/result)=>{
                    if(result.result){
                        if (result.result.AffectedRows == 1)
                            records_app_data_resource_master++;
                        resolve(result.result.InsertId);
                    }
                    else
                        reject(result);
                });
            });
        };
        /**
        * 
        * @param {server['ORM']['Object']['AppDataResourceDetail']} data 
        * @returns {Promise.<number>}
        */
        const create_app_data_resource_detail = async data => {
            return new Promise((resolve, reject) => {
                server.ORM.db.AppDataResourceDetail.post({app_id:parameters.app_id, data:data})
                .then((/**@type{server['server']['response']}*/result)=>{
                    if(result.result){
                        if (result.result.AffectedRows == 1)
                            records_app_data_resource_detail++;
                        resolve(result.result.InsertId);
                    }
                    else
                        reject(result);
                });
            });
        };
        /**
        * @description Update app_data entity with additional keys
        * @param {number} user_account_post_app_id 
        * @param {server['ORM']['Type']['DemoData']['AppDataResourceMaster'][0]['AppDataEntity']} data 
        * @returns {Promise.<number>}
        */
        const update_app_data_entity = async (user_account_post_app_id,data) => {
            const result_get = server.ORM.db.AppDataEntity.get({   app_id:user_account_post_app_id, 
                                                    /**@ts-ignore */
                                                    resource_id:data.Id, 
                                                    data:{data_app_id:null}});
            if(result_get.result){
                const update_Document = result_get.result[0].Document;
                for (const key of Object.entries(data?.Document??{}))
                    update_Document[key[0]] = key[1];
                const result_update = await server.ORM.db.AppDataEntity.update({   app_id:user_account_post_app_id, 
                                                                            /**@ts-ignore */
                                                                            resource_id:data.Id, 
                                                                            /**@ts-ignore */
                                                                            data:{Document:update_Document}});
                if(result_update.result){
                    if (result_update.result.AffectedRows == 1)
                        records_app_data_resource_detail++;
                    return result_update.result.AffectedRows;
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
        * @param {server['ORM']['Object']['AppDataResourceDetailData']} data 
        * @returns {Promise.<number>}
        */
        const create_app_data_resource_detail_data = async (user_account_post_app_id, data) => {
            return new Promise((resolve, reject) => {
                server.ORM.db.AppDataResourceDetailData.post({app_id:user_account_post_app_id, data:data})
                .then((/**@type{server['server']['response']}*/result)=>{
                    if(result.result){
                        if (result.result.AffectedRows == 1)
                            records_app_data_resource_detail_data++;
                        resolve(result.result.InsertId);
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
                                                                            total:install_total_count, text:'🔑...'}),
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
                                                                                total:install_total_count, text:demo_user.Username}),
                                                    message_type:'PROGRESS'}});
            install_count++;

            //3A.Generate vpa for each user that can be saved both in resource and apps configuration
            const demo_vpa = server.security.securityUUIDCreate();
            //3B.Create iam_user_app record
            //save iam_user_app.Id for creating records with this FK
            const iam_user_app_id = await create_iam_user_app(demo_user.IamUserApp.AppId, 
                                                                /**@ts-ignore */
                                                                demo_user.Id).then(result=>{
                                            if (result)
                                                return result.InsertId;
                                            else
                                                throw server.ORM.getError(parameters.app_id, 500, '');
                                        });
            //create for others apps except common, admin and already created
            for (const app of server.ORM.db.App.get({app_id:parameters.app_id,resource_id:null}).result
                            .filter((/**@type{server['ORM']['Object']['App']}*/row)=>row.Id!=common_app_id && row.Id!=admin_app_id && row.Id!=demo_user.IamUserApp.AppId)){
                await create_iam_user_app(app.Id, 
                                        /**@ts-ignore */
                                        demo_user.Id);
            }                                    
                
            //3C.Create user posts if any
            for (const demo_user_account_app_data_post of demo_user.IamUserAppDataPost){
                let settings_header_image;
                //use file in settings or if missing then use filename same as demo username
                if (demo_user_account_app_data_post.Document.ImageHeaderImageImg)
                    settings_header_image = `${demo_user_account_app_data_post.Document.ImageHeaderImageImg}.webp`;
                else
                    settings_header_image = `${demo_user.Username}.webp`;
                /**@type{Buffer} */
                const image = await fs.promises.readFile(`${server.info.serverProcess.cwd()}${DB_DEMO_PATH}${settings_header_image}`);
                /**@ts-ignore */
                const image_string = 'data:image/webp;base64,' + Buffer.from(image, 'binary').toString('base64');
                //update settings with loaded image into BASE64 format
                demo_user_account_app_data_post.Document.ImageHeaderImageImg = image_string;
                //use random day and month themes
                //day 10001-10010
                demo_user_account_app_data_post.Document.DesignThemeDayId = Math.floor(10001 + Math.random() * 10);
                //month 20001-20022
                demo_user_account_app_data_post.Document.DesignThemeMonthId = Math.floor(20001 + Math.random() * 22);
                demo_user_account_app_data_post.Document.DesignThemeYearId = 30001;
                /**@type{server['ORM']['Object']['IamUserAppDataPost']} */
                const Document_user_account_app_data_post = {
                                                /**@ts-ignore */
                                                Document: demo_user_account_app_data_post.Document,
                                                /**@ts-ignore */
                                                IamUserAppId: iam_user_app_id
                                            };	
                
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
                                return demo_user.Id?.toString()??''
                            default:{
                                //replace if containing HOST parameter
                                if (key_name[1]!=null && typeof key_name[1]=='string' && key_name[1].indexOf('<HOST/>')>-1){
                                    //use HTTP configuration as default
                                    const HOST = server.ORM.OpenApiServers.filter(row=>row['x-type'].default=='APP')[0].variables.host.default;
                                    const HTTP_PORT = server.ORM.UtilNumberValue(server.ORM.OpenApiServers.filter(row=>row['x-type'].default=='APP')[0].variables.port.default);
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
            for (const resource_master of demo_user.AppDataResourceMaster ?? []){
                /**@ts-ignore @type{server['ORM']['Object']['AppDataResourceMaster']} */
                const data = {  
                                IamUserAppId:               iam_user_app_id ??null,
                                AppDataEntityResourceId:    resource_master.AppDataEntityResourceId,
                                Document:                   await demo_data_update(resource_master)
                };
                /**@ts-ignore */
                const master_id = await create_app_data_resource_master(data);
                //3E.Update app data entity record if anything to update
                if (resource_master.AppDataEntity && resource_master.AppDataEntity.Id){
                    //set values used in app data master
                    for (const key of Object.entries(data.Document??{})){
                        if (key[0]!='Id' &&
                            (key[0]=='MerchantId' ||
                            key[0]=='MerchantName' ||
                            key[0]=='MerchantApiUrlPaymentRequestCreate' ||
                            key[0]=='MerchantApiUrlPaymentRequestGetStatus' ||
                            key[0]=='MerchantApiSecret' ||
                            key[0]=='MerchantPublicKey' ||
                            key[0]=='MerchantPrivateKey' ||
                            key[0]=='MerchantVpa')
                        )
                            resource_master.AppDataEntity.Document[key[0]] = key[1];
                    }
                    //set demo user id values in app data entity if used
                    if (resource_master.AppDataEntity.Document?.IamUserIdOwner)
                        resource_master.AppDataEntity.Document.IamUserIdOwner = demo_user.Id??0;
                    if (resource_master.AppDataEntity.Document?.IamUserIdAnonymous)
                        resource_master.AppDataEntity.Document.IamUserIdAnonymous = demo_user.Id??0;
                    await update_app_data_entity(parameters.app_id, resource_master.AppDataEntity);
                }
                    
                //3F.Create app data detail records if any
                for (const resource_detail of resource_master.AppDataResourceDetail ?? []){
                    /**@ts-ignore @type{server['ORM']['Object']['AppDataResourceDetail']} */
                    const data = {  AppDataResourceMasterId                    : master_id,
                                    AppDataEntityResourceId                    : resource_detail.AppDataEntityResourceId,
                                    AppDataResourceMasterAttributeId           : resource_detail.AppDataResourceMasterAttributeId,
                                    Document                                   : await demo_data_update(resource_detail)
                                    };
                    const detail_id = await create_app_data_resource_detail(data);
                    //3G.Create app data detail data records if any
                    for (const resource_detail_data of resource_detail.AppDataResourceDetailData ?? []){
                        /**@ts-ignore @type{server['ORM']['Object']['AppDataResourceDetailData']} */
                        const data ={   AppDataResourceDetailId            : detail_id,
                                        AppDataResourceMasterAttributeId   : resource_detail_data.AppDataResourceMasterAttributeId,
                                        Document                           : await demo_data_update(resource_detail_data)
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
                        if (result.result.AffectedRows == 1)
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
        * @param {server['ORM']['Object']['IamUserView']} data 
        * @returns {Promise.<null>}
        */
        const create_iam_user_view = async (app_id, data ) =>{
            return new Promise((resolve, reject) => {
                server.ORM.db.IamUserView.post(app_id, data)
                .then((/**@type{server['server']['response']}*/result) => {
                    if(result.result){
                        if (result.result.AffectedRows == 1)
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
                                    
                                    data:{iam_user_id:id, iam_user_id_follow:id_follow}})
                .then((/**@type{server['server']['response']}*/result)=>{
                    if(result.result){
                        if (result.result.AffectedRows == 1)
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
                /**@type{server['server']['response'] & {result?:server['ORM']['Object']['AppDataResourceDetailData'][]}} */
                const result_posts = server.ORM.db.IamUserAppDataPost.get({app_id:parameters.app_id, resource_id:null, data:{iam_user_id:user1,data_app_id:app_id}});
                if (result_posts.result){
                    const random_posts_index = Math.floor(1 + Math.random() * result_posts.result.length - 1 );
                    server.ORM.db.IamUserAppDataPostLike.post({app_id:parameters.app_id, 
                                                            data:{  iam_user_id:user2,
                                                                    data_app_id:app_id,
                                                                    iam_user_app_data_post_id:result_posts.result[random_posts_index].Id}})
                    .then((/**@type{server['server']['response']}*/result) => {
                        if (result.result){
                            if (result.result.AffectedRows == 1)
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
        * @description  Create user account app setting view
        * @param {number} app_id 
        * @param {number} user1 
        * @param {number} user2 
        * @param {'IamUserLike'|'IamUserView'|'IamUserViewX'|'IamUserFollow'|'IamUserAppDataPostLike'|'IamUserAppDataPostView'|'IamUserAppDataPostViewX'} social_type 
        * @returns {Promise.<null>}
        */
        const create_iam_user_app_data_post_view = async (app_id, user1, user2 , social_type) =>{
            return new Promise((resolve, reject) => {
                /**@type{server['server']['response'] & {result?:server['ORM']['Object']['IamUserAppDataPost'][]}} */
                const result_posts = server.ORM.db.IamUserAppDataPost.get({app_id:parameters.app_id, resource_id:null, data:{iam_user_id:user1, data_app_id:app_id}});
                if (result_posts.result){
                    //choose random post from user
                    const random_index = Math.floor(1 + Math.random() * result_posts.result.length -1);
                    let iam_user_id;
                    if (social_type == 'IamUserAppDataPostView')
                        iam_user_id = user2;
                    else
                        iam_user_id = null;
                    server.ORM.db.IamUserAppDataPostView.post(parameters.app_id, 
                                                                    /**@ts-ignore */
                                                                    {
                                                                        Document: { client_ip: null,
                                                                                    client_user_agent: null},
                                                                        IamUserAppId: iam_user_id?
                                                                                            server.ORM.db.IamUserApp
                                                                                                .get({  app_id:app_id, 
                                                                                                        resource_id:null, 
                                                                                                        data:{  iam_user_id:user2, 
                                                                                                                data_app_id:app_id}}).result[0].Id:
                                                                                                null,
                                                                        IamUserAppDataPostId: result_posts.result[random_index].Id
                                                                    })
                    .then((/**@type{server['server']['response']}*/result)=>{
                        if (result.result){
                            if (result.result.AffectedRows == 1)
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
                const random_include_id1 = demo_users[random_array_index1].Id;
                /**@ts-ignore */
                if (random_users1.length <sample_amount && !random_users1.includes(random_include_id1) ){
                    /**@ts-ignore */
                    random_users1.push(demo_users[random_array_index1].Id);
                }
                /**@ts-ignore */
                if (random_users2.length <sample_amount && !random_users2.includes(demo_users[random_array_index2].Id)){
                    /**@ts-ignore */
                    random_users2.push(demo_users[random_array_index2].Id);
                }
            }
            //4B.Loop random users group 1
            for (const user1 of random_users1){
                //4C.Loop random users group 2
                for(const user2 of random_users2){
                    switch (social_type){
                        case 'IamUserLike':{
                            //4D.Create user like
                            await create_iam_user_like(parameters.app_id, user1, user2);
                            break;
                        }
                        case 'IamUserView':{
                            //4E.Create user view by a user
                            await create_iam_user_view(parameters.app_id, 
                                                            /**@ts-ignore */
                                                            {   IamUserId: user1,
                                                                IamUserIdView: user2,
                                                                ClientIp: null,
                                                                ClientUserAgent: null
                                                            });
                            break;
                        }
                        case 'IamUserViewX':{
                            //4F.Create user view by anonymous
                            await create_iam_user_view(parameters.app_id, 
                                                            /**@ts-ignore */
                                                            {
                                                                IamUserId: null,
                                                                IamUserIdView: user1,
                                                                ClientIp: null,
                                                                ClientUserAgent: null
                                                            });
                            break;
                        }
                        case 'IamUserFollow':{
                            //4G.Create user follow
                            await create_iam_user_follow(parameters.app_id, user1, user2);
                            break;
                        }
                        case 'IamUserAppDataPostLike':{
                            //4H.Create user account app data post like
                            //pick a random user setting from the user and return the app_id
                            const user_account_app_data_posts = demo_users.filter(user=>user.Id == user1)[0].IamUserAppDataPost;
                            if (user_account_app_data_posts.length>0){
                                const settings_app_id = user_account_app_data_posts[Math.floor(1 + Math.random() * user_account_app_data_posts.length - 1 )].AppId;
                                await create_iam_user_app_data_post_like(settings_app_id, user1, user2);
                            }
                            break;
                        }
                        case 'IamUserAppDataPostView':
                        case 'IamUserAppDataPostViewX':{
                            //4I.Create user account app data post view
                            //pick a random user setting from the user and return the app_id
                            const user_account_app_data_posts = demo_users.filter(user=>user.Id == user1)[0].IamUserAppDataPost;
                            if (user_account_app_data_posts.length>0){
                                const settings_app_id = user_account_app_data_posts[Math.floor(1 + Math.random() * user_account_app_data_posts.length - 1 )].AppId;
                                await create_iam_user_app_data_post_view(settings_app_id, user1, user2 , social_type) ;
                            }
                            break;
                        }
                    }						
                }
            }
        } 
        //5.Return result
        install_result.push({'IamUser': records_iam_user});
        install_result.push({'IamUserApp': records_iam_user_app});
        install_result.push({'IamUserLike': records_iam_user_like});
        install_result.push({'IamUSerView': records_iam_user_view});
        install_result.push({'IamUserFollow': records_iam_user_follow});
        install_result.push({'IamUserAppDataPost': records_iam_user_app_data_post});
        install_result.push({'IamUserAppDataPostLike': records_iam_user_app_data_post_like});
        install_result.push({'IamUserAppDataPostView': records_iam_user_app_data_post_view});
        install_result.push({'AppDataResourceMaster': records_app_data_resource_master});
        install_result.push({'AppDataResourceDetail': records_app_data_resource_detail});
        install_result.push({'AppDataResourceDetailData': records_app_data_resource_detail_data});
        install_result.push({'⌚': new Date().toISOString()});
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
    /**@type{(server['ORM']['Object']['IamUser'] & {Id:number})[]} */
    const result_demo_users = server.ORM.db.IamUser.get(parameters.app_id, null).result.filter((/**@type{server['ORM']['Object']['IamUser']}*/row)=>row.UserLevel==2);
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
                                                                                        total:result_demo_users.length, text:user.Username}),
                                                            message_type:'PROGRESS'}});
                    //delete iam user
                    await server.ORM.db.IamUser.deleteRecordAdmin(parameters.app_id,user.Id)
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
                    throw server.ORM.getError(parameters.app_id, 500, error);
            });
            //set demo key values to null
            const result_get = server.ORM.db.AppDataEntity.get({ app_id:parameters.app_id, resource_id:null, data:{data_app_id:null}});
            if(result_get.result){
                for (const row of result_get.result){
                    for (const key of Object.entries(row.Document??{})){
                        if (key[0]=='IamUserIdOwner' ||
                            key[0]=='MerchantId' ||
                            key[0]=='MerchantName' ||
                            key[0]=='MerchantApiUrlPaymentRequestCreate' ||
                            key[0]=='MerchantApiUrlPaymentRequestGetStatus' ||
                            key[0]=='MerchantApiSecret' ||
                            key[0]=='MerchantPublicKey' ||
                            key[0]=='MerchantPrivateKey' ||
                            key[0]=='MerchantVpa' ||
                            key[0]=='IamUserIdAnonymous' 
                        )
                            row.Document[key[0]] = null;
                    }
                    await server.ORM.db.AppDataEntity.update({ app_id:parameters.app_id,
                                                resource_id:row.Id,
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
            return {result:{info: [{'∑': deleted_user}]}, type:'JSON'};
        }
        else{
            server.ORM.db.Log.post({  app_id:parameters.app_id, 
                data:{  object:'LogServerInfo', 
                        log:`Demo uninstall count: ${result_demo_users.length}`
                    }
                });
            return {result:{info: [{'∑': result_demo_users.length}]},type:'JSON'};
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
                                            pathOpenApi:'/server/install/default/OpenApi.json',
                                            pathServiceRegistry:'/server/install/default/ServiceRegistry.json'
    });
    /**
     * @type{[  [server['ORM']['MetaData']['AllObjects'], server['ORM']['MetaData']['Object'][]],
     *          [server['ORM']['MetaData']['AllObjects'], server['ORM']['Object']['OpenApi']],
     *          [server['ORM']['MetaData']['AllObjects'], server['ORM']['Object']['ServiceRegistry'][]]
     *       ]}
     */
    const config_obj = [
                            ['ORM',       await getDefaultObject('ORM')],
                            ['OpenApi',         updatedConfigSecurity.OpenApi],
                            ['ServiceRegistry', updatedConfigSecurity.ServiceRegistry]
                        ]; 
    //create directories in orm
    await server.ORM.postFsDir(['/data',
                            '/data' + config_obj[1][1].components.parameters.config.SERVER_PATH_JOBS.default,
                            '/data/db',
                            '/data/db/journal',
                            '/data/microservice'
                            ])
    .catch((/**@type{server['server']['error']}*/err) => {
        throw err;
    }); 
    //update default environment in OpenApi
    const app_host      = server.info.serverProcess.argv[3];
    const app_port      = server.ORM.UtilNumberValue(server.info.serverProcess.argv[4]);
	const admin_port    = server.ORM.UtilNumberValue(server.info.serverProcess.argv[5]);
    for (const server of config_obj[1][1].servers){
        switch (server['x-type'].default){
            case 'APP':{
                server.variables.host.default = app_host;
                server.variables.port.default = app_port ?? 80;
                break;
            }
            case 'ADMIN':{
                server.variables.host.default = app_host;
                server.variables.port.default = admin_port ?? 80;
                break;
            }
            case 'REST_API':{
                server.variables.host.default = app_host;
                server.variables.port.default = app_port ?? 80;
                break;
            }
            case 'NOHANGING_HTTPS':{
                //must remain 443 due to browser hangning issue if not used
                server.variables.host.default = app_host;
                break;
            }
        }
    }
        
    //install default microservice configuration
    updateMicroserviceSecurity({serveRegistry:              config_obj[2][1],
                                pathMicroserviceSource:     '/server/install/default/microservice/',
                                pathMicroserviceDestination:'/data/microservice/',
                                init:                      true});
    
    //write files to ORM
    for (const config_row of config_obj){
                                //Object
        await server.ORM.postFsAdmin(  config_row[0], 
                                //Content
                                config_row[1], 
                                //type
                                config_row[0]=='ORM'?'DOCUMENT':config_obj[0][1].filter(row=>row.Name==config_row[0])[0].Type); 
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
     * @type{[  [server['ORM']['MetaData']['AllObjects'], server['ORM']['Object']['IamUser'][]],
     *          [server['ORM']['MetaData']['AllObjects'], server['ORM']['Object']['App'][]],
     *          [server['ORM']['MetaData']['AllObjects'], server['ORM']['Object']['AppDataEntityResource'][]],
     *          [server['ORM']['MetaData']['AllObjects'], server['ORM']['Object']['AppDataEntity'][]],
     *          [server['ORM']['MetaData']['AllObjects'], server['ORM']['Object']['AppDataResourceDetailData'][]],
     *          [server['ORM']['MetaData']['AllObjects'], server['ORM']['Object']['AppDataResourceDetail'][]],
     *          [server['ORM']['MetaData']['AllObjects'], server['ORM']['Object']['AppDataResourceMaster'][]],
     *          [server['ORM']['MetaData']['AllObjects'], server['ORM']['Object']['AppModule'][]],
     *          [server['ORM']['MetaData']['AllObjects'], server['ORM']['Object']['AppData'][]],
     *          [server['ORM']['MetaData']['AllObjects'], server['ORM']['Object']['AppTranslation'][]]
     *       ]}
     */
    const config_obj = [
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
    /**@type{server['ORM']['MetaData']['Object'][]}*/
    const ORM = await getDefaultObject('ORM');
    
    for (const config_row of config_obj){
        //Object
        await server.ORM.postFsAdmin(  config_row[0], 
            //Content
            config_row[1], 
            //type
            ORM.filter(row=>row.Name==config_row[0])[0].Type); 
    }
};
/**
 * @name updateConfigSecrets
 * @description Updates configuration secrets in OpenApi, ServiceRegistry and IamUser
 * @function
 * @returns {Promise<void>}
 */
const updateConfigSecrets = async () =>{
    
    //get OpenApi and ServiceRegistry with new secrets
    const updatedConfigSecurity = await getConfigSecurityUpdate({
                                            pathOpenApi:   null,
                                            pathServiceRegistry:null
                                        });
    //get users and password
    /**@type{server['ORM']['Object']['IamUser'][]} */
    const users = await new Promise(resolve=>{(async () =>{ 
        /**@type{server['ORM']['Object']['IamUser'][]} */
        const users = server.ORM.db.IamUser.get(0, null).result??[];
        for (const user of users){
            /**@ts-ignore */
            user.Password =  await server.security.securityPasswordGet({app_id:0, password_encrypted:user.Password});
        }
        resolve(users);
    })();});                                                              
    //update OpenApi with secrets updated in components.parameters.config
    await server.ORM.db.OpenApi.update({app_id:0,
                        data:{  openApiKey: 'components',
                                openApiValue: updatedConfigSecurity.OpenApi.components}});
    //update IamUser using new secrets
    for (const user of users){
        await server.ORM.db.IamUser.updateAdmin({ app_id:0, 
                                            /**@ts-ignore */
                                            resource_id:user.Id, 
                                            data:{password:user.Password}
                                        });
    }
    //update ServiceRegistry with new secrets
    for(const record of updatedConfigSecurity.ServiceRegistry??[])
        await server.ORM.db.ServiceRegistry.update({app_id:0,
                                            /**@ts-ignore */
                                            resource_id:record.Id,
                                            data:record});

    await updateMicroserviceSecurity({  serveRegistry:               updatedConfigSecurity.ServiceRegistry??[],
                                        pathMicroserviceSource:     '/data/microservice/',
                                        pathMicroserviceDestination:'/data/microservice/'});
};
/**
 * @name updateMicroserviceSecurity
 * @description Reads key pair in serviceregistry and updates them in microservice config files
 * @function
 * @param {{serveRegistry:server['ORM']['Object']['ServiceRegistry'][],
 *          pathMicroserviceSource:      string,
 *          pathMicroserviceDestination:   string,
 *          init?: boolean}} parameters
 * @returns {Promise.<void>}
 */
const updateMicroserviceSecurity = async parameters =>{
    /**
     * 
     * @param {string} url
     * @returns {string}
     */
    const updateUrl = url =>{
        const app_host = server.info.serverProcess.argv[3];
        const app_port = server.ORM.UtilNumberValue(server.info.serverProcess.argv[4]);
        return url.replace('localhost:3000',app_host + (app_port==80?'':':' + app_port));
    }
    for (const file of ['BATCH']){
        /**@type{server['serviceregistry']['microservice_local_config']} */
        const content = await fs.promises.readFile(server.info.serverProcess.cwd() + `${parameters.pathMicroserviceSource}${file}.json`).then(filebuffer=>JSON.parse(filebuffer.toString()));
        if (parameters.init){
            content.environment                 = server.info.serverProcess.argv[2];
            content.service_registry_auth_url   = updateUrl(content.service_registry_auth_url)
		    content.message_queue_url           = updateUrl(content.message_queue_url)
        }
        content.uuid = parameters.serveRegistry.filter(microservice=>microservice.Name==content.name)[0].Uuid;
        content.secret = parameters.serveRegistry.filter(microservice=>microservice.Name==content.name)[0].Secret;
        await fs.promises.writeFile(server.info.serverProcess.cwd() + `${parameters.pathMicroserviceDestination}${file}.json`, 
                                                            JSON.stringify(content, undefined, 2),'utf8');
    }
};
/**
 * @name updateConfigSecurity
 * @description Reads config files with security and return documents with updates security values
 *              If path is empty then object is read from db
 * @function
 * @param {{pathOpenApi:            string|null,
 *          pathServiceRegistry:    string|null}} parameters
 * @returns {Promise.<{ OpenApi:    server['ORM']['Object']['OpenApi'],
 *                      ServiceRegistry:server['ORM']['Object']['ServiceRegistry'][]}>}
 */
const getConfigSecurityUpdate = async parameters =>{
    
    return {
        OpenApi:await new Promise(resolve=>{(async () =>{ 
                            /**@type{server['ORM']['Object']['OpenApi']}*/
                            const openApi = parameters.pathOpenApi?await fs.promises.readFile(server.info.serverProcess.cwd() + parameters.pathOpenApi)
                                                .then(file=>JSON.parse(file.toString())):server.ORM.getObject(0,'OpenApi');
                            //generate secrets
                            openApi.components.parameters.config.IAM_MICROSERVICE_TOKEN_SECRET.default = server.security.securitySecretCreate();
                            openApi.components.parameters.config.IAM_ADMIN_TOKEN_SECRET.default = server.security.securitySecretCreate();
                            openApi.components.parameters.config.IAM_USER_TOKEN_APP_ACCESS_SECRET.default = server.security.securitySecretCreate();
                            openApi.components.parameters.config.IAM_USER_TOKEN_APP_ACCESS_VERIFICATION_SECRET.default = server.security.securitySecretCreate();
                            openApi.components.parameters.config.IAM_USER_TOKEN_APP_ID_SECRET.default = server.security.securitySecretCreate();
                            openApi.components.parameters.config.IAM_USER_PASSWORD_ENCRYPTION_KEY.default = server.security.securitySecretCreate(false, 32);
                            openApi.components.parameters.config.IAM_USER_PASSWORD_INIT_VECTOR.default = server.security.securitySecretCreate(false, 16);
                            //set server metadata
                            openApi.info['x-created'] = openApi.info['x-created'] ?? `${new Date().toISOString()}`;
                            openApi.info['x-modified'] = openApi.info['x-created'] ?? `${new Date().toISOString()}`;
                            resolve(openApi);
                        })();}),
        ServiceRegistry:parameters.pathServiceRegistry?await new Promise(resolve=>{(async () =>{ 
                                /**@type{server['ORM']['Object']['ServiceRegistry'][]}*/
                                const content = await fs.promises.readFile(server.info.serverProcess.cwd() + parameters.pathServiceRegistry)
                                                    .then(file=>JSON.parse(file.toString()));
                                for (const row of content){
                                    row.Uuid = server.security.securityUUIDCreate();
                                    row.Secret = Buffer.from(JSON.stringify(await server.security.securityTransportCreateSecrets()),'utf-8').toString('base64');
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
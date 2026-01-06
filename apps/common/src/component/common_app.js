    /**
     * @module apps/common/src/component/common_app
     */  

    /**
     * @import {server} from '../../../../server/types.js';
     */

    const {server} = await import('../../../../server/server.js');

    /**
     * @name template
     * @description Template
     * @function
     * @param {{app_id:number,
    *          cssCommon:string,
    *          jsCommon:string,
    *          jsCrypto:string,
    *          globals:Object.<String,*>,
    *          app_toolbar_button_start:number,
    *          app_toolbar_button_framework:number,
    *          app_framework:number}} props
    * @returns {string}
    */
    const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset='UTF-8'>
                                <title></title>
                                <meta name='viewport' content='width=device-width, minimum-scale=1.0, maximum-scale = 1'>
                            </head>	
                            <body class='start'>
                                <script type='module'>                                                                            
                                    const commonWindowFromBase64 = str => {
                                        const binary_string = atob(str);
                                        const len = binary_string.length;
                                        const bytes = new Uint8Array(len);
                                        for (let i = 0; i < len; i++) {
                                            bytes[i] = binary_string.charCodeAt(i);
                                        }
                                        return new TextDecoder('utf-8').decode(bytes);
                                    };
                                    //import common library
                                    const common = await import(URL.createObjectURL(  new Blob ([commonWindowFromBase64('${props.jsCommon}')],{type: 'text/javascript'})));
                                    //init
                                    await common[Object.keys(common.default)[0]]({
                                        globals:        '${props.globals}',
                                        cssCommon:      '${props.cssCommon}',
                                        jsCrypto:       '${props.jsCrypto}'
                                    });
                                </script>
                                <link id='app_link_app_css'         rel='stylesheet'  type='text/css'     href=''/>
                                <link id='app_link_app_report_css'  rel='stylesheet'  type='text/css'     href=''/>
                                <div id='app_root'>
                                    <div id='app'></div>
                                    <div id='common_app'>
                                        <div id='common_app_toolbar' ${(props.app_toolbar_button_start==1 ||props.app_toolbar_button_framework==1)?'class=\'show\'':''}>
                                            <div id='common_app_toolbar_start' class='common_link common_icon_toolbar_s common_toolbar_button ${props.app_toolbar_button_start==1?'show':''}'></div>
                                            <div id='common_app_toolbar_framework_js' class='common_link common_icon_toolbar_s common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''} ${props.app_framework==1?'common_toolbar_selected':''}'></div>
                                            <div id='common_app_toolbar_framework_vue' class='common_link common_icon_toolbar_s common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''}'></div>
                                            <div id='common_app_toolbar_framework_react' class='common_link common_icon_toolbar_s common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''}'></div>
                                        </div>
                                        <div id='common_app_dialogues'>
                                            <div id='common_app_dialogues_info' class='common_app_dialogues_content'></div>
                                            <div id='common_app_dialogues_iam_start' class='common_app_dialogues_content'></div>
                                            <div id='common_app_dialogues_user_menu' class='common_app_dialogues_content'></div>
                                            <div id='common_app_dialogues_iam_verify' class='common_app_dialogues_content'></div>
                                            <div id='common_app_dialogues_message' class='common_app_dialogues_content'></div>
                                            <div id='common_app_dialogues_profile' class='common_app_dialogues_content'></div>
                                            <div id='common_app_dialogues_lov' class='common_app_dialogues_content'></div>
                                            <div id='common_app_dialogues_app_data_display' class='common_app_dialogues_content'></div>
                                            <div id='common_app_dialogues_app_custom' class='common_app_dialogues_content'></div>
                                        </div>
                                        <div id='common_apps' class='common_app_dialogues_content'></div>
                                        <div id='common_app_print'></div>
                                        <div id='common_app_window_info'></div>
                                        <div id='common_app_broadcast'></div>
                                        <div id='common_app_profile'>
                                            <div id='common_app_profile_search'>
                                                <div id='common_app_profile_search_input_row'>
                                                    <div id='common_app_profile_search_input' contentEditable='true' class='common_input '></div>
                                                    <div id='common_app_profile_search_icon' class='common_link common_icon_list'></div>
                                                </div>
                                                <div id='common_app_profile_search_list_wrap'></div>
                                            </div>
                                            <div id='common_app_profile_toolbar'>
                                                <div id='common_app_profile_toolbar_stat' class='common_link common_toolbar_button common_icon_toolbar_l' ></div>
                                            </div>
                                        </div>
                                        <div id='common_app_iam_user_menu'>
                                            <div id='common_app_iam_user_menu_logged_in'>
                                                <div id='common_app_iam_user_menu_avatar'>
                                                    <div id='common_app_iam_user_menu_avatar_img' class='common_image common_image_avatar'></div>
                                                    <div id='common_app_iam_user_menu_message_count'></div>
                                                    <div id='common_app_iam_user_menu_message_count_icon'></div>
                                                </div>
                                            </div>
                                            <div id='common_app_iam_user_menu_logged_out'>
                                                <div id='common_app_iam_user_menu_default_avatar' class='common_link common_icon_avatar'></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </body>
                            </html> `;
    /**
    * @name component
    * @description Component
    * @function
    * @param {{data:       {   
    *                      app_id:number,
    *                      ip:string, 
    *                      user_agent:string, 
    *                      accept_language:string,
    *                      host:string,
    *                      },
    *        methods:      null
    *      }} props 
    * @returns {Promise.<string>}
    */
    const component = async props =>{
        const common_app_id =                   server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_COMMON_APP_ID.default)??1;
        const admin_app_id =                    server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_ADMIN_APP_ID.default)??1;
        
        const rest_resource_bff =               server.ORM.OpenApiComponentParameters.config.SERVER_REST_RESOURCE_BFF.default;
        const app_rest_api_version =            server.ORM.OpenApiComponentParameters.config.SERVER_REST_API_VERSION.default;
        const basePathRESTAPI = server.ORM.OpenApiServers.filter(row=>row['x-type'].default=='REST_API')[0].variables.basePath.default;
        const data_app_id = (await server.app_common.commonAppIam(props.data.host, 'APP')).admin?
                            admin_app_id:
                                common_app_id;
        const start_app_id =                    data_app_id==admin_app_id?admin_app_id:server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_START_APP_ID.default)??1;
        /**
         * @description post data and return created values
         * @returns {Promise.<{  idToken:{id:number, token:string},
         *                      uuid:   string,
         *                      secret: string}>}
         */
        const postInit = async () =>{
            const uuid  = server.security.securityUUIDCreate();
            //save token in admin appid for admin or in commmon app id for users
            const [idToken, secrets] = await Promise.all([server.iam.iamAuthorizeIdToken(data_app_id,props.data.ip, 'APP'), 
                                                         server.security.securityTransportCreateSecrets()
            ])
            const secret= Buffer.from(JSON.stringify(secrets),'utf-8')
                                .toString('base64');

            return  server.ORM.db.IamEncryption.post(data_app_id,
                    {AppId:common_app_id, Uuid:uuid, Secret:secret, IamAppIdTokenId:idToken.id??0, Type:'APP'})
                .then(result=>{
                    return {
                        idToken:idToken,
                        uuid:uuid,
                        secret:secret
                    };
                })
        };
        
        /**
         * @description get data and globals with keys same as COMMON_GLOBAL in common.js
         * @returns {Promise.<{ globals:  string,
         *                      cssCommon:string,
         *                      jsCommon: string,
         *                      jsCrypto: string,
         *                      idToken:  {id:number, token:string},
         *                      uuid:     string,
         *                      secret:   string,
         *                      app_toolbar_button_start:       number,
         *                      app_toolbar_button_framework:   number,
         *                      app_framework:number}>}
         */    
        const getData = async ()=>{

            const count_user = server.ORM.db.IamUser.get(data_app_id, null).result.length;
            const admin_only = (await server.app_common.commonAppStart(data_app_id)==true?false:true) && count_user==0;
            
            //fetch parameters and convert records to one object with parameter keys
            /**@type{Object.<string,*>} */
            const APP_PARAMETER = server.ORM.db.AppData.getServer({app_id:data_app_id, resource_id:null, data:{name:'APP_PARAMETER', data_app_id:common_app_id}}).result
                                         .reduce((/**@type{Object.<string,*>}*/key, /**@type{server['ORM']['Object']['AppData']}*/row)=>{key[row.Value] = row.DisplayData; return key},{})
            //geodata for APP using start_app_id
            const result_geodata = await server.app_common.commonGeodata({ app_id:start_app_id, 
                                                                    endpoint:'APP', 
                                                                    ip:props.data.ip, 
                                                                    user_agent:props.data.user_agent, 
                                                                    accept_language:props.data.accept_language});
            const postData = await postInit();
            const app_toolbar_button_start =  server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_TOOLBAR_BUTTON_START.default)??1;
            const app_toolbar_button_framework = server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_TOOLBAR_BUTTON_FRAMEWORK.default)??1;
            const app_framework = server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_FRAMEWORK.default)??1;
            /**@type{server['app']['commonGlobals']} */
            const globals = {
                                //update COMMON_GLOBAL keys:
                                apps:                           (await server.ORM.db.App.getViewInfo({app_id:common_app_id, resource_id:null})).result,
                                rest_resource_bff:              rest_resource_bff,
                                app_rest_api_version:           app_rest_api_version,
                                app_rest_api_basepath:          basePathRESTAPI,
                                app_common_app_id:              common_app_id,
                                app_admin_app_id:               admin_app_id,
                                app_start_app_id:               start_app_id,
                                app_toolbar_button_start:       app_toolbar_button_start,
                                app_toolbar_button_framework:   app_toolbar_button_framework,
                                app_framework:                  app_framework,
                                app_framework_messages:         server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_FRAMEWORK_MESSAGES.default)??1,
                                admin_only:                     admin_only?1:0,
                                admin_first_time:               count_user==0?1:0,
                                app_request_tries:              server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_REQUEST_TRIES.default)??5,
                                app_requesttimeout_seconds:     server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_REQUESTTIMEOUT_SECONDS.default)??5,
                                app_requesttimeout_admin_minutes:server.ORM.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_REQUESTTIMEOUT_ADMIN_MINUTES.default)??60,
                                //font css split by '@font-face' in array, unicode fonts only, ui fonts applied at start
                                app_fonts:                      (await server.app_common.commonResourceFile({ 
                                                                        app_id:data_app_id, 
                                                                        resource_id:'/common/css/font/fonts.css',
                                                                        content_type:'text/css', 
                                                                        data_app_id:common_app_id})).result.resource
                                                                .split('url(')
                                                                .map((/**@type{string}*/row)=>{
                                                                    if (row.startsWith(basePathRESTAPI))
                                                                        //add app start uuid after font uuid separated with '~'
                                                                        return row.replace( row.substring(0,basePathRESTAPI.length+36),
                                                                                            row.substring(0,basePathRESTAPI.length+36) + '~' + postData.uuid);
                                                                    else
                                                                        return row;
                                                                }).join('url(')
                                                                .split('@'),
                                app_content_type_json:          'application/json; charset=utf-8',
                                app_content_type_html:          'text/html; charset=utf-8',
                                app_content_type_sse:           'text/event-stream; charset=utf-8',
                                //AppData parameters common
                                info_link_policy_name:          APP_PARAMETER.INFO_LINK_POLICY_NAME,
                                info_link_policy_url:           APP_PARAMETER.INFO_LINK_POLICY_URL,
                                info_link_disclaimer_name:      APP_PARAMETER.INFO_LINK_DISCLAIMER_NAME,
                                info_link_disclaimer_url:       APP_PARAMETER.INFO_LINK_DISCLAIMER_URL,
                                info_link_terms_name:           APP_PARAMETER.INFO_LINK_TERMS_NAME,
                                info_link_terms_url:            APP_PARAMETER.INFO_LINK_TERMS_URL,
                                
                                //User
                                token_dt:                       postData.idToken.token,
                                client_latitude:                result_geodata?.latitude,
                                client_longitude:               result_geodata?.longitude,
                                client_place:                   result_geodata?.place ?? '',
                                client_timezone:                result_geodata?.timezone==''?null:result_geodata?.timezone,
                                x:                              {
                                                                    uuid:  postData.uuid,
                                                                    secret:postData.secret
                                                                }
                            };
            return {
                    globals:        Buffer.from(JSON.stringify(globals)).toString('base64'),
                    cssCommon:      Buffer.from((await server.app_common.commonResourceFile({ 
                                                        app_id:data_app_id, 
                                                        resource_id:'/common/css/common.css',
                                                        content_type:'text/css', 
                                                        data_app_id:common_app_id})).result.resource).toString('base64'),
                    jsCommon:       Buffer.from((await server.app_common.commonResourceFile({ 
                                                        app_id:data_app_id, 
                                                        resource_id:'/common/js/common.js',
                                                        content_type:'text/javascript', 
                                                        data_app_id:common_app_id})).result.resource).toString('base64'),
                    jsCrypto:       Buffer.from(await server.app_common.commonGetFile({ 
                                                        app_id:data_app_id, 
                                                        path:'/sdk/crypto.js',
                                                        content_type:'text/javascript'})).toString('base64'),
                    idToken:        postData.idToken,
                    uuid:           postData.uuid,
                    secret:         postData.secret,
                    app_toolbar_button_start:       app_toolbar_button_start,
                    app_toolbar_button_framework:   app_toolbar_button_framework,
                    app_framework:  app_framework
            };
        };
        const data = await getData().catch(error=>{
            throw error;
        });
        return template({   app_id:                             data_app_id,
                            cssCommon:                          data.cssCommon,
                            jsCommon:                           data.jsCommon,
                            jsCrypto:                           data.jsCrypto,
                            globals:                            data.globals,
                            app_toolbar_button_start:           data.app_toolbar_button_start,
                            app_toolbar_button_framework:       data.app_toolbar_button_framework,
                            app_framework:                      data.app_framework
                        });
    };
    export default component;
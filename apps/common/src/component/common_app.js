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
                                <meta name='HandheldFriendly' content='true'/>
                                <meta name='mobile-web-app-capable' content='yes'>
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
                                <link id='app_link_favicon_32x32'   rel='icon'        type='image/png'    href='' sizes='32x32'/>
                                <link id='app_link_favicon_192x192' rel='icon'        type='image/png'    href='' sizes='192x192'/>
                                <div id='app_root'>
                                    <div id='app'></div>
                                    <div id='common_app'>
                                        <div id='common_app_toolbar' ${(props.app_toolbar_button_start==1 ||props.app_toolbar_button_framework==1)?'class=\'show\'':''}>
                                            <div id='common_app_toolbar_start' class='common_icon common_icon_toolbar_s common_toolbar_button ${props.app_toolbar_button_start==1?'show':''}'>
                                                <svg width='30px' height='30px' viewBox='4 4 16 16'><g stroke-width='0'></g><g stroke-linecap='round' stroke-linejoin='round'></g><g > <path d='M5.5 20V13H3L12 5L21 13H18.5V20H14.5V16.5C14.5 15.6716 13.8284 15 13 15H11C10.1716 15 9.5 15.6716 9.5 16.5V20H6.5Z' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path> </g></svg>
                                            </div>
                                            <div id='common_app_toolbar_framework_js' class='common_icon common_icon_toolbar_s common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''} ${props.app_framework==1?'common_toolbar_selected':''}'>
                                                <svg width='30px' height='30px' viewBox='0 0 32 32'><g stroke-width='0'></g><g stroke-linecap='round' stroke-linejoin='round'></g><g > <path d='M17.313 14.789h-2.809c0 2.422-0.011 4.829-0.011 7.254 0.033 0.329 0.051 0.712 0.051 1.099 0 0.81-0.081 1.601-0.236 2.365l0.013-0.076c-0.412 0.861-1.475 0.751-1.957 0.6-0.451-0.242-0.808-0.609-1.031-1.055l-0.006-0.014c-0.044-0.094-0.097-0.174-0.16-0.246l0.001 0.001-2.281 1.406c0.367 0.79 0.934 1.434 1.637 1.885l0.018 0.011c0.763 0.427 1.675 0.678 2.645 0.678 0.484 0 0.954-0.063 1.401-0.18l-0.038 0.009c0.988-0.248 1.793-0.89 2.254-1.744l0.009-0.019c0.359-0.914 0.566-1.973 0.566-3.080 0-0.388-0.026-0.77-0.075-1.145l0.005 0.044c0.015-2.567 0-5.135 0-7.722zM28.539 23.843c-0.219-1.368-1.11-2.518-3.753-3.59-0.92-0.431-1.942-0.731-2.246-1.425-0.063-0.158-0.099-0.341-0.099-0.532 0-0.124 0.015-0.244 0.044-0.359l-0.002 0.010c0.208-0.55 0.731-0.935 1.343-0.935 0.199 0 0.388 0.040 0.559 0.113l-0.009-0.004c0.552 0.19 0.988 0.594 1.215 1.112l0.005 0.013c1.292-0.845 1.292-0.845 2.193-1.406-0.216-0.369-0.459-0.689-0.734-0.977l0.002 0.002c-0.767-0.814-1.852-1.32-3.056-1.32-0.171 0-0.34 0.010-0.505 0.030l0.020-0.002-0.881 0.111c-0.856 0.194-1.587 0.639-2.133 1.252l-0.003 0.004c-0.535 0.665-0.859 1.519-0.859 2.449 0 1.279 0.613 2.415 1.56 3.131l0.010 0.007c1.706 1.275 4.2 1.555 4.519 2.755 0.3 1.462-1.087 1.931-2.457 1.762-0.957-0.218-1.741-0.83-2.184-1.652l-0.009-0.017-2.287 1.313c0.269 0.536 0.607 0.994 1.011 1.385l0.001 0.001c2.174 2.194 7.61 2.082 8.586-1.255 0.113-0.364 0.178-0.782 0.178-1.215 0-0.3-0.031-0.593-0.091-0.875l0.005 0.028zM1.004 1.004h29.991v29.991h-29.991z'></path> </g></svg>
                                            </div>
                                            <div id='common_app_toolbar_framework_vue' class='common_icon common_icon_toolbar_s common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''}'>
                                                <svg width='30px' height='30px' viewBox='0 0 24 24' ><g stroke-width='0'></g><g stroke-linecap='round' stroke-linejoin='round'></g><g> <path d='M19.1143 2H15L12 6.9L9.42857 2H0L12 23L24 2H19.1143ZM3 3.75H5.91429L12 14.6L18.0857 3.75H21L12 19.5L3 3.75Z' ></path> </g></svg>
                                            </div>
                                            <div id='common_app_toolbar_framework_react' class='common_icon common_icon_toolbar_s common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''}'></div>
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
                                                    <div id='common_app_profile_search_icon' class='common_icon'></div>
                                                </div>
                                                <div id='common_app_profile_search_list_wrap'></div>
                                            </div>
                                            <div id='common_app_profile_toolbar'>
                                                <div id='common_app_profile_toolbar_stat' class='common_toolbar_button common_icon common_icon_toolbar_l' ></div>
                                            </div>
                                        </div>
                                        <div id='common_app_iam_user_menu'>
                                            <div id='common_app_iam_user_menu_logged_in'>
                                                <div id='common_app_iam_user_menu_avatar'>
                                                    <div id='common_app_iam_user_menu_avatar_img' class='common_image common_image_avatar'></div>
                                                    <div id='common_app_iam_user_menu_message_count' class='common_icon'>
                                                        <div id='common_app_iam_user_menu_message_count_text'></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id='common_app_iam_user_menu_logged_out'>
                                                <div id='common_app_iam_user_menu_default_avatar' class='common_icon common_icon_avatar'></div>
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
    *                      app_admin_app_id:number,
    *                      ip:string, 
    *                      user_agent:string, 
    *                      accept_language:string,
    *                      basePathRESTAPI:string
    *                      },
    *        methods:      {
    *                      commonAppStart:import('../common.js')['commonAppStart'],
    *                      commonGeodata:import('../common.js')['commonGeodata'],
    *                      AppData:import('../../../../server/db/AppData.js'),
    *                      IamEncryption:import('../../../../server/db/IamEncryption.js'),
    *                      IamUser:import('../../../../server/db/IamUser.js'),
    *                      iamAuthorizeIdToken:import('../../../../server/iam.js')['iamAuthorizeIdToken'],
    *                      serverProcess:import('../../../../server/info.js')['serverProcess'],
    *                      UtilNumberValue:import('../../../../server/server.js')['server']['ORM']['UtilNumberValue'],
    *                      Security:import('../../../../server/security.js'),
    *                      commonResourceFile:import('../common.js')['commonResourceFile'],
    *                      commonGetFile:import('../common.js')['commonGetFile']
    *                      }
    *      }} props 
    * @returns {Promise.<string>}
    */
    const component = async props =>{
        

        const common_app_id =                   props.methods.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_COMMON_APP_ID.default)??1;
        const admin_app_id =                    props.methods.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_ADMIN_APP_ID.default)??1;
        const start_app_id =                    props.data.app_id==admin_app_id?admin_app_id:props.methods.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_START_APP_ID.default)??1;
        const rest_resource_bff =               server.ORM.OpenApiComponentParameters.config.SERVER_REST_RESOURCE_BFF.default;
        const app_rest_api_version =            server.ORM.OpenApiComponentParameters.config.SERVER_REST_API_VERSION.default;

        /**
         * @description post data and return created values
         * @returns {Promise.<{  idToken:{id:number, token:string},
         *                      uuid:   string,
         *                      secret: string}>}
         */
        const postInit = async () =>{
            const uuid  = props.methods.Security.securityUUIDCreate();
            //save token in admin appid for admin or in commmon app id for users
            const [idToken, secrets] = await Promise.all([props.methods.iamAuthorizeIdToken(props.data.app_id,props.data.ip, 'APP'), 
                                                         props.methods.Security.securityTransportCreateSecrets()
            ])
            const secret= Buffer.from(JSON.stringify(secrets),'utf-8')
                                .toString('base64');

            return  props.methods.IamEncryption.post(props.data.app_id,
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

            const count_user = props.methods.IamUser.get(props.data.app_id, null).result.length;
            const admin_only = (await props.methods.commonAppStart(props.data.app_id)==true?false:true) && count_user==0;
            
            //fetch parameters and convert records to one object with parameter keys
            /**@type{Object.<string,*>} */
            const APP_PARAMETER = props.methods.AppData.getServer({app_id:props.data.app_id, resource_id:null, data:{name:'APP_PARAMETER', data_app_id:common_app_id}}).result
                                         .reduce((/**@type{Object.<string,*>}*/key, /**@type{server['ORM']['Object']['AppData']}*/row)=>{key[row.Value] = row.DisplayData; return key},{})
            //geodata for APP using start_app_id
            const result_geodata = await props.methods.commonGeodata({ app_id:start_app_id, 
                                                                    endpoint:'APP', 
                                                                    ip:props.data.ip, 
                                                                    user_agent:props.data.user_agent, 
                                                                    accept_language:props.data.accept_language});
            const postData = await postInit();
            const app_toolbar_button_start =  props.methods.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_TOOLBAR_BUTTON_START.default)??1;
            const app_toolbar_button_framework = props.methods.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_TOOLBAR_BUTTON_FRAMEWORK.default)??1;
            const app_framework = props.methods.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_FRAMEWORK.default)??1;
            /**@type{server['app']['commonGlobals']} */
            const globals = {
                                //update COMMON_GLOBAL keys:
                                //Config Server	
                                rest_resource_bff:              rest_resource_bff,
                                app_rest_api_version:           app_rest_api_version,
                                app_rest_api_basepath:          props.data.basePathRESTAPI,
                                //Config ServiceApp
                                app_common_app_id:              common_app_id,
                                app_admin_app_id:               admin_app_id,
                                app_start_app_id:               start_app_id,
                                app_toolbar_button_start:       app_toolbar_button_start,
                                app_toolbar_button_framework:   app_toolbar_button_framework,
                                app_framework:                  app_framework,
                                app_framework_messages:         props.methods.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_FRAMEWORK_MESSAGES.default)??1,
                                admin_only:                     admin_only?1:0,
                                admin_first_time:               count_user==0?1:0,
                                app_request_tries:              props.methods.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_REQUEST_TRIES.default)??5,
                                app_requesttimeout_seconds:     props.methods.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_REQUESTTIMEOUT_SECONDS.default)??5,
                                app_requesttimeout_admin_minutes:props.methods.UtilNumberValue(server.ORM.OpenApiComponentParameters.config.APP_REQUESTTIMEOUT_ADMIN_MINUTES.default)??60,
                                //font css split by '@font-face' in array, unicode fonts only, ui fonts applied at start
                                app_fonts:                      (await props.methods.commonResourceFile({ 
                                                                        app_id:props.data.app_id, 
                                                                        resource_id:'/common/css/font/fonts.css',
                                                                        content_type:'text/css', 
                                                                        data_app_id:common_app_id})).result.resource
                                                                .split('url(')
                                                                .map((/**@type{string}*/row)=>{
                                                                    if (row.startsWith(props.data.basePathRESTAPI))
                                                                        //add app start uuid after font uuid separated with '~'
                                                                        return row.replace( row.substring(0,props.data.basePathRESTAPI.length+36),
                                                                                            row.substring(0,props.data.basePathRESTAPI.length+36) + '~' + postData.uuid);
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
                    cssCommon:      Buffer.from((await props.methods.commonResourceFile({ 
                                                        app_id:props.data.app_id, 
                                                        resource_id:'/common/css/common.css',
                                                        content_type:'text/css', 
                                                        data_app_id:common_app_id})).result.resource).toString('base64'),
                    jsCommon:       Buffer.from((await props.methods.commonResourceFile({ 
                                                        app_id:props.data.app_id, 
                                                        resource_id:'/common/js/common.js',
                                                        content_type:'text/javascript', 
                                                        data_app_id:common_app_id})).result.resource).toString('base64'),
                    jsCrypto:       Buffer.from(await props.methods.commonGetFile({ 
                                                        app_id:props.data.app_id, 
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
        return template({   app_id:                             props.data.app_id,
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
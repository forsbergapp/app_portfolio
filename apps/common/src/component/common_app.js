    /**
     * @module apps/common/src/component/common_app
     */  

    /**
     * @import {server_db_document_ConfigServer} from '../../../../server/types.js';
     */
    /**
     * @name template
     * @description Template
     * @function
     * @param {{app_id:number,
    *          cssCommon:string,
    *          jsCommon:string,
    *          jsCrypto:string,
    *          globals:Object.<String,*>,
    *          cssFontsStart:string,
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
                                <meta name="HandheldFriendly" content="true"/>
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
                                        cssFontsStart:  '${props.cssFontsStart}',
                                        cssCommon:      '${props.cssCommon}',
                                        jsCrypto:       '${props.jsCrypto}'
                                    });
                                </script>
                                <link id="app_link_app_css"         rel='stylesheet'  type='text/css'     href=''/>
                                <link id="app_link_app_report_css"  rel='stylesheet'  type='text/css'     href=''/>
                                <link id="app_link_favicon_32x32"   rel='icon'        type='image/png'    href='' sizes='32x32'/>
                                <link id="app_link_favicon_192x192" rel='icon'        type='image/png'    href='' sizes='192x192'/>
                                <div id='app_root'>
                                    <div id='app'></div>
                                    <div id='common_app'>
                                        <div id='common_app_toolbar' ${(props.app_toolbar_button_start==1 ||props.app_toolbar_button_framework==1)?'class=\'show\'':''}>
                                            <div id='common_app_toolbar_start' class='common_icon common_toolbar_button ${props.app_toolbar_button_start==1?'show':''}'></div>
                                            <div id='common_app_toolbar_framework_js' class='common_icon common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''} ${props.app_framework==1?'common_toolbar_selected':''}'></div>
                                            <div id='common_app_toolbar_framework_vue' class='common_icon common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''}'></div>
                                            <div id='common_app_toolbar_framework_react' class='common_icon common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''}'></div>
                                        </div>
                                        <div id='common_dialogues'>
                                            <div id='common_dialogue_apps' class='common_dialogue_content'></div>
                                            <div id='common_dialogue_info' class='common_dialogue_content'></div>
                                            <div id='common_dialogue_iam_start' class='common_dialogue_content'></div>
                                            <div id='common_dialogue_user_menu' class='common_dialogue_content'></div>
                                            <div id='common_dialogue_iam_verify' class='common_dialogue_content'></div>
                                            <div id='common_dialogue_message' class='common_dialogue_content'></div>
                                            <div id='common_dialogue_profile' class='common_dialogue_content'></div>
                                            <div id='common_dialogue_lov' class='common_dialogue_content'></div>
                                            <div id='common_dialogue_app_data_display' class='common_dialogue_content'></div>
                                        </div>
                                        <div id='common_window_info'></div>
                                        <div id='common_broadcast'></div>
                                        <div id='common_profile_search'></div>
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
                                                <div id='common_app_iam_user_menu_default_avatar' class='common_icon'></div>
                                            </div>
                                        </div>
                                        <div id='common_profile_toolbar'></div>
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
    *                      configServer:server_db_document_ConfigServer,
    *                      },
    *        methods:      {
    *                      commonAppStart:import('../common.js')['commonAppStart'],
    *                      bffGeodata:import('../../../../server/bff.js')['bffGeodata'],
    *                      AppParameter:import('../../../../server/db/AppParameter.js'),
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
        

        const common_app_id =                   props.methods.UtilNumberValue(props.data.configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)??1;
        const admin_app_id =                    props.methods.UtilNumberValue(props.data.configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID)??1;
        const start_app_id =                    props.data.app_id==admin_app_id?admin_app_id:props.methods.UtilNumberValue(props.data.configServer.SERVICE_APP.filter(parameter=>'APP_START_APP_ID' in parameter)[0].APP_START_APP_ID)??1;
        const rest_resource_bff =               props.data.configServer.SERVER.filter(parameter=>'REST_RESOURCE_BFF' in parameter)[0].REST_RESOURCE_BFF;
        const app_rest_api_version =            props.data.configServer.SERVER.filter(parameter=>'REST_API_VERSION' in parameter)[0].REST_API_VERSION;

        /**
         * @description post data and return created values
         * @return {Promise.<{  idToken:{id:number, token:string},
         *                      uuid:   string,
         *                      secret: string}>}
         */
        const postInit = async () =>{
            //save token in admin appid for admin or in commmon app id for users
            const idToken = await props.methods.iamAuthorizeIdToken(props.data.app_id,props.data.ip, 'APP');
            const uuid  = props.methods.Security.securityUUIDCreate();
            const secret= Buffer.from(JSON.stringify(await props.methods.Security.securityTransportCreateSecrets()),'utf-8')
                                .toString('base64');
            await props.methods.IamEncryption.post(props.data.app_id,
                {app_id:common_app_id, uuid:uuid, secret:secret, iam_app_id_token_id:idToken.id??0, type:'APP'});
            return {
                idToken:idToken,
                uuid:uuid,
                secret:secret
            };
        };
        
        /**
         * @description get data and globals with keys same as COMMON_GLOBAL in common.js
         * @returns {Promise.<{ globals:  string,
         *                      cssCommon:string,
         *                      jsCommon: string,
         *                      jsCrypto: string,
         *                      cssFontsStart:string,
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
            
            const APP_PARAMETER = props.methods.AppParameter.get({app_id:props.data.app_id,resource_id:common_app_id}).result[0]??{};
            //geodata for APP using start_app_id
            const result_geodata = await props.methods.bffGeodata({ app_id:start_app_id, 
                                                                    endpoint:'APP', 
                                                                    ip:props.data.ip, 
                                                                    user_agent:props.data.user_agent, 
                                                                    accept_language:props.data.accept_language});
            const postData = await postInit();
            const app_toolbar_button_start =  props.methods.UtilNumberValue(props.data.configServer.SERVICE_APP.filter(parameter=>'APP_TOOLBAR_BUTTON_START' in parameter)[0].APP_TOOLBAR_BUTTON_START)??1;
            const app_toolbar_button_framework = props.methods.UtilNumberValue(props.data.configServer.SERVICE_APP.filter(parameter=>'APP_TOOLBAR_BUTTON_FRAMEWORK' in parameter)[0].APP_TOOLBAR_BUTTON_FRAMEWORK)??1;
            const app_framework = props.methods.UtilNumberValue(props.data.configServer.SERVICE_APP.filter(parameter=>'APP_FRAMEWORK' in parameter)[0].APP_FRAMEWORK)??1;
            const app_fonts_ui = `@font-face {
                                        font-family: "Font Awesome 6 Free";
                                        font-style: normal;
                                        font-weight: 400;
                                        font-display: block;
                                        src: url(${(await props.methods.commonResourceFile({ 
                                                        app_id:props.data.app_id, 
                                                        resource_id:'/common/modules/fontawesome/webfonts/fa-regular-400.woff2',
                                                        content_type:'font/woff2', 
                                                        data_app_id:common_app_id})).result.resource}) format("woff2")
                                    }
                                    @font-face {
                                        font-family: "Font Awesome 6 Free";
                                        font-style: normal;
                                        font-weight: 900;
                                        font-display: block;
                                        src: url(${(await props.methods.commonResourceFile({ 
                                                        app_id:props.data.app_id, 
                                                        resource_id:'/common/modules/fontawesome/webfonts/fa-solid-900.woff2',
                                                        content_type:'font/woff2', 
                                                        data_app_id:common_app_id})).result.resource}) format("woff2")
                                    }
                                    @font-face {
                                        font-family: "Font Awesome 6 Brands";
                                        font-style: normal;
                                        font-weight: 900;
                                        font-display: block;
                                        src: url(${(await props.methods.commonResourceFile({ 
                                                        app_id:props.data.app_id, 
                                                        resource_id:'/common/modules/fontawesome/webfonts/fa-brands-400.woff2',
                                                        content_type:'font/woff2', 
                                                        data_app_id:common_app_id})).result.resource}) format("woff2")
                                    }`;
            const globals = {
                                //update COMMON_GLOBAL keys:
                                //Config Server	
                                rest_resource_bff:              rest_resource_bff,
                                app_rest_api_version:           app_rest_api_version,
                                //Config ServiceApp
                                app_common_app_id:              common_app_id,
                                app_admin_app_id:               admin_app_id,
                                app_start_app_id:               start_app_id,
                                app_toolbar_button_start:       app_toolbar_button_start,
                                app_toolbar_button_framework:   app_toolbar_button_framework,
                                app_framework:                  app_framework,
                                app_framework_messages:         props.methods.UtilNumberValue(props.data.configServer.SERVICE_APP.filter(parameter=>'APP_FRAMEWORK_MESSAGES' in parameter)[0].APP_FRAMEWORK_MESSAGES)??1,
                                admin_only:                     admin_only?1:0,
                                admin_first_time:               count_user==0?1:0,
                                app_requesttimeout_seconds:     props.methods.UtilNumberValue(props.data.configServer.SERVICE_APP.filter(parameter=>'APP_REQUESTTIMEOUT_SECONDS' in parameter)[0].APP_REQUESTTIMEOUT_SECONDS)??5,
                                app_requesttimeout_admin_minutes:props.methods.UtilNumberValue(props.data.configServer.SERVICE_APP.filter(parameter=>'APP_REQUESTTIMEOUT_ADMIN_MINUTES' in parameter)[0].APP_REQUESTTIMEOUT_ADMIN_MINUTES)??60,
                                //font css split by '@font-face' in array, unicode fonts only, ui fonts applied at start
                                app_fonts:                      (await props.methods.commonResourceFile({ 
                                                                        app_id:props.data.app_id, 
                                                                        resource_id:'/common/css/font/fonts.css',
                                                                        content_type:'text/css', 
                                                                        data_app_id:common_app_id})).result.resource
                                                                .split('url(')
                                                                .map((/**@type{string}*/row)=>{
                                                                    if (row.startsWith('/bff/x/'))
                                                                        //add app start uuid after font uuid separated with '~'
                                                                        return row.replace( row.substring(0,'/bff/x/'.length+36),
                                                                                            row.substring(0,'/bff/x/'.length+36) + '~' + postData.uuid);
                                                                    else
                                                                        return row;
                                                                }).join('url(')
                                                                .split('@'),
                                //AppParameter common
                                info_link_policy_name:          APP_PARAMETER.common_info_link_policy_name.value,
                                info_link_policy_url:           APP_PARAMETER.common_info_link_policy_url.value,
                                info_link_disclaimer_name:      APP_PARAMETER.common_info_link_disclaimer_name.value,
                                info_link_disclaimer_url:       APP_PARAMETER.common_info_link_disclaimer_url.value,
                                info_link_terms_name:           APP_PARAMETER.common_info_link_terms_name.value,
                                info_link_terms_url:            APP_PARAMETER.common_info_link_terms_url.value,
                                
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
                                                        path:'/apps/common/src/functions/common_crypto.js',
                                                        content_type:'text/javascript'})).toString('base64'),
                    /*ui fonts saved in globals and also used to display immediately at app start*/
                    cssFontsStart:  Buffer.from(app_fonts_ui).toString('base64'),
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
                            cssFontsStart:                      data.cssFontsStart,
                            app_toolbar_button_start:           data.app_toolbar_button_start,
                            app_toolbar_button_framework:       data.app_toolbar_button_framework,
                            app_framework:                      data.app_framework
                        });
    };
    export default component;
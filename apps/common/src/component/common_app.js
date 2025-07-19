    /**
     * @module apps/common/src/component/common_app
     */  

    /**
     * @typedef {import('../common.js')['commonConvertBinary']} commonConvertBinary
     * @typedef {import('../../../../server/db/ConfigServer.js')} ConfigServer
     * @typedef {import('../../../../server/server.js')['serverUtilNumberValue']} serverUtilNumberValue
     * @import {server_db_table_App,server_db_document_ConfigServer, server_db_table_IamAppIdToken} from '../../../../server/types.js';
     */
    /**
     * @name template
     * @description Template
     * @function
     * @param {{app_id:number,
    *          app_admin_app_id:number,
    *          rest_resource_bff:string,
    *          app_rest_api_version:string,
    *          app_request_timeout_seconds: number,
    *          app_requesttimeout_admin_minutes: number,
    *          idToken:server_db_table_IamAppIdToken['token'], 
    *          uuid:string,
    *          secret:string,
    *          encrypt_transport:number,
    *          cssCommon:string,
    *          jsCommon:string,
    *          jsCrypto:string,
    *          globals:Object.<String,*>,
    *          cssFonts:string,
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
                                    /**
                                    * @description Receives server side event from BFF, decrypts message using start uuid and delegates message
                                    * @param {{socket:*, 
                                    *          uuid:string|null, 
                                    *          secret:string|null}} parameters
                                    */
                                    const FFB_SSE = async parameters =>{
                                        /**
                                         * @returns {sse_type:string,
                                         *           sse_message:string}
                                         */
                                        const getMessage = BFFmessage =>{
                                            const messageDecoded = common.commonWindowFromBase64(BFFmessage);
                                            return {sse_type:JSON.parse(messageDecoded).sse_type,
                                                    sse_message:JSON.parse(messageDecoded).sse_message};
                                        }
                                        const BFFStream = new WritableStream({
                                            async write(data, controller){
                                                const BFFmessage = encrypt_transport?
                                                                        common.COMMON_GLOBAL.x.decrypt({  
                                                                                iv:         JSON.parse(atob(parameters.secret)).iv,
                                                                                key:        JSON.parse(atob(parameters.secret)).jwk.k, 
                                                                                ciphertext: new TextDecoder('utf-8').decode(data).split('\\n\\n')[0].split('data: ')[1]}):
                                                                            new TextDecoder('utf-8').decode(data).split('\\n\\n')[0].split('data: ')[1];
                                                const SSEmessage = getMessage(BFFmessage);
                                                switch (SSEmessage.sse_type){
                                                    case 'FONT_URL':{
                                                        common.commonMiscLoadFont({ app_id:             ${props.app_id},
                                                                                    uuid:               '${props.uuid}',
                                                                                    secret:             '${props.secret}',
                                                                                    message:            SSEmessage.sse_message,
                                                                                    cssFonts:           cssFonts})
                                                        break;
                                                    }
                                                    default:{
                                                        common.commonSocketSSEShow(SSEmessage);
                                                        break
                                                    }
                                                }
                                            }
                                        //The total number of chunks that can be contained in the internal queue before backpressure is applied
                                        }, new CountQueuingStrategy({ highWaterMark: 1 }));
                                        const BFF = parameters.socket.pipeTo(BFFStream).catch(()=>common.commonWindowSetTimeout(()=>{common.commonSocketConnectOnline();}, 5000));
                                    }
                                    /**
                                    * @description Front end for backend (FFB) that receives responses 
                                    *              from backend for frontend (BFF)
                                    * @param {{app_id:number,
                                    *          uuid:string,
                                    *          secret:string,
                                    *          response_type?:'SSE'|'TEXT'|'BLOB',
                                    *          spinner_id?:string|null,
                                    *          timeout?:number|null,
                                    *          app_admin_app_id:number,
                                    *          rest_api_version: string,
                                    *          rest_bff_path   : string,
                                    *          data:{
                                    *              locale:string,
                                    *              idToken: server_db_table_IamAppIdToken['token'],
                                    *              accessToken?:string,
                                    *              query?:string|null,
                                    *              method:string,
                                    *              authorization_type:string,
                                    *              username?:string,
                                    *              password?:string,
                                    *              body?:*,
                                    *          }}} parameters
                                    */
                                    const FFB = async parameters =>{
                                        /**@type{number} */
                                        let status;
                                        let authorization = null;
                                        
                                        parameters.data.query = parameters.data.query==null?'':parameters.data.query;
                                        parameters.data.body = parameters.data.body?parameters.data.body:null;
                                        //admin uses ADMIN instead of APP_ACCESS so all ADMIN requests use separate admin token
                                        const ROLE = (parameters.app_id == parameters.app_admin_app_id && parameters.data.authorization_type =='APP_ACCESS')?
                                                        'ADMIN':parameters.data.authorization_type;
                                        switch (ROLE){
                                            case 'APP_ACCESS':
                                            case 'APP_ACCESS_VERIFICATION':
                                            case 'APP_ACCESS_EXTERNAL':
                                            case 'ADMIN':{
                                                authorization = 'Bearer ' + parameters.data.accessToken;
                                                break;
                                            }
                                            case 'IAM':{
                                                authorization = 'Basic ' + btoa(parameters.data.username + ':' + parameters.data.password);
                                                break;
                                            }
                                        }
                                        //add common query parameter
                                        parameters.data.query += '&locale=' + (parameters.data.locale??'');

                                        //encode query parameters
                                        const encodedparameters = parameters.data.query?common.commonWindowToBase64(parameters.data.query):'';
                                        const bff_path = parameters.rest_bff_path + '/' + 
                                                            ROLE.toLowerCase() + 
                                                            '/v' + (parameters.rest_api_version ??1);
                                        const url = encrypt_transport?
                                                        ('/bff/x/' + parameters.uuid):
                                                            bff_path + parameters.data.path + '?parameters=' + encodedparameters;

                                        if (parameters.spinner_id && common.COMMON_DOCUMENT?.querySelector('#' + parameters.spinner_id))
                                            common.COMMON_DOCUMENT.querySelector('#' + parameters.spinner_id).classList.add('css_spinner');
                                        const resultFetch = {finished:false};
                                        const options = encrypt_transport?
                                                            //encrypted options
                                                            {
                                                            cache:  'no-store',
                                                            method: 'POST',
                                                            headers:{
                                                                        ...(parameters.response_type =='SSE' && {'Cache-control': 'no-cache'}),
                                                                        'Content-Type': 'application/json',
                                                                        'Connection':   parameters.response_type =='SSE'?
                                                                                            'keep-alive':
                                                                                                'close',
                                                                    },
                                                            body: JSON.stringify({
                                                                    x: common.COMMON_GLOBAL.x.encrypt({
                                                                        iv:     JSON.parse(common.commonWindowFromBase64(parameters.secret)).iv,
                                                                        key:    JSON.parse(common.commonWindowFromBase64(parameters.secret)).jwk.k, 
                                                                        data:JSON.stringify({  
                                                                                headers:{
                                                                                        'app-id':       parameters.app_id,
                                                                                        'app-signature':common.COMMON_GLOBAL.x.encrypt({ 
                                                                                                            iv:     JSON.parse(common.commonWindowFromBase64(parameters.secret)).iv,
                                                                                                            key:    JSON.parse(common.commonWindowFromBase64(parameters.secret)).jwk.k, 
                                                                                                            data:'FFB'}),
                                                                                        'app-id-token': 'Bearer ' + parameters.data.idToken,
                                                                                        ...(authorization && {Authorization: authorization}),
                                                                                        'Content-Type': parameters.response_type =='SSE'?
                                                                                                            'text/event-stream':
                                                                                                                'application/json',
                                                                                        },
                                                                                method: parameters.data.method,
                                                                                url:    bff_path + parameters.data.path + '?parameters=' + encodedparameters,
                                                                                body:   parameters.data.body?
                                                                                            JSON.stringify({data:btoa(JSON.stringify(parameters.data.body))}):
                                                                                                null
                                                                            })
                                                                        })
                                                                })
                                                            }
                                                        :
                                                            //not encrypted options
                                                            {
                                                            cache: 'no-store',
                                                            method: parameters.data.method,
                                                            headers:{   'app-id': parameters.app_id,
                                                                        'app-signature': 'commonFFB',
                                                                        'app-id-token': 'Bearer ' + parameters.data.idToken,
                                                                        ...(parameters.response_type =='SSE' && {'Cache-control': 'no-cache'}),
                                                                        'Content-Type': parameters.response_type =='SSE'?
                                                                                            'text/event-stream':
                                                                                                'application/json',
                                                                        'Connection':   parameters.response_type =='SSE'?
                                                                                            'keep-alive':
                                                                                                'close',
                                                                        ...(authorization && {Authorization: authorization})},
                                                            body:  parameters.data.body?
                                                                        JSON.stringify({data:btoa(JSON.stringify(parameters.data.body))}):
                                                                            null
                                                            };
                                        const showError      = message   => common.commonMessageShow('ERROR_BFF', null, null, message);
                                        return parameters.response_type=='SSE'?
                                                fetch(url, options).then(result=>FFB_SSE({socket:result.body, uuid:parameters.uuid, secret:parameters.secret})):
                                                    await Promise.race([ new Promise((resolve)=>
                                                                        setTimeout(()=>{
                                                                            if (resultFetch.finished==false){
                                                                                showError('🗺⛔?');
                                                                                resolve('🗺⛔?');
                                                                                throw ('TIMEOUT');
                                                                            }
                                                                            }, parameters.app_id == parameters.app_admin_app_id?
                                                                                    (1000 * 60 * ${props.app_requesttimeout_admin_minutes}):
                                                                                    parameters.timeout || (1000 * ${props.app_request_timeout_seconds}))),
                                                                        await fetch(url, options)
                                                                            .then(response =>{
                                                                                status = response.status;
                                                                                return response.text();
                                                                            })
                                                                            .then(result => {
                                                                                const result_decrypted = 
                                                                                        encrypt_transport?
                                                                                            common.COMMON_GLOBAL.x.decrypt({
                                                                                                    iv:         JSON.parse(common.commonWindowFromBase64(parameters.secret)).iv,
                                                                                                    key:        JSON.parse(common.commonWindowFromBase64(parameters.secret)).jwk.k, 
                                                                                                    ciphertext: result}):
                                                                                                result;
                                                                                switch (status){
                                                                                    case 200:
                                                                                    case 201:{
                                                                                        /**@ts-ignore */
                                                                                        return result_decrypted;
                                                                                    }
                                                                                    case 400:{
                                                                                        //Bad request
                                                                                        common.commonMessageShow('ERROR_BFF', null, 'message_text', '!');
                                                                                        throw result_decrypted;
                                                                                    }
                                                                                    case 404:   //Not found
                                                                                    case 401:   //Unauthorized, token expired
                                                                                    case 403:   //Forbidden, not allowed to login or register new user
                                                                                    case 503:   //Service unavailable or other error in microservice
                                                                                    {   
                                                                                        showError(result_decrypted);
                                                                                        throw result_decrypted;
                                                                                    }
                                                                                    case 500:{
                                                                                        //Unknown error
                                                                                        common.commonException(common.COMMON_GLOBAL.app_function_exception, result_decrypted);
                                                                                        throw result_decrypted;
                                                                                    }
                                                                                }
                                                                            })
                                                                            .catch(error=>{
                                                                                throw error;
                                                                            })
                                                                            .finally(()=>{
                                                                                resultFetch.finished=true;
                                                                                if (parameters.spinner_id && common.COMMON_DOCUMENT?.querySelector('#' + parameters.spinner_id))
                                                                                    common.COMMON_DOCUMENT.querySelector('#' + parameters.spinner_id).classList.remove('css_spinner');
                                                                            })
                                        ]);
                                    }
                                    //set variables
                                    const encrypt_transport = ${props.encrypt_transport==1?'true':'false'};
                                    const cssFonts = '${props.cssFonts}';
                                    const cssFontsStart = '${props.cssFontsStart}';
                                    const cssCommon = '${props.cssCommon}';
                                    
                                    //import common library
                                    const common = await import(URL.createObjectURL(  new Blob ([atob('${props.jsCommon}')],{type: 'text/javascript'})));
                                    
                                    //apply start fonts + common css
                                    common.commonMiscCssApply(common.commonWindowFromBase64(cssFontsStart) + common.commonWindowFromBase64(cssCommon));
                                    
                                    //set globals
                                    common.commonGlobals('${props.globals}');
                                    const {encrypt, decrypt} = await import(URL.createObjectURL(  new Blob ([atob('${props.jsCrypto}')],{type: 'text/javascript'})))
                                                                    .then(crypto=>{
                                                                        return {encrypt:crypto.subtle.encrypt, decrypt:crypto.subtle.decrypt};
                                                                    })
                                    common.COMMON_GLOBAL.x.FFB = FFB;
                                    common.COMMON_GLOBAL.x.encrypt = encrypt;
                                    common.COMMON_GLOBAL.x.decrypt = decrypt;

                                    //init app js
                                    await common[Object.keys(common.default)[0]]();
                                    
                                    //connect to BFF
                                    await FFB({ app_id:             ${props.app_id},
                                                uuid:               '${props.uuid}',
                                                secret:             '${props.secret}',
                                                response_type:      'SSE',
                                                app_admin_app_id:   ${props.app_admin_app_id},
                                                rest_api_version:   '${props.app_rest_api_version}',
                                                rest_bff_path   :   '${props.rest_resource_bff}',
                                                data:{  
                                                        idToken:            '${props.idToken}',
                                                        authorization_type: 'APP_ID', 
                                                        path:               '/server-bff/' + '${props.uuid}', 
                                                        method:             'POST',
                                                        body:               null}});
                                    //apply font css
                                    common.commonMiscCssApply(common.commonWindowFromBase64(cssFonts));
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
                                        <div id='common_user_account'>
                                            <div id='common_iam_avatar'>
                                                <div id='common_iam_avatar_logged_in'>
                                                    <div id='common_iam_avatar_avatar'>
                                                        <div id='common_iam_avatar_avatar_img' class='common_image common_image_avatar'></div>
                                                        <div id='common_iam_avatar_message_count' class='common_icon'><div id='common_iam_avatar_message_count_text'></div></div>
                                                    </div>
                                                </div>
                                                <div id='common_iam_avatar_logged_out'>
                                                    <div id='common_iam_avatar_default_avatar' class='common_icon'></div>
                                                </div>
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
    *                      accept_language:string
    *                      },
    *        methods:      {
    *                      ConfigServer:ConfigServer,
    *                      serverUtilNumberValue:serverUtilNumberValue,
    *                      commonConvertBinary:commonConvertBinary
    *                      }
    *      }} props 
    * @returns {Promise.<string>}
    */
    const component = async props =>{
        
        const common = await import ('../common.js');
        const App = await import('../../../../server/db/App.js');
        const IamEncryption = await import('../../../../server/db/IamEncryption.js');
        const { iamAuthorizeIdToken } = await import('../../../../server/iam.js');
        const Security = await import('../../../../server/security.js');
        const {serverProcess} = await import('../../../../server/server.js');
        
        
        /**@type{server_db_document_ConfigServer} */
        const configServer = props.methods.ConfigServer.get({app_id:props.data.app_id}).result;

        const common_app_id = props.methods.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)??1;
        const admin_app_id = props.methods.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID)??1;
        const start_app_id = props.methods.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_START_APP_ID' in parameter)[0].APP_START_APP_ID)??1;
        const encrypt_transport = props.methods.serverUtilNumberValue(configServer.SERVICE_IAM.filter(parameter=>'ENCRYPT_TRANSPORT' in parameter)[0].ENCRYPT_TRANSPORT)??0;
        const app_request_timeout_seconds = props.methods.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_REQUESTTIMEOUT_SECONDS' in parameter)[0].APP_REQUESTTIMEOUT_SECONDS)??5;
        const app_requesttimeout_admin_minutes =  props.methods.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_REQUESTTIMEOUT_ADMIN_MINUTES' in parameter)[0].APP_REQUESTTIMEOUT_ADMIN_MINUTES)??60;
        const rest_resource_bff = configServer.SERVER.filter(parameter=>'REST_RESOURCE_BFF' in parameter)[0].REST_RESOURCE_BFF;
        const app_rest_api_version =configServer.SERVER.filter(parameter=>'REST_API_VERSION' in parameter)[0].REST_API_VERSION;

        /**
         * @description post data and return created values
         * @return {Promise.<{  uuid:string,
         *                      idToken:{id:number, token:string},
         *                      secret:string,
         *                      appX:{
         *                           app_id: number,
         *                           uuid:   string,
         *                           secret: string
         *                       }[]}>}
         */
        const postInit = async () =>{
            const uuid = Security.securityUUIDCreate();
            //save token in admin appid for admin or in commmon app id for users
            const idToken = await iamAuthorizeIdToken(props.data.app_id,props.data.ip, 'APP');
            //create secrets key and iv inside base64 string
            const secret = Buffer.from(JSON.stringify(await Security.securityTransportCreateSecrets()),'utf-8').toString('base64');
            //Insert encryption metadata record 
            await IamEncryption.post(props.data.app_id,
                                {app_id:props.data.app_id, uuid:uuid, secret:secret, iam_app_id_token_id:idToken.id, type:'SERVER'});
            const appX = [];
            //fetch secret metadata for available apps
            //admin: have common app id and admin app id, admin id app already fetched in commonApp()
            //user : have all except admin app id, common app id already fetched in commonApp()
            for (const app of App.get({app_id:props.data.app_id, resource_id:null}).result
                .filter((/**@type{server_db_table_App}*/app)=>
                        (start_app_id != admin_app_id && app.id != common_app_id && app.id != admin_app_id) ||
                        (start_app_id == admin_app_id && app.id == common_app_id))){
                const uuid  = Security.securityUUIDCreate(); 
                const secret= Buffer.from(JSON.stringify(await Security.securityTransportCreateSecrets()),'utf-8')
                                .toString('base64');
                await IamEncryption.post(props.data.app_id,
                    {app_id:app.id, uuid:uuid, secret:secret, iam_app_id_token_id:idToken.id??0, type:'SERVER'});
                appX.push({
                    app_id: app.id,
                    uuid:   uuid,
                    secret: secret
                });
            }
            return {
                uuid:uuid,
                idToken:idToken,
                secret:secret,
                appX:appX
            };
        };
        
        /**
         * @description get data and globals with keys same as COMMON_GLOBAL in common.js
         * @returns {Promise.<{ cssCommon:string,
         *                      jsCommon: string,
         *                      jsCrypto: string,
         *                      globals:  string,
         *                      cssFonts: string,
         *                      cssFontsStart:string,
         *                      uuid:     string,
         *                      idToken:  {id:number, token:string},
         *                      secret:   string,
         *                      app_toolbar_button_start:       number,
         *                      app_toolbar_button_framework:   number,
         *                      app_framework:number}>}
         */    
        const getData = async ()=>{
            const IamUser = await import('../../../../server/db/IamUser.js');
            const app_common = await import('../common.js');
            const AppParameter = await import('../../../../server/db/AppParameter.js');
            const fs = await import('node:fs');

            const count_user = IamUser.get(props.data.app_id, null).result.length;
            const admin_only = (await app_common.commonAppStart(props.data.app_id)==true?false:true) && count_user==0;
            

            const APP_PARAMETER = AppParameter.get({app_id:props.data.app_id,resource_id:common_app_id}).result[0]??{};
            //geodata for APP using start_app_id
            const result_geodata = await app_common.commonGeodata({ app_id:start_app_id, 
                                                                    endpoint:'SERVER', 
                                                                    ip:props.data.ip, 
                                                                    user_agent:props.data.user_agent, 
                                                                    accept_language:props.data.accept_language});
            
            const postData = await postInit();
            const app_toolbar_button_start =  props.methods.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_TOOLBAR_BUTTON_START' in parameter)[0].APP_TOOLBAR_BUTTON_START)??1;
            const app_toolbar_button_framework = props.methods.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_TOOLBAR_BUTTON_FRAMEWORK' in parameter)[0].APP_TOOLBAR_BUTTON_FRAMEWORK)??1;
            const app_framework = props.methods.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_FRAMEWORK' in parameter)[0].APP_FRAMEWORK)??1;
            const globals = JSON.stringify({
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
                                app_framework_messages:         props.methods.serverUtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_FRAMEWORK_MESSAGES' in parameter)[0].APP_FRAMEWORK_MESSAGES)??1,
                                admin_only:                     admin_only?1:0,
                                admin_first_time:               count_user==0?1:0,

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
                                                                //concat start app info with all apps
                                x:                              {...(encrypt_transport==1 && {apps:  [{
                                                                                        app_id:  props.data.app_id,
                                                                                        uuid:    postData.uuid,
                                                                                        secret:  postData.secret
                                                                                        }
                                                                                    ].concat(postData.appX.map(app =>{
                                                                                                    return {
                                                                                                        app_id:  app.app_id,
                                                                                                        uuid:    app.uuid,
                                                                                                        secret:  app.secret
                                                                                                        }; 
                                                                                                }))})
                                                                }
                                });
            
            return {
                    globals:        Buffer.from(globals).toString('base64'),
                    cssCommon:      Buffer.from((await fs.promises.readFile(serverProcess.cwd() + '/apps/common/public/css/common.css')).toString()).toString('base64'),
                    jsCommon:       Buffer.from((await fs.promises.readFile(serverProcess.cwd() + '/apps/common/public/js/common.js')).toString()).toString('base64'),
                    jsCrypto:       Buffer.from((await fs.promises.readFile(serverProcess.cwd() + '/apps/common/src/functions/common_crypto.js')).toString()).toString('base64'),
                    cssFonts:       Buffer.from(common.commonCssFonts.css
                                            .split('url(')
                                            .map(row=>{
                                                if (row.startsWith('/bff/x/'))
                                                    //add app start uuid after font uuid separated with '~'
                                                    return row.replace( row.substring(0,'/bff/x/'.length+36),
                                                                        row.substring(0,'/bff/x/'.length+36) + '~' + 
                                                                        postData.uuid);
                                                else
                                                    return row;
                                            }).join('url('))
                                    .toString('base64'),
                    cssFontsStart:  Buffer.from(`/*Fontawesome icons*/
                                                @font-face {
                                                    font-family: "Font Awesome 6 Free";
                                                    font-style: normal;
                                                    font-weight: 400;
                                                    font-display: block;
                                                    src: url(${(await props.methods.commonConvertBinary(
                                                                        'font/woff2',
                                                                        '/apps/common/public/modules/fontawesome/webfonts/fa-regular-400.woff2'))
                                                                    .result.resource}) format("woff2")
                                                }
                                                @font-face {
                                                    font-family: "Font Awesome 6 Free";
                                                    font-style: normal;
                                                    font-weight: 900;
                                                    font-display: block;
                                                    src: url(${(await props.methods.commonConvertBinary(
                                                                        'font/woff2',
                                                                        '/apps/common/public/modules/fontawesome/webfonts/fa-solid-900.woff2'))
                                                                    .result.resource}) format("woff2")
                                                }
                                                @font-face {
                                                    font-family: "Font Awesome 6 Brands";
                                                    font-style: normal;
                                                    font-weight: 900;
                                                    font-display: block;
                                                    src: url(${(await props.methods.commonConvertBinary(
                                                                        'font/woff2',
                                                                        '/apps/common/public/modules/fontawesome/webfonts/fa-brands-400.woff2'))
                                                                    .result.resource}) format("woff2")
                                                }
                                                `).toString('base64'),
                    uuid:           postData.uuid,
                    idToken:        postData.idToken,
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
                            app_admin_app_id:                   admin_app_id,
                            rest_resource_bff:                  rest_resource_bff,
                            app_rest_api_version:               app_rest_api_version,
                            app_request_timeout_seconds:        app_request_timeout_seconds,
                            app_requesttimeout_admin_minutes:   app_requesttimeout_admin_minutes,
                            idToken:                              data.idToken.token, 
                            uuid:                               data.uuid,
                            secret:                             data.secret,
                            encrypt_transport:                  encrypt_transport,
                            cssCommon:                          data.cssCommon,
                            jsCommon:                           data.jsCommon,
                            jsCrypto:                           data.jsCrypto,
                            globals:                            data.globals,
                            cssFonts:                           data.cssFonts,
                            cssFontsStart:                      data.cssFontsStart,
                            app_toolbar_button_start:           data.app_toolbar_button_start,
                            app_toolbar_button_framework:       data.app_toolbar_button_framework,
                            app_framework:                      data.app_framework
                        });
    };
    export default component;
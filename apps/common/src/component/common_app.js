/**
 * @module apps/common/src/component/common_app
 */  

/**
 * @typedef {import('../../../../server/security')['securityTransportEncrypt']} securityTransportEncrypt
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{app_id:number,
 *          app_admin_app_id:number,
 *          rest_resource_bff:string,
 *          app_rest_api_version:string,
 *          idToken:string,
 *          uuid:string,
 *          secret:string,
 *          encrypt_transport:number,
 *          securityTransportEncrypt:securityTransportEncrypt}} props
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
                                <div id='app_root'>
                                    <style> 
                                        body {
                                            background-color: rgb(81, 171, 255);
                                        }
                                        .start {    
                                            display:flex;
                                            justify-content:center;
                                            align-items:center;
                                            min-height:100vh;
                                            margin:0;
                                        }
                                        @keyframes start_spin{
                                            from {transform:rotate(0deg);}
                                            to {transform:rotate(360deg);}
                                        }
                                        .start::before{
                                            content:'' !important;
                                            width:25px;
                                            height:25px;
                                            position:absolute;
                                            border:4px solid #404040;
                                            border-top-color: rgb(81, 171, 255);
                                            border-radius:50%;
                                            animation:start_spin 1s linear infinite;
                                        }
                                    </style>
                                    <script type='module'>                                        
                                        let common = null;
                                        
                                        /**
                                         * @description Receives server side event from BFF, decrypts message and delegates event
                                         * @param {*} socket
                                         */
                                        const FFB_SSE = async socket =>{
                                            const getMessage = BFFmessage =>{
                                                    const messageDecoded = atob(BFFmessage);
                                                    return { broadcast_type:JSON.parse(messageDecoded).broadcast_type,
                                                            broadcast_message:JSON.parse(messageDecoded).broadcast_message};
                                            }
                                            const BFFStream = new WritableStream({
                                                write(data, controller){
                                                    const BFFmessage = new TextDecoder('utf-8').decode(new Uint8Array(data)).split('\\n\\n')[0];
                                                    if (BFFmessage.split('data: ')[1]){
                                                        const message = getMessage(BFFmessage.split('data: ')[1]);
                                                        switch (message.broadcast_type){
                                                            case 'INIT':{
                                                                const INITmessage = JSON.parse(message.broadcast_message);
                                                                const commonFetch = async url =>
                                                                        import(await fetch(url, 
                                                                                            {
                                                                                            cache: 'no-store',
                                                                                            method: 'GET',
                                                                                            headers: {
                                                                                                    'Connection': 'close',
                                                                                                    'app-id': INITmessage.APP.id,
                                                                                                    'app-signature': 'App Signature',
                                                                                                    'app-id-token': 'Bearer ${props.idToken}'
                                                                                                }
                                                                                            })
                                                                                    .then(module=>{if (module.status==200)return module.blob();else throw module.statusText})
                                                                                    .then(module=>URL.createObjectURL(  new Blob ([module],
                                                                                                                        {type: 'text/javascript'}))))
                                                                                    .catch(error=>document.write(error));

                                                                commonFetch(INITmessage.APP_PARAMETER.Info.rest_resource_bff + 
                                                                            '/app_id/v'+ INITmessage.APP_PARAMETER.Info.rest_api_version + 
                                                                            '/app-resource/~common~js~common.js?parameters=' + 
                                                                            btoa('content_type=text/javascript&IAM_data_app_id=0'))
                                                                .then(result=>{
                                                                    common = result;
                                                                    if (x && INITmessage.APP_PARAMETER.Info.x)
                                                                        for (const app of INITmessage.APP_PARAMETER.Info.x)
                                                                            x.apps.push(app)
                                                                    common[Object.keys(common.default)[0]]( INITmessage.APP.id, 
                                                                                                            INITmessage.APP_PARAMETER,
                                                                                                            x);
                                                                });
                                                                break;
                                                            }
                                                            default:{
                                                                common.commonSocketBroadcastShow(BFFmessage.split('data: ')[1]);
                                                                break
                                                            }
                                                        }
                                                    }
                                                }
                                            //The total number of chunks that can be contained in the internal queue before backpressure is applied
                                            }, new CountQueuingStrategy({ highWaterMark: 1 }));
                                            const BFF = socket.pipeTo(BFFStream).catch(()=>common?setTimeout(()=>{common.commonSocketConnectOnline();}, 5000):null);
                                        }
                                        /**
                                         * @description Front end for backend (FFB) that receives responses 
                                         *              from backend for frontend (BFF)
                                         * @param {{app_id:number,
                                         *          uuid:string,
                                         *          secret:string,
                                         *          response_type:'SSE'|'TEXT'|'BLOB',
                                         *          spinner_id?:string|null,
                                         *          timeout?:number|null,
                                         *          app_admin_app_id:number,
                                         *          rest_api_version: string,
                                         *          rest_bff_path   : string,
                                         *          data:{
                                         *              locale:string,
                                         *              idToken: string,
                                         *              accessToken:string,
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
                                            parameters.data.query += '&locale=' + parameters.data.locale;

                                            //encode query parameters
                                            const encodedparameters = parameters.data.query?btoa(parameters.data.query):'';
                                            const bff_path = parameters.rest_bff_path + '/' + 
                                                                ROLE.toLowerCase() + 
                                                                '/v' + (parameters.rest_api_version ??1);
                                            const url = bff_path + parameters.data.path + '?parameters=' + encodedparameters;
                                            if (parameters.spinner_id && common.COMMON_DOCUMENT?.querySelector('#' + parameters.spinner_id))
                                                common.COMMON_DOCUMENT.querySelector('#' + parameters.spinner_id).classList.add('css_spinner');
                                            const resultFetch = {finished:false};
                                            const options = {
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
                                            return parameters.response_type=='SSE'?
                                                    fetch(url, options).then(result=>FFB_SSE(result.body)):
                                                        await Promise.race([ new Promise((resolve)=>
                                                                            //sets timeout after 5 seconds
                                                                            setTimeout(()=>{
                                                                                if (resultFetch.finished==false){
                                                                                    common?.commonMessageShow?common.commonMessageShow('ERROR_BFF', null, null, '🗺⛔?'):alert('🗺⛔?');
                                                                                    resolve('🗺⛔?');
                                                                                    throw ('TIMEOUT');
                                                                                }
                                                                                }, parameters.app_id == parameters.app_admin_app_id?
                                                                                        (1000 * 60 * 60): //admin 1 hour
                                                                                        parameters.timeout || 500000)), //custom timeout or 5 seconds
                                                                            await fetch(url, options)
                                                                                /**@ts-ignore */
                                                                                .then((response) => {
                                                                                    status = response.status;
                                                                                    const clonedResponse = response.clone();
                                                                                        return Promise.all([
                                                                                            clonedResponse.text(),
                                                                                            parameters.response_type=='BLOB'?response.blob():null
                                                                                        ]);
                                                                                })
                                                                                .then(([result, result_blob]) => {
                                                                                    switch (status){
                                                                                        case 200:
                                                                                        case 201:{
                                                                                            //OK
                                                                                            /**@ts-ignore */
                                                                                            return parameters.response_type=='BLOB'?result_blob:result;
                                                                                        }
                                                                                        case 400:{
                                                                                            //Bad request
                                                                                            common.commonMessageShow('ERROR_BFF', null, 'message_text', '!');
                                                                                            throw result;
                                                                                        }
                                                                                        case 404:{
                                                                                            //Not found
                                                                                            common.commonMessageShow('ERROR_BFF', null, null, result);
                                                                                            throw result;
                                                                                        }
                                                                                        case 401:{
                                                                                            //Unauthorized, token expired
                                                                                            common.commonMessageShow('ERROR_BFF', null, null, result);
                                                                                            throw result;
                                                                                        }
                                                                                        case 403:{
                                                                                            //Forbidden, not allowed to login or register new user
                                                                                            common.commonMessageShow('ERROR_BFF', null, null, result);
                                                                                            throw result;
                                                                                        }
                                                                                        case 500:{
                                                                                            //Unknown error
                                                                                            common.commonException(COMMON_GLOBAL.app_function_exception, result);
                                                                                            throw result;
                                                                                        }
                                                                                        case 503:{
                                                                                            //Service unavailable or other error in microservice
                                                                                            common.commonMessageShow('ERROR_BFF', null, null, result);
                                                                                            throw result;
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
                                        ${props.encrypt_transport==1?
                                            `const encrypt = async parameters =>{
                                                const keyImported = await window.crypto.subtle.importKey(
                                                    'raw',
                                                    parameters.key,
                                                    {
                                                        name: 'AES-GCM',
                                                    },
                                                    false,
                                                    ['encrypt']
                                                );

                                                const encryptedBuffer = await window.crypto.subtle.encrypt(
                                                    {
                                                        name: 'AES-GCM',
                                                        iv: parameters.iv,
                                                    },
                                                    keyImported,
                                                    new TextEncoder().encode(parameters.data)
                                                );
                                                return new Uint8Array(encryptedBuffer);
                                            };
                                            const decrypt = async parameters =>{
                                                const keyImported = await window.crypto.subtle.importKey(
                                                    'raw',
                                                    parameters.key,
                                                    {
                                                        name: 'AES-GCM',
                                                    },
                                                    false,
                                                    ['decrypt']
                                                );
                                                const decryptedBuffer = await window.crypto.subtle.decrypt(
                                                    {
                                                        name: 'AES-GCM',
                                                        iv: parameters.iv,
                                                    },
                                                    keyImported,
                                                    parameters.data
                                                );
                                                return new TextDecoder().decode(decryptedBuffer); 
                                            };
                                            const x =   {
                                                        FFB:    FFB,
                                                        encrypt:encrypt,
                                                        decrypt:decrypt,
                                                        apps:   [{
                                                                app_id:  ${props.app_id},
                                                                uuid:    '${props.uuid}',
                                                                secret:  '${props.secret}'
                                                                }]
                                                        }`:
                                            'const x = {FFB:    FFB};'
                                        }
                                        await FFB({ app_id:             ${props.app_id},
                                                    uuid:               '${props.uuid}',
                                                    secret:             '${props.secret}',
                                                    response_type:      'SSE',
                                                    app_admin_app_id:   ${props.app_admin_app_id},
                                                    rest_api_version:   ${props.app_rest_api_version},
                                                    rest_bff_path   :   '${props.rest_resource_bff}',
                                                    data:{  
                                                            idToken:            '${props.idToken}',
                                                            authorization_type: 'APP_ID', 
                                                            path:               '/server-bff', 
                                                            method:             'POST',
                                                            body:               null}});
                                    </script>
                                    <link id="app_link_app_css"         rel='stylesheet'  type='text/css'     href=''/>
                                    <link id="app_link_app_report_css"  rel='stylesheet'  type='text/css'     href=''/>
                                    <link id="app_link_favicon_32x32"   rel='icon'        type='image/png'    href='' sizes='32x32'/>
                                    <link id="app_link_favicon_192x192" rel='icon'        type='image/png'    href='' sizes='192x192'/>

                                    <div id='app'></div>
                                    <div id='common_app'></div>
                                </div>
                            </body>
                            </html> `;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {   
 *                      app_id:number,
 *                      idToken:string, 
 *                      uuid:string, 
 *                      secret:string
 *                      encrypt_transport:number
 *                      },
 *        methods:      {
 *                      securityTransportEncrypt:securityTransportEncrypt
 *                      }
 *      }} props 
 * @returns {Promise.<string>}
 */
const component = async props =>{

    return template({   app_id:                     props.data.app_id,
                        app_admin_app_id:           1,
                        rest_resource_bff:          '/bff',
                        app_rest_api_version:       '1',
                        idToken:                    props.data.idToken, 
                        uuid:                       props.data.uuid,
                        secret:                     props.data.secret,
                        encrypt_transport:          props.data.encrypt_transport,
                        securityTransportEncrypt:   props.methods.securityTransportEncrypt});
};
export default component;
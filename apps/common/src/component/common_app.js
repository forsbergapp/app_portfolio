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
 * @param {{idToken:string, 
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
                                                        encrypt: encrypt,
                                                        decrypt: decrypt,
                                                        uuid:    '${props.uuid}',
                                                        secret:  '${props.secret}',
                                                        }`:
                                            'const x = null;'     
                                        }
                                        await fetch('/bff/app_id/v1/server-bff', {
                                                method: 'POST',
                                                headers: {  'Content-Type': 'text/event-stream', 
                                                            'Cache-control': 'no-cache', 
                                                            'Connection': 'keep-alive',
                                                            'app-id-token': 'Bearer ${props.idToken}'}
                                            }).then(socket=>{
                                                const getMessage = BFFmessage =>{
                                                    const messageDecoded = atob(BFFmessage);
                                                    return { broadcast_type:JSON.parse(messageDecoded).broadcast_type,
                                                            broadcast_message:JSON.parse(messageDecoded).broadcast_message};
                                                }
                                                const BFFStream = new WritableStream({
                                                    write(data, controller){
                                                        try {
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
                                                                            document.body.classList.remove('start');
                                                                            common = result;
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
                                                        } catch (error) {
                                                            console.log(error);
                                                        }
                                                    }
                                                //The total number of chunks that can be contained in the internal queue before backpressure is applied
                                                }, new CountQueuingStrategy({ highWaterMark: 1 }));
                                                const BFF = socket.body.pipeTo(BFFStream).catch(()=>common?setTimeout(()=>{common.commonSocketConnectOnline();}, 1000):null);
                                            });
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

    return template({   idToken: props.data.idToken, 
                        uuid:props.data.uuid,
                        secret:props.data.secret,
                        encrypt_transport:props.data.encrypt_transport,
                        securityTransportEncrypt:props.methods.securityTransportEncrypt});
};
export default component;
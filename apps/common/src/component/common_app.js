/**
 * @module apps/common/src/component/common_app
 */  


/**
 * @name template
 * @description Template
 * @function
 * @param {{idToken:string}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset='UTF-8'>
                                <title></title>
                                <script type='module'>
                                    let common = null;
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
                                                                        common = result;
                                                                        common[Object.keys(common.default)[0]](INITmessage.APP.id, INITmessage.APP_PARAMETER);
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
                                            }, new CountQueuingStrategy({ highWaterMark: 1 }));
                                            const BFF = socket.body.pipeTo(BFFStream).catch(()=>common?setTimeout(()=>{common.commonSocketConnectOnline();}, 1000):null);
                                        });
                                </script>
                                <link id="app_link_app_css"         rel='stylesheet'  type='text/css'     href=''/>
                                <link id="app_link_app_report_css"  rel='stylesheet'  type='text/css'     href=''/>
                                <link id="app_link_favicon_32x32"   rel='icon'        type='image/png'    href='' sizes='32x32'/>
                                <link id="app_link_favicon_192x192" rel='icon'        type='image/png'    href='' sizes='192x192'/>
                                <meta name="HandheldFriendly" content="true"/>
                                <meta name='mobile-web-app-capable' content='yes'>
                                <meta name='viewport' content='width=device-width, minimum-scale=1.0, maximum-scale = 1'>
                            </head>	
                            <body>
                                <div id='app_root'>
                                    <div id='app'></div>
                                    <div id='common_app'></div>
                                </div>
                            </body>
                            </html> `;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {   idToken:string},
 *        methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props =>{

    return template({   idToken: props.data.idToken});
};
export default component;
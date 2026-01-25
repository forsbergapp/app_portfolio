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
 *              
 *              Start script:
 *              1. import SDK Crypto (base64 in browser) rendered in server
 *              2. fetch common start objects with options set in server (base64 with server rendered encrypted fetch option string in browser)
 *              3. import common library and common component
 *              4. mount component
 *              5. sets app_id to common app id
 *              6. shares methods from common app components
 *              7. onMounted replaces <head> with new content so style and script tags are removed and all data needed is now inside the blobs only using closure pattern
 * @function
 * @param {{crypto:string,
 *          secret:string,
 *          uuid:string,
 *          url:string,
 *          options:string}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                            <head>
                                <style>
                                    body {   
                                        --common_app_color_black: #404040;
                                        --common_app_color_blue1: rgb(81, 171, 255); 
                                        display:flex;
                                        justify-content:center;
                                        align-items:center;
                                        min-height:100vh;
                                        margin:0;
                                        background: var(--common_app_color_blue1);
                                        }
                                    body *{
                                        display:none
                                    }
                                    @keyframes start_spin{
                                        from {transform:rotate(0deg);}
                                        to {transform:rotate(360deg);}
                                    }
                                    body::before{
                                        content:'' !important;
                                        width:25px;
                                        height:25px;
                                        position:absolute;
                                        border:4px solid var(--common_app_color_black);
                                        border-top-color: transparent;
                                        border-radius:50%;
                                        animation:start_spin 1s linear infinite;
                                    }
                                </style>
                                <script type=module>
                                    const commonWindowBase64From = str => {
                                        const binary_string = atob(str);
                                        const len = binary_string.length;
                                        const bytes = new Uint8Array(len);
                                        for (let i = 0; i < len; i++) {
                                            bytes[i] = binary_string.charCodeAt(i);
                                        }
                                        return new TextDecoder('utf-8').decode(bytes);
                                    };
                                    Promise.all([
                                        import(URL.createObjectURL(  new Blob ([commonWindowBase64From('${props.crypto}')],{type: 'text/javascript'}))),
                                        fetch('${props.url}', (()=>{const temp = JSON.parse(commonWindowBase64From('${props.options}'));temp.body = JSON.stringify(temp.body);return temp;})()).then(response=>response.text())
                                    ])
                                    .then(promise=>{
                                        return {Crypto: {encrypt:promise[0].subtle.encrypt, 
                                                        decrypt:promise[0].subtle.decrypt},
                                                commonStart:JSON.parse(promise[0].subtle.decrypt({
                                                                iv:         JSON.parse(commonWindowBase64From('${props.secret}')).iv,
                                                                key:        JSON.parse(commonWindowBase64From('${props.secret}')).jwk.k,
                                                                ciphertext: promise[1]}))};
                                    })
                                    .then(result=>
                                        Promise.all([
                                            import(URL.createObjectURL(  new Blob ([result.commonStart.commonComponent],{type: 'text/javascript'}))),
                                            import(URL.createObjectURL(  new Blob ([result.commonStart.jsCommon],{type: 'text/javascript'})))
                                        ])
                                        .then(promise2=>
                                            promise2[0].default({
                                                                    data:   {
                                                                            globals:    {
                                                                                            Functions:{x:{ 
                                                                                                encrypt:result.Crypto.encrypt,
                                                                                                decrypt:result.Crypto.decrypt,
                                                                                                uuid:   '${props.uuid}',
                                                                                                secret: '${props.secret}'}},
                                                                                            ...result.commonStart.globals
                                                                                        }
                                                                            },
                                                                    methods:{
                                                                            COMMON:     promise2[1]
                                                                            }
                                                                })
                                            .then(component=>{
                                                promise2[1].commonGlobalSet({key:'Data', 
                                                                        subkey:'UserApp', 
                                                                        name:'app_id', 
                                                                        value: promise2[1].commonGlobalGet('Parameters').app_common_app_id});
                                                if (component.methods){
                                                    promise2[1].commonGlobalSet({key:'Functions',  
                                                                            name:'component', 
                                                                            value: {[promise2[1].commonComponentName(promise2[1].commonGetApp().Js)]:{methods:component.methods}}})
                                                }
                                                document.body.innerHTML = component.template;component.lifecycle.onMounted();
                                            })
                                        )
                                    )
                                </script>
                            </head>
                            <html>
                                <body></body>
                            </html>  `;
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
     *                      secret: string
     *                      }>}
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
    const postData = await postInit();
    
    return template({   crypto: Buffer.from(await server.app_common.commonGetFile({ 
                                                        app_id:data_app_id, 
                                                        path:'/sdk/crypto.js',
                                                        content_type:'text/javascript'})).toString('base64'),
                        secret: postData.secret,
                        uuid:   postData.uuid,
                        url:    basePathRESTAPI + postData.uuid,
                        options:Buffer.from(
                                    JSON.stringify({
                                        cache:  'no-store',
                                        method: 'POST',
                                        headers:{
                                                    'Content-Type': server.CONTENT_TYPE_JSON,
                                                    'Connection':   'close'
                                                },
                                        body: {x: server.security.securityTransportEncrypt({
                                                    app_id: data_app_id,
                                                    iv:     JSON.parse(Buffer.from(postData.secret,'base64').toString('utf8')).iv,  
                                                    jwk:    JSON.parse(Buffer.from(postData.secret,'base64').toString('utf8')).jwk, 
                                                    data:   JSON.stringify({  
                                                                headers:{
                                                                        'app-id':       start_app_id,
                                                                        'app-signature':server.security.securityTransportEncrypt({ 
                                                                                            app_id: data_app_id,
                                                                                            iv:     JSON.parse(Buffer.from(postData.secret,'base64').toString('utf8')).iv,
                                                                                            jwk:    JSON.parse(Buffer.from(postData.secret,'base64').toString('utf8')).jwk, 
                                                                                            data:   JSON.stringify({app_id: start_app_id })}),
                                                                        'app-id-token': 'Bearer ' + postData.idToken.token,
                                                                        'Content-Type': server.CONTENT_TYPE_JSON
                                                                        },
                                                                method: 'GET',
                                                                url:    `${rest_resource_bff}/app_id/v${app_rest_api_version ??1}/server-app/${data_app_id}?parameters=`,
                                                                body:   null
                                                            })
                                                    })}
                                    })
                                ).toString('base64')
                    });
};
export default component;
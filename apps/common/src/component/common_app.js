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
 * @param {{crypto:string,
 *          secret:string,
 *          uuid:string,
 *          url:string,
 *          options:string}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
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
                                        Promise.all([
                                            import(URL.createObjectURL(  new Blob ([commonWindowFromBase64('${props.crypto}')],{type: 'text/javascript'}))),
                                            fetch('${props.url}', (()=>{const temp = JSON.parse('${props.options}');temp.body = JSON.stringify(temp.body);return temp;})()).then(response=>response.text())
                                        ])
                                        .then(promise=>{
                                            return {Crypto: {encrypt:promise[0].subtle.encrypt, 
                                                            decrypt:promise[0].subtle.decrypt},
                                                    commonStart:JSON.parse(promise[0].subtle.decrypt({
                                                                    iv:         JSON.parse(commonWindowFromBase64('${props.secret}')).iv,
                                                                    key:        JSON.parse(commonWindowFromBase64('${props.secret}')).jwk.k,
                                                                    ciphertext: promise[1]}))};
                                        })
                                        .then(start=>
                                            Promise.all([
                                                import(URL.createObjectURL(  new Blob ([start.commonStart.commonComponent],{type: 'text/javascript'}))),
                                                import(URL.createObjectURL(  new Blob ([start.commonStart.jsCommon],{type: 'text/javascript'})))
                                            ])
                                            .then(promise=>
                                                promise[0].default({
                                                        data:   {
                                                                globals:    {
                                                                                Functions:{x:{ 
                                                                                    encrypt:start.Crypto.encrypt,
                                                                                    decrypt:start.Crypto.decrypt,
                                                                                    uuid:   '${props.uuid}',
                                                                                    secret: '${props.secret}'}},
                                                                                ...start.commonStart.globals
                                                                            },
                                                                cssCommon:  start.commonStart.cssCommon
                                                                },
                                                        methods:{
                                                                COMMON:     promise[1]
                                                                }
                                                    }).then(component=>{document.body.innerHTML += component.template;component.lifecycle.onMounted()})
                                            )
                                        );
                                    </script>
                                </body>
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
                        options:JSON.stringify({
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
                    });
};
export default component;
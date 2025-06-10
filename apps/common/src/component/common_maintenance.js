/**
 * @module apps/common/src/component/common_maintenance
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{commonFetch:string,
 *          app_id:number, 
 *          Info:{
 *                app_id:           number,
 *                app_common_app_id:number,
 *                app_idtoken:      string|null,
 *                rest_resource_bff: string
 *                }}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset='UTF-8'>
                                <title></title>
                                <link id='common_css' rel='stylesheet' type='text/css' data-href='/common/css/common.css' />
                                <style>    
                                    .common_dialogue_content{
                                        background-color: var(--common_app_color_light);
                                        box-shadow: 0 4px 8px 0 var(--common_app_color_shadow1),0 6px 20px 0 var(--common_app_color_shadow2);
                                    }
                                    @media only screen and (min-width: 768px) {
                                        body{
                                            font-size: 18px;
                                        }
                                    }
                                </style>
                                <script type='module' >
                                    const commonFetch = async url =>
                                                import(await fetch(  url, 
                                                                    {
                                                                    cache: 'no-store',
                                                                    method: 'GET',
                                                                    headers: {
                                                                            'Connection': 'close',
                                                                            'app-id': ${props.app_id},
                                                                            'app-signature': 'App Signature',
                                                                            'app-id-token': 'Bearer ${props.Info.app_idtoken}'
                                                                        }
                                                                    })
                                                            .then(module=>{if (module.status==200)return module.blob();else throw module.statusText})
                                                            .then(module=>URL.createObjectURL(  new Blob ([module],
                                                                                                {type: 'text/javascript'}))))
                                                            .catch(error=>document.write(error));
                                    const common = await commonFetch('${props.commonFetch}')
                                    const COMMON_DOCUMENT = document;
                                    const appException = () => {
                                        null;
                                    };
                                    COMMON_DOCUMENT.title = '⚒';
                                    COMMON_DOCUMENT.querySelector('#common_broadcast').addEventListener('click', event => {
                                        if (event.target.id=='common_broadcast_close')
                                            common.commonComponentRemove('common_broadcast');
                                    });
                                    common.COMMON_GLOBAL.app_common_app_id= '${props.Info.app_common_app_id}';
                                    common.COMMON_GLOBAL.app_id = ${props.app_id};
                                    common.COMMON_GLOBAL.app_function_exception = appException; 
                                    common.COMMON_GLOBAL.rest_resource_bff = '${props.Info.rest_resource_bff}';
                                    common.COMMON_GLOBAL.iam_user_app_id = null;
                                    common.COMMON_GLOBAL.iam_user_id = null;
                                    common.COMMON_GLOBAL.iam_user_username = null;
                                    common.COMMON_GLOBAL.token_dt = '${props.Info.app_idtoken}';
                                    common.commonMiscResourceFetch('/common/css/common.css', COMMON_DOCUMENT.querySelector('#common_css'), 'text/css')
                                    common.commonSocketConnectOnline();    
                                    common.commonSocketMaintenanceShow(null,1);
                                </script>
                                <meta name="HandheldFriendly" content="true"/>
                                <meta name='mobile-web-app-capable' content='yes'>
                            </head>
                            <body>
                                <div id='common_dialogue_maintenance' class='common_dialogues_modal'></div>
                                <div id='common_broadcast'></div>
                            </body>
                            </html>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {   app_id:     number, 
 *                          Info:       {
 *                                      app_id:            number,
 *                                      app_common_app_id: number,
 *                                      app_idtoken:       string|null,
 *                                      rest_api_version:  string,
 *                                      rest_resource_bff: string
 *                                      }},
 *          methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props =>{
    const base64= Buffer.from ('content_type=text/javascript&data_app_id=0').toString('base64');
    return template({   commonFetch: `${props.data.Info.rest_resource_bff}/app_id/v${props.data.Info.rest_api_version}/app-resource/~common~js~common.js?parameters=${base64}`,
                        app_id:props.data.app_id, 
                        Info:props.data.Info});
};
export default component;
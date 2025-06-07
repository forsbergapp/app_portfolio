/**
 * @module apps/common/src/component/common_app
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_idtoken:string,
 *          start_app_id: number,
 *          commonFetch:string,
 *          APP:import('../../../../server/types.js').server_db_table_App, 
 *          APP_PARAMETERS:string}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset='UTF-8'>
                                <title>${props.APP.name}</title>
                                <script type='module'>
                                	const commonFetch = async url =>
                                            import(await fetch(  url, 
                                                                {
                                                                cache: 'no-store',
                                                                method: 'GET',
                                                                headers: {
                                                                        'Connection': 'close',
                                                                        'App-id': ${props.APP.id},
                                                                        'App-Signature': 'App Signature',
                                                                        'id-token': 'Bearer ${props.app_idtoken}'
                                                                    }
                                                                })
                                                        .then(module=>module.blob())
                                                        .then(module=>URL.createObjectURL(  new Blob ([module],
                                                                                            {type: 'text/javascript'}))))
                                                        .catch(error=>document.write(error));
                                    (await commonFetch('${props.commonFetch}'))
                                        .commonInit(${props.start_app_id} ,
                                                    '${props.APP_PARAMETERS}');
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
 * @param {{data:       {APP:import('../../../../server/types.js').server_db_table_App, APP_PARAMETERS:string},
 *        methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props =>{
    const INFO = JSON.parse(Buffer.from(props.data.APP_PARAMETERS, 'base64').toString('utf-8')).INFO;
    const rest_resource_bff = INFO.rest_resource_bff;
    const rest_api_version = INFO.rest_api_version;
    const base64= Buffer.from ('content_type=text/javascript&IAM_data_app_id=0').toString('base64');
    const commonFetch = `${rest_resource_bff}/app_id/v${rest_api_version}/app-resource/~common~js~common.js?parameters=${base64}`;
    return template({   commonFetch: commonFetch, 
                        app_idtoken: INFO.app_idtoken,
                        start_app_id:props.data.APP.id, //INFO.start_app_id,
                        
                        APP:props.data.APP, 
                        APP_PARAMETERS:props.data.APP_PARAMETERS});
};
export default component;
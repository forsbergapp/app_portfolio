/**
 * @module apps/common/src/component/common_app
 */

/**
 * @import {server_db_table_App, server_db_table_AppParameter, 
 *          server_apps_info_parameters}  from '../../../../server/types.js'
 */
   
/**
 * @name template
 * @description Template
 * @function
 * @param {{app_idtoken:string,
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
                                                                        'app-id': ${props.APP.id},
                                                                        'app-signature': 'App Signature',
                                                                        'app-id-token': 'Bearer ${props.app_idtoken}'
                                                                    }
                                                                })
                                                        .then(module=>module.blob())
                                                        .then(module=>URL.createObjectURL(  new Blob ([module],
                                                                                            {type: 'text/javascript'}))))
                                                        .catch(error=>document.write(error));
                                    (await commonFetch('${props.commonFetch}'))
                                        .commonInit(${props.APP.id} ,
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
 * @param {{data:       {   App:            server_db_table_App, 
 *                          AppParameters:  server_db_table_AppParameter,
 *                          Info:           server_apps_info_parameters},
 *        methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props =>{
    const base64= Buffer.from ('content_type=text/javascript&data_app_id=0').toString('base64');
    return template({   app_idtoken: props.data.Info.app_idtoken,
                        commonFetch: `${props.data.Info.rest_resource_bff}/app_id/v${props.data.Info.rest_api_version}/app-resource/~common~js~common.js?parameters=${base64}`,
                        APP:props.data.App, 
                        APP_PARAMETERS:Buffer.from(JSON.stringify({ 
                            AppParametersCommon:props.data.AppParameters,
                            Info:props.data.Info
                        })).toString('base64')});
};
export default component;
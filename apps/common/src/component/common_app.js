/**
 * @module apps/common/src/component/common_app
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{APP:import('../../../../server/types.js').server_db_table_App, APP_PARAMETERS:string}} props
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
                                                                        'id-token': 'Bearer ${JSON.parse(Buffer.from(props.APP_PARAMETERS, 'base64').toString('utf-8')).INFO.app_idtoken}'
                                                                    }
                                                                })
                                                        .then(module=>module.blob())
                                                        .then(module=>URL.createObjectURL(  new Blob ([module],
                                                                                            {type: 'text/javascript'}))));
                                    (await commonFetch('${props.APP.js}'))
                                        .appCommonInit(await commonFetch('/common/js/common.js'), '${props.APP_PARAMETERS}');
                                </script>
                                <link id="app_link_app_css"         rel='stylesheet'  type='text/css'     href='${props.APP.css}'/>
                                <link id="app_link_app_report_css"  rel='stylesheet'  type='text/css'     href='${props.APP.css_report}'/>
                                <link id="app_link_favicon_32x32"   rel='icon'        type='image/png'    href='${props.APP.favicon_32x32}' sizes='32x32'/>
                                <link id="app_link_favicon_192x192" rel='icon'        type='image/png'    href='${props.APP.favicon_192x192}' sizes='192x192'/>
                                <link id="app_link_manifest"        rel='manifest'    href='${props.APP.manifest}'/>
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
const component = async props => 
    template({APP:props.data.APP, APP_PARAMETERS:props.data.APP_PARAMETERS});
export default component;
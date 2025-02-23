/**
 * @module apps/common/src/component/common_app
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{APP:import('../../../../server/types.js').server_db_table_app, APP_PARAMETERS:string}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset='UTF-8'>
                                <title>${props.APP.name}</title>
                                <script type='module'>
                                    import('${props.APP.js}').then((app) => app.appCommonInit('${props.APP_PARAMETERS}'));
                                </script>
                                <link rel='stylesheet'  type='text/css'     href='${props.APP.css}'/>
                                <link rel='stylesheet'  type='text/css'     href='${props.APP.css_report}'/>
                                <link rel='icon'        type='image/png'    href='${props.APP.favicon_32x32}' sizes='32x32'/>
                                <link rel='icon'        type='image/png'    href='${props.APP.favicon_192x192}' sizes='192x192'/>
                                <link rel='manifest'    href='${props.APP.manifest}'/>
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
 * @param {{data:       {APP:import('../../../../server/types.js').server_db_table_app, APP_PARAMETERS:string},
 *        methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props => template({APP:props.data.APP, APP_PARAMETERS:props.data.APP_PARAMETERS});
export default component;
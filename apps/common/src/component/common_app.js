/**
 * @module apps/common/src/component/common_app
 */

/**
 * @param {{APP:import('../../../../server/types.js').server_db_file_app, APP_PARAMETERS:string}} props
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset='UTF-8'>
                                <title>${props.APP.NAME}</title>
                                <script type="importmap">
                                    {
                                        "imports": {
                                            ${props.APP.JS !=''?          `"app" 			: "${props.APP.JS}",`:''}
                                            "common"	    : "/common/js/common.js",
                                            "easy.qrcode"   : "/common/modules/easy.qrcode/easy.qrcode.js",
                                            "leaflet"	    : "/common/modules/leaflet/leaflet-src.esm.js",
                                            "React" 		: "/common/modules/react/react.development.js",
                                            "ReactDOM" 		: "/common/modules/react/react-dom.development.js",
                                            "regional"  	: "/common/modules/regional/regional.js",
                                            "Vue" 	    	: "/common/modules/vue/vue.esm-browser.js"
                                        }
                                    }
                                </script>

                                <script type='module'>
                                    import('app').then((app) => app.appCommonInit('${props.APP_PARAMETERS}'));
                                </script>
                                <link rel='stylesheet'  type='text/css'     href='${props.APP.CSS}'/>
                                <link rel='stylesheet'  type='text/css'     href='${props.APP.CSS_REPORT}'/>
                                <link rel='icon'        type='image/png'    href='${props.APP.FAVICON_32x32}' sizes='32x32'/>
                                <link rel='icon'        type='image/png'    href='${props.APP.FAVICON_192x192}' sizes='192x192'/>
                                <link rel='manifest'    href='${props.APP.MANIFEST}'/>
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
 * 
 @param {{data:       {APP:import('../../../../server/types.js').server_db_file_app, APP_PARAMETERS:string},
 *        methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props => template({APP:props.data.APP, APP_PARAMETERS:props.data.APP_PARAMETERS});
export default component;
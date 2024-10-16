/**
 * @module apps/common/src/component/common_app
 */

/**
 * @param {{CONFIG_APP:import('../../../../server/types.js').server_db_file_app, ITEM_COMMON_PARAMETERS:string}} props
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset='UTF-8'>
                                <title>${props.CONFIG_APP.NAME}</title>
                                <script type="importmap">
                                    {
                                        "imports": {
                                            ${props.CONFIG_APP.JS !=''?          `"app" 			: "${props.CONFIG_APP.JS}",`:''}
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
                                    import('app').then((app) => app.appCommonInit('${props.ITEM_COMMON_PARAMETERS}'));
                                </script>
                                <link rel='stylesheet'  type='text/css'     href='${props.CONFIG_APP.CSS}'/>
                                <link rel='stylesheet'  type='text/css'     href='${props.CONFIG_APP.CSS_REPORT}'/>
                                <link rel='icon'        type='image/png'    href='${props.CONFIG_APP.FAVICON_32x32}' sizes='32x32'/>
                                <link rel='icon'        type='image/png'    href='${props.CONFIG_APP.FAVICON_192x192}' sizes='192x192'/>
                                <link rel='manifest'    href='${props.CONFIG_APP.MANIFEST}'/>
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
 @param {{data:       {CONFIG_APP:import('../../../../server/types.js').server_db_file_app, ITEM_COMMON_PARAMETERS:string},
 *        methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props => template({CONFIG_APP:props.data.CONFIG_APP, ITEM_COMMON_PARAMETERS:props.data.ITEM_COMMON_PARAMETERS});
export default component;
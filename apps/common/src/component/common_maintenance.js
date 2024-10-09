/**
 * @module apps/common/src/component/common_maintenance
 */

/**
 * @param {{CONFIG_APP:*, ITEM_COMMON_PARAMETERS:string}} props
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset='UTF-8'>
                                <title></title>
                                <script type="importmap">
                                    {
                                        "imports": {
                                            "maintenance"   : "/maintenance/js/maintenance.js",
                                            "common"	    : "/maintenance/js/common.js",
                                            "easy.qrcode"   : "/maintenance/modules/easy.qrcode/easy.qrcode.js",
                                            "leaflet"	    : "/maintenance/modules/leaflet/leaflet-src.esm.js",
                                            "React" 		: "/maintenance/modules/react/react.development.js",
                                            "ReactDOM" 		: "/maintenance/modules/react/react-dom.development.js",
                                            "regional"  	: "/maintenance/modules/regional/regional.js",
                                            "Vue" 	    	: "/maintenance/modules/vue/vue.esm-browser.js"
                                        }
                                    }
                                </script>
                                <link rel='stylesheet' type='text/css' href='/maintenance/css/common.css' />
                                <link rel='stylesheet' type='text/css' href='/maintenance/css/maintenance.css' />
                                <script type='text/javascript' type='module' >
                                    import('maintenance').then((maintenance)=>maintenance.init(${props.ITEM_COMMON_PARAMETERS})
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
 * 
 * @param {{data:       {CONFIG_APP:*, ITEM_COMMON_PARAMETERS:string},
 *          methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props => template({CONFIG_APP:props.data.CONFIG_APP, ITEM_COMMON_PARAMETERS:props.data.ITEM_COMMON_PARAMETERS});
export default component;
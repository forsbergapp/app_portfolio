/**
 * @module apps/common/src/component/common_maintenance
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{CONFIG_APP:*, ITEM_COMMON_PARAMETERS:string}} props
 * @returns {string}
 */
const template = props =>`  <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset='UTF-8'>
                                <title></title>
                                <link rel='stylesheet' type='text/css' href='/maintenance/css/common.css' />
                                <link rel='stylesheet' type='text/css' href='/maintenance/css/maintenance.css' />
                                <script type='module' >
                                    import('/maintenance/js/maintenance.js').then((maintenance)=>maintenance.appCommonInit('${props.ITEM_COMMON_PARAMETERS}'));
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
 * @param {{data:       {CONFIG_APP:*, ITEM_COMMON_PARAMETERS:string},
 *          methods:    null}} props 
 * @returns {Promise.<string>}
 */
const component = async props => template({CONFIG_APP:props.data.CONFIG_APP, ITEM_COMMON_PARAMETERS:props.data.ITEM_COMMON_PARAMETERS});
export default component;
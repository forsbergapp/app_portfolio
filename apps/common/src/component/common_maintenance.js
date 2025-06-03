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
                                <link id="common_link_common_css" rel='stylesheet' type='text/css' href='/common/css/common.css' />
                                <style>
                                    #common_broadcast_close::before{		content:var(--common_app_icon_broadcast_close)}
                                    #common_broadcast_info_title::before{	content:var(--common_app_icon_alert)}
                                    #common_maintenance_message::before{	content:var(--common_app_icon_maintenance)}

                                    .common_image{
                                        border-radius: 50%;
                                        background-size: contain;
                                        background-position: center;
                                        background-repeat: no-repeat;
                                    }

                                    .common_image_alert{
                                        width: 50px;
                                        height: 50px;
                                    }
                                    .common_image_broadcast{
                                        width: 34px;
                                        height: 34px;
                                    }

                                    /*DIALOGUE MAINTENANCE */
                                    #common_maintenance_header{
                                        width: 100%;
                                        height: 50px;
                                    }
                                    #common_dialogue_maintenance{
                                        display: block;
                                    }
                                    #common_dialogue_maintenance_content{
                                        height:250px;
                                        width:300px;
                                    }
                                    #common_maintenance_logo {
                                        margin: 0 auto;
                                    }
                                    #common_maintenance_message{
                                        padding-top:20px;
                                        padding-bottom:20px;
                                        font-weight: bold;
                                        color: var(--common_app_color_blue1);
                                        font-size: 2em;
                                    }
                                    #common_maintenance_countdown{
                                        font-size: 30px;
                                        padding-bottom:20px;
                                    }
                                    #common_maintenance_footer{
                                        padding-bottom:5px;
                                    }

                                    body{
                                        font-size: 16px;
                                        margin: 0;
                                        height: 100%;
                                        padding: 0px;
                                        color: var(--common_app_color_black);
                                        background: var(--common_app_color_blue1);
                                    }

                                    .common_icon {
                                        font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands";
                                        font-weight: 900;
                                        font-style: normal;
                                        display: inline-block;
                                    }  
                                    /*dialogue*/
                                    .common_dialogue{
                                        visibility:hidden;
                                        position: fixed;
                                        z-index: 50;
                                        padding-top: 10px;
                                        left: 0;
                                        top: 0;
                                        width: 100%;
                                        height: 100%;
                                        overflow: auto;
                                    }
                                    .common_dialogue_content{
                                        text-align:center;
                                        top: 50%;
                                        left: 50%;
                                        position: fixed;
                                        transform: translate(-50%, -50%);
                                        width: auto;
                                        height: auto;
                                        word-break: break-word;
                                        border-radius: var(--common_app_css_border_radius);
                                    }

                                    @keyframes common_pulsate {
                                        0% { 
                                            opacity: 0.5;
                                        }
                                        50% { 
                                            opacity: 1.0;
                                        }
                                        100% { 
                                            opacity: 0.5;
                                        }
                                    }
                                    .common_toolbar_button:hover{
                                        color: var(--common_app_color_green);
                                    }
                                    #common_maintenance_header{
                                        background-color: var(--common_app_color_blue1);
                                    }
                                    #common_maintenance_logo{
                                        background-color: var(--common_app_color_light);
                                    }
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
                                    const COMMON_DOCUMENT = document;
                                    const common = await import('/common/js/common.js');
                                    const appException = () => {
                                        null;
                                    };
                                    const appCommonInit = async parameters => {
                                        COMMON_DOCUMENT.title = '⚒';
                                        COMMON_DOCUMENT.querySelector('#common_broadcast').addEventListener('click', (/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
                                            const event_target_id = common.commonMiscElementId(event.target);
                                            if (event_target_id=='common_broadcast_close')
                                                common.commonComponentRemove('common_broadcast');
                                        });
                                        const decoded_parameters = JSON.parse(common.commonWindowFromBase64(parameters));
                                        common.COMMON_GLOBAL.common_app_id= decoded_parameters.common_app_id;
                                        common.COMMON_GLOBAL.app_id = decoded_parameters.app_id;
                                        common.COMMON_GLOBAL.app_function_exception = appException; 
                                        common.COMMON_GLOBAL.rest_resource_bff = decoded_parameters.rest_resource_bff;
                                        common.COMMON_GLOBAL.iam_user_app_id = null;
                                        common.COMMON_GLOBAL.iam_user_id = null;
                                        common.COMMON_GLOBAL.iam_user_username = null;
                                        common.COMMON_GLOBAL.token_dt = decoded_parameters.app_idtoken;
                                        common.commonSocketConnectOnline();    
                                        common.commonSocketMaintenanceShow(null,1);
                                    };
                                    appCommonInit('${props.ITEM_COMMON_PARAMETERS}');
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
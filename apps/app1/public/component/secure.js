/**
 * Displays menu and logged in user
 * @module apps/app1/component/secure
 */
/**
 * @import {common}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{icons:{
 *                 menu_open:string,
 *                 menu_close:string,
 *                 chart:string,
 *                 users:string,
 *                 apps:string,
 *                 server_settings:string,
 *                 monitor:string,
 *                 database_settings:string,
 *                 database_stats:string,
 *                 print:string,
 *                 server:string,
 *                 logout:string}}} props
 * @returns {string}
 */
const template = props =>` <div id='secure'>
                            <div id='secure_menu_open' class='common_app_dialogues_button common_link common_icon_button'>${props.icons.menu_open}</div>
                            <div id='secure_menu'>
                                <div id='secure_menu_menus'>
                                    <div id='secure_menu_close' class='common_app_dialogues_button common_link common_icon_button'>${props.icons.menu_close}</div>
                                    <div id='secure_menu_1' class='secure_menuitem common_link common_icon_button'>${props.icons.chart}</div>
                                    <div id='secure_menu_2' class='secure_menuitem common_link common_icon_button'>${props.icons.users}</div>
                                    <div id='secure_menu_3' class='secure_menuitem common_link common_icon_button'>${props.icons.apps}</div>
                                    <div id='secure_menu_4' class='secure_menuitem common_link common_icon_button'>${props.icons.monitor}</div>
                                    <div id='secure_menu_5' class='secure_menuitem common_link common_icon_button'>${props.icons.server_settings}</div>
                                    <div id='secure_menu_6' class='secure_menuitem common_link common_icon_button'>${props.icons.database_settings}</div>
                                    <div id='secure_menu_7' class='secure_menuitem common_link common_icon_button'>${props.icons.database_stats}</div>
                                    <div id='secure_menu_8' class='secure_menuitem common_link common_icon_button'>${props.icons.print}</div>
                                    <div id='secure_menu_9' class='secure_menuitem common_link common_icon_button'>${props.icons.server}</div>
                                    <div id='secure_menu_10' class='secure_menuitem common_link common_icon_button'>${props.icons.logout}</div>
                                </div>
                            </div>
                            <div id='secure_main'>
                                <div id='secure_menu_content'></div>
                            </div>
                        </div>
                        `;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:{      commonMountdiv:string},
 *          methods:{   COMMON:common['CommonModuleCommon']}}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        lifecycle:  {onMounted:null},
        data:   null,
        methods:null,
        template: template({icons:{
                                menu_open:props.methods.COMMON.commonGlobalGet('ICONS')['menu_open'],
                                menu_close:props.methods.COMMON.commonGlobalGet('ICONS')['close'],
                                chart:props.methods.COMMON.commonGlobalGet('ICONS')['chart_pie'],
                                users:props.methods.COMMON.commonGlobalGet('ICONS')['users'],
                                apps:props.methods.COMMON.commonGlobalGet('ICONS')['apps'] + props.methods.COMMON.commonGlobalGet('ICONS')['settings'],
                                server_settings:props.methods.COMMON.commonGlobalGet('ICONS')['server']+ props.methods.COMMON.commonGlobalGet('ICONS')['settings'],
                                monitor:props.methods.COMMON.commonGlobalGet('ICONS')['monitor'],
                                database_settings:props.methods.COMMON.commonGlobalGet('ICONS')['database']+ props.methods.COMMON.commonGlobalGet('ICONS')['settings'],
                                database_stats:props.methods.COMMON.commonGlobalGet('ICONS')['database']+ props.methods.COMMON.commonGlobalGet('ICONS')['database_stat'],
                                print:props.methods.COMMON.commonGlobalGet('ICONS')['print'],
                                server:props.methods.COMMON.commonGlobalGet('ICONS')['server'],
                                logout:props.methods.COMMON.commonGlobalGet('ICONS')['logout']
        }})
    };
};
export default component;
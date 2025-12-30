/**
 * Displays app
 * @module apps/app4/component/app
 */

/**
 * @import {common}  from '../../../common_types.js'
 * @import {CommonModuleLibTimetable} from '../js/types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{icons:{   zoomout:string,
 *                    zoomin:string,
 *                    left:string,
 *                    right:string,
 *                    search:string,
 *                    print:string,
 *                    day:string,
 *                    month:string,
 *                    year:string,
 *                    settings:string}}} props
 * @returns {string}
 */
const template = props=>`  <div id='toolbar_top'>
                            <div id='toolbar_btn_zoomout' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.zoomout}</div>
                            <div id='toolbar_btn_zoomin' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.zoomin}</div>
                            <div id='toolbar_btn_left' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.left}</div>
                            <div id='toolbar_btn_right' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.right}</div>
                            <div id='toolbar_btn_search' class='common_toolbar_button common_link common_icon_toolbar_m'>${props.icons.search}</div>
                        </div>
                        <div id='paper'></div>
                        <div id='toolbar_bottom'>
                            <div id='toolbar_btn_print' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.print}</div>
                            <div id='toolbar_btn_day' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.day}</div>
                            <div id='toolbar_btn_month' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.month}</div>
                            <div id='toolbar_btn_year' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.year}</div>
                            <div id='toolbar_btn_settings' class='common_toolbar_button common_link common_icon_toolbar_m'>${props.icons.settings}</div>
                        </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:{appLibTimetable:CommonModuleLibTimetable},
 *                      template:string}>}
 */
const component = async props => {
    
    return {
        lifecycle:  null,
        data:       null,
        methods:    {appLibTimetable:await props.methods.COMMON.commonMiscImport('/component/app_lib.js')},
        template:   template({icons:{   zoomout:props.methods.COMMON.commonGlobalGet('ICONS')['zoomout'],
                                        zoomin:props.methods.COMMON.commonGlobalGet('ICONS')['zoomin'],
                                        left:props.methods.COMMON.commonGlobalGet('ICONS')['left'],
                                        right:props.methods.COMMON.commonGlobalGet('ICONS')['right'],
                                        search:props.methods.COMMON.commonGlobalGet('ICONS')['search'],
                                        print:props.methods.COMMON.commonGlobalGet('ICONS')['print'],
                                        day:props.methods.COMMON.commonGlobalGet('ICONS')['regional_day'],
                                        month:props.methods.COMMON.commonGlobalGet('ICONS')['regional_month'],
                                        year:props.methods.COMMON.commonGlobalGet('ICONS')['regional_year'],
                                        settings:props.methods.COMMON.commonGlobalGet('ICONS')['settings']
        }})

    };
};
export default component;
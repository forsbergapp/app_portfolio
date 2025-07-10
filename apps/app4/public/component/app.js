/**
 * Displays app
 * @module apps/app4/component/app
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 * @import {CommonModuleLibTimetable} from '../js/types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = ()=>`  <div id='toolbar_top'>
                            <div id='toolbar_btn_zoomout' class='common_toolbar_button common_icon' ></div>
                            <div id='toolbar_btn_zoomin' class='common_toolbar_button common_icon' ></div>
                            <div id='toolbar_btn_left' class='common_toolbar_button common_icon' ></div>
                            <div id='toolbar_btn_right' class='common_toolbar_button common_icon' ></div>
                            <div id='toolbar_btn_search' class='common_toolbar_button common_icon'></div>
                        </div>
                        <div id='app_profile_search'></div>
                        <div id='paper'></div>
                        <div id='settings'></div>
                        <div id='dialogues'>
                            <div id='dialogue_loading'></div>
                            <div id='dialogue_info' class='common_dialogue_content'></div>
                        </div>
                        <div id='toolbar_bottom'>
                            <div id='toolbar_btn_print' class='common_toolbar_button common_icon' ></div>
                            <div id='toolbar_btn_day' class='common_toolbar_button common_icon' ></div>
                            <div id='app_profile_toolbar'></div>
                            <div id='toolbar_btn_month' class='common_toolbar_button common_icon' ></div>
                            <div id='toolbar_btn_year' class='common_toolbar_button common_icon' ></div>
                            <div id='toolbar_btn_settings' class='common_toolbar_button common_icon'></div>
                        </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      commonMiscImport:CommonModuleCommon['commonMiscImport'],
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT
 *                      }}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:{appLibTimetable:CommonModuleLibTimetable},
 *                      template:string}>}
 */
const component = async props => {
    
    return {
        lifecycle:  null,
        data:       null,
        methods:    {appLibTimetable:await props.methods.commonMiscImport('/component/app_lib.js')},
        template:   template()
    };
};
export default component;
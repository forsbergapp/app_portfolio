/**
 * Displays common app
 * @module apps/common/component/common_app
 */

/**
 * @import {COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{framework:number}} props 
 * @returns {string}
 */
const template = props =>`  <div id='common_toolbar_framework' ${props.framework==0?'class=\'show\'':''}>
                                <div id='common_toolbar_framework_js' class='common_icon common_toolbar_button ${props.framework==0?'common_toolbar_selected':''}'></div>
                                <div id='common_toolbar_framework_vue' class='common_icon common_toolbar_button'></div>
                                <div id='common_toolbar_framework_react' class='common_icon common_toolbar_button'></div>
                            </div>
                            <div id='common_dialogues'>
                                <div id='common_dialogue_apps' class='common_dialogue_content'></div>
                                <div id='common_dialogue_info' class='common_dialogue_content'></div>
                                <div id='common_dialogue_iam_start' class='common_dialogue_content'></div>
                                <div id='common_dialogue_user_menu' class='common_dialogue_content'></div>
                                <div id='common_dialogue_iam_verify' class='common_dialogue_content'></div>
                                <div id='common_dialogue_message' class='common_dialogue_content'></div>
                                <div id='common_dialogue_profile' class='common_dialogue_content'></div>
                                <div id='common_dialogue_lov' class='common_dialogue_content'></div>
                                <div id='common_dialogue_app_data_display' class='common_dialogue_content'></div>
                            </div>
                            <div id='common_window_info'></div>
                            <div id='common_broadcast'></div>
                            <div id='common_profile_search'></div>
                            <div id='common_user_account'></div>
                            <div id='common_profile_toolbar'></div>
                            <div id='common_style'>
                                <link id='common_link_common_css' rel='stylesheet' type='text/css' data-href='/common/css/common.css' />
                                <link id='common_link_common_app_css' rel='stylesheet' type='text/css' data-href='/common/css/common_app.css' />
                            </div>
                            <div id='common_fonts'></di>
                            `;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      framework: number},
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT}}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({
                        framework:      props.data.framework
                    })
    };
};
export default component;
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
 * @param {{    app_toolbar_button_start: number,
 *              app_toolbar_button_framework: number,
 *              app_framework:number}} props 
 * @returns {string}
 */
const template = props =>`  <div id='common_app_toolbar' ${(props.app_toolbar_button_start==1 ||
                                                            props.app_toolbar_button_framework==1)?'class=\'show\'':''}>
                                <div id='common_app_toolbar_start' class='common_icon common_toolbar_button ${props.app_toolbar_button_start==1?'show':''}'></div>
                                <div id='common_app_toolbar_framework_js' class='common_icon common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''} ${props.app_framework==1?'common_toolbar_selected':''}'></div>
                                <div id='common_app_toolbar_framework_vue' class='common_icon common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''}'></div>
                                <div id='common_app_toolbar_framework_react' class='common_icon common_toolbar_button ${props.app_toolbar_button_framework==1?'show':''}'></div>
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
                            <div id='common_user_account'>
                                <div id='common_iam_avatar'>
                                    <div id='common_iam_avatar_logged_in'>
                                        <div id='common_iam_avatar_avatar'>
                                            <div id='common_iam_avatar_avatar_img' class='common_image common_image_avatar'></div>
                                            <div id='common_iam_avatar_message_count' class='common_icon'><div id='common_iam_avatar_message_count_text'></div></div>
                                        </div>
                                    </div>
                                    <div id='common_iam_avatar_logged_out'>
                                        <div id='common_iam_avatar_default_avatar' class='common_icon'></div>
                                    </div>
                                </div>
                            </div>
                            <div id='common_profile_toolbar'></div>
                            <div id='common_style'>
                                <link id='common_link_common_css' rel='stylesheet' type='text/css' data-href='/common/css/common.css' />
                                <link media='all' data-href='/common/css/font/fonts.css' type='text/css' rel='stylesheet'>
                            </div>
                            `;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_toolbar_button_start: number
 *                      app_toolbar_button_framework: number
 *                      app_framework: number},
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
                        app_toolbar_button_start:       props.data.app_toolbar_button_start,
                        app_toolbar_button_framework:   props.data.app_toolbar_button_framework,
                        app_framework:                  props.data.app_framework
                    })
    };
};
export default component;
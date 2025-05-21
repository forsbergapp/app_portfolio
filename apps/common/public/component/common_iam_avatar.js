/**
 * Displays IAM avatar
 * @module apps/common/component/common_iam_avatar
 */

/**
 * @import {COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () =>` <div id='common_iam_avatar'>
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
                        `;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT}}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;
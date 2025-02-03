/**
 * Displays IAM pasword
 * @module apps/common/component/common_dialogue_iam_password_new
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
const template = () =>`  <div id='common_dialogue_iam_password_new_icon' class='common_icon'></div>
                            <div class='common_password_container'>
                                <div id='common_dialogue_iam_password_new_password' contentEditable='true' class='common_password_new_input common_input common_password common_placeholder'></div>
                                <div id='common_dialogue_iam_password_new_password_mask' class='common_input common_password_mask'/></div>
                            </div>
                            <div class='common_password_container'>
                                <div id='common_dialogue_iam_password_new_confirm' contentEditable='true' class='common_password_new_input common_input common_password common_placeholder'></div>
                                <div id='common_dialogue_iam_password_new_confirm_mask' class='common_input common_password_mask'></div>
                            </div>
                            <div id='common_dialogue_iam_password_new_button_row'>
                                <div id='common_dialogue_iam_password_new_cancel' class='common_dialogue_button common_icon'></div>
                                <div id='common_dialogue_iam_password_new_ok' class='common_dialogue_button common_icon'></div>
                            </div>`;
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
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show2');
    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;

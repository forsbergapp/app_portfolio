/**
 * @module apps/common/component/common_dialogue_user_password_new
 */
/**
 * @param {{auth:string}} props
 */
const template = props =>`  <div id='common_user_password_new_icon' class='common_icon'></div>
                            <div id='common_user_password_new_auth'>${props.auth}</div>
                            <div class='common_password_container'>
                                <div id='common_user_password_new' contentEditable='true' class='common_password_new_input common_input common_password common_placeholder'></div>
                                <div id='common_user_password_new_mask' class='common_input common_password_mask'/></div>
                            </div>
                            <div class='common_password_container'>
                                <div id='common_user_password_new_confirm' contentEditable='true' class='common_password_new_input common_input common_password common_placeholder'></div>
                                <div id='common_user_password_new_confirm_mask' class='common_input common_password_mask'></div>
                            </div>
                            <div id='common_user_password_new_button_row'>
                                <div id='common_user_password_new_cancel' class='common_dialogue_button common_icon'></div>
                                <div id='common_user_password_new_ok' class='common_dialogue_button common_icon'></div>
                            </div>`;
/**
 * 
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      auth:string},
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument}}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).classList.add('common_dialogue_show2');
    props.methods.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({auth:props.data.auth})
    };
};
export default component;
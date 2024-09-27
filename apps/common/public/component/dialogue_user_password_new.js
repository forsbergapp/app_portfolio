/**
 * @module apps/common/component/dialogue_user_password_new
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
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          auth:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show2');
    props.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    return {
        props:  {function_post:null},
        data:   null,
        template: template({auth:props.auth})
    };
};
export default component;

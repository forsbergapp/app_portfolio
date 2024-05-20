/**@type{import('../../../types.js').AppDocument}} */
const AppDocument = document;
const template =`   <div id='common_user_password_new_icon' class='common_icon'></div>
                    <div id='common_user_password_new_auth'><AUTH/></div>
                    <div class='common_password_container'>
                        <div id='common_user_password_new' contentEditable='true' class='common_password_new_input common_input common_password' placeholder='<COMMON_TRANSLATION_NEW_PASSWORD/>'></div>
                        <div id='common_user_password_new_mask' class='common_input common_password_mask'/></div>
                    </div>
                    <div class='common_password_container'>
                        <div id='common_user_password_new_confirm' contentEditable='true' class='common_password_new_input common_input common_password' placeholder='<COMMON_TRANSLATION_NEW_PASSWORD_CONFIRM/>'></div>
                        <div id='common_user_password_new_confirm_mask' class='common_input common_password_mask'></div>
                    </div>
                    <div id='common_user_password_new_button_row'>
                        <div id='common_user_password_new_cancel' class='common_dialogue_button common_icon'></div>
                        <div id='common_user_password_new_ok' class='common_dialogue_button common_icon'></div>
                    </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          auth:string,
 *          translation_new_password:string,
 *          translation_new_password_confirm:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show2');
    props.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    
    const render_template = () =>{
        return template
                .replaceAll('<AUTH/>',props.auth)
                .replaceAll('<COMMON_TRANSLATION_NEW_PASSWORD/>',props.translation_new_password)
                .replaceAll('<COMMON_TRANSLATION_NEW_PASSWORD_CONFIRM/>',props.translation_new_password_confirm);
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default component;

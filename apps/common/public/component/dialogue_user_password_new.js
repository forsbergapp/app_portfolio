const template =`   <div id='common_user_password_new_icon' class='common_icon'></div>
                    <div id='common_user_password_new_auth'><AUTH/></div>
                    <div class='common_password_container'>
                        <div id='common_user_password_new' contenteditable=true class='common_password_new_input common_input common_password' placeholder='<COMMON_TRANSLATION_NEW_PASSWORD/>'></div>
                        <div id='common_user_password_new_mask' class='common_input common_password_mask'/></div>
                    </div>
                    <div class='common_password_container'>
                        <div id='common_user_password_new_confirm' contenteditable=true class='common_password_new_input common_input common_password' placeholder='<COMMON_TRANSLATION_NEW_PASSWORD_CONFIRM/>'></div>
                        <div id='common_user_password_new_confirm_mask' class='common_input common_password_mask'></div>
                    </div>
                    <div id='common_user_password_new_button_row'>
                        <div id='common_user_password_new_cancel' class='common_dialogue_button common_icon'></div>
                        <div id='common_user_password_new_ok' class='common_dialogue_button common_icon'></div>
                    </div>`;
/**
 * 
 * @param {*} props 
 * @returns {Promise.<void>}
 */
const method = async props => {
    //set z-index
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show2');
    //set modal
    props.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    
    const render_template = async () =>{
        return template
                .replaceAll('<AUTH/>',props.auth)
                .replaceAll('<COMMON_TRANSLATION_NEW_PASSWORD/>',props.translation_new_password)
                .replaceAll('<COMMON_TRANSLATION_NEW_PASSWORD_CONFIRM/>',props.translation_new_password_confirm);
    }

    switch (props.common_framework){
        case 2:{
            //Vue
            //Use tempmount div to be able to return pure HTML
            //props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
            //Vue.createApp(...
            //return props.common_document.querySelector('#tempmount').innerHTML;
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = await render_template();
        }
        case 3:{
            //React
            //Use tempmount div to be able to return pure HTML
            //props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
            //ReactDOM.createRoot(div... .render( App()
            //return props.common_document.querySelector('#tempmount').innerHTML;
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = await render_template();
        }
        case 1:
        default:{
            //Default Javascript
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = await render_template();
        }
    }
}
export default method;

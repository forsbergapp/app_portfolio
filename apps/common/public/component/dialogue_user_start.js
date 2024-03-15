const template =`   <div id='common_user_start_logo'></div>
                    <div id='common_user_start_nav'>
                        <div id='common_user_start_login'  class='common_icon'></div>
                        <div id='common_user_start_login_system_admin'  class='common_icon'></div>
                        <div id='common_user_start_signup' class='common_icon' ></div>
                        <div id='common_user_start_forgot' class='common_icon' ></div>
                    </div>
                    <div id='common_user_start_login_form' class='common_user_start_form'>
                        <div id='common_user_start_login_username' contenteditable=true class='common_input' placeholder='<COMMON_TRANSLATION_USERNAME/>'></div>
                        <div class='common_password_container'>
                            <div id='common_user_start_login_password' contenteditable=true class='common_input common_password' placeholder='<COMMON_TRANSLATION_PASSWORD/>'></div>
                            <div id='common_user_start_login_password_mask' class='common_input common_password_mask'></div>
                        </div>
                        <div id='common_user_start_login_button' class='common_dialogue_button common_user_start_button common_icon' ></div>
                        <COMMON_PROVIDER_BUTTONS/>
                    </div>
                    <div id='common_user_start_login_system_admin_form' class='common_user_start_form'>
                        <div id='common_user_start_login_system_admin_first_time'></div>
                        <div id='common_user_start_login_system_admin_username' contenteditable=true class='common_input' placeholder='<COMMON_TRANSLATION_USERNAME/>'></div>
                        <div class='common_password_container'>
                            <div id='common_user_start_login_system_admin_password' contenteditable=true class='common_input common_password' placeholder='<COMMON_TRANSLATION_PASSWORD/>'></div>
                            <div id='common_user_start_login_system_admin_password_mask' class='common_input common_password_mask'></div>
                        </div>
                        <div id='common_user_start_login_system_admin_password_confirm_container'>
                            <div class='common_password_container'>
                                <div id='common_user_start_login_system_admin_password_confirm' contentEditable="true" class='common_input common_password' placeholder='<COMMON_TRANSLATION_PASSWORD_CONFIRM/>'></div>
                                <div id='common_user_start_login_system_admin_password_confirm_mask' class='common_input common_password_mask'></div>
                            </div>
                        </div>
                        <div id='common_user_start_login_system_admin_button' class='common_dialogue_button common_user_start_button common_icon' ></div>
                    </div>
                    <div id='common_user_start_signup_form' class='common_user_start_form'>
                        <div id='common_user_start_signup_username' contenteditable=true  class='common_input' placeholder='<COMMON_TRANSLATION_USERNAME/>'></div>
                        <div id='common_user_start_signup_email' contenteditable=true  class='common_input' placeholder='<COMMON_TRANSLATION_EMAIL/>'></div>
                        <div class='common_password_container'>
                            <div id='common_user_start_signup_password' contenteditable=true  class='common_input common_password' placeholder='<COMMON_TRANSLATION_PASSWORD/>'></div>
                            <div id='common_user_start_signup_password_mask' class='common_input common_password_mask'></div>
                        </div>
                        <div class='common_password_container'>
                            <div id='common_user_start_signup_password_confirm' contenteditable=true  class='common_input common_password' placeholder='<COMMON_TRANSLATION_PASSWORD_CONFIRM/>'></div>
                            <div id='common_user_start_signup_password_confirm_mask' class='common_input common_password_mask'></div>
                        </div>
                        <div id='common_user_start_signup_password_reminder' contenteditable=true  class='common_input' placeholder='<COMMON_TRANSLATION_PASSWORD_REMINDER/>'></div>
                        <div id='common_user_start_signup_button' class='common_dialogue_button common_user_start_button common_icon' ></div>
                    </div>
                    <div id='common_user_start_forgot_form' class='common_user_start_form'>
                        <div id='common_user_start_forgot_email' contenteditable=true class='common_input' placeholder='<COMMON_TRANSLATION_EMAIL/>'></div>
                        <div id='common_user_start_forgot_button' class='common_dialogue_button common_user_start_button common_icon' ></div>
                    </div>
                    <div id='common_user_start_close' class='common_dialogue_button common_icon' ></div>`;
/**
 * 
 * @param {*} props 
 * @returns {Promise.<void>}
 */
const method = async props => {
    //set z-index
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show1');
    //set modal
    props.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    /**
     * Renders provider buttons
     * @returns {Promise<string>}
     */
    const provider_buttons = async () =>{
        return new Promise((resolve, reject)=>{
            props.FFB('DB_API', `/identity_provider`, 'GET', 'APP_DATA', null)                              
            .then((/**@type{string}*/providers_json)=>{
                let html = '';
                for (const provider of JSON.parse(providers_json)){
                    html += `<div class='common_user_start_button common_link common_row' >
                                <div class='common_login_provider_id'>${provider.id}</div>
                                <div class='common_login_provider_name'>${provider.provider_name}</div>
                            </div>`;
                }
                if (html)
                    resolve(`<div id='common_identity_provider_login'>${html}</div>`);
                else
                    resolve('');
            })
            .catch ((/**@type{Error} */err)=>{
                reject(err);
            });
        })
    };
    const render_template = async () =>{
        return template
                //.replace('<COMMON_PROVIDER_BUTTONS/>', props.user_click?await provider_buttons():'')
                .replace('<COMMON_PROVIDER_BUTTONS/>', props.user_click?'':'')
                .replaceAll('<COMMON_TRANSLATION_USERNAME/>',props.translation_username)
                .replaceAll('<COMMON_TRANSLATION_PASSWORD/>',props.translation_password)
                .replaceAll('<COMMON_TRANSLATION_PASSWORD_CONFIRM/>',props.translation_password_confirm)
                .replaceAll('<COMMON_TRANSLATION_EMAIL/>',props.translation_email)
                .replaceAll('<COMMON_TRANSLATION_PASSWORD_REMINDER/>',props.translation_password_reminder);
    }

    switch (props.common_framework){
        case 2:{
            //Vue
            //Use tempmount div to be able to return pure HTML
            //props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
            //Vue.createApp(...
            //return props.common_document.querySelector('#tempmount').innerHTML;
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = await render_template();
            if (props.user_click)
                props.common_document.querySelector(`#${props.user_click}`).click();
        }
        case 3:{
            //React
            //Use tempmount div to be able to return pure HTML
            //props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
            //ReactDOM.createRoot(div... .render( App()
            //return props.common_document.querySelector('#tempmount').innerHTML;
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = await render_template();
            if (props.user_click)
                props.common_document.querySelector(`#${props.user_click}`).click();
        }
        case 1:
        default:{
            //Default Javascript
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = await render_template();
            if (props.user_click){
                props.common_document.querySelector(`#${props.user_click}`).click();
            }   
        }
    }
}
export default method;

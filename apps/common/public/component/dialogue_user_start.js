/**
 * @typedef {{id:number, provider_name:string}} provider_type
 */
/**
 * 
 * @param {{providers:provider_type[],
 *          admin_app:boolean,
 *          first_time: boolean,
 *          system_admin_only: boolean}} props 
 * @returns {string}
 */
const template = props =>`  <div id='common_user_start_logo'></div>
                            <div id='common_user_start_nav'>
                                ${props.system_admin_only?'':
                                    '<div id=\'common_user_start_login\'  class=\'common_icon\'></div>'
                                }
                                ${props.admin_app?
                                    '<div id=\'common_user_start_login_system_admin\'  class=\'common_icon\'></div>':
                                    `<div id='common_user_start_signup' class='common_icon' ></div>
                                    <div id='common_user_start_forgot' class='common_icon' ></div>`
                                }
                            </div>
                            ${props.system_admin_only?'':
                            `<div id='common_user_start_login_form' class='common_user_start_form'>
                                <div id='common_user_start_login_username' contentEditable='true' class='common_input' placeholder='<COMMON_TRANSLATION_USERNAME/>'></div>
                                <div class='common_password_container'>
                                    <div id='common_user_start_login_password' contentEditable='true' class='common_input common_password' placeholder='<COMMON_TRANSLATION_PASSWORD/>'></div>
                                    <div id='common_user_start_login_password_mask' class='common_input common_password_mask'></div>
                                </div>
                                <div id='common_user_start_login_button' class='common_dialogue_button common_user_start_button common_icon' ></div>
                                <div id='common_user_start_identity_provider_login' <SPINNER/>>
                                    ${props.providers.map((/**@type{*}*/row)=>(
                                        `<div class='common_user_start_button common_link common_row' >
                                            <div class='common_login_provider_id'>${row.id}</div>
                                            <div class='common_login_provider_name'>${row.provider_name}</div>
                                        </div>
                                        `)).join('')
                                    }
                                </div>
                            </div>`
                            }
                            ${props.admin_app?
                                `<div id='common_user_start_login_system_admin_form' class='common_user_start_form'>
                                    ${props.first_time?
                                        '<div id=\'common_user_start_login_system_admin_first_time\'></div>':''
                                    }
                                    <div id='common_user_start_login_system_admin_username' contentEditable='true' class='common_input' placeholder='<COMMON_TRANSLATION_USERNAME/>'></div>
                                    <div class='common_password_container'>
                                        <div id='common_user_start_login_system_admin_password' contentEditable='true' class='common_input common_password' placeholder='<COMMON_TRANSLATION_PASSWORD/>'></div>
                                        <div id='common_user_start_login_system_admin_password_mask' class='common_input common_password_mask'></div>
                                    </div>
                                    ${props.first_time?
                                        `<div id='common_user_start_login_system_admin_password_confirm_container'>
                                            <div class='common_password_container'>
                                                <div id='common_user_start_login_system_admin_password_confirm' contentEditable="true" class='common_input common_password' placeholder='<COMMON_TRANSLATION_PASSWORD_CONFIRM/>'></div>
                                                <div id='common_user_start_login_system_admin_password_confirm_mask' class='common_input common_password_mask'></div>
                                            </div>
                                        </div>`:''
                                    }
                                    <div id='common_user_start_login_system_admin_button' class='common_dialogue_button common_user_start_button common_icon' ></div>
                                </div>`:
                                `<div id='common_user_start_signup_form' class='common_user_start_form'>
                                    <div id='common_user_start_signup_username' contentEditable='true'  class='common_input' placeholder='<COMMON_TRANSLATION_USERNAME/>'></div>
                                    <div id='common_user_start_signup_email' contentEditable='true'  class='common_input' placeholder='<COMMON_TRANSLATION_EMAIL/>'></div>
                                    <div class='common_password_container'>
                                        <div id='common_user_start_signup_password' contentEditable='true'  class='common_input common_password' placeholder='<COMMON_TRANSLATION_PASSWORD/>'></div>
                                        <div id='common_user_start_signup_password_mask' class='common_input common_password_mask'></div>
                                    </div>
                                    <div class='common_password_container'>
                                        <div id='common_user_start_signup_password_confirm' contentEditable='true'  class='common_input common_password' placeholder='<COMMON_TRANSLATION_PASSWORD_CONFIRM/>'></div>
                                        <div id='common_user_start_signup_password_confirm_mask' class='common_input common_password_mask'></div>
                                    </div>
                                    <div id='common_user_start_signup_password_reminder' contentEditable='true'  class='common_input' placeholder='<COMMON_TRANSLATION_PASSWORD_REMINDER/>'></div>
                                    <div id='common_user_start_signup_button' class='common_dialogue_button common_user_start_button common_icon' ></div>
                                </div>
                                <div id='common_user_start_forgot_form' class='common_user_start_form'>
                                    <div id='common_user_start_forgot_email' contentEditable='true' class='common_input' placeholder='<COMMON_TRANSLATION_EMAIL/>'></div>
                                    <div id='common_user_start_forgot_button' class='common_dialogue_button common_user_start_button common_icon' ></div>
                                </div>`
                            }
                            <div id='common_user_start_close' class='common_dialogue_button common_icon' ></div>`;
/**
 * 
 * @param {{common_document:import('../../../types.js').AppDocument,
 *          common_mountdiv:string,
 *          user_click:string,
 *          app_id:number,
 *          common_app_id:number,
 *          system_admin_first_time:number,
 *          system_admin_only:number,
 *          translation_username:string,
 *          translation_password:string,
 *          translation_password_confirm:string,
 *          translation_password_reminder:string,
 *          translation_email:string,
 *          function_FFB:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show1');
    props.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    let spinner = 'class=\'css_spinner\'';

    /**
     * 
     * @param {{providers:provider_type[],
     *          admin_app:boolean,
     *          first_time: boolean,
     *          system_admin_only: boolean}} props_template
     * @returns 
     */
    const render_template = props_template =>{
        return template(props_template)
                .replace('<SPINNER/>', spinner)
                .replaceAll('<COMMON_TRANSLATION_USERNAME/>',props.translation_username)
                .replaceAll('<COMMON_TRANSLATION_PASSWORD/>',props.translation_password)
                .replaceAll('<COMMON_TRANSLATION_PASSWORD_CONFIRM/>',props.translation_password_confirm)
                .replaceAll('<COMMON_TRANSLATION_EMAIL/>',props.translation_email)
                .replaceAll('<COMMON_TRANSLATION_PASSWORD_REMINDER/>',props.translation_password_reminder);
    };
    const post_component = async () =>{
        props.common_document.querySelector(`#${props.user_click}`).click();
        //fetch providers if not admin app
        const providers = props.app_id == props.common_app_id?[]:
                            await props.function_FFB('/server-db/identity_provider', null, 'GET', 'APP_DATA', null)
                                        .then((/**@type{string}*/result)=>JSON.parse(result).rows)
                                        .catch((/**@type{Error}*/error)=>{
                                                                            props.common_document.querySelector('#common_user_start_identity_provider_login').classList.remove('css_spinner');
                                                                            throw error;});
        spinner = '';
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = 
            render_template({
                                providers:providers,
                                admin_app:props.app_id == props.common_app_id,
                                first_time: props.system_admin_first_time == 1,
                                system_admin_only: props.system_admin_only == 1
                            });
            props.common_document.querySelector(`#${props.user_click}`).click();
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template({
                        providers:[], 
                        admin_app:props.app_id == props.common_app_id,
                        first_time: props.system_admin_first_time == 1,
                        system_admin_only: props.system_admin_only == 1})
    };
};
export default component;

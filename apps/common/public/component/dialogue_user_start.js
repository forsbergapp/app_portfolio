/**
 * @module apps/common/component/dialogue_user_start
 */

/**
 * 
 * @param {{spinner:string,
 *          providers:import('../../../common_types.js').CommonProvider[],
 *          admin_app:boolean,
 *          first_time: boolean,
 *          system_admin_only: boolean}} props 
 * @returns {string}
 */
const template = props =>`  <div id='common_user_start_logo' class='common_image common_image_logo_start'></div>
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
                                <div id='common_user_start_login_username' contentEditable='true' class='common_input common_placeholder' ></div>
                                <div class='common_password_container'>
                                    <div id='common_user_start_login_password' contentEditable='true' class='common_input common_password common_placeholder'></div>
                                    <div id='common_user_start_login_password_mask' class='common_input common_password_mask'></div>
                                </div>
                                <div id='common_user_start_login_button' class='common_dialogue_button common_user_start_button common_icon' ></div>
                                <div id='common_user_start_identity_provider_login' class='${props.spinner}'>
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
                                        `<div id='common_user_start_login_system_admin_first_time'>
                                        </div>`:''
                                    }
                                    <div id='common_user_start_login_system_admin_username' contentEditable='true' class='common_input common_placeholder' ></div>
                                    <div class='common_password_container'>
                                        <div id='common_user_start_login_system_admin_password' contentEditable='true' class='common_input common_password common_placeholder' ></div>
                                        <div id='common_user_start_login_system_admin_password_mask' class='common_input common_password_mask'></div>
                                    </div>
                                    ${props.first_time?
                                        `<div id='common_user_start_login_system_admin_password_confirm_container'>
                                            <div class='common_password_container'>
                                                <div id='common_user_start_login_system_admin_password_confirm' contentEditable="true" class='common_input common_password common_placeholder' ></div>
                                                <div id='common_user_start_login_system_admin_password_confirm_mask' class='common_input common_password_mask'></div>
                                            </div>
                                        </div>`:''
                                    }
                                    <div id='common_user_start_login_system_admin_button' class='common_dialogue_button common_user_start_button common_icon' ></div>
                                </div>`:
                                `<div id='common_user_start_signup_form' class='common_user_start_form'>
                                    <div id='common_user_start_signup_username' contentEditable='true'  class='common_input common_placeholder'></div>
                                    <div id='common_user_start_signup_email' contentEditable='true'  class='common_input common_placeholder'></div>
                                    <div class='common_password_container'>
                                        <div id='common_user_start_signup_password' contentEditable='true'  class='common_input common_password common_placeholder'></div>
                                        <div id='common_user_start_signup_password_mask' class='common_input common_password_mask'></div>
                                    </div>
                                    <div class='common_password_container'>
                                        <div id='common_user_start_signup_password_confirm' contentEditable='true'  class='common_input common_password common_placeholder'></div>
                                        <div id='common_user_start_signup_password_confirm_mask' class='common_input common_password_mask'></div>
                                    </div>
                                    <div id='common_user_start_signup_password_reminder' contentEditable='true'  class='common_input common_placeholder'></div>
                                    <div id='common_user_start_signup_button' class='common_dialogue_button common_user_start_button common_icon' ></div>
                                </div>
                                <div id='common_user_start_forgot_form' class='common_user_start_form'>
                                    <div id='common_user_start_forgot_email' contentEditable='true' class='common_input common_placeholder'></div>
                                    <div id='common_user_start_forgot_button' class='common_dialogue_button common_user_start_button common_icon' ></div>
                                </div>`
                            }
                            <div id='common_user_start_close' class='common_dialogue_button common_icon' ></div>`;
/**
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      user_click:string,
 *                      app_id:number,
 *                      common_app_id:number,
 *                      system_admin_first_time:number,
 *                      system_admin_only:number},
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB']
 *                      },
 *          lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycleReturn, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).classList.add('common_dialogue_show1');
    props.methods.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');


    const onMounted = async () =>{
        props.methods.common_document.querySelector(`#${props.data.user_click}`).click();
        //fetch providers if not admin app
        const providers = props.data.app_id == props.data.common_app_id?[]:
                            await props.methods.FFB('/server-db/identity_provider', null, 'GET', 'APP_DATA', null)
                                        .then((/**@type{string}*/result)=>JSON.parse(result).rows)
                                        .catch((/**@type{Error}*/error)=>{
                                                                            props.methods.common_document.querySelector('#common_user_start_identity_provider_login').classList.remove('css_spinner');
                                                                            throw error;});
        props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = 
            template({  spinner:'',
                        providers:providers,
                        admin_app:props.data.app_id == props.data.common_app_id,
                        first_time: props.data.system_admin_first_time == 1,
                        system_admin_only: props.data.system_admin_only == 1
                    });
            props.methods.common_document.querySelector(`#${props.data.user_click}`).click();
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({
                            spinner:'css_spinner',
                            providers:[], 
                            admin_app:props.data.app_id == props.data.common_app_id,
                            first_time: props.data.system_admin_first_time == 1,
                            system_admin_only: props.data.system_admin_only == 1})
    };
};
export default component;

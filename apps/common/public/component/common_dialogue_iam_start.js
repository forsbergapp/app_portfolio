/**
 * @module apps/common/component/common_dialogue_iam_start
 */

/**
 * 
 * @param {{providers:import('../../../common_types.js').CommonProvider[],
 *          admin_app:boolean,
 *          type:'LOGIN'|'SIGNUP'|'FORGOT',
 *          first_time: boolean}} props 
 * @returns {string}
 */
const template = props =>`  <div id='common_dialogue_iam_start_logo' class='common_image common_image_logo_start'></div>
                            ${props.admin_app?'':
                               `<div id='common_dialogue_iam_start_nav'>
                                    <div id='common_dialogue_iam_start_login'  class='common_icon ${props.type=='LOGIN'?'common_dialogue_iam_start_selected':''}'></div>
                                    <div id='common_dialogue_iam_start_signup' class='common_icon ${props.type=='SIGNUP'?'common_dialogue_iam_start_selected':''}'></div>
                                    <div id='common_dialogue_iam_start_forgot' class='common_icon ${props.type=='FORGOT'?'common_dialogue_iam_start_selected':''}'></div>
                                </div>`
                            }
                            ${props.admin_app?
                                `<div id='common_dialogue_iam_start_login_admin_form' class='common_dialogue_iam_start_form'>
                                    ${props.first_time?
                                        `<div id='common_dialogue_iam_start_login_admin_first_time'>
                                        </div>`:''
                                    }
                                    <div id='common_dialogue_iam_start_login_admin_username' contentEditable='true' class='common_input common_placeholder' ></div>
                                    <div class='common_password_container'>
                                        <div id='common_dialogue_iam_start_login_admin_password' contentEditable='true' class='common_input common_password common_placeholder' ></div>
                                        <div id='common_dialogue_iam_start_login_admin_password_mask' class='common_input common_password_mask'></div>
                                    </div>
                                    ${props.first_time?
                                        `<div id='common_dialogue_iam_start_login_admin_password_confirm_container'>
                                            <div class='common_password_container'>
                                                <div id='common_dialogue_iam_start_login_admin_password_confirm' contentEditable="true" class='common_input common_password common_placeholder' ></div>
                                                <div id='common_dialogue_iam_start_login_admin_password_confirm_mask' class='common_input common_password_mask'></div>
                                            </div>
                                        </div>`:''
                                    }
                                    <div id='common_dialogue_iam_start_login_admin_button' class='common_dialogue_button common_dialogue_iam_start_button common_icon' ></div>
                                </div>`:
                                `${props.type=='LOGIN'? 
                                    `<div id='common_dialogue_iam_start_login_form' class='common_dialogue_iam_start_form'>
                                        <div id='common_dialogue_iam_start_login_username' contentEditable='true' class='common_input common_placeholder' ></div>
                                        <div class='common_password_container'>
                                            <div id='common_dialogue_iam_start_login_password' contentEditable='true' class='common_input common_password common_placeholder'></div>
                                            <div id='common_dialogue_iam_start_login_password_mask' class='common_input common_password_mask'></div>
                                        </div>
                                        <div id='common_dialogue_iam_start_login_button' class='common_dialogue_button common_dialogue_iam_start_button common_icon' ></div>
                                        <div id='common_dialogue_iam_start_identity_provider_login'>
                                            ${props.providers.map((/**@type{*}*/row)=>(
                                                `<div class='common_dialogue_iam_start_button common_link common_row' >
                                                    <div class='common_login_provider_id'>${row.id}</div>
                                                    <div class='common_login_provider_name'>${row.provider_name}</div>
                                                </div>
                                                `)).join('')
                                            }
                                        </div>
                                    </div>`:''
                                }
                                ${props.type=='SIGNUP'? 
                                    `<div id='common_dialogue_iam_start_signup_form' class='common_dialogue_iam_start_form'>
                                        <div id='common_dialogue_iam_start_signup_username' contentEditable='true'  class='common_input common_placeholder'></div>
                                        <div id='common_dialogue_iam_start_signup_email' contentEditable='true'  class='common_input common_placeholder'></div>
                                        <div class='common_password_container'>
                                            <div id='common_dialogue_iam_start_signup_password' contentEditable='true'  class='common_input common_password common_placeholder'></div>
                                            <div id='common_dialogue_iam_start_signup_password_mask' class='common_input common_password_mask'></div>
                                        </div>
                                        <div class='common_password_container'>
                                            <div id='common_dialogue_iam_start_signup_password_confirm' contentEditable='true'  class='common_input common_password common_placeholder'></div>
                                            <div id='common_dialogue_iam_start_signup_password_confirm_mask' class='common_input common_password_mask'></div>
                                        </div>
                                        <div id='common_dialogue_iam_start_signup_password_reminder' contentEditable='true'  class='common_input common_placeholder'></div>
                                        <div id='common_dialogue_iam_start_signup_button' class='common_dialogue_button common_dialogue_iam_start_button common_icon' ></div>
                                    </div>`:''
                                }
                                ${props.type=='FORGOT'? 
                                    `<div id='common_dialogue_iam_start_forgot_form' class='common_dialogue_iam_start_form'>
                                        <div id='common_dialogue_iam_start_forgot_email' contentEditable='true' class='common_input common_placeholder'></div>
                                        <div id='common_dialogue_iam_start_forgot_button' class='common_dialogue_button common_dialogue_iam_start_button common_icon' ></div>
                                    </div>`:''
                                }
                                <div id='common_dialogue_iam_start_close' class='common_dialogue_button common_icon' ></div>`
                            }`;
/**
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      type:'LOGIN'|'SIGNUP'|'FORGOT',
 *                      app_id:number,
 *                      common_app_id:number,
 *                      admin_first_time:number},
 *          methods:    {
 *                      COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
 *                      commonFFB:import('../../../common_types.js').CommonModuleCommon['commonFFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show1');
    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    //fetch providers if not admin app
    const providers = props.data.app_id == props.data.common_app_id?[]:
                        await props.methods.commonFFB({path:'/server-db/identity_provider', method:'GET', authorization_type:'APP_DATA'})
                                    .then((/**@type{string}*/result)=>JSON.parse(result).rows);

    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({
                            providers:providers, 
                            admin_app:props.data.app_id == props.data.common_app_id,
                            type:props.data.type,
                            first_time: props.data.admin_first_time == 1})
    };
};
export default component;
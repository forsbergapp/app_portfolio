/**
 * Displays IAM start
 * @module apps/common/component/common_dialogue_iam_start
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{admin_app:boolean,
 *          type:'LOGIN'|'SIGNUP',
 *          first_time: boolean}} props 
 * @returns {string}
 */
const template = props =>`  ${props.admin_app?'':
                               `<div id='common_dialogue_iam_start_nav'>
                                    <div id='common_dialogue_iam_start_login'  class='common_icon ${props.type=='LOGIN'?'common_dialogue_iam_start_selected':''}'></div>
                                    <div id='common_dialogue_iam_start_signup' class='common_icon ${props.type=='SIGNUP'?'common_dialogue_iam_start_selected':''}'></div>
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
                                    </div>`:''
                                }
                                ${props.type=='SIGNUP'? 
                                    `<div id='common_dialogue_iam_start_signup_form' class='common_dialogue_iam_start_form'>
                                        <div id='common_dialogue_iam_start_signup_username' contentEditable='true'  class='common_input common_placeholder'></div>
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
                                <div id='common_dialogue_iam_start_close' class='common_dialogue_button common_icon' ></div>`
                            }`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      type:'LOGIN'|'SIGNUP',
 *                      app_id:number,
 *                      admin_app_id:number,
 *                      admin_first_time:number},
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:   null,
 *                      methods:null,
 *                      events:common['commonComponentEvents'],
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show1');
    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    /**
     * @name commonUserSignup
     * @description User signup
     * @function
     * @returns {void}
     */
    const commonUserSignup = () => {
        if (props.methods.COMMON.commonMiscInputControl(props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start'),
                                {
                                username: props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_username'),
                                password: props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password'),
                                password_confirm: props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password_confirm'),
                                password_confirm_reminder: props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password_reminder')
                                })==true){
            const json_data = { username:           props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_username').textContent,
                                password:           props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password').textContent,
                                password_reminder:  props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password_reminder').textContent,
                                active:             0
                                };
               
           props.methods.COMMON.commonFFB({path:'/server-iam/iamuser', method:'POST', authorization_type:'IAM_SIGNUP', body:json_data, spinner_id:'common_dialogue_iam_start_signup_button'})
            .then(result=>{
                props.methods.COMMON.commonGlobalSet('iam_user_app_id', JSON.parse(result).iam_user_app_id);
                props.methods.COMMON.commonGlobalSet('iam_user_id',     JSON.parse(result).iam_user_id);
                props.methods.COMMON.commonGlobalSet('token_at',        JSON.parse(result).token_at);
                props.methods.COMMON.commonGlobalSet('token_exp',       JSON.parse(result).exp);
                props.methods.COMMON.commonGlobalSet('token_iat',       JSON.parse(result).iat);
                props.methods.COMMON.commonMessageShow('INFO', null, null,JSON.parse(result).otp_key);
                
                props.methods.COMMON.commonDialogueShow('VERIFY', 'SIGNUP');
            });
        }
    };
        
    /**
     * @name events
     * @descption Events
     * @function
     * @param {common['commonEventType']} event_type
     * @param {common['CommonAppEvent']} event
     * @returns {Promise.<void>}
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.COMMON.commonMiscElementId(event.target);
        switch (event_type){
            case 'click':{
                switch (true){
                    case event_target_id=='common_dialogue_iam_start_login':
                    case event_target_id=='common_dialogue_iam_start_signup':{
                        props.methods.COMMON.commonDialogueShow(event_target_id.substring('common_dialogue_iam_start_'.length).toUpperCase());
                        break;
                    }
                    case event_target_id=='common_dialogue_iam_start_close':{
                        props.methods.COMMON.commonComponentRemove('common_dialogue_iam_start', true);
                        break;
                    }
                    case event_target_id=='common_dialogue_iam_start_signup_button':{
                        commonUserSignup();
                        break;
                    }    
                }
                break;
            }
        }
    };
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        events:     events,
        template:   template({
                            admin_app:props.data.app_id == props.data.admin_app_id,
                            type:props.data.type,
                            first_time: props.data.admin_first_time == 1})
    };
};
export default component;

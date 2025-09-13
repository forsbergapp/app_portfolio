/**
 * Displays IAM start
 * @module apps/common/component/common_dialogue_iam_start
 */
/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle,
 *          commonComponentEvents, commonEventType, CommonAppEvent}  from '../../../common_types.js'
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
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonMiscElementId:CommonModuleCommon['commonMiscElementId'],
 *                      commonDialogueShow:CommonModuleCommon['commonDialogueShow'],
 *                      commonComponentRemove:CommonModuleCommon['commonComponentRemove'],
 *                      commonUserSignup:CommonModuleCommon['commonUserSignup'],
 *                      commonFFB:CommonModuleCommon['commonFFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      events:commonComponentEvents,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show1');
    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    
    /**
     * @name events
     * @descption Events for map
     * @function
     * @param {commonEventType} event_type
     * @param {CommonAppEvent} event
     * @returns {Promise.<void>}
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.commonMiscElementId(event.target);
        switch (event_type){
            case 'click':{
                switch (true){
                    case event_target_id=='common_dialogue_iam_start_login':
                    case event_target_id=='common_dialogue_iam_start_signup':{
                        props.methods.commonDialogueShow(event_target_id.substring('common_dialogue_iam_start_'.length).toUpperCase());
                        break;
                    }
                    case event_target_id=='common_dialogue_iam_start_close':{
                        props.methods.commonComponentRemove('common_dialogue_iam_start', true);
                        break;
                    }
                    case event_target_id=='common_dialogue_iam_start_signup_button':{
                        props.methods.commonUserSignup();
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

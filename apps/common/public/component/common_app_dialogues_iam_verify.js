/**
 * Displays IAM verify
 * @module apps/common/component/common_app_dialogues_iam_verify
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{icons:{
 *                 verification_code:string,
 *                 cancel:string}}} props
 * @returns {string}
 */
const template = props => `
                            <div id='common_app_dialogues_iam_verify_verification_code_icon' class='common_icon_title'>${props.icons.verification_code}</div>
                            <div id='common_app_dialogues_iam_verify_token_countdown'>
                                    <div id='common_app_dialogues_iam_verify_token_countdown_time'></div>
                            </div>
                            <div id='common_app_dialogues_iam_verify_verification_container' class='common_app_dialogues_iam_verify_input_verification_char'>
                                <div id='common_app_dialogues_iam_verify_verification_char1' contentEditable='true' class='common_input'></div>
                                <div id='common_app_dialogues_iam_verify_verification_char2' contentEditable='true' class='common_input'></div>
                                <div id='common_app_dialogues_iam_verify_verification_char3' contentEditable='true' class='common_input'></div>
                                <div id='common_app_dialogues_iam_verify_verification_char4' contentEditable='true' class='common_input'></div>
                                <div id='common_app_dialogues_iam_verify_verification_char5' contentEditable='true' class='common_input'></div>
                                <div id='common_app_dialogues_iam_verify_verification_char6' contentEditable='true' class='common_input'></div>
                            </div>
                            <div id='common_app_dialogues_iam_verify_cancel' class='common_app_dialogues_button common_link common_icon_button'>${props.icons.cancel}</div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      common_app_id:number,
 *                      user_verification_type:string},
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon'],
 *                      }}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:   null,
 *                      methods:{commonUserVerifyCheckInput:function},
 *                      events:events,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_app_dialogues_show2');

    /**
     * @name commonUserAuthenticateCode
     * @description Activate user
     * @function
     * @param {string} verification_code
     * @param {string}verification_type
     * @returns {Promise.<boolean>}
     */
    const commonUserAuthenticateCode = async (verification_code, verification_type) => {
        return await props.methods.COMMON.commonFFB({ path:`/server-db/iamuser-activate/${props.methods.COMMON.commonGlobalGet('iam_user_id') ?? ''}`, 
                    method:'PUT', 
                    authorization_type:'APP_ACCESS_VERIFICATION', 
                    body:{   verification_code:  verification_code,
                            /**
                            * Verification type
                            * 1 LOGIN
                            * 2 SIGNUP      
                            */
                            verification_type:  verification_type=='LOGIN'?1:verification_type=='SIGNUP'?2:3}, 
                    spinner_id:'common_app_dialogues_iam_verify_cancel'})
        .then(result=>{
                if (JSON.parse(result).activated == 1){
                    props.methods.COMMON.commonUserSessionClear();
                    return true;
                }
                else
                    return false;
        })
        .catch(()=>{
            return false;
        });
    };
    /**
     * @name commonUserVerifyCheckInput
     * @description User verify check input, used by user events:
     *              TYPE                        COMMENT                                                         BFF endpoint to use when activating
     *              1 LOGIN                     after login, no data returned if active=0                       APP_ACCESS_VERIFICATION
     *              2 SIGNUP                    not logged in                                                   APP_ACCESS_VERIFICATION
     *              3 UPDATE USER               logged in                                                       APP_ACCESS
     *              User will be required to login again after activation
     * @function
     * @param {HTMLElement} item 
     * @param {string} nextField
     * @returns {Promise.<void>}
     */
    const commonUserVerifyCheckInput = async (item, nextField) => {
        //only accept 0-9
        if (item.textContent && item.textContent.length==1 && ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(item.textContent) > -1)
            if (nextField == '' || (props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char1').textContent != '' &&
                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char2').textContent != '' &&
                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char3').textContent != '' &&
                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char4').textContent != '' &&
                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char5').textContent != '' &&
                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char6').textContent != '')) {
                //last field, validate entered code
                const verification_code =   props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char1').textContent +
                                            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char2').textContent +
                                            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char3').textContent +
                                            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char4').textContent +
                                            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char5').textContent +
                                            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char6').textContent;
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char1').classList.remove('common_input_error');
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char2').classList.remove('common_input_error');
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char3').classList.remove('common_input_error');
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char4').classList.remove('common_input_error');
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char5').classList.remove('common_input_error');
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char6').classList.remove('common_input_error');

                if ((props.data.user_verification_type== '3' &&       
                    
                    await props.methods.COMMON.commonGlobalGet('component')[props.methods.COMMON.commonGlobalGet('app_common_app_id') + '_' + 'common_app_dialogues_user_menu_iam_user']?.methods?.commonUserUpdate(verification_code)) ||
                    await commonUserAuthenticateCode(verification_code, props.data.user_verification_type)){
                        props.methods.COMMON.commonComponentRemove('common_app_dialogues_iam_verify');
                        props.methods.COMMON.commonDialogueShow('LOGIN');
                    }
                else{
                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char1').classList.add('common_input_error');
                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char2').classList.add('common_input_error');
                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char3').classList.add('common_input_error');
                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char4').classList.add('common_input_error');
                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char5').classList.add('common_input_error');
                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_verification_char6').classList.add('common_input_error');
                    //code not valid
                    props.methods.COMMON.commonMessageShow('INFO', null, 'message_text',props.methods.COMMON.commonMesssageNotAuthorized());
                }                
            } 
            else{
                //not last, next!
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#' + nextField).focus();
            }
        else{
            //remove anything else than 0-9
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#' + item.id).textContent = '';
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
                    case event_target_id=='common_app_dialogues_iam_verify_cancel':{
                        if (props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_btn_user_update')==null)
                            props.methods.COMMON.commonUserSessionClear();
                        props.methods.COMMON.commonComponentRemove('common_app_dialogues_iam_verify');
                        break;
                    }
                }
                break;
            }
            case 'keyup':{
                switch (true){
                    case event_target_id=='common_app_dialogues_iam_verify_verification_char1':
                    case event_target_id=='common_app_dialogues_iam_verify_verification_char2':
                    case event_target_id=='common_app_dialogues_iam_verify_verification_char3':
                    case event_target_id=='common_app_dialogues_iam_verify_verification_char4':
                    case event_target_id=='common_app_dialogues_iam_verify_verification_char5':{
                        
                        props.methods.COMMON.commonGlobalGet('component')[props.methods.COMMON.commonGlobalGet('app_common_app_id') + '_' + 'common_app_dialogues_iam_verify']?.methods?.commonUserVerifyCheckInput( props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event.target.id}`), 
                                                        'common_app_dialogues_iam_verify_verification_char' + (Number(event.target.id.substring(event.target.id.length-1))+1));
                        break;
                    }
                    case event_target_id=='common_app_dialogues_iam_verify_verification_char6':{
                        props.methods.COMMON.commonGlobalGet('component')[props.methods.COMMON.commonGlobalGet('app_common_app_id') + '_' + 'common_app_dialogues_iam_verify']?.methods?.commonUserVerifyCheckInput(props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event.target.id}`), '');
                        break;
                    }
                }
            }
        }
    };

    const onMounted = () =>{
        props.methods.COMMON.commonUserSessionCountdown(props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_verify_token_countdown_time'), null);
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    {commonUserVerifyCheckInput:commonUserVerifyCheckInput},
        events:     events,
        template:   template({icons:{
                                verification_code:props.methods.COMMON.commonGlobalGet('ICONS')['verification_code'],
                                cancel:props.methods.COMMON.commonGlobalGet('ICONS')['cancel']}})
    };
};
export default component;
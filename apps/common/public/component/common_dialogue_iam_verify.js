/**
 * Displays IAM verify
 * @module apps/common/component/common_dialogue_iam_verify
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () => `
                            <div id='common_dialogue_iam_verify_verification_code_icon' class='common_icon'></div>
                            <div id='common_dialogue_iam_verify_verification_container'>
                                <div class='common_dialogue_iam_verify_verification_wrap'><div id='common_dialogue_iam_verify_verification_char1' contentEditable='true' class='common_input common_dialogue_iam_verify_input_verification_char'></div></div>
                                <div class='common_dialogue_iam_verify_verification_wrap'><div id='common_dialogue_iam_verify_verification_char2' contentEditable='true' class='common_input common_dialogue_iam_verify_input_verification_char'></div></div>
                                <div class='common_dialogue_iam_verify_verification_wrap'><div id='common_dialogue_iam_verify_verification_char3' contentEditable='true' class='common_input common_dialogue_iam_verify_input_verification_char'></div></div>
                                <div class='common_dialogue_iam_verify_verification_wrap'><div id='common_dialogue_iam_verify_verification_char4' contentEditable='true' class='common_input common_dialogue_iam_verify_input_verification_char'></div></div>
                                <div class='common_dialogue_iam_verify_verification_wrap'><div id='common_dialogue_iam_verify_verification_char5' contentEditable='true' class='common_input common_dialogue_iam_verify_input_verification_char'></div></div>
                                <div class='common_dialogue_iam_verify_verification_wrap'><div id='common_dialogue_iam_verify_verification_char6' contentEditable='true' class='common_input common_dialogue_iam_verify_input_verification_char'></div></div>                
                            </div>
                            <div id='common_dialogue_iam_verify_cancel' class='common_dialogue_button common_icon'></div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      common_app_id:number,
 *                      user_account_id:number,
 *                      user_verification_type:string,
 *                      title:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonFFB:CommonModuleCommon['commonFFB'],
 *                      commonMessageShow:CommonModuleCommon['commonMessageShow'],
 *                      commonComponentRemove:CommonModuleCommon['commonComponentRemove'],
 *                      commonComponentRender:CommonModuleCommon['commonComponentRender'],
 *                      commonDialogueShow:CommonModuleCommon['commonDialogueShow'],
 *                      commonUserLogout:CommonModuleCommon['commonUserLogout'],
 *                      commonMesssageNotAuthorized:CommonModuleCommon['commonMesssageNotAuthorized'],
 *                      commonUserActive:CommonModuleCommon['commonUserActive'],
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:{commonUserVerifyCheckInput:function},
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show2');
    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    /**
     * @name commonUserVerifyCheckInput
     * @description User verify check input, used by user events:
     *              TYPE                        COMMENT                                                         BFF endpoint to use when activating
     *              1 LOGIN                     after login, no data returned if active=0                       APP_ACCESS_VERIFICATION
     *              2 SIGNUP                    not logged in                                                   APP_ACCESS_VERIFICATION
     *              3 FORGOT / PASSWORD RESET   not logged in                                                   APP_ACCESS_VERIFICATION
     * 
     *              User will be required to login again after activation
     * @function
     * @param {HTMLElement} item 
     * @param {string} nextField
     * @returns {Promise.<void>}
     */
    const commonUserVerifyCheckInput = async (item, nextField) => {
        //only accept 0-9
        if (item.textContent && item.textContent.length==1 && ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(item.textContent) > -1)
            if (nextField == '' || (props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char1').textContent != '' &&
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char2').textContent != '' &&
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char3').textContent != '' &&
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char4').textContent != '' &&
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char5').textContent != '' &&
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char6').textContent != '')) {
                //last field, validate entered code
                const verification_code =   props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char1').textContent +
                                            props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char2').textContent +
                                            props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char3').textContent +
                                            props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char4').textContent +
                                            props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char5').textContent +
                                            props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char6').textContent;
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char1').classList.remove('common_input_error');
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char2').classList.remove('common_input_error');
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char3').classList.remove('common_input_error');
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char4').classList.remove('common_input_error');
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char5').classList.remove('common_input_error');
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char6').classList.remove('common_input_error');

                if (await props.methods.commonUserActive(verification_code, props.data.user_verification_type)){
                    if (props.data.user_verification_type=='FORGOT'){
                        //show dialogue new password
                            props.methods.commonComponentRender({
                                mountDiv:   'common_dialogue_iam_password_new',
                                data:       null,
                                methods:    null,
                                path:'/common/component/common_dialogue_iam_password_new.js'});
                        props.methods.commonComponentRemove('common_dialogue_iam_verify', true);
                    }
                    else{
                        if (props.data.user_verification_type=='LOGIN')
                            props.methods.commonUserLogout();
                        else{
                            props.methods.commonComponentRemove('common_dialogue_iam_verify');
                            props.methods.commonComponentRemove('common_dialogue_iam_edit', true);
                        }
                        props.methods.commonDialogueShow('LOGIN');
                    }
                }
                else{
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char1').classList.add('common_input_error');
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char2').classList.add('common_input_error');
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char3').classList.add('common_input_error');
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char4').classList.add('common_input_error');
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char5').classList.add('common_input_error');
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char6').classList.add('common_input_error');
                    //code not valid
                    props.methods.commonMessageShow('INFO', null, null, 'message_text',props.methods.commonMesssageNotAuthorized(), props.data.common_app_id);
                }                
            } 
            else{
                //not last, next!
                props.methods.COMMON_DOCUMENT.querySelector('#' + nextField).focus();
            }
        else{
            //remove anything else than 0-9
            props.methods.COMMON_DOCUMENT.querySelector('#' + item.id).textContent = '';
        }
   };
    return {
        lifecycle:  null,
        data:       null,
        methods:    {commonUserVerifyCheckInput:commonUserVerifyCheckInput},
        template:   template()
    };
};
export default component;
/**
 * Displays IAM verify
 * @module apps/common/component/common_dialogue_iam_verify
 */

/**
 * @import {COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @param {{title: string,
 *          verification_type:string,
 *          username:string,
 *          password:string}} props
 * @returns {string}
 */
const template = props => `
                            <div id='common_dialogue_iam_verify_email_icon' class='common_icon'></div>
                            <div id='common_dialogue_iam_verify_email'>${props.title}</div>
                            <div id='common_dialogue_iam_verify_data_verification_type'>${props.verification_type}</div>
                            <div id='common_dialogue_iam_verify_data_username'>${props.username}</div>
                            <div id='common_dialogue_iam_verify_data_password'>${props.password}</div>
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
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      user_verification_type:string,
 *                      username_login:string,
 *                      password_login:string,
 *                      username_signup:string,
 *                      password_signup:string,
 *                      title:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      function_data_function:function
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show2');
    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    let verification_type ='';
    let username = '';
    let password = '';
    switch (props.data.user_verification_type){
        case 'LOGIN':{
            verification_type = '1';
            username = props.data.username_login;
            password = props.data.password_login;
            break;
        }
        case 'SIGNUP':{
            verification_type = '2';
            username = props.data.username_signup;
            password = props.data.password_signup;
            break;
        }
        case 'FORGOT':{
            verification_type = '3';
            break;
        }
        case 'NEW_EMAIL':{
            verification_type = '4';
            break;
        }
    }
    
    const onMounted = async () =>{
        props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv} #common_dialogue_iam_verify_cancel`)['data-function'] = props.methods.function_data_function;
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({
                            title: props.data.title,
                            verification_type:verification_type,
                            username:username,
                            password:password})
    };
};
export default component;
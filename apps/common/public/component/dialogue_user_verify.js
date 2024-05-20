/**@type{import('../../../types.js').AppDocument}} */
const AppDocument = document;
const template =`
                <div id='common_user_verify_email_icon' class='common_icon'></div>
                <div id='common_user_verify_email'><TITLE/></div>
                <div id='common_user_verify_data_verification_type'><VERIFICATION_TYPE/></div>
                <div id='common_user_verify_data_username'><USERNAME/></div>
                <div id='common_user_verify_data_password'><PASSWORD/></div>
                <div id='common_user_verify_verification_container'>
                    <div class='common_user_verify_verification_wrap'><div id='common_user_verify_verification_char1' contentEditable='true' class='common_input common_user_verify_input_verification_char'></div></div>
                    <div class='common_user_verify_verification_wrap'><div id='common_user_verify_verification_char2' contentEditable='true' class='common_input common_user_verify_input_verification_char'></div></div>
                    <div class='common_user_verify_verification_wrap'><div id='common_user_verify_verification_char3' contentEditable='true' class='common_input common_user_verify_input_verification_char'></div></div>
                    <div class='common_user_verify_verification_wrap'><div id='common_user_verify_verification_char4' contentEditable='true' class='common_input common_user_verify_input_verification_char'></div></div>
                    <div class='common_user_verify_verification_wrap'><div id='common_user_verify_verification_char5' contentEditable='true' class='common_input common_user_verify_input_verification_char'></div></div>
                    <div class='common_user_verify_verification_wrap'><div id='common_user_verify_verification_char6' contentEditable='true' class='common_input common_user_verify_input_verification_char'></div></div>                
                </div>
                <div id='common_user_verify_cancel' class='common_dialogue_button common_icon'></div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          user_verification_type:string,
 *          username_login:string,
 *          password_login:string,
 *          username_signup:string,
 *          password_signup:string,
 *          title:string,
 *          function_data_function:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show2');
    props.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    let verification_type ='';
    let username = '';
    let password = '';
    switch (props.user_verification_type){
        case 'LOGIN':{
            verification_type = '1';
            username = props.username_login;
            password = props.password_login;
            break;
        }
        case 'SIGNUP':{
            verification_type = '2';
            username = props.username_signup;
            password = props.password_signup;
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
    const render_template = () =>{
        return template
                .replace('<TITLE/>',props.title)
                .replace('<VERIFICATION_TYPE/>',verification_type)
                .replace('<USERNAME/>',username)
                .replace('<PASSWORD/>',password);
    }
    const post_component = async () =>{
        props.common_document.querySelector(`#${props.common_mountdiv} #common_user_verify_cancel`)['data-function'] = props.function_data_function;
    }
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template()
    };
}
export default component;
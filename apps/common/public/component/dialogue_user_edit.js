const template =`   <div id='common_user_edit_common'>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_avatar'>
                                <div id='common_user_edit_avatar'>
                                    <div id='common_user_edit_btn_avatar_img' class='common_icon'></div>
                                    <input id='common_user_edit_input_avatar_img' type='file'>
                                </div>
                                <img id='common_user_edit_avatar_img' alt='' src=''>
                            </div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_private' class='common_icon'></div>
                            <div id='common_user_edit_checkbox_profile_private' class='common_switch'></div>
                        </div>
                    </div>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_input_username_icon' class='common_icon'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_input_username' class='common_input' contenteditable=true placeholder='<COMMON_TRANSLATION_USERNAME/>'></div>
                        </div>
                    </div>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_input_bio_icon' class='common_icon'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_input_bio' class='common_input' contenteditable=true placeholder='<COMMON_TRANSLATION_BIO/>'></div>
                        </div>
                    </div>
                    </div>
                    <div id='common_user_edit_local'>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_input_email_icon' class='common_icon'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_input_email'></div>
                        </div>
                    </div>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_input_new_email_icon' class='common_icon'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_input_new_email' class='common_input' contenteditable=true placeholder='<COMMON_TRANSLATION_NEW_EMAIL/>'></div>
                        </div>
                    </div>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_input_password_icon' class='common_icon'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div class='common_password_container'>
                                <div id='common_user_edit_input_password' class='common_input common_password' contenteditable=true  placeholder='<COMMON_TRANSLATION_PASSWORD/>'></div>
                                <div id='common_user_edit_input_password_mask' class='common_input common_password_mask'></div>
                            </div>
                        </div>
                    </div>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_input_password_confirm_icon' class='common_icon'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div class='common_password_container'>
                                <div id='common_user_edit_input_password_confirm' class='common_input common_password' contenteditable=true placeholder='<COMMON_TRANSLATION_PASSWORD_CONFIRM/>'></div>
                                <div id='common_user_edit_input_password_confirm_mask' class='common_input common_password_mask'></div>
                            </div>
                        </div>
                    </div>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_input_password_new_icon' class='common_icon'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div class='common_password_container'>
                                <div id='common_user_edit_input_password_new' class='common_input common_password' contenteditable=true placeholder='<COMMON_TRANSLATION_NEW_PASSWORD/>'></div>
                                <div id='common_user_edit_input_password_new_mask' class='common_input common_password_mask'></div>
                            </div>
                        </div>
                    </div>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_input_password_new_confirm_icon' class='common_icon'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div class='common_password_container'>
                                <div id='common_user_edit_input_password_new_confirm' class='common_input common_password' contenteditable=true placeholder='<COMMON_TRANSLATION_NEW_PASSWORD_CONFIRM/>'></div>
                                <div id='common_user_edit_input_password_new_confirm_mask' class='common_input common_password_mask'></div>
                            </div>
                        </div>
                    </div>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_input_password_reminder_icon' class='common_icon'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_input_password_reminder' class='common_input' contenteditable=true placeholder='<COMMON_TRANSLATION_PASSWORD_REMINDER/>'></div>
                        </div>
                    </div>
                    </div>
                    <div id='common_user_edit_provider'>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>    
                            <div id='common_user_edit_label_provider' class='common_icon'></div>
                        </div>
                        <div id='common_user_edit_provider_id' class='common_setting_horizontal_col'>
                        </div>
                    </div>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_label_provider_id' class='common_icon'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_label_provider_id_data'></div>
                        </div>
                    </div>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_label_provider_name'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_label_provider_name_data'></div>
                        </div>
                    </div>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_label_provider_email' class='common_icon'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_label_provider_email_data'></div>
                        </div>
                    </div>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_label_provider_image_url'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_label_provider_image_url_data'></div>
                        </div>
                    </div>
                    </div>
                    <div id='common_user_edit_account_info'>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_label_last_logontime' class='common_icon'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_label_data_last_logontime'></div>
                        </div>
                    </div>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_label_account_created' class='common_icon'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_label_data_account_created'></div>
                        </div>
                    </div>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_label_account_modified' class='common_icon'></div>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_label_data_account_modified'></div>
                        </div>
                    </div>
                    </div>
                    <div id='common_user_edit_buttons'>
                    <div class='common_setting_horizontal_row'>
                        <div class='common_setting_horizontal_col'>
                        </div>
                        <div class='common_setting_horizontal_col'>
                            <div id='common_user_edit_btn_user_update' class='common_dialogue_button common_icon' ></div>
                            <div id='common_user_edit_btn_user_delete_account' class='common_dialogue_button common_icon' ></div>
                        </div>
                    </div>
                    </div>
                    <div id='common_user_edit_close' class='common_dialogue_button common_icon' ></div>`;
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
     * User get
     * @returns {Promise.<void>}
     */
    const user_get = async () => {
        //get user from REST API
        props.FFB('DB_API', `/user_account?user_account_id=${props.user_account_id ?? ''}`, 'GET', 'APP_ACCESS', null)
        .then((/**@type{string}*/result)=>{
            const user = JSON.parse(result);
            if (props.user_account_id == parseInt(user.id)) {
                props.common_document.querySelector('#common_user_edit_local').style.display = 'none';
                props.common_document.querySelector('#common_user_edit_provider').style.display = 'none';
                props.common_document.querySelector('#common_dialogue_user_edit').style.visibility = 'visible';

                if (Number(user.private))
                    props.common_document.querySelector('#common_user_edit_checkbox_profile_private').classList.add('checked');
                else
                    props.common_document.querySelector('#common_user_edit_checkbox_profile_private').classList.remove('checked');

                props.common_document.querySelector('#common_user_edit_input_username').innerHTML = user.username;
                props.common_document.querySelector('#common_user_edit_input_bio').innerHTML = user.bio ?? '';

                if (user.provider_id == null) {
                    props.common_document.querySelector('#common_user_edit_local').style.display = 'block';
                    props.common_document.querySelector('#common_user_edit_provider').style.display = 'none';

                    //display fetched avatar editable
                    props.common_document.querySelector('#common_user_edit_avatar').style.display = 'block';
                    props.set_avatar(user.avatar, props.common_document.querySelector('#common_user_edit_avatar_img')); 
                    props.common_document.querySelector('#common_user_edit_input_email').innerHTML = user.email;
                    props.common_document.querySelector('#common_user_edit_input_new_email').innerHTML = user.email_unverified;
                    props.common_document.querySelector('#common_user_edit_input_password').innerHTML = '',
                        props.common_document.querySelector('#common_user_edit_input_password_confirm').innerHTML = '',
                        props.common_document.querySelector('#common_user_edit_input_password_new').innerHTML = '';
                    props.common_document.querySelector('#common_user_edit_input_password_new_confirm').innerHTML = '';

                    props.common_document.querySelector('#common_user_edit_input_password_reminder').innerHTML = user.password_reminder;
                } else{
                        props.common_document.querySelector('#common_user_edit_local').style.display = 'none';
                        props.common_document.querySelector('#common_user_edit_provider').style.display = 'block';
                        props.common_document.querySelector('#common_user_edit_provider_id').innerHTML = user.identity_provider_id;
                        props.common_document.querySelector('#common_user_edit_label_provider_id_data').innerHTML = user.provider_id;
                        props.common_document.querySelector('#common_user_edit_label_provider_name_data').innerHTML = user.provider_first_name + ' ' + user.provider_last_name;
                        props.common_document.querySelector('#common_user_edit_label_provider_email_data').innerHTML = user.provider_email;
                        props.common_document.querySelector('#common_user_edit_label_provider_image_url_data').innerHTML = user.provider_image_url;
                        props.common_document.querySelector('#common_user_edit_avatar').style.display = 'none';
                        props.set_avatar(user.provider_image, props.common_document.querySelector('#common_user_edit_avatar_img')); 
                    } 
                props.common_document.querySelector('#common_user_edit_label_data_last_logontime').innerHTML = props.format_json_date(user.last_logontime, null);
                props.common_document.querySelector('#common_user_edit_label_data_account_created').innerHTML = props.format_json_date(user.date_created, null);
                props.common_document.querySelector('#common_user_edit_label_data_account_modified').innerHTML = props.format_json_date(user.date_modified, null);
                props.set_avatar(user.avatar ?? user.provider_image, props.common_document.querySelector('#common_user_menu_avatar_img'));
            } else {
                //User not found
                props.show_message('ERROR', '20305', null, null, null, props.common_app_id);
            }
        })
        .catch(()=>null);
    };
    const render_template = async () =>{
        return template
                .replaceAll('<COMMON_TRANSLATION_USERNAME/>',props.translation_username)
                .replaceAll('<COMMON_TRANSLATION_BIO/>',props.translation_bio)
                .replaceAll('<COMMON_TRANSLATION_NEW_EMAIL/>',props.translation_new_email)
                .replaceAll('<COMMON_TRANSLATION_PASSWORD/>',props.translation_password)
                .replaceAll('<COMMON_TRANSLATION_PASSWORD_CONFIRM/>',props.translation_password_confirm)
                .replaceAll('<COMMON_TRANSLATION_NEW_PASSWORD/>',props.translation_new_password)
                .replaceAll('<COMMON_TRANSLATION_NEW_PASSWORD_CONFIRM/>',props.translation_new_password_confirm)
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
            user_get();
        }
        case 3:{
            //React
            //Use tempmount div to be able to return pure HTML
            //props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
            //ReactDOM.createRoot(div... .render( App()
            //return props.common_document.querySelector('#tempmount').innerHTML;
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = await render_template();
            user_get();
        }
        case 1:
        default:{
            //Default Javascript
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = await render_template();
            user_get();
        }
    }
}
export default method;

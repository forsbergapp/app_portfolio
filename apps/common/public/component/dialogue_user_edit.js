/**
 * @module apps/common/component/dialogue_user_edit
 */

/**
 * @param {{translation_username:string,
 *          translation_bio:string,
 *          translation_new_email:string,
 *          translation_password:string,
 *          translation_password_confirm:string,
 *          translation_new_password:string,
 *          translation_new_password_confirm:string,
 *          translation_password_reminder:string}} props
 */
const template = props => `<div id='common_user_edit_common'>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_user_avatar'>
                                        <div id='common_user_edit_avatar'>
                                            <div id='common_user_edit_btn_avatar_img' class='common_icon'></div>
                                            <input id='common_user_edit_input_avatar_img' type='file'>
                                        </div>
                                        <div id='common_user_edit_avatar_img' class='common_image common_image_avatar'></div>
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
                                    <div id='common_user_edit_input_username' class='common_input' contentEditable='true' placeholder='${props.translation_username}'></div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_user_edit_input_bio_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_user_edit_input_bio' class='common_input' contentEditable='true' placeholder='${props.translation_bio}'></div>
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
                                    <div id='common_user_edit_input_new_email' class='common_input' contentEditable='true' placeholder='${props.translation_new_email}'></div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_user_edit_input_password_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div class='common_password_container'>
                                        <div id='common_user_edit_input_password' class='common_input common_password' contentEditable='true'  placeholder='${props.translation_password}'></div>
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
                                        <div id='common_user_edit_input_password_confirm' class='common_input common_password' contentEditable='true' placeholder='${props.translation_password_confirm}'></div>
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
                                        <div id='common_user_edit_input_password_new' class='common_input common_password' contentEditable='true' placeholder='${props.translation_new_password}'></div>
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
                                        <div id='common_user_edit_input_password_new_confirm' class='common_input common_password' contentEditable='true' placeholder='${props.translation_new_password_confirm}'></div>
                                        <div id='common_user_edit_input_password_new_confirm_mask' class='common_input common_password_mask'></div>
                                    </div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_user_edit_input_password_reminder_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_user_edit_input_password_reminder' class='common_input' contentEditable='true' placeholder='${props.translation_password_reminder}'></div>
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
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          user_account_id:number,
 *          common_app_id:number,
 *          translation_username:string,
 *          translation_bio:string,
 *          translation_password:string,
 *          translation_password_confirm:string,
 *          translation_password_reminder:string,
 *          translation_email:string,
 *          translation_new_email:string,
 *          translation_new_password:string,
 *          translation_new_password_confirm:string,
 *          function_format_json_date:function,
 *          function_show_message:function,
 *          function_FFB:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show1');
    props.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    
    /**
     * User get
     * @returns {Promise.<void>}
     */
    const user_get = async () => {
        //get user from REST API
        props.function_FFB(`/server-db/user_account/${props.user_account_id ?? ''}`, null, 'GET', 'APP_ACCESS', null)
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
                    props.common_document.querySelector('#common_user_edit_avatar_img').style.backgroundImage= user.avatar?`url('${user.avatar}')`:'url()';
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
                        props.common_document.querySelector('#common_user_edit_avatar_img').style.backgroundImage= user.provider_image?`url('${user.provider_image}')`:'url()';
                    } 
                props.common_document.querySelector('#common_user_edit_label_data_last_logontime').innerHTML = props.function_format_json_date(user.last_logontime, null);
                props.common_document.querySelector('#common_user_edit_label_data_account_created').innerHTML = props.function_format_json_date(user.date_created, null);
                props.common_document.querySelector('#common_user_edit_label_data_account_modified').innerHTML = props.function_format_json_date(user.date_modified, null);
                props.common_document.querySelector('#common_user_menu_avatar_img').style.backgroundImage= (user.avatar ?? user.provider_image)?
                                                                                                                `url('${user.avatar ?? user.provider_image}')`:
                                                                                                                'url()';
            } else {
                //User not found
                props.function_show_message('ERROR', '20305', null, null, props.common_app_id);
            }
        })
        .catch(()=>null);
    };
    return {
        props:  {function_post:user_get},
        data:   null,
        template: template({translation_username:props.translation_username,
                            translation_bio:props.translation_bio,
                            translation_password:props.translation_password,
                            translation_password_confirm:props.translation_password_confirm,
                            translation_password_reminder:props.translation_password_reminder,
                            translation_new_email:props.translation_new_email,
                            translation_new_password:props.translation_new_password,
                            translation_new_password_confirm:props.translation_new_password_confirm})
    };
};
export default component;

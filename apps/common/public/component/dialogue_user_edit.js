/**
 * @module apps/common/component/dialogue_user_edit
 */


const template = () => `<div id='common_user_edit_common'>
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
                                    <div id='common_user_edit_input_username' class='common_input common_placeholder' contentEditable='true' ></div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_user_edit_input_bio_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_user_edit_input_bio' class='common_input common_placeholder' contentEditable='true' ></div>
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
                                    <div id='common_user_edit_input_new_email' class='common_input common_placeholder' contentEditable='true'></div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_user_edit_input_password_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div class='common_password_container'>
                                        <div id='common_user_edit_input_password' class='common_input common_password common_placeholder' contentEditable='true'></div>
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
                                        <div id='common_user_edit_input_password_confirm' class='common_input common_password common_placeholder' contentEditable='true'></div>
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
                                        <div id='common_user_edit_input_password_new' class='common_input common_password common_placeholder' contentEditable='true'></div>
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
                                        <div id='common_user_edit_input_password_new_confirm' class='common_input common_password common_placeholder' contentEditable='true'></div>
                                        <div id='common_user_edit_input_password_new_confirm_mask' class='common_input common_password_mask'></div>
                                    </div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_user_edit_input_password_reminder_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_user_edit_input_password_reminder' class='common_input common_placeholder' contentEditable='true'></div>
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
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      user_account_id:number,
 *                      common_app_id:number,
 *                      },
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      format_json_date:import('../../../common_types.js').CommonModuleCommon['format_json_date'],
 *                      show_message:import('../../../common_types.js').CommonModuleCommon['show_message'],
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB']
 *                      },
 *          lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:{onMounted:function}, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).classList.add('common_dialogue_show1');
    props.methods.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    
    /**
     * User get
     * @returns {Promise.<void>}
     */
    const user_get = async () => {
        //get user from REST API
        props.methods.FFB(`/server-db/user_account/${props.data.user_account_id ?? ''}`, null, 'GET', 'APP_ACCESS', null)
        .then((/**@type{string}*/result)=>{
            const user = JSON.parse(result);
            if (props.data.user_account_id == parseInt(user.id)) {
                props.methods.common_document.querySelector('#common_user_edit_local').style.display = 'none';
                props.methods.common_document.querySelector('#common_user_edit_provider').style.display = 'none';
                props.methods.common_document.querySelector('#common_dialogue_user_edit').style.visibility = 'visible';

                if (Number(user.private))
                    props.methods.common_document.querySelector('#common_user_edit_checkbox_profile_private').classList.add('checked');
                else
                    props.methods.common_document.querySelector('#common_user_edit_checkbox_profile_private').classList.remove('checked');

                props.methods.common_document.querySelector('#common_user_edit_input_username').innerHTML = user.username;
                props.methods.common_document.querySelector('#common_user_edit_input_bio').innerHTML = user.bio ?? '';

                if (user.provider_id == null) {
                    props.methods.common_document.querySelector('#common_user_edit_local').style.display = 'block';
                    props.methods.common_document.querySelector('#common_user_edit_provider').style.display = 'none';

                    //display fetched avatar editable
                    props.methods.common_document.querySelector('#common_user_edit_avatar').style.display = 'block';
                    props.methods.common_document.querySelector('#common_user_edit_avatar_img').style.backgroundImage= user.avatar?`url('${user.avatar}')`:'url()';
                    props.methods.common_document.querySelector('#common_user_edit_input_email').innerHTML = user.email;
                    props.methods.common_document.querySelector('#common_user_edit_input_new_email').innerHTML = user.email_unverified;
                    props.methods.common_document.querySelector('#common_user_edit_input_password').innerHTML = '',
                        props.methods.common_document.querySelector('#common_user_edit_input_password_confirm').innerHTML = '',
                        props.methods.common_document.querySelector('#common_user_edit_input_password_new').innerHTML = '';
                    props.methods.common_document.querySelector('#common_user_edit_input_password_new_confirm').innerHTML = '';

                    props.methods.common_document.querySelector('#common_user_edit_input_password_reminder').innerHTML = user.password_reminder;
                } else{
                        props.methods.common_document.querySelector('#common_user_edit_local').style.display = 'none';
                        props.methods.common_document.querySelector('#common_user_edit_provider').style.display = 'block';
                        props.methods.common_document.querySelector('#common_user_edit_provider_id').innerHTML = user.identity_provider_id;
                        props.methods.common_document.querySelector('#common_user_edit_label_provider_id_data').innerHTML = user.provider_id;
                        props.methods.common_document.querySelector('#common_user_edit_label_provider_name_data').innerHTML = user.provider_first_name + ' ' + user.provider_last_name;
                        props.methods.common_document.querySelector('#common_user_edit_label_provider_email_data').innerHTML = user.provider_email;
                        props.methods.common_document.querySelector('#common_user_edit_label_provider_image_url_data').innerHTML = user.provider_image_url;
                        props.methods.common_document.querySelector('#common_user_edit_avatar').style.display = 'none';
                        props.methods.common_document.querySelector('#common_user_edit_avatar_img').style.backgroundImage= user.provider_image?`url('${user.provider_image}')`:'url()';
                    } 
                props.methods.common_document.querySelector('#common_user_edit_label_data_last_logontime').innerHTML = props.methods.format_json_date(user.last_logontime, null);
                props.methods.common_document.querySelector('#common_user_edit_label_data_account_created').innerHTML = props.methods.format_json_date(user.date_created, null);
                props.methods.common_document.querySelector('#common_user_edit_label_data_account_modified').innerHTML = props.methods.format_json_date(user.date_modified, null);
                props.methods.common_document.querySelector('#common_user_menu_avatar_img').style.backgroundImage= (user.avatar ?? user.provider_image)?
                                                                                                                `url('${user.avatar ?? user.provider_image}')`:
                                                                                                                'url()';
            } else {
                //User not found
                props.methods.show_message('ERROR', '20305', null, null, props.data.common_app_id);
            }
        })
        .catch(()=>null);
    };
    return {
        lifecycle:  {onMounted:user_get},
        data:   null,
        methods:null,
        template: template()
    };
};
export default component;

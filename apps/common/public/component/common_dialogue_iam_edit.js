/**
 * Displays IAM edit
 * @module apps/common/component/common_dialogue_iam_edit
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
const template = () => `<div id='common_dialogue_iam_edit_common'>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_user_avatar'>
                                        <div id='common_dialogue_iam_edit_avatar'>
                                            <div id='common_dialogue_iam_edit_btn_avatar_img' class='common_icon'></div>
                                            <input id='common_dialogue_iam_edit_input_avatar_img' type='file'>
                                        </div>
                                        <div id='common_dialogue_iam_edit_avatar_img' class='common_image common_image_avatar'></div>
                                    </div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_private' class='common_icon'></div>
                                    <div id='common_dialogue_iam_edit_checkbox_profile_private' class='common_switch'></div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_username_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_username' class='common_input common_placeholder' contentEditable='true' ></div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_bio_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_bio' class='common_input common_placeholder' contentEditable='true' ></div>
                                </div>
                            </div>
                        </div>
                        <div id='common_dialogue_iam_edit_local'>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_email_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_email'></div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_new_email_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_new_email' class='common_input common_placeholder' contentEditable='true'></div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_password_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div class='common_password_container'>
                                        <div id='common_dialogue_iam_edit_input_password' class='common_input common_password common_placeholder' contentEditable='true'></div>
                                        <div id='common_dialogue_iam_edit_input_password_mask' class='common_input common_password_mask'></div>
                                    </div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_password_confirm_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div class='common_password_container'>
                                        <div id='common_dialogue_iam_edit_input_password_confirm' class='common_input common_password common_placeholder' contentEditable='true'></div>
                                        <div id='common_dialogue_iam_edit_input_password_confirm_mask' class='common_input common_password_mask'></div>
                                    </div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_password_new_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div class='common_password_container'>
                                        <div id='common_dialogue_iam_edit_input_password_new' class='common_input common_password common_placeholder' contentEditable='true'></div>
                                        <div id='common_dialogue_iam_edit_input_password_new_mask' class='common_input common_password_mask'></div>
                                    </div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_password_new_confirm_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div class='common_password_container'>
                                        <div id='common_dialogue_iam_edit_input_password_new_confirm' class='common_input common_password common_placeholder' contentEditable='true'></div>
                                        <div id='common_dialogue_iam_edit_input_password_new_confirm_mask' class='common_input common_password_mask'></div>
                                    </div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_password_reminder_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_password_reminder' class='common_input common_placeholder' contentEditable='true'></div>
                                </div>
                            </div>
                        </div>
                        <div id='common_dialogue_iam_edit_provider'>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>    
                                    <div id='common_dialogue_iam_edit_label_provider' class='common_icon'></div>
                                </div>
                                <div id='common_dialogue_iam_edit_provider_id' class='common_setting_horizontal_col'>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_provider_id' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_provider_id_data'></div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_provider_name'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_provider_name_data'></div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_provider_email' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_provider_email_data'></div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_provider_image_url'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_provider_image_url_data'></div>
                                </div>
                            </div>
                        </div>
                        <div id='common_dialogue_iam_edit_account_info'>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_last_logintime' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_data_last_logintime'></div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_account_created' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_data_account_created'></div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_account_modified' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_data_account_modified'></div>
                                </div>
                            </div>
                        </div>
                        <div id='common_dialogue_iam_edit_buttons'>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_btn_user_update' class='common_dialogue_button common_icon' ></div>
                                    <div id='common_dialogue_iam_edit_btn_user_delete_account' class='common_dialogue_button common_icon' ></div>
                                </div>
                            </div>
                        </div>
                        <div id='common_dialogue_iam_edit_close' class='common_dialogue_button common_icon' ></div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_id:number,
 *                      iam_user_id:number,
 *                      user_account_id:number,
 *                      common_app_id:number,
 *                      admin_app_id:number,
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonMiscFormatJsonDate:CommonModuleCommon['commonMiscFormatJsonDate'],
 *                      commonMessageShow:CommonModuleCommon['commonMessageShow'],
 *                      commonMesssageNotAuthorized:CommonModuleCommon['commonMesssageNotAuthorized'],
 *                      commonFFB:CommonModuleCommon['commonFFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show1');
    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    
    const user = props.data.app_id == props.data.admin_app_id?
                        await props.methods.commonFFB({path:`/server-iam/user/${props.data.iam_user_id ?? ''}`, method:'GET', authorization_type:'ADMIN'})
                        .then((/**@type{*}*/result)=>JSON.parse(result).rows ?? JSON.parse(result)):
                            await props.methods.commonFFB({path:`/server-db/user_account/${props.data.user_account_id ?? ''}`, method:'GET', authorization_type:'APP_ACCESS'})
                                    .then((/**@type{string}*/result)=>JSON.parse(result));
    /**
     * User get
     * @returns {Promise.<void>}
     */
    const user_get = async () => {
        if ((props.data.app_id == props.data.admin_app_id && props.data.iam_user_id == user.id)||
            props.data.user_account_id == parseInt(user.id)) {
            props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_local').style.display = 'none';
            props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_provider').style.display = 'none';
            props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit').style.visibility = 'visible';

            if (Number(user.private))
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_checkbox_profile_private').classList.add('checked');
            else
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_checkbox_profile_private').classList.remove('checked');

            props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_username').textContent = user.username;
            props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_bio').textContent = user.bio ?? '';

            if (user.provider_id == null) {
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_local').style.display = 'block';
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_provider').style.display = 'none';

                //display fetched avatar editable
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_avatar').style.display = 'block';
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_avatar_img').style.backgroundImage= user.avatar?`url('${user.avatar}')`:'url()';
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_avatar_img').setAttribute('data-image',user.avatar);
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_email').textContent = user.email;
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_new_email').textContent = user.email_unverified;
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password').textContent = '',
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password_confirm').textContent = '',
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password_new').textContent = '';
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password_new_confirm').textContent = '';

                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password_reminder').textContent = user.password_reminder;
            } else{
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_local').style.display = 'none';
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_provider').style.display = 'block';
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_provider_id').textContent = user.identity_provider_id;
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_label_provider_id_data').textContent = user.provider_id;
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_label_provider_name_data').textContent = user.provider_first_name + ' ' + user.provider_last_name;
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_label_provider_email_data').textContent = user.provider_email;
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_label_provider_image_url_data').textContent = user.provider_image_url;
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_avatar').style.display = 'none';
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_avatar_img').style.backgroundImage= user.provider_image?`url('${user.provider_image}')`:'url()';
                    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_avatar_img').setAttribute('data-image',user.provider_image);
                } 
            props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_label_data_last_logintime').textContent = props.methods.commonMiscFormatJsonDate(user.last_logintime, null);
            props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_label_data_account_created').textContent = props.methods.commonMiscFormatJsonDate(user.date_created ?? user.created, null);
            props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_label_data_account_modified').textContent = props.methods.commonMiscFormatJsonDate(user.date_modified ?? user.modified, null);
            props.methods.COMMON_DOCUMENT.querySelector('#common_iam_avatar_avatar_img').style.backgroundImage= (user.avatar ?? user.provider_image)?
                                                                                                            `url('${user.avatar ?? user.provider_image}')`:
                                                                                                            'url()';
        } else {
            //User not found
            props.methods.commonMessageShow('INFO', null, null, 'message_text',props.methods.commonMesssageNotAuthorized(), props.data.common_app_id);
        }
    };
    return {
        lifecycle:  {onMounted:user_get},
        data:   null,
        methods:null,
        template: template()
    };
};
export default component;

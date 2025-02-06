/**
 * Displays IAM edit
 * @module apps/common/component/common_dialogue_iam_edit
 */
/**
 * @import {CommonIAMUser,CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{user:CommonIAMUser,
 *          commonMiscFormatJsonDate:CommonModuleCommon['commonMiscFormatJsonDate']}} props
 * @returns {string}
 */
const template = props => `<div id='common_dialogue_iam_edit'>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_user_avatar'>
                                        <div id='common_dialogue_iam_edit_avatar'>
                                            <div id='common_dialogue_iam_edit_btn_avatar_img' class='common_icon'></div>
                                            <input id='common_dialogue_iam_edit_input_avatar_img' type='file'>
                                        </div>
                                        <div id='common_dialogue_iam_edit_avatar_img' data-image=${props.user.avatar} class='common_image common_image_avatar' style='${props.user.avatar==null?'':`background-image:url(${props.user.avatar});`}'></div>
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
                                    <div id='common_dialogue_iam_edit_input_username' class='common_input common_placeholder' contentEditable='true' >${props.user.username}</div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_bio_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_bio' class='common_input common_placeholder' contentEditable='true' >${props.user.bio??''}</div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_email_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_email'>${props.user.email??''}</div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_new_email_icon' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_input_new_email' class='common_input common_placeholder' contentEditable='true'>${props.user.email_unverified??''}</div>
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
                                    <div id='common_dialogue_iam_edit_input_password_reminder' class='common_input common_placeholder' contentEditable='true'>${props.user.password_reminder??''}</div>
                                </div>
                            </div>
                        </div>                        
                        <div id='common_dialogue_iam_edit_account_info'>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_last_logintime' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_data_last_logintime'>${props.commonMiscFormatJsonDate(props.user.last_logintime ??'', null)}</div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_account_created' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_data_account_created'>${props.commonMiscFormatJsonDate(props.user.created, null)}</div>
                                </div>
                            </div>
                            <div class='common_setting_horizontal_row'>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_account_modified' class='common_icon'></div>
                                </div>
                                <div class='common_setting_horizontal_col'>
                                    <div id='common_dialogue_iam_edit_label_data_account_modified'>${props.commonMiscFormatJsonDate(props.user.modified ??'', null)}</div>
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
    /**@type{CommonIAMUser} */    
    const user = await props.methods.commonFFB({path:`/server-iam/user/${props.data.iam_user_id}`, 
                                                method:'GET', authorization_type:props.data.app_id == props.data.admin_app_id?'ADMIN':'APP_ACCESS'})
                        .then((/**@type{*}*/result)=>JSON.parse(result).rows ?? JSON.parse(result));
    /**
     * @returns {Promise.<void>}
     */
    const onMounted = async () => {
        if (props.data.iam_user_id == user.id) {

            if (Number(user.private))
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_checkbox_profile_private').classList.add('checked');
            else
                props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_checkbox_profile_private').classList.remove('checked');

            props.methods.COMMON_DOCUMENT.querySelector('#common_iam_avatar_avatar_img').style.backgroundImage= user.avatar?
                                                                                                            `url('${user.avatar}')`:
                                                                                                            'url()';
        } else {
            //User not found
            props.methods.commonMessageShow('INFO', null, null, 'message_text',props.methods.commonMesssageNotAuthorized(), props.data.common_app_id);
        }
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({user:user, commonMiscFormatJsonDate:props.methods.commonMiscFormatJsonDate})
    };
};
export default component;

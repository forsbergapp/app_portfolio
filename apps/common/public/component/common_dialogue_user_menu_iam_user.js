/**
 * Displays user menu iam user
 * @module apps/common/component/common_dialogue_user_menu_iam_user
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{user:common['CommonIAMUser'],
*          commonMiscFormatJsonDate:common['CommonModuleCommon']['commonMiscFormatJsonDate']}} props
* @returns {string}
*/
const template = props => ` <div id='common_dialogue_user_menu_iam_user'>
                               <div class='common_dialogue_user_menu_iam_user_row_title'>
                                   <div id='common_dialogue_user_menu_iam_user_avatar' data-image=${props.user.avatar} class='common_image common_image_avatar' style='${props.user.avatar==null?'':`background-image:url(${props.user.avatar});`}'></div>
                                   <div id='common_dialogue_user_menu_iam_user_private' class='common_icon'></div>
                                   <div id='common_dialogue_user_menu_iam_user_checkbox_profile_private' class='common_switch'></div>
                               </div>
                               <div class='common_dialogue_user_menu_iam_user_row'>
                                   <div id='common_dialogue_user_menu_iam_user_input_username_icon' class='common_icon'></div>
                                   <div id='common_dialogue_user_menu_iam_user_input_username' class='common_input common_placeholder' contentEditable='true' >${props.user.username}</div>
                               </div>
                               <div class='common_dialogue_user_menu_iam_user_row'>
                                   <div id='common_dialogue_user_menu_iam_user_input_bio_icon' class='common_icon'></div>
                                   <div id='common_dialogue_user_menu_iam_user_input_bio' class='common_input common_placeholder' contentEditable='true' >${props.user.bio??''}</div>
                               </div>
                               <div class='common_dialogue_user_menu_iam_user_row'>
                                   <div id='common_dialogue_user_menu_iam_user_input_otp_icon' class='common_icon'></div>
                                   <div id='common_dialogue_user_menu_iam_user_input_otp_key'>******</div>
                               </div>
                               <div class='common_dialogue_user_menu_iam_user_row'>
                                   <div id='common_dialogue_user_menu_iam_user_input_password_icon' class='common_icon'></div>
                                   <div class='common_password_container'>
                                       <div id='common_dialogue_user_menu_iam_user_input_password' class='common_input common_password common_placeholder' contentEditable='true'></div>
                                       <div id='common_dialogue_user_menu_iam_user_input_password_mask' class='common_input common_password_mask'></div>
                                   </div>
                               </div>
                               <div class='common_dialogue_user_menu_iam_user_row'>
                                   <div id='common_dialogue_user_menu_iam_user_input_password_confirm_icon' class='common_icon'></div>
                                   <div class='common_password_container'>
                                       <div id='common_dialogue_user_menu_iam_user_input_password_confirm' class='common_input common_password common_placeholder' contentEditable='true'></div>
                                       <div id='common_dialogue_user_menu_iam_user_input_password_confirm_mask' class='common_input common_password_mask'></div>
                                   </div>
                               </div>
                               <div class='common_dialogue_user_menu_iam_user_row'>
                                   <div id='common_dialogue_user_menu_iam_user_input_password_new_icon' class='common_icon'></div>
                                   <div class='common_password_container'>
                                       <div id='common_dialogue_user_menu_iam_user_input_password_new' class='common_input common_password common_placeholder' contentEditable='true'></div>
                                       <div id='common_dialogue_user_menu_iam_user_input_password_new_mask' class='common_input common_password_mask'></div>
                                   </div>
                               </div>
                               <div class='common_dialogue_user_menu_iam_user_row'>
                                   <div id='common_dialogue_user_menu_iam_user_input_password_new_confirm_icon' class='common_icon'></div>
                                   <div class='common_password_container'>
                                       <div id='common_dialogue_user_menu_iam_user_input_password_new_confirm' class='common_input common_password common_placeholder' contentEditable='true'></div>
                                       <div id='common_dialogue_user_menu_iam_user_input_password_new_confirm_mask' class='common_input common_password_mask'></div>
                                   </div>
                               </div>
                               <div class='common_dialogue_user_menu_iam_user_row'>
                                   <div id='common_dialogue_user_menu_iam_user_input_password_reminder_icon' class='common_icon'></div>
                                   <div id='common_dialogue_user_menu_iam_user_input_password_reminder' class='common_input common_placeholder' contentEditable='true'>${props.user.password_reminder??''}</div>
                               </div>
                               <div class='common_dialogue_user_menu_iam_user_row'>
                                   <div id='common_dialogue_user_menu_iam_user_label_last_logintime' class='common_icon'></div>
                                   <div id='common_dialogue_user_menu_iam_user_label_data_last_logintime'>${props.commonMiscFormatJsonDate(props.user.last_logintime ??'', 'LONG')}</div>
                               </div>
                               <div class='common_dialogue_user_menu_iam_user_row'>
                                   <div id='common_dialogue_user_menu_iam_user_label_account_created' class='common_icon'></div>
                                   <div id='common_dialogue_user_menu_iam_user_label_data_account_created'>${props.commonMiscFormatJsonDate(props.user.created, 'LONG')}</div>
                               </div>
                               <div class='common_dialogue_user_menu_iam_user_row'>
                                   <div id='common_dialogue_user_menu_iam_user_label_account_modified' class='common_icon'></div>
                                   <div id='common_dialogue_user_menu_iam_user_label_data_account_modified'>${props.commonMiscFormatJsonDate(props.user.modified ??'', 'LONG')}</div>
                               </div>
                           </div>
                           <div id='common_dialogue_user_menu_iam_user_buttons'>
                               <div id='common_dialogue_user_menu_iam_user_btn_user_update' class='common_dialogue_button common_icon' ></div>
                               <div id='common_dialogue_user_menu_iam_user_btn_user_delete_account' class='common_dialogue_button common_icon' ></div>
                           </div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string,
*                      app_id:number,
*                      iam_user_id:number,
*                      admin_app_id:number,
*                      },
*          methods:    {
*                      COMMON:common['CommonModuleCommon']
*                      }}} props
* @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
*                      data:   null,
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {
   /**@type{common['CommonIAMUser']} */    
   const user = await props.methods.COMMON.commonFFB({path:`/server-iam/iamuser/${props.data.iam_user_id}`, 
                                               method:'GET', authorization_type:props.data.app_id == props.data.admin_app_id?'ADMIN':'APP_ACCESS'})
                       .then((/**@type{*}*/result)=>JSON.parse(result).rows ?? JSON.parse(result));
   /**
    * @returns {Promise.<void>}
    */
   const onMounted = async () => {
       if (props.data.iam_user_id == user.id) {

           if (Number(user.private))
               props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_checkbox_profile_private').classList.add('checked');
           else
               props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_checkbox_profile_private').classList.remove('checked');

           props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_avatar_img').style.backgroundImage= user.avatar?
                                                                                                           `url('${user.avatar}')`:
                                                                                                           'url()';
       } else {
           //User not found
           props.methods.COMMON.commonMessageShow('INFO', null, 'message_text',props.methods.COMMON.commonMesssageNotAuthorized());
       }
   };
   return {
       lifecycle:  {onMounted:onMounted},
       data:   null,
       methods:null,
       template: template({user:user, commonMiscFormatJsonDate:props.methods.COMMON.commonMiscFormatJsonDate})
   };
};
export default component;

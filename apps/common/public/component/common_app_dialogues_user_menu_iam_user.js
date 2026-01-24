/**
 * Displays user menu iam user
 * @module apps/common/component/common_app_dialogues_user_menu_iam_user
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{user:common['server']['iam']['iam_user'],
 *          commonMiscFormatJsonDate:common['CommonModuleCommon']['commonMiscFormatJsonDate'],
 *          icons:{ private:string,
 *                  username:string,
 *                  bio:string,
 *                  otp:string,
 *                  password:string,
 *                  password_confirm:string,
 *                  password_new:string,
 *                  password_new_confirm:string,
 *                  password_reminder:string,
 *                  last_logintime:string,
 *                  account_created:string,
 *                  account_modified:string,
 *                  delete:string,
 *                  update:string}}} props
 * @returns {string}
 */
const template = props => ` <div id='common_app_dialogues_user_menu_iam_user'>
                               <div class='common_app_dialogues_user_menu_iam_user_row_title'>
                                   <div id='common_app_dialogues_user_menu_iam_user_avatar' data-image=${props.user.Avatar} class='common_image common_image_avatar' style='${props.user.Avatar==null?'':`background-image:url(${props.user.Avatar});`}'></div>
                                   <div id='common_app_dialogues_user_menu_iam_user_private' >${props.icons.private}</div>
                                   <div id='common_app_dialogues_user_menu_iam_user_checkbox_profile_private' class='common_switch'></div>
                               </div>
                               <div class='common_app_dialogues_user_menu_iam_user_row'>
                                   <div id='common_app_dialogues_user_menu_iam_user_input_username_icon'>${props.icons.username}</div>
                                   <div id='common_app_dialogues_user_menu_iam_user_input_username' class='common_input common_placeholder' contentEditable='true' >${props.user.Username}</div>
                               </div>
                               <div class='common_app_dialogues_user_menu_iam_user_row'>
                                   <div id='common_app_dialogues_user_menu_iam_user_input_bio_icon'>${props.icons.bio}</div>
                                   <div id='common_app_dialogues_user_menu_iam_user_input_bio' class='common_input common_placeholder' contentEditable='true' >${props.user.Bio??''}</div>
                               </div>
                               <div class='common_app_dialogues_user_menu_iam_user_row'>
                                   <div id='common_app_dialogues_user_menu_iam_user_input_otp_icon'>${props.icons.otp}</div>
                                   <div id='common_app_dialogues_user_menu_iam_user_input_otp_key'>******</div>
                               </div>
                               <div class='common_app_dialogues_user_menu_iam_user_row'>
                                   <div id='common_app_dialogues_user_menu_iam_user_input_password_icon' >${props.icons.password}</div>
                                   <div class='common_password_container'>
                                       <div id='common_app_dialogues_user_menu_iam_user_input_password' class='common_input common_password common_placeholder' contentEditable='true'></div>
                                       <div id='common_app_dialogues_user_menu_iam_user_input_password_mask' class='common_input common_password_mask'></div>
                                   </div>
                               </div>
                               <div class='common_app_dialogues_user_menu_iam_user_row'>
                                   <div id='common_app_dialogues_user_menu_iam_user_input_password_confirm_icon' >${props.icons.password_confirm}</div>
                                   <div class='common_password_container'>
                                       <div id='common_app_dialogues_user_menu_iam_user_input_password_confirm' class='common_input common_password common_placeholder' contentEditable='true'></div>
                                       <div id='common_app_dialogues_user_menu_iam_user_input_password_confirm_mask' class='common_input common_password_mask'></div>
                                   </div>
                               </div>
                               <div class='common_app_dialogues_user_menu_iam_user_row'>
                                   <div id='common_app_dialogues_user_menu_iam_user_input_password_new_icon'>${props.icons.password_new}</div>
                                   <div class='common_password_container'>
                                       <div id='common_app_dialogues_user_menu_iam_user_input_password_new' class='common_input common_password common_placeholder' contentEditable='true'></div>
                                       <div id='common_app_dialogues_user_menu_iam_user_input_password_new_mask' class='common_input common_password_mask'></div>
                                   </div>
                               </div>
                               <div class='common_app_dialogues_user_menu_iam_user_row'>
                                   <div id='common_app_dialogues_user_menu_iam_user_input_password_new_confirm_icon'>${props.icons.password_new_confirm}</div>
                                   <div class='common_password_container'>
                                       <div id='common_app_dialogues_user_menu_iam_user_input_password_new_confirm' class='common_input common_password common_placeholder' contentEditable='true'></div>
                                       <div id='common_app_dialogues_user_menu_iam_user_input_password_new_confirm_mask' class='common_input common_password_mask'></div>
                                   </div>
                               </div>
                               <div class='common_app_dialogues_user_menu_iam_user_row'>
                                   <div id='common_app_dialogues_user_menu_iam_user_input_password_reminder_icon' >${props.icons.password_reminder}</div>
                                   <div id='common_app_dialogues_user_menu_iam_user_input_password_reminder' class='common_input common_placeholder' contentEditable='true'>${props.user.PasswordReminder??''}</div>
                               </div>
                               <div class='common_app_dialogues_user_menu_iam_user_row'>
                                   <div id='common_app_dialogues_user_menu_iam_user_label_last_logintime'>${props.icons.last_logintime}</div>
                                   <div id='common_app_dialogues_user_menu_iam_user_label_data_last_logintime'>${props.commonMiscFormatJsonDate(props.user.LastLoginTime ??'', 'LONG')}</div>
                               </div>
                               <div class='common_app_dialogues_user_menu_iam_user_row'>
                                   <div id='common_app_dialogues_user_menu_iam_user_label_account_created'>${props.icons.account_created}</div>
                                   <div id='common_app_dialogues_user_menu_iam_user_label_data_account_created'>${props.commonMiscFormatJsonDate(props.user.Created??'', 'LONG')}</div>
                               </div>
                               <div class='common_app_dialogues_user_menu_iam_user_row'>
                                   <div id='common_app_dialogues_user_menu_iam_user_label_account_modified' >${props.icons.account_modified}</div>
                                   <div id='common_app_dialogues_user_menu_iam_user_label_data_account_modified'>${props.commonMiscFormatJsonDate(props.user.Modified ??'', 'LONG')}</div>
                               </div>
                           </div>
                           <div id='common_app_dialogues_user_menu_iam_user_buttons'>
                               <div id='common_app_dialogues_user_menu_iam_user_btn_user_update' class='common_app_dialogues_button common_link common_icon_button' >${props.icons.update}</div>
                               <div id='common_app_dialogues_user_menu_iam_user_btn_user_delete_account' class='common_app_dialogues_button common_link common_icon_button' >${props.icons.delete}</div>
                           </div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string
*                      },
*          methods:    {
*                      COMMON:common['CommonModuleCommon']
*                      }}} props
* @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
*                      data:   null,
*                      methods:{commonUserUpdate:function},
*                      events: events,
*                      template:string}>}
*/
const component = async props => {
    /**@type{common['server']['iam']['iam_user']} */    
    const user = await props.methods.COMMON.commonFFB({path:`/server-iam/iamuser/${props.methods.COMMON.commonGlobalGet('Data').User.iam_user_id}`, 
                                                method:'GET', authorization_type:props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id == props.methods.COMMON.commonGlobalGet('Parameters').app_admin_app_id?'ADMIN':'APP_ACCESS'})
                        .then((/**@type{*}*/result)=>JSON.parse(result).rows ?? JSON.parse(result));

    /**
     * @name commonUserUpdate
     * @description User update
     * @function
     * @param {string|null} totp
     * @returns {Promise.<boolean>}
     */
    const commonUserUpdate = async (totp=null) => {
        if (props.methods.COMMON.commonMiscInputControl(props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user'),
                                {
                                username: props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_input_username'),
                                password: props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_input_password'),
                                password_confirm: props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_input_password_confirm'),
                                password_confirm_reminder: props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_input_password_reminder'),
                                password_new: props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_input_password_new'),
                                password_new_confirm: props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_input_password_new_confirm'),
                                bio: props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_input_bio')
                                })==false)
                    return false;
        if (totp==null){
            props.methods.COMMON.commonDialogueShow('VERIFY', '3');
            return false;
        }
        else
            return new Promise(resolve=>{
                const username =            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_input_username').textContent;
                const bio =                 props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_input_bio').textContent;
                const avatar =              props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_avatar').getAttribute('data-image').replace('null','')==''?
                                                null:
                                                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_avatar').getAttribute('data-image').replace('null','');
                const password =            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_input_password').textContent;
                const password_new =        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_input_password_new').textContent;
                const password_reminder =   props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_input_password_reminder').textContent;

                props.methods.COMMON.commonFFB({ path:`/server-iam/iamuser/${props.methods.COMMON.commonGlobalGet('Data').User.iam_user_id ?? ''}`, 
                            method:'PATCH', 
                            authorization_type:props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id==props.methods.COMMON.commonGlobalGet('Parameters').app_admin_app_id?'ADMIN':'APP_ACCESS', 
                            body:{  username:           username,
                                    password:           password,
                                    password_new:       password_new==''?null:password_new,
                                    bio:                bio,
                                    private:            Number(props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_checkbox_profile_private').classList.contains('checked')),
                                    password_reminder:  password_reminder,
                                    avatar:             avatar,
                                    totp:               totp
                                }, 
                            spinner_id:'common_app_dialogues_user_menu_iam_user_btn_user_update'})
                .then((result)=>{
                    if (JSON.parse(result).updated==1){
                        props.methods.COMMON.commonLogout();
                        props.methods.COMMON.commonGlobalGet('Functions').app_function_session_expired?props.methods.COMMON.commonGlobalGet('Functions').app_function_session_expired():null;
                        resolve(true);
                    }
                    else
                        resolve(false);
                })
                .catch(()=>false);
            });
    };
    /**
     * @name commonIamUserAppDelete
     * @description IamUserApp delete
     * @function
     * @param {number|null} choice 
     * @param {function|null} function_delete_event 
     * @returns {Promise.<null>}
     */
    const commonIamUserAppDelete = (choice=null, function_delete_event=null) => {
        return new Promise((resolve, reject)=>{
            const password = props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_input_password').textContent;
            switch (choice){
                case null:{
                    if (props.methods.COMMON.commonMiscInputControl(props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user'),
                                        {
                                            password: props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_input_password')
                                        })==false)
                        resolve(null);
                    else{
                        props.methods.COMMON.commonMessageShow('CONFIRM',function_delete_event, null, null);
                        resolve(null);
                    }
                    break;
                }
                case 1:{
                    props.methods.COMMON.commonFFB({ path:`/server-iam/iamuserapp/${props.methods.COMMON.commonGlobalGet('Data').UserApp.iam_user_app_id}`, 
                                body:{  password: password,
                                        IAM_data_app_id:props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id, 
                                        IAM_iam_user_id:props.methods.COMMON.commonGlobalGet('Data').User.iam_user_id}, 
                                method:'DELETE', 
                                authorization_type:'APP_ACCESS',
                                spinner_id:'common_app_dialogues_user_menu_iam_user_btn_user_delete_account'})
                    .then(()=>  resolve((()=>{
                                            props.methods.COMMON.commonComponentRemove('common_app_dialogues_user_menu');
                                            props.methods.COMMON.commonAppSwitch(props.methods.COMMON.commonGlobalGet('Parameters').app_start_app_id);
                                            return null;
                                            })()))
                    .catch(err=>reject(err));
                    break;
                }
                default:
                    resolve(null);
                    break;
            }
        });
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
                    case event_target_id=='common_app_dialogues_user_menu_iam_user_btn_user_update':{
                        await commonUserUpdate();
                        break;
                    }
                    case event_target_id=='common_app_dialogues_user_menu_iam_user_btn_user_delete_account':{
                        const function_delete_user_account = () => { 
                            commonIamUserAppDelete(1, null);
                        };
                        await commonIamUserAppDelete(null, function_delete_user_account);                        
                        break;
                    }
                }
            }
        }
    };
    /**
        * @returns {Promise.<void>}
        */
    const onMounted = async () => {
        if (props.methods.COMMON.commonGlobalGet('Data').User.iam_user_id == user.Id) {

            if (Number(user.Private))
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_checkbox_profile_private').classList.add('checked');
            else
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_checkbox_profile_private').classList.remove('checked');

            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_avatar_img').style.backgroundImage= user.Avatar?
                                                                                                            `url('${user.Avatar}')`:
                                                                                                            'url()';
        } else {
            //User not found
            props.methods.COMMON.commonMessageShow('INFO', null, 'message_text',props.methods.COMMON.commonMesssageNotAuthorized());
        }
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:{commonUserUpdate:commonUserUpdate},
        events:events,
        template: template({user:user, commonMiscFormatJsonDate:props.methods.COMMON.commonMiscFormatJsonDate,
                            icons:{ private:props.methods.COMMON.commonGlobalGet('ICONS')['lock'],
                                    username:props.methods.COMMON.commonGlobalGet('ICONS')['user'],
                                    bio:props.methods.COMMON.commonGlobalGet('ICONS')['user_profile'],
                                    otp:props.methods.COMMON.commonGlobalGet('ICONS')['otp'],
                                    password:props.methods.COMMON.commonGlobalGet('ICONS')['user_password'],
                                    password_confirm:props.methods.COMMON.commonGlobalGet('ICONS')['user_password_confirm'],
                                    password_new:props.methods.COMMON.commonGlobalGet('ICONS')['user_password'],
                                    password_new_confirm:props.methods.COMMON.commonGlobalGet('ICONS')['user_password_confirm'],
                                    password_reminder:props.methods.COMMON.commonGlobalGet('ICONS')['user_password_reminder'],
                                    last_logintime:props.methods.COMMON.commonGlobalGet('ICONS')['user_last_logintime'],
                                    account_created:props.methods.COMMON.commonGlobalGet('ICONS')['user_account_created'],
                                    account_modified:props.methods.COMMON.commonGlobalGet('ICONS')['user_account_modified'],
                                    delete:props.methods.COMMON.commonGlobalGet('ICONS')['delete'],
                                    update:props.methods.COMMON.commonGlobalGet('ICONS')['save']
                            }
        })
    };
};
export default component;

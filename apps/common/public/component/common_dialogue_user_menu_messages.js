/**
 * Displays user menu messages
 * @module apps/common/component/common_dialogue_user_menu_messages
 */
/**
 * @import {CommonMessageType,
 *          CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{messages:CommonMessageType[],
 *          commonMiscFormatJsonDate:CommonModuleCommon['commonMiscFormatJsonDate']}} props
 * @returns {string}
 */
const template = props => ` <div id='common_dialogue_user_menu_messages'>
                               <div class='common_dialogue_user_menu_messages_row_title'>
                                   <div class='common_dialogue_user_menu_messages_col_date' class='common_icon'>DATE</div>
                                   <div class='common_dialogue_user_menu_messages_col_sender' class='common_icon'>SENDER</div>
                                   <div class='common_dialogue_user_menu_messages_col_subject' class='common_icon'>ABC</div>
                               </div>
                               ${props.messages.map(row=>
                                `<div class='common_dialogue_user_menu_messages_row common_row' data-client_ip=${row.client_ip} data-host=${row.host} data-id=${row.id} data-message=${row.message}'>
                                    <div class='common_dialogue_user_menu_messages_col_date' class='common_icon'>${row.created}</div>
                                    <div class='common_dialogue_user_menu_messages_col_sender' class='common_icon'>${row.sender}</div>
                                    <div class='common_dialogue_user_menu_messages_col_subject' class='common_icon'>${row.subject}</div>
                                </div>`).join('')
                               }
                               <div id='common_dialogue_user_menu_message_content'></div>
                           </div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string,
*                      app_id:number,
*                      iam_user_id:number,
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
   
   /**@type{CommonMessageType[]} */    
   const messages = await props.methods.commonFFB({ path:'/app-common-module/COMMON_MESSAGE_GET', 
                                                    method:'POST', 
                                                    authorization_type:props.data.app_id == props.data.admin_app_id?'ADMIN':'APP_ACCESS'})
                       .then((/**@type{*}*/result)=>JSON.parse(result).rows ?? JSON.parse(result));
   /**
    * @returns {Promise.<void>}
    */
   const onMounted = async () => {
       null;
   };
   return {
       lifecycle:  {onMounted:onMounted},
       data:   null,
       methods:null,
       template: template({messages:messages, commonMiscFormatJsonDate:props.methods.commonMiscFormatJsonDate})
   };
};
export default component;

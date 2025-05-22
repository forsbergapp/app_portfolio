/**
 * Displays user menu message
 * @module apps/common/component/common_dialogue_user_menu_message
 */
/**
 * @import {CommonIAMUser, MessageQueuePublishMessage,CommonMessageType,
 *          CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{message:CommonMessageType & {created:MessageQueuePublishMessage['created'], username:CommonIAMUser['username']},
 *          commonMiscFormatJsonDate:CommonModuleCommon['commonMiscFormatJsonDate']}} props
 * @returns {string}
 */
const template = props => ` 
                            <div class='common_dialogue_user_menu_messages_message'>
                                <div class='common_dialogue_user_menu_messages_message_row'>
                                    <div id='common_dialogue_user_menu_messages_message_col_date' class='common_icon'></div><div>${props.commonMiscFormatJsonDate(props.message.created??'','LONG')}</div>
                                </div>
                                <div class='common_dialogue_user_menu_messages_message_row'>
                                    <div id='common_dialogue_user_menu_messages_message_col_sender' class='common_icon'></div><div>${props.message.sender ?? ''}</div>
                                </div>
                                <div class='common_dialogue_user_menu_messages_message_row'>
                                    <div id='common_dialogue_user_menu_messages_message_col_receiver' class='common_icon'></div><div>${props.message.username}</div>
                                </div>
                                <div class='common_dialogue_user_menu_messages_message_row'>
                                   <div id='common_dialogue_user_menu_messages_message_col_ip' class='common_icon'></div><div>${props.message.client_ip}</div>
                                </div>
                                <div class='common_dialogue_user_menu_messages_message_row'>
                                    <div id='common_dialogue_user_menu_messages_message_col_host' class='common_icon'></div><div>${props.message.host}</div>
                                </div>
                                <div class='common_dialogue_user_menu_messages_message_row'>
                                    <div id='common_dialogue_user_menu_messages_message_col_subject' class='common_icon'></div><div>${props.message.subject}</div>
                                </div>
                            </div>
                            <div id='common_dialogue_user_menu_messages_message_col_message' class='common_icon'></div>
                            <div id='common_dialogue_user_menu_messages_message_col_message_text'>${props.message.message}</div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string,
*                      app_id:number,
*                      message:CommonMessageType & {created:MessageQueuePublishMessage['created'], username:CommonIAMUser['username']},
*                      },
*          methods:    {
*                      COMMON_DOCUMENT:COMMON_DOCUMENT,
*                      commonMiscFormatJsonDate:CommonModuleCommon['commonMiscFormatJsonDate']
*                      }}} props
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
*                      data:   null,
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {

   return {
       lifecycle:  null,
       data:   null,
       methods:null,
       template: template({message:props.data.message, commonMiscFormatJsonDate:props.methods.commonMiscFormatJsonDate})
   };
};
export default component;

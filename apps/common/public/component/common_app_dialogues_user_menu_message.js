/**
 * Displays user menu message
 * @module apps/common/component/common_app_dialogues_user_menu_message
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{message:common['ORM']['MessageQueuePublish']['message'] & {username:common['ORM']['IamUser']['username']},
 *          commonMiscFormatJsonDate:common['CommonModuleCommon']['commonMiscFormatJsonDate']}} props
 * @returns {string}
 */
const template = props => ` 
                            <div class='common_app_dialogues_user_menu_messages_message'>
                                <div class='common_app_dialogues_user_menu_messages_message_row'>
                                    <div id='common_app_dialogues_user_menu_messages_message_col_date' class='common_icon'></div><div>${props.commonMiscFormatJsonDate(props.message.created??'','LONG')}</div>
                                </div>
                                <div class='common_app_dialogues_user_menu_messages_message_row'>
                                    <div id='common_app_dialogues_user_menu_messages_message_col_sender' class='common_icon'></div><div>${props.message.sender ?? ''}</div>
                                </div>
                                <div class='common_app_dialogues_user_menu_messages_message_row'>
                                    <div id='common_app_dialogues_user_menu_messages_message_col_receiver' class='common_icon'></div><div>${props.message.username}</div>
                                </div>
                                <div class='common_app_dialogues_user_menu_messages_message_row'>
                                   <div id='common_app_dialogues_user_menu_messages_message_col_ip' class='common_icon'></div><div>${props.message.client_ip}</div>
                                </div>
                                <div class='common_app_dialogues_user_menu_messages_message_row'>
                                    <div id='common_app_dialogues_user_menu_messages_message_col_host' class='common_icon'></div><div>${props.message.host}</div>
                                </div>
                                <div class='common_app_dialogues_user_menu_messages_message_row'>
                                    <div id='common_app_dialogues_user_menu_messages_message_col_subject' class='common_icon'></div><div>${props.message.subject}</div>
                                </div>
                            </div>
                            <div id='common_app_dialogues_user_menu_messages_message_col_message' class='common_icon'></div>
                            <div id='common_app_dialogues_user_menu_messages_message_col_message_text'>${props.message.message}</div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string,
*                      app_id:number,
*                      message:common['ORM']['MessageQueuePublish']['message'] & {username:common['ORM']['IamUser']['username']},
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

   return {
       lifecycle:  null,
       data:   null,
       methods:null,
       template: template({message:props.data.message, commonMiscFormatJsonDate:props.methods.COMMON.commonMiscFormatJsonDate})
   };
};
export default component;

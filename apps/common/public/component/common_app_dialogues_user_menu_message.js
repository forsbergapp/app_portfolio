/**
 * Displays user menu message
 * @module apps/common/component/common_app_dialogues_user_menu_message
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description TemplateFV
 * 
 * @function
 * @param {{message:common['server']['ORM']['Object']['MessageQueuePublish']['Message'] & {Username:common['server']['ORM']['Object']['IamUser']['Username']},
 *          commonMiscFormatJsonDate:common['CommonModuleCommon']['commonMiscFormatJsonDate'],
 *          icons:{
 *                   date:string,
 *                   sender:string,
 *                   receiver:string,
 *                   ip:string,
 *                   host:string,
 *                   subject:string,
 *                   message:string}}} props
 * @returns {string}
 */
const template = props => ` 
                            <div class='common_app_dialogues_user_menu_messages_message'>
                                <div class='common_app_dialogues_user_menu_messages_message_row'>
                                    <div id='common_app_dialogues_user_menu_messages_message_col_date'>${props.icons.date}</div>
                                    <div>${props.commonMiscFormatJsonDate(props.message.Created??'','LONG')}</div>
                                </div>
                                <div class='common_app_dialogues_user_menu_messages_message_row'>
                                    <div id='common_app_dialogues_user_menu_messages_message_col_sender'>${props.icons.sender}</div>
                                    <div>${props.message.Sender ?? ''}</div>
                                </div>
                                <div class='common_app_dialogues_user_menu_messages_message_row'>
                                    <div id='common_app_dialogues_user_menu_messages_message_col_receiver'>${props.icons.receiver}</div>
                                    <div>${props.message.Username}</div>
                                </div>
                                <div class='common_app_dialogues_user_menu_messages_message_row'>
                                   <div id='common_app_dialogues_user_menu_messages_message_col_ip'>${props.icons.ip}</div>
                                   <div>${props.message.ClientIp}</div>
                                </div>
                                <div class='common_app_dialogues_user_menu_messages_message_row'>
                                    <div id='common_app_dialogues_user_menu_messages_message_col_host'>${props.icons.host}</div>
                                    <div>${props.message.Host}</div>
                                </div>
                                <div class='common_app_dialogues_user_menu_messages_message_row'>
                                    <div id='common_app_dialogues_user_menu_messages_message_col_subject'>${props.icons.subject}</div>
                                    <div>${props.message.Subject}</div>
                                </div>
                            </div>
                            <div id='common_app_dialogues_user_menu_messages_message_col_message'>${props.icons.message}</div>
                            <div id='common_app_dialogues_user_menu_messages_message_col_message_text'>${props.message.Message}</div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string,
*                      app_id:number,
*                      message:common['server']['ORM']['Object']['MessageQueuePublish']['Message'] & {Username:common['server']['ORM']['Object']['IamUser']['Username']},
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
       template: template({ message:props.data.message, 
                            commonMiscFormatJsonDate:props.methods.COMMON.commonMiscFormatJsonDate,
                            icons:{
                                        date:props.methods.COMMON.commonGlobalGet('ICONS')['regional_calendar'],
                                        sender:props.methods.COMMON.commonGlobalGet('ICONS')['user'] + props.methods.COMMON.commonGlobalGet('ICONS')['logout'],
                                        receiver:props.methods.COMMON.commonGlobalGet('ICONS')['user'] + props.methods.COMMON.commonGlobalGet('ICONS')['login'],
                                        ip:props.methods.COMMON.commonGlobalGet('ICONS')['internet'],
                                        host:props.methods.COMMON.commonGlobalGet('ICONS')['server'],
                                        subject:props.methods.COMMON.commonGlobalGet('ICONS')['info'],
                                        message:props.methods.COMMON.commonGlobalGet('ICONS')['email']}})

   };
};
export default component;

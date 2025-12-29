/**
 * Displays user menu message list
 * @module apps/common/component/common_app_dialogues_user_menu_messages_list_list
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{messages:common['CommonResponsePagination'] & {rows: common['server']['ORM']['Object']['MessageQueuePublish']['Message'][]},
 *          commonMiscFormatJsonDate:common['CommonModuleCommon']['commonMiscFormatJsonDate'],
 *          icons:{ delete:string,
 *                  date:string,
 *                  sender:string,
 *                  subject:string}}} props
 * @returns {string}
 */
const template = props => ` 
                        <div class='common_app_dialogues_user_menu_messages_list_row_title common_app_dialogues_user_menu_messages_list_row'>
                            <div id='common_app_dialogues_user_menu_messages_list_col_delete' class='common_app_dialogues_user_menu_messages_list_col common_app_dialogues_user_menu_messages_list_col_delete' >${props.icons.delete}</div>
                            <div id='common_app_dialogues_user_menu_messages_list_col_date' class='common_app_dialogues_user_menu_messages_list_col'>${props.icons.date}</div>
                            <div id='common_app_dialogues_user_menu_messages_list_col_subject' class='common_app_dialogues_user_menu_messages_list_col'>${props.icons.sender}</div>
                            <div id='common_app_dialogues_user_menu_messages_list_col_sender' class='common_app_dialogues_user_menu_messages_list_col'>${props.icons.subject}</div>
                        </div>
                        ${props.messages.rows.map(row=>
                            `<div class='common_app_dialogues_user_menu_messages_list_row common_row ${row.read?'common_app_dialogues_user_menu_messages_list_row_read':'common_app_dialogues_user_menu_messages_list_row_unread'}' 
                                data-id=${row.Id} 
                                data-created='${row.Created}'
                                data-sender='${row.Message.Sender??''}'
                                data-receiver_id='${row.Message.ReceiverId??''}'
                                data-client_ip='${row.Message.ClientIp}'
                                data-host='${row.Message.Host}'
                                data-subject='${row.Message.Subject}'
                                data-message='${row.Message.Message}'>
                                <div class='common_app_dialogues_user_menu_messages_list_col common_app_dialogues_user_menu_messages_list_col_delete common_link'>${props.icons.delete}</div>
                                <div class='common_app_dialogues_user_menu_messages_list_col common_link'>${props.commonMiscFormatJsonDate(row.Created??'')}</div>
                                <div class='common_app_dialogues_user_menu_messages_list_col common_link'>${row.Message.Subject}</div>
                                <div class='common_app_dialogues_user_menu_messages_list_col common_link'>${row.Message.Sender ?? ''}</div>
                            </div>`).join('')
                            }`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string,
*                      messages:common['CommonResponsePagination'] & {rows: common['server']['ORM']['Object']['MessageQueuePublish']['Message'][]},
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
       template: template({ messages:props.data.messages, 
                            commonMiscFormatJsonDate:props.methods.COMMON.commonMiscFormatJsonDate,
                            icons:{
                                    delete:props.methods.COMMON.commonGlobalGet('ICONS')['delete'],
                                    date:props.methods.COMMON.commonGlobalGet('ICONS')['regional_calendar'],
                                    sender:props.methods.COMMON.commonGlobalGet('ICONS')['user'],
                                    subject:props.methods.COMMON.commonGlobalGet('ICONS')['message_text']}})
    };
};
export default component;

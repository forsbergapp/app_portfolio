/**
 * Displays user menu message list
 * @module apps/common/component/common_app_dialogues_user_menu_message_list
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{messages:common['MessagesPagination'],
 *          commonMiscFormatJsonDate:common['CommonModuleCommon']['commonMiscFormatJsonDate']}} props
 * @returns {string}
 */
const template = props => ` 
                        <div class='common_app_dialogues_user_menu_messages_row_title common_app_dialogues_user_menu_messages_row'>
                            <div id='common_app_dialogues_user_menu_messages_col_delete' class='common_app_dialogues_user_menu_messages_col common_app_dialogues_user_menu_messages_col_delete common_icon'></div>
                            <div id='common_app_dialogues_user_menu_messages_col_date' class='common_app_dialogues_user_menu_messages_col common_icon'></div>
                            <div id='common_app_dialogues_user_menu_messages_col_subject' class='common_app_dialogues_user_menu_messages_col common_icon'></div>
                            <div id='common_app_dialogues_user_menu_messages_col_sender' class='common_app_dialogues_user_menu_messages_col common_icon'></div>
                        </div>
                        ${props.messages.rows.map(row=>
                            `<div class='common_app_dialogues_user_menu_messages_row common_row ${row.read?'common_app_dialogues_user_menu_messages_row_read':'common_app_dialogues_user_menu_messages_row_unread'}' 
                                data-id=${row.id} 
                                data-created='${row.created}'
                                data-sender='${row.message.sender??''}'
                                data-receiver_id='${row.message.receiver_id??''}'
                                data-client_ip='${row.message.client_ip}'
                                data-host='${row.message.host}'
                                data-subject='${row.message.subject}'
                                data-message='${row.message.message}'>
                                <div class='common_app_dialogues_user_menu_messages_col common_app_dialogues_user_menu_messages_col_delete common_icon'></div>
                                <div class='common_app_dialogues_user_menu_messages_col'>${props.commonMiscFormatJsonDate(row.created??'')}</div>
                                <div class='common_app_dialogues_user_menu_messages_col'>${row.message.subject}</div>
                                <div class='common_app_dialogues_user_menu_messages_col'>${row.message.sender ?? ''}</div>
                            </div>`).join('')
                            }`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string,
*                      app_id:number,
*                      messages:common['MessagesPagination'],
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
                            commonMiscFormatJsonDate:props.methods.COMMON.commonMiscFormatJsonDate})
   };
};
export default component;

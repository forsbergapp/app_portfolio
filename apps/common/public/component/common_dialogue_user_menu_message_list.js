/**
 * Displays user menu message list
 * @module apps/common/component/common_dialogue_user_menu_message_list
 */
/**
 * @import {MessagesPagination,
 *          CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{messages:MessagesPagination,
 *          commonMiscFormatJsonDate:CommonModuleCommon['commonMiscFormatJsonDate']}} props
 * @returns {string}
 */
const template = props => ` 
                        <div class='common_dialogue_user_menu_messages_row_title common_dialogue_user_menu_messages_row'>
                            <div id='common_dialogue_user_menu_messages_col_delete' class='common_dialogue_user_menu_messages_col common_dialogue_user_menu_messages_col_delete common_icon'></div>
                            <div id='common_dialogue_user_menu_messages_col_date' class='common_dialogue_user_menu_messages_col common_icon'></div>
                            <div id='common_dialogue_user_menu_messages_col_subject' class='common_dialogue_user_menu_messages_col common_icon'></div>
                            <div id='common_dialogue_user_menu_messages_col_sender' class='common_dialogue_user_menu_messages_col common_icon'></div>
                        </div>
                        ${props.messages.rows.map(row=>
                            `<div class='common_dialogue_user_menu_messages_row common_row ${row.read?'common_dialogue_user_menu_messages_row_read':'common_dialogue_user_menu_messages_row_unread'}' 
                                data-id=${row.id} 
                                data-created='${row.created}'
                                data-sender='${row.message.sender??''}'
                                data-receiver_id='${row.message.receiver_id??''}'
                                data-client_ip='${row.message.client_ip}'
                                data-host='${row.message.host}'
                                data-subject='${row.message.subject}'
                                data-message='${row.message.message}'>
                                <div class='common_dialogue_user_menu_messages_col common_dialogue_user_menu_messages_col_delete common_icon'></div>
                                <div class='common_dialogue_user_menu_messages_col' class='common_icon'>${props.commonMiscFormatJsonDate(row.created??'')}</div>
                                <div class='common_dialogue_user_menu_messages_col' class='common_icon'>${row.message.subject}</div>
                                <div class='common_dialogue_user_menu_messages_col' class='common_icon'>${row.message.sender ?? ''}</div>
                            </div>`).join('')
                            }`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string,
*                      app_id:number,
*                      messages:MessagesPagination,
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
       template: template({ messages:props.data.messages, 
                            commonMiscFormatJsonDate:props.methods.commonMiscFormatJsonDate})
   };
};
export default component;

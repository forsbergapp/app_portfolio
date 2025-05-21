/**
 * Displays user menu messages
 * @module apps/common/component/common_dialogue_user_menu_messages
 */
/**
 * @import {MessageQueuePublishMessage,
 *          CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{messages:MessageQueuePublishMessage[],
 *          commonMiscFormatJsonDate:CommonModuleCommon['commonMiscFormatJsonDate']}} props
 * @returns {string}
 */
const template = props => ` <div id='common_dialogue_user_menu_messages'>
                                <div id='common_dialogue_user_menu_messages_list'>
                                    <div class='common_dialogue_user_menu_messages_row_title common_dialogue_user_menu_messages_row'>
                                        <div id='common_dialogue_user_menu_messages_col_date' class='common_dialogue_user_menu_messages_col common_icon'></div>
                                        <div id='common_dialogue_user_menu_messages_col_subject' class='common_dialogue_user_menu_messages_col common_icon'></div>
                                        <div id='common_dialogue_user_menu_messages_col_sender' class='common_dialogue_user_menu_messages_col common_icon'></div>
                                    </div>
                                    ${props.messages.map(row=>
                                    `<div class='common_dialogue_user_menu_messages_row common_row ${row.read?'common_dialogue_user_menu_messages_row_read':'common_dialogue_user_menu_messages_row_unread'}' 
                                        data-client_ip='${row.message.client_ip}'
                                        data-host='${row.message.host}' 
                                        data-id=${row.id} 
                                        data-message='${row.message.message}'>
                                        <div class='common_dialogue_user_menu_messages_col' class='common_icon'>${props.commonMiscFormatJsonDate(row.created??'')}</div>
                                        <div class='common_dialogue_user_menu_messages_col' class='common_icon'>${row.message.subject}</div>
                                        <div class='common_dialogue_user_menu_messages_col' class='common_icon'>${row.message.sender ?? ''}</div>
                                    </div>`).join('')
                                    }
                                </div>
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
*                      commonFFB:CommonModuleCommon['commonFFB']
*                      }}} props
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
*                      data:   null,
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {
   
   /**@type{MessageQueuePublishMessage[]} */    
   const messages = await props.methods.commonFFB({ path:'/app-common-module/COMMON_MESSAGE_GET', 
                                                    method:'POST', 
                                                    body:{  type:'FUNCTION', 
                                                            IAM_iam_user_id:props.data.iam_user_id,
                                                            IAM_data_app_id:props.data.common_app_id},
                                                    authorization_type:props.data.app_id == props.data.admin_app_id?'ADMIN':'APP_ACCESS'})
                       .then((/**@type{*}*/result)=>JSON.parse(result).rows ?? JSON.parse(result))
                       //sort message.id descending order
                       .then(result=>result.sort((/**@type{MessageQueuePublishMessage}*/a,
                                                  /**@type{MessageQueuePublishMessage}*/b)=>
                                        /**@ts-ignore */
                                        a.id>b.id?0:1));
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

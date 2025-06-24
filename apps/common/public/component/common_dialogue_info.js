/**
 * Displays info
 * @module apps/common/component/common_dialogue_apps
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_copyright:string,
*          app_link_url:string,
*          app_link_title:string,
*          info_link_policy_name:string,
*          info_link_disclaimer_name:string,
*          info_link_terms_name:string}} props 
* @returns {string}
*/
const template = props => `
                            <div id='common_dialogue_info_contact'>
                                <div id='common_dialogue_info_contact_message_title' class='common_icon'></div>
                                <div id='common_dialogue_info_contact_message' class='common_input' contentEditable='true'></div>
                                <div id='common_dialogue_info_contact_message_send' class='common_dialogue_button common_icon' ></div>
                            </div>
                            <div id='common_dialogue_info_start_links'>
                                <div id='common_dialogue_info_app_link_row'>
                                    <div id='common_dialogue_info_app_link' class='common_link'>${props.app_link_url==null?'':props.app_link_title}</div>
                                </div>
                                <div id='common_dialogue_info_info_link_row'>
                                    <div id='common_dialogue_info_info_link1' class='common_link'>${props.info_link_policy_name}</div>
                                    <div id='common_dialogue_info_info_link2' class='common_link'>${props.info_link_disclaimer_name}</div>
                                    <div id='common_dialogue_info_info_link3' class='common_link'>${props.info_link_terms_name}</div>
                                </div>
                            </div>
                            <div id='common_dialogue_info_app_copyright'>${props.app_copyright}</div>
                            <div id='common_dialogue_info_close' class='common_dialogue_button common_icon' ></div>
                           `;

/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string,
*                      common_app_id:number,
*                      app_copyright:string,
*                      app_link_url:string,
*                      app_link_title:string,
*                      info_link_policy_name:string,
*                      info_link_disclaimer_name:string,
*                      info_link_terms_name:string
*                      },
*          methods:    {
*                      COMMON_DOCUMENT:COMMON_DOCUMENT,
*                      commonFFB:CommonModuleCommon['commonFFB'],
*                      commonMessageShow:CommonModuleCommon['commonMessageShow']
*                      }}} props
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
*                      data:null, 
*                      methods:{eventClickSend:Function},
*                      template:string}>}
*/
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show0');
  
    const eventClickSend = async ()=>{
        await props.methods.commonFFB(
                    {
                        path:   '/app-common-module/COMMON_MESSAGE_CONTACT', 
                        method: 'POST', 
                        body:   {   type:'FUNCTION',
                                    message:props.methods.COMMON_DOCUMENT.querySelector('#common_dialogue_info_contact_message').textContent,
                                    IAM_data_app_id:props.data.common_app_id},
                        authorization_type:'APP_ID'
                    })
        .then((/**@type{string}*/result)=>{
            if (Number(JSON.parse(result).rows[0].sent) > 0)
                props.methods.commonMessageShow('INFO', null, 'message_success', `(${Number(JSON.parse(result).rows[0].sent)})`);
            else
                props.methods.commonMessageShow('INFO', null, 'message_fail', `(${Number(JSON.parse(result).rows[0].sent)})`);
        });
    };
        
    return {
       lifecycle:  null,
       data:       null,
       methods:    {eventClickSend:eventClickSend},
       template:   template({    
                           app_copyright:props.data.app_copyright,
                           app_link_url:props.data.app_link_url,
                           app_link_title:props.data.app_link_title,
                           info_link_policy_name:props.data.info_link_policy_name,
                           info_link_disclaimer_name:props.data.info_link_disclaimer_name,
                           info_link_terms_name:props.data.info_link_terms_name
                           })
    };
};
export default component;
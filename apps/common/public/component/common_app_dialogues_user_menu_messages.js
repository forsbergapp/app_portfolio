/**
 * Displays user menu messages
 * @module apps/common/component/common_app_dialogues_user_menu_messages
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{icons:{
 *                 first:string,
 *                 previous:string,
 *                 next:string,
 *                 last:string}}} props
 * @returns {string}
 */
const template = props => ` <div id='common_app_dialogues_user_menu_messages'>
                                <div id='common_app_dialogues_user_menu_messages_list'></div>
                                <div id='common_app_dialogues_user_menu_messages_pagination'>
                                    <div></div>
                                    <div></div>
                                    <div id='common_app_dialogues_user_menu_messages_pagination_first'       class='common_link common_icon_title'>${props.icons.first}</div>
                                    <div id='common_app_dialogues_user_menu_messages_pagination_previous'    class='common_link common_icon_title'>${props.icons.previous}</div>
                                    <div id='common_app_dialogues_user_menu_messages_pagination_next'        class='common_link common_icon_title'>${props.icons.next}</div>
                                    <div id='common_app_dialogues_user_menu_messages_pagination_last'        class='common_link common_icon_title'>${props.icons.last}</div>
                                    <div id='common_app_dialogues_user_menu_messages_pagination_page'></div>
                                    <div id='common_app_dialogues_user_menu_messages_pagination_page_last'></div>
                                    <div id='common_app_dialogues_user_menu_messages_pagination_page_total_count'></div>
                                </div>
                                <div id='common_app_dialogues_user_menu_message_content'></div>
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
*                      COMMON:common['CommonModuleCommon']
*                      }}} props
* @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
*                      data:   null,
*                      methods:null,
*                      events:common['commonComponentEvents']
*                      template:string}>}
*/
const component = async props => {

    //page navigation values
    let page =      1;
    let page_last=  1;
    let page_limit= 0;
    const offset = 0;
    /**@type{common['CommonResponsePagination']}*/    
    let messages; 

    /**
     * @description page navigation for messages
     * @param {string} element
     * @returns {Promise.<void>}
     */
    const eventClickPagination = async element =>{
        switch (element){
            case 'common_app_dialogues_user_menu_messages_pagination_first':{
                page = 1;
                break;
            }
            case 'common_app_dialogues_user_menu_messages_pagination_previous':{
                if (page - 1 < 1)
                    page = 1;
                else
                    page = page - 1;
                break;
            }
            case 'common_app_dialogues_user_menu_messages_pagination_next':{
                if (page + 1 > page_last)
                    page = page_last;
                else
                    page = page + 1;
                break;
            }
            case 'common_app_dialogues_user_menu_messages_pagination_last':{
                page = page_last;
                break;
            }
        }
        await messagesShow((page==1?0:page-1) * page_limit);
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_messages_pagination_page').textContent = page; 
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_messages_pagination_page_last').textContent = page_last;
    };
   
    /**
     * @param {number} offset
     * @returns {Promise.<void>}
     */
    const messagesShow = async (offset) =>{
        /**@type{common['CommonResponsePagination']}*/    
        messages = await messagesGet(offset);
        await props.methods.COMMON.commonComponentRender({
            mountDiv:'common_app_dialogues_user_menu_messages_list',
            data:   {
                    messages:   messages,
                    },
            methods:null,
            path:'/common/component/common_app_dialogues_user_menu_messages_list.js'});
        //cant check stats on pagination records, call server function that fetches stats for all messages
        props.methods.COMMON.commonUserMessageShowStat();
    };
    
    /**
     * @param {number} offset
     * @returns {Promise.<common['CommonResponsePagination']>}
     */
    const messagesGet = async offset =>{
        /**@type{common['CommonResponsePagination']}*/    
        const messages = await props.methods.COMMON.commonFFB({path:'/app-common-module/COMMON_MESSAGE_GET', 
            method:'POST', 
            query:`offset=${offset}`,
            body:{  type:'FUNCTION', 
                    IAM_iam_user_id:props.data.iam_user_id,
                    IAM_data_app_id:props.data.common_app_id},
            authorization_type:props.data.app_id == props.data.admin_app_id?'ADMIN':'APP_ACCESS'})
        .then((/**@type{*}*/result)=>JSON.parse(result))
        .catch(()=>[]);
        return messages;
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
                    case event_target_id=='common_app_dialogues_user_menu_messages_pagination_first':
                    case event_target_id=='common_app_dialogues_user_menu_messages_pagination_previous':
                    case event_target_id=='common_app_dialogues_user_menu_messages_pagination_next':
                    case event_target_id=='common_app_dialogues_user_menu_messages_pagination_last':{
                        eventClickPagination(event_target_id);
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
        await messagesShow(offset);
        page_last = messages.rows.length>0?(Math.ceil(messages.page_header.total_count/messages.page_header.count)):0;
        page_limit = messages.page_header.count;
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_messages_pagination_page').textContent = page; 
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_messages_pagination_page_last').textContent = page_last;
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_messages_pagination_page_total_count').textContent = messages.page_header.total_count;
   };
   return {
       lifecycle:  {onMounted:onMounted},
       data:   null,
       methods:null,
       events:events,
       template: template({icons:{
                            first:props.methods.COMMON.COMMON_DOCUMENT.body.classList.contains('rtl')?
                                    props.methods.COMMON.commonGlobalGet('ICONS')['last']:
                                        props.methods.COMMON.commonGlobalGet('ICONS')['first'],
                            previous:props.methods.COMMON.COMMON_DOCUMENT.body.classList.contains('rtl')?
                                        props.methods.COMMON.commonGlobalGet('ICONS')['next']:
                                            props.methods.COMMON.commonGlobalGet('ICONS')['previous'],
                            next:props.methods.COMMON.COMMON_DOCUMENT.body.classList.contains('rtl')?
                                        props.methods.COMMON.commonGlobalGet('ICONS')['previous']:
                                            props.methods.COMMON.commonGlobalGet('ICONS')['next'],
                            last:props.methods.COMMON.COMMON_DOCUMENT.body.classList.contains('rtl')?
                                    props.methods.COMMON.commonGlobalGet('ICONS')['first']:
                                        props.methods.COMMON.commonGlobalGet('ICONS')['last']}
       })
   };
};
export default component;

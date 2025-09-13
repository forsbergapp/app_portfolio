/**
 * Displays user menu messages
 * @module apps/common/component/common_dialogue_user_menu_messages
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () => ` <div id='common_dialogue_user_menu_messages'>
                                <div id='common_dialogue_user_menu_messages_list'></div>
                                <div id='common_dialogue_user_menu_messages_pagination'>
                                    <div></div>
                                    <div></div>
                                    <div id='common_dialogue_user_menu_messages_pagination_first'       class='common_pagination_first common_icon'></div>
                                    <div id='common_dialogue_user_menu_messages_pagination_previous'    class='common_pagination_previous common_icon'></div>
                                    <div id='common_dialogue_user_menu_messages_pagination_next'        class='common_pagination_next common_icon'></div>
                                    <div id='common_dialogue_user_menu_messages_pagination_last'        class='common_pagination_last common_icon'></div>
                                    <div id='common_dialogue_user_menu_messages_pagination_page'></div>
                                    <div id='common_dialogue_user_menu_messages_pagination_page_last'></div>
                                    <div id='common_dialogue_user_menu_messages_pagination_page_total_count'></div>
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
*                      COMMON:common['CommonModuleCommon']
*                      }}} props
* @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
*                      data:   null,
*                      methods:{eventClickPagination:Function},
*                      template:string}>}
*/
const component = async props => {

    //page navigation values
    let page =      1;
    let page_last=  1;
    let page_limit= 0;
    const offset = 0;
    /**@type{common['MessagesPagination']}*/    
    let messages; 

    /**
     * @description page navigation for messages
     * @param {string} element
     * @returns {Promise.<void>}
     */
    const eventClickPagination = async element =>{
        switch (element){
            case 'common_dialogue_user_menu_messages_pagination_first':{
                page = 1;
                break;
            }
            case 'common_dialogue_user_menu_messages_pagination_previous':{
                if (page - 1 < 1)
                    page = 1;
                else
                    page = page - 1;
                break;
            }
            case 'common_dialogue_user_menu_messages_pagination_next':{
                if (page + 1 > page_last)
                    page = page_last;
                else
                    page = page + 1;
                break;
            }
            case 'common_dialogue_user_menu_messages_pagination_last':{
                page = page_last;
                break;
            }
        }
        await messagesShow((page==1?0:page-1) * page_limit);
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_messages_pagination_page').textContent = page; 
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_messages_pagination_page_last').textContent = page_last;
    };
   
    /**
     * @param {number} offset
     * @returns {Promise.<void>}
     */
    const messagesShow = async (offset) =>{
        /**@type{common['MessagesPagination']}*/    
        messages = await messagesGet(offset);
        await props.methods.COMMON.commonComponentRender({
            mountDiv:'common_dialogue_user_menu_messages_list',
            data:   {
                    messages:   messages
                    },
            methods:null,
            path:'/common/component/common_dialogue_user_menu_message_list.js'});
        //cant check stats on pagination records, call server function that fetches stats for all messages
        props.methods.COMMON.commonUserMessageShowStat();
    };
    
    /**
     * @param {number} offset
     * @returns {Promise.<common['MessagesPagination']>}
     */
    const messagesGet = async offset =>{
        /**@type{common['MessagesPagination']}*/    
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
     * @returns {Promise.<void>}
     */
    const onMounted = async () => {
        await messagesShow(offset);
        page_last = messages.rows.length>0?(Math.ceil(messages.page_header.total_count/messages.page_header.count)):0;
        page_limit = messages.page_header.count;
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_messages_pagination_page').textContent = page; 
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_messages_pagination_page_last').textContent = page_last;
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_messages_pagination_page_total_count').textContent = messages.page_header.total_count;
   };
   return {
       lifecycle:  {onMounted:onMounted},
       data:   null,
       methods:{eventClickPagination:eventClickPagination},
       template: template()
   };
};
export default component;

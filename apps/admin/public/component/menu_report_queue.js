/**
 * Displays report queue
 * @module apps/admin/component/menu_report
 */

/**
 * @import {CommonAppModuleQueue, CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonFFB']} commonFFB
 * @typedef {CommonModuleCommon['commonComponentRender']} commonComponentRender
 */

/**
 * @param {{report_queue:CommonAppModuleQueue[],
 *          function_get_order_by:function}} props
 * @returns {string}
 */
const template = props => ` <div class='menu_report_queue_row'>
                                <div data-column='id' class='menu_report_queue_col list_sort_click list_title common_icon ${props.function_get_order_by('id')}'></div>
                                <div data-column='type' class='menu_report_queue_col list_sort_click list_title common_icon ${props.function_get_order_by('type')}'></div>
                                <div data-column='name' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('name')}'></div>
                                <div data-column='parameters' class='menu_report_queue_col list_sort_click list_title common_icon ${props.function_get_order_by('parameters')}'></div>
                                <div data-column='user' class='menu_report_queue_col list_sort_click list_title common_icon ${props.function_get_order_by('user')}'></div>
                                <div data-column='start' class='menu_report_queue_col list_sort_click list_title common_icon ${props.function_get_order_by('start')}'></div>
                                <div data-column='end' class='menu_report_queue_col list_sort_click list_title common_icon ${props.function_get_order_by('end')}'></div>
                                <div data-column='status' class='menu_report_queue_col list_sort_click list_title common_icon ${props.function_get_order_by('status')}'></div>
                                <div data-column='message' class='menu_report_queue_col list_sort_click list_title common_icon ${props.function_get_order_by('message')}'></div>
                                <div data-column='result' class='menu_report_queue_col list_sort_click list_title common_icon ${props.function_get_order_by('result')}'></div>
                            </div>
                            ${props.report_queue.map(report_queue=>
                                `<div data-changed-record='0' data-user_account_id='${report_queue.id}' class='menu_report_queue_row common_row' >
                                    <div data-column='id' class='menu_report_queue_col list_readonly'>${report_queue.id}</div>
                                    <div data-column='type' class='menu_report_queue_col common_input list_edit' contentEditable='true'>${report_queue.type}</div>
                                    <div data-column='name' class='menu_report_queue_col common_input list_edit' contentEditable='true'>${report_queue.name}</div>
                                    <div data-column='parameters' class='menu_report_queue_col common_input list_edit' contentEditable='true'>${report_queue.parameters ??''}</div>
                                    <div data-column='user' class='menu_report_queue_col common_input list_edit' contentEditable='true'>${report_queue.user ??''}</div>
                                    <div data-column='start' class='menu_report_queue_col common_input list_edit' contentEditable='true'>${report_queue.start ??''}</div>
                                    <div data-column='end' class='menu_report_queue_col common_input list_edit' contentEditable='true'>${report_queue.end ??''}</div>
                                    <div data-column='status' class='menu_report_queue_col common_input list_edit' contentEditable='true'>${report_queue.status}</div>
                                    <div data-column='message' class='menu_report_queue_col common_input list_edit contentEditable='true'>${report_queue.message ??''}</div>
                                    <div data-column='result' class='menu_report_queue_col common_input list_edit' contentEditable='true'>${report_queue.result ?? ''}</div>
                                </div>`
                            ).join('')
                            }`;
/**
* 
* @param {{data:        {
*                       commonMountdiv:string,
*                       sort:string,
*                       order_by:string
*                       },
*          methods:     {
*                       COMMON_DOCUMENT:COMMON_DOCUMENT,
*                       commonFFB:commonFFB
*                       },
*          lifecycle:   null}} props 
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
*                      data:null, 
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {
    /**
     * Get order by if column matches
     * @param {string} column
     */
    const get_order_by = column =>column==props.data.sort?props.data.order_by:'';
    /**@type{CommonAppModuleQueue[]} */
    const report_queue = await props.methods.commonFFB({path:'/app-module-report-queue/', method:'GET', authorization_type:'ADMIN'})
                                .then((/**@type{string}*/result)=>JSON.parse(result));
    
    return {
            lifecycle:   null,
            data:        null,
            methods:     null,
            template:    template({ report_queue:report_queue,
                                    function_get_order_by:get_order_by})
   };
};
export default component;
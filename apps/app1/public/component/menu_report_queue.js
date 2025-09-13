/**
 * Displays report queue
 * @module apps/app1/component/menu_report
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{report_queue:common['CommonAppModuleQueue'][],
 *          function_get_order_by:function,
 *          function_commonMiscRoundOff:common['CommonModuleCommon']['commonMiscRoundOff']}} props
 * @returns {string}
 */
const template = props => ` <div class='menu_report_queue_row'>
                                <div data-column='id' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('id')}'>ID</div>
                                <div data-column='type' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('type')}'>TYPE</div>
                                <div data-column='name' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('name')}'>NAME</div>
                                <div data-column='parameters' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('parameters')}'>PARAMETERS</div>
                                <div data-column='user' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('user')}'>USER</div>
                                <div data-column='start' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('start')}'>START</div>
                                <div data-column='end' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('end')}'>END</div>
                                <div data-column='progress' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('progress')}'>PROGRESS</div>
                                <div data-column='status' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('status')}'>STATUS</div>
                                <div data-column='message' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('message')}'>MESSAGE</div>
                                <div data-column='result' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('result')}'>RESULT</div>
                            </div>
                            ${props.report_queue.map(report_queue=>
                                `<div class='menu_report_queue_row common_row' >
                                    <div data-column='id' class='menu_report_queue_col list_readonly'>${report_queue.id}</div>
                                    <div data-column='type' class='menu_report_queue_col list_readonly'>${report_queue.type}</div>
                                    <div data-column='name' class='menu_report_queue_col list_readonly'>${report_queue.name}</div>
                                    <div data-column='parameters' class='menu_report_queue_col list_readonly'>${report_queue.parameters ??''}</div>
                                    <div data-column='user' class='menu_report_queue_col list_readonly'>${report_queue.user ??''}</div>
                                    <div data-column='start' class='menu_report_queue_col list_readonly'>${report_queue.start ??''}</div>
                                    <div data-column='end' class='menu_report_queue_col list_readonly'>${report_queue.end ??''}</div>
                                    <div data-column='progress' class='menu_report_queue_col list_readonly'>${props.function_commonMiscRoundOff((report_queue.progress ?? 0) * 100)}%</div>
                                    <div data-column='status' class='menu_report_queue_col list_readonly'>${report_queue.status}</div>
                                    <div data-column='message' class='menu_report_queue_col list_readonly'>${report_queue.message ??''}</div>
                                    <div data-id='${report_queue.id}' class='menu_report_queue_col report_queue_result list_readonly common_icon'></div>
                                </div>`
                            ).join('')
                            }`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:        {
 *                       commonMountdiv:string,
 *                       sort:string,
 *                       order_by:string
 *                       },
 *          methods:     {
 *                       COMMON:common['CommonModuleCommon']
 *                       },
 *          lifecycle:   null}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
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
    /**@type{common['CommonAppModuleQueue'][]} */
    const report_queue = await props.methods.COMMON.commonFFB({path:'/app-common-module-report-queue/', method:'GET', authorization_type:'ADMIN'})
                                .then((/**@type{*}*/result)=>JSON.parse(result).rows ?? JSON.parse(result));
    
    return {
            lifecycle:   null,
            data:        null,
            methods:     null,
            template:    template({ report_queue:report_queue,
                                    function_get_order_by:get_order_by,
                                    function_commonMiscRoundOff:props.methods.COMMON.commonMiscRoundOff})
   };
};
export default component;
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
 * @param {{report_queue:common['server']['ORM']['Object']['AppModuleQueue'][],
 *          function_get_order_by:function,
 *          function_commonMiscRoundOff:common['CommonModuleCommon']['commonMiscRoundOff']}} props
 * @returns {string}
 */
const template = props => ` <div class='menu_report_queue_row'>
                                <div data-column='Id' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('Id')}'>ID</div>
                                <div data-column='Type' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('Type')}'>TYPE</div>
                                <div data-column='Name' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('Name')}'>NAME</div>
                                <div data-column='Parameters' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('Parameters')}'>PARAMETERS</div>
                                <div data-column='User' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('User')}'>USER</div>
                                <div data-column='Start' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('Start')}'>START</div>
                                <div data-column='End' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('End')}'>END</div>
                                <div data-column='Progress' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('Progress')}'>PROGRESS</div>
                                <div data-column='Status' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('Status')}'>STATUS</div>
                                <div data-column='Message' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('Message')}'>MESSAGE</div>
                                <div data-column='Result' class='menu_report_queue_col list_sort_click list_title ${props.function_get_order_by('Result')}'>RESULT</div>
                            </div>
                            ${props.report_queue.map(report_queue=>
                                `<div class='menu_report_queue_row common_row' >
                                    <div data-column='Id' class='menu_report_queue_col list_readonly'>${report_queue.Id}</div>
                                    <div data-column='Type' class='menu_report_queue_col list_readonly'>${report_queue.Type}</div>
                                    <div data-column='Name' class='menu_report_queue_col list_readonly'>${report_queue.Name}</div>
                                    <div data-column='Parameters' class='menu_report_queue_col list_readonly'>${report_queue.Parameters ??''}</div>
                                    <div data-column='User' class='menu_report_queue_col list_readonly'>${report_queue.User ??''}</div>
                                    <div data-column='Start' class='menu_report_queue_col list_readonly'>${report_queue.Start ??''}</div>
                                    <div data-column='End' class='menu_report_queue_col list_readonly'>${report_queue.End ??''}</div>
                                    <div data-column='Progress' class='menu_report_queue_col list_readonly'>${props.function_commonMiscRoundOff((report_queue.Progress ?? 0) * 100)}%</div>
                                    <div data-column='Status' class='menu_report_queue_col list_readonly'>${report_queue.Status}</div>
                                    <div data-column='Message' class='menu_report_queue_col list_readonly'>${report_queue.Message ??''}</div>
                                    <div data-id='${report_queue.Id}' class='menu_report_queue_col report_queue_result list_readonly common_icon common_icon_list'></div>
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
    /**@type{common['server']['ORM']['Object']['AppModuleQueue'][]} */
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
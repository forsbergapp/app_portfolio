/**
 * Displays reports and report queue
 * @module apps/app1/component/menu_report
 */

/**
 * @import {CommonAppModuleWithMetadata, CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () => ` <div id='menu_report_content_widget1' class='widget'>
                                <div id='menu_report_select_report'></div>
                                <div id='menu_report_metadata' class='common_list_scrollbar'></div>
                                <div id='menu_report_run' class='common_dialogue_button common_icon' ></div>
                            </div>
                            <div id='menu_report_content_widget2' class='widget'>
                                <div id='menu_report_queue_reload' class='common_dialogue_button common_icon' ></div>
                                <div id='menu_report_queue' class='common_list_scrollbar'></div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function 
 * @param {{data:        {commonMountdiv:string},
 *          methods:     {
 *                       COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       commonComponentRender:CommonModuleCommon['commonComponentRender'],
 *                       commonFFB:CommonModuleCommon['commonFFB'],
 *                       commonMiscRoundOff:CommonModuleCommon['commonMiscRoundOff']
 *                       },
 *          lifecycle:   null}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:{    updateMetadata:function, 
 *                                   reportRun:function,
 *                                   reportQueueUpdate:function,
 *                                   reportPreview:function},
 *                      template:string}>}
 */
const component = async props => {
    
    /**@type{CommonAppModuleWithMetadata[]} */
    const reports = await props.methods.commonFFB({path:'/app-common-module-metadata/', query:'type=REPORT',method:'GET', authorization_type:'ADMIN'})
                                .then((/**@type{*}*/result)=>JSON.parse(result).rows ?? JSON.parse(result));
    /**
     * Updates reports metadata
     */
    const updateMetadata = async ()=>{
        await props.methods.commonComponentRender({mountDiv:'menu_report_metadata',
            data:{
                report_description:JSON.parse(props.methods.COMMON_DOCUMENT.querySelector('#menu_report_select_report .common_select_dropdown_value').getAttribute('data-value')).common_description,
                report_metadata:JSON.parse(props.methods.COMMON_DOCUMENT.querySelector('#menu_report_select_report .common_select_dropdown_value').getAttribute('data-value')).common_metadata
                },
            methods:null,
            path:'/component/menu_report_metadata.js'});
    };
    /**
     * Submits report that runs in the queue
     */
    const reportRun =async ()=>{
        const parameters = Array.from(props.methods.COMMON_DOCUMENT.querySelectorAll('.menu_report_metadata_row')).map((/**@type{HTMLElement}*/element) => {
            return element.getAttribute('data-parameter') + '=' + element.querySelector('.menu_report_metadata_col2')?.textContent;
        }).join('&');
        const report_id = JSON.parse(props.methods.COMMON_DOCUMENT.querySelector('#menu_report_select_report .common_select_dropdown_value').getAttribute('data-value')).id;
        await props.methods.commonFFB({path:`/app-common-module-report-queue/${report_id}`, body:{ps:'A4', report_parameters:parameters},method:'POST', authorization_type:'ADMIN', spinner_id:'menu_report_run'});
        reportQueueUpdate();        
    };
    /**
     * Updates report queue
     */
    const reportQueueUpdate = ()=>{
        props.methods.commonComponentRender({mountDiv:'menu_report_queue',
            data:   {
                    sort:null,
                    order_by:null
                    },
            methods:{
                    commonFFB:props.methods.commonFFB,
                    commonMiscRoundOff:props.methods.commonMiscRoundOff
                    },
            path:'/component/menu_report_queue.js'});
    };
    /**
     * Previews result from selected report queue id
     * @param {number} id
     */
    const reportPreview = id =>{
        props.methods.commonComponentRender({
            mountDiv:   'common_window_info',
            data:       {
                        info:'URL',
                        class:'A4',
                        path:`/app-common-module-report-queue-result/${id}`,
                        method:'GET',
                        body:null,
                        authorization:'ADMIN'
                        },
            methods:    {commonFFB:props.methods.commonFFB},
            path:       '/common/component/common_window_info.js'});
    };
    const onMounted = async () =>{
        //mount select
        await props.methods.commonComponentRender({mountDiv:'menu_report_select_report',
            data:{
                default_value:reports[0].common_name,
                default_data_value:JSON.stringify(reports[0]),
                options:reports.map(row=>{return{value:JSON.stringify(row), text:row.common_name};}),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text'
                },
            methods:null,
            path:'/common/component/common_select.js'});
        updateMetadata();
        reportQueueUpdate();
        
    };                                                            
    return {
            lifecycle:   {onMounted:onMounted},
            data:        null,
            methods:     {  updateMetadata:updateMetadata,
                            reportRun:reportRun,
                            reportQueueUpdate:reportQueueUpdate,
                            reportPreview:reportPreview},
            template:    template()
   };
};
export default component;
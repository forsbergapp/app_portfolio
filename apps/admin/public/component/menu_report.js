/**
 * Displays reports and report queue
 * @module apps/admin/component/menu_report
 */

/**
 * @import {CommonAppModuleWithMetadata, CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonFFB']} commonFFB
 * @typedef {CommonModuleCommon['commonComponentRender']} commonComponentRender
 */

/**
 * @returns {string}
 */
const template = () => ` <div id='menu_report_content_widget1' class='widget'>
                                <div id='menu_report_select_report'></div>
                                <div id='menu_report_metadata' class='common_list_scrollbar'></div>
                                <div id='menu_report_run' class='common_dialogue_button button_save common_icon' ></div>
                            </div>
                            <div id='menu_report_content_widget2' class='widget'>
                                <div id='menu_report_queue' class='common_list_scrollbar'></div>
                            </div>`;
/**
* 
* @param {{data:        {commonMountdiv:string},
*          methods:     {
*                       COMMON_DOCUMENT:COMMON_DOCUMENT,
*                       commonComponentRender:commonComponentRender,
*                       commonFFB:commonFFB
*                       },
*          lifecycle:   null}} props 
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
*                      data:null, 
*                      methods:{updateMetadata:function, reportRun:function},
*                      template:string}>}
*/
const component = async props => {
    
    /**@type{CommonAppModuleWithMetadata[]} */
    const reports = await props.methods.commonFFB({path:'/app-module-metadata/', query:'type=REPORT',method:'GET', authorization_type:'ADMIN'})
                                .then((/**@type{string}*/result)=>JSON.parse(result));
    /**
     * Updates reports metadata
     */
    const updateMetadata = async ()=>{
        await props.methods.commonComponentRender({mountDiv:'menu_report_metadata',
            data:{
                report_metadata:JSON.parse(props.methods.COMMON_DOCUMENT.querySelector('#menu_report_select_report .common_select_dropdown_value').getAttribute('data-value')).common_metadata
                },
            methods:null,
            path:'/component/menu_report_metadata.js'});
    };
    const reportRun =()=>{
        null;
        //create record in queue
        //run report
    };
    const onMounted = async () =>{
        //mount select
        await props.methods.commonComponentRender({mountDiv:'menu_report_select_report',
            data:{
                default_value:reports[0].common_name,
                default_data_value:JSON.stringify(reports[0]),
                options:reports.map(row=>{return{value:JSON.stringify(reports[0]), text:row.common_name};}),
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
        await props.methods.commonComponentRender({mountDiv:'menu_report_queue',
            data:{
                sort:null,
                ordeR_by:null},
            methods:{commonFFB:props.methods.commonFFB},
            path:'/component/menu_report_queue.js'});
    };                                                            
    return {
            lifecycle:   {onMounted:onMounted},
            data:        null,
            methods:     {updateMetadata:updateMetadata,reportRun:reportRun},
            template:    template()
   };
};
export default component;
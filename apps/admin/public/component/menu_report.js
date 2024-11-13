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
                                <div id='menu_report_parameter' class='common_list_scrollbar'></div>
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
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {
    
    /**@type{CommonAppModuleWithMetadata[]} */
    const reports = await props.methods.commonFFB({path:'/app-module-metadata/', query:'type=REPORT',method:'GET', authorization_type:'ADMIN'})
                                .then((/**@type{string}*/result)=>JSON.parse(result));
    const onMounted = async () =>{
        //mount select
        await props.methods.commonComponentRender({mountDiv:'menu_report_select_report',
            data:{
                default_value:reports[0].common_name,
                default_data_value:reports[0].id,
                options:reports,
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'id',
                column_text:'common_name'
                },
            methods:null,
            path:'/common/component/common_select.js'});
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
            methods:     null,
            template:    template()
   };
};
export default component;
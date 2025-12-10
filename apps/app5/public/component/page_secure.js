/**
 * Displays page secure
 * @module apps/app5/component/page_secure
 */
/**
 * @import {common}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{customer:[]}} props 
 * @returns {string}
 */
const template = props => ` <div id='app_page_secure'>
                                ${props.customer.length>0?
                                    `
                                    <div id='app_page_secure_nav'>
                                        <div id='tab1' class='app_page_secure_tab common_link common_icon'></div>
                                        <div id='tab2' class='app_page_secure_tab common_link common_icon'></div>
                                        <div id='tab3' class='app_page_secure_tab common_link common_icon'></div>
                                    </div>
                                    <div id='app_page_secure_tab_content' class='app_bank_div' >
                                    </div>
                                    `:
                                    `
                                    <div id='app_page_secure_nav'>
                                        <div id='tab0' class='app_page_secure_tab common_link common_icon'></div>
                                    </div>
                                    <div id='app_page_secure_tab_content' class='app_bank_div' >
                                    </div>
                                    `
                                }
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_id:number,
 *                      common_app_id:number,
 *                      iam_user_id:number},
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon'],
 *                      button_post:function
 *                      }}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const customer = await props.methods.COMMON.commonFFB({path:'/app-common-module/CUSTOMER_GET', 
                                                    method:'POST', 
                                                    authorization_type:'APP_ACCESS', 
                                                    body:{  type:'FUNCTION',
                                                            IAM_iam_user_id:props.data.iam_user_id,
                                                            IAM_data_app_id:props.data.app_id}})
                        .then((/**@type{string}*/result)=>JSON.parse(result));

    /**
     * @description Get customer type and country from lov
      * @param{{id:*, value:*}} record
     */
    const getLovData = record =>{
        const lov = props.methods.COMMON.COMMON_DOCUMENT
                        .querySelector('#common_app_dialogues_lov_list')
                        .getAttribute('data-lov');
        if (['COUNTRY', 'CUSTOMER_TYPE'].includes(lov))
            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#app_page_secure_tab_content [data-value=${lov=='COUNTRY'?'Country':'CustomerType'}]`).textContent = 
                record.value;
    };

    const onMounted = async () =>{
        
        if (customer.rows.length>0)
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#tab1').click();
        else{
            await props.methods.COMMON.commonComponentRender({
                mountDiv:   'app_page_secure_tab_content',
                data:       {
                            app_id:props.data.app_id,
                            common_app_id:props.data.common_app_id,
                            display_type:'VERTICAL_KEY_VALUE',
                            lov:[	{lov:'CUSTOMER_TYPE', 	lov_functionData:null, lov_functionRow:getLovData}, 
                                    {lov:'COUNTRY', 		lov_functionData:null, lov_functionRow:getLovData}],
                            master_path:'/app-common-module/COMMON_APP_DATA_METADATA',
                            master_query:'fields=Document',
                            master_body:{   type:'FUNCTION',
                                            IAM_module_app_id:props.data.common_app_id,
                                            IAM_data_app_id:props.data.app_id, 
                                            resource_name:'CUSTOMER'},
                            master_method:'POST',
                            master_token_type:'APP_ID',
                            master_resource:'CUSTOMER',
                            detail_path:null,
                            detail_query:null,
                            detail_method:null,
                            detail_token_type:null,
                            detail_class:null,
                            new_resource:true,
                            mode:'EDIT',
                            button_print: false,
                            button_update: false,
                            button_post: true,
                            button_delete: false
                            },
                methods:    {
                            button_print:null,
                            button_update:null,
                            button_post:props.methods.button_post,
                            button_delete:null},
                path:       '/common/component/common_app_data_display.js'});
        }
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({customer:customer.rows})
    };
};
export default component;
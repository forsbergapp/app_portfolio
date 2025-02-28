/**
 * Displays page secure
 * @module apps/app5/component/page_secure
 */
/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
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
 *                      iam_user_id:number,
 *                      timezone:string,
 *                      locale:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      button_post:function,
 *                      commonComponentRender:CommonModuleCommon['commonComponentRender'],
 *                      commonFFB:CommonModuleCommon['commonFFB']
 *                      }}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const customer = await props.methods.commonFFB({path:'/appmodule/CUSTOMER_GET', method:'POST', authorization_type:'APP_ACCESS', body:{type:'FUNCTION',IAM_iam_user_id:props.data.iam_user_id,IAM_data_app_id:props.data.app_id}})
                        .then((/**@type{string}*/result)=>JSON.parse(result));

    const onMounted = async () =>{
        
        if (customer.rows.length>0)
            props.methods.COMMON_DOCUMENT.querySelector('#tab1').click();
        else{
            props.methods.commonComponentRender({
                mountDiv:   'app_page_secure_tab_content',
                data:       {
                            app_id:props.data.app_id,
                            display_type:'VERTICAL_KEY_VALUE',
                            master_path:'/appmodule/CUSTOMER_METADATA',
                            master_query:'fields=json_data',
                            master_body:{type:'FUNCTION',data_app_id:props.data.app_id},
                            master_method:'POST',
                            master_token_type:'APP_ID',
                            master_resource:'CUSTOMER_METADATA',
                            detail_path:null,
                            detail_query:null,
                            detail_method:null,
                            detail_token_type:null,
                            detail_class:null,
                            new_resource:true,
                            mode:'EDIT',
                            timezone:props.data.timezone,
                            locale:props.data.locale,
                            button_print: false,
                            button_update: false,
                            button_post: true,
                            button_delete: false
                            },
                methods:    {
                           commonFFB:props.methods.commonFFB,
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
/**
 * Displays page secure
 * @module apps/app5/component/page_secure
 */
/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonComponentRender']} commonComponentRender
 * @typedef {CommonModuleCommon['commonFFB']} commonFFB
 */
/**
 *  
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
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_id:number,
 *                      user_account_id:number,
 *                      timezone:string,
 *                      locale:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      button_post:function,
 *                      commonComponentRender:commonComponentRender,
 *                      commonFFB:commonFFB
 *                      }}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const customer = await props.methods.commonFFB({path:'/app-module-function/CUSTOMER_GET', method:'POST', authorization_type:'APP_ACCESS', body:{user_account_id:props.data.user_account_id,data_app_id:props.data.app_id}})
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
                            master_path:'/app-module-function/CUSTOMER_METADATA',
                            master_query:'fields=json_data',
                            master_body:{data_app_id:props.data.app_id},
                            master_method:'POST',
                            master_token_type:'APP_DATA',
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
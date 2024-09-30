/**
 * @module apps/app5/component/page_secure
 */

/**
 *  
 * @param {{spinner:string,
 *          customer:[]}} props 
 * @returns 
 */
const template = props => ` <div id='app_page_secure'>
                                ${props.customer.length>0?
                                    `
                                    <div id='app_page_secure_nav'>
                                        <div id='tab1' class='app_page_secure_tab common_link common_icon'></div>
                                        <div id='tab2' class='app_page_secure_tab common_link common_icon'></div>
                                        <div id='tab3' class='app_page_secure_tab common_link common_icon'></div>
                                    </div>
                                    <div id='app_page_secure_tab_content' class='app_bank_div ${props.spinner}' >
                                    </div>
                                    `:
                                    `
                                    <div id='app_page_secure_nav'>
                                        <div id='tab0' class='app_page_secure_tab common_link common_icon'></div>
                                    </div>
                                    <div id='app_page_secure_tab_content' class='app_bank_div ${props.spinner}' >
                                    </div>
                                    `
                                }
                            </div>`;
/**
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      app_id:number,
 *                      user_account_id:number,
 *                      timezone:string,
 *                      locale:string},
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      button_post:function,
 *                      ComponentRender:import('../../../common_types.js').CommonModuleCommon['ComponentRender'],
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB']
 *                      }}} props 
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const onMounted = async () =>{
        const customer = await props.methods.FFB('/app-function/CUSTOMER_GET', null, 'POST', 'APP_ACCESS', {user_account_id:props.data.user_account_id,data_app_id:props.data.app_id})
                                            .then((/**@type{string}*/result)=>JSON.parse(result))
                                            .catch((/**@type{Error}*/error)=>{throw error;});
        
        props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = template({  spinner:'', customer:customer.rows});
        if (customer.rows.length>0)
            props.methods.common_document.querySelector('#tab1').click();
        else{
            props.methods.ComponentRender({
                mountDiv:   'app_page_secure_tab_content',
                data:       {
                            app_id:props.data.app_id,
                            display_type:'VERTICAL_KEY_VALUE',
                            master_path:'/app-function/CUSTOMER_METADATA',
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
                            FFB:props.methods.FFB,
                            button_print:null,
                            button_update:null,
                            button_post:props.methods.button_post,
                            button_delete:null},
                path:       '/common/component/common_app_data_display.js'});
        }
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({spinner:'css_spinner', customer:[]})
    };
};
export default component;
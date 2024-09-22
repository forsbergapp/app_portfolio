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
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          app_id:number,
 *          user_account_id:number,
 *          timezone:string,
 *          locale:string,
 *          function_button_post:function,
 *          function_ComponentRender:function,
 *          function_FFB:function}} props,
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    const post_component = async () =>{
        const customer = await props.function_FFB('/app-function/CUSTOMER_GET', null, 'POST', 'APP_ACCESS', {user_account_id:props.user_account_id,data_app_id:props.app_id})
                                            .then((/**@type{string}*/result)=>JSON.parse(result))
                                            .catch((/**@type{Error}*/error)=>{throw error;});
        
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = template({  spinner:'', customer:customer.rows});
        if (customer.rows.length>0)
            props.common_document.querySelector('#tab1').click();
        else{
            props.function_ComponentRender('app_page_secure_tab_content', 
                                            {
                                                app_id:props.app_id,
                                                display_type:'VERTICAL_KEY_VALUE',
                                                master_path:'/app-function/CUSTOMER_METADATA',
                                                master_query:'fields=json_data',
                                                master_body:{data_app_id:props.app_id},
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
                                                timezone:props.timezone,
                                                locale:props.locale,
                                                button_print: false,
                                                button_update: false,
                                                button_post: true,
                                                button_delete: false,
                                                function_FFB:props.function_FFB,
                                                function_button_print:null,
                                                function_button_update:null,
                                                function_button_post:props.function_button_post,
                                                function_button_delete:null
                                            }, '/common/component/app_data_display.js');
        }
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template({spinner:'css_spinner', customer:[]})
    };
};
export default component;
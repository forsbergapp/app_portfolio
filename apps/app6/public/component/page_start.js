/**
 * @module apps/app6/component/page_start
 */

/**
 * @returns {string}
 */
const template = () => ` <div id='app_page_start_shop' class='app_page_start_shop app_shop_div'>
                            </div>`;
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          app_id:number,
 *          timezone:string,
 *          locale:string,
 *          function_pay:function,
 *          function_FFB:function,
 *          function_ComponentRender:function,
 *          function_show_message:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    
    /**
     * @returns {string}
     */
    const render_template = () =>{
        return template();
    };
    
    const post_component = async () =>{
        await props.function_ComponentRender('app_page_start_shop', 
                                            {
                                                app_id:props.app_id,
                                                display_type:'MASTER_DETAIL_VERTICAL',
                                                master_path:'/app-function/PRODUCT_GET',
                                                master_query:'fields=name,image,description,sku,stock',
                                                master_body:{data_app_id:props.app_id, resource_id : 6000},
                                                master_method:'POST',
                                                master_token_type:'APP_DATA',
                                                master_resource:'PRODUCT_METADATA',
                                                detail_path:'/app-function/PRODUCT_GET',
                                                detail_query:'fields=attributes',
                                                detail_body:{data_app_id:props.app_id, resource_id : 6000},
                                                detail_method:'POST',
                                                detail_token_type:'APP_DATA',
                                                detail_class:null,
                                                new_resource:false,
                                                mode:'READ',
                                                timezone:props.timezone,
                                                locale:props.locale,
                                                button_print: false,
                                                button_update: false,
                                                button_post: true,
                                                button_delete: false,
                                                function_FFB:props.function_FFB,
                                                function_button_print:null,
                                                function_button_update:null,
                                                function_button_post:props.function_pay,
                                                function_button_delete:null,
                                            }, '/common/component/app_data_display.js');
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template()
    };
};
export default component;
/**@type{import('../../../types.js').AppDocument} */
const AppDocument = document;
/**
 * @returns {string}
 */
const template = () => ` <div id='app_page_start_shop' class='app_page_start_shop app_shop_div'>
                            </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          app_id:number,
 *          timezone:string,
 *          locale:string,
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
    }
    /**
     * Pay product
     */
    const pay = () =>{
        props.function_show_message('INFO',null,null,null, 'Payed!')
    }
    const post_component = () =>{
        props.function_ComponentRender('app_page_start_shop', 
                                            {
                                                app_id:props.app_id,
                                                display_type:'VERTICAL_KEY_VALUE',
                                                master_path:'/server-db/app_data_resource_master/',
                                                master_query:`resource_name=PRODUCT&data_app_id=${props.app_id}&fields=name`,
                                                master_method:'GET',
                                                master_token_type:'APP_DATA',
                                                master_resource:'PRODUCT_METADATA',
                                                detail_path:null,
                                                detail_query:null,
                                                detail_method:null,
                                                detail_token_type:null,
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
                                                function_button_post:pay,
                                                function_button_delete:null
                                            }, '/common/component/app_data_display.js');
    }
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template()
    };
}
export default component;
/**
 * @module apps/app6/component/page_start
 */

/**
 * @returns {string}
 */
const template = () => `<div id='app_page_start_shop' class='app_page_start_shop app_shop_div'>
                        </div>`;
/**
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_id:number,
 *                      timezone:string,
 *                      locale:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
 *                      pay:function,
 *                      commonFFB:import('../../../common_types.js').CommonModuleCommon['commonFFB'],
 *                      commonComponentRender:import('../../../common_types.js').CommonModuleCommon['commonComponentRender'],
 *                      commonMessageShow:function}}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
      
    const onMounted = async () =>{
        await props.methods.commonComponentRender({
            mountDiv:   'app_page_start_shop', 
            data:       {
                        app_id:props.data.app_id,
                        display_type:'MASTER_DETAIL_VERTICAL',
                        master_path:'/app-function/PRODUCT_GET',
                        master_query:'fields=name,image,description,sku,stock',
                        master_body:{data_app_id:props.data.app_id, resource_id : 6000},
                        master_method:'POST',
                        master_token_type:'APP_DATA',
                        master_resource:'PRODUCT_METADATA',
                        detail_path:'/app-function/PRODUCT_GET',
                        detail_query:'fields=attributes',
                        detail_body:{data_app_id:props.data.app_id, resource_id : 6000},
                        detail_method:'POST',
                        detail_token_type:'APP_DATA',
                        detail_class:null,
                        new_resource:false,
                        mode:'READ',
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
                        button_post:props.methods.pay,
                        button_delete:null
                        },
            path:       '/common/component/common_app_data_display.js'});
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;
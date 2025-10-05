/**
 * Displays app
 * @module apps/app6/component/app
 */
/**
 * @import {common}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () =>` <div id='app_top'>
                            <div id='app_top_logo'></div>
                            <div id='app_top_end'></div>
                        </div>
                        <div id='app_main'>
                            <div id='app_main_page'>
                                <div id='app_page_start_shop' class='app_page_start_shop app_shop_div'></div>
                            </div>
                        </div>
                        <div id='app_bottom'>
                            <div id='app_bottom_about'></div>
                        </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      logo:string,
 *                      commonMountdiv:string
 *                      },
 *          methods:    {
 *                      pay:()=>void,
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {

    const onMounted = async () =>{
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#app_top_logo').style.backgroundImage = `url(${props.data.logo})`;
        await props.methods.COMMON.commonComponentRender({
                mountDiv:   'app_page_start_shop', 
                data:       {
                            app_id:props.methods.COMMON.commonGlobalGet('app_id'),
                            common_app_id:props.methods.COMMON.commonGlobalGet('app_common_app_id'),
                            display_type:'MASTER_DETAIL_VERTICAL',
                            master_path:'/app-common-module/PRODUCT_GET',
                            master_query:'fields=Name,Image,Description,Sku,Stock',
                            master_body:{type:'FUNCTION',IAM_data_app_id:props.methods.COMMON.commonGlobalGet('app_id'), resource_id : 6000},
                            master_method:'POST',
                            master_token_type:'APP_ID',
                            master_resource:'PRODUCT_METADATA',
                            detail_path:'/app-common-module/PRODUCT_GET',
                            detail_query:'fields=Attributes',
                            detail_body:{type:'FUNCTION',IAM_data_app_id:props.methods.COMMON.commonGlobalGet('app_id'), resource_id : 6000},
                            detail_method:'POST',
                            detail_token_type:'APP_ID',
                            detail_class:null,
                            new_resource:false,
                            mode:'READ',
                            timezone:props.methods.COMMON.commonGlobalGet('user_timezone'),
                            locale:props.methods.COMMON.commonGlobalGet('user_locale'),
                            button_print: false,
                            button_update: false,
                            button_post: true,
                            button_delete: false
                            },
                methods:    {
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
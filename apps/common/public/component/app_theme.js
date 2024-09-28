/**
 * @module apps/common/component/app_theme
 */

const template = () => '';
/**
 * @param {{data:       {common_mountdiv:string},
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      theme_default_list:import('../../../common_types.js').CommonModuleCommon['theme_default_list'],
 *                      ComponentRender:import('../../../common_types.js').CommonModuleCommon['ComponentRender'],
 *                      app_theme_update:function},
 *          lifecycle:  null}} props
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    
    const post_component = async () =>{
        const themes = props.methods.theme_default_list();
        await props.methods.ComponentRender({
            mountDiv:   props.data.common_mountdiv, 
            data:       {
                        default_data_value:themes[0].VALUE,
                        default_value:themes[0].TEXT,
                        options:themes,
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'VALUE',
                        column_text:'TEXT'
                        },
            methods:    {FFB:null},
            lifecycle:  null,
            path:       '/common/component/select.js'});
        //set app theme
        props.methods.app_theme_update();
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template()
    };
};
export default component;
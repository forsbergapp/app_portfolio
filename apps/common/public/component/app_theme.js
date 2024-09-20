/**
 * @module apps/common/component/app_theme
 */

const template ='';
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          function_theme_default_list:function,
 *          function_ComponentRender:function,
 *          function_app_theme_update:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    
    const render_template = () =>{
        return template;
    };
    const post_component = async () =>{
        const themes = props.function_theme_default_list();
        await props.function_ComponentRender(props.common_mountdiv, 
            {
              default_data_value:themes[0].VALUE,
              default_value:themes[0].TEXT,
              options:themes,
              path:null,
              query:null,
              method:null,
              authorization_type:null,
              column_value:'VALUE',
              column_text:'TEXT',
              function_FFB:null
            }, '/common/component/select.js');
        //set app theme
        props.function_app_theme_update();
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template()
    };
};
export default component;
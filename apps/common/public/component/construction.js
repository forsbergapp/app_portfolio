/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id='common_construction' class='common_icon'></div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          function_app_theme_update:function}} props 
 * @returns {Promise.<{ props:{function_post:function|null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    
    const render_template = async () =>{
        return template;
    }
    const post_component = () =>{
        //set app theme
        props.function_app_theme_update();
    }
    return {
        props:  {function_post:post_component},
        data:   null,
        template: await render_template()
    };
}
export default component;
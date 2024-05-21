/**@type{import('../../../types.js').AppDocument} */
const AppDocument = document;
const template =`   <div id='common_construction' class='common_icon'></div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          function_app_theme_update:function}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    
    const render_template = async () =>{
        return template;
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: await render_template()
    };
}
export default component;
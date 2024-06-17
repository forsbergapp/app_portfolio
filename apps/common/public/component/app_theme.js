const template =`   <select id='common_dialogue_user_menu_app_select_theme'>
                        <option value='1'>Light</option>
                        <option value='2'>Dark</option>
                        <option value='3'>Caffè Latte</option>
                    </select>`;
/**
 * 
 * @param {{common_document:import('../../../types.js').AppDocument,
 *          common_mountdiv:string,
 *          function_app_theme_update:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    
    const render_template = async () =>{
        return template;
    };
    const post_component = async () =>{
        //set app theme
        props.function_app_theme_update();
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: await render_template()
    };
};
export default component;
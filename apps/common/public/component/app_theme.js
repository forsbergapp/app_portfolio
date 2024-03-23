const template =`   <select id='common_dialogue_user_menu_app_select_theme'>
                        <option value='1' selected='selected'>Light</option>
                        <option value='2'>Dark</option>
                        <option value='3'>Caffè Latte</option>
                    </select>`;
/**
 * 
 * @param {*} props 
 * @returns {Promise.<{ props:{function_post:function|null}, 
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
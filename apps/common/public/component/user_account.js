const template =`   <div id='common_user_menu'>
                        <div id='common_user_menu_logged_in'>
                            <div id='common_user_menu_avatar'>
                                <img id='common_user_menu_avatar_img' src='' alt=''>
                            </div>
                        </div>
                        <div id='common_user_menu_logged_out'>
                            <div id='common_user_menu_default_avatar' class='common_icon'></div>
                        </div>
                    </div>`;
/**
 * 
 * @param {*} props 
 * @returns {Promise.<{ props:{function_post:function|null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    
    const render_template = () =>{
        return template;
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default component;
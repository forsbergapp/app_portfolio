/**
 * @module apps/common/component/user_account
 */
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
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    const render_template = () =>{
        return template;
    };
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
};
export default component;
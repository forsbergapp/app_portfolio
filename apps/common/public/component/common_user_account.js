/**
 * @module apps/common/component/common_user_account
 */
const template = () =>` <div id='common_user_menu'>
                            <div id='common_user_menu_logged_in'>
                                <div id='common_user_menu_avatar'>
                                    <div id='common_user_menu_avatar_img' class='common_image common_image_avatar'></div>
                                </div>
                            </div>
                            <div id='common_user_menu_logged_out'>
                                <div id='common_user_menu_default_avatar' class='common_icon'></div>
                            </div>
                        </div>`;
/**
 * 
 * @param {{data:       {common_mountdiv:string},
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument}}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;
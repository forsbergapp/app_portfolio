/**
 * @module apps/app2/component/settings_tab_nav_7
 */
/**
 * @param {{avatar:string|null}} props
 */
const template = props => `<div id='user_setting_avatar_img' class='common_image' style='background-image=url(${props.avatar?props.avatar:''})'></div>`;
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          avatar:string|null}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    return {
        props:  {function_post:null},
        data:   null,
        template: template({avatar:props.avatar})
    };
};
export default method;
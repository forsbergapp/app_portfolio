/**
 * @module apps/app2/component/settings_tab_nav_7
 */
/**
 * @param {{avatar:string|null}} props
 */
const template = props => `<div id='user_setting_avatar_img' class='common_image' style='background-image=url(${props.avatar?props.avatar:''})'></div>`;
/**
 * 
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      avatar:string|null
 *                      },
 *          methods:    {COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT}}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:null,
 *                      methods:null, 
 *                      template:string}>}
 */
const method = async props => {
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({avatar:props.data.avatar})
    };
};
export default method;
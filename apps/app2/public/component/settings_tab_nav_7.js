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
 *                      common_mountdiv:string,
 *                      avatar:string|null
 *                      },
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument},
 *          lifecycle:  null}} props
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycleReturn, 
 *                      data:null,
 *                      methods:null, 
 *                      template:string}>}
 */
const method = async props => {
    return {
        lifecycle:  {onMounted:null},
        data:   null,
        methods:null,
        template: template({avatar:props.data.avatar})
    };
};
export default method;
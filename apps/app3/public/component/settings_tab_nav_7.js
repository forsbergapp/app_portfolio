/**
 * Settings tab 7 avatar
 * @module apps/app2/component/settings_tab_nav_7
 */
/**
 * @import {COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @param {{avatar:string|null}} props
 * @returns {string}
 */
const template = props => `<div id='user_setting_avatar_img' class='common_image' style='background-image:url(${props.avatar?props.avatar:''})'></div>`;
/**
 * 
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      avatar:string|null
 *                      },
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT}}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
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
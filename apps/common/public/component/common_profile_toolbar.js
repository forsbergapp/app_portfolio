/**
 * Displays profile toolbar
 * @module apps/common/component/common_profile_toolbar
 */

/**
 * @import {COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () => ' <div id=\'common_profile_btn_top\' class=\'common_toolbar_button common_icon\' ></div>';
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT}}} props  
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
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
/**
 * @module apps/common/component/profile_toolbar
 */

const template = () => ' <div id=\'common_profile_btn_top\' class=\'common_toolbar_button common_icon\' ></div>';
/**
 * 
 * @param {{data:       {common_mountdiv:string},
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument},
 *          lifecycle:  null}} props  
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycleReturn, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        lifecycle:  {onMounted:null},
        data:   null,
        methods:null,
        template: template()
    };
};
export default component;
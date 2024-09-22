/**
 * @module apps/common/component/construction
 */

const template = () => ' <div id=\'common_construction\' class=\'common_icon\'></div>';
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          function_app_theme_update:function}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        props:  {function_post:null},
        data:   null,
        template: template()
    };
};
export default component;
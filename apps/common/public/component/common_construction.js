/**
 * @module apps/common/component/common_construction
 */

const template = () => ' <div class=\'common_construction common_icon\'></div>';
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
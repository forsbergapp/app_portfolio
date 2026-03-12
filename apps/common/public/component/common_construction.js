/**
 * @description Displays construction
 * @module apps/common/component/common_construction
 */

/**
 * @import types_common from '../../../common/types.d.ts'
 */

/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () => ' <div class=\'common_construction common_icon\'></div>';
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON:types_common.CommonModuleCommon}}} props
 * @returns {Promise.<{ lifecycle:types_common.CommonComponentLifecycle, 
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
/**
 * @description Displays app
 * @module apps/app7/component/app
 */
/**
 * @import types_common from '../../../common/types.d.ts'
 */
/**
 * @name temaplte
 * @description Template
 * @returns {string}
 */
const template = () =>' <div id=\'mapid\'></div>';
/**
 * @name component
 * @description Component
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON:types_common.CommonModuleCommon}}} props 
 * @returns {Promise.<{ lifecycle:types_common.CommonComponentLifecycle, 
 *                      data:null, 
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
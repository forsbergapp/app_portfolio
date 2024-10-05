/**
 * @module apps/admin/component/app
 */

const template = () =>' <div id=\'admin_secure\'></div>';
/**
 * 
 * @param {{data:{      commonMountdiv:string},
 *          methods:{   COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT}}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:null, 
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
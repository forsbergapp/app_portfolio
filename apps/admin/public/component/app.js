/**
 * @module apps/admin/component/app
 */

const template = () =>' <div id=\'admin_secure\'></div>';
/**
 * 
 * @param {{data:{      common_mountdiv:string},
 *          methods:{   common_document:import('../../../common_types.js').CommonAppDocument},
 *          lifecycle:  null}} props
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
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
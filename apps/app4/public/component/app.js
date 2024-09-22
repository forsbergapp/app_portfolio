/**
 * @module apps/app4/component/app
 */

const template = () =>' <div id=\'mapid\'></div>';
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string}} props
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
/**
 * @module apps/app1/component/profile_info
 */

const template ='   <div id=\'profile_info_apps\'></div>';
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
    const render_template = () =>{
        return template;
    };
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
};
export default component;
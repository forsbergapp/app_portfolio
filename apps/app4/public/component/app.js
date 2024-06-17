const template ='   <div id=\'mapid\'></div>';
/**
 * 
 * @param {{common_document:import('../../../types.js').AppDocument,
 *          common_mountdiv:string}} props
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    props;
    const render_template = () =>template;
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
};
export default component;
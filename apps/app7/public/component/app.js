/**
 * @module apps/app7/component/app
 */

const template = () =>` <div id='app_main'>
                            <div id='app_main_page'>
                            </div>
                        </div>`;
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
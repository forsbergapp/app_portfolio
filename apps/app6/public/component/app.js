/**
 * @module apps/app6/component/app
 */

const template =`   <div id='app_top'>
                        <div id='app_top_logo'></div>
                        <div id='app_top_end'></div>
                    </div>
                    <div id='app_main'>
                        <div id='app_main_page'></div>
                    </div>
                    <div id='app_bottom'>
                        <div id='app_bottom_about'></div>
                    </div>`;
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
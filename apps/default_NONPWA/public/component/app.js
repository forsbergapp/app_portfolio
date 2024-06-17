const template =`   <div id='dialogue_documents' class='dialogue'>
                        <div id='dialogue_documents_content' class='dialogue_content'>
                            <div id='app_logo'></div>
                            <div id='app_construction'></div>
                        </div>
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
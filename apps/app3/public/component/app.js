/**
 * @module apps/app3/component/app
 */

const template = () =>` <div id='dialogue_documents' class='dialogue'>
                            <div id='dialogue_documents_content' class='dialogue_content'>
                                <div id='doc_list'></div>
                            </div>
                        </div>`;
/**
 * 
 * @param {{data:       {common_mountdiv:string},
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument},
 *          lifecycle:  null}} props 
 * @returns {Promise.<{ lifecycle:{onMounted:null}, 
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
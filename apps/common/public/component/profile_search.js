/**
 * @module apps/common/component/profile_search
 */

const template = () =>` <div id='common_profile_input_row'>
                            <div id='common_profile_search_input' contentEditable='true' class='common_input '/></div>
                            <div id='common_profile_search_icon' class='common_icon'></div>
                        </div>
                        <div id='common_profile_search_list_wrap'></div>`;
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:   null,
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
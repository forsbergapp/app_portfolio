/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id='common_profile_input_row'>
                        <div id='common_profile_search_input' contentEditable='true' class='common_input '/></div>
                        <div id='common_profile_search_icon' class='common_icon'></div>
                    </div>
                    <div id='common_profile_search_list_wrap'></div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    
    const render_template = () =>{
        return template;
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default component;
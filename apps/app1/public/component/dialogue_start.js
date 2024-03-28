/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id='dialogue_start_content' class='dialogue_content'>
                        <div id='start_message' class='common_dialogue_button common_icon' ></div>
                        <div id="apps"></div>    
                    </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
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
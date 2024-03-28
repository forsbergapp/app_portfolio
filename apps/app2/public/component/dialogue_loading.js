/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id='dialogue_loading_content'></div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:function},
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show0');
    props.common_document.querySelector('#dialogues').classList.add('common_dialogues_modal');

    const render_template = () =>{
        return template;
    }
    const post_component = () =>{
        AppDocument.querySelector('#dialogue_loading_content').classList.add('css_spinner');
    }
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template()
    };
}
export default method;
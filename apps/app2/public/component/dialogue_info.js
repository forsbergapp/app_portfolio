/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id='dialogue_info_content' class='dialogue_content'>
                        <div id='about_logo'></div>
                        <div id='app_copyright'></div>
                        <div id='app_link' class='common_link'></div>
                        <div id='info_link1' class='common_link'></div>
                        <div id='info_link2' class='common_link'></div>
                        <div id='info_link3' class='common_link'></div>
                        <div id='info_link4' class='common_link'></div>
                        <div id='info_close' class='common_dialogue_button common_icon' ></div>
                    </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    
    const render_template = () =>{
        return template;
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default method;
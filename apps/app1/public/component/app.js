/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id="theme_background"></div>
                    <div id='dialogues'>
                        <div id='dialogue_start' class='dialogue'></div>
                        <div id='dialogue_info' class='dialogue'></div>
                    </div>
                    <div id='app_profile_toolbar'></div>`;
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
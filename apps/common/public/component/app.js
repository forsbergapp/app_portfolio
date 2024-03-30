/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <script>const dummy = 0;</script>
                    <div id='common_toolbar_framework'>
                        <div id='common_toolbar_framework_js' class='common_icon'></div>
                        <div id='common_toolbar_framework_vue' class='common_icon'></div>
                        <div id='common_toolbar_framework_react' class='common_icon'></div>
                    </div>
                    <div id='common_dialogues'>
                        <div id='common_dialogue_user_start' class='common_dialogue_content'></div>
                        <div id='common_dialogue_user_menu' class='common_dialogue_content'></div>
                        <div id='common_dialogue_user_verify' class='common_dialogue_content'></div>
                        <div id='common_dialogue_user_password_new' class='common_dialogue_content'></div>
                        <div id='common_dialogue_user_edit' class='common_dialogue_content'></div>  
                        <div id='common_dialogue_message' class='common_dialogue_content'></div>
                        <div id='common_dialogue_profile' class='common_dialogue_content'></div>
                        <div id='common_dialogue_lov' class='common_dialogue_content'></div>
                    </div>
                    <div id='common_window_info'></div>
                    <div id='common_broadcast'></div>
                    <div id='common_profile_search'></div>
                    <div id='common_user_account'></div>
                    <div id='common_profile_toolbar'></div>
                    <div id='common_fonts'></div>`;;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:function|null}, 
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
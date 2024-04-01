/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`       <div id='dialogues'>
                            <div id='dialogue_send_broadcast' class='common_dialogue common_dialogue_content'></div>
                        </div>
                        <div id='menu_open' class='common_dialogue_button common_icon'></div>
                        <div id='menu'>
                            <div id='app_user_account'></div>
                            <div id='menu_secure'>
                                <div id='menu_close' class='common_dialogue_button common_icon'></div>
                                <div id='menu_1' class='menuitem common_icon'></div>
                                <div id='menu_2' class='menuitem common_icon'></div>
                                <div id='menu_3' class='menuitem common_icon'></div>
                                <div id='menu_4' class='menuitem common_icon'></div>
                                <div id='menu_5' class='menuitem common_icon'></div>
                                <div id='menu_6' class='menuitem common_icon'></div>
                                <div id='menu_7' class='menuitem common_icon'></div>
                                <div id='menu_8' class='menuitem common_icon'></div>
                                <div id='menu_9' class='menuitem common_icon'></div>
                                <div id='menu_10' class='menuitem common_icon'></div>
                                <div id='menu_11' class='menuitem common_icon'></div>
                            </div>
                        </div>
                        <div id='main'>
                            <div id='menu_1_content' class='main_content'></div>
                            <div id='menu_2_content' class='main_content'></div>
                            <div id='menu_3_content' class='main_content'></div>
                            <div id='menu_4_content' class='main_content'></div>
                            <div id='menu_5_content' class='main_content'></div>
                            <div id='menu_6_content' class='main_content'></div>
                            <div id='menu_7_content' class='main_content'></div>
                            <div id='menu_8_content' class='main_content'></div>
                            <div id='menu_9_content' class='main_content'></div>
                            <div id='menu_10_content' class='main_content'></div>
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
/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id='dialogue_info_content' class='dialogue_content'>
                        <div id='info_message' class='common_dialogue_button common_icon' ></div>
                        <div id='app_page'>
                            <div id='app_menu'>
                                <div id='app_menu_apps' class='common_dialogue_button common_icon'></div>
                                <div id='app_menu_space'></div>
                                <div id='app_menu_info' class='common_dialogue_button common_icon'></div>
                            </div>
                            <div id='app_menu_content'>
                                <div id='app_menu_content_apps'>
                                    <div id='app_menu_content_apps_screenshot'></div>
                                    <div id='app_menu_content_apps_list'></div>
                                </div>
                                <div id='app_menu_content_info'>
                                    <div id='app_portfolio'>
                                        <div id='title1' class='common_icon'></div>
                                        <div id='info_diagram'><img loading='lazy' id='info_diagram_img' src=''/></div>
                                    </div>
                                    <div id='datamodel'>
                                        <div id='title2' class='common_icon'></div>
                                        <div id='info_datamodel'><img loading='lazy' id='info_datamodel_img' src=''/></div>
                                    </div>
                                    <div id='contact'>
                                        <div id='contact_text' class='common_icon'></div>
                                        <div id="app_email" class='common_link'></div>
                                    </div>
                                    <div id='start_links'>
                                        <div id='app_link_row'>
                                            <div id='app_link' class='common_link'></div>
                                        </div>
                                        <div id='info_link_row'>
                                            <div id='info_link1' class='common_link'></div>
                                            <div id='info_link2' class='common_link'></div>
                                            <div id='info_link3' class='common_link'></div>
                                            <div id='info_link4' class='common_link'></div>
                                        </div>
                                    </div>
                                    <div id='app_copyright'></div>
                                </div>
                            </div>
                        </div>
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
/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id='toolbar_top'>
                        <div id='app_user_account'></div>
                        <div id='toolbar_btn_zoomout' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_zoomin' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_left' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_right' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_search' class='common_toolbar_button common_icon'></div>
                    </div>
                    <div id='app_profile_search'></div>
                    <div id='paper'></div>
                    <div id='settings'>
                        <div id='tab_navigation'>
                            <div id='tab_nav_1' class='tab_nav tab_nav_selected common_icon'></div>
                            <div id='tab_nav_2' class='tab_nav common_icon'></div>
                            <div id='tab_nav_3' class='tab_nav common_icon'></div>
                            <div id='tab_nav_4' class='tab_nav common_icon'></div>
                            <div id='tab_nav_5' class='tab_nav common_icon'></div>
                            <div id='tab_nav_6' class='tab_nav common_icon'></div>
                            <div id='tab_nav_7' class='tab_nav common_icon'></div>
                        </div>
                        <div id='tab1' class="tab_content"></div>
                        <div id='tab2' class="tab_content"></div>
                        <div id='tab3' class="tab_content"></div>
                        <div id='tab4' class="tab_content"></div>
                        <div id='tab5' class="tab_content"></div>
                        <div id='tab6' class="tab_content"></div>
                        <div id='tab7' class="tab_content"></div>
                    </div>
                    <div id='dialogues'>
                        <div id='dialogue_loading'></div>
                        <div id='dialogue_info' class='common_dialogue_content'></div>
                        <div id='dialogue_scan_open_mobile' class='common_dialogue_content'></div>
                    </div>
                    <div id='toolbar_bottom'>
                        <div id='toolbar_btn_about' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_print' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_day' class='common_toolbar_button common_icon' ></div>
                        <div id='app_profile_toolbar'></div>
                        <div id='toolbar_btn_month' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_year' class='common_toolbar_button common_icon' ></div>
                        <div id='toolbar_btn_settings' class='common_toolbar_button common_icon'></div>
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
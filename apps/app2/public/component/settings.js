/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id='settings_tab_navigation'>
                        <div id='settings_tab_nav_1' class='settings_tab_nav settings_tab_nav_selected common_icon'></div>
                        <div id='settings_tab_nav_2' class='settings_tab_nav common_icon'></div>
                        <div id='settings_tab_nav_3' class='settings_tab_nav common_icon'></div>
                        <div id='settings_tab_nav_4' class='settings_tab_nav common_icon'></div>
                        <div id='settings_tab_nav_5' class='settings_tab_nav common_icon'></div>
                        <div id='settings_tab_nav_6' class='settings_tab_nav common_icon'></div>
                        <div id='settings_tab_nav_7' class='settings_tab_nav common_icon'></div>
                    </div>
                    <div id='settings_tab1' class="settings_tab_content"></div>
                    <div id='settings_tab2' class="settings_tab_content"></div>
                    <div id='settings_tab3' class="settings_tab_content"></div>
                    <div id='settings_tab4' class="settings_tab_content"></div>
                    <div id='settings_tab5' class="settings_tab_content"></div>
                    <div id='settings_tab6' class="settings_tab_content"></div>
                    <div id='settings_tab7' class="settings_tab_content"></div>`;
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
/**
 * @module apps/admin/component/menu_config
 */
/**
 * Displays config
 * 
 */
const template = () => ` <div id='menu_6_content_widget1' class='widget'>
                            <div id='list_config_nav' class='list_nav'>
                                <div id='list_config_nav_server'        class='list_nav_list list_button common_icon list_nav_selected_tab'></div>
                                <div id='list_config_nav_iam_blockip'   class='list_nav_list list_button common_icon'></div>
                                <div id='list_config_nav_iam_useragent' class='list_nav_list list_button common_icon'></div>
                                <div id='list_config_nav_iam_policy'    class='list_nav_list list_button common_icon'></div>
                            </div>
                            <div id='list_config_container'></div>
                            <div id='config_buttons' class="save_buttons">
                                <div id='config_save' class='common_dialogue_button button_save common_icon' ></div>
                            </div>
                        </div>`;
/**
* 
* @param {{ data:{      common_mountdiv:string},
*           methods:{   common_document:import('../../../common_types.js').CommonAppDocument,
*                       nav_click:import('../js/secure.js').nav_click},
*           lifecycle:  null}} props 
* @returns {Promise.<{ props:{function_post:function}, 
*                      data:null, 
*                      template:string}>}
*/
const component = async props => {
    const post_component = () =>{
        props.methods.nav_click('list_config_nav_server');
    };
 
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template()
    };
};
export default component;
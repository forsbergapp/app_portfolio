/**
 * @module apps/admin/component/menu_users
 */
/**
 * Displays stat of users
*/
const template = () => `<div id='menu_3_content_widget1' class='widget'>
                            <div id='list_user_account_title' class='common_icon'></div>
                            <div class='list_search'>
                                <div id='list_user_account_search_input' contentEditable='true' class='common_input list_search_input'></div>
                                <div id='list_user_search_icon' class='list_search_icon common_icon'></div>
                            </div>
                            <div id='list_user_account' class='common_list_scrollbar'></div>
                        </div>
                        <div id='menu_3_content_widget2' class='widget'>
                            <div id='list_user_account_logon_title' class='common_icon'></div>
                            <div id='list_user_account_logon' class='common_list_scrollbar'></div>
                            <div id='users_buttons' class="save_buttons">
                                <div id='users_save' class='common_dialogue_button button_save common_icon' ></div>
                            </div>
                        </div>` ;
/**
* 
* @param {{ data:{      common_mountdiv:string},
*           methods:{   common_document:import('../../../common_types.js').CommonAppDocument},
*           lifecycle:  null}} props
* @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
*                      data:null, 
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {
    props;
    return {
        lifecycle:  {onMounted:null},
        data:   null,
        methods:null,
        template: template()
};
};
export default component;
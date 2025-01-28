/**
 * Displays stat of users
 * @module apps/app1/component/menu_users
 */

/**
 * @import {COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () => `<div id='menu_users_content_widget1' class='widget'>
                            <div id='menu_users_list_title' class='common_icon'></div>
                            <div class='list_search'>
                                <div id='menu_users_list_search_input' contentEditable='true' class='common_input list_search_input'></div>
                                <div id='menu_users_search_icon' class='list_search_icon common_icon'></div>
                            </div>
                            <div id='menu_users_list' class='common_list_scrollbar'></div>
                        </div>
                        <div id='menu_users_content_widget2' class='widget'>
                            <div id='menu_users_iam_user_login_title' class='common_icon'></div>
                            <div id='menu_users_iam_user_login' class='common_list_scrollbar'></div>
                            <div id='menu_users_buttons' class="save_buttons">
                                <div id='menu_users_save' class='common_dialogue_button button_save common_icon' ></div>
                            </div>
                        </div>` ;
/**
 * @name component
 * @description Component
 * @function 
 * @param {{ data:{      commonMountdiv:string},
 *           methods:{   COMMON_DOCUMENT:COMMON_DOCUMENT},
 *           lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template()
};
};
export default component;
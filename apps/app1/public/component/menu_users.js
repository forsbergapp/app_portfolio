/**
 * Displays stat of users
 * @module apps/app1/component/menu_users
 */

/**
 * @import {common}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{icons:{
 *                 users:string,
 *                 reload:string,
 *                 login:string,
 *                 save:string}}} props
 * @returns {string}
 */
const template = props => `<div id='menu_users_content_widget1' class='widget'>
                            <div id='menu_users_list_title' class='common_icon_title'>${props.icons.users}</div>
                            <div class='list_search'>
                                <div id='menu_users_list_search_input' contentEditable='true' class='common_input list_search_input'></div>
                                <div id='menu_users_search_icon' class='common_link common_icon_list'>${props.icons.reload}</div>
                            </div>
                            <div id='menu_users_list' class='common_list_scrollbar'></div>
                        </div>
                        <div id='menu_users_content_widget2' class='widget'>
                            <div id='menu_users_iam_app_access_title' class='common_icon_title'>${props.icons.login}</div>
                            <div id='menu_users_iam_app_access' class='common_list_scrollbar'></div>
                            <div id='menu_users_buttons' class="save_buttons">
                                <div id='menu_users_save' class='common_app_dialogues_button button_save common_link common_icon_button' >${props.icons.save}</div>
                            </div>
                        </div>` ;
/**
 * @name component
 * @description Component
 * @function 
 * @param {{ data:{      commonMountdiv:string},
 *           methods:{   COMMON:common['CommonModuleCommon']},
 *           lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
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
        template:   template({icons:{
                                    users:props.methods.COMMON.commonGlobalGet('ICONS')['users'],
                                    reload:props.methods.COMMON.commonGlobalGet('ICONS')['reload'],
                                    login:props.methods.COMMON.commonGlobalGet('ICONS')['login'],
                                    save:props.methods.COMMON.commonGlobalGet('ICONS')['save']}
                            })
    };
};
export default component;
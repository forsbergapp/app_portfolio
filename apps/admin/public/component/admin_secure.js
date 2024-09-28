/**
 * @module apps/admin/component/admin_secure
 */

const template = () =>` <div id='dialogues'>
                            <div id='dialogue_send_broadcast' class='common_dialogue common_dialogue_content'></div>
                        </div>
                        <div id='menu_open' class='common_dialogue_button common_icon'></div>
                        <div id='menu'>
                            <div id='app_user_account' class='menuitem'></div>
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
                            <div id='menu_content'></div>
                        </div>`;
/**
 * 
 * @param {{data:{      common_mountdiv:string},
 *          methods:{   common_document:import('../../../common_types.js').CommonAppDocument},
 *          lifecycle:  null}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        props:  {function_post:null},
        data:   null,
        template: template()
    };
};
export default component;
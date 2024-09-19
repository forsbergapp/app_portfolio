/**
 * @module apps/app2/component/profile_info
 */

const template =`   <div id='profile_info_user_settings'>
                        <div id='profile_main_btn_user_settings' class='common_link common_icon'></div>
                    </div>
                    <div id='profile_info_user_setting_likes'>
                        <div id='profile_main_btn_user_setting_likes'>
                            <div id='profile_main_btn_user_setting_likes_user_setting' class='common_link common_icon'></div>
                        </div>
                        <div id='profile_info_user_setting_likes_count'></div>
                    </div>
                    <div id='profile_info_user_setting_liked'>
                        <div id='profile_main_btn_user_setting_liked'>
                            <div id='profile_main_btn_user_setting_liked_user_setting' class='common_link common_icon'></div>
                        </div>
                        <div id='profile_info_user_setting_liked_count'></div>
                    </div>
                    <div id='profile_user_settings_row'>
                        <select id='profile_select_user_settings'>
                        </select>
                        <div id='profile_user_settings_detail'>
                            <div id='profile_user_settings_day' class='common_icon'></div>
                            <div id='profile_user_settings_month' class='common_icon'></div>
                            <div id='profile_user_settings_year' class='common_icon'></div>
                            <div id='profile_user_settings_like'>
                                <div class='common_icon common_unlike common_link'></div>
                                <div class='common_icon common_like common_link'></div>
                            </div>
                            <div id='profile_user_settings_info_likes' class='common_icon'></div>
                            <div id='profile_user_settings_info_likes_count'></div>
                            <div id='profile_user_settings_info_views' class='common_icon'></div>
                            <div id='profile_user_settings_info_views_count'></div>
                        </div>
                    </div>`;
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    props;
    const render_template = () =>{
        return template;
    };
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
};
export default method;
const template =`   <div id='profile_info_user_settings'>
                        <div id='profile_main_btn_user_settings' class='common_link common_icon'></div>
                    </div>
                    <div id='profile_info_user_setting_likes'>
                        <div id='profile_main_btn_user_setting_likes'>
                            <div id='profile_main_btn_user_setting_likes_heart' class='common_link common_like common_icon'></div>
                            <div id='profile_main_btn_user_setting_likes_user_setting' class='common_link common_icon'></div>
                        </div>
                        
                        <div id='profile_info_user_setting_likes_count'></div>
                    </div>
                    <div id='profile_info_user_setting_liked'>
                        <div id='profile_main_btn_user_setting_liked'>
                            <div id='profile_main_btn_user_setting_liked_heart' class='common_link common_like common_icon'></div>
                            <div id='profile_main_btn_user_setting_liked_user_setting' class='common_link common_icon'></div>
                        </div>
                        <div id='profile_info_user_setting_liked_count'></div>
                    </div>
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
                    </div>`;
/**
 * 
 * @param {*} props 
 * @returns {Promise.<void>}
 */
const method = async props => {
    
    const render_template = () =>{
        return template;
    }
    switch (props.common_framework){
        case 2:{
            //Vue
            //Use tempmount div to be able to return pure HTML
            //props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
            //Vue.createApp(...
            //return props.common_document.querySelector('#tempmount').innerHTML;
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template();
        }
        case 3:{
            //React
            //Use tempmount div to be able to return pure HTML
            //props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
            //ReactDOM.createRoot(div... .render( App()
            //return props.common_document.querySelector('#tempmount').innerHTML;
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template();
        }
        case 1:
        default:{
            //Default Javascript
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template();
        }
    }
}
export default method;
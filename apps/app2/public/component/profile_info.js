/**
 * @module apps/app2/component/profile_info
 */
/**
 * @param {{spinner:string}} props
 */
const template = props => ` ${props.spinner==''?
                                `<div id='profile_info_user_settings'>
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
                                    <div id='profile_select_user_settings'></div>
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
                                </div>`:
                                `<div id='profile_info_user_settings' class='${props.spinner}'>
                                 </div>`
                            }
                            `;
/**
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      user_account_id:number|null,
 *                      profile_id:number
 *                      },
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      ComponentRender:import('../../../common_types.js').CommonModuleCommon['ComponentRender'],
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB']},
 *          lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:{onMounted:onMounted}, 
 *                      data:       null,
 *                      methods:    {
 *                                  profile_user_setting_update:       function,
 *                                  profile_show_user_setting_detail:  function,
 *                                  profile_user_setting_stat:         function
 *                                  },
 *                      template:string}>}
 */
const method = async props => {
    /**
     * Profile show user setting detail
     * @param {number} liked 
     * @param {number} count_likes 
     * @param {number} count_views 
     * @returns {void}
     */
    const profile_show_user_setting_detail = (liked, count_likes, count_views) => {
        
        props.methods.common_document.querySelector('#profile_user_settings_like').children[0].style.display = `${liked == 1?'none':'block'}`;
        props.methods.common_document.querySelector('#profile_user_settings_like').children[1].style.display = `${liked == 1?'block':'none'}`;

        props.methods.common_document.querySelector('#profile_user_settings_info_likes_count').innerHTML = count_likes;
        props.methods.common_document.querySelector('#profile_user_settings_info_views_count').innerHTML = count_views;
    };

    /**
     * Profile user setting stat
     * @param {number} id
     * @returns {void}
     */
    const profile_user_setting_stat = id => {
        props.methods.FFB(`/server-db/user_account_app_data_post-profile-stat-like/${id}`, null, 'GET', 'APP_DATA', null)
        .then((/**@type{string}*/result)=>{
            props.methods.common_document.querySelector('#profile_info_user_setting_likes_count').innerHTML = JSON.parse(result)[0].count_user_post_likes;
            props.methods.common_document.querySelector('#profile_info_user_setting_liked_count').innerHTML = JSON.parse(result)[0].count_user_post_liked;
        })
        .catch(()=>null);
    };
    /**
     * @param {number} profile_id
     * @param {number|null} sid
     */
    const profile_user_setting_update = async (profile_id, sid=null) =>{
        /**@type{{value:string, text:string}[]}*/
        const user_settings = await props.methods.FFB(  `/server-db/user_account_app_data_post-profile/${profile_id}`, 
                                                        `id_current_user=${props.data.user_account_id??''}`, 
                                                        'GET', 
                                                        'APP_DATA', null)
                                    .then((/**@type{string}*/result)=>
                                            JSON.parse(result)
                                            .map((/**@type{{id:number, 
                                                            user_account_app_user_account_id:number, 
                                                            liked:number, 
                                                            count_likes:number, 
                                                            count_views:number,
                                                            design_paper_size:string, 
                                                            description:string}}}*/setting)=>{return {  value:JSON.stringify({   
                                                                                                                sid:setting.id, 
                                                                                                                user_account_id:setting.user_account_app_user_account_id, 
                                                                                                                liked:setting.liked,
                                                                                                                count_likes:setting.count_likes,
                                                                                                                count_views:setting.count_views,
                                                                                                                paper_size:setting.design_paper_size,
                                                                                                                description:setting.description}), 
                                                                                                        text:setting.description};}));

        props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = template({spinner:''});
        //show current setting or first setting if showing first time
        await props.methods.ComponentRender({
            mountDiv:   'profile_select_user_settings',
            data:       {
                        default_data_value:   sid?user_settings.filter(setting=>JSON.parse(setting.value).sid == sid)[0].value:user_settings[0].value,
                        default_value:        sid?user_settings.filter(setting=>JSON.parse(setting.value).sid == sid)[0].text:user_settings[0].text,
                        options: user_settings,
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:props.methods.FFB},
            lifecycle:  null,
            path:       '/common/component/common_select.js'});
        
        const profile_select_user_settings = props.methods.common_document.querySelector('#profile_select_user_settings .common_select_dropdown_value').getAttribute('data-value');
        profile_show_user_setting_detail(   JSON.parse(profile_select_user_settings).liked,
                                            JSON.parse(profile_select_user_settings).count_likes,
                                            JSON.parse(profile_select_user_settings).count_views);
        profile_user_setting_stat(profile_id);
    };

    const onMounted = async ()=>{
        await profile_user_setting_update(props.data.profile_id);
    };

    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    {
                    profile_user_setting_update:profile_user_setting_update,
                    profile_show_user_setting_detail:profile_show_user_setting_detail,
                    profile_user_setting_stat:profile_user_setting_stat
                    },
        template:   template({spinner:'css_spinner'})
    };
};
export default method;
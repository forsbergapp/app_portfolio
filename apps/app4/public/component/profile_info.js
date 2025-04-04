/**
 * Profile info
 * @module apps/app4/component/profile_info
 */
/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{setting:boolean}} props
 * @returns {string}
 */
const template = props => ` ${props.setting?
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
                                ''
                            }
                            `;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      iam_user_id:number|null,
 *                      profile_id:number
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonComponentRender:CommonModuleCommon['commonComponentRender'],
 *                      commonFFB:CommonModuleCommon['commonFFB']}}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:       null,
 *                      methods:    {
 *                                  profile_user_setting_update:       function,
 *                                  commonProfileShow_user_setting_detail:  function,
 *                                  profile_user_setting_stat:         function
 *                                  },
 *                      template:string}>}
 */
const component = async props => {

    /**
     * @param {number} profile_id
     * @returns {Promise<{value:string, text:string}[]>}
     */
    const user_settings_get = async profile_id => {
        return props.methods.commonFFB({path:`/server-db/iamuserappdatapost-profile/${profile_id}`, query:`id_current_user=${props.data.iam_user_id??''}`, method:'GET', authorization_type:'APP_ID'})
                    .then((/**@type{string}*/result)=>
                            JSON.parse(result)
                            .map((/**@type{{id:number, 
                                            iam_user_id:number, 
                                            liked:number, 
                                            count_likes:number, 
                                            count_views:number,
                                            design_paper_size:string, 
                                            description:string}}}*/setting)=>{return {  value:JSON.stringify({   
                                                                                                sid:setting.id, 
                                                                                                iam_user_id:setting.iam_user_id, 
                                                                                                liked:setting.liked,
                                                                                                count_likes:setting.count_likes,
                                                                                                count_views:setting.count_views,
                                                                                                paper_size:setting.design_paper_size,
                                                                                                description:setting.description}), 
                                                                                        text:setting.description};}));
    }; 
    /**
     * Profile show user setting detail
     * @param {number} liked 
     * @param {number} count_likes 
     * @param {number} count_views 
     * @returns {void}
     */
    const profile_user_setting_detail_show = (liked, count_likes, count_views) => {
        
        props.methods.COMMON_DOCUMENT.querySelector('#profile_user_settings_like').children[0].style.display = `${liked == 1?'none':'block'}`;
        props.methods.COMMON_DOCUMENT.querySelector('#profile_user_settings_like').children[1].style.display = `${liked == 1?'block':'none'}`;

        props.methods.COMMON_DOCUMENT.querySelector('#profile_user_settings_info_likes_count').textContent = count_likes;
        props.methods.COMMON_DOCUMENT.querySelector('#profile_user_settings_info_views_count').textContent = count_views;
    };

    /**
     * Profile user setting stat
     * @param {number} id
     * @returns {void}
     */
    const profile_user_setting_stat = id => {
        props.methods.commonFFB({path:`/server-db/iamuserappdatapost-profile-stat-like/${id}`, method:'GET', authorization_type:'APP_ID'})
        .then((/**@type{string}*/result)=>{
            props.methods.COMMON_DOCUMENT.querySelector('#profile_info_user_setting_likes_count').textContent = JSON.parse(result)[0].count_user_post_likes;
            props.methods.COMMON_DOCUMENT.querySelector('#profile_info_user_setting_liked_count').textContent = JSON.parse(result)[0].count_user_post_liked;
        })
        .catch(()=>null);
    };
    /**
     * @param {number} profile_id
     * @param {number|null} sid
     * @param {{value:string, text:string}[]|null} user_settings_mount
     * @returns {Promise<void>}
     */
    const profile_user_setting_update = async (profile_id, sid=null, user_settings_mount = null) =>{
        const user_settings = user_settings_mount ?? await user_settings_get(profile_id);

        //show setting info if user has settings
        if (user_settings.length>0){
            //show current setting or first setting if showing first time
            await props.methods.commonComponentRender({
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
                methods:    {commonFFB:props.methods.commonFFB},
                path:       '/common/component/common_select.js'});
            
            const profile_select_user_settings = props.methods.COMMON_DOCUMENT.querySelector('#profile_select_user_settings .common_select_dropdown_value').getAttribute('data-value');
            profile_user_setting_detail_show(   JSON.parse(profile_select_user_settings).liked,
                                                JSON.parse(profile_select_user_settings).count_likes,
                                                JSON.parse(profile_select_user_settings).count_views);
            profile_user_setting_stat(profile_id);
        }
    };
    const user_settings = await user_settings_get(props.data.profile_id);
    const onMounted = async ()=>{
        await profile_user_setting_update(props.data.profile_id, null, user_settings);
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    {
                    profile_user_setting_update:profile_user_setting_update,
                    commonProfileShow_user_setting_detail:profile_user_setting_detail_show,
                    profile_user_setting_stat:profile_user_setting_stat
                    },
        template:   template({setting:user_settings.length>0})
    };
};
export default component;
/**
 * @module apps/common/component/common_dialogue_profile_info
 */

/**
 * 
 * @param {{profile:import('../../../common_types.js').CommonProfileUser,
 *          function_format_json_date:import('../../../common_types.js').CommonModuleCommon['format_json_date']}} props 
 * @returns 
 */
const template = props =>`  <div id='common_profile_main'>
                                <div id='common_profile_main_row1' class='common_profile_main_row'>
                                    <div class='common_profile_main_col'>
                                        <div id='common_profile_id'>${props.profile.id}</div>
                                        <div id='common_profile_avatar_container'>
                                            <div id='common_profile_avatar_image'>
                                                <div id='common_profile_avatar' class='common_image common_image_avatar_profile'></div>
                                            </div>
                                            <div id='common_profile_avatar_online_status' class='common_icon'></div>
                                        </div>
                                        <div id='common_profile_username'>${props.profile.username}</div>
                                        <div id='common_profile_bio'>${props.profile.bio ?? ''}</div>
                                    </div>
                                    <div class='common_profile_main_col'>
                                        <div id='common_profile_qr'></div>
                                    </div>
                                </div>
                                <div id='common_profile_main_row2' class='common_profile_main_row'>
                                    <div class='common_profile_main_col'>
                                        <div id='common_profile_joined'>
                                            <div id='common_profile_joined_date_icon' class='common_icon'></div>
                                            <div id='common_profile_joined_date'>${props.function_format_json_date(props.profile.date_created ?? '', true)}</div>
                                        </div>
                                    </div>    
                                    <div class='common_profile_main_col'>
                                        <div id='common_profile_follow' >
                                            <div class='common_icon common_user_follow common_link'></div>
                                            <div class='common_icon common_user_followed common_link'></div>
                                        </div>
                                        <div id='common_profile_like'>
                                            <div class='common_icon common_unlike common_link'></div>
                                            <div class='common_icon common_like common_link'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id='common_profile_public'>
                                ${props.profile.private!=1?
                                    `<div id='common_profile_main_stat_row1'>
                                        <div id='common_profile_info_view'>
                                            <div id='common_profile_info_view_count_icon' class='common_icon'></div>
                                            <div id='common_profile_info_view_count'>${props.profile.count_views}</div>
                                        </div>
                                        <div id='common_profile_info_following'>
                                            <div id='common_profile_main_btn_following' class='common_link common_icon'></div>
                                            <div id='common_profile_info_following_count'>${props.profile.count_following}</div>
                                        </div>
                                        <div id='common_profile_info_followers'>
                                            <div id='common_profile_main_btn_followed' class='common_link common_icon'></div>
                                            <div id='common_profile_info_followers_count'>${props.profile.count_followed}</div>
                                        </div>
                                        <div id='common_profile_info_likes'>
                                            <div id='common_profile_main_btn_likes' class='common_icon common_link common_like'></div>
                                            <div id='common_profile_info_likes_count'>${props.profile.count_likes}</div>
                                        </div>
                                        <div id='common_profile_info_liked'>
                                            <div id='common_profile_main_btn_liked' >
                                                <div id='common_profile_main_btn_liked_heart' class='common_icon common_link common_like'></div>
                                                <div id='common_profile_main_btn_liked_users' class='common_link common_icon'></div>
                                            </div>
                                            <div id='common_profile_info_liked_count'>${props.profile.count_liked}</div>
                                        </div>
                                        <div id='common_profile_info_main_btn_cloud' class='common_link common_icon'></div>
                                    </div>
                                    <div id='common_profile_main_stat_row2'></div>
                                    <div id='common_profile_detail'>
                                        <div id='common_profile_detail_list' class='common_profile_detail_list'></div>
                                    </div>`:''
                                }
                            </div>
                            <div id='common_profile_private'>
                                ${props.profile.private==1?'<div id=\'common_profile_private_title\' class=\'common_icon\'></div>':''}
                            </div>`;
/**
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      user_account_id:number,
 *                      client_latitude:string,
 *                      client_longitude:string,
 *                      user_account_id_other:number,
 *                      username:string
 *                      },
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      format_json_date:import('../../../common_types.js').CommonModuleCommon['format_json_date'],
 *                      create_qr:import('../../../common_types.js').CommonModuleCommon['create_qr'],
 *                      getHostname:import('../../../common_types.js').CommonModuleCommon['getHostname'],
 *                      show_common_dialogue:import('../../../common_types.js').CommonModuleCommon['show_common_dialogue'],
 *                      checkOnline:import('../../../common_types.js').CommonModuleCommon['checkOnline'],
 *                      common_setTimeout:import('../../../common_types.js').CommonModuleCommon['common_setTimeout'],
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const pathInfoGet =() =>{
        if (props.data.user_account_id_other !== null)
            return `/server-db/user_account-profile/${props.data.user_account_id_other ?? ''}`;
        else
            if (props.data.username !== null)
                return `/server-db/user_account-profile-name/${props.data.username}`;
            else
                return `/server-db/user_account-profile/${props.data.user_account_id ?? ''}`;
    };
    const profile = await props.methods.FFB(
                            {
                                path:pathInfoGet(), 
                                query:`id=${props.data.user_account_id ?? ''}&client_latitude=${props.data.client_latitude}&client_longitude=${props.data.client_longitude}`, 
                                method:'GET', 
                                authorization_type:'APP_DATA'
                            })
                        .then((/**@type{string}*/result)=>JSON.parse(result)[0]);
   
    const onMounted = async () => {
        
        if (props.data.user_account_id_other == null && props.data.user_account_id == null && props.data.username == null) {
            null;
        } else {
            props.methods.common_document.querySelector('#common_profile_avatar').style.backgroundImage= (profile.avatar ?? profile.provider_image)?
                                                                                                    `url('${profile.avatar ?? profile.provider_image}')`:
                                                                                                    'url()'; 
            props.methods.create_qr('common_profile_qr', props.methods.getHostname() + '/' + profile.username);
            //User account followed and liked
            if (profile.followed == 1) {
                //followed
                props.methods.common_document.querySelector('#common_profile_follow .common_user_follow').style.display = 'none';
                props.methods.common_document.querySelector('#common_profile_follow .common_user_followed').style.display = 'block';
            } else {
                //not followed
                props.methods.common_document.querySelector('#common_profile_follow .common_user_follow').style.display = 'block';
                props.methods.common_document.querySelector('#common_profile_follow .common_user_followed').style.display = 'none';
            }
            if (profile.liked == 1) {
                //liked
                props.methods.common_document.querySelector('#common_profile_like .common_unlike').style.display = 'none';
                props.methods.common_document.querySelector('#common_profile_like .common_like').style.display = 'block';
            } else {
                //not liked
                props.methods.common_document.querySelector('#common_profile_like .common_unlike').style.display = 'block';
                props.methods.common_document.querySelector('#common_profile_like .common_like').style.display = 'none';
            } 
            if (props.data.user_account_id ==null)
                props.methods.common_setTimeout(()=> {props.methods.show_common_dialogue('LOGIN');}, 2000);
            else
                props.methods.checkOnline('common_profile_avatar_online_status', profile.id);
        }
    };

    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({
                            profile:profile,
                            function_format_json_date:props.methods.format_json_date
                        })
    };
};
export default component;
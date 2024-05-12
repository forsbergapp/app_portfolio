/**@type{{querySelector:function}} */
const AppDocument = document;
/**
 * @typedef { {profile_id:number|null,
 *             private:number|null}} result_profile
 * @typedef {{  id:number|null,
 *              bio:string|null,
 *              private:number|null,
 *              friends:number|null,
 *              user_level:string|null,
 *              date_created:string|null,
 *              username:string|null, 
 *              avatar:string|null,
 *              identity_provider_id:number|null,
 *              provider_id:string|null,
 *              provider_first_name:string|null,
 *              provider_last_name:string|null,
 *              provider_image:string|null,
 *              provider_image_url:string|null,
 *              count_following:number|null,
 *              count_followed:number|null,
 *              count_likes:number|null,
 *              count_liked:number|null,
 *              count_views:number|null,
 *              followed:number|null,
 *              liked:number|null}} profile_user
 * @typedef {{id:number, username:string, avatar:string|null, provider_image: string|null, count:number}}   top_profile_records
 */
const profile_empty = { id:null, 
                        bio:null, 
                        private:null, 
                        friends:null, 
                        user_level:null, 
                        date_created:null, 
                        username:null,
                        avatar:null,
                        identity_provider_id:null,
                        provider_id:null,
                        provider_first_name:null,
                        provider_last_name:null,
                        provider_image:null,
                        provider_image_url:null,
                        count_following:null,
                        count_followed:null,
                        count_likes:null,
                        count_liked:null,
                        count_views:null,
                        followed:null,
                        liked:null};
 let profile = profile_empty;
/**
 * 
 * @param {{tab:string,
 *          info_profile:profile_user,
 *          top_profile_records:top_profile_records[]|[],
 *          top_function_list_image_format_src:function,
 *          info_function_format_json_date:function}} props 
 * @returns 
 */
const template = props =>
                    `   <div id='common_profile_home' class='common_dialogue_button common_icon' ></div>
                        <div id='common_profile_info'>
                            ${props.tab=='INFO'?
                            `   <div id='common_profile_main'>
                                    <div id='common_profile_main_row1' class='common_profile_main_row'>
                                        <div class='common_profile_main_col'>
                                            <div id='common_profile_id'>${props.info_profile.id}</div>
                                            <div id='common_profile_avatar_container'>
                                                <div id='common_profile_avatar_image'>
                                                    <img id='common_profile_avatar' src='' alt=''/>
                                                </div>
                                                <div id='common_profile_avatar_online_status' class='common_icon'></div>
                                            </div>
                                            <div id='common_profile_username'>${props.info_profile.username}</div>
                                            <div id='common_profile_bio'>${props.info_profile.bio ?? ''}</div>
                                        </div>
                                        <div class='common_profile_main_col'>
                                            <div id='common_profile_qr'></div>
                                        </div>
                                    </div>
                                    <div id='common_profile_main_row2' class='common_profile_main_row'>
                                        <div class='common_profile_main_col'>
                                            <div id='common_profile_joined'>
                                                <div id='common_profile_joined_date_icon' class='common_icon'></div>
                                                <div id='common_profile_joined_date'>${props.info_function_format_json_date(props.info_profile.date_created, true)}</div>
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
                                    ${props.info_profile.private==0?
                                    `<div id='common_profile_main_stat_row1'>
                                        <div id='common_profile_info_view'>
                                            <div id='common_profile_info_view_count_icon' class='common_icon'></div>
                                            <div id='common_profile_info_view_count'>${props.info_profile.count_views}</div>
                                        </div>
                                        <div id='common_profile_info_following'>
                                            <div id='common_profile_main_btn_following' class='common_link common_icon'></div>
                                            <div id='common_profile_info_following_count'>${props.info_profile.count_following}</div>
                                        </div>
                                        <div id='common_profile_info_followers'>
                                            <div id='common_profile_main_btn_followed' class='common_link common_icon'></div>
                                            <div id='common_profile_info_followers_count'>${props.info_profile.count_followed}</div>
                                        </div>
                                        <div id='common_profile_info_likes'>
                                            <div id='common_profile_main_btn_likes' class='common_icon common_link common_like'></div>
                                            <div id='common_profile_info_likes_count'>${props.info_profile.count_likes}</div>
                                        </div>
                                        <div id='common_profile_info_liked'>
                                            <div id='common_profile_main_btn_liked' >
                                                <div id='common_profile_main_btn_liked_heart' class='common_icon common_link common_like'></div>
                                                <div id='common_profile_main_btn_liked_users' class='common_link common_icon'></div>
                                            </div>
                                            <div id='common_profile_info_liked_count'>${props.info_profile.count_liked}</div>
                                        </div>
                                    </div>
                                    <div id='common_profile_main_stat_row2'></div>
                                    <div id='common_profile_detail'>
                                        <div id='common_profile_detail_list' class='common_profile_detail_list'></div>
                                    </div>`:''
                                    }
                                </div>
                                <div id='common_profile_private'>
                                    ${props.info_profile.private==1?`<div id='common_profile_private_title' class='common_icon'></div>`:''}
                                </div>
                                `:''
                            }
                        </div>
                        <div id='common_profile_stat'>
                            ${props.tab=='TOP'?
                            `<div id='common_profile_stat_row1'>
                                <div id='common_profile_stat_row1_1' class='common_link common_icon'></div>
                                <div id='common_profile_stat_row1_2' class='common_link common_icon'></div>
                                <div id='common_profile_stat_row1_3' class='common_link common_icon'></div>
                                </div>
                                <div id='common_profile_stat_row2'></div>
                                <div id='common_profile_stat_list' <SPINNER_CLASS/>>
                                    ${props.top_profile_records.map(row=>
                                        `   <div data-user_account_id='${row.id}' class='common_profile_stat_list_row common_row'>
                                                <div class='common_profile_stat_list_col'>
                                                    <div class='common_profile_stat_list_user_account_id'>${row.id}</div>
                                                </div>
                                                <div class='common_profile_stat_list_col'>
                                                    <img class='common_profile_stat_list_avatar' ${props.top_function_list_image_format_src(row.avatar ?? row.provider_image)}>
                                                </div>
                                                <div class='common_profile_stat_list_col'>
                                                    <div class='common_profile_stat_list_username common_wide_list_column common_link'>
                                                        ${row.username}
                                                    </div>
                                                </div>
                                                <div class='common_profile_stat_list_col'>
                                                    <div class='common_profile_stat_list_count'>${row.count}</div>
                                                </div>
                                            </div>`
                                    ).join('')
                                }
                                </div>
                            </div>`:''
                            }
                        </div>
                        <div id='common_profile_close' class='common_dialogue_button common_icon' ></div>`;

/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          tab:string,
 *          info_user_account_id:number,
 *          info_client_latitude:string,
 *          info_client_longitude:string,
 *          info_user_account_id_other:number,
 *          info_username:string,
 *          info_function_set_avatar:function,
 *          info_function_format_json_date:function,
 *          info_function_create_qr:function,
 *          info_function_getHostname:function,
 *          info_function_show_common_dialogue:function,
 *          info_function_checkOnline:function,
 *          top_statchoice:number,
 *          top_app_rest_url:string,
 *          top_function_list_image_format_src:function,
 *          top_function_user_click:function,
 *          function_FFB:function,
 *          }} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:   result_profile|null,
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show0');
    props.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    let spinner = `class='css_spinner'`;
    if (props.tab=='INFO'){
        let path;
        if (props.info_user_account_id_other !== null)
            path = `/user_account-profile/${props.info_user_account_id_other ?? ''}`;
        else
            if (props.info_username !== null)
                path = `/user_account-profile/${props.info_username}`;
            else
                path = `/user_account-profile/${props.info_user_account_id ?? ''}`;
        profile = await props.function_FFB(
                            'DB', 
                            path, 
                            `id=${props.info_user_account_id ?? ''}&client_latitude=${props.info_client_latitude}&client_longitude=${props.info_client_longitude}`, 
                            'GET', 'APP_DATA', null)
                            .then((/**@type{string}*/result)=>JSON.parse(result))
                            .catch((/**@type{Error}*/error)=>{throw error});
    }
        
    /**
     * Profile show
     * profile_show(null, null)     from dropdown menu in apps or choosing logged in users profile
     * profile_show(userid, null) 	from choosing profile in profile_stat, profile_detail and search_profile
     * profile_show(null, username) from init startup when user enters url
     * 
     * @param {number|null} user_account_id_other 
     * @param {string|null} username 
     * @returns {void}
     */
    const profile_show = (user_account_id_other = null, username = null) => {

        if (user_account_id_other == null && props.info_user_account_id == null && username == null) {
            null;
        } else {
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = 
                render_template(profile, []);

            props.info_function_set_avatar(profile.avatar ?? profile.provider_image, props.common_document.querySelector('#common_profile_avatar')); 
            props.info_function_create_qr('common_profile_qr', props.info_function_getHostname() + '/' + profile.username);
            //User account followed and liked
            if (profile.followed == 1) {
                //followed
                props.common_document.querySelector('#common_profile_follow .common_user_follow').style.display = 'none';
                props.common_document.querySelector('#common_profile_follow .common_user_followed').style.display = 'block';
            } else {
                //not followed
                props.common_document.querySelector('#common_profile_follow .common_user_follow').style.display = 'block';
                props.common_document.querySelector('#common_profile_follow .common_user_followed').style.display = 'none';
            }
            if (profile.liked == 1) {
                //liked
                props.common_document.querySelector('#common_profile_like .common_unlike').style.display = 'none';
                props.common_document.querySelector('#common_profile_like .common_like').style.display = 'block';
            } else {
                //not liked
                props.common_document.querySelector('#common_profile_like .common_unlike').style.display = 'block';
                props.common_document.querySelector('#common_profile_like .common_like').style.display = 'none';
            } 
            if (props.info_user_account_id ==null)
                setTimeout(()=> {props.info_function_show_common_dialogue('LOGIN');}, 2000);
            else
                props.info_function_checkOnline('common_profile_avatar_online_status', profile.id);
            profile = { id:null, 
                    bio:null, 
                    private:null, 
                    friends:null, 
                    user_level:null, 
                    date_created:null, 
                    username:null,
                    avatar:null,
                    identity_provider_id:null,
                    provider_id:null,
                    provider_first_name:null,
                    provider_last_name:null,
                    provider_image:null,
                    provider_image_url:null,
                    count_following:null,
                    count_followed:null,
                    count_likes:null,
                    count_liked:null,
                    count_views:null,
                    followed:null,
                    liked:null};
        }
    };
    /**
    * Profile top
    * @param {number} statchoice 
    * @param {string|null} app_rest_url 
    * @param {function|null} function_user_click
    * @returns {Promise.<void>}
    */
    const profile_stat = async (statchoice, app_rest_url = null, function_user_click=null) => {
            let path;
            if (statchoice ==1 || statchoice ==2 || statchoice ==3){
                /*statschoice 1,2,3: user_account*/
                path = '/user_account-profile-stat';
            }
            else{
                /*other statschoice, apps can use >3 and return same columns*/
                path = app_rest_url;
            }
            const profile_stat_records = await props.function_FFB('DB', path, `statchoice=${statchoice}`, 'GET', 'APP_DATA', null)
                                            .then((/**@type{string}*/result)=>JSON.parse(result))
                                            .catch((/**@type{Error}*/error)=>{throw error});
            spinner = '';
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = 
                render_template(profile_empty, profile_stat_records);
            props.common_document.querySelector('#common_profile_stat_list')['data-function'] = function_user_click;
    };
    /**
     * div common_profile_main_stat_row2 and common_profile_stat_row2 used for app components
     * @param {profile_user} profile
     * @param {top_profile_records[]|[]} top_profile_records
     * @returns {string}
     */
    const render_template = (profile, top_profile_records) =>{
        return template({
                            info_profile:profile,
                            top_profile_records:top_profile_records,
                            tab:props.tab,
                            top_function_list_image_format_src:props.top_function_list_image_format_src,
                            info_function_format_json_date:props.info_function_format_json_date
                        })
                .replace('<SPINNER_CLASS/>', spinner);
    }
    const post_component = async () =>{
        if (props.tab=='INFO')
            profile_show(props.info_user_account_id_other, props.info_username);
        else
            await profile_stat(props.top_statchoice, props.top_app_rest_url, props.top_function_user_click)
    }
    return {
        props:  {function_post:post_component},
        data:   props.tab=='INFO'?{
                    profile_id:profile.id,
                    private:profile.private
                }:null,
        template: render_template(profile_empty, [])
    };
}
export default component;
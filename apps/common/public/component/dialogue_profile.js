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
 */
const template =`   <div id='common_profile_home' class='common_dialogue_button common_icon' ></div>
                    <div id='common_profile_info'>
                        <CommonProfileInfo/>
                    </div>
                    <div id='common_profile_top'>
                        <CommonProfileTop/>
                    </div>
                    <div id='common_profile_close' class='common_dialogue_button common_icon' ></div>`;
const template_profile_info = ` <div id='common_profile_main'>
                                <div id='common_profile_main_row1' class='common_profile_main_row'>
                                    <div class='common_profile_main_col'>
                                        <div id='common_profile_id'></div>
                                        <div id='common_profile_avatar_container'>
                                            <div id='common_profile_avatar_image'>
                                                <img id='common_profile_avatar' src='' alt=''/>
                                            </div>
                                            <div id='common_profile_avatar_online_status' class='common_icon'></div>
                                        </div>
                                        <div id='common_profile_username'></div>
                                        <div id='common_profile_bio'></div>
                                    </div>
                                    <div class='common_profile_main_col'>
                                        <div id='common_profile_qr'></div>
                                    </div>
                                </div>
                                <div id='common_profile_main_row2' class='common_profile_main_row'>
                                    <div class='common_profile_main_col'>
                                        <div id='common_profile_joined'>
                                            <div id='common_profile_joined_date_icon' class='common_icon'></div>
                                            <div id='common_profile_joined_date'></div>
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
                                <div id='common_profile_main_stat_row1'>
                                    <div id='common_profile_info_view'>
                                        <div id='common_profile_info_view_count_icon' class='common_icon'></div>
                                        <div id='common_profile_info_view_count'></div>
                                    </div>
                                    <div id='common_profile_info_following'>
                                        <div id='common_profile_main_btn_following' class='common_link common_icon'></div>
                                        <div id='common_profile_info_following_count'></div>
                                    </div>
                                    <div id='common_profile_info_followers'>
                                        <div id='common_profile_main_btn_followed' class='common_link common_icon'></div>
                                        <div id='common_profile_info_followers_count'></div>
                                    </div>
                                    <div id='common_profile_info_likes'>
                                        <div id='common_profile_main_btn_likes' class='common_icon common_link common_like'></div>
                                        <div id='common_profile_info_likes_count'></div>
                                    </div>
                                    <div id='common_profile_info_liked'>
                                        <div id='common_profile_main_btn_liked' >
                                            <div id='common_profile_main_btn_liked_heart' class='common_icon common_link common_like'></div>
                                            <div id='common_profile_main_btn_liked_users' class='common_link common_icon'></div>
                                        </div>
                                        <div id='common_profile_info_liked_count'></div>
                                    </div>
                                </div>
                                <div id='common_profile_main_stat_row2'></div>
                                <div id='common_profile_detail'>
                                    <div id='common_profile_detail_list' class='common_profile_detail_list'></div>
                                </div>
                                </div>
                                <div id='common_profile_private'>
                                <div id='common_profile_private_title' class='common_icon'></div>
                                </div>`;
const template_profile_top = `  <div id='common_profile_top_row1'>
                                <div id='common_profile_top_row1_1' class='common_link common_icon'></div>
                                <div id='common_profile_top_row1_2' class='common_link common_icon'></div>
                                <div id='common_profile_top_row1_3' class='common_link common_icon'></div>
                                </div>
                                <div id='common_profile_top_row2'></div>
                                <div id='common_profile_top_list'></div>`;
const template_profile_top_list_record = `  <div data-user_account_id='<CommonListId/>' class='common_profile_top_list_row common_row'>
                                            <div class='common_profile_top_list_col'>
                                                <div class='common_profile_top_list_user_account_id'><CommonListId/></div>
                                            </div>
                                            <div class='common_profile_top_list_col'>
                                                <img class='common_profile_top_list_avatar' <CommonListImage/>>
                                            </div>
                                            <div class='common_profile_top_list_col'>
                                                <div class='common_profile_top_list_username common_wide_list_column common_link'>
                                                    <CommonListUsername/>
                                                </div>
                                            </div>
                                            <div class='common_profile_top_list_col'>
                                                <div class='common_profile_top_list_count'><CommonListCount/></div>
                                            </div>
                                            </div>`;
/**
 * 
 * @param {*} props 
 * @returns {Promise.<{ props:{function_post:function|null}, 
 *                      data:   result_profile|null,
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show0');
    props.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    /**
     * 
     * @param {number|null} user_account_id_other 
     * @param {string|null} username 
     * @returns {Promise.<profile_user>}
     */
    const get_profile = async (user_account_id_other, username) => {
        if (props.tab=='INFO')
            return new Promise((resolve, reject)=>{
                let path;
                let user_account_id_search;            
                if (user_account_id_other !== null) {
                    user_account_id_search = user_account_id_other;
                    path = `/user_account/profile/id?POST_ID=${user_account_id_search ?? ''}&id=${props.info_user_account_id ?? ''}`;
                } else
                if (username !== null) {
                    user_account_id_search = '';
                    path = `/user_account/profile/username?search=${username}&id=${props.info_user_account_id ?? ''}`;
                } else {
                    user_account_id_search = props.info_user_account_id;
                    path = `/user_account/profile/id?POST_ID=${user_account_id_search ?? ''}&id=${props.info_user_account_id ?? ''}`;
                }
                const json_data ={  
                    client_latitude:    props.info_client_latitude,
                    client_longitude:   props.info_client_longitude
                };
                props.function_FFB('DB_API', path, 'POST', 'APP_DATA', json_data)
                .then((/**@type{string}*/result)=>{
                    resolve(JSON.parse(result));
                })
                .catch((/**@type{Error}*/err)=>{reject(err);});
            })
        else
            return {id:null,
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
    const profile = await get_profile(props.info_user_account_id_other, props.info_username);
    /**
     * Profile show
     * profile_show(null, null)     from dropdown menu in apps or choosing logged in users profile
     * profile_show(userid, null) 	from choosing profile in profile_top, profile_detail and search_profile
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
            props.common_document.querySelector('#common_profile_info').style.display = 'block';
            props.common_document.querySelector('#common_profile_top').style.display = 'none';
            props.common_document.querySelector('#common_profile_main').style.display = 'block';
            props.common_document.querySelector('#common_profile_id').innerHTML = profile.id;
            props.info_function_set_avatar(profile.avatar ?? profile.provider_image, props.common_document.querySelector('#common_profile_avatar')); 
            //show local username
            props.common_document.querySelector('#common_profile_username').innerHTML = profile.username;

            props.common_document.querySelector('#common_profile_bio').innerHTML = profile.bio ?? '';
            props.common_document.querySelector('#common_profile_joined_date').innerHTML = props.info_function_format_json_date(profile.date_created, true);
            props.common_document.querySelector('#common_profile_qr').innerHTML = '';
            props.info_function_create_qr('common_profile_qr', props.info_function_getHostname() + '/' + profile.username);
            //User account followed and liked
            if (profile.followed == 1) {
                //followed
                props.common_document.querySelector('#common_profile_follow').children[0].style.display = 'none';
                props.common_document.querySelector('#common_profile_follow').children[1].style.display = 'block';
            } else {
                //not followed
                props.common_document.querySelector('#common_profile_follow').children[0].style.display = 'block';
                props.common_document.querySelector('#common_profile_follow').children[1].style.display = 'none';
            }
            if (profile.liked == 1) {
                //liked
                props.common_document.querySelector('#common_profile_like').children[0].style.display = 'none';
                props.common_document.querySelector('#common_profile_like').children[1].style.display = 'block';
            } else {
                //not liked
                props.common_document.querySelector('#common_profile_like').children[0].style.display = 'block';
                props.common_document.querySelector('#common_profile_like').children[1].style.display = 'none';
            } 
            //if private then hide info, sql decides if private, no need to check here if same user
            if (profile.private==1) {
                //private
                props.common_document.querySelector('#common_profile_public').style.display = 'none';
                props.common_document.querySelector('#common_profile_private').style.display = 'block';
            } else {
                //public
                props.common_document.querySelector('#common_profile_public').style.display = 'block';
                props.common_document.querySelector('#common_profile_private').style.display = 'none';
                props.common_document.querySelector('#common_profile_info_view_count').innerHTML = profile.count_views;
                props.common_document.querySelector('#common_profile_info_following_count').innerHTML = profile.count_following;
                props.common_document.querySelector('#common_profile_info_followers_count').innerHTML = profile.count_followed;
                props.common_document.querySelector('#common_profile_info_likes_count').innerHTML = profile.count_likes;
                props.common_document.querySelector('#common_profile_info_liked_count').innerHTML = profile.count_liked;
            }    
            if (props.info_user_account_id ==null)
                setTimeout(()=> {props.info_function_show_common_dialogue('LOGIN');}, 2000);
            else
                props.info_function_checkOnline('common_profile_avatar_online_status', profile.id);
        }
    };
    /**
    * Profile top
    * @param {number} statchoice 
    * @param {string|null} app_rest_url 
    * @param {function|null} function_user_click
    * @returns {Promise.<null>}
    */
    const profile_top = async (statchoice, app_rest_url = null, function_user_click=null) => {
        return new Promise((resolve, reject)=>{
            let path;
            const profile_top_list = props.common_document.querySelector('#common_profile_top_list');
            profile_top_list.innerHTML = '';
            profile_top_list.classList.add('css_spinner');
            props.common_document.querySelector('#common_profile_info').style.display = 'none';
            props.common_document.querySelector('#common_profile_top').style.display = 'block';
                        
            if (statchoice ==1 || statchoice ==2 || statchoice ==3){
                /*statschoice 1,2,3: user_account*/
                path = `/user_account/profile/top?statchoice=${statchoice}`;
            }
            else{
                /*other statschoice, apps can use >3 and return same columns*/
                path = `${app_rest_url}?statchoice=${statchoice}`;
            }
            //TOP
            props.function_FFB('DB_API', path, 'GET', 'APP_DATA', null)
            .then((/**@type{string}*/result)=> {
                let html ='';
                for (const profile_top of JSON.parse(result)) {
                    html += template_profile_top_list_record
                            .replaceAll('<CommonListId/>', profile_top.id)
                            .replace('<CommonListImage/>', props.top_function_list_image_format_src(profile_top.avatar ?? profile_top.provider_image))
                            .replace('<CommonListUsername/>', profile_top.username)
                            .replace('<CommonListCount/>', profile_top.count);
                }
                profile_top_list.classList.remove('css_spinner');
                profile_top_list.innerHTML = html;
                props.common_document.querySelector('#common_profile_top_list')['data-function'] = function_user_click;
                resolve(null);
            })
            .catch((/**@type{Error}*/error)=> {profile_top_list.classList.remove('css_spinner');reject(error);});
        })   
    };
    /**
     * div common_profile_main_stat_row2 and common_profile_top_row2 used for app components
     * @returns {string}
     */
    const render_template = () =>{
        return template
                .replace('<CommonProfileInfo/>',props.tab=='INFO'?template_profile_info ?? '':'')
                .replace('<CommonProfileTop/>',props.tab=='TOP'?template_profile_top ?? '':'');
    }
    const template_rendered = render_template();
    const post_component = () =>{
        if (props.tab=='INFO')
            profile_show(props.info_user_account_id_other, props.info_username);
        else
            profile_top(props.top_statchoice, props.top_app_rest_url, props.top_function_user_click)
    }
    return {
        props:  {function_post:post_component},
        data:   props.tab=='INFO'?{
                    profile_id:profile.id,
                    private:profile.private
                }:null,
        template: template_rendered
    };
}
export default component;
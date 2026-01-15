/**
 * Displays profile info
 * @module apps/common/component/common_app_dialogues_profile_info
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{profile:common['server']['ORM']['View']['IamUsetGetProfile'] & {Id:number},
 *          function_commonMiscFormatJsonDate:common['CommonModuleCommon']['commonMiscFormatJsonDate'],
 *          icons:{ like:string,
 *                  unlike:string, 
 *                  user_account_created:string,
 *                  private:string,
 *                  online:string,
 *                  user_views:string,
 *                  user_follows:string,
 *                  user_followed:string,
 *                  liked_users:string,
 *                  user_follow_user:string,
 *                  user_followed_user:string}}} props 
 * @returns {string}
 */
const template = props =>`  <div id='common_app_dialogues_profile_info'>
                                <div id='common_app_dialogues_profile_info_row1' class='common_app_dialogues_profile_info_row'>
                                    <div class='common_app_dialogues_profile_info_col'>
                                        <div id='common_app_dialogues_profile_info_id'>${props.profile.Id}</div>
                                        <div id='common_app_dialogues_profile_info_avatar_container'>
                                            <div id='common_app_dialogues_profile_info_avatar_image'>
                                                <div id='common_app_dialogues_profile_info_avatar' class='common_image common_image_avatar_profile' style='${props.profile.Avatar==null?'':`background-image:url(${props.profile.Avatar});`}'></div>
                                            </div>
                                            <div id='common_app_dialogues_profile_info_avatar_online_status'>${props.icons.online}</div>
                                        </div>
                                        <div id='common_app_dialogues_profile_info_username'>${props.profile.Username}</div>
                                        <div id='common_app_dialogues_profile_info_bio'>${props.profile.Bio ?? ''}</div>
                                    </div>
                                </div>
                                <div id='common_app_dialogues_profile_info_row2' class='common_app_dialogues_profile_info_row'>
                                    <div class='common_app_dialogues_profile_info_col'>
                                        <div id='common_app_dialogues_profile_info_joined'>
                                            <div id='common_app_dialogues_profile_info_joined_date_icon'>${props.icons.user_account_created}</div>
                                            <div id='common_app_dialogues_profile_info_joined_date'>${props.function_commonMiscFormatJsonDate(props.profile.Created ?? '', 'SHORT')}</div>
                                        </div>
                                    </div>    
                                    <div class='common_app_dialogues_profile_info_col'>
                                        <div id='common_app_dialogues_profile_info_follow' data-record_id='${props.profile.FollowedId}'>
                                            <div id='common_app_dialogues_profile_info_user_follow' class='common_link'>${props.icons.user_follow_user}</div>
                                            <div id='common_app_dialogues_profile_info_user_followed' class=' common_link'>${props.icons.user_followed_user}</div>
                                        </div>
                                        <div id='common_app_dialogues_profile_info_like' data-record_id='${props.profile.LikedId}'>
                                            <div id='common_app_dialogues_profile_info_like_unlike' class='common_unlike common_link common_icon_list'>${props.icons.unlike}</div>
                                            <div id='common_app_dialogues_profile_info_like_like' class='common_like common_link common_icon_list'>${props.icons.like}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id='common_app_dialogues_profile_info_public'>
                                ${props.profile.Private!=1?
                                    `<div id='common_app_dialogues_profile_info_stat_row1'>
                                        <div id='common_app_dialogues_profile_info_view'>
                                            <div id='common_app_dialogues_profile_info_view_count_icon'>${props.icons.user_views}</div>
                                            <div id='common_app_dialogues_profile_info_view_count'>${props.profile.CountViews}</div>
                                        </div>
                                        <div id='common_app_dialogues_profile_info_following'>
                                            <div id='common_app_dialogues_profile_info_btn_following' class='common_link common_icon_list'>${props.icons.user_follows}</div>
                                            <div id='common_app_dialogues_profile_info_following_count'>${props.profile.CountFollowing}</div>
                                        </div>
                                        <div id='common_app_dialogues_profile_info_followers'>
                                            <div id='common_app_dialogues_profile_info_btn_followed' class='common_link common_icon_list'>${props.icons.user_followed}</div>
                                            <div id='common_app_dialogues_profile_info_followers_count'>${props.profile.CountFollowed}</div>
                                        </div>
                                        <div id='common_app_dialogues_profile_info_likes'>
                                            <div id='common_app_dialogues_profile_info_btn_likes' class='common_link common_like common_link common_icon_list'>${props.icons.like}</div>
                                            <div id='common_app_dialogues_profile_info_likes_count'>${props.profile.CountLikes}</div>
                                        </div>
                                        <div id='common_app_dialogues_profile_info_liked'>
                                            <div id='common_app_dialogues_profile_info_btn_liked' >
                                                <div id='common_app_dialogues_profile_info_btn_liked_heart' class='common_link common_like common_link common_icon_list'>${props.icons.like}</div>
                                                <div id='common_app_dialogues_profile_info_btn_liked_users' class='common_link common_icon_list'>${props.icons.user_followed}</div>
                                            </div>
                                            <div id='common_app_dialogues_profile_info_liked_count'>${props.profile.CountLiked}</div>
                                        </div>
                                    </div>
                                    <div id='common_app_dialogues_profile_info_stat_row2'></div>
                                    <div id='common_app_dialogues_profile_info_detail'>
                                        <div id='common_app_dialogues_profile_info_list' class='common_app_dialogues_profile_info_list'></div>
                                    </div>`:''
                                }
                            </div>
                            <div id='common_app_dialogues_profile_info_private'>
                                ${props.profile.Private==1?`<div id='common_app_dialogues_profile_info_private_title' >${props.icons.private}</div>`:''}
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      iam_user_id_other:number,
 *                      username:string
 *                      },
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:   null,
 *                      methods:null,
 *                      events: common['commonComponentEvents'],
 *                      template:string}>}
 */
const component = async props => {
    const pathInfoGet =() =>{
        if (props.data.iam_user_id_other !== null)
            return `/server-db/iamuser-profile/${props.data.iam_user_id_other ?? ''}`;
        else
            if (props.data.username !== null)
                return '/server-db/iamuser-profile/';
            else
                return `/server-db/iamuser-profile/${props.methods.COMMON.commonGlobalGet('iam_user_id') ?? ''}`;
    };
    /**@type{common['server']['ORM']['View']['IamUsetGetProfile'] & {Id:number}}*/
    const profile = await props.methods.COMMON.commonFFB(
                            {
                                path:pathInfoGet(), 
                                query:`id=${props.methods.COMMON.commonGlobalGet('iam_user_id') ?? ''}` + (props.data.username!=null?`&name=${props.data.username}`:''), 
                                method:'GET', 
                                authorization_type:'APP_ID'
                            })
                        .then((/**@type{string}*/result)=>JSON.parse(result).rows?.[0] ?? JSON.parse(result)[0]);
   
    const onMounted = async () => {
        setButtonUI('common_app_dialogues_profile_info_follow',profile.FollowedId!=null);
        setButtonUI('common_app_dialogues_profile_info_like',profile.LikedId!=null);
        if (props.methods.COMMON.commonGlobalGet('iam_user_id') !=null)
            props.methods.COMMON.commonSocketConnectOnlineCheck('common_app_dialogues_profile_info_avatar_online_status', profile.Id);
    };
    /**
     * 
     * @param {string} target_id 
     * @param {boolean} value 
     */
    const setButtonUI = (target_id, value ) => {
        if (target_id == 'common_app_dialogues_profile_info_follow'){
            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${target_id} #common_app_dialogues_profile_info_user_follow`).style.display = value?'none':'block';
            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${target_id} #common_app_dialogues_profile_info_user_followed`).style.display = value?'block':'none';
        }
        else{
            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${target_id} #common_app_dialogues_profile_info_like_unlike`).style.display = value?'none':'block';
            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${target_id} #common_app_dialogues_profile_info_like_like`).style.display = value?'block':'none';
        }
    }
    /**
     * @name commonUserFunction
     * @description User function FOLLOW and LIKE with delete and post for both
     * @function
     * @param {'FOLLOW'|'LIKE'} function_name 
     * @returns {Promise.<null>}
     */
    const commonUserFunction = function_name => {
        return new Promise((resolve, reject)=>{
            const user_id_profile = Number(props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_profile_info_id').textContent);
            /**@type{common['CommonRESTAPIMethod']} */
            let method;
            let path;
            let json;
            const check_div = props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#common_app_dialogues_profile_info_${function_name.toLowerCase()} >div`);
            if (check_div.style.display == 'block') {
                path = `/server-db/iamuser${function_name.toLowerCase()}`;
                method = 'POST';
                json = {    IAM_iam_user_id: props.methods.COMMON.commonGlobalGet('iam_user_id'),
                            [`iam_user_id_${function_name.toLowerCase()}`]: user_id_profile
                        };
            } else {
                path = `/server-db/iamuser${function_name.toLowerCase()}/${props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#common_app_dialogues_profile_info_${function_name.toLowerCase()}`).getAttribute('data-record_id')}`;
                method = 'DELETE';
                json = { IAM_iam_user_id: props.methods.COMMON.commonGlobalGet('iam_user_id')};
            }
            if (props.methods.COMMON.commonGlobalGet('iam_user_id') == null)
                props.methods.COMMON.commonDialogueShow('LOGIN');
            else {
               props.methods.COMMON.commonFFB({path:path, method:method, authorization_type:'APP_ACCESS', body:json})
                .then(result=> {
                    setButtonUI(`common_app_dialogues_profile_info_${function_name.toLowerCase()}`,method=='POST')
                    if (method=='POST')
                        props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#common_app_dialogues_profile_info_${function_name.toLowerCase()}`).setAttribute('data-record_id',JSON.parse(result).InsertId);
                    else
                        props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#common_app_dialogues_profile_info_${function_name.toLowerCase()}`).setAttribute('data-record_id',null);
                    resolve(null);
                })
                .catch(err=>reject(err));
            }
        });
    };
    /**
     * @name commonProfileUpdateStat
     * @description Profile update stat
     * @function
     * @returns {Promise.<{id:number}>}
     */
    const commonProfileUpdateStat = async () => {
        return new Promise((resolve, reject) => {
            const profile_id = props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_profile_info_id');
            //get updated stat for given user
           props.methods.COMMON.commonFFB({path:`/server-db/iamuser-profile/${profile_id.textContent}`, 
                query:`id=${profile_id.textContent}`, 
                method:'GET', 
                authorization_type:'APP_ID'})
            .then(result=>{
                /**@type{common['server']['ORM']['View']['IamUsetGetProfile'] & {Id:number}}*/
                const user_stat = JSON.parse(result)[0];
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_profile_info_view_count').textContent = user_stat.CountViews;
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_profile_info_following_count').textContent = user_stat.CountFollowing;
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_profile_info_followers_count').textContent = user_stat.CountFollowed;
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_profile_info_likes_count').textContent = user_stat.CountLikes;
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_profile_info_liked_count').textContent = user_stat.CountLiked;
                resolve({id : user_stat.Id});
            })
            .catch(err=>reject(err));
        });
    };
    
    /**
     * @name events
     * @descption Events
     * @function
     * @param {common['commonEventType']} event_type
     * @param {common['CommonAppEvent']} event
     * @returns {Promise.<void>}
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.COMMON.commonMiscElementId(event.target);
        switch (true){
            case event_type =='click' && ['common_app_dialogues_profile_info_user_followed', 'common_app_dialogues_profile_info_user_follow'].includes(event_target_id):{
                await commonUserFunction('FOLLOW')
                    .then(()=>commonProfileUpdateStat())
                break;
            }
            case event_type =='click' && ['common_app_dialogues_profile_info_like_like', 'common_app_dialogues_profile_info_like_unlike'].includes(event_target_id):{
                await commonUserFunction('LIKE')
                    .then(()=>commonProfileUpdateStat())
                break;
            }
            case event_type =='click' && event_target_id == 'common_app_dialogues_profile_info_btn_following':{
                props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll('.common_app_dialogues_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_app_dialogues_profile_btn_selected'));
                props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_app_dialogues_profile_btn_selected');
                props.methods.COMMON.commonProfileDetail(1);
                break;
            }
            case event_type =='click' && event_target_id == 'common_app_dialogues_profile_info_btn_followed':{
                props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll('.common_app_dialogues_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_app_dialogues_profile_btn_selected'));
                props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_app_dialogues_profile_btn_selected');
                props.methods.COMMON.commonProfileDetail(2);
                break;
            }
            case event_type =='click' && event_target_id == 'common_app_dialogues_profile_info_btn_likes':{
                props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll('.common_app_dialogues_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_app_dialogues_profile_btn_selected'));
                props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_app_dialogues_profile_btn_selected');
                props.methods.COMMON.commonProfileDetail(3);
                break;
            }
            case event_type =='click' && event_target_id == 'common_app_dialogues_profile_info_btn_liked':
            case event_type =='click' && event_target_id == 'common_app_dialogues_profile_info_btn_liked_heart':
            case event_type =='click' && event_target_id == 'common_app_dialogues_profile_info_btn_liked_users':{
                props.methods.COMMON.commonProfileDetail(4);
                props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll('.common_app_dialogues_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_app_dialogues_profile_btn_selected'));
                props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_app_dialogues_profile_btn_selected');
                break;
            }
        }
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        events:     events,
        template:   template({
                            profile:profile,
                            function_commonMiscFormatJsonDate:props.methods.COMMON.commonMiscFormatJsonDate,
                            icons:{ like:props.methods.COMMON.commonGlobalGet('ICONS')['user_like'],
                                    unlike:props.methods.COMMON.commonGlobalGet('ICONS')['user_unlike'],
                                    user_account_created:props.methods.COMMON.commonGlobalGet('ICONS')['user_account_created'],
                                    private:props.methods.COMMON.commonGlobalGet('ICONS')['lock'],
                                    online:props.methods.COMMON.commonGlobalGet('ICONS')['online'],
                                    user_views:props.methods.COMMON.commonGlobalGet('ICONS')['user_views'],
                                    user_follows:props.methods.COMMON.commonGlobalGet('ICONS')['user_follows'],
                                    user_followed:props.methods.COMMON.commonGlobalGet('ICONS')['user_followed'],
                                    liked_users:props.methods.COMMON.commonGlobalGet('ICONS')['user_followed'],
                                    user_follow_user:props.methods.COMMON.commonGlobalGet('ICONS')['user_follow_user'],
                                    user_followed_user:props.methods.COMMON.commonGlobalGet('ICONS')['user_followed_user']}
                        })
    };
};
export default component;
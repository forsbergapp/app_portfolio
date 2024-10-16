/**
 * @module apps/common/component/common_dialogue_profile_info_detail
 */
/**
 * Displays profile detail
 * @param {{user_account_id:number,
 *          user_account_id_profile:number,
 *          detailchoice:number,
 *          list:[{ id:number|null, 
 *                  APP_ID:number, 
 *                  PROTOCOL:string, 
 *                  SUBDOMAIN:string, 
 *                  HOST:string, 
 *                  PORT:string,
 *                  LOGO:string,
 *                  NAME:string,
 *                  APP_NAME_TRANSLATION:string,
 *                  date_created:string,
 *                  avatar:string,
 *                  provider_image:string,
 *                  username:string}]|[]}} props
 */
const template = props => `     ${props.list.map(row=>
                                    `${props.detailchoice==5 && typeof row.id =='undefined'?
                                        `<div data-app_id='${row.APP_ID}' data-url='${row.PROTOCOL}${row.SUBDOMAIN}.${row.HOST}:${row.PORT}' class='common_profile_detail_list_row common_row'>
                                            <div class='common_profile_detail_list_col'>
                                                <div class='common_profile_detail_list_app_id'>${row.APP_ID}</div>
                                            </div>
                                            <div class='common_profile_detail_list_col'>
                                                <div class='common_image common_image_avatar_list' style='background-image:url("${row.LOGO}");'></div>
                                            </div>
                                            <div class='common_profile_detail_list_col'>
                                                <div class='common_profile_detail_list_app_name common_wide_list_column common_link'>
                                                    ${row.APP_NAME_TRANSLATION}
                                                </div>
                                            </div>
                                            <div class='common_profile_detail_list_col'>
                                                ${props.user_account_id==props.user_account_id_profile?
                                                    '<div class=\'common_profile_detail_list_app_delete common_icon\'></div>':
                                                    ''
                                                }
                                            </div>
                                            <div class='common_profile_detail_list_col'>
                                                <div class='common_profile_detail_list_date_created'>${row.date_created}</div>
                                            </div>
                                        </div>`:
                                        `<div data-user_account_id='${row.id}' class='common_profile_detail_list_row common_row'>
                                            <div class='common_profile_detail_list_col'>
                                                <div class='common_profile_detail_list_user_account_id'>${row.id}</div>
                                            </div>
                                            <div class='common_profile_detail_list_col'>
                                                <div class='common_image common_image_avatar_list' style='background-image:url("${row.avatar ?? row.provider_image}");'></div>
                                            </div>
                                            <div class='common_profile_detail_list_col'>
                                                <div class='common_profile_detail_list_username common_wide_list_column common_link'>
                                                    ${row.username}
                                                </div>
                                            </div>
                                        </div>`
                                    }`
                                ).join('')
                                }`;
/**
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      user_account_id:number,
 *                      user_account_id_profile:number,
 *                      detailchoice:number
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
 *                      commonDialogueShow:import('../../../common_types.js').CommonModuleCommon['commonDialogueShow'],
 *                      commonFFB:import('../../../common_types.js').CommonModuleCommon['commonFFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle,
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    let path;
    switch (props.data.detailchoice){
        case 1:
        case 2:
        case 3:
        case 4:{
            /*detailchoice 1,2,3, 4: user_account*/
            path = '/server-db/user_account-profile-detail';
            break;
        }
        case 5:{
            /* detailchoice 5, apps, returns same columns*/
            path = '/server-db/user_account_app-apps';
            break;
        }
        case 6:
        case 7:{
            /*detailchoice 6, 7: app specific */
            path = '/server-db/user_account_app_data_post-profile-detail';
            break;
        }    
    }
    if (!props.data.user_account_id)
        props.methods.commonDialogueShow('LOGIN');

    return {
      lifecycle:    null,
      data:         null,
      methods:      null,
      template:     template({  user_account_id:props.data.user_account_id,
                                user_account_id_profile:props.data.user_account_id_profile,
                                detailchoice:props.data.detailchoice,
                                list:props.data.user_account_id?
                                        await props.methods.commonFFB({path:`${path}/${props.data.user_account_id_profile}`, query:`detailchoice=${props.data.detailchoice}`, method:'GET', authorization_type:'APP_ACCESS'})
                                                .then((/**@type{string}*/result)=>JSON.parse(result)):
                                        []
                            })
    };
};
export default component;
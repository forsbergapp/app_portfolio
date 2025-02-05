/**
 * @module apps/common/component/common_dialogue_profile_info_detail
 */
/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{user_account_id:number,
 *          user_account_id_profile:number,
 *          detailchoice:number,
 *          list:[{ id:number|null, 
 *                  app_id:number, 
 *                  protocol:string, 
 *                  subdomain:string, 
 *                  host:string, 
 *                  port:string,
 *                  logo:string,
 *                  name:string,
 *                  app_name_translation:string,
 *                  date_created:string,
 *                  avatar:string,
 *                  username:string}]|[]}} props
 * @returns {string}
 */
const template = props => `     ${props.list.map(row=>
                                    `${props.detailchoice==5 && typeof row.id =='undefined'?
                                        `<div data-app_id='${row.app_id}' data-url='${row.protocol}${row.subdomain}.${row.host}:${row.port}' class='common_profile_detail_list_row common_row'>
                                            <div class='common_profile_detail_list_col'>
                                                <div class='common_profile_detail_list_app_id'>${row.app_id}</div>
                                            </div>
                                            <div class='common_profile_detail_list_col'>
                                                <div class='common_image common_image_avatar_list' style='${row.logo==null?'':`background-image:url(${row.logo});`}'></div>
                                            </div>
                                            <div class='common_profile_detail_list_col'>
                                                <div class='common_profile_detail_list_app_name common_wide_list_column common_link'>
                                                    ${row.app_name_translation}
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
                                                <div class='common_image common_image_avatar_list' style='${row.avatar==null?'':`background-image:url(${row.avatar});`}'></div>
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
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      user_account_id:number,
 *                      user_account_id_profile:number,
 *                      detailchoice:number
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonDialogueShow:CommonModuleCommon['commonDialogueShow'],
 *                      commonFFB:CommonModuleCommon['commonFFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle,
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
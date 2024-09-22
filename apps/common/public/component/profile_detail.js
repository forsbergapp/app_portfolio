/**
 * @module apps/common/component/profile_detail
 */
/**
 * Displays profile detail
 * @param {{spinner:string,
 *          user_account_id:number,
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
 *                  date_created:string,
 *                  avatar:string,
 *                  provider_image:string,
 *                  username:string}]|[]}} props
 */
const template = props => ` ${props.spinner==''?
                                `${props.list.map(row=>
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
                                                    ${row.NAME}
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
                                }`:
                                `<div class='${props.spinner}'></div>`
                            }
                            ` ;
/**
* 
* @param {{common_document:import('../../../common_types.js').CommonAppDocument,
*          common_mountdiv:string,
*          user_account_id:number,
*          user_account_id_profile:number,
*          detailchoice:number,
*          function_show_common_dialogue:function,
*          function_click:function,
*          function_FFB:function}} props 
* @returns {Promise.<{ props:{function_post:function|null}, 
*                      data:null, 
*                      template:string}>}
*/
const component = async props => {

    if (!props.user_account_id)
        props.function_show_common_dialogue('LOGIN');
   const post_component = async () =>{
        let path;
        switch (props.detailchoice){
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
       const list = await props.function_FFB(`${path}/${props.user_account_id_profile}`, `detailchoice=${props.detailchoice}`, 'GET', 'APP_ACCESS', null)
                                   .then((/**@type{string}*/result)=>JSON.parse(result));

       props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = template({  spinner:'',
                                                                                                user_account_id:props.user_account_id,
                                                                                                user_account_id_profile:props.user_account_id_profile,
                                                                                                detailchoice:props.detailchoice,
                                                                                                list:list
                                                                                            });
        props.common_document.querySelector('#common_profile_detail_list')['data-function'] = props.function_click;
  };

  return {
      props:  {function_post:props.user_account_id?post_component:null},
      data:   null,
      template: template({  spinner:'css_spinner',
                            user_account_id:props.user_account_id,
                            user_account_id_profile:props.user_account_id_profile,
                            detailchoice:props.detailchoice,
                            list:[]
      })
  };
};
export default component;
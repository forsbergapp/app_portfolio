/**
 * @module apps/common/component/common_dialogue_profile_info_detail
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
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      user_account_id:number,
 *                      user_account_id_profile:number,
 *                      detailchoice:number
 *                      },
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      show_common_dialogue:import('../../../common_types.js').CommonModuleCommon['show_common_dialogue'],
 *                      function_click:function,
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB']
 *                      },
 *          lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycleReturn,
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {

    if (!props.data.user_account_id)
        props.methods.show_common_dialogue('LOGIN');
   const onMounted = async () =>{
        if (props.data.user_account_id){
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
           const list = await props.methods.FFB(`${path}/${props.data.user_account_id_profile}`, `detailchoice=${props.data.detailchoice}`, 'GET', 'APP_ACCESS', null)
                                       .then((/**@type{string}*/result)=>JSON.parse(result));
    
           props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = template({  spinner:'',
                                                                                                    user_account_id:props.data.user_account_id,
                                                                                                    user_account_id_profile:props.data.user_account_id_profile,
                                                                                                    detailchoice:props.data.detailchoice,
                                                                                                    list:list
                                                                                                });
            props.methods.common_document.querySelector('#common_profile_detail_list')['data-function'] = props.methods.function_click;
        }
        else
        props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = '';
  };
  return {
      lifecycle:  {onMounted:onMounted},
      data:   null,
      methods:null,
      template: template({  spinner:'css_spinner',
                            user_account_id:props.data.user_account_id,
                            user_account_id_profile:props.data.user_account_id_profile,
                            detailchoice:props.data.detailchoice,
                            list:[]
      })
  };
};
export default component;
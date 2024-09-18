/**
 * @module apps/admin/component/menu_users_list
 */
/**
 * Displays stat of users
 * @param {{spinner:string,
 *          user_account_id:number,
 *          user_app_role_id:number,
 *          users:[{id:number,
 *                  avatar:string, 
 *                  app_role_id:number|null, 
 *                  app_role_icon:string, 
 *                  active:0|1|null,
 *                  level:number|null,
 *                  private:number|null,
 *                  username:string,
 *                  bio:string,
 *                  email:string,
 *                  email_unverified:string,
 *                  password_reminder:string,
 *                  verification_code:string,
 *                  identity_provider:number,
 *                  provider_name:string,
 *                  provider_id:string,
 *                  provider_first_name:string,
 *                  provider_last_name:string,
 *                  provider_image:string,
 *                  provider_image_url:string,
 *                  provider_email:string,
 *                  date_created:string
 *                  date_modified:string
 *                  }]|[],
 *          function_get_order_by:function}} props
*/
const template = props => ` ${props.spinner!=''?
                                    `<div class='${props.spinner}'</div>`:
                                    ''
                            }
                            ${props.spinner==''?
                                `<div class='list_user_account_row'>
                                    <div data-column='avatar' class='list_user_account_col list_title common_icon ${props.function_get_order_by('avatar')}'></div>
                                    <div data-column='id' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('id')}'></div>
                                    <div data-column='app_role_id' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('app_role_id')}'></div>
                                    <div data-column='app_role_icon' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('app_role_icon')}'></div>
                                    <div data-column='active' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('active')}'></div>
                                    <div data-column='user_level' class='list_user_account_col list_sort_click list_title ${props.function_get_order_by('user_level')}'></div>
                                    <div data-column='private' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('private')}'></div>
                                    <div data-column='username' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('username')}'></div>
                                    <div data-column='bio' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('bio')}'></div>
                                    <div data-column='email' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('email')}'></div>
                                    <div data-column='emal_unverified' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('email_unverified')}'></div>
                                    <div data-column='password' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('password')}'></div>
                                    <div data-column='password_reminder' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('password_reminder')}'></div>
                                    <div data-column='verification_code' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('verification_code')}'></div>
                                    <div data-column='identity_provider_id' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('provider_id')}'></div>
                                    <div data-column='provider_name' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('provider_name')}'></div>
                                    <div data-column='provider_id' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('provider_id')}'></div>
                                    <div data-column='provider_first_name' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('provider_name')}'></div>
                                    <div data-column='provider_last_name' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('provider_last_name')}'></div>
                                    <div data-column='provider_image' class='list_user_account_col list_title common_icon ${props.function_get_order_by('provider_image')}'></div>
                                    <div data-column='provider_image_url' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('provider_image_url')}'></div>
                                    <div data-column='provider_email' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('provider_email')}'></div>
                                    <div data-column='date_created' class='list_user_account_col list_sort_click list_title common_icon ${props.function_get_order_by('date_created')}'></div>
                                    <div data-column='date_modified' class='list_apps_col list_sort_click list_title common_icon ${props.function_get_order_by('date_modified')}'></div>
                                </div>
                                ${props.users.map(user=>
                                    `<div data-changed-record='0' data-user_account_id='${user.id}' class='list_user_account_row ${user.id==props.user_account_id?'list_current_user_row':''} common_row' >
                                        <div class='list_user_account_col'>
                                            <div class='list_readonly'>
                                                <div class='common_image common_image_avatar_list' style='background-image:url("${user.avatar}");'></div>
                                            </div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div class='list_readonly'>${user.id}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div contentEditable='${props.user_app_role_id==0?'true':'false'}' class='common_input list_edit ${props.user_app_role_id==0?'common_input_lov':''}' data-defaultValue='${user.app_role_id ?? ''}'/>${user.app_role_id ?? ''}</div>
                                            ${props.user_app_role_id==0?
                                                '<div class=\'common_lov_button common_list_lov_click common_icon\'></div>':
                                                ''
                                            }
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div class='list_readonly common_lov_value'>${user.app_role_icon}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div contentEditable='${props.user_app_role_id==0?'true':'false'}' class='common_input list_edit'/>${user.active ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div contentEditable='${props.user_app_role_id==0?'true':'false'}' class='common_input list_edit'/>${user.level ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div contentEditable='${props.user_app_role_id==0?'true':'false'}' class='common_input list_edit'/>${user.private ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div contentEditable='${props.user_app_role_id==0?'true':'false'}' class='common_input list_edit'/>${user.username ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div contentEditable='${props.user_app_role_id==0?'true':'false'}' class='common_input list_edit'/>${user.bio ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div contentEditable='${props.user_app_role_id==0?'true':'false'}' class='common_input list_edit'/>${user.email ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div contentEditable='${props.user_app_role_id==0?'true':'false'}' class='common_input list_edit'/>${user.email_unverified ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div contentEditable='${props.user_app_role_id==0?'true':'false'}' class='common_input list_edit common_input_password' placeholder='******'/></div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div contentEditable='${props.user_app_role_id==0?'true':'false'}' class='common_input list_edit'/>${user.password_reminder ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div contentEditable='${props.user_app_role_id==0?'true':'false'}' class='common_input list_edit'/>${user.verification_code ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div class='list_readonly'>${user.identity_provider ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div class='list_readonly'>${user.provider_name ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div class='list_readonly'>${user.provider_id ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div class='list_readonly'>${user.provider_first_name ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div class='list_readonly'>${user.provider_last_name ?? ''}</div>                        
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div class='list_readonly'>
                                                <div class='common_image common_image_avatar_list' style='background-image:url("${user.provider_image}");'></div>
                                            </div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div class='list_readonly'>${user.provider_image_url ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div class='list_readonly'>${user.provider_email ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div class='list_readonly'>${user.date_created ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_col'>
                                            <div class='list_readonly'>${user.date_modified ?? ''}</div>
                                        </div>
                                    </div>`
                                ).join('')}`:
                                ''
                            }`;
/**
* 
* @param {{common_document:import('../../../common_types.js').CommonAppDocument,
*          common_mountdiv:string,
*          user_account_id:number,
*          user_app_role_id:number,
*          sort:string,
*          order_by:string,
*          focus:boolean,
*          function_list_url_style:function,
*          function_FFB:function}} props 
* @returns {Promise.<{ props:{function_post:function}, 
*                      data:null, 
*                      template:string}>}
*/
const component = async props => {
  
    /**
     * Get order by if column matches
     * @param {string} column
     */
    const get_order_by = column =>column==props.sort?props.order_by:'';

    const post_component = async () =>{
        let search_user='*';
        //show all records if no search criteria
        if (props.common_document.querySelector('#list_user_account_search_input').innerText.replaceAll('\n','')!='')
            search_user = encodeURI(props.common_document.querySelector('#list_user_account_search_input').innerText.replaceAll('\n',''));
        const users = await props.function_FFB('/server-db_admin/user_account', `search=${search_user}&sort=${props.sort}&order_by=${props.order_by}`, 'GET', 'APP_ACCESS', null)
                                .then((/**@type{string}*/result)=>JSON.parse(result).rows);
      
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template({  spinner:'',
                                                                                                        user_account_id:props.user_account_id,
                                                                                                        user_app_role_id:props.user_app_role_id,
                                                                                                        users:users,
                                                                                                        function_get_order_by:get_order_by
                                                                                                        });
        if (props.common_document.querySelectorAll('#list_user_account .list_edit')[0])
            if (props.focus==true){
                //set focus at start
                //set focus first column in first row
                //this will trigger to show detail records
                if (props.common_document.querySelectorAll('#list_user_account .list_edit')[0].getAttribute('readonly')==true){
                    props.common_document.querySelectorAll('#list_user_account .list_edit')[0].setAttribute('readonly', false);
                    props.common_document.querySelectorAll('#list_user_account .list_edit')[0].focus();
                    props.common_document.querySelectorAll('#list_user_account .list_edit')[0].setAttribute('readonly', true);
                }
                else
                    props.common_document.querySelectorAll('#list_user_account .list_edit')[0].focus();
                    
            }
            else{
                //trigger focus event on first row set focus back again to search field
                props.common_document.querySelectorAll('#list_user_account .list_edit')[0].focus();
                props.common_document.querySelector('#list_user_account_search_input').focus();
            }
  };
  /**
   * @param {{  spinner:string,
   *            user_account_id:number,
   *            user_app_role_id:number,
   *            users:[{id:number,
   *                    avatar:string, 
   *                    app_role_id:number|null, 
   *                    app_role_icon:string, 
   *                    active:0|1|null,
   *                    level:number|null,
   *                    private:number|null,
   *                    username:string,
   *                    bio:string,
   *                    email:string,
   *                    email_unverified:string,
   *                    password_reminder:string,
   *                    verification_code:string,
   *                    identity_provider:number,
   *                    provider_name:string,
   *                    provider_id:string,
   *                    provider_first_name:string,
   *                    provider_last_name:string,
   *                    provider_image:string,
   *                    provider_image_url:string,
   *                    provider_email:string,
   *                    date_created:string
   *                    date_modified:string
   *                  }]|[],
   *            function_get_order_by:function}} template_props
   */
  const render_template = template_props =>{
      return template({ spinner:template_props.spinner,
                        user_account_id:template_props.user_account_id,
                        user_app_role_id:template_props.user_app_role_id,
                        users:template_props.users,
                        function_get_order_by:template_props.function_get_order_by
      });
  };
  return {
      props:  {function_post:post_component},
      data:   null,
      template: render_template({   spinner:'css_spinner',
                                    user_account_id:props.user_account_id,
                                    user_app_role_id:props.user_app_role_id,
                                    users:[],
                                    function_get_order_by:get_order_by
      })
  };
};
export default component;
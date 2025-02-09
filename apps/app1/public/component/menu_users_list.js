/**
 * Displays stat of users
 * @module apps/app1/component/menu_users_list
 */

/**
 * @import {CommonIAMUser, CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{user_account_id:number,
 *          users:CommonIAMUser[],
 *          function_get_order_by:function}} props
 * @returns {string}
 */
const template = props => ` <div class='menu_users_list_row'>
                                <div data-column='avatar' class='menu_users_list_col list_title common_icon ${props.function_get_order_by('avatar')}'></div>
                                <div data-column='id' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('id')}'></div>
                                <div data-column='type' class='menu_users_list_col list_sort_click list_title ${props.function_get_order_by('type')}'></div>
                                <div data-column='active' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('active')}'></div>
                                <div data-column='status' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('status')}'></div>
                                <div data-column='user_level' class='menu_users_list_col list_sort_click list_title ${props.function_get_order_by('user_level')}'></div>
                                <div data-column='private' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('private')}'></div>
                                <div data-column='username' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('username')}'></div>
                                <div data-column='bio' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('bio')}'></div>
                                <div data-column='email' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('email')}'></div>
                                <div data-column='emal_unverified' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('email_unverified')}'></div>
                                <div data-column='password' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('password')}'></div>
                                <div data-column='password_reminder' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('password_reminder')}'></div>
                                <div data-column='verification_code' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('verification_code')}'></div>
                                <div data-column='date_created' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('date_created')}'></div>
                                <div data-column='date_modified' class='menu_apps_col list_sort_click list_title common_icon ${props.function_get_order_by('date_modified')}'></div>
                            </div>
                            ${props.users.map(user=>
                                `<div data-changed-record='0' data-user_account_id='${user.id}' class='menu_users_list_row ${user.id==props.user_account_id?'list_current_user_row':''} common_row' >
                                    <div data-column='avatar' data-image=${user.avatar} class='menu_users_list_col list_readonly common_image common_image_avatar_list' style='${user.avatar==null?'':`background-image:url(${user.avatar});`}'></div>
                                    <div data-column='id' class='menu_users_list_col list_readonly'>${user.id}</div>
                                    <div data-column='type' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.type ?? ''}</div>
                                    <div data-column='active' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.active ?? ''}</div>
                                    <div data-column='status' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.status ?? ''}</div>
                                    <div data-column='user_level' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.user_level ?? ''}</div>
                                    <div data-column='private' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.private ?? ''}</div>
                                    <div data-column='username' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.username ?? ''}</div>
                                    <div data-column='bio' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.bio ?? ''}</div>
                                    <div data-column='email' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.email ?? ''}</div>
                                    <div data-column='email_unverified' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.email_unverified ?? ''}</div>
                                    <div data-column='password' class='menu_users_list_col common_input list_edit common_input_password' contentEditable='true' placeholder='******'></div>
                                    <div data-column='password_reminder' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.password_reminder ?? ''}</div>
                                    <div data-column='verification_code' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.verification_code ?? ''}</div>
                                    <div data-column='created' class='menu_users_list_col list_readonly'>${user.created ?? ''}</div>
                                    <div data-column='modified' class='menu_users_list_col list_readonly'>${user.modified ?? ''}</div>
                                </div>`
                            ).join('')
                            }`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{ data:{      commonMountdiv:string,
 *                       user_account_id:number,
 *                       sort:string,
 *                       order_by:string},
 *           methods:{   COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       commonFFB:CommonModuleCommon['commonFFB']},
 *           lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
  
    /**
     * Get order by if column matches
     * @param {string} column
     */
    const get_order_by = column =>column==props.data.sort?props.data.order_by:'';

    let search_user='*';
    //show all records if no search criteria
    if (props.methods.COMMON_DOCUMENT.querySelector('#menu_users_list_search_input').textContent!='')
        search_user = encodeURI(props.methods.COMMON_DOCUMENT.querySelector('#menu_users_list_search_input').textContent);
    const users = await props.methods.commonFFB({path:'/server-iam/iam_user', query:`search=${search_user}&sort=${props.data.sort}&order_by=${props.data.order_by}`, method:'GET', authorization_type:'ADMIN'})
                            .then((/**@type{string}*/result)=>JSON.parse(result).rows);

    const onMounted = async () =>{
        if (props.methods.COMMON_DOCUMENT.querySelectorAll('#menu_users_list .list_edit')[0])
            //set focus first column in first row
            //this will trigger to show detail records
            props.methods.COMMON_DOCUMENT.querySelectorAll('#menu_users_list .list_edit')[0].dispatchEvent(new Event('focus'));

  };
  return {
      lifecycle:    {onMounted:onMounted},
      data:         null,
      methods:      null,
      template:     template({  user_account_id:props.data.user_account_id,
                                users:users,
                                function_get_order_by:get_order_by
      })
  };
};
export default component;
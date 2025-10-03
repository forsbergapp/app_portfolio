/**
 * Displays stat of users
 * @module apps/app1/component/menu_users_list
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{iam_user_id:number,
 *          users:common['ORM']['Object']['IamUser'][],
 *          function_get_order_by:function}} props
 * @returns {string}
 */
const template = props => ` <div class='menu_users_list_row'>
                                <div data-column='Avatar' class='menu_users_list_col list_title common_icon ${props.function_get_order_by('avatar')}'></div>
                                <div data-column='Id' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('Id')}'></div>
                                <div data-column='Type' class='menu_users_list_col list_sort_click list_title ${props.function_get_order_by('Type')}'></div>
                                <div data-column='Active' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('Active')}'></div>
                                <div data-column='Status' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('Status')}'></div>
                                <div data-column='UserLevel' class='menu_users_list_col list_sort_click list_title ${props.function_get_order_by('UserLevel')}'></div>
                                <div data-column='Private' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('Private')}'></div>
                                <div data-column='Username' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('Username')}'></div>
                                <div data-column='Bio' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('Bio')}'></div>
                                <div data-column='OtpKey' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('OtpKey')}'></div>
                                <div data-column='Password' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('Password')}'></div>
                                <div data-column='PasswordReminder' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('PasswordReminder')}'></div>
                                <div data-column='Created' class='menu_users_list_col list_sort_click list_title common_icon ${props.function_get_order_by('Created')}'></div>
                                <div data-column='Modified' class='menu_apps_col list_sort_click list_title common_icon ${props.function_get_order_by('Modified')}'></div>
                            </div>
                            ${props.users.map(user=>
                                `<div data-changed-record='0' data-iam_user_id='${user.Id}' class='menu_users_list_row ${user.Id==props.iam_user_id?'list_current_user_row':''} common_row' >
                                    <div data-column='Avatar' data-image=${user.Avatar} class='menu_users_list_col list_readonly common_image common_image_avatar_list' style='${user.Avatar==null?'':`background-image:url(${user.Avatar});`}'></div>
                                    <div data-column='Id' class='menu_users_list_col list_readonly'>${user.Id}</div>
                                    <div data-column='Type' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.Type ?? ''}</div>
                                    <div data-column='Active' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.Active ?? ''}</div>
                                    <div data-column='Status' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.Status ?? ''}</div>
                                    <div data-column='UserLevel' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.UserLevel ?? ''}</div>
                                    <div data-column='Private' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.Private ?? ''}</div>
                                    <div data-column='Username' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.Username ?? ''}</div>
                                    <div data-column='Bio' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.Bio ?? ''}</div>
                                    <div data-column='OtpKey' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.OtpKey ?? ''}</div>
                                    <div data-column='Password' class='menu_users_list_col common_input list_edit' contentEditable='true' ></div>
                                    <div data-column='PasswordReminder' class='menu_users_list_col common_input list_edit' contentEditable='true'>${user.PasswordReminder ?? ''}</div>
                                    <div data-column='Created' class='menu_users_list_col list_readonly'>${user.Created ?? ''}</div>
                                    <div data-column='Modified' class='menu_users_list_col list_readonly'>${user.Modified ?? ''}</div>
                                </div>`
                            ).join('')
                            }`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{ data:{      commonMountdiv:string,
 *                       iam_user_id:number,
 *                       sort:string,
 *                       order_by:string},
 *           methods:{   COMMON:common['CommonModuleCommon']},
 *           lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
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
    if (props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_users_list_search_input').textContent!='')
        search_user = encodeURI(props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_users_list_search_input').textContent);
    const users = await props.methods.COMMON.commonFFB({path:'/server-iam-admin/iamuser/', query:`search=${search_user}&sort=${props.data.sort}&order_by=${props.data.order_by}`, method:'GET', authorization_type:'ADMIN'})
                            .then((/**@type{string}*/result)=>JSON.parse(result).rows);

    const onMounted = async () =>{
        if (props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll('#menu_users_list .list_edit')[0])
            //set focus first column in first row
            //this will trigger to show detail records
            props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll('#menu_users_list .list_edit')[0].focus();

  };
  return {
      lifecycle:    {onMounted:onMounted},
      data:         null,
      methods:      null,
      template:     template({  iam_user_id:props.data.iam_user_id,
                                users:users,
                                function_get_order_by:get_order_by
      })
  };
};
export default component;
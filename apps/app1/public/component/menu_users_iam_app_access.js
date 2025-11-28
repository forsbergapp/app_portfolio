/**
 * Displays stat of users
 * @module apps/app1/component/menu_users_logon
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{user_logons:common['server']['ORM']['Object']['IamAppAccess'][]}} props
 * @returns {string}
 */
const template = props => ` <div id='menu_users_iam_app_access_row_title' class='menu_users_iam_app_access_row'>
                                <div class='menu_users_iam_app_access_col list_title'>USER ACCOUNT ID</div>
                                <div class='menu_users_iam_app_access_col list_title'>DATE CREATED</div>
                                <div class='menu_users_iam_app_access_col list_title'>APP ID</div>
                                <div class='menu_users_iam_app_access_col list_title'>RESULT</div>
                                <div class='menu_users_iam_app_access_col list_title'>IP</div>
                                <div class='menu_users_iam_app_access_col list_title'>USER AGENT</div>
                                <div class='menu_users_iam_app_access_col list_title'>ACCESS TOKEN</div>
                            </div>
                            ${props.user_logons.map(user_logon=>
                                `<div data-changed-record='0' class='menu_users_iam_app_access_row'>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.Id}</div>
                                    </div>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.Created ?? ''}</div>
                                    </div>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.AppId}</div>
                                    </div>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.Res}</div>
                                    </div>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.Ip}</div>
                                    </div>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.Ua}</div>
                                    </div>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.Token ?? ''}</div>
                                    </div>
                                </div>`
                            ).join('')
                            }`;
/**
 * @name component
 * @description Component
 * @function 
 * @param {{ data:{      commonMountdiv:string,
 *                       iam_user_id:number},
 *           methods:{   COMMON:common['CommonModuleCommon']},
 *           lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const user_logon = await props.methods.COMMON.commonFFB({path:'/server-iam/iamappaccess', query:`iam_user_id=${props.data.iam_user_id}&data_app_id=`, method:'GET', authorization_type:'ADMIN'})
                                    .then((/**@type{string}*/result)=>JSON.parse(result).rows);
 
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({user_logons:user_logon})
    };
};
export default component;
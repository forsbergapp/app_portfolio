/**
 * Displays stat of users
 * @module apps/app1/component/menu_users_logon
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{user_logons:[{  id:number,
 *                          app_id:number,
 *                          res:string,
 *                          ip:string,
 *                          long:string|null,
 *                          lat:string|null,
 *                          ua:string,
 *                          token:string|null,
 *                          created:string}]|[]}} props
 * @returns {string}
 */
const template = props => ` <div id='menu_users_iam_app_access_row_title' class='menu_users_iam_app_access_row'>
                                <div id='menu_users_iam_app_access_col_title1' class='menu_users_iam_app_access_col list_title'>USER ACCOUNT ID</div>
                                <div id='menu_users_iam_app_access_col_title2' class='menu_users_iam_app_access_col list_title'>DATE CREATED</div>
                                <div id='menu_users_iam_app_access_col_title3' class='menu_users_iam_app_access_col list_title'>APP ID</div>
                                <div id='menu_users_iam_app_access_col_title4' class='menu_users_iam_app_access_col list_title'>RESULT</div>
                                <div id='menu_users_iam_app_access_col_title5' class='menu_users_iam_app_access_col list_title'>IP</div>
                                <div id='menu_users_iam_app_access_col_title6' class='menu_users_iam_app_access_col list_title'>GPS LONG</div>
                                <div id='menu_users_iam_app_access_col_title7' class='menu_users_iam_app_access_col list_title'>GPS LAT</div>
                                <div id='menu_users_iam_app_access_col_title8' class='menu_users_iam_app_access_col list_title'>USER AGENT</div>
                                <div id='menu_users_iam_app_access_col_title9' class='menu_users_iam_app_access_col list_title'>ACCESS TOKEN</div>
                            </div>
                            ${props.user_logons.map(user_logon=>
                                `<div data-changed-record='0' class='menu_users_iam_app_access_row'>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.id}</div>
                                    </div>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.created ?? ''}</div>
                                    </div>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.app_id}</div>
                                    </div>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.res}</div>
                                    </div>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.ip}</div>
                                    </div>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.long ?? ''}</div>
                                    </div>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.lat ?? ''}</div>
                                    </div>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.ua}</div>
                                    </div>
                                    <div class='menu_users_iam_app_access_col'>
                                        <div class='list_readonly'>${user_logon.token ?? ''}</div>
                                    </div>
                                </div>`
                            ).join('')
                            }`;
/**
 * @name component
 * @description Component
 * @function 
 * @param {{ data:{      commonMountdiv:string,
 *                       user_account_id:number},
 *           methods:{   COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       commonFFB:CommonModuleCommon['commonFFB']},
 *           lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const user_logon = await props.methods.commonFFB({path:'/server-iam/iam_app_access', query:`data_user_account_id=${props.data.user_account_id}&data_app_id=`, method:'GET', authorization_type:'ADMIN'})
                                    .then((/**@type{string}*/result)=>JSON.parse(result).rows);
 
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({user_logons:user_logon})
    };
};
export default component;
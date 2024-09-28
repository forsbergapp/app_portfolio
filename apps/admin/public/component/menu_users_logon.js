/**
 * @module apps/admin/component/menu_users_logon
 */
/**
 * Displays stat of users
 * @param {{spinner:string,
 *          user_logons:[{  user_account_id:number,
 *                          app_id:number,
 *                          result:string,
 *                          client_ip:string,
 *                          client_longitude:string|null,
 *                          client_latitude:string|null,
 *                          client_user_agent:string,
 *                          access_token:string|null,
 *                          date_created:string
 *                          date_modified:string}]|[]}} props
 */
const template = props => ` ${props.spinner!=''?
                                `<div class='${props.spinner}'></div>`:
                                ''
                            }
                            ${props.spinner==''?
                                `<div id='list_user_account_logon_row_title' class='list_user_account_logon_row'>
                                    <div id='list_user_account_logon_col_title1' class='list_user_account_logon_col list_title'>USER ACCOUNT ID</div>
                                    <div id='list_user_account_logon_col_title2' class='list_user_account_logon_col list_title'>DATE CREATED</div>
                                    <div id='list_user_account_logon_col_title3' class='list_user_account_logon_col list_title'>APP ID</div>
                                    <div id='list_user_account_logon_col_title4' class='list_user_account_logon_col list_title'>RESULT</div>
                                    <div id='list_user_account_logon_col_title5' class='list_user_account_logon_col list_title'>IP</div>
                                    <div id='list_user_account_logon_col_title6' class='list_user_account_logon_col list_title'>GPS LONG</div>
                                    <div id='list_user_account_logon_col_title7' class='list_user_account_logon_col list_title'>GPS LAT</div>
                                    <div id='list_user_account_logon_col_title8' class='list_user_account_logon_col list_title'>USER AGENT</div>
                                    <div id='list_user_account_logon_col_title9' class='list_user_account_logon_col list_title'>ACCESS TOKEN</div>
                                </div>
                                ${props.user_logons.map(user_logon=>
                                    `<div data-changed-record='0' class='list_user_account_logon_row'>
                                        <div class='list_user_account_logon_col'>
                                            <div class='list_readonly'>${user_logon.user_account_id}</div>
                                        </div>
                                        <div class='list_user_account_logon_col'>
                                            <div class='list_readonly'>${user_logon.date_created ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_logon_col'>
                                            <div class='list_readonly'>${user_logon.app_id}</div>
                                        </div>
                                        <div class='list_user_account_logon_col'>
                                            <div class='list_readonly'>${user_logon.result}</div>
                                        </div>
                                        <div class='list_user_account_logon_col'>
                                            <div class='list_readonly'>${user_logon.client_ip}</div>
                                        </div>
                                        <div class='list_user_account_logon_col'>
                                            <div class='list_readonly'>${user_logon.client_longitude ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_logon_col'>
                                            <div class='list_readonly'>${user_logon.client_latitude ?? ''}</div>
                                        </div>
                                        <div class='list_user_account_logon_col'>
                                            <div class='list_readonly'>${user_logon.client_user_agent}</div>
                                        </div>
                                        <div class='list_user_account_logon_col'>
                                            <div class='list_readonly'>${user_logon.access_token ?? ''}</div>
                                        </div>
                                    </div>`
                                ).join('')
                                }`:
                                ''
                            }`;
/**
* 
* @param {{ data:{      common_mountdiv:string,
*                       user_account_id:number},
*           methods:{   common_document:import('../../../common_types.js').CommonAppDocument,
*                       FFB:import('../../../common_types.js').CommonModuleCommon['FFB']},
*           lifecycle:  null}} props
* @returns {Promise.<{ lifecycle:{onMounted:function}, 
*                      data:null, 
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {
    const onMounted = async () =>{
        const user_logon = await props.methods.FFB('/server-db_admin/user_account_logon', `data_user_account_id=${props.data.user_account_id}&data_app_id=''`, 'GET', 'APP_ACCESS', null)
                                    .then((/**@type{string}*/result)=>JSON.parse(result));
        props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = template({spinner:'',
                                                                                                            user_logons:user_logon
                                                                                                            });
};
 
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({spinner:'css_spinner',
                            user_logons:[]
        })
};
};
export default component;
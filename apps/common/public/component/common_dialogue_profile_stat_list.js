/**
 * @module apps/common/component/common_dialogue_profile_stat_list
 */

/**
* 
* @param {{stat_list:import('../../../common_types.js').CommonProfileStatRecord[]|[]}} props 
* @returns 
*/
const template = props =>`   
                            ${props.stat_list.map(row=>
                                `   <div data-user_account_id='${row.id}' class='common_profile_stat_list_row common_row'>
                                        <div class='common_profile_stat_list_col'>
                                            <div class='common_profile_stat_list_user_account_id'>${row.id}</div>
                                        </div>
                                        <div class='common_profile_stat_list_col'>
                                            <div class='common_image common_image_avatar_list' style='background-image:url("${row.avatar ?? row.provider_image}");'></div>
                                        </div>
                                        <div class='common_profile_stat_list_col'>
                                            <div class='common_profile_stat_list_username common_wide_list_column common_link'>
                                                ${row.username}
                                            </div>
                                        </div>
                                        <div class='common_profile_stat_list_col'>
                                            <div class='common_profile_stat_list_count'>${row.count}</div>
                                        </div>
                                    </div>`
                            ).join('')
                            }`;

/**
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      stat_choice:number,
 *                      stat_list_app_rest_url:string,
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
 *                      commonFFB:import('../../../common_types.js').CommonModuleCommon['commonFFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    let path;
    if (props.data.stat_choice ==1 || props.data.stat_choice ==2 || props.data.stat_choice ==3){
        /*statschoice 1,2,3: user_account*/
        path = '/server-db/user_account-profile-stat';
    }
    else{
        /*other statschoice, apps can use >3 and return same columns*/
        path = props.data.stat_list_app_rest_url ?? '';
    }
    /**@type{import('../../../common_types.js').CommonProfileStatRecord[]} */
    const stat_list = await props.methods.commonFFB({path:path, query:`statchoice=${props.data.stat_choice}`, method:'GET', authorization_type:'APP_DATA'})
                                    .then((/**@type{string}*/result)=>JSON.parse(result).rows);

    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({stat_list:stat_list})
    };
};
export default component;
/**
 * @module apps/common/component/profile_search_list
 */

/**
 * 
 * @param {{
 *          records:import('../../../common_types.js').CommonProfileSearchRecord[]
 *          } props 
 * @returns {string}
 */
const template = props =>`  <div id='common_profile_search_list' <SPINNER_CLASS/>>
                                ${props.records.map(row=>
                                    `<div data-user_account_id='${row.id}' class='common_profile_search_list_row common_row' tabindex=-1>
                                        <div class='common_profile_search_list_col'>
                                            <div class='common_profile_search_list_user_account_id'>${row.id}</div>
                                        </div>
                                        <div class='common_profile_search_list_col'>
                                            <div class='common_image common_image_avatar_list' style='background-image:url("${row.avatar ?? row.provider_image}");'></div>
                                        </div>
                                        <div class='common_profile_search_list_col'>
                                            <div class='common_profile_search_list_username common_wide_list_column common_link'>
                                                ${row.username}
                                            </div>
                                        </div>
                                    </div>`).join('')
                                }
                            </div>`;
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          user_account_id:number,
 *          searched_username:string,
 *          client_latitude:string,
 *          client_longitude:string,
 *          function_click_function:function,
 *          function_FFB:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    let spinner = 'class=\'css_spinner\'';
    
    /**
     * 
     * @param {{
     *          records:import('../../../common_types.js').CommonProfileSearchRecord[]}} props 
     * @returns {string}
     */
    const render_template = props =>{
        return template(props)
                .replace('<SPINNER_CLASS/>', spinner);
    };
    const post_component = async () =>{
        const records = await props.function_FFB(   '/server-db/user_account-profile/', 
                                                    `id=${props.user_account_id ?? ''}&search=${encodeURI(props.searched_username)}` +
                                                    `&client_latitude=${props.client_latitude}&client_longitude=${props.client_longitude}`, 
                                                    'GET', 'APP_DATA', null)
                                        .then((/**@type{string}*/result)=>JSON.parse(result).rows)
                                        .catch((/**@type{Error}*/error)=>{throw error;});
        spinner = '';
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = 
            render_template({
                                records:records
                            });
        props.common_document.querySelector('#common_profile_search_list')['data-function'] = props.function_click_function;
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template({records:[]})
    };
};
export default component;
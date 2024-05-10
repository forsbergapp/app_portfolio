/**@type{{querySelector:function}} */
const AppDocument = document;
/**
 * @typedef {{id:number, avatar:string, provider_image:string, username:string}} record_type
 */
/**
 * 
 * @param {{
 *          records:record_type[],
 *          function_list_image_format_src:function}
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
                                            <img class='common_profile_search_list_avatar' ${props.function_list_image_format_src(row.avatar ?? row.provider_image)}> 
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
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          user_account_id:number,
 *          searched_username:string,
 *          client_latitude:string,
 *          client_longitude:string,
 *          function_list_image_format_src:function,
 *          function_click_function:function,
 *          function_FFB:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    let spinner = `class='css_spinner'`;
    
    /**
     * 
     * @param {{
     *          records:record_type[],
     *          function_list_image_format_src:function}} props 
     * @returns {string}
     */
    const render_template = props =>{
        return template(props)
                .replace('<SPINNER_CLASS/>', spinner);
    }
    const post_component = async () =>{
        let path;
        let token;
        let json_data;
        if (props.user_account_id!=null){
            //search using access token with logged in user_account_id
            path = '/user_account/profile/username/searcha';
            token = 'APP_ACCESS';
            json_data = {   user_account_id:    props.user_account_id,
                            client_latitude:    props.client_latitude,
                            client_longitude:   props.client_longitude
                        };
        }
        else{
            //search using data token without logged in user_account_id
            path = '/user_account/profile/username/searchd';
            token = 'APP_DATA';
            json_data = {   client_latitude:    props.client_latitude,
                            client_longitude:   props.client_longitude
                        };
        }
        const records = await props.function_FFB('DB_API', path, `search=${encodeURI(props.searched_username)}`, 'POST', token, json_data)
                                        .then((/**@type{string}*/result)=>JSON.parse(result))
                                        .catch((/**@type{Error}*/error)=>{throw error});
        spinner = '';
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = 
            render_template({
                                records:records,
                                function_list_image_format_src:props.function_list_image_format_src
                            });
        AppDocument.querySelector('#common_profile_search_list')['data-function'] = props.function_click_function;
    }
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template({records:[], function_list_image_format_src:props.function_list_image_format_src})
    };
}
export default component;
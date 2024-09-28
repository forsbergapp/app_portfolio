/**
 * @module apps/common/component/profile_search_list
 */

/**
 * 
 * @param {{
 *          spinner:string,
 *          records:import('../../../common_types.js').CommonProfileSearchRecord[]
 *          }} props 
 * @returns {string}
 */
const template = props =>`  <div id='common_profile_search_list' ${props.spinner}>
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
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      user_account_id:number,
 *                      client_latitude:string,
 *                      client_longitude:string},
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      input_control:import('../../../common_types.js').CommonModuleCommon['input_control'],
 *                      function_click_function:function,
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB']},
 *          lifecycle:  null}} props
 * @returns {Promise.<{ props:{function_post:function|null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    //remove any old search result and input errors
    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = '';
    props.methods.common_document.querySelector('#common_profile_search_input').classList.remove('common_input_error');

    //check search text
    const searched_username = props.methods.common_document.querySelector('#common_profile_search_input').innerText;
    const input_control =   props.methods.input_control(null,{check_valid_list_elements:[[props.methods.common_document.querySelector('#common_profile_search_input'),null]]}) &&
                            props.methods.common_document.querySelector('#common_profile_search_input').innerText!='' &&
                            searched_username.length>1;
    if (!input_control){
        props.methods.common_document.querySelector('#common_profile_search_list_wrap').style.display = 'none';
        props.methods.common_document.querySelector('#common_profile_search_input').classList.add('common_input_error');
    }
    const post_component = async () =>{
        const records = await props.methods.FFB(   '/server-db/user_account-profile/', 
                                                    `id=${props.data.user_account_id ?? ''}&search=${encodeURI(searched_username)}` +
                                                    `&client_latitude=${props.data.client_latitude}&client_longitude=${props.data.client_longitude}`, 
                                                    'GET', 'APP_DATA', null)
                                        .then((/**@type{string}*/result)=>JSON.parse(result).rows)
                                        .catch((/**@type{Error}*/error)=>{throw error;});
                                    
        if (records.length>0){
            props.methods.common_document.querySelector('#common_profile_search_list_wrap').style.display = 'flex';
            props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = 
                template({
                            spinner:'',
                            records:records
                        });
            props.methods.common_document.querySelector('#common_profile_search_list')['data-function'] = props.methods.function_click_function;
        }
        else{
            //remove search list element
            props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = '';
        }
            
    };
    return {
        props:  {function_post:input_control?post_component:null},
        data:   null,
        template: template({spinner:'css_spinner',records:[]})
    };
};
export default component;
/**
 * Displays profile search list
 * @module apps/common/component/common_profile_search_list
 */

/**
 * @import {CommonProfileSearchRecord, CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonFFB']} commonFFB
 * @typedef {CommonModuleCommon['commonMiscInputControl']} commonMiscInputControl
 */

/**
 * 
 * @param {{records:CommonProfileSearchRecord[]}} props 
 * @returns {string}
 */
const template = props =>`  ${props.records.length>0?
                                `<div id='common_profile_search_list'>
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
                                </div>`:''
                            }`;
/**
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      user_account_id:number,
 *                      client_latitude:string,
 *                      client_longitude:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonMiscInputControl:commonMiscInputControl,
 *                      function_click_function:function,
 *                      commonFFB:commonFFB}}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle,
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector('#common_profile_search_input').classList.remove('common_input_error');

    //check search text
    const searched_username = props.methods.COMMON_DOCUMENT.querySelector('#common_profile_search_input').textContent;
    const commonMiscInputControl =   props.methods.commonMiscInputControl(null,{check_valid_list_elements:[[props.methods.COMMON_DOCUMENT.querySelector('#common_profile_search_input'),null]]}) &&
                            props.methods.COMMON_DOCUMENT.querySelector('#common_profile_search_input').textContent!='' &&
                            searched_username.length>1;
    if (!commonMiscInputControl){
        props.methods.COMMON_DOCUMENT.querySelector('#common_profile_search_list_wrap').style.display = 'none';
        props.methods.COMMON_DOCUMENT.querySelector('#common_profile_search_input').classList.add('common_input_error');
    }
    const records = commonMiscInputControl?await props.methods.commonFFB(
                                                {
                                                    path:   '/server-db/user_account-profile/', 
                                                    query:  `id=${props.data.user_account_id ?? ''}&search=${encodeURI(searched_username)}` +
                                                            `&client_latitude=${props.data.client_latitude}&client_longitude=${props.data.client_longitude}`, 
                                                    method: 'GET', 
                                                    authorization_type:'APP_DATA'
                                                })
                                        .then((/**@type{string}*/result)=>JSON.parse(result).rows):[];

    const onMounted = async () =>{           
        if (records.length>0){
            props.methods.COMMON_DOCUMENT.querySelector('#common_profile_search_list_wrap').style.display = 'flex';
            props.methods.COMMON_DOCUMENT.querySelector('#common_profile_search_list')['data-function'] = props.methods.function_click_function;
        }
    };
    return {
        lifecycle:  {onMounted:commonMiscInputControl?onMounted:null},
        data:       null,
        methods:    null,
        template:   template({records:records})
    };
};
export default component;
/**
 * Displays profile search list
 * @module apps/common/component/common_app_profile_search_list
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{records:common['ORM']['View']['IamUsetGetProfile'][]}} props 
 * @returns {string}
 */
const template = props =>`  ${props.records.length>0?
                                `<div id='common_app_profile_search_list'>
                                    ${props.records.map(row=>
                                        `<div data-iam_user_id='${row.Id}' class='common_app_profile_search_list_row common_row' tabindex=-1>
                                            <div class='common_app_profile_search_list_col'>
                                                <div class='common_app_profile_search_list_iam_user_id'>${row.Id}</div>
                                            </div>
                                            <div class='common_app_profile_search_list_col'>
                                                <div class='common_image common_image_avatar_list' style='${row.Avatar==null?'':`background-image:url(${row.Avatar});`}'></div>
                                            </div>
                                            <div class='common_app_profile_search_list_col'>
                                                <div class='common_app_profile_search_list_username common_wide_list_column common_link'>
                                                    ${row.Username}
                                                </div>
                                            </div>
                                        </div>`).join('')
                                    }
                                </div>`:''
                            }`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      iam_user_id:number},
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      function_click_function:function}}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'],
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_profile_search_input').classList.remove('common_input_error');

    //check search text
    const searched_username = props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_profile_search_input').textContent;
    const commonMiscInputControl =   props.methods.COMMON.commonMiscInputControl(null,{check_valid_list_elements:[[props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_profile_search_input'),null]]}) &&
                            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_profile_search_input').textContent!='' &&
                            searched_username.length>1;
    if (!commonMiscInputControl){
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_profile_search_list_wrap').style.display = 'none';
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_profile_search_input').classList.add('common_input_error');
    }
    /**@type{common['ORM']['View']['IamUsetGetProfile'][]} */
    const records = commonMiscInputControl?await props.methods.COMMON.commonFFB(
                                                {
                                                    path:   '/server-db/iamuser-profile/', 
                                                    query:  `id=${props.data.iam_user_id ?? ''}&search=${encodeURI(searched_username)}`, 
                                                    method: 'GET', 
                                                    authorization_type:'APP_ID'
                                                })
                                        .then((/**@type{string}*/result)=>JSON.parse(result).rows):[];

    const onMounted = async () =>{           
        if (records.length>0){
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_profile_search_list_wrap').style.display = 'flex';
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_profile_search_list')['data-function'] = props.methods.function_click_function;
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
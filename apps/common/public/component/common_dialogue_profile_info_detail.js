/**
 * @module apps/common/component/common_dialogue_profile_info_detail
 */
/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{iam_user_id:number,
 *          iam_user_id_profile:number,
 *          detailchoice:number,
 *          list:[{ iam_user_id:number|null, 
 *                  detail:string, 
 *                  avatar:string,
 *                  username:string}]|[]}} props
 * @returns {string}
 */
const template = props => `     ${props.list.map(row=>
                                    `<div data-iam_user_id='${row.iam_user_id}' class='common_profile_detail_list_row common_row'>
                                            <div class='common_profile_detail_list_col'>
                                                <div class='common_profile_detail_list_iam_user_id'>${row.iam_user_id}</div>
                                            </div>
                                            <div class='common_profile_detail_list_col'>
                                                <div class='common_image common_image_avatar_list' style='${row.avatar==null?'':`background-image:url(${row.avatar});`}'></div>
                                            </div>
                                            <div class='common_profile_detail_list_col'>
                                                <div class='common_profile_detail_list_username common_wide_list_column common_link'>
                                                    ${row.username}
                                                </div>
                                            </div>
                                        </div>`
                                ).join('')
                                }`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      iam_user_id:number,
 *                      iam_user_id_profile:number,
 *                      detailchoice:number
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonDialogueShow:CommonModuleCommon['commonDialogueShow'],
 *                      commonFFB:CommonModuleCommon['commonFFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle,
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    let path;
    switch (props.data.detailchoice){
        case 1:
        case 2:
        case 3:
        case 4:{
            /*detailchoice 1,2,3, 4: user_account*/
            path = '/server-db/iamuser-profile-detail';
            break;
        }
        case 6:
        case 7:{
            /*detailchoice 6, 7: app specific */
            path = '/server-db/iamuserappdatapost-profile-detail';
            break;
        }    
    }
    if (!props.data.iam_user_id)
        props.methods.commonDialogueShow('LOGIN');

    return {
      lifecycle:    null,
      data:         null,
      methods:      null,
      template:     template({  iam_user_id:props.data.iam_user_id,
                                iam_user_id_profile:props.data.iam_user_id_profile,
                                detailchoice:props.data.detailchoice,
                                list:props.data.iam_user_id?
                                        await props.methods.commonFFB({path:`${path}/${props.data.iam_user_id_profile}`, query:`detailchoice=${props.data.detailchoice}`, method:'GET', authorization_type:'APP_ACCESS'})
                                                .then((/**@type{string}*/result)=>JSON.parse(result)):
                                        []
                            })
    };
};
export default component;
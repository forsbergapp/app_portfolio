/**
 * @module apps/common/component/common_app_dialogues_profile_info_list
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{iam_user_id:number,
 *          iam_user_id_profile:number,
 *          detailchoice:number,
 *          list:   common['server']['ORM']['View']['IamUserGetProfileDetail'][]|
 *                  common['server']['ORM']['View']['IamUserAppdataPostGetProfileUserPostDetail'][]}} props
 * @returns {string}
 */
const template = props => `     ${props.list.map(row=>
                                    `<div data-iam_user_id='${row.IamUserId}' class='common_app_dialogues_profile_info_list_row common_row'>
                                            <div class='common_app_dialogues_profile_info_list_col'>
                                                <div class='common_app_dialogues_profile_info_list_iam_user_id'>${row.IamUserId}</div>
                                            </div>
                                            <div class='common_app_dialogues_profile_info_list_col'>
                                                <div class='common_image common_image_avatar_list' style='${row.Avatar==null?'':`background-image:url(${row.Avatar});`}'></div>
                                            </div>
                                            <div class='common_app_dialogues_profile_info_list_col'>
                                                <div class='common_app_dialogues_profile_info_list_username common_wide_list_column common_link'>
                                                    ${row.Username}
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
 *                      iam_user_id_profile:number,
 *                      detailchoice:number
 *                      },
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'],
 *                      data:null, 
 *                      methods:null,
 *                      events:common['commonComponentEvents'],
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
    if (!props.methods.COMMON.commonGlobalGet('iam_user_id'))
        props.methods.COMMON.commonDialogueShow('LOGIN');

    /**
     * @name events
     * @descption Events
     * @function
     * @param {common['commonEventType']} event_type
     * @param {common['CommonAppEvent']} event
     * @returns {Promise.<void>}
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.COMMON.commonMiscElementId(event.target);
        switch (true){
            case event_type =='click' && event_target_id == 'common_app_dialogues_profile_info_list':{
                await props.methods.COMMON.commonProfileShow(Number(props.methods.COMMON.commonMiscElementRow(event.target).getAttribute('data-iam_user_id')),null);
            }
        }
    };
    return {
      lifecycle:    null,
      data:         null,
      methods:      null,
      events:       events,
      template:     template({  iam_user_id:props.methods.COMMON.commonGlobalGet('iam_user_id'),
                                iam_user_id_profile:props.data.iam_user_id_profile,
                                detailchoice:props.data.detailchoice,
                                list:props.methods.COMMON.commonGlobalGet('iam_user_id')?
                                        await props.methods.COMMON.commonFFB({path:`${path}/${props.data.iam_user_id_profile}`, query:`detailchoice=${props.data.detailchoice}`, method:'GET', authorization_type:'APP_ACCESS'})
                                                .then((/**@type{string}*/result)=>JSON.parse(result)):
                                        []
                            })
    };
};
export default component;
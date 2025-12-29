/**
 * Displays profile stat
 * @module apps/common/component/common_app_dialogues_profile_stat
 */

/**
 * @import {common}  from '../../../common_types.js'
 * 
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{icons:{ user_views:string,
 *                  user_follows:string,
 *                  user_like:string}}} props
 * @returns {string}
 */
const template = props =>  `   <div id='common_app_dialogues_profile_stat_row1'>
                                <div id='common_app_dialogues_profile_stat_row1_1' class='common_link common_icon_list'>${props.icons.user_views}</div>
                                <div id='common_app_dialogues_profile_stat_row1_2' class='common_link common_icon_list'>${props.icons.user_follows}</div>
                                <div id='common_app_dialogues_profile_stat_row1_3' class='common_link common_icon_list'>${props.icons.user_like + ' ' + props.icons.user_follows}</div>
                            </div>
                            <div id='common_app_dialogues_profile_stat_row2'></div>
                            <div id='common_app_dialogues_profile_stat_list'></div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      stat_list_app_rest_url:string,
 *                      statchoice:number
 *                      },
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:   null,
 *                      methods:null,
 *                      events:common['commonComponentEvents'],
 *                      template:string}>}
 */
const component = async props => {

    const onMounted = async () =>{
        await props.methods.COMMON.commonComponentRender( 
            {   mountDiv:   'common_app_dialogues_profile_stat_list',
                data:       {
                            stat_choice:props.data.statchoice,
                            stat_list_app_rest_url:props.data.stat_list_app_rest_url
                            },
                methods:    null,
                path:       '/common/component/common_app_dialogues_profile_stat_list.js'});
    };
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
            case event_type =='click' && event_target_id== 'common_app_dialogues_profile_stat_row1_1':{
                await props.methods.COMMON.commonProfileStat(1, null);
                break;
            }
            case event_type =='click' && event_target_id== 'common_app_dialogues_profile_stat_row1_2':{
                await props.methods.COMMON.commonProfileStat(2, null);
                break;
            }
            case event_type =='click' && event_target_id== 'common_app_dialogues_profile_stat_row1_3':{
                await props.methods.COMMON.commonProfileStat(3, null);
                break;
            }
        }
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        events:     events,
        template:   template({icons:{user_views:props.methods.COMMON.commonGlobalGet('ICONS')['user_views'],
                                    user_follows:props.methods.COMMON.commonGlobalGet('ICONS')['user_follows'],
                                    user_like:props.methods.COMMON.commonGlobalGet('ICONS')['user_like']}
                            })
    };
};
export default component;
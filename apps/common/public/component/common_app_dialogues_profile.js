/**
 * Displays profile
 * @module apps/common/component/common_app_dialogues_profile
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () =>` <div id='common_app_dialogues_profile_home' class='common_app_dialogues_button common_icon' ></div>
                        <div id='common_app_dialogues_profile_content'></div>
                        <div id='common_app_dialogues_profile_close' class='common_app_dialogues_button common_icon' ></div>`;

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
    props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_app_dialogues_show0');
    
    const onMounted = async () =>{
        if (props.data.statchoice){
            //show default stat list
            await props.methods.COMMON.commonComponentRender( 
                {   mountDiv:   'common_app_dialogues_profile_content',
                    data:       {
                                stat_list_app_rest_url:props.data.stat_list_app_rest_url,
                                statchoice:props.data.statchoice
                                },
                    methods:    null,
                    path:       '/common/component/common_app_dialogues_profile_stat.js'});
                    }
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
            case event_type =='click' && event_target_id== 'common_app_dialogues_profile_home':{
                props.methods.COMMON.commonComponentRemove('common_app_dialogues_user_menu');
                await props.methods.COMMON.commonProfileStat(1, null);
                break;
            }
            case event_type =='click' && event_target_id== 'common_app_dialogues_profile_close':{
                props.methods.COMMON.commonComponentRemove('common_app_dialogues_profile');
                break;
            }
        }
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        events:     events,
        template:   template()
    };
};
export default component;
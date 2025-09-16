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
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_app_dialogues_show0');
    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues').classList.add('common_app_dialogues_modal');

    
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

    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;
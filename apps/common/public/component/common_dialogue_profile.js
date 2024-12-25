/**
 * Displays profile
 * @module apps/common/component/common_dialogue_profile
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonFFB']} commonFFB
 * @typedef {CommonModuleCommon['commonComponentRender']} commonComponentRender
 */

/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () =>` <div id='common_dialogue_profile_home' class='common_dialogue_button common_icon' ></div>
                        <div id='common_dialogue_profile_content'></div>
                        <div id='common_dialogue_profile_close' class='common_dialogue_button common_icon' ></div>`;

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
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonComponentRender:commonComponentRender,
 *                      commonFFB:commonFFB
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show0');
    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    
    const onMounted = async () =>{
        if (props.data.statchoice){
            //show default stat list
            await props.methods.commonComponentRender( 
                {   mountDiv:   'common_dialogue_profile_content',
                    data:       {
                                stat_list_app_rest_url:props.data.stat_list_app_rest_url,
                                statchoice:props.data.statchoice
                                },
                    methods:    {
                               commonFFB:props.methods.commonFFB,
                                commonComponentRender:props.methods.commonComponentRender,
                                },
                    path:       '/common/component/common_dialogue_profile_stat.js'});
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
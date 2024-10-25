/**
 * Displays profile stat
 * @module apps/common/component/common_dialogue_profile_stat
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonFFB']} commonFFB
 * @typedef {CommonModuleCommon['commonComponentRender']} commonComponentRender
 * 
 */
/**
 * @returns {string}
 */
const template = () =>  `   <div id='common_profile_stat_row1'>
                                <div id='common_profile_stat_row1_1' class='common_link common_icon'></div>
                                <div id='common_profile_stat_row1_2' class='common_link common_icon'></div>
                                <div id='common_profile_stat_row1_3' class='common_link common_icon'></div>
                            </div>
                            <div id='common_profile_stat_row2'></div>
                            <div id='common_profile_stat_list'></div>`;
/**
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

    const onMounted = async () =>{
        await props.methods.commonComponentRender( 
            {   mountDiv:   'common_profile_stat_list',
                data:       {
                            stat_choice:props.data.statchoice,
                            stat_list_app_rest_url:props.data.stat_list_app_rest_url
                            },
                methods:    {
                           commonFFB:props.methods.commonFFB
                            },
                path:       '/common/component/common_dialogue_profile_stat_list.js'});
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;
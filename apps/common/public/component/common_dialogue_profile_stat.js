/**
 * @module apps/common/component/common_dialogue_profile_stat
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
 *                      common_mountdiv:string,
 *                      stat_list_app_rest_url:string,
 *                      statchoice:number
 *                      },
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      ComponentRender:import('../../../common_types.js').CommonModuleCommon['ComponentRender'],
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB']
 *                      },
 *          lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycleReturn, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {

    const onMounted = async () =>{
        await props.methods.ComponentRender( 
            {   mountDiv:   'common_profile_stat_list',
                data:       {
                            stat_choice:props.data.statchoice,
                            stat_list_app_rest_url:props.data.stat_list_app_rest_url
                            },
                methods:    {
                            FFB:props.methods.FFB
                            },
                lifecycle:  null,
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
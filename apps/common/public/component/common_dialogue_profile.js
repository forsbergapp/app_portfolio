/**
 * @module apps/common/component/common_dialogue_profile
 */

const template = () =>` <div id='common_dialogue_profile_home' class='common_dialogue_button common_icon' ></div>
                        <div id='common_dialogue_profile_content'></div>
                        <div id='common_dialogue_profile_close' class='common_dialogue_button common_icon' ></div>`;

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
    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).classList.add('common_dialogue_show0');
    props.methods.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    
    const onMounted = async () =>{
        if (props.data.statchoice){
            //show default stat list
            await props.methods.ComponentRender( 
                {   mountDiv:   'common_dialogue_profile_content',
                    data:       {
                                stat_list_app_rest_url:props.data.stat_list_app_rest_url,
                                statchoice:props.data.statchoice
                                },
                    methods:    {
                                FFB:props.methods.FFB,
                                ComponentRender:props.methods.ComponentRender,
                                },
                    lifecycle:  null,
                    path:       '/common/component/common_dialogue_profile_stat.js'});
                    }
    };

    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template: template()
    };
};
export default component;
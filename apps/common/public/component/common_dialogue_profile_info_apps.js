/**
 * @module apps/common/component/common_dialogue_profile_info_apps
 */

const template = () => `<div id='common_profile_info_cloud'>
                            <div id='common_profile_info_main_btn_cloud' class='common_link common_icon'></div>
                        </div>`;
/**
 * @param {{data:       {common_mountdiv:string},
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument},
 *          lifecycle:  null}} props 
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycleReturn, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        lifecycle:  {onMounted:null},
        data:   null,
        methods:null,
        template: template()
    };
};
export default component;
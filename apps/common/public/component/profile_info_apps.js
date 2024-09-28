/**
 * @module apps/common/component/profile_info_apps
 */

const template = () => `<div id='common_profile_info_cloud'>
                            <div id='common_profile_info_main_btn_cloud' class='common_link common_icon'></div>
                        </div>`;
/**
 * @param {{data:       {common_mountdiv:string},
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument},
 *          lifecycle:  null}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        props:  {function_post:null},
        data:   null,
        template: template()
    };
};
export default component;
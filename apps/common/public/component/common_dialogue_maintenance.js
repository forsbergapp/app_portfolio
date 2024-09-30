/**
 * @module apps/common/component/common_dialogue_maintenance
 */

const template = () =>` <div id='common_dialogue_maintenance_content' class='common_dialogue_content'>
                            <div id='common_maintenance_header'>
                                <div id='common_maintenance_logo' class='common_image common_image_alert'></div>
                            </div>
                            <div id='common_maintenance_message'></div>
                            <div id='common_maintenance_countdown'></div>
                            <div id='common_maintenance_footer'></div>
                        </div>`;
/**
 * @param {{data:       {common_mountdiv:string},
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      common_setTimeout:import('../../../common_types.js').CommonModuleCommon['common_setTimeout']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    /**
     * Maintenance countdown
     * @param {number|null} remaining 
     */
    const maintenance_countdown = (remaining = null) => {
        if(remaining && remaining <= 0)
            location.reload();
        else{
            props.methods.common_document.querySelector('#common_maintenance_countdown').innerHTML = remaining;
            props.methods.common_setTimeout(()=>{ maintenance_countdown((remaining ?? 60) - 1); }, 1000);
        }
    };    
    return {
        lifecycle:  {onMounted:maintenance_countdown},
        data:   null,
        methods:null,
        template: template()
    };
};
export default component;
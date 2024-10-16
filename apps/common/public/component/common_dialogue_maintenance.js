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
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
 *                      commonWindowSetTimeout:import('../../../common_types.js').CommonModuleCommon['commonWindowSetTimeout'],
 *                      commonWindowLocationReload:import('../../../common_types.js').CommonModuleCommon['commonWindowLocationReload']
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
            props.methods.commonWindowLocationReload();
        else{
            props.methods.COMMON_DOCUMENT.querySelector('#common_maintenance_countdown').textContent = remaining;
            props.methods.commonWindowSetTimeout(()=>{ maintenance_countdown((remaining ?? 60) - 1); }, 1000);
        }
    };    
    return {
        lifecycle:  {onMounted:maintenance_countdown},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;
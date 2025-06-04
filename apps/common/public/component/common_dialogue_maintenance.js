/**
 * Displays maintenance
 * @module apps/common/component/common_dialogue_maintenance
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
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
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonWindowSetTimeout:CommonModuleCommon['commonWindowSetTimeout'],
 *                      commonWindowLocationReload:CommonModuleCommon['commonWindowLocationReload'],
*                       commonMiscResourceFetch:CommonModuleCommon['commonMiscResourceFetch']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
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
    const onMounted = async () =>{
        maintenance_countdown();
        props.methods.commonMiscResourceFetch( '/common/images/logo_maintenance.png', 
                                            props.methods.COMMON_DOCUMENT.querySelector('#common_maintenance_logo'), 
                                            'image/png');

    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;
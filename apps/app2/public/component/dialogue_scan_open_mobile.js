/**
 * @module apps/app2/component/dialogue_scan_open_mobile
 */

const template = () => `<div id='scan_open_mobile_qrcode'></div>
                        <div id='scan_open_mobile_title1' class='common_icon'></div>
                        <div id='scan_open_mobile_close' class='common_dialogue_button common_icon' ></div>`;
/**
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
 *                      commonModuleEasyQRCODECreate:import('../../../common_types.js').CommonModuleCommon['commonModuleEasyQRCODECreate'],
 *                      commonWindowHostname:import('../../../common_types.js').CommonModuleCommon['commonWindowHostname']}}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const method = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show0');
    props.methods.COMMON_DOCUMENT.querySelector('#dialogues').classList.add('common_dialogues_modal');
    const onMounted = async () =>{
        props.methods.commonModuleEasyQRCODECreate('scan_open_mobile_qrcode', props.methods.commonWindowHostname());
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default method;
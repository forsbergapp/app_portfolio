/**
 * @module apps/app2/component/dialogue_scan_open_mobile
 */

const template = () => `<div id='scan_open_mobile_qrcode'></div>
                        <div id='scan_open_mobile_title1' class='common_icon'></div>
                        <div id='scan_open_mobile_close' class='common_dialogue_button common_icon' ></div>`;
/**
 * @param {{data:       {common_mountdiv:string},
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      create_qr:import('../../../common_types.js').CommonModuleCommon['create_qr'],
 *                      getHostname:import('../../../common_types.js').CommonModuleCommon['getHostname']},
 *          lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycleReturn, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const method = async props => {
    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).classList.add('common_dialogue_show0');
    props.methods.common_document.querySelector('#dialogues').classList.add('common_dialogues_modal');
    const onMounted = async () =>{
        props.methods.create_qr('scan_open_mobile_qrcode', props.methods.getHostname());
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template()
    };
};
export default method;
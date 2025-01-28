/**
 * Displays dialogue scan mobile
 * @module apps/app4/component/dialogue_scan_open_mobile
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () => `<div id='scan_open_mobile_qrcode' class='common_module_easy.qrcode'></div>
                        <div id='scan_open_mobile_title1' class='common_icon'></div>
                        <div id='scan_open_mobile_close' class='common_dialogue_button common_icon' ></div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonModuleEasyQRCODECreate:CommonModuleCommon['commonModuleEasyQRCODECreate'],
 *                      commonWindowHostname:CommonModuleCommon['commonWindowHostname']}}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
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
export default component;
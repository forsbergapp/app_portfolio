/**
 * @module apps/app2/component/dialogue_scan_open_mobile
 */

const template =` <div id='scan_open_mobile_qrcode'></div>
                  <div id='scan_open_mobile_title1' class='common_icon'></div>
                  <div id='scan_open_mobile_close' class='common_dialogue_button common_icon' ></div>`;
/**
 * 
 * @param {{common_document:import('../../../types.js').AppDocument,
 *          common_mountdiv:string,
 *          function_create_qr:function,
 *          function_getHostname:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show0');
    props.common_document.querySelector('#dialogues').classList.add('common_dialogues_modal');
    const render_template = () =>{
        return template;
    };
    const post_component = async () =>{
        props.function_create_qr('scan_open_mobile_qrcode', props.function_getHostname());
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template()
    };
};
export default method;
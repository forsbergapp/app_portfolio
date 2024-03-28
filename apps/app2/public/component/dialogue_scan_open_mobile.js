/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id='dialogue_scan_open_mobile_content' class='dialogue_content'>
                        <div id='scan_open_mobile_qrcode'></div>
                        <div id='scan_open_mobile_title1' class='common_icon'></div>
                        <div id='scan_open_mobile_close' class='common_dialogue_button common_icon' ></div>
                    </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    
    const render_template = () =>{
        return template;
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default method;
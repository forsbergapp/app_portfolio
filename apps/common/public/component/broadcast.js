/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`<div id='common_broadcast_info'>
                    <div id='common_broadcast_banner'>
                        <div id='common_broadcast_header'>
                            <div id='common_broadcast_info_message'>
                                <div id='common_broadcast_info_message_item'><MESSAGE/></div>
                            </div>    
                        </div>
                        <div id='common_broadcast_footer'>
                            <div id='common_broadcast_info_logo'></div>
                            <div id='common_broadcast_info_title' class='common_icon'></div>
                            <div id='common_broadcast_close' class='common_icon'></div>
                        </div>
                    </div>
                </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          message:string}} props 
 * @returns {Promise.<{ props:{function_post:function|null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    const render_template = () =>{
        return template.replace('<MESSAGE/>',props.message);
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default component;
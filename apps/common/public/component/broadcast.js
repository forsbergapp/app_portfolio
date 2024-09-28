/**
 * @module apps/common/component/broadcast
 */
/**
 * @param {{message:string}} props
 */
const template = props =>` <div id='common_broadcast_info'>
                            <div id='common_broadcast_banner'>
                                <div id='common_broadcast_header'>
                                    <div id='common_broadcast_info_message'>
                                        <div id='common_broadcast_info_message_item'>${props.message}</div>
                                    </div>    
                                </div>
                                <div id='common_broadcast_footer'>
                                    <div id='common_broadcast_info_logo' class='common_image common_image_broadcast'></div>
                                    <div id='common_broadcast_info_title' class='common_icon'></div>
                                    <div id='common_broadcast_close' class='common_icon'></div>
                                </div>
                            </div>
                        </div>`;
/**
 * 
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      message:string
 *                      },
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument},
 *          lifecycle:  null}} props
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    return {
        props:  {function_post:null},
        data:   null,
        template: template({message:props.data.message})
    };
};
export default component;
/**
 * @module apps/common/component/common_broadcast
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
 *                      commonMountdiv:string,
 *                      message:string
 *                      },
 *          methods:    {COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT}}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({message:props.data.message})
    };
};
export default component;
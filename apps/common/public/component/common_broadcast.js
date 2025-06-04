/**
 * Displays broadcast
 * @module apps/common/component/common_broadcast
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{message:string}} props
 * @returns {string}
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
                                    <div id='common_broadcast_close' class='common_toolbar_button common_icon'></div>
                                </div>
                            </div>
                        </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      message:string
 *                      },
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT,
*                       commonMiscResourceFetch:CommonModuleCommon['commonMiscResourceFetch']}}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    
    const onMounted =()=>{
        props.methods.commonMiscResourceFetch( '/common/images/logo_broadcast.png',
                                            props.methods.COMMON_DOCUMENT.querySelector('#common_broadcast_info_logo'), 
                                            'image/png');

    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({message:props.data.message})
    };
};
export default component;
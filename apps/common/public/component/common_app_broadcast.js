/**
 * Displays broadcast
 * @module apps/common/component/common_app_broadcast
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{message:string}} props
 * @returns {string}
 */
const template = props =>` <div id='common_app_broadcast_info'>
                            <div id='common_app_broadcast_banner'>
                                <div id='common_app_broadcast_header'>
                                    <div id='common_app_broadcast_info_message'>
                                        <div id='common_app_broadcast_info_message_item'>${props.message}</div>
                                    </div>    
                                </div>
                                <div id='common_app_broadcast_footer'>
                                    <div id='common_app_broadcast_info_logo' class='common_image common_image_broadcast'></div>
                                    <div id='common_app_broadcast_info_title' class='common_icon'></div>
                                    <div id='common_app_broadcast_close' class='common_toolbar_button common_icon'></div>
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
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']}}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:   null,
 *                      methods:null,
 *                      events:common['commonComponentEvents']
 *                      template:string}>}
 */
const component = async props => {
    /**
     * @name events
     * @descption Events
     * @function
     * @param {common['commonEventType']} event_type
     * @param {common['CommonAppEvent']} event
     * @returns {Promise.<void>}
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.COMMON.commonMiscElementId(event.target);
        switch (event_type){
            case 'click':{
                switch (true){
                    case event_target_id=='common_app_broadcast_close':{
                        props.methods.COMMON.commonComponentRemove('common_app_broadcast');
                        break;
                    }
                }
            }
        }
    };
    const onMounted =()=>{
        props.methods.COMMON.commonMiscResourceFetch( '/common/images/logo_broadcast.png',
                                            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_broadcast_info_logo'), 
                                            'image/png');

    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        events:     events,
        template:   template({message:props.data.message})
    };
};
export default component;
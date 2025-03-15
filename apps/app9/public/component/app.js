/**
 * App
 * @module apps/app9/component/app
 */

/**
 * @import {COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @returns {string}
 */
const template = () =>  `   <div id='otp_row'>
                                <div id='otp_key' class='common_input common_placeholder' contentEditable='true'></div>
                                <div id='clear_button' class='common_dialogue_button common_icon'></div>
                            </div>
                            <div id='totp_row'>
                                <div id='totp_value'></div>
                                <div id='totp_countdown_time'></div>
                            </div>`;
/**
 * 
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT}}} props 
 * @returns {Promise.<{ lifecycle:  CommonComponentLifecycle, 
 *                      data:       null, 
 *                      methods:    null,
 *                      template:   string}>}
 */
const component = async props => {
    props;
    return {
        lifecycle:  {onMounted:null},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;
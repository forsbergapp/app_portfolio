/**
 * App
 * @module apps/app9/component/app
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @function
 * @param {{icons:{otp:string, clear:string}}} props
 * @returns {string}
 */
const template = props =>  `<div id='otp_row'>
                                <div>${props.icons.otp}</div>
                                <div id='otp_key' class='common_input' contentEditable='true'></div>
                                <div id='clear_button' class='common_app_dialogues_button common_link'>${props.icons.clear}</div>
                            </div>
                            <div id='totp_row'>
                                <div id='totp_value'></div>
                                <div id='totp_countdown_time'></div>
                            </div>`;
/**
 * 
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON:common['CommonModuleCommon']}}} props 
 * @returns {Promise.<{ lifecycle:  common['CommonComponentLifecycle'], 
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
        template:   template({icons:{
                                    otp:props.methods.COMMON.commonGlobalGet('ICONS')['otp'],
                                    clear:props.methods.COMMON.commonGlobalGet('ICONS')['close']}})
    };
};
export default component;
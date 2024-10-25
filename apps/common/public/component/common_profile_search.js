/**
 * Displays profile search
 * @module apps/common/component/common_profile_search
 */

/**
 * @import {COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */
/**
 * @returns {string}
 */
const template = () =>` <div id='common_profile_input_row'>
                            <div id='common_profile_search_input' contentEditable='true' class='common_input '/></div>
                            <div id='common_profile_search_icon' class='common_icon'></div>
                        </div>
                        <div id='common_profile_search_list_wrap'></div>`;
/**
 * 
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT}}} props  
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;
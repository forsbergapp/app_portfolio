/**
 * Displays profile search
 * @module apps/common/component/common_profile_search
 */

/**
 * @import {common}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () =>` <div id='common_profile_input_row'>
                            <div id='common_profile_search_input' contentEditable='true' class='common_input '></div>
                            <div id='common_profile_search_icon' class='common_icon'></div>
                        </div>
                        <div id='common_profile_search_list_wrap'></div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props  
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
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
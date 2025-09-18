/**
 * @module apps/common/component/common_loading
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
const template = () => `<div class='common_loading_spinner'></div>
                        <div id='common_loading_progressbar_wrap'>
                            <div id='common_loading_progressbar_info'></div>
                            <div id='common_loading_progressbar'></div>
                        </div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:        {
*                       commonMountdiv:string
*                       },
*          methods:     {
*                       COMMON:common['CommonModuleCommon']
*                       }}} props
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

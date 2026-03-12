/**
 * @description map measure
 * @module apps/common/component/common_map_measure
 */

/**
 * @import types_common from '../../../common/types.d.ts'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{km:number, miles:number}} props 
* @returns {string}
*/
const template = props => `<div>${props.km} km / ${props.miles} mi</div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:        {
*                       commonMountdiv:string,
*                       km:number,
*                       miles:number,
*                       },
*          methods:     {
*                       COMMON:types_common.CommonModuleCommon
*                       }}} props
* @returns {Promise.<{ lifecycle:types_common.CommonComponentLifecycle, 
*                      data:   null,
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {
   
  return {
      lifecycle:  null,
      data:       null,
      methods:    null,
      template:   template({
                        km:  props.data.km,
                        miles:props.data.miles
                   })
  };
};
export default component;
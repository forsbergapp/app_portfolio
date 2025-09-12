/**
 * @module apps/common/component/common_map_measure
 */

/**
 * @import {COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
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
*                       COMMON_DOCUMENT:COMMON_DOCUMENT
*                       }}} props
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
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
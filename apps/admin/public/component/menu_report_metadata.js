/**
 * Displays report queue
 * @module apps/admin/component/menu_report
 */

/**
 * @import {CommonAppModuleMetadata, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @param {{report_metadata:CommonAppModuleMetadata[]}} props
 * @returns {string}
 */
const template = props => ` ${props.report_metadata.map(report_metadata=>
                                `<div class='menu_report_metadata_row common_row' data-parameter='${report_metadata.param.name}'>
                                    <div class='menu_report_metadata_col1 list_readonly'>${report_metadata.param.text}</div>
                                    <div class='menu_report_metadata_col2 common_input list_edit' contentEditable='true'>${report_metadata.param.default}</div>
                                </div>`
                            ).join('')
                            }`;
/**
* 
* @param {{data:        {
*                       commonMountdiv:string,
*                       report_metadata:CommonAppModuleMetadata[]
*                       },
*          methods:     {
*                       COMMON_DOCUMENT:COMMON_DOCUMENT
*                       },
*          lifecycle:   null}} props 
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
*                      data:null, 
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {
       
    return {
            lifecycle:   null,
            data:        null,
            methods:     null,
            template:    template({ report_metadata:props.data.report_metadata})
   };
};
export default component;
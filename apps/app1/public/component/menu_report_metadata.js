/**
 * Displays report queue
 * @module apps/app1/component/menu_report
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{report_description:string,
 *          report_metadata:common['CommonAppModuleMetadata'][]}} props
 * @returns {string}
 */
const template = props => ` <div id='menu_report_metadata_description'>${props.report_description}</div>
                            ${props.report_metadata.map(report_metadata=>
                                `<div class='menu_report_metadata_row common_row' data-parameter='${report_metadata.param.name}'>
                                    <div class='menu_report_metadata_col1 list_readonly'>${report_metadata.param.text}</div>
                                    <div class='menu_report_metadata_col2 common_input list_edit' contentEditable='true'>${report_metadata.param.default}</div>
                                </div>`
                            ).join('')
                            }`;
/**
 * @name component
 * @description Component
 * @function 
 * @param {{data:        {
 *                       commonMountdiv:string,
 *                       report_description:string,
 *                       report_metadata:common['CommonAppModuleMetadata'][]
 *                       },
 *          methods:     {
 *                       COMMON:common['CommonModuleCommon']
 *                       },
 *          lifecycle:   null}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
       
    return {
            lifecycle:   null,
            data:        null,
            methods:     null,
            template:    template({ report_description:props.data.report_description,
                                    report_metadata:props.data.report_metadata})
   };
};
export default component;
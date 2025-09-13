/**
 * Common select
 * @module apps/common/component/common_select
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{default_data_value:string,
 *          default_value:string,
 *          options:[{value:string, text:string}]|[],
 *          column_value:string,
 *          column_text:string}} props
 * @returns {string}
 */
const template = props => ` <div class='common_select_dropdown'>
                                <div class='common_select_dropdown_value' data-value='${props.default_data_value}'>${props.default_value}</div>
                                <div class='common_select_dropdown_icon common_icon'></div>
                            </div>
                            <div class='common_select_options'>
                                ${props.options.map(row=>
                                    /**@ts-ignore */
                                    `<div class='common_select_option' data-value='${row[props.column_value]}'>${row[props.column_text]}</div>`).join('')
                                }
                            </div>` ;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      default_data_value:string,
 *                      default_value:string,
 *                      options:[{value:string, text:string}],
 *                      path:string,
 *                      query:string,
 *                      method:common['CommonRESTAPIMethod'],
 *                      authorization_type:common['CommonRESTAPIAuthorizationType'],
 *                      column_value:string,
 *                      column_text:string
 *                      },
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    // add first static option first if any then add fetched options
    const commonFFB_options = props.data.path?await props.methods.COMMON.commonFFB({path:props.data.path, query:props.data.query, method:props.data.method, authorization_type:props.data.authorization_type})
                                .then((/**@type{string}*/result)=>JSON.parse(result).rows):[];
    /**@type{[{value:string, text:string}]|[]} */
    const options = props.data.options?props.data.options.concat(commonFFB_options):commonFFB_options;

    const onMounted = async () =>{
        props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_select');
   };
   
   return {
       lifecycle:  {onMounted:onMounted},
       data:   null,
       methods:null,
       template: template({ 
                            default_data_value:props.data.default_data_value ?? '',
                            default_value:props.data.default_value ?? '',
                            options:options,
                            column_value:props.data.column_value,
                            column_text:props.data.column_text
                        })
   };
};
export default component;
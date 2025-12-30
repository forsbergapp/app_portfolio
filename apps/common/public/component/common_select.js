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
 *          column_text:string,
 *          class_dropdown_value:string|null,
 *          class_option:string|null,
 *          icons:{select:string}}} props
 * @returns {string}
 */
const template = props => ` <div class='common_select_dropdown'>
                                <div class='common_select_dropdown_value ${props.class_dropdown_value??''}' data-value='${props.default_data_value}'>${props.default_value}</div>
                                <div class='common_link common_icon_select_dropdown'>${props.icons.select}</div>
                            </div>
                            <div class='common_select_options'>
                                ${props.options.map(row=>
                                    /**@ts-ignore */
                                    `<div class='common_select_option ${props.class_option??''}' data-value='${row[props.column_value]}'>${row[props.column_text]}</div>`).join('')
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
 *                      column_value:string,
 *                      column_text:string,
 *                      class_dropdown_value?:string|null,
 *                      class_option?: string|null
 *                      },
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props
 * @returns {{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}}
 */
const component = props => {

    const onMounted = async () =>{
        if (props.data.commonMountdiv !=null)
            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_select');
   };
   
   return {
       lifecycle:  {onMounted:onMounted},
       data:   null,
       methods:null,
       template: template({ 
                            default_data_value:props.data.default_data_value ?? '',
                            default_value:props.data.default_value ?? '',
                            options:props.data.options,
                            column_value:props.data.column_value,
                            column_text:props.data.column_text,
                            class_dropdown_value:props.data.class_dropdown_value??null,
                            class_option: props.data.class_option??null,
                            icons:{select:props.methods.COMMON.commonGlobalGet('ICONS')['select']}
                        })
   };
};
export default component;
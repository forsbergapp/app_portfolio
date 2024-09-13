/**
 * @module apps/common/component/select
 */
/**
 * Displays stat of users
 * @param {{spinner:string,
 *           default_data_value:string,
 *           default_value:string,
 *           options:[{value:string, text:string}]|[],
 *           column_value:string,
 *           column_text:string}} props
 */
const template = props => ` <div class='common_select_dropdown'>
                                <div class='common_select_dropdown_value' data-value='${props.default_data_value}'>${props.default_value}</div>
                                <div class='common_select_dropdown_icon common_icon'></div>
                            </div>
                            <div class='common_select_options ${props.spinner}'>
                                ${props.options.map(row=>
                                    /**@ts-ignore */
                                    `<div class='common_select_option' data-value='${row[props.column_value]}'>${row[props.column_text]}</div>`).join('')
                                }
                            </div>` ;
/**
* 
* @param {{common_document:import('../../../common_types.js').CommonAppDocument,
*          common_mountdiv:string,
*          default_data_value:string,
*          default_value:string,
*          options:string|null,
*          path:string,
*          query:string,
*          method:string,
*          authorization_type:string,
*          column_value:string,
*          column_text:string,
*          function_FFB:function}} props 
* @returns {Promise.<{ props:{function_post:function}, 
*                      data:null, 
*                      template:string}>}
*/
const component = async props => {

    const post_component = async () =>{
        // use static values or fetch options
        /**@type{[{value:string, text:string}]} */
        const options = props.options?props.options:await props.function_FFB(props.path, props.query, props.method, props.authorization_type, null)
                            .then((/**@type{string}*/result)=>JSON.parse(result).rows);
        props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_select');
       props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template({   spinner:'',
                                                                                                        default_data_value:props.default_data_value,
                                                                                                        default_value:props.default_value,
                                                                                                        options:options,
                                                                                                        column_value:props.column_value,
                                                                                                        column_text:props.column_text
                                                                                                   });
   };
   /**
    * @param {{ spinner:string,
    *           default_data_value:string,
    *           default_value:string,
    *           options:[{value:string, text:string}]|[],
    *           column_value:string,
    *           column_text:string}} template_props
    */
   const render_template = template_props =>{
       return template({    spinner:template_props.spinner,
                            default_data_value:template_props.default_data_value ?? '',
                            default_value:template_props.default_value ?? '',
                            options:template_props.options,
                            column_value:template_props.column_value,
                            column_text:template_props.column_text
       });
   };
   return {
       props:  {function_post:post_component},
       data:   null,
       template: render_template({  spinner:'css_spinner',
                                    default_data_value:props.default_data_value,
                                    default_value:props.default_value,
                                    options:[],
                                    column_value:props.column_value,
                                    column_text:props.column_text
       })
   };
};
export default component;
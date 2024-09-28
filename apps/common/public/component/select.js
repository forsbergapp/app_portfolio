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
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      default_data_value:string,
 *                      default_value:string,
 *                      options:[{value:string, text:string}],
 *                      path:string,
 *                      query:string,
 *                      method:string,
 *                      authorization_type:string,
 *                      column_value:string,
 *                      column_text:string
 *                      },
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB']
 *                      },
 *          lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:{onMounted:function}, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {

    const onMounted = async () =>{
        // add first static option first if any then add fetched options
        const ffb_options = props.data.path?await props.methods.FFB(props.data.path, props.data.query, props.data.method, props.data.authorization_type, null)
                                    .then((/**@type{string}*/result)=>JSON.parse(result).rows):[];
        /**@type{[{value:string, text:string}]|[]} */
        const options = props.data.options?props.data.options.concat(ffb_options):ffb_options;
        props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).classList.add('common_select');
        props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = template({ spinner:'',
                                                                                                default_data_value:props.data.default_data_value ?? '',
                                                                                                default_value:props.data.default_value ?? '',
                                                                                                options:options,
                                                                                                column_value:props.data.column_value,
                                                                                                column_text:props.data.column_text
                                                                                            });
   };
   
   return {
       lifecycle:  {onMounted:onMounted},
       data:   null,
       methods:null,
       template: template({ spinner:'css_spinner',
                            default_data_value:props.data.default_data_value,
                            default_value:props.data.default_value,
                            options:[],
                            column_value:props.data.column_value,
                            column_text:props.data.column_text
       })
   };
};
export default component;
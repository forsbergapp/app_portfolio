/**@type{import('../../../types.js').AppDocument} */
const AppDocument = document;
/**
 * @typedef {{  value:number|string|null, metadata:{default_text:string, length:number, type: string, contentEditable:boolean}}} ObjectData
 * 
 * @typedef {Object.<string,ObjectData>|null} master_object_type
 * 
 * @typedef {{  display_type:'VERTICAL_KEY_VALUE'|'MASTER_DETAIL_HORIZONTAL'|'MASTER_DETAIL_VERTICAL',
 *              master_object:master_object_type,
 *              rows:[],
 *              button_print:boolean,
 *              button_update:boolean,
 *              button_post:boolean,
 *              button_delete:boolean}} props_template
 */
/**
 *  Display types:
 *                              usage suggestion        design
 *  VERTICAL_KEY_VALUE          form                    key value vertical array list, 2 columns
 *                                                      
 *  MASTER_DETAIL_HORIZONTAL    order, invoice,         master key values one object with detail array rows with objects (more than 2 columns) below, 
 *                              product, search etc     detail keys displayed on first row
 * 
 *  MASTER_DETAIL_VERTICAL      resource info           master key values one object with detail key value (2 columns) vertical array list below
 * 
 *  Buttons:
 * 
 *  print, update, post, delete, display with custom functions
 * 
 *  Click event delegation in common.js triggers ['data-function'] function for the buttons
 *  App data divs are all classes. Buttons use id to be identified so mount this component only once at a time if any button is used.
 * 
 *  Set optional custom styles using class on div where component is mounted in the app
 * 
 * @param {props_template} props 
 * @returns 
 */
const template = props =>`  ${props.master_object?
                                `<div class='common_app_data_display_master_title'>${props.master_object.title.metadata.default_text}</div>`:''
                            }
                            ${(props.display_type=='VERTICAL_KEY_VALUE' || props.display_type=='MASTER_DETAIL_HORIZONTAL' || props.display_type=='MASTER_DETAIL_VERTICAL')?
                                `
                                ${props.master_object?
                                    `<div class='common_app_data_display_master'>
                                        ${Object.entries(props.master_object).filter(key=>key[0]!='title').map((/**@type{*}*/master_row)=>
                                            `<div class='common_app_data_display_master_list'>
                                                <div class='common_app_data_display_master_row'>
                                                    <div    data-key='${master_row[0]}' 
                                                            class='common_app_data_display_master_col1'>${master_row[1].metadata.default_text}</div>
                                                    <div    data-value='${master_row[0]}' 
                                                            class='common_app_data_display_master_col2'
                                                            contentEditable='${master_row[1].metadata.contentEditable}'>${master_row[1].value ?? ''}</div>
                                                </div>
                                            </div>`).join('')
                                        }
                                    </div>`:''
                                }
                                ${(props.display_type=='MASTER_DETAIL_HORIZONTAL' && props.rows)?
                                    `
                                    ${props.rows.map((/**@type{*}*/detail_row, /**@type{number}*/index)=>
                                        `
                                        ${index==0?
                                            `
                                            <div class='common_app_data_display_detail_horizontal_row_title common_row'>
                                                ${Object.entries(detail_row).map((/**@type{*}*/detail_col)=> 
                                                    `<div class='common_app_data_display_detail_col'>${detail_col[0]}</div>`).join('')
                                                }
                                            </div>
                                            `:''
                                        }
                                        <div class='common_app_data_display_detail_horizontal_row common_row'>
                                            ${Object.entries(detail_row).map((/**@type{*}*/detail_col)=> 
                                                `<div class='common_app_data_display_detail_col'>${detail_col[1]}</div>`).join('')
                                            }
                                        </div>
                                        `).join('')
                                    }`:''
                                }
                                ${(props.display_type=='MASTER_DETAIL_VERTICAL' && props.rows)?
                                    `
                                    ${props.rows.map((/**@type{*}*/detail_row)=>
                                        `<div data-id='${detail_row.id}' data-key='${detail_row.key}' data-value='${detail_row.value}' tabindex=-1 class='common_app_data_display_row common_row'>
                                            <div class='common_app_data_display_col'>${detail_row.key}</div>
                                            <div class='common_app_data_display_col'>${detail_row.value}</div>
                                        </div>
                                        `).join('')
                                    }`:''
                                }`:''
                            }
                            <div class='common_app_data_display_buttons <SPINNER/>'>
                                ${props.button_print?
                                    `<div id='common_app_data_display_button_print' class='common_dialogue_button common_icon' ></div>`:''
                                }
                                ${props.button_update?
                                    `<div id='common_app_data_display_button_update' class='common_dialogue_button common_icon' ></div>`:''
                                }
                                ${props.button_post?
                                    `<div id='common_app_data_display_button_post' class='common_dialogue_button common_icon' ></div>`:''
                                }
                                ${props.button_delete?
                                    `<div id='common_app_data_display_button_delete' class='common_dialogue_button common_icon' ></div>`:''
                                }
                            </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          display_type:'VERTICAL_KEY_VALUE'|'MASTER_DETAIL_HORIZONTAL'|'MASTER_DETAIL_VERTICAL'
 *          master_path:string,
 *          master_query:string,
 *          master_method:string,
 *          master_token_type:string,
 *          detail_path:string,
 *          detail_query:string,
 *          detail_method:string,
 *          detail_token_type:string,
 *          button_print: boolean,
 *          button_update: boolean,
 *          button_post: boolean,
 *          button_delete: boolean,
 *          function_FFB:function,
 *          function_button_print:function,
 *          function_button_update:function,
 *          function_button_post:function,
 *          function_button_delete:function
 *          }} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    let spinner = 'css_spinner';
    const post_component = async () => {
        const master_object = props.master_path?await props.function_FFB(props.master_path, props.master_query, props.master_method, props.master_token_type, null)
                                                        .then((/**@type{*}*/result)=>JSON.parse(result).rows[0].data):{};
        const detail_rows = props.detail_path?await props.function_FFB(props.detail_path, props.detail_query, props.detail_method, props.detail_token_type, null)
                                                        .then((/**@type{*}*/result)=>JSON.parse(result).rows):[];
        spinner = '';
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = 
            render_template({   display_type:props.display_type,
                                master_object:master_object,
                                rows:detail_rows,
                                button_print:props.button_print,
                                button_update:props.button_update,
                                button_post:props.button_post,
                                button_delete:props.button_delete});
        if (props.function_button_print)
            props.common_document.querySelector('#common_app_data_display_button_print')['data-function'] = props.function_button_print;
        if (props.function_button_update)
            props.common_document.querySelector('#common_app_data_display_button_update')['data-function'] = props.function_button_update;
        if (props.function_button_post)
            props.common_document.querySelector('#common_app_data_display_button_post')['data-function'] = props.function_button_post;
        if (props.function_button_delete)
            props.common_document.querySelector('#common_app_data_display_button_delete')['data-function'] = props.function_button_delete;
    }
    /**
     * 
     * @param {props_template} props_template_parameters 
     * @returns 
     */
    const render_template = props_template_parameters =>{
        return template(props_template_parameters)
    }
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template({ display_type:props.display_type,
                                    master_object:null,
                                    rows:[],
                                    button_print:false,
                                    button_update:false,
                                    button_post:false,
                                    button_delete:false})
    };
}
export default component;

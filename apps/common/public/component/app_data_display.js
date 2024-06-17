/**

 * 
 * @typedef {*} master_object_type
 * 
 * @typedef {{  display_type:'VERTICAL_KEY_VALUE'|'MASTER_DETAIL_HORIZONTAL'|'MASTER_DETAIL_VERTICAL',
 *              master_object:master_object_type,
 *              rows:[],
 *              detail_class:string,
 *              new_resource:boolean,
 *              mode:'EDIT'|'READ',
 *              function_format_value:function,
 *              timezone:string,
 *              locale:string,
 *              spinner:string,
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
const template = props =>`  ${(props.master_object && props.new_resource)?
                                `<div class='common_app_data_display_master_title'>${props.master_object.filter((/**@type{*}*/row)=>row.title)[0].title.default_text}</div>`:''
                            }
                            ${(props.master_object && props.new_resource==false)?
                                `<div class='common_app_data_display_master_title'>${props.master_object.title?props.master_object.title.default_text:''}</div>
                                 <div class='common_app_data_display_master_title_sub'>${props.master_object.title_sub?props.master_object.title_sub.default_text:''}</div>`
                                :''
                            }
                            ${(props.display_type=='VERTICAL_KEY_VALUE' || props.display_type=='MASTER_DETAIL_HORIZONTAL' || props.display_type=='MASTER_DETAIL_VERTICAL')?
                                `
                                ${(props.master_object && props.new_resource)?
                                    `<div class='common_app_data_display_master'>
                                        ${props.master_object.filter((/**@type{*}*/row)=>!row.title && !row.title_sub).map((/**@type{*}*/master_row)=>
                                            `<div class='common_app_data_display_master_row'>
                                                    <div    data-key='${Object.keys(master_row)[0]}' 
                                                            class='common_app_data_display_master_col1'>${Object.values(master_row)[0].default_text}</div>
                                                    <div    data-value='${Object.keys(master_row)[0]}' 
                                                            class='common_app_data_display_master_col2'
                                                            contentEditable='${props.mode=='READ'?'false':'true'}'></div>
                                            </div>
                                            `).join('')
                                        }
                                    </div>`:''
                                }
                                ${(props.master_object && props.new_resource==false)?
                                    `<div class='common_app_data_display_master'>
                                        ${Object.entries(props.master_object).filter(key=>key[0]!='title' && key[0]!='title_sub').map((/**@type{*}*/master_row)=>
                                            `<div class='common_app_data_display_master_row'>
                                                    <div    data-key='${master_row[0]}' 
                                                            class='common_app_data_display_master_col1'>${master_row[1].default_text}</div>
                                                    <div    data-value='${master_row[0]}' 
                                                            class='common_app_data_display_master_col2'
                                                            contentEditable='${props.mode=='READ'?'false':'true'}'>${props.function_format_value(master_row[1].value, props.timezone, props.locale)}</div>
                                                </div>
                                            `).join('')
                                        }
                                    </div>`:''
                                }
                                ${(props.display_type=='MASTER_DETAIL_HORIZONTAL' && props.rows)?
                                    `
                                    ${props.rows.map((/**@type{*}*/detail_row, /**@type{number}*/index)=>
                                        `
                                        ${index==0?
                                            `
                                            <div class='common_app_data_display_detail_horizontal_row_title common_row ${props.detail_class}'>
                                                ${Object.entries(detail_row).map((/**@type{*}*/detail_col)=> 
                                                    `<div class='common_app_data_display_detail_col'>${detail_col[0]}</div>`).join('')
                                                }
                                            </div>
                                            `:''
                                        }
                                        <div class='common_app_data_display_detail_horizontal_row common_row ${props.detail_class}'>
                                            ${Object.entries(detail_row).map((/**@type{*}*/detail_col)=> 
                                                `<div class='common_app_data_display_detail_col'>${props.function_format_value(detail_col[1], props.timezone, props.locale)}</div>`).join('')
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
                                            <div class='common_app_data_display_col'>${props.function_format_value(detail_row.value, props.timezone, props.locale)}</div>
                                        </div>
                                        `).join('')
                                    }`:''
                                }`:''
                            }
                            <div class='common_app_data_display_buttons ${props.spinner}'>
                                ${props.button_print?
                                    '<div id=\'common_app_data_display_button_print\' class=\'common_dialogue_button common_icon\' ></div>':''
                                }
                                ${props.button_update?
                                    '<div id=\'common_app_data_display_button_update\' class=\'common_dialogue_button common_icon\' ></div>':''
                                }
                                ${props.button_post?
                                    '<div id=\'common_app_data_display_button_post\' class=\'common_dialogue_button common_icon\' ></div>':''
                                }
                                ${props.button_delete?
                                    '<div id=\'common_app_data_display_button_delete\' class=\'common_dialogue_button common_icon\' ></div>':''
                                }
                            </div>`;
/**
 * 
 * @param {{common_document:import('../../../types.js').AppDocument,
 *          common_mountdiv:string,
 *          app_id:number,
 *          display_type:'VERTICAL_KEY_VALUE'|'MASTER_DETAIL_HORIZONTAL'|'MASTER_DETAIL_VERTICAL'
 *          master_path:string,
 *          master_query:string,
 *          master_method:string,
 *          master_token_type:string,
 *          master_resource:string,
 *          detail_path:string,
 *          detail_query:string,
 *          detail_method:string,
 *          detail_token_type:string,
 *          detail_class:string,
 *          new_resource:boolean,
 *          mode:'EDIT'|'READ',
 *          timezone:string,
 *          locale:string,
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
    /**
     * 
     * @param {*} value 
     * @param {string} timezone
     * @param {string} locale
     * @param {boolean} short
     * @returns {string}
     */
    const format_value = (value, timezone, locale, short=true) => {
        if (value)
            if (typeof value=='number')
                return value.toLocaleString(locale ?? 'en').padStart(2,(0).toLocaleString(locale ?? 'en'));
            else{
                //ISO 8601 format
                const isodate = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)+/g;
                try {
                    if (value.match(isodate)){
                        /**@type{Intl.DateTimeFormatOptions} */
                        const options = short?
                                            {
                                                timeZone: timezone,
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            }:{
                                                timeZone: timezone,
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                timeZoneName: 'long'  
                                            };
                        const utc_date = new Date(Date.UTC(
                            Number(value.substring(0, 4)),      //year
                            Number(value.substring(5, 7)) - 1,  //month
                            Number(value.substring(8, 10)),     //day
                            Number(value.substring(11, 13)),    //hour
                            Number(value.substring(14, 16)),    //min
                            Number(value.substring(17, 19))     //sec
                        ));
                        const format_date = utc_date.toLocaleDateString(locale, options);
                        return format_date;
                    }
                    return value;

                } catch (error) {
                    return value;
                }
            }
        else
            return '';
    };

    const post_component = async () => {
        
        const master_object = props.master_path?
                                    await props.function_FFB(   props.master_path, 
                                                                props.master_query, 
                                                                props.master_method, props.master_token_type, null)
                                            .then((/**@type{*}*/result)=>props.new_resource?JSON.parse(result).rows.map((/**@type{*}*/row)=>JSON.parse(row.json_data)):
                                    JSON.parse(result).rows[0]):{};
        const detail_rows = props.detail_path?
                                    await props.function_FFB(   props.detail_path, 
                                                                props.detail_query, 
                                                                props.detail_method, props.detail_token_type, null)
                                            .then((/**@type{*}*/result)=>JSON.parse(result).rows):
                                    [];
        
        const master_metadata = await props.function_FFB(  '/server-db/app_data_resource_master/', 
                                                            `resource_name=${props.master_resource}&data_app_id=${props.app_id}&fields=json_data`, 
                                                            'GET', 'APP_DATA', null)
                                            .then((/**@type{*}*/result)=>JSON.parse(result).rows.map((/**@type{*}*/row)=>JSON.parse(row.json_data)));
        
        if (props.new_resource==false){
            for (const key of Object.entries(master_object)){
                master_object[key[0]] = {   
                                            value:key[1], 
                                            default_text:master_metadata.filter((/**@type{*}*/row)=>key[0] in row).length>0?master_metadata.filter((/**@type{*}*/row)=>key[0] in row)[0][key[0]].default_text:key[0]
                                        };
            }
        }
            
        spinner = '';
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = 
            render_template({   display_type:props.display_type,
                                master_object:master_object,
                                rows:detail_rows,
                                detail_class:props.detail_class,
                                new_resource:props.new_resource,
                                mode:props.mode,
                                function_format_value:format_value,
                                timezone:props.timezone, 
                                locale:props.locale,
                                spinner:spinner,
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
    };
    /**
     * 
     * @param {props_template} props_template_parameters 
     * @returns 
     */
    const render_template = props_template_parameters =>{
        return template(props_template_parameters);
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template({ display_type:props.display_type,
                                    master_object:null,
                                    rows:[],
                                    detail_class:props.detail_class,
                                    new_resource:props.new_resource,
                                    mode:props.mode,
                                    function_format_value:format_value,
                                    timezone:props.timezone,
                                    locale:props.locale,
                                    spinner:spinner,
                                    button_print:false,
                                    button_update:false,
                                    button_post:false,
                                    button_delete:false})
    };
};
export default component;

/**
 *  Displays app data:
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
 * @module apps/common/component/common_app_data_display
 */
/**
 * @import {CommonRESTAPIMethod, CommonRESTAPIAuthorizationType, CommonModuleCommon, CommonMasterObjectType, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 */

/**
 * @param {{    display_type:'VERTICAL_KEY_VALUE'|'MASTER_DETAIL_HORIZONTAL'|'MASTER_DETAIL_VERTICAL',
 *              master_object:CommonMasterObjectType,
 *              rows:[],
 *              detail_class:string,
 *              new_resource:boolean,
 *              mode:'EDIT'|'READ',
 *              function_format_value:function,
 *              function_div_id:function,
 *              timezone:string,
 *              locale:string,
 *              button_print:boolean,
 *              button_print_icon_class:string,
 *              button_update:boolean,
 *              button_update_icon_class:string,
 *              button_post:boolean,
 *              button_post_icon_class:string,
 *              button_delete:boolean,
 *              button_delete_icon_class:string}} props 
 * @returns {string}
 */
const template = props =>`  ${(props.master_object && props.new_resource)?
                                `<div class='common_app_data_display_master_title'>${props.master_object.filter((/**@type{*}*/row)=>row.json_data.title).length>0?props.master_object.filter((/**@type{*}*/row)=>row.json_data.title)[0].json_data.title.default_text:''}</div>`:''
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
                                        ${props.master_object.filter((/**@type{*}*/row)=>!row.json_data.title && !row.json_data.title_sub).map((/**@type{*}*/master_row)=>
                                            `<div class='common_app_data_display_master_row common_row'>
                                                    <div    data-key='${Object.keys(master_row.json_data)[0]}' 
                                                            class='common_app_data_display_master_col1'>${Object.values(master_row.json_data)[0].default_text}</div>
                                                    <div    data-value='${Object.keys(master_row.json_data)[0]}'
                                                            class='common_app_data_display_master_col2 ${Object.values(master_row.json_data)[0].type=='LOV'?'common_lov_value':''}'
                                                            contentEditable='${(Object.values(master_row.json_data)[0].type=='LOV'||props.mode=='READ')?'false':'true'}'></div>
                                                    ${Object.values(master_row.json_data)[0].type=='LOV'?
                                                        `<div data-lov='${Object.values(master_row.json_data)[0].lov}' class='common_lov_button common_list_lov_click common_icon'></div>`:''
                                                    }
                                            </div>
                                            `).join('')
                                        }
                                    </div>`:''
                                }
                                ${(props.master_object && props.new_resource==false)?
                                    `<div class='common_app_data_display_master'>
                                        ${Object.entries(props.master_object).filter(key=>key[0]!='title' && key[0]!='title_sub').map((/**@type{*}*/master_row)=>
                                            master_row[1].value.constructor===Array?
                                                    `<div id='LIST_${props.function_div_id()}' class='common_app_data_display_master_row'>
                                                        <div class='common_select_dropdown'>
                                                            <div class='common_select_dropdown_value common_app_data_display_master_row_list' data-value=''>
                                                                ${master_row[1].value[0].map((/**@type{*}*/key)=>
                                                                    `<div class='common_app_data_display_master_col_list common_app_data_display_master_col_list_${key.key_type.toLowerCase()}' data-${key.key_name}='${key.key_value}' ${key.key_type=='COLOR'?`style='background-color:${key.key_value};'`:''}>${key.key_type=='COLOR'?' ':key.key_value}</div>`
                                                                ).join('')}
                                                            </div>
                                                            <div class='common_select_dropdown_icon common_icon'></div>
                                                        </div>
                                                        <div class='common_select_options'>
                                                            ${master_row[1].value.map((/**@type{*}*/list)=>
                                                                `<div class='common_select_option common_app_data_display_master_row_list'>
                                                                    ${list.map((/**@type{*}*/key)=>
                                                                        `<div class='common_app_data_display_master_col_list common_app_data_display_master_col_list_${key.key_type.toLowerCase()}' data-${key.key_name}='${key.key_value}' ${key.key_type=='COLOR'?`style='background-color:${key.key_value};'`:''}>${key.key_type=='COLOR'?' ':key.key_value}</div>`
                                                                    ).join('')}
                                                                </div>`
                                                            ).join('')}
                                                        </div>
                                                    </div>`:
                                            `<div class='common_app_data_display_master_row'>
                                                    <div    data-key='${master_row[0]}' 
                                                            class='common_app_data_display_master_col1'>${master_row[1].default_text}</div>
                                                    <div    data-value='${master_row[1].type.toUpperCase()=='IMAGE'?'':master_row[1].value}' 
                                                            class='common_app_data_display_master_col2 common_app_data_display_type_${master_row[1].type.toLowerCase()}'
                                                            ${master_row[1].type.toUpperCase()=='IMAGE'?' ':` contentEditable='${props.mode=='READ'?'false':'true'}'`}>${master_row[1].type.toUpperCase()=='IMAGE'?
                                                                                                                        master_row[1].value:
                                                                                                                            props.function_format_value(master_row[1].value, props.timezone, props.locale)}</div>
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
                                                    `<div class='common_app_data_display_detail_col'>${detail_col[1].default_text}</div>`).join('')
                                                }
                                            </div>
                                            `:''
                                        }
                                        <div class='common_app_data_display_detail_horizontal_row common_row ${props.detail_class}'>
                                            ${Object.entries(detail_row).map((/**@type{*}*/detail_col)=> 
                                                `<div class='common_app_data_display_detail_col'>${props.function_format_value(detail_col[1].value, props.timezone, props.locale)}</div>`).join('')
                                            }
                                        </div>
                                        `).join('')
                                    }`:''
                                }
                                ${(props.display_type=='MASTER_DETAIL_VERTICAL' && props.rows)?
                                    `
                                    ${props.rows.map((/**@type{*}*/detail_row)=>
                                        `<div data-id='${detail_row.id}' data-key='${detail_row.key}' data-value='${detail_row.value}' tabindex=-1 class='common_app_data_display_detail_vertical_row common_row'>
                                            <div class='common_app_data_display_col'>${detail_row.key}</div>
                                            <div class='common_app_data_display_col'>${props.function_format_value(detail_row.value, props.timezone, props.locale)}</div>
                                        </div>
                                        `).join('')
                                    }`:''
                                }`:''
                            }
                            <div class='common_app_data_display_buttons'>
                                ${props.button_print?
                                    `<div id='BUTTON_${props.function_div_id()}' class='common_app_data_display_button_print common_dialogue_button common_icon ${props.button_print_icon_class ?? ''}' ></div>`:''
                                }
                                ${props.button_update?
                                    `<div id='BUTTON_${props.function_div_id()}' class='common_app_data_display_button_update common_dialogue_button common_icon ${props.button_update_icon_class ?? ''}' ></div>`:''
                                }
                                ${props.button_post?
                                    `<div id='BUTTON_${props.function_div_id()}' class='common_app_data_display_button_post common_dialogue_button common_icon ${props.button_post_icon_class ?? ''}' ></div>`:''
                                }
                                ${props.button_delete?
                                    `<div id='BUTTON_${props.function_div_id()}' class='common_app_data_display_button_delete common_dialogue_button common_icon ${props.button_delete_icon_class ?? ''}' ></div>`:''
                                }
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_id:number,
 *                      display_type:'VERTICAL_KEY_VALUE'|'MASTER_DETAIL_HORIZONTAL'|'MASTER_DETAIL_VERTICAL'
 *                      dialogue:boolean,
 *                      master_path:string,
 *                      master_query:string,
 *                      master_body:string,
 *                      master_method:CommonRESTAPIMethod,
 *                      master_token_type:CommonRESTAPIAuthorizationType,
 *                      master_resource:string,
 *                      detail_path:string,
 *                      detail_query:string,
 *                      detail_body:string,
 *                      detail_method:CommonRESTAPIMethod,
 *                      detail_token_type:CommonRESTAPIAuthorizationType,
 *                      detail_resource:string,
 *                      detail_class:string,
 *                      new_resource:boolean,
 *                      mode:'EDIT'|'READ',
 *                      timezone:string,
 *                      locale:string,
 *                      button_print: boolean,
 *                      button_print_icon_class:string,
 *                      button_update: boolean,
 *                      button_update_icon_class:string,
 *                      button_post: boolean,
 *                      button_post_icon_class:string,
 *                      button_delete: boolean,
 *                      button_delete_icon_class:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonFFB:CommonModuleCommon['commonFFB'],
 *                      button_print:function,
 *                      button_update:function,
 *                      button_post:function,
 *                      button_delete:function}}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:{master_object:*},
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    if (props.data.dialogue){
        props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show1');
		props.methods.COMMON_DOCUMENT.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    }
    const div_id = () =>Date.now().toString() + Math.floor(Math.random() *100000).toString();
    /**
     * 
     * @param {*} value 
     * @param {string} timezone
     * @param {string} locale
     * @param {boolean} short
     * @returns {string}
     */
    const format_value = (value, timezone, locale, short=true) => {
        if (value!=null)
            if (typeof value=='number')
                return value==0?'0':value.toLocaleString(locale ?? 'en').padStart(2,(0).toLocaleString(locale ?? 'en'));
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
    const master_object = props.data.master_path?
                                await props.methods.commonFFB({   path: props.data.master_path, 
                                                            query:props.data.master_query, 
                                                            method:props.data.master_method, authorization_type:props.data.master_token_type, body:props.data.master_body})
                                        .then((/**@type{*}*/result)=>
                                            props.data.new_resource?JSON.parse(result).rows:JSON.parse(result).rows[0]):
                                    {};
    const detail_rows = props.data.detail_path?
                                await props.methods.commonFFB({   path:props.data.detail_path, 
                                                            query:props.data.detail_query, 
                                                            method:props.data.detail_method, authorization_type:props.data.detail_token_type, body:props.data.detail_body})
                                        .then((/**@type{*}*/result)=>(JSON.parse(result).rows)?.[0]?JSON.parse(result).rows:[]):
                                [];
    
    if (props.data.new_resource==false){
        const master_metadata = await props.methods.commonFFB({   path:`/app-common-module/${props.data.master_resource}`, 
                                                            query:'fields=json_data', 
                                                            method:'POST', authorization_type:'APP_ID', 
                                                            body:{type:'FUNCTION',IAM_data_app_id:props.data.app_id}})
                                        .then((/**@type{*}*/result)=>JSON.parse(result).rows);
        for (const key of Object.entries(master_object)){
            master_object[key[0]] = {   
                                        value:key[1], 
                                        default_text:master_metadata.filter((/**@type{*}*/row)=>key[0] in row.json_data).length>0?master_metadata.filter((/**@type{*}*/row)=>key[0] in row.json_data)[0].json_data[key[0]].default_text:key[0],
                                        type:master_metadata.filter((/**@type{*}*/row)=>key[0] in row.json_data).length>0?master_metadata.filter((/**@type{*}*/row)=>key[0] in row.json_data)[0].json_data[key[0]].type:key[0]
                                    };
        }
    }
    if (props.data.detail_resource){
        const detail_metadata = await props.methods.commonFFB({   path:`/app-common-module/${props.data.detail_resource}`, 
                                                            query:'fields=json_data', 
                                                            method:'POST', authorization_type:'APP_ID', 
                                                            body:{type:'FUNCTION',IAM_data_app_id:props.data.app_id}})
                                        .then((/**@type{*}*/result)=>JSON.parse(result).rows);
        for (const row of detail_rows){
            for (const key of Object.entries(row)){
                for (const key_metadata of detail_metadata){
                    if (Object.entries(key_metadata.json_data)[0][0] == key[0]){
                        row[key[0]] = {value:key[1], default_text: Object.entries(key_metadata.json_data)[0][1].default_text};
                    }
                }
            }
        }
    }

    const onMounted = async () => {
        if (props.methods.button_print)
            props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv} .common_app_data_display_button_print`)['data-function'] = props.methods.button_print;
        if (props.methods.button_update)
            props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv} .common_app_data_display_button_update`)['data-function'] = props.methods.button_update;
        if (props.methods.button_post)
            props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv} .common_app_data_display_button_post`)['data-function'] = props.methods.button_post;
        if (props.methods.button_delete)
            props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv} .common_app_data_display_button_delete`)['data-function'] = props.methods.button_delete;
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       {master_object:master_object},
        methods:    null,
        template:   template({
                            display_type:props.data.display_type,
                            master_object:master_object,
                            rows:(props.data.detail_path && detail_rows.length>0)?
                                    (Object.values(detail_rows[0])[0].constructor===Array?Object.values(detail_rows[0])[0]:detail_rows):
                                    [],
                            detail_class:props.data.detail_class,
                            new_resource:props.data.new_resource,
                            mode:props.data.mode,
                            function_format_value:format_value,
                            function_div_id:div_id,
                            timezone:props.data.timezone, 
                            locale:props.data.locale,
                            button_print:props.data.button_print,
                            button_print_icon_class:props.data.button_print_icon_class,
                            button_update:props.data.button_update,
                            button_update_icon_class:props.data.button_update_icon_class,
                            button_post:props.data.button_post,
                            button_post_icon_class:props.data.button_post_icon_class,
                            button_delete:props.data.button_delete,
                            button_delete_icon_class:props.data.button_delete_icon_class})
    };
};
export default component;

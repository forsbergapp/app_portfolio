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
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 */

/**
 * @param {{    display_type:'VERTICAL_KEY_VALUE'|'MASTER_DETAIL_HORIZONTAL'|'MASTER_DETAIL_VERTICAL',
 *              master_object:common['CommonMasterObjectType'],
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
                                `<div class='common_app_data_display_master_title'>${props.master_object.filter((/**@type{*}*/row)=>row.Document.title).length>0?props.master_object.filter((/**@type{*}*/row)=>row.Document.title)[0].Document.Title.DefaultText:''}</div>`:''
                            }
                            ${(props.master_object && props.new_resource==false)?
                                `<div class='common_app_data_display_master_title'>${props.master_object.title?props.master_object.Title.DefaultText:''}</div>
                                 <div class='common_app_data_display_master_title_sub'>${props.master_object.TitleSub?props.master_object.TitleSub.DefaultText:''}</div>`
                                :''
                            }
                            ${(props.display_type=='VERTICAL_KEY_VALUE' || props.display_type=='MASTER_DETAIL_HORIZONTAL' || props.display_type=='MASTER_DETAIL_VERTICAL')?
                                `
                                ${(props.master_object && props.new_resource)?
                                    `<div class='common_app_data_display_master'>
                                        ${props.master_object.filter((/**@type{*}*/row)=>!row.Document.Title && !row.Document.TitleSub).map((/**@type{*}*/master_row)=>
                                            `<div class='common_app_data_display_master_row common_row'>
                                                    <div    data-key='${Object.keys(master_row.Document)[0]}' 
                                                            class='common_app_data_display_master_col1'>${Object.values(master_row.Document)[0].DefaultText}</div>
                                                    <div    data-value='${Object.keys(master_row.Document)[0]}'
                                                            class='common_app_data_display_master_col2 ${Object.values(master_row.Document)[0].Type=='LOV'?'common_app_dialogues_lov_value':''}'
                                                            contentEditable='${(Object.values(master_row.Document)[0].Type=='LOV'||props.mode=='READ')?'false':'true'}'></div>
                                                    ${Object.values(master_row.Document)[0].Type=='LOV'?
                                                        `<div data-lov='${Object.values(master_row.Document)[0].Lov}' class='common_app_dialogues_lov_button common_list_lov_click common_icon'></div>`:''
                                                    }
                                            </div>
                                            `).join('')
                                        }
                                    </div>`:''
                                }
                                ${(props.master_object && props.new_resource==false)?
                                    `<div class='common_app_data_display_master'>
                                        ${Object.entries(props.master_object).filter(key=>key[0]!='Title' && key[0]!='TitleSub').map((/**@type{*}*/master_row)=>
                                            master_row[1].Value.constructor===Array?
                                                    `<div id='LIST_${props.function_div_id()}' class='common_app_data_display_master_row'>
                                                        <div class='common_select_dropdown'>
                                                            <div class='common_select_dropdown_value common_app_data_display_master_row_list' data-value=''>
                                                                ${(master_row[1].Value[0]??[]).map((/**@type{*}*/key)=>
                                                                    `<div class='common_app_data_display_master_col_list common_app_data_display_master_col_list_${key.KeyType.toLowerCase()}' data-${key.KeyName}='${key.KeyValue}' ${key.KeyType=='COLOR'?`style='background-color:${key.KeyValue};'`:''}>${key.KeyType=='COLOR'?' ':key.KeyValue}</div>`
                                                                ).join('')}
                                                            </div>
                                                            <div class='common_select_dropdown_icon common_icon'></div>
                                                        </div>
                                                        <div class='common_select_options'>
                                                            ${(master_row[1].Value??[]).map((/**@type{*}*/list)=>
                                                                `<div class='common_select_option common_app_data_display_master_row_list'>
                                                                    ${list.map((/**@type{*}*/key)=>
                                                                        `<div class='common_app_data_display_master_col_list common_app_data_display_master_col_list_${key.KeyType.toLowerCase()}' data-${key.KeyName}='${key.KeyValue}' ${key.KeyType=='COLOR'?`style='background-color:${key.KeyValue};'`:''}>${key.KeyType=='COLOR'?' ':key.KeyValue}</div>`
                                                                    ).join('')}
                                                                </div>`
                                                            ).join('')}
                                                        </div>
                                                    </div>`:
                                            `<div class='common_app_data_display_master_row'>
                                                    <div    data-key='${master_row[0]}' 
                                                            class='common_app_data_display_master_col1'>${
                                                                master_row[1].DefaultText
                                                            }</div>
                                                    <div    data-value='${master_row[1].Type.toUpperCase()=='IMAGE'?'':master_row[1].Value}' 
                                                            class='common_app_data_display_master_col2 common_app_data_display_type_${master_row[1].Type.toLowerCase()}'
                                                            ${master_row[1].Type.toUpperCase()=='IMAGE'?
                                                                ' ':
                                                                    ` contentEditable='${props.mode=='READ'?
                                                                        'false':
                                                                            'true'}'`}>${
                                                                                master_row[1].Type.toUpperCase()=='IMAGE'?
                                                                                    master_row[1].Value:
                                                                                        props.function_format_value(master_row[1].Value, props.timezone, props.locale)
                                                            }</div>
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
                                                    `<div class='common_app_data_display_detail_col'>${detail_col[1].DefaultText}</div>`).join('')
                                                }
                                            </div>
                                            `:''
                                        }
                                        <div class='common_app_data_display_detail_horizontal_row common_row ${props.detail_class}'>
                                            ${Object.entries(detail_row).map((/**@type{*}*/detail_col)=> 
                                                `<div class='common_app_data_display_detail_col'>${props.function_format_value(detail_col[1].Value, props.timezone, props.locale)}</div>`).join('')
                                            }
                                        </div>
                                        `).join('')
                                    }`:''
                                }
                                ${(props.display_type=='MASTER_DETAIL_VERTICAL' && props.rows)?
                                    `
                                    ${props.rows.map((/**@type{*}*/detail_row)=>
                                        `<div data-id='${detail_row.Id}' data-key='${detail_row.Key}' data-value='${detail_row.Value}' tabindex=-1 class='common_app_data_display_detail_vertical_row common_row'>
                                            <div class='common_app_data_display_col'>${detail_row.Key}</div>
                                            <div class='common_app_data_display_col'>${props.function_format_value(detail_row.Value, props.timezone, props.locale)}</div>
                                        </div>
                                        `).join('')
                                    }`:''
                                }`:''
                            }
                            <div class='common_app_data_display_buttons'>
                                ${props.button_print?
                                    `<div id='BUTTON_${props.function_div_id()}' class='common_app_data_display_button_print common_app_dialogues_button common_icon ${props.button_print_icon_class ?? ''}' ></div>`:''
                                }
                                ${props.button_update?
                                    `<div id='BUTTON_${props.function_div_id()}' class='common_app_data_display_button_update common_app_dialogues_button common_icon ${props.button_update_icon_class ?? ''}' ></div>`:''
                                }
                                ${props.button_post?
                                    `<div id='BUTTON_${props.function_div_id()}' class='common_app_data_display_button_post common_app_dialogues_button common_icon ${props.button_post_icon_class ?? ''}' ></div>`:''
                                }
                                ${props.button_delete?
                                    `<div id='BUTTON_${props.function_div_id()}' class='common_app_data_display_button_delete common_app_dialogues_button common_icon ${props.button_delete_icon_class ?? ''}' ></div>`:''
                                }
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_id:number,
 *                      common_app_id:number,
 *                      display_type:'VERTICAL_KEY_VALUE'|'MASTER_DETAIL_HORIZONTAL'|'MASTER_DETAIL_VERTICAL'
 *                      dialogue:boolean,
 *                      master_path:string,
 *                      master_query:string,
 *                      master_body:string,
 *                      master_method:common['CommonRESTAPIMethod'],
 *                      master_token_type:common['CommonRESTAPIAuthorizationType'],
 *                      master_resource:string,
 *                      detail_path:string,
 *                      detail_query:string,
 *                      detail_body:string,
 *                      detail_method:common['CommonRESTAPIMethod'],
 *                      detail_token_type:common['CommonRESTAPIAuthorizationType'],
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
 *                      COMMON:common['CommonModuleCommon'],
 *                      button_print:function,
 *                      button_update:function,
 *                      button_post:function,
 *                      button_delete:function}}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:{master_object:*},
 *                      methods:null,
 *                      events:common['commonComponentEvents'],
 *                      template:string}>}
 */
const component = async props => {
    if (props.data.dialogue){
        props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_app_dialogues_show1');
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
                                await props.methods.COMMON.commonFFB({   path: props.data.master_path, 
                                                            query:props.data.master_query, 
                                                            method:props.data.master_method, authorization_type:props.data.master_token_type, body:props.data.master_body})
                                        .then((/**@type{*}*/result)=>
                                            props.data.new_resource?JSON.parse(result).rows:JSON.parse(result).rows[0]):
                                    {};
    const detail_rows = props.data.detail_path?
                                await props.methods.COMMON.commonFFB({   path:props.data.detail_path, 
                                                            query:props.data.detail_query, 
                                                            method:props.data.detail_method, authorization_type:props.data.detail_token_type, body:props.data.detail_body})
                                        .then((/**@type{*}*/result)=>(JSON.parse(result).rows)?.[0]?JSON.parse(result).rows:[]):
                                [];
    
    if (props.data.new_resource==false){
        const master_metadata = await props.methods.COMMON.commonFFB({   path:'/app-common-module/COMMON_APP_DATA_METADATA', 
                                                            query:'fields=Document', 
                                                            method:'POST', authorization_type:'APP_ID', 
                                                            body:{  type:'FUNCTION',
                                                                    IAM_module_app_id:props.data.common_app_id,
                                                                    IAM_data_app_id:props.data.app_id, 
                                                                    resource_name:props.data.master_resource}})
                                        .then((/**@type{*}*/result)=>JSON.parse(result).rows);
        for (const key of Object.entries(master_object)){
            master_object[key[0]] = {   
                                        Value:key[1], 
                                        DefaultText:master_metadata.filter((/**@type{*}*/row)=>key[0] in row.Document).length>0?master_metadata.filter((/**@type{*}*/row)=>key[0] in row.Document)[0].Document[key[0]].DefaultText:key[0],
                                        Type:master_metadata.filter((/**@type{*}*/row)=>key[0] in row.Document).length>0?master_metadata.filter((/**@type{*}*/row)=>key[0] in row.Document)[0].Document[key[0]].Type:key[0]
                                    };
        }
    }
    if (props.data.detail_resource){
        const detail_metadata = await props.methods.COMMON.commonFFB({   path:'/app-common-module/COMMON_APP_DATA_METADATA',
                                                            query:'fields=Document', 
                                                            method:'POST', authorization_type:'APP_ID', 
                                                            body:{  type:'FUNCTION',
                                                                    IAM_module_app_id:props.data.common_app_id,
                                                                    IAM_data_app_id:props.data.app_id, 
                                                                    resource_name:props.data.detail_resource}})
                                        .then((/**@type{*}*/result)=>JSON.parse(result).rows);
        for (const row of detail_rows){
            for (const key of Object.entries(row)){
                for (const key_metadata of detail_metadata){
                    if (Object.entries(key_metadata.Document)[0][0] == key[0]){
                        row[key[0]] = {Value:key[1], DefaultText: Object.entries(key_metadata.Document)[0][1].DefaultText};
                    }
                }
            }
        }
    }

    /**
     * @name events
     * @descption Events
     * @function
     * @param {common['commonEventType']} event_type
     * @param {common['CommonAppEvent']} event
     * @returns {Promise.<void>}
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.COMMON.commonMiscElementId(event.target);
        switch (event_type){
            case 'click':{
                switch (true){
                    case event.target.classList.contains('common_app_data_display_button_print'):
                    case event.target.classList.contains('common_app_data_display_button_update'):
                    case event.target.classList.contains('common_app_data_display_button_post'):
                    case event.target.classList.contains('common_app_data_display_button_delete'):{
                        if (props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`)['data-function'])
                            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`)['data-function']();
                        break;
                    }
                }
            }
        }
    };
    const onMounted = async () => {
        if (props.methods.button_print)
            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv} .common_app_data_display_button_print`)['data-function'] = props.methods.button_print;
        if (props.methods.button_update)
            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv} .common_app_data_display_button_update`)['data-function'] = props.methods.button_update;
        if (props.methods.button_post)
            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv} .common_app_data_display_button_post`)['data-function'] = props.methods.button_post;
        if (props.methods.button_delete)
            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv} .common_app_data_display_button_delete`)['data-function'] = props.methods.button_delete;
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       {master_object:master_object},
        methods:    null,
        events:     events,
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

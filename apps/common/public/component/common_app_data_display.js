/**
 *  @description Displays app data:
 *                              usage suggestion        design
 *  VERTICAL_KEY_VALUE          form                    key value vertical array list, 2 columns
 *                                                      
 *  MASTER_DETAIL_HORIZONTAL    order, invoice,         master key values one object with detail array rows with objects (more than 2 columns) below, 
 *                              product, search etc     detail keys displayed on first row
 * 
 *  MASTER_DETAIL_VERTICAL      resource info           master key values one object with detail key value (2 columns) vertical array list below
 * 
 *  @example Show pay dialogue
 * 
 *  await common.commonComponentRender({
 *       mountDiv:   'common_app_dialogues_app_data_display', 
 *       data:       {
 *                   display_type:'VERTICAL_KEY_VALUE',
 *                   dialogue:true,
 *                   lov:[	{   lov:'PAYMENT_METHOD', 	
 *                               lov_functionData:null, 
 *                               lov_functionRow:getPaymentMethod}],
 *                   master_path:'/app-common-module/COMMON_APP_DATA_METADATA',
 *                   master_query:'fields=Document',
 *                   master_body:{   type:'FUNCTION',
 *                                   IAM_module_app_id:common.commonGlobalGet('Parameters').app_common_app_id,
 *                                   IAM_data_app_id:common.commonGlobalGet('UserApp').app_id, 
 *                                   resource_name:'PAYMENT_METADATA'},
 *                   master_method:'POST',
 *                   master_token_type:'APP_ID',
 *                   master_resource:'PAYMENT_METADATA',
 *                   detail_path:null,
 *                   detail_query:null,
 *                   detail_body:null,
 *                   detail_method:null,
 *                   detail_token_type:null,
 *                   detail_class:null,
 *                   new_resource:true,
 *                   mode:'EDIT',
 *                   button_print: false,
 *                   button_update: false,
 *                   button_post: true,
 *                   button_post_icon:commonGlobalGet('ICONS')['ok'],
 *                   button_delete: true,
 *                   button_delete_icon:commonGlobalGet('ICONS')['cancel']
 *                   },
 *       methods:    {
 *                   button_print:null,
 *                   button_update:null,
 *                   button_post:appPaymentRequest,
 *                   button_delete:appPayCancel},
 *       path:       '/common/component/common_app_data_display.js'});
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
 *              button_print:boolean,
 *              button_update:boolean,
 *              button_post:boolean,
 *              button_delete:boolean,
 *              LOV_RECORDS:{ mountDiv:   string,
 *               data:  {default_data_value:string,
 *                       default_value:string,
 *                       options:string[],
 *                       column_value:string,
 *                       column_text:string,
 *                       class_dropdown_value:string,
 *                       class_option: string 
 *                      }}[]|[],
 *              icons:{ lov:string,
 *                      print:string,
 *                      update:string,
 *                      post:string,
 *                      delete:string,
 *                      select:string}}} props 
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
                                                        `<div data-lov='${Object.values(master_row.Document)[0].Lov}' class='common_link common_icon_lov'>${props.icons.lov}</div>`:''
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
                                                    (id=>
                                                    `<div id='${id}' class='common_select common_app_data_display_master_row'>
                                                        ${/**@ts-ignore*/props.LOV_RECORDS.push(
                                                                {   mountDiv:   id,
                                                                    data:  {default_data_value:'',
                                                                            default_value:(master_row[1].Value[0]??[]).map((/**@type{*}*/key)=>
                                                                                                    `<div class='common_app_data_display_master_col_list common_app_data_display_master_col_list_${key.KeyType.toLowerCase()}' data-${key.KeyName}='${key.KeyValue}' ${key.KeyType=='COLOR'?`style='background-color:${key.KeyValue};'`:''}>${key.KeyType=='COLOR'?' ':key.KeyValue}</div>`
                                                                                                ).join(''),
                                                                            options:(master_row[1].Value??[]).map((/**@type{*}*/list)=>{
                                                                                        return {VALUE:'',
                                                                                                TEXT:list.map((/**@type{*}*/key)=>
                                                                                                    `<div class='common_app_data_display_master_col_list common_app_data_display_master_col_list_${key.KeyType.toLowerCase()}' data-${key.KeyName}='${key.KeyValue}' ${key.KeyType=='COLOR'?`style='background-color:${key.KeyValue};'`:''}>${key.KeyType=='COLOR'?' ':key.KeyValue}</div>`
                                                                                                    ).join('')
                                                                                                }
                                                                                    }),
                                                                            column_value:'VALUE',
                                                                            column_text:'TEXT',
                                                                            class_dropdown_value:'common_app_data_display_master_row_list',
                                                                            class_option: 'common_app_data_display_master_row_list' 
                                                                            }
                                                                })}
                                                    </div>`)(`LIST_${props.function_div_id()}`):
                                            `<div class='common_app_data_display_master_row'>
                                                    <div    data-key='${master_row[0]}' 
                                                            class='common_app_data_display_master_col1'>${
                                                                master_row[1].DefaultText
                                                            }</div>
                                                    <div    data-key='${master_row[0]}'
                                                            data-value='${master_row[1].Type.toUpperCase()=='IMAGE'?'':master_row[1].Value}' 
                                                            class='common_app_data_display_master_col2'
                                                            ${master_row[1].Type.toUpperCase()=='IMAGE'?
                                                                ' ':
                                                                    ` contentEditable='${props.mode=='READ'?
                                                                        'false':
                                                                            'true'}'`}>${
                                                                                master_row[1].Type.toUpperCase()=='IMAGE'?
                                                                                    master_row[1].Value:
                                                                                        props.function_format_value(master_row[1].Value)
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
                                                `<div class='common_app_data_display_detail_col'>${props.function_format_value(detail_col[1].Value)}</div>`).join('')
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
                                            <div class='common_app_data_display_col'>${props.function_format_value(detail_row.Value)}</div>
                                        </div>
                                        `).join('')
                                    }`:''
                                }`:''
                            }
                            <div class='common_app_data_display_buttons'>
                                ${props.button_print?
                                    `<div id='BUTTON_${props.function_div_id()}' class='common_app_data_display_button_print common_app_dialogues_button common_link common_icon_button' >${props.icons.print}</div>`:''
                                }
                                ${props.button_update?
                                    `<div id='BUTTON_${props.function_div_id()}' class='common_app_data_display_button_update common_app_dialogues_button common_link common_icon_button' >${props.icons.update}</div>`:''
                                }
                                ${props.button_post?
                                    `<div id='BUTTON_${props.function_div_id()}' class='common_app_data_display_button_post common_app_dialogues_button common_link common_icon_button' >${props.icons.post}</div>`:''
                                }
                                ${props.button_delete?
                                    `<div id='BUTTON_${props.function_div_id()}' class='common_app_data_display_button_delete common_app_dialogues_button common_link common_icon_button' >${props.icons.delete}</div>`:''
                                }
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      display_type:'VERTICAL_KEY_VALUE'|'MASTER_DETAIL_HORIZONTAL'|'MASTER_DETAIL_VERTICAL'
 *                      dialogue:boolean,
 *                      lov: {  lov:string, 
 *                              lov_functionData: ((arg0:common['CommonAppEvent']['target'])=>Promise.<Object.<string,*>[]>)|null,
 *                              lov_functionRow :((arg0:{id:*,value:*}|null)=> Promise.<void>)|null
 *                          }[],
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
 *                      button_print: boolean,
 *                      button_print_icon:string,
 *                      button_update: boolean,
 *                      button_update_icon:string,
 *                      button_post: boolean,
 *                      button_post_icon:string,
 *                      button_delete: boolean,
 *                      button_delete_icon:string},
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
    /**@type{{ mountDiv:   string,
      *          data:  {default_data_value:string,
      *                  default_value:string,
      *                  options:string[],
      *                  column_value:string,
      *                  column_text:string,
      *                  class_dropdown_value:string,
      *                  class_option: string 
      *      }}[]|[]} 
      */
    const LOV_RECORDS = [];
    if (props.data.dialogue){
        props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_app_dialogues_show1');
    }
    const div_id = () =>Date.now().toString() + Math.floor(Math.random() *100000).toString();
    
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
                                                                    IAM_module_app_id: props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id,
                                                                    IAM_data_app_id:props.methods.COMMON.commonGlobalGet('UserApp').app_id, 
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
                                                                    IAM_module_app_id:props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id,
                                                                    IAM_data_app_id:props.methods.COMMON.commonGlobalGet('UserApp').app_id, 
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
                const elementDIV = props.methods.COMMON.commonMiscElementDiv(event.target);
                switch (true){
                    case    elementDIV.hasAttribute('data-lov'):{
                        if (props.data.lov.filter(row=>row.lov==elementDIV.getAttribute('data-lov')).length>0)
                            props.methods.COMMON.commonComponentRender({
                                mountDiv:   'common_app_dialogues_lov',
                                data:       {
                                            lov:                elementDIV.getAttribute('data-lov'),
                                            lov_custom_value:   null
                                            },
                                methods:    {
                                            functionData:       props.data.lov.filter(row=>row.lov==elementDIV.getAttribute('data-lov'))[0].lov_functionData,
                                            functionRow:        props.data.lov.filter(row=>row.lov==elementDIV.getAttribute('data-lov'))[0].lov_functionRow,
                                            event_target:       elementDIV
                                            },
                                path:       '/common/component/common_app_dialogues_lov.js'});
                        break;
                    }
                    case [  'common_app_data_display_button_print', 
                            'common_app_data_display_button_update',
                            'common_app_data_display_button_post',
                            'common_app_data_display_button_delete']
                            .filter(row=>elementDIV.className.indexOf(row)>-1).length>0:{
                        if (props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`)['data-function'])
                            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`)['data-function']();
                         break;
                    }
                }
            }
        }
    };
    const onMounted = async () => {
        
        for (const record of LOV_RECORDS)
            await props.methods.COMMON.commonComponentRender({
                                            /**@ts-ignore */
                            mountDiv:       record.mountDiv,
                            data:           {
                                            /**@ts-ignore */
                                            default_data_value:record.data.default_data_value,
                                            /**@ts-ignore */
                                            default_value:record.data.default_value,
                                            /**@ts-ignore */
                                            options:record.data.options,
                                            /**@ts-ignore */
                                            column_value:record.data.column_value,
                                            /**@ts-ignore */
                                            column_text:record.data.column_text,
                                            /**@ts-ignore */
                                            class_dropdown_value:record.data.class_dropdown_value,
                                            /**@ts-ignore */
                                            class_option: record.data.class_option 
                                            },
                            methods:        null,
                            path:           '/common/component/common_select.js'});
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
                            function_format_value:props.methods.COMMON.commonMiscFormatJsonDate,
                            function_div_id:div_id,
                            button_print:props.data.button_print,
                            button_update:props.data.button_update,
                            button_post:props.data.button_post,
                            button_delete:props.data.button_delete,
                            LOV_RECORDS:LOV_RECORDS,
                            icons:{ lov:props.methods.COMMON.commonGlobalGet('ICONS')['lov'],
                                    print:props.data.button_print_icon ?? props.methods.COMMON.commonGlobalGet('ICONS')['print'],
                                    update:props.data.button_update_icon ?? props.methods.COMMON.commonGlobalGet('ICONS')['save'],
                                    post:props.data.button_post_icon ?? props.methods.COMMON.commonGlobalGet('ICONS')['add'],
                                    delete:props.data.button_delete_icon ?? props.methods.COMMON.commonGlobalGet('ICONS')['delete'],
                                    select:props.data.button_delete_icon ?? props.methods.COMMON.commonGlobalGet('ICONS')['select']
                            }})
    };
};
export default component;

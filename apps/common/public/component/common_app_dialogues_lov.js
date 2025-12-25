/**
 * Displays list of values
 * @module apps/common/component/common_app_dialogues_lov
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{list:Object.<string,*>[],
 *          lov:string,
 *          lov_column_id:string,
 *          lov_column_value:string}} props 
 * @returns {string}
 */
const template = props =>`  <div id='common_app_dialogues_lov_form'>
                                <div id='common_app_dialogues_lov_title' class='common_icon'></div>
                                <div id='common_app_dialogues_lov_search_row'>
                                    <div id='common_app_dialogues_lov_search_input' contentEditable='true' class='common_input'></div>
                                    <div id='common_app_dialogues_lov_search_icon' class='common_icon common_icon_list'></div>
                                </div>
                            <div id='common_app_dialogues_lov_list' data-lov='${props.lov}' class='common_list_scrollbar'>
                                ${props.list.map(list_row=>
                                    `<div   data-id     ='${list_row[props.lov_column_id]}' 
                                            data-value  ='${list_row[props.lov_column_value]}' 
                                            tabindex    =-1 
                                            class='common_list_lov_row common_row'>
                                        <div class='common_list_lov_col1'>${list_row[props.lov_column_id]}</div>
                                        <div class='common_list_lov_col2'>${list_row[props.lov_column_value]}</div>
                                    </div>
                                    `).join('')
                                }
                            </div>
                            <div id='common_app_dialogues_lov_close' class='common_app_dialogues_button common_icon common_icon_button'></div>
                        </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      lov: 'SERVER_LOG_FILES'|'COUNTRY'|'CUSTOM'|string,
 *                      lov_custom_value:string,
 *                      commonMountdiv:string
 *                      },
 *          methods:    {
 *                      functionData:   ((arg0:common['CommonAppEvent']['target'])=>Promise.<Object.<string,*>[]>)|null,
 *                      functionRow:    ((arg0:{id:*,value:*}|null)=> Promise.<void>)|null,
 *                      event_target:common['CommonAppEvent']['target']
 *                      COMMON:common['CommonModuleCommon'],
 *                      }}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:   null,
 *                      methods:null,
 *                      events:events,
 *                      template:string}|null>}
 */
const component = async props => {
    
    props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_app_dialogues_show2');

    let path = '';
    let query = null;
    /**@type{common['CommonRESTAPIAuthorizationType']}*/
    let token_type;
    /**@type{common['CommonRESTAPIMethod']}*/
    let method;
    let body = null;
    let lov_column_value = '';
    let lov_column_id = '';
    switch (props.data.lov){
        //server logs files for admin
        case 'SERVER_LOG_FILES':{
            method = 'GET';
            lov_column_id = 'Id';
            lov_column_value = 'Filename';
            path = '/server-db/log-files';
            query= null;
            token_type = 'ADMIN';
            break;
        }
        //country for common app id
        case 'COUNTRY':{
            method = 'POST', 
            lov_column_id = 'Value';
            lov_column_value = 'text';
            path = '/app-common-module/COMMON_COUNTRY';
            query= `locale=${props.methods.COMMON.commonGlobalGet('user_locale')}`;
            token_type = 'APP_ID';
            body = {type:'FUNCTION',IAM_data_app_id : props.methods.COMMON.commonGlobalGet('app_common_app_id')};
            break;
        }
        default:{
            //lov for current app id
            method = 'GET';
            lov_column_id = 'Value';
            lov_column_value = 'DisplayData';
            path = '/server-db/appdata/';
            query= `name=${props.data.lov}&IAM_data_app_id=${props.methods.COMMON.commonGlobalGet('app_id')}`;
            token_type = 'APP_ID';
        }
    }
    const setup =  {lov_rows:   props.data.lov=='CUSTOM'?
                            (props.methods.functionData ?
                                await props.methods.functionData(props.methods.event_target):
                                null):
                            await props.methods.COMMON.commonFFB({
                                                    path:path, 
                                                    query:query, 
                                                    method:method, 
                                                    authorization_type:token_type,
                                                    body:body
                                                }).then((/**@type{string}*/result)=>
                                                        props.data.lov =='SERVER_LOG_FILES'?
                                                            JSON.parse(result).rows:
                                                                //COUNTRY and default use base64
                                                                JSON.parse(props.methods.COMMON.commonWindowFromBase64(JSON.parse(result).rows[0].data))),
                    lov_column_id     : props.data.lov=='CUSTOM'?'Id':lov_column_id,
                    lov_column_value  : props.data.lov=='CUSTOM'?
                                            props.data.lov_custom_value:
                                                lov_column_value
        };

    /**
     * @name LovFilter
     * @description Lov filter
     * @function
     * @param {string} text_filter 
     * @returns {void}
     */
    const LovFilter = text_filter => {
        const rows = props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll('.common_list_lov_row');
        for (const row of rows) {
            row.classList.remove ('common_row_hide');
            row.classList.remove ('common_row_selected');
        }
        for (const row of rows) {
            if (row.children[0].children[0].textContent.toUpperCase().indexOf(text_filter.toUpperCase()) > -1 ||
                row.children[1].children[0].textContent.toUpperCase().indexOf(text_filter.toUpperCase()) > -1){
                    row.classList.remove ('common_row_hide');
                }
            else{
                row.classList.remove ('common_row_hide');
                row.classList.add ('common_row_hide');
            }
        }
    };

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
        switch (true){
            case event_type == 'click' && event_target_id== 'common_app_dialogues_lov_search_icon':{
                LovFilter(props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_lov_search_input').textContent);
                break;
            }
            case event_type == 'click' && event_target_id=='common_app_dialogues_lov_close':{
                props.methods.COMMON.commonComponentRemove('common_app_dialogues_lov');
                break;
            }
            case event_type == 'click' && event_target_id=='common_app_dialogues_lov_list' && 
                props.methods.COMMON.commonMiscElementRow(event.target).hasAttribute('data-id'):{
                if (props.methods.functionRow){
                    await props.methods.functionRow({id:props.methods.COMMON.commonMiscElementRow(event.target).getAttribute('data-id'),
                                                     value:props.methods.COMMON.commonMiscElementRow(event.target).getAttribute('data-value')
                                                    });
                    props.methods.COMMON.commonComponentRemove('common_app_dialogues_lov');
                }
                break;
            }
            case event_type =='keyup' && event_target_id=='common_app_dialogues_lov_search_input':{
                props.methods.COMMON.commonMiscListKeyEvent({event:event,
                                        event_function:LovFilter,
                                        event_parameters:props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_lov_search_input').textContent,
                                        rows_element:'common_app_dialogues_lov_list',
                                        search_input:'common_app_dialogues_lov_search_input'});
                break;
            }
        }
    };
    /**
     * @returns {void}
     */
    const onMounted = () =>{
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_lov_search_input').focus();
    };
    //return empty component if CUSTOM and no records found
    return (props.data.lov=='CUSTOM' && (!setup.lov_rows ||setup.lov_rows.length==0))?
                null:
                    {
                        lifecycle:  {onMounted:onMounted},
                        data:       null,
                        methods:    null,
                        events:     events,
                        template:   template({
                                            list: setup.lov_rows, 
                                            lov:props.data.lov, 
                                            lov_column_id:setup.lov_column_id,
                                            lov_column_value:setup.lov_column_value
                                            })
                    };
};
export default component;
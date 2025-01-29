/**
 * Displays list of values
 * @module apps/common/component/common_dialogue_lov
 */
/**
 * @import {CommonRESTAPIAuthorizationType, CommonRESTAPIMethod, CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{list:*,
 *          lov:string,
 *          lov_column_value:string}} props 
 * @returns {string}
 */
const template = props =>`  <div id='common_lov_form'>
                                <div id='common_lov_title' class='common_icon'></div>
                                <div id='common_lov_search_row'>
                                    <div id='common_lov_search_input' contentEditable='true' class='common_input'></div>
                                    <div id='common_lov_search_icon' class='common_icon'></div>
                                </div>
                            <div id='common_lov_list' data-lov='${props.lov}' class='common_list_scrollbar'>
                                ${props.list.map((/**@type{*}*/list_row)=>
                                    `<div data-id='${props.lov_column_value.startsWith('text')?list_row.value:list_row.id}' data-value='${list_row[props.lov_column_value]}' tabindex=-1 class='common_list_lov_row common_row'>
                                        <div class='common_list_lov_col1'>
                                            <div>${props.lov_column_value=='text'?list_row.value:list_row.id}</div>
                                        </div>
                                        <div class='common_list_lov_col2'>
                                            <div>${list_row[props.lov_column_value]}</div>
                                        </div>
                                    </div>
                                    `).join('')
                                }
                            </div>
                            <div id='common_lov_close' class='common_dialogue_button common_icon'></div>
                        </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      common_app_id:number,
 *                      user_locale:string,
 *                      lov:string,
 *                      lov_custom_list?:{}[],
 *                      lov_custom_value?:string
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      function_event:function,
 *                      commonFFB:CommonModuleCommon['commonFFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show2');
    props.methods.COMMON_DOCUMENT.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    let path = '';
    let query = null;
    /**@type{CommonRESTAPIAuthorizationType}*/
    let token_type;
    /**@type{CommonRESTAPIMethod}*/
    let method;
    let body = null;
    let lov_column = '';
    switch (props.data.lov){
        case 'SERVER_LOG_FILES':{
            method = 'GET';
            lov_column = 'filename';
            path = '/server-log/log-files';
            query= null;
            token_type = 'ADMIN';
            break;
        }
        case 'COUNTRY':{
            method = 'POST', 
            lov_column = 'text';
            path = '/app-module/COMMON_COUNTRY';
            query= `locale=${props.data.user_locale}`;
            token_type = 'APP_ID';
            body = {type:'FUNCTION',ddata_app_id : props.data.common_app_id};
            break;
        }
        default:{
            method = 'GET';
            lov_column = 'text';
            path = '/server-db/app_settings';
            query= `setting_type=${props.data.lov}`;
            token_type = 'APP_ID';
        }
    }
    const lov_rows          = props.data.lov=='CUSTOM'?props.data.lov_custom_list:await props.methods.commonFFB({
                                                                                                                    path:path, 
                                                                                                                    query:query, 
                                                                                                                    method:method, 
                                                                                                                    authorization_type:token_type,
                                                                                                                    body:body
                                                                                                                }).then((/**@type{string}*/result)=>JSON.parse(result).rows);
    const lov_column_value  = props.data.lov=='CUSTOM'?(props.data.lov_custom_value ??''):lov_column;

    /**
     * @returns {void}
     */
     const onMounted = () =>{
        props.methods.COMMON_DOCUMENT.querySelector('#common_lov_list')['data-function'] = props.methods.function_event;
        props.methods.COMMON_DOCUMENT.querySelector('#common_lov_search_input').focus();
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({
                            list: lov_rows, 
                            lov:props.data.lov, 
                            lov_column_value:lov_column_value
                            })
    };
};
export default component;
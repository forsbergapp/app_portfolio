/**
 * @module apps/common/component/common_dialogue_lov
 */

/**
 * 
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
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      common_app_id:number,
 *                      lov:string,
 *                      lov_custom_list?:{}[],
 *                      lov_custom_value?:string
 *                      },
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      function_event:function,
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).classList.add('common_dialogue_show2');
    props.methods.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');

    let path = '';
    let query = null;
    let token_type = '';
    let lov_column = '';
    switch (props.data.lov){
        case 'SERVER_LOG_FILES':{
            lov_column = 'filename';
            path = '/server-log/log-files';
            query= null;
            token_type = 'SYSTEMADMIN';
            break;
        }
        case 'APP_CATEGORY':{
            lov_column = 'app_category_text';
            path = '/server-db_admin/app_category';
            query= null;
            token_type = 'APP_ACCESS';
            break;
        }
        case 'APP_ROLE':{
            lov_column = 'icon';
            path = '/server-db_admin/app_role';
            query= null;
            token_type = 'APP_ACCESS';
            break;
        }
        case 'COUNTRY':{
            lov_column = 'text_lov';
            path = '/server-db/country';
            query= null;
            token_type = 'APP_DATA';
            break;
        }
        default:{
            lov_column = 'text';
            path = '/server-db/app_settings';
            query= `setting_type=${props.data.lov}`;
            token_type = 'APP_DATA';
        }
    }
    const lov_rows          = props.data.lov=='CUSTOM'?props.data.lov_custom_list:await props.methods.FFB({path:path, query:query, method:'GET', authorization_type:token_type}).then((/**@type{string}*/result)=>JSON.parse(result).rows);
    const lov_column_value  = props.data.lov=='CUSTOM'?(props.data.lov_custom_value ??''):lov_column;

    /**
     * @returns {void}
     */
     const onMounted = () =>{
        props.methods.common_document.querySelector('#common_lov_list')['data-function'] = props.methods.function_event;
        props.methods.common_document.querySelector('#common_lov_search_input').focus();
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
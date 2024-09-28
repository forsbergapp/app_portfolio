/**
 * @module apps/common/component/dialogue_lov
 */

/**
 * 
 * @param {{spinner:string,
 *          list:*,
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
                            <div id='common_lov_list' data-lov='${props.lov}' class='common_list_scrollbar ${props.spinner}'>
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
 *                      },
 *          lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:{onMounted:function}, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).classList.add('common_dialogue_show2');
    props.methods.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    /**
     * @returns {void}
     */
     const onMounted = () =>{
        if (props.data.lov=='CUSTOM'){
            props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = template({ spinner:'', 
                                                                                                    list:props.data.lov_custom_list, 
                                                                                                    lov:props.data.lov, 
                                                                                                    lov_column_value:props.data.lov_custom_value ??''});
            props.methods.common_document.querySelector('#common_lov_list')['data-function'] = props.methods.function_event;
            props.methods.common_document.querySelector('#common_lov_search_input').focus();
        }
        else{
            let path = '';
            let query = null;
            let token_type = '';
            let lov_column_value = '';
            switch (props.data.lov){
                case 'SERVER_LOG_FILES':{
                    lov_column_value = 'filename';
                    path = '/server-log/log-files';
                    query= null;
                    token_type = 'SYSTEMADMIN';
                    break;
                }
                case 'APP_CATEGORY':{
                    lov_column_value = 'app_category_text';
                    path = '/server-db_admin/app_category';
                    query= null;
                    token_type = 'APP_ACCESS';
                    break;
                }
                case 'APP_ROLE':{
                    lov_column_value = 'icon';
                    path = '/server-db_admin/app_role';
                    query= null;
                    token_type = 'APP_ACCESS';
                    break;
                }
                case 'COUNTRY':{
                    lov_column_value = 'text_lov';
                    path = '/server-db/country';
                    query= null;
                    token_type = 'APP_DATA';
                    break;
                }
                default:{
                    lov_column_value = 'text';
                    path = '/server-db/app_settings';
                    query= `setting_type=${props.data.lov}`;
                    token_type = 'APP_DATA';
                }
            }
            props.methods.FFB(path, query, 'GET', token_type, null)
            .then((/**@type{string}*/result)=>{
                    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = template({ spinner:'', 
                                                                                                            list:JSON.parse(result).rows, 
                                                                                                            lov:props.data.lov, 
                                                                                                            lov_column_value:lov_column_value});
                    props.methods.common_document.querySelector('#common_lov_list')['data-function'] = props.methods.function_event;
                    props.methods.common_document.querySelector('#common_lov_search_input').focus();
            });
        }
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({spinner:'css_spinner', list: [], lov:props.data.lov, lov_column_value:''})
    };
};
export default component;
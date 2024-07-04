/**
 * 
 * @param {{list:*,
 *          lov_column_value:string}} props 
 * @returns 
 */
const template = props =>` <div id='common_lov_form'>
                            <div id='common_lov_title' class='common_icon'></div>
                            <div id='common_lov_search_row'>
                                <div id='common_lov_search_input' contentEditable='true' class='common_input'></div>
                                <div id='common_lov_search_icon' class='common_icon'></div>
                            </div>
                            <div id='common_lov_list' class='common_list_scrollbar <SPINNER/>'>
                            ${props.list.map((/**@type{*}*/list_row)=>
                                `<div data-id='${list_row.id}' data-value='${list_row[props.lov_column_value]}' tabindex=-1 class='common_list_lov_row common_row'>
                                    <div class='common_list_lov_col'>
                                        <div>${list_row.id}</div>
                                    </div>
                                    <div class='common_list_lov_col'>
                                        <div>${list_row[props.lov_column_value]}</div>
                                    </div>
                                </div>
                                `).join('')
                            }
                            </div>
                            <div id='common_lov_close' class='common_dialogue_button common_icon'></div>
                        </div>`;
/**
 * 
 * @param {{common_document:import('../../../types.js').AppDocument,
 *          common_mountdiv:string,
 *          lov:string,
 *          function_event:function,
 *          function_FFB:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show2');
    props.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    let spinner = 'css_spinner';
    /**
     * @returns {void}
     */
     const post_component = () =>{
        let path = '';
        let query = null;
        let token_type = '';
        let lov_column_value = '';
        switch (props.lov){
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
            default:{
                lov_column_value = 'value';
                path = '/server-db/app_settings';
                query= `setting_type=${props.lov}`;
                token_type = 'APP_DATA';
            }
        }
        props.function_FFB(path, query, 'GET', token_type, null)
        .then((/**@type{string}*/result)=>{
                spinner = '';
                props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template({list:JSON.parse(result).rows, lov_column_value:lov_column_value});
                props.common_document.querySelector('#common_lov_list')['data-function'] = props.function_event;
                props.common_document.querySelector('#common_lov_search_input').focus();
        })
        .catch(()=>props.common_document.querySelector('#common_lov_list').classList.remove('css_spinner'));
    };
    /**
     * 
     * @param {{list:*,
     *          lov_column_value:string}} props 
     * @returns 
     */
    const render_template = props =>{
        return template(props)
                .replace('<SPINNER/>', spinner);
    };
    //render first time with spinner and empty records
    //post function will render again without spinner
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template({list: [], lov_column_value:''})
    };
};
export default component;

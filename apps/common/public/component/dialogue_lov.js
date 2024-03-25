/**@type{{querySelector:function}} */
 const AppDocument = document;
const template =`   <div id='common_lov_form'>
                    <div id='common_lov_title'></div>
                    <div id='common_lov_search_row'>
                        <div id='common_lov_search_input' contenteditable=true class='common_input'></div>
                        <div id='common_lov_search_icon' class='common_icon'></div>
                    </div>
                    <div id='common_lov_list' class='common_list_scrollbar'></div>
                    <div id='common_lov_close' class='common_dialogue_button common_icon'></div>
                    </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          lov:string,
 *          function_event:function,
 *          function_FFB:function}} props 
 * @returns {Promise.<{ props:{function_post:function|null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show1');
    props.common_document.querySelector('#common_dialogues').classList.add('common_dialogues_modal');
    
    /**
     * Lov show
     * @returns {Promise<void>}
     */
     const lov_show = async () =>{
        props.common_document.querySelector('#common_lov_list').classList.add('css_spinner');
        props.common_document.querySelector('#common_lov_list').innerHTML = '';
        props.common_document.querySelector('#common_lov_title').className = 'common_icon';
        let path = '';
        let token_type = '';
        let lov_column_value='';
        let service = '';
        switch (props.lov){
            case 'SERVER_LOG_FILES':{
                props.common_document.querySelector('#common_lov_title').classList.add('server_log_file');
                lov_column_value = 'filename';
                path = '/log/files?';
                service = 'LOG';
                token_type = 'SYSTEMADMIN';
                break;
            }
            case 'APP_CATEGORY':{
                props.common_document.querySelector('#common_lov_title').classList.add('app_category');
                lov_column_value = 'app_category_text';
                path = '/app_category/admin?';
                service = 'DB_API';
                token_type = 'APP_ACCESS';
                break;
            }
            case 'APP_ROLE':{
                props.common_document.querySelector('#common_lov_title').classList.add('app_role');
                lov_column_value = 'icon';
                path = '/app_role/admin?';
                service = 'DB_API';
                token_type = 'APP_ACCESS';
                break;
            }
        }
        props.function_FFB(service, path, 'GET', token_type, null)
        .then((/**@type{string}*/result)=>{
                props.common_document.querySelector('#common_lov_list')['data-function'] = props.function_event;
                let html = '';
                for (const list_row of JSON.parse(result)) {
                    html += 
                    `<div data-id='${list_row.id}' data-value='${list_row[lov_column_value]}' tabindex=-1 class='common_list_lov_row common_row'>
                        <div class='common_list_lov_col'>
                            <div>${list_row.id}</div>
                        </div>
                        <div class='common_list_lov_col'>
                            <div>${list_row[lov_column_value]}</div>
                        </div>
                    </div>`;
                }
                props.common_document.querySelector('#common_lov_list').classList.remove('css_spinner');
                props.common_document.querySelector('#common_lov_list').innerHTML = html;
                props.common_document.querySelector('#common_lov_search_input').focus();
        })
        .catch(()=>props.common_document.querySelector('#common_lov_list').classList.remove('css_spinner'));
    }

    const render_template = () =>{
        return template;
    }
    return {
        props:  {function_post:lov_show},
        data:   null,
        template: render_template()
    };
}
export default component;

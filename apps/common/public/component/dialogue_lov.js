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
 * @param {*} props 
 * @returns {Promise.<void>}
 */
const method = async props => {
    //set z-index
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show1');
    //set modal
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
        props.FFB(service, path, 'GET', token_type, null)
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

    const render_template = async () =>{
        return template;
    }

    switch (props.common_framework){
        case 2:{
            //Vue
            //Use tempmount div to be able to return pure HTML
            //props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
            //Vue.createApp(...
            //return props.common_document.querySelector('#tempmount').innerHTML;
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = await render_template();
            lov_show();
        }
        case 3:{
            //React
            //Use tempmount div to be able to return pure HTML
            //props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
            //ReactDOM.createRoot(div... .render( App()
            //return props.common_document.querySelector('#tempmount').innerHTML;
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = await render_template();
            lov_show();
        }
        case 1:
        default:{
            //Default Javascript
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = await render_template();
            lov_show();
        }
    }
}
export default method;

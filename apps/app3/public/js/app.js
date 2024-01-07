const common = await import('common');
const APP_GLOBAL = {
                    'docs':[{'id':1,
                            'doc_title':'Diagram',
                            'doc_url':'/common/documents/app_portfolio.webp',
                            'doc_url_small':'/common/documents/app_portfolio_small.webp'},
                            {'id':2,
                            'doc_title':'Data Model',
                            'doc_url':'/common/documents/data_model.webp',
                            'doc_url_small':'/common/documents/data_model_small.webp'},
                            {'id':3,
                            'doc_title':'Property Management',
                            'doc_url':'/common/documents/datamodel_pm.webp',
                            'doc_url_small':'/common/documents/datamodel_pm_small.webp'}
                            ]
};
Object.seal(APP_GLOBAL);
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, error);
};
const getdocs = (docid = null) => {
    document.querySelector('#doc_list').innerHTML = common.APP_SPINNER;
    let html ='';
    for (const doc of APP_GLOBAL.docs) {
        if (docid== doc.id || docid==null)
            html += `<div class='doc_list_item common_row'>
                        <div docid='doc_${doc.id}' full_size='${doc.doc_url}' class='doc_list_item_image' style='background-image:url("${doc.doc_url_small}")'></div>
                        <div class='doc_list_item_title'>${doc.doc_title}</div>
                    </div>`;
    }
    document.querySelector('#doc_list').innerHTML = html;
};
const init_app = async () => {
    document.querySelector('#app').addEventListener('click',(event) => {
        const target_id = common.element_id(event.target);
        switch (target_id){
            case 'common_window_info_btn_close':{
                document.querySelector('#dialogue_documents').style.visibility = 'visible';
                break;
            }
            case 'doc_list':{
                const target_row = common.element_row(event.target);
                if (target_row.querySelector('.doc_list_item_image').getAttribute('full_size'))
                    common.show_window_info(0, target_row.querySelector('.doc_list_item_image').getAttribute('full_size'));
                break;
            }
        }
    });
    getdocs();

    const docid = window.location.pathname.substring(1);
    if (docid!=''){
        document.querySelector('#dialogue_documents').style.visibility = 'hidden';
        common.show_window_info(0, document.querySelector(`#doc_${docid}`).getAttribute('full_size'));
    }
    else{
        document.querySelector('#dialogue_documents').style.visibility = 'visible';
    }
};
const init = (parameters) => {
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        init_app();
    });
};
export{init};
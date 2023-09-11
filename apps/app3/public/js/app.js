const common = await import('/common/js/common.js');
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, error);
};
const getdocs = (docid = null) => {
    document.querySelector('#doc_list').innerHTML = common.APP_SPINNER;
    const result = `{"data":[{"id":1,
                            "doc_title":"Diagram",
                            "doc_url":"/app1/images/app_portfolio.webp",
                            "doc_url_small":"/app1/images/app_portfolio_small.webp"},
                            {"id":2,
                            "doc_title":"Data Model",
                            "doc_url":"/app1/images/data_model.webp",
                            "doc_url_small":"/app1/images/data_model_small.webp"},
                            {"id":3,
                            "doc_title":"Property Management",
                            "doc_url":"/app3/images/datamodel_pm.webp",
                            "doc_url_small":"/app3/images/datamodel_pm_small.webp"}
                            ]}`;
    let html ='';
    const json = JSON.parse(result);
    for (let i = 0; i < json.data.length; i++) {
        if (docid== json.data[i].id || docid==null)
            html += `<div id='doc_list_item'>
                        <div id='doc_${json.data[i].id}' full_size='${json.data[i].doc_url}' class='doc_list_item_image_div'>
                            <img class='doc_list_item_image' src='${json.data[i].doc_url_small}'>
                        </div>
                        <div class='doc_list_item_title'>${json.data[i].doc_title}</div>
                    </div>`;
    }
    document.querySelector('#doc_list').innerHTML = html;
    document.querySelector('#doc_list').addEventListener('click',(event) => {
        if (event.target.parentNode.getAttribute('full_size'))
            common.show_window_info(0, event.target.parentNode.getAttribute('full_size'));
    });
};
const init_app = async () => {
    getdocs();
    //event show start documents when closing document
    document.querySelector('#common_window_info_btn_close').addEventListener('click',() => {
        document.querySelector('#dialogue_documents').style.visibility = 'visible';
    });
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
    common.COMMON_GLOBAL['exception_app_function'] = app_exception;
    common.init_common(parameters).then(()=>{
        init_app().then(() => {});
    });
};
export{app_exception, init};
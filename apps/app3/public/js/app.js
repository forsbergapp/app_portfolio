const common = await import('/common/js/common.js');
const app_exception = (error) => {
    null;
}
const getdocs = (docid = null) => {
    document.querySelector('#doc_list').innerHTML = common.APP_SPINNER;
    let result = `{"data":[{"id":1,
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
    let json = JSON.parse(result);
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
}
const init_app = async () => {
    document.querySelector('#app_title').innerHTML = common.COMMON_GLOBAL['app_name'];
    getdocs();
    //event show start documents when closing document
    document.querySelector('#common_window_info_btn_close').addEventListener('click',(event) => {
        document.querySelector('#dialogue_documents').style.visibility = 'visible';
    });
    let docid = window.location.pathname.substring(1);
    if (docid!=''){
        document.querySelector('#dialogue_documents').style.visibility = 'hidden';
        common.show_window_info(0, document.querySelector(`#doc_${docid}`).getAttribute('full_size'));
    }
    else{
        document.querySelector('#dialogue_documents').style.visibility = 'visible';
    }
}
const init = (parameters) => {
    common.init_common(parameters, (err, global_app_parameters)=>{
        init_app().then(() => {
            null;
        })
    })
}
export{app_exception, init}
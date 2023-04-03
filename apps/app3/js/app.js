const common = await import('/common/js/common.js');
function app_exception() {
    null;
}
function show_doc(item){
    if (item.classList.contains('doc_list_item_image')){
        document.getElementById('dialogue_documents').style.visibility = 'hidden';
        document.getElementById('common_window_info').style.visibility = 'visible';
        document.getElementById('common_window_info_info').innerHTML = `<img src="${item.parentNode.getAttribute('full_size')}"/>`;
    }
}
function getdocs(docid = null){
    document.getElementById('doc_list').innerHTML = common.APP_SPINNER;
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
                        <div id='${json.data[i].id}' full_size='${json.data[i].doc_url}' class='doc_list_item_image_div'>
                            <img class='doc_list_item_image' src='${json.data[i].doc_url_small}'>
                        </div>
                        <div class='doc_list_item_title'>${json.data[i].doc_title}</div>
                    </div>`;
    }
    document.querySelector('#doc_list').innerHTML = html;
    document.querySelector('#doc_list').addEventListener('click',function(event){show_doc(event.target)});
}
async function init_app(){
    document.getElementById('app_title').innerHTML = common.COMMON_GLOBAL['app_name'];
    common.zoom_info('');
    common.move_info(null,null);
    let docid = window.location.pathname.substring(1);
    if (docid!=''){
        document.getElementById('dialogue_documents').style.visibility = 'hidden';
        switch (docid){
            case '1':{
                getdocs(1);
                show_doc(1);
                break;
            }
            case '2':{
                getdocs(2);
                show_doc(2);
                break;
            }
            case '3':{
                getdocs(3);
                show_doc(3);
                break;
            }
        }
    }
    else{
        getdocs();
        document.getElementById('dialogue_documents').style.visibility = 'visible';
        document.getElementById('common_window_info').style.visibility = 'hidden';
    }
    
    await common.common_fetch_basic(0, null,  null, null, (err, result)=>{
        null;
    })

}
function init(parameters){
    common.init_common(parameters, (err, global_app_parameters)=>{
        init_app().then(function(){
            null;
        })
    })
}
export{app_exception, show_doc, getdocs, init_app, init}
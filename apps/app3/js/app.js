const common = await import('/common/js/common.js');
function app_exception() {
    null;
}
function show_doc(docid){
    document.getElementById('dialogue_documents').style.visibility = 'hidden';
    document.getElementById('common_window_info').style.visibility = 'visible';
    document.getElementById('common_window_info_info').innerHTML = `<img src="${document.getElementById(`${docid}`).src}"/>`;
}
function getdocs(docid = null){
    document.getElementById('doc_list').innerHTML = common.APP_SPINNER;
    let result = `{"data":[{"id":1,
                            "doc_title":"Diagram",
                            "doc_url":"/app1/images/app_portfolio.png"},
                            {"id":2,
                            "doc_title":"Data Model",
                            "doc_url":"/app1/images/data_model.png"},
                            {"id":3,
                            "doc_title":"Property Management",
                            "doc_url":"/app3/images/datamodel_pm.jpg"}
                            ]}`;
    let html ='';
    let json = JSON.parse(result);
    for (let i = 0; i < json.data.length; i++) {
        if (docid== json.data[i].id || docid==null)
            html += `<div class='doc_list_item'>
                        <div class='doc_list_item_image_div'>
                            <img id='${json.data[i].id}' class='doc_list_item_image' src='${json.data[i].doc_url}'>
                        </div>
                        <div class='doc_list_item_title'>${json.data[i].doc_title}</div>
                    </div>`;
    }
    document.getElementById('doc_list').innerHTML = html;
    let x = document.querySelectorAll('.doc_list_item_image');
    for (let i = 0; i <= x.length -1; i++) {
        x[i].addEventListener('click', function() {show_doc(x[i].getAttribute('id'))});
    }
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
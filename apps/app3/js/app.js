function app_exception() {
    null;
}
function show_doc(docid){
    document.getElementById('dialogue_documents').style.visibility = 'hidden';
    document.getElementById('common_window_info').style.visibility = 'visible';
    document.getElementById('common_window_info_info').innerHTML = `<img src="${document.getElementById(`${docid}`).src}"/>`;
}
function getdocs(docid = null){
    document.getElementById('doc_list').innerHTML = window.global_app_spinner;
    let result = `{"data":[{"id":1,
                            "doc_title":"Diagram",
                            "doc_url":"/app1/images/app_portfolio.jpg"},
                            {"id":2,
                            "doc_title":"Data Model",
                            "doc_url":"/app1/images/datamodel.jpg"},
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
    document.getElementById('app_title').innerHTML = window.global_app_name;
    zoom_info('');
    move_info(null,null);
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
    
    await common_fetch_token(0, null,  null, null, (err, result)=>{
        null;
    })

}
function init(parameters){
    init_common(parameters, (err, global_app_parameters)=>{
        init_app().then(function(){
            null;
        })
    })
}

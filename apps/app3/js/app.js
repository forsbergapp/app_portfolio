function app_exception() {
    null;
}
function show_doc(docid){
    document.getElementById('dialogue_documents').style.visibility = 'hidden';
    document.getElementById('common_window_info').style.visibility = 'visible';
    document.getElementById('common_window_info_info').innerHTML = `<img src="${document.getElementById(`doc${docid}`).src}"/>`;
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
                show_doc(1);
                break;
            }
            case '2':{
                show_doc(2);
                break;
            }
            case '3':{
                show_doc(3);
                break;
            }
        }
    }
    else{
        document.getElementById('dialogue_documents').style.visibility = 'visible';
        document.getElementById('common_window_info').style.visibility = 'hidden';
        document.getElementById('doc1').addEventListener('click', function() { show_doc(1) });
        document.getElementById('doc2').addEventListener('click', function() { show_doc(2) });
        document.getElementById('doc3').addEventListener('click', function() { show_doc(3) });
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

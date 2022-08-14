window.global_img_datamodel_img = '/app3/info/datamodel.jpg';

function app_exception() {
    null;
}
async function init_app(){
    zoom_info('');
    move_info(null,null);
    document.getElementById('common_window_info').style.visibility = 'visible';
    document.getElementById('common_window_info_info').innerHTML = `<img src="${window.global_img_datamodel_img}"/>`;
    await common_fetch_token(0, null,  null, null, (err, result)=>{
        null;
    })

}
function init(parameters){
    init_common(parameters);
    init_app().then(function(){
        null;
    })
}

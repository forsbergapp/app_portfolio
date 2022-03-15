const eventSource = new EventSource(`/service/broadcast?app_id=${global_app_id}`);

eventSource.onmessage = function (event) {
    show_broadcast(event.data);
}
eventSource.onerror = function (err) {
    eventSource.close();
}
function maintenance_countdown(remaining) {
    if(remaining <= 0)
        location.reload(true);
    document.getElementById('maintenance_countdown').innerHTML = remaining;
    setTimeout(function(){ maintenance_countdown(remaining - 1); }, 1000);
};
function show_broadcast(broadcast_message){
    broadcast_message = atob(broadcast_message);
    let broadcast_type = JSON.parse(broadcast_message).broadcast_type;
    let message = JSON.parse(broadcast_message).broadcast_message;
    if (broadcast_type=='MAINTENANCE'){
        show_maintenance(message);
    }
    else
        if (broadcast_type=='INFO'){
            show_broadcast_info(message);
        }
}
function show_broadcast_info(message){
    var hide_function = function() { document.getElementById('broadcast_info').style.visibility='hidden';
                                     document.getElementById('broadcast_close').removeEventListener('click', hide_function);
                                     document.getElementById('broadcast_info_message_item').innerHTML='';
                                     document.getElementById('broadcast_info_message').style.animationName='unset';};
    document.getElementById('broadcast_info_message').style.animationName='ticker';
    document.getElementById('broadcast_close').addEventListener('click', hide_function);
    document.getElementById('broadcast_info_message_item').innerHTML = message;
    document.getElementById('broadcast_info').style.visibility='visible';
}
function show_maintenance(message, init){
    let countdown_timer = 60;

    if (init==1)
        maintenance_countdown(countdown_timer);
    else
        if (document.getElementById('maintenance_countdown').innerHTML=='') {
            let divs = document.body.getElementsByTagName('div');

            for (let i = 0; i < divs.length; i += 1) {
                divs[i].style.visibility ='hidden';
            }
            let maintenance_divs = document.getElementById('dialogue_maintenance').getElementsByTagName('div');
            for (let i = 0; i < maintenance_divs.length; i += 1) {
                maintenance_divs[i].style.visibility ='visible';
            }
            document.getElementById('dialogue_maintenance').style.visibility='visible';
            maintenance_countdown(countdown_timer);
            document.getElementById('maintenance_footer').innerHTML = message;
        }
        else
            document.getElementById('maintenance_footer').innerHTML = message;
}
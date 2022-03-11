function maintenance_countdown(remaining) {
    if(remaining <= 0)
        location.reload(true);
    document.getElementById('maintenance_countdown').innerHTML = remaining;
    setTimeout(function(){ maintenance_countdown(remaining - 1); }, 1000);
};
function show_maintenance(){
    let divs = document.body.getElementsByTagName('div');
    for (let i = 0; i < divs.length; i += 1) {
      divs[i].style.visibility ='hidden';
    }
    let maintenance_divs = document.getElementById('dialogue_maintenance').getElementsByTagName('div');
    for (let i = 0; i < maintenance_divs.length; i += 1) {
        maintenance_divs[i].style.visibility ='visible';
    }
    document.getElementById('dialogue_maintenance').style.visibility='visible';
    maintenance_countdown(60);
}
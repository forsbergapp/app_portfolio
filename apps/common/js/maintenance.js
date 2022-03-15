function init_maintenance(){
    let spinner = `<div id="maintenance_spinner" class="load-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>`;
    document.getElementById('maintenance_footer').innerHTML= spinner;
    show_maintenance(null,1);
}

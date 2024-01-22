const common = await import('common');
const APP_GLOBAL = {
    'module_leaflet_map_container':''
};
Object.seal(APP_GLOBAL);
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, null, error);
};

const app_event_click = event =>{
    const events = event => {
        const event_target_id = common.element_id(event.target);
        common.common_event('click',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_toolbar_framework_js':{
                    init_map('1');
                    break;
                }
                case 'common_toolbar_framework_vue':{
                    init_map('2');
                    break;
                }
                case 'common_toolbar_framework_react':{
                    init_map('3');
                    break;
                }
            }
        });
    };
    if (event==null){
        //javascript framework
        document.querySelector('#app').addEventListener('click',(event) => {
            events(event);
        });
    }
    else{
        //other framework
        events(event);
    }
        
};
const app_event_change = event =>{
    if (event==null){
        document.querySelector('#app').addEventListener('change',(event) => {
            common.common_event('change', event);    
        });
    }
    else
        common.common_event('change', event);
};
const app_event_keydown = event =>{
    if (event==null){
        document.querySelector('#app').addEventListener('keydown',(event) => {
            common.common_event('keydown', event);    
        });
    }
    else
        common.common_event('keydown', event);
};
const app_event_keyup = event =>{
    if (event==null){
        document.querySelector('#app').addEventListener('keyup',(event) => {
            common.common_event('keyup', event);    
        });
    }
    else
        common.common_event('keyup', event);
};
const init_map = async (framework)=>{
    document.querySelector('#mapid').outerHTML = '<div id="mapid"></div>';
    
    await common.mount_app(framework,
                    {   Click: app_event_click,
                        Change: app_event_change,
                        KeyDown: app_event_keydown,
                        KeyUp: app_event_keyup,
                        Focus: null,
                        Input:null})
    .then(()=>  common.map_init(APP_GLOBAL.module_leaflet_map_container,
                                common.COMMON_GLOBAL.module_leaflet_style, 
                                common.COMMON_GLOBAL.client_longitude,
                                common.COMMON_GLOBAL.client_latitude,
                                true,
                                null))
    .then(()=>  common.map_update(  common.COMMON_GLOBAL.client_longitude,
                                    common.COMMON_GLOBAL.client_latitude,
                                    common.COMMON_GLOBAL.module_leaflet_zoom,
                                    common.COMMON_GLOBAL.client_place,
                                    null,
                                    common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                    common.COMMON_GLOBAL.module_leaflet_jumpto)
    );
};
const init_app = async () =>{
    APP_GLOBAL.module_leaflet_map_container      ='mapid';
    init_map();
};
const init = (parameters) => {
    document.querySelector('#loading').classList.add('css_spinner');
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        init_app().then(()=>{
            document.querySelector('#loading').classList.remove('css_spinner');
        });
    })
    .catch(()=>document.querySelector('#loading').classList.remove('css_spinner'));
};
export{init};

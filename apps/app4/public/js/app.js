const common = await import('common');
const APP_GLOBAL = {
    'module_leaflet_map_container':'',
    'module_leaflet_map_zoom':'',
    'module_leaflet_map_marker_div_gps':''
};
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, error);
};
const map_click_event = (event) =>{
    common.map_click_event(event,   APP_GLOBAL['module_leaflet_map_container'], 
                                    APP_GLOBAL['module_leaflet_map_zoom'], 
                                    APP_GLOBAL['module_leaflet_map_marker_div_gps']);
};
const init_map = async (framework)=>{
    let map_click_event_js;
    document.querySelector('#app_map').innerHTML = '';
    switch (framework){
        case '2':{
            //Vue
            map_click_event_js = false;
            const Vue = await import('Vue');
            Vue.createApp({
                data() {
                        return {};
                        },
                        template: '<div id=\'mapid\' @click=\'myMethod($event)\'></div>', 
                        methods:{
                            myMethod: (event) => {
                                map_click_event(event);
                        }}
                    }).mount('#app_map');
            break;
        }
        case '3':{
            //React
            map_click_event_js = false;
            const {React} = await import('React');
            const {ReactDOM} = await import('ReactDOM');
            const App = () => {
                //onClick handles single and doubleclick in this React component since onClick and onDoubleClick does not work in React
                //without tricks
                //using dblClick on leaflet on() function to get coordinates
                //JSX syntax
                //return (<div id='mapid' onClick={(e) => {app.map_click_event(event)}}></div>);
                //Using pure Javascript
                return React.createElement('div', {id: 'mapid', onClick:()=> {map_click_event(event);}});
            };
            const application = ReactDOM.createRoot(document.querySelector('#app_map'));
            //JSX syntax
            //application.render( <App/>);
            //Using pure Javascript
            application.render( App());
            break;
        }
        case '1':
        default:{
            //Javascript
            map_click_event_js = true;
            document.querySelector('#app_map').innerHTML = '<div id=\'mapid\'></div>';
            break;
        }
    }

    return new Promise((resolve)=>{
        common.map_init(APP_GLOBAL['module_leaflet_map_container'], 
                        common.COMMON_GLOBAL['module_leaflet_style'], 
                        common.COMMON_GLOBAL['client_longitude'],
                        common.COMMON_GLOBAL['client_latitude'],
                        APP_GLOBAL['module_leaflet_map_marker_div_gps'],
                        APP_GLOBAL['module_leaflet_map_zoom'],
                        APP_GLOBAL['module_leaflet_map_marker_div_city'],
                        APP_GLOBAL['module_leaflet_map_zoom_city'],
                        map_click_event_js, 
                        true).then(()=>{
            
            common.map_update(  common.COMMON_GLOBAL['client_longitude'],
                                common.COMMON_GLOBAL['client_latitude'],
                                APP_GLOBAL['module_leaflet_map_zoom'],
                                common.COMMON_GLOBAL['client_place'],
                                null,
                                APP_GLOBAL['module_leaflet_map_marker_div_gps'],
                                common.COMMON_GLOBAL['module_leaflet_jumpto']);
            resolve();
        });
    });
};
const init_app = async () =>{
    APP_GLOBAL['module_leaflet_map_container']      ='mapid';
    APP_GLOBAL['module_leaflet_zoom_city']          = 8;
    APP_GLOBAL['module_leaflet_map_zoom']           = 14;
    APP_GLOBAL['module_leaflet_map_marker_div_gps'] = 'map_marker_gps';
    APP_GLOBAL['module_leaflet_map_marker_div_city'] = 'map_marker_city';

    document.querySelector('#toolbar_btn_js').innerHTML = common.ICONS['app_javascript'];
    document.querySelector('#toolbar_btn_vue').innerHTML = common.ICONS['app_vue'];
    document.querySelector('#toolbar_btn_react').innerHTML = common.ICONS['app_react'];
    document.querySelector('#toolbar_top').addEventListener('click', (event) => {
        switch (event.target.id || event.target.parentNode.id){
            case 'toolbar_btn_js':{
                init_map('1');
                break;
            }
            case 'toolbar_btn_vue':{
                init_map('2');
                break;
            }
            case 'toolbar_btn_react':{
                init_map('3');
                break;
            }
        }
    });
    init_map(window.location.pathname.substring(1));
};
const init = async (parameters) => {
    const {APP_SPINNER} = await import('common');
    document.querySelector('#loading').innerHTML = APP_SPINNER;
    return new Promise((resolve)=>{
        common.COMMON_GLOBAL['exception_app_function'] = app_exception;
        common.init_common(parameters).then(()=>{
            init_app().then(()=>{
                document.querySelector('#loading').innerHTML = '';
                resolve();
            });
        });
    });
};
export{APP_GLOBAL, map_click_event, init};

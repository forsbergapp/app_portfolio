const common = await import('common');
const APP_GLOBAL = {
    'module_leaflet_map_container':''
};
Object.seal(APP_GLOBAL);
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, error);
};

const app_event_click = event =>{
    if (event==null){
        //javascript framework
        document.querySelector('#app').addEventListener('click',(event) => {
            common.common_event('click',event);
            const event_target_id = common.element_id(event.target);
            switch (event_target_id){
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
    }
    else{
        //other framework
        common.common_event('click', event);
        const event_target_id = common.element_id(event.target);
        switch (event_target_id){
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
const init_map = async (framework)=>{
    //remove listeners
    document.querySelector('#app_root').replaceWith(document.querySelector('#app_root').cloneNode(true));
    document.querySelector('#app_root').removeAttribute('data-v-app');
    document.querySelector('#mapid').outerHTML = '<div id="mapid"></div>';
    
    switch (framework){
        case '2':{
            //Vue
            document.querySelector('#toolbar_btn_js').classList = '';
            document.querySelector('#toolbar_btn_vue').classList = 'toolbar_selected';
            document.querySelector('#toolbar_btn_react').classList = '';
            const Vue = await import('Vue');
            Vue.createApp({
                data() {
                        return {};
                        },
                        template: `<div id='app' @click='AppEventClick($event)' @change='AppEventChange($event)' @change='AppEventKeyDown($event)'>
                                        ${document.querySelector('#app').innerHTML}
                                    </div>`, 
                        methods:{
                            AppEventClick: (event) => {
                                app_event_click(event);
                            },
                            AppEventChange: (event) => {
                                app_event_change(event);
                            },
                            AppEventKeyDown: (event) => {
                                app_event_keydown(event);
                            }
                        }
                    }).mount('#app_root');
            break;
        }
        case '3':{
            //React
            document.querySelector('#toolbar_btn_js').classList = '';
            document.querySelector('#toolbar_btn_vue').classList = '';
            document.querySelector('#toolbar_btn_react').classList = 'toolbar_selected';
            const {React} = await import('React');
            const {ReactDOM} = await import('ReactDOM');
            const App = () => {
                //onClick handles single and doubleclick in this React component since onClick and onDoubleClick does not work in React
                //without tricks
                //using dblClick on leaflet on() function to get coordinates
                //JSX syntax
                //return (<div id='mapid' onClick={(e) => {app.map_click_event(event)}}></div>);
                //Using pure Javascript
                return React.createElement('div', { id: 'app',   
                                                    onClick:   ()=> {app_event_click(event);}
                                                    });
            };
            const app_old = document.querySelector('#app').innerHTML;
            const application = ReactDOM.createRoot(document.querySelector('#app_root'));
            //JSX syntax
            //application.render( <App/>);
            //Using pure Javascript
            application.render( App());
            //set delay so some browsers render ok.
            await new Promise ((resolve)=>{setTimeout(()=> resolve(), 200);});
            document.querySelector('#app').innerHTML = app_old;
            app_event_change();
            app_event_keydown();
            break;
        }
        case '1':
        default:{
            //Javascript
            document.querySelector('#toolbar_btn_js').classList = 'toolbar_selected';
            document.querySelector('#toolbar_btn_vue').classList = '';
            document.querySelector('#toolbar_btn_react').classList = '';
            app_event_click();
            app_event_change();
            app_event_keydown();
            break;
        }
    }
    return new Promise((resolve)=>{
        common.map_init(APP_GLOBAL.module_leaflet_map_container,
                        common.COMMON_GLOBAL.module_leaflet_style, 
                        common.COMMON_GLOBAL.client_longitude,
                        common.COMMON_GLOBAL.client_latitude,
                        true,
                        null).then(()=>{
            
            common.map_update(  common.COMMON_GLOBAL.client_longitude,
                                common.COMMON_GLOBAL.client_latitude,
                                common.COMMON_GLOBAL.module_leaflet_zoom,
                                common.COMMON_GLOBAL.client_place,
                                null,
                                common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                common.COMMON_GLOBAL.module_leaflet_jumpto);
            resolve();
        });
    });
};
const init_app = async () =>{
    APP_GLOBAL.module_leaflet_map_container      ='mapid';

    document.querySelector('#toolbar_btn_js').innerHTML = common.ICONS.app_javascript;
    document.querySelector('#toolbar_btn_vue').innerHTML = common.ICONS.app_vue;
    document.querySelector('#toolbar_btn_react').innerHTML = common.ICONS.app_react;
    
    init_map(window.location.pathname.substring(1));
};
const init = (parameters) => {
    document.querySelector('#loading').innerHTML = common.APP_SPINNER;
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        init_app().then(()=>{
            document.querySelector('#loading').innerHTML = '';
        });
    });
};
export{APP_GLOBAL, init};

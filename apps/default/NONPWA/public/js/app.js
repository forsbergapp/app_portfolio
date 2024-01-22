const common = await import('common');
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, null, error);
};
const app_event_click = event => {
    if (event==null){
        //javascript framework
        document.querySelector('#app').addEventListener('click',(event) => {
            app_event_click(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('click',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_toolbar_framework_js':{
                    mount_app_app('1');
                    break;
                }
                case 'common_toolbar_framework_vue':{
                    mount_app_app('2');
                    break;
                }
                case 'common_toolbar_framework_react':{
                    mount_app_app('3');
                    break;
                }
            }
        });
    }
};
const mount_app_app = async framework => {
    await common.mount_app(framework,
        {   Click: app_event_click,
            Change: null,
            KeyDown: null,
            KeyUp: null,
            Focus: null,
            Input:null})
    .then(()=> {
        document.querySelector('#dialogue_documents').style.visibility ='visible';
    });
};
const init_app = () => {
    mount_app_app();
};
const init = (parameters) => {
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        init_app();
    });
};
export{init};
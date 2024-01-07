const common = await import('common');
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, error);
};
const serviceworker = () => {
    if (!window.Promise) {
        window.Promise = Promise;
    }
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {scope: '/'});
    }
};
const init_app = () => {
    document.querySelector('#app_construction').innerHTML = common.ICONS.app_maintenance;
    serviceworker();
};
const init = (parameters) => {
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        init_app();
    });
};
export{init};
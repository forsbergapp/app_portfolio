const common = await import('common');
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, error);
};
const init_app = async () => {
    document.querySelector('#app_construction').innerHTML = common.ICONS.app_maintenance;
};
const init = (parameters) => {
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        init_app().then(() => {});
    });
};
export{init};
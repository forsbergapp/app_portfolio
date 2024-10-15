/**
 * @module apps/common/maintenance
 */

/**@type{import('../../../common_types.js').COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const commonPath ='common';
/**@type {import('../../../common_types.js').CommonModuleCommon} */
const common = await import(commonPath);
/**
 * App exception function
 * @returns {void}
 */
const appException = () => {
    null;
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {void}
 */
const appCommonInit= parameters => {
    COMMON_DOCUMENT.title = '⚒';
    COMMON_DOCUMENT.querySelector('#common_broadcast').addEventListener('click', (/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
        const event_target_id = common.commonElementId(event.target);
        if (event_target_id=='common_broadcast_close')
            common.commonComponentRemove('common_broadcast');
    });
    const decoded_parameters = JSON.parse(common.commonWindowFromBase64(parameters));
    common.COMMON_GLOBAL.common_app_id= decoded_parameters.common_app_id;
    common.COMMON_GLOBAL.app_id = decoded_parameters.app_id;
    common.COMMON_GLOBAL.app_function_exception = appException; 
    common.COMMON_GLOBAL.rest_resource_bff = decoded_parameters.rest_resource_bff;
    common.COMMON_GLOBAL.user_account_id = null;
    common.COMMON_GLOBAL.user_identity_provider_id = null;
    common.COMMON_GLOBAL.admin = null;
    common.COMMON_GLOBAL.token_dt = decoded_parameters.app_idtoken;
    common.commonSocketConnectOnline();    
    common.commonSocketMaintenanceShow(null,1);
};
export{appException, init};
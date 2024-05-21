/** @module server/dbapi/object/identity_provider */

/**@type{import('../../dbapi/app_portfolio/identity_provider.service.js')} */
const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/identity_provider.service.js`);
/**
 * 
 * @param {number} app_id 
 * @returns {import('../../../types.js').db_result_identity_provider_getIdentityProviders[]}
 */
const getIdentityProviders = app_id => service.getIdentityProviders(app_id)
                                        .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});
export {getIdentityProviders};
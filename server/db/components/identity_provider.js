/** @module server/db/components */

/**@type{import('../sql/identity_provider.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/identity_provider.service.js`);
/**
 * 
 * @param {number} app_id 
 */
const getIdentityProviders = app_id => service.getIdentityProviders(app_id)
                                        .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});
export {getIdentityProviders};
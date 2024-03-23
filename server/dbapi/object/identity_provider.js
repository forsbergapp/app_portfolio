/** @module server/dbapi/object/identity_provider */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/identity_provider.service.js`);
/**
 * 
 * @param {number} app_id 
 * @returns {Types.db_result_identity_provider_getIdentityProviders[]}
 */
const getIdentityProviders = app_id => service.getIdentityProviders(app_id)
                                    .catch((/**@type{Types.error}*/error)=>{throw error;});
export {getIdentityProviders};
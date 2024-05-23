/** @module server/db/components/country */

/**@type{import('../sql/country.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/country.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const getCountries = (app_id, query) => service.getCountries(app_id, query.get('lang_code') ?? 'en')
                                            .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});
    
export{getCountries};
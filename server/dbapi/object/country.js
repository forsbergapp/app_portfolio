/** @module server/dbapi/object/country */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/country.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const getCountries = (app_id, query) => service.getCountries(app_id, query.get('lang_code') ?? 'en')
                                            .catch((/**@type{Types.error}*/error)=>{throw error;});
    
export{getCountries};
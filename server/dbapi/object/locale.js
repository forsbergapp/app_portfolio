/** @module server/dbapi/object/locale */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/locale.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const getLocales = (app_id, query) =>service.getLocales(app_id, query.get('lang_code') ?? 'en')
                                        .catch((/**@type{Types.error}*/error)=>{throw error;});

export{getLocales};
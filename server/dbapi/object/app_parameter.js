/** @module server/dbapi/object/app_parameter */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const getParametersAllAdmin = (app_id, query) =>service.getParametersAllAdmin(app_id, getNumberValue(query.get('data_app_id')), query.get('lang_code'))
                                                    .catch((/**@type{Types.error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {Types.db_parameter_app_parameter_setParameter_admin} data 
 * @returns 
 */
const setParameter_admin = (app_id, data) =>{
    /**@type{Types.db_parameter_app_parameter_setParameter_admin} */
    const body = {	app_id: 			app_id,
                    parameter_type_id: 	data.parameter_type_id,
                    parameter_name: 	data.parameter_name,
                    parameter_value: 	data.parameter_value, 
                    parameter_comment: 	data.parameter_comment
                };
    return service.setParameter_admin(app_id, body)
            .catch((/**@type{Types.error}*/error)=>{throw error;});
};

export {getParametersAllAdmin, setParameter_admin};
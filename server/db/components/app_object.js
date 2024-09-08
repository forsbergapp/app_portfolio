/** @module server/db/components/app_object */

/**@type{import('../sql/app_object.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/app_object.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query
 */
const getObjects = (app_id, query) => service.getObjects(app_id, query.get('data_lang_code'), query.get('object_name'), query.get('object_item_name') ?? null)
                                        .catch((/**@type{import('../../../types.js').server_server_error}*/error)=>{throw error;});
export {getObjects};
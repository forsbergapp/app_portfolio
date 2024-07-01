/** @module apps/app6 */
/**
 * @param {number} app_id
 * @param {*} data
 * @param {string} locale
 * @returns {Promise.<[{stock:[  {key_name:string, key_value:string, key_type:string}, 
 *                              {key_name:string, key_value:string, key_type:string}, 
 *                              {key_name:string, key_value:string, key_type:string}]}]>}
 */
const product_location_get = async (app_id, data, locale) =>{

    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {get:MasterGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);

    /**@type{import('../../../../server/db/sql/app_data_resource_detail_data.service.js')} */
    const {get:DetailDataGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail_data.service.js`);

    const stock = [];
    const product_variant_location = await DetailDataGet(app_id, null, data.resource_id, null, data.data_app_id, 
        'RESOURCE_TYPE', 'PRODUCT_VARIANT', 
        'RESOURCE_TYPE', 'PRODUCT',
        'RESOURCE_TYPE', 'LOCATION', 
        data.entity_id, locale, true);
    const product_variant_location_metadata = await MasterGet(app_id, null, null, data.data_app_id, 'PRODUCT_VARIANT_LOCATION_METADATA', data.entity_id, data.locale, true);
    /**@ts-ignore */
    for (const location of product_variant_location.rows ?? product_variant_location){
        //location, stock_text, stock
        stock.push([{key_name:'location', key_value:JSON.parse(location.adrm_attribute_master_json_data).name, key_type:'TEXT'},
                    {key_name:'stock_text', key_value:JSON.parse(product_variant_location_metadata[0].json_data).stock.default_text, key_type:'TEXT'},
                    {key_name:'stock', key_value:JSON.parse(location.json_data).stock, key_type:'TEXT'}]);
    }
    /**@ts-ignore */
    return [{stock:stock}];
};
export default product_location_get;
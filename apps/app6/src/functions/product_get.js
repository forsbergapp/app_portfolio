/** @module apps/app5 */
/**
 * @param {number} app_id
 * @param {*} data
 * @param {string} locale
 * @returns {Promise.<import('../../../../types.js').db_result_app_data_resource_master_get[]>}
 */
const product_get = async (app_id, data, locale) =>{
    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {get:MasterGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);
    
    /**@type{import('../../../../server/db/sql/app_data_resource_detail.service.js')} */
    const {get:DetailGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail.service.js`);
    
    const products = await MasterGet(app_id, data.resource_id, null, data.data_app_id, 'PRODUCT', data.entity_id, data.locale, true);
    for (const product of products.rows ?? products){
        product.sku = [];
        const product_variants = await DetailGet(app_id, data.resource_id_variant, product.id, null, data.data_app_id, 'PRODUCT_VARIANT', data.entity_id, data.locale, true);
        for (const product_variant of product_variants.rows ?? product_variants){
            const data = JSON.parse(product_variant.json_data);
            const product_variant_metadatas = await MasterGet(app_id, data.resource_id, null, data.data_app_id, 'PRODUCT_VARIANT_METADATA', data.entity_id, data.locale, true);
            product.sku_keys = [];
            for (const product_variant_metadata of product_variant_metadatas){
                const key_name = Object.keys(JSON.parse(product_variant_metadata.json_data))[0];
                if (key_name.toLowerCase() != 'name'){
                    const key_type = JSON.parse(product_variant_metadata.json_data)[Object.keys(JSON.parse(product_variant_metadata.json_data))[0]].type;
                    product.sku_keys.push([data[key_name], key_type]);
                }
            }
            product.sku.push(product.sku_keys);
        }
    }

    return products;

};
export default product_get;
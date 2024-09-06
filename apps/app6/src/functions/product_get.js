/**
 * @module apps/app6/src/functions/product_get
 */
/**
 * @param {number} app_id
 * @param {*} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../types.js').res} res
 * @returns {Promise.<import('../../../../types.js').db_result_app_data_resource_master_get[]>}
 */
const product_get = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {get:MasterGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);
    
    /**@type{import('../../../../server/db/sql/app_data_resource_detail.service.js')} */
    const {get:DetailGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail.service.js`);

    const products = await MasterGet(app_id, data.resource_id, null, data.data_app_id, 'PRODUCT', null, locale, true);

    const currency = await MasterGet(app_id, null, null, data.data_app_id, 'CURRENCY', null, locale, true);

    /**@ts-ignore */
    for (const product of products.rows ?? products){
        product.sku = [];
        const product_variants = await DetailGet(app_id, data.resource_id_variant, product.id, null, data.data_app_id, 'PRODUCT_VARIANT', data.entity_id, locale, true);
        /**@ts-ignore */
        for (const product_variant of product_variants.rows ?? product_variants){
            const data = JSON.parse(product_variant.json_data);
            const product_variant_metadatas = await MasterGet(app_id, data.resource_id, null, data.data_app_id, 'PRODUCT_VARIANT_METADATA', data.entity_id, locale, true);
            product.sku_keys = [];
            for (const product_variant_metadata of product_variant_metadatas){
                const key_name = Object.keys(JSON.parse(product_variant_metadata.json_data))[0];
                if (key_name.toLowerCase() != 'name'){
                    const key_type = JSON.parse(product_variant_metadata.json_data)[Object.keys(JSON.parse(product_variant_metadata.json_data))[0]].type;
                    product.sku_keys.push({key_name:key_name, key_value:data[key_name], key_type:key_type});
                }
            }
            product.sku_keys.push({key_name:'id', key_value:product_variant.id, key_type:'TEXT'});
            //add currency to be displayed on each product variant
            product.sku_keys.push({key_name:'currency_code', key_value:JSON.parse(currency[0].json_data).currency_code, key_type:'TEXT'});
            product.sku_keys.push({key_name:'currency_symbol', key_value:JSON.parse(currency[0].json_data).currency_symbol, key_type:'TEXT'});
            product.sku.push(product.sku_keys);
        }
        //return placeholder for stock info
        product.stock =  [  [{key_name:'location', key_value:'', key_type:'TEXT'}, 
                            {key_name:'stock_text', key_value:'', key_type:'TEXT'}, 
                            {key_name:'stock', key_value:'', key_type:'TEXT'}]];
    }
    return products;
};
export default product_get;
/**
 * @module apps/app6/src/functions/product_get
 */
/**
 * @import {server_server_response, server_db_sql_result_app_data_resource_master_get} from '../../../../server/types.js'
 */
/**
 * @name productGet
 * @description Get product
 * @function
 * @param {{app_id:number,
 *          data:*,
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_app_data_resource_master_get[]}>}
 */
const productGet = async parameters =>{
    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);
    
    /**@type{import('../../../../server/db/dbModelAppDataResourceDetail.js')} */
    const dbModelAppDataResourceDetail = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetail.js`);

    const products = await dbModelAppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                resource_id:parameters.data.resource_id, 
                                                                data:{  data_app_id:parameters.data.data_app_id,
                                                                        resource_name:'PRODUCT',
                                                                        user_null:'1'
                                                                }});

    const currency = await dbModelAppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                resource_id:null, 
                                                                data:{  data_app_id:parameters.data.data_app_id,
                                                                        resource_name:'CURRENCY',
                                                                        user_null:'1'
                                                                }});

    for (const product of products.result){
        product.sku = [];
        const product_variants = await dbModelAppDataResourceDetail.get({   app_id:parameters.app_id, 
                                                                            resource_id:parameters.data.resource_id_variant, 
                                                                            data:{  master_id:product.id,
                                                                                    data_app_id:parameters.data.data_app_id,
                                                                                    resource_name:'PRODUCT_VARIANT',
                                                                                    entity_id:parameters.data.entity_id,
                                                                                    user_null:'1'
                                                                            }});
        for (const product_variant of product_variants.result){
            const data = JSON.parse(product_variant.json_data);
            const product_variant_metadatas = await dbModelAppDataResourceMaster.get({  app_id:parameters.app_id, 
                                                                                        resource_id:data.resource_id, 
                                                                                        data:{  data_app_id:data.data_app_id,
                                                                                                resource_name:'PRODUCT_VARIANT_METADATA',
                                                                                                entity_id:data.entity_id,
                                                                                                user_null:'1'
                                                                                        }});
            product.sku_keys = [];
            for (const product_variant_metadata of product_variant_metadatas.result){
                const key_name = Object.keys(JSON.parse(product_variant_metadata.json_data))[0];
                if (key_name.toLowerCase() != 'name'){
                    const key_type = JSON.parse(product_variant_metadata.json_data)[Object.keys(JSON.parse(product_variant_metadata.json_data))[0]].type;
                    product.sku_keys.push({key_name:key_name, key_value:data[key_name], key_type:key_type});
                }
            }
            product.sku_keys.push({key_name:'id', key_value:product_variant.id, key_type:'TEXT'});
            //add currency to be displayed on each product variant
            product.sku_keys.push({key_name:'currency_code', key_value:JSON.parse(currency.result[0].json_data).currency_code, key_type:'TEXT'});
            product.sku_keys.push({key_name:'currency_symbol', key_value:JSON.parse(currency.result[0].json_data).currency_symbol, key_type:'TEXT'});
            product.sku.push(product.sku_keys);
        }
        //return placeholder for stock info
        product.stock =  [  [{key_name:'location', key_value:'', key_type:'TEXT'}, 
                            {key_name:'stock_text', key_value:'', key_type:'TEXT'}, 
                            {key_name:'stock', key_value:'', key_type:'TEXT'}]];
    }
    return products;
};
export default productGet;
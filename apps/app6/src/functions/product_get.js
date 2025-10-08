/**
 * @module apps/app6/src/functions/product_get
 */
/**
 * @import {server} from '../../../../server/types.js'
 * @import {currency, product, product_variant, metadata_product_variant} from './types.js'
 */
const {server} = await import('../../../../server/server.js');
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
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['Object']['AppDataResourceMaster'][]}>}
 */
const productGet = async parameters =>{
        
    /**@type{server['ORM']['Object']['AppDataEntity'] & {Id:number}} */
    const Entity            = server.ORM.db.AppDataEntity.get({app_id:parameters.app_id, 
                                                        resource_id:null, 
                                                        data:{data_app_id:parameters.data.data_app_id}}).result[0];
    /**@type{server['server']['response'] & {result?:(server['ORM']['Object']['AppDataResourceMaster'] & {Document:product})[]}} */
    const products = server.ORM.db.AppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                        resource_id:parameters.data.resource_id, 
                                                        data:{  iam_user_id:null,
                                                                data_app_id:parameters.data.data_app_id,
                                                                resource_name:'PRODUCT',
                                                                app_data_entity_id:Entity.Id
                                                        }});
    
    /**@type{server['ORM']['Object']['AppDataEntity'] & {Document:currency}} */
    const currency = server.ORM.db.AppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                        resource_id:null, 
                                                        data:{  iam_user_id:null,
                                                                data_app_id:parameters.data.data_app_id,
                                                                resource_name:'CURRENCY',
                                                                app_data_entity_id:Entity.Id
                                                        }}).result[0];
    /**@type{server['server']['response'] & {result?:(server['ORM']['Object']['AppDataResourceDetail'] & {Document:product_variant})[]}} */
    const product_variants = server.ORM.db.AppDataResourceDetail.get({ app_id:parameters.app_id, 
                                                                resource_id:parameters.data.resource_id_variant, 
                                                                data:{  iam_user_id:null,
                                                                        data_app_id:parameters.data.data_app_id,
                                                                        resource_name:'PRODUCT_VARIANT',
                                                                        app_data_resource_master_id:null,
                                                                        app_data_entity_id:Entity.Id
                                                                }});
    /**@type{server['server']['response'] & {result?:(server['ORM']['Object']['AppDataResourceMaster'] & {Document:metadata_product_variant})[]}} */
    const product_variant_metadatas = server.ORM.db.AppDataResourceMaster.get({app_id:parameters.app_id, 
                                                                        resource_id:null, 
                                                                        data:{  iam_user_id:null,
                                                                                data_app_id:parameters.data.data_app_id,
                                                                                resource_name:'PRODUCT_VARIANT_METADATA',
                                                                                app_data_entity_id:Entity.Id,
                                                                        }});
    for (const product of products.result){
        product.Sku = [];
        for (const product_variant of product_variants.result.filter((/**@type{(server['ORM']['Object']['AppDataResourceDetail'] & {Document:product_variant})}*/row)=>row.AppDataResourceMasterId == product.Id)){
            product.sku_keys = [];
            for (const product_variant_metadata of product_variant_metadatas.result){
                const key_name = Object.keys(product_variant_metadata.Document)[0];
                if (key_name != 'Name'){
                    const key_type = product_variant_metadata.Document[Object.keys(product_variant_metadata.Document)[0]].Type;
                    product.sku_keys.push({KeyName:key_name, KeyValue:product_variant.Document[key_name], KeyType:key_type});
                }
            }
            product.sku_keys.push({KeyName:'Id', KeyValue:product_variant.Id, KeyType:'TEXT'});
            //add currency to be displayed on each product variant
            product.sku_keys.push({KeyName:'CurrencyCode', KeyValue:currency.Document.CurrencyCode, KeyType:'TEXT'});
            product.sku_keys.push({KeyName:'CurrencySymbol', KeyValue:currency.Document.CurrencySymbol, KeyType:'TEXT'});
            product.Sku.push(product.sku_keys);
        }
        
        //return placeholder for stock info
        product.Stock =  [  [{KeyName:'Location', KeyValue:'', KeyType:'TEXT'}, 
                            {KeyName:'StockText', KeyValue:'', KeyType:'TEXT'}, 
                            {KeyName:'Stock',     KeyValue:'', KeyType:'TEXT'}]];
    }
    return products;
};
export default productGet;
/**
 * @module apps/app6/src/functions/product_get
 */
/**
 * @import {server_server_response, server_db_table_AppDataResourceDetail, server_db_table_AppDataEntity, server_db_table_AppDataResourceMaster} from '../../../../server/types.js'
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
 * @returns {Promise.<server_server_response & {result?:server_db_table_AppDataResourceMaster[]}>}
 */
const productGet = async parameters =>{
        
    /**@type{server_db_table_AppDataEntity} */
    const Entity            = server.ORM.db.AppDataEntity.get({app_id:parameters.app_id, 
                                                        resource_id:null, 
                                                        data:{data_app_id:parameters.data.data_app_id}}).result[0];
    
    const products = server.ORM.db.AppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                        resource_id:parameters.data.resource_id, 
                                                        data:{  iam_user_id:null,
                                                                data_app_id:parameters.data.data_app_id,
                                                                resource_name:'PRODUCT',
                                                                app_data_entity_id:Entity.id
                                                        }});
    
    
    const currency = server.ORM.db.AppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                        resource_id:null, 
                                                        data:{  iam_user_id:null,
                                                                data_app_id:parameters.data.data_app_id,
                                                                resource_name:'CURRENCY',
                                                                app_data_entity_id:Entity.id
                                                        }}).result[0];
    const product_variants = server.ORM.db.AppDataResourceDetail.get({ app_id:parameters.app_id, 
                                                                resource_id:parameters.data.resource_id_variant, 
                                                                data:{  iam_user_id:null,
                                                                        data_app_id:parameters.data.data_app_id,
                                                                        resource_name:'PRODUCT_VARIANT',
                                                                        app_data_resource_master_id:null,
                                                                        app_data_entity_id:Entity.id
                                                                }});
    const product_variant_metadatas = server.ORM.db.AppDataResourceMaster.get({app_id:parameters.app_id, 
                                                                        resource_id:null, 
                                                                        data:{  iam_user_id:null,
                                                                                data_app_id:parameters.data.data_app_id,
                                                                                resource_name:'PRODUCT_VARIANT_METADATA',
                                                                                app_data_entity_id:Entity.id,
                                                                        }});
    for (const product of products.result){
        product.sku = [];
        for (const product_variant of product_variants.result.filter((/**@type{server_db_table_AppDataResourceDetail}*/row)=>row.app_data_resource_master_id == product.id)){
            product.sku_keys = [];
            for (const product_variant_metadata of product_variant_metadatas.result){
                const key_name = Object.keys(product_variant_metadata.Document)[0];
                if (key_name.toLowerCase() != 'name'){
                    const key_type = product_variant_metadata.Document[Object.keys(product_variant_metadata.Document)[0]].type;
                    product.sku_keys.push({key_name:key_name, key_value:product_variant.Document[key_name], key_type:key_type});
                }
            }
            product.sku_keys.push({key_name:'id', key_value:product_variant.id, key_type:'TEXT'});
            //add currency to be displayed on each product variant
            product.sku_keys.push({key_name:'currency_code', key_value:currency.Document.currency_code, key_type:'TEXT'});
            product.sku_keys.push({key_name:'currency_symbol', key_value:currency.Document.currency_symbol, key_type:'TEXT'});
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
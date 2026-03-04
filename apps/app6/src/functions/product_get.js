/**
 * @module apps/app6/src/functions/product_get
 */
/**
 * @import {server} from '../../../../server/types.js'
 * @import {currency, product, product_return, product_variant, metadata_product_variant} from './types.js'
 */
const {server} = await import('../../../../server/server.js');
/**
 * @name productGet
 * @description Get product
 * @function
 * @param {{app_id:number,
 *          data:{  resource_id:number,
 *                  data_app_id:number},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:(server['ORM']['Object']['AppDataResourceMaster'] & {Document:product_return})[]}>}
 */
const productGet = async parameters =>{
        
    /**@type{server['ORM']['Object']['AppDataEntity']} */
    const Entity            = (server.ORM.db.AppDataEntity.get({app_id:parameters.app_id, 
                                                        resource_id:null, 
                                                        data:{data_app_id:parameters.data.data_app_id}}).result??[])[0];
    /**@ts-ignore @type{(server['ORM']['Object']['AppDataResourceMaster'] & {Document:product_return})[]} */
    const products = (server.ORM.db.AppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                        resource_id:parameters.data.resource_id, 
                                                        data:{  iam_user_id:null,
                                                                data_app_id:parameters.data.data_app_id,
                                                                resource_name:'PRODUCT',
                                                                app_data_entity_id:Entity.Id
                                                        }}).result??[]);
    
    /**@ts-ignore @type{server['ORM']['Object']['AppDataEntity'] & {Document:currency}} */
    const currency = (server.ORM.db.AppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                        resource_id:null, 
                                                        data:{  iam_user_id:null,
                                                                data_app_id:parameters.data.data_app_id,
                                                                resource_name:'CURRENCY',
                                                                app_data_entity_id:Entity.Id
                                                        }}).result??[])[0];
    
    /**@ts-ignore @type{(server['ORM']['Object']['AppDataResourceMaster'] & {Document:metadata_product_variant})[]} */
    const product_variant_metadatas = (server.ORM.db.AppDataResourceMaster.get({app_id:parameters.app_id, 
                                                                        resource_id:null, 
                                                                        data:{  iam_user_id:null,
                                                                                data_app_id:parameters.data.data_app_id,
                                                                                resource_name:'PRODUCT_VARIANT_METADATA',
                                                                                app_data_entity_id:Entity.Id,
                                                                        }}).result??[]);
    for (const product of products){
        /**@type{product_return['Sku'][]} */
        product.Document.Sku = [];
        /**@ts-ignore @type{(server['ORM']['Object']['AppDataResourceDetail'] & {Document:product_variant})[]}} */
        const product_variants = (server.ORM.db.AppDataResourceDetail.get({ app_id:parameters.app_id, 
                                                                resource_id:null, 
                                                                data:{  iam_user_id:null,
                                                                        data_app_id:parameters.data.data_app_id,
                                                                        resource_name:'PRODUCT_VARIANT',
                                                                        app_data_resource_master_id:null,
                                                                        app_data_entity_id:Entity.Id
                                                                }})
                                                                .result??[])
                                                                .filter(row=>
                                                                    row.AppDataResourceMasterId == product.Id);
        for (const product_variant of product_variants){
            /**@type{product_return['Sku'][0]} */
            const sku_keys = [];
            for (const product_variant_metadata of product_variant_metadatas){
                const key_name = Object.keys(product_variant_metadata.Document)[0];
                if (key_name != 'Name'){
                    const key_type = product_variant_metadata.Document[Object.keys(product_variant_metadata.Document)[0]].Type;
                    sku_keys.push({KeyName:key_name, KeyValue:product_variant.Document[key_name], KeyType:key_type});
                }
            }
            sku_keys.push({KeyName:'Id', KeyValue:product_variant.Id, KeyType:'TEXT'});
            //add currency to be displayed on each product variant
            sku_keys.push({KeyName:'CurrencyCode', KeyValue:currency.Document.CurrencyCode, KeyType:'TEXT'});
            sku_keys.push({KeyName:'CurrencySymbol', KeyValue:currency.Document.CurrencySymbol, KeyType:'TEXT'});
            product.Document.Sku.push(sku_keys);
        }
        
        //return placeholder for stock info
        product.Document.Stock =  [  [{KeyName:'Location', KeyValue:'', KeyType:'TEXT'}, 
                            {KeyName:'StockText', KeyValue:'', KeyType:'TEXT'}, 
                            {KeyName:'Stock',     KeyValue:'', KeyType:'TEXT'}]];
    }
    return { result:products.map(row=>{
        return {...row, ...{Sku:row.Document.Sku, Stock:row.Document.Stock}}}), type:'JSON'};
};
export default productGet;
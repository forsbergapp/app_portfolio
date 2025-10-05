/**
 * @module apps/app6/src/functions/product_location_get
 */
/**
 * @import {server} from '../../../../server/types.js'
 */
const {server} = await import('../../../../server/server.js');
/**
 * @name productLocationGet
 * @description Get product location
 * @function
 * @param {{app_id:number,
 *          data:{  resource_id:number|null,
 *                  data_app_id:null},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{Stock:{KeyName:string, KeyValue:string, KeyType:string}[][]}[] }>}
 */
const productLocationGet = async parameters =>{

    /**@type{server['ORM']['Object']['AppDataEntity'] & {Id:number}} */
    const Entity            = server.ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                                    resource_id:null, 
                                                    data:{data_app_id:parameters.data.data_app_id}}).result[0];

    const stock = [];
    const product_variant_location = server.ORM.db.AppDataResourceDetailData.get({ app_id:parameters.app_id, 
                                                                            resource_id:null, 
                                                                            data:{  app_data_resource_detail_id:parameters.data.resource_id,
                                                                                    iam_user_id:null,
                                                                                    data_app_id:parameters.data.data_app_id,
                                                                                    resource_name:'PRODUCT_VARIANT',
                                                                                    resource_name_master_attribute:'PRODUCT',
                                                                                    resource_name_data_master_attribute:'LOCATION',
                                                                                    app_data_entity_id:Entity.Id
                                                                            }});
    const product_variant_location_metadata = server.ORM.db.AppDataResourceMaster.get({app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  iam_user_id:null,
                                                                                        data_app_id:parameters.data.data_app_id,
                                                                                        resource_name:'PRODUCT_VARIANT_LOCATION_METADATA',
                                                                                        app_data_entity_id:Entity.Id
                                                                                }});
    for (const location of product_variant_location.result){
        //location, stock_text, stock
        stock.push([{KeyName:'Location',   KeyValue:location.adrm_attribute_master_Document.Name, KeyType:'TEXT'},
                    {KeyName:'StockText', KeyValue:product_variant_location_metadata.result[0].Document.Stock.DefaultText, KeyType:'TEXT'},
                    {KeyName:'Stock',      KeyValue:location.Document.Stock, KeyType:'TEXT'}]);
    }

    return {result:[{Stock:stock}], type:'JSON'};
};
export default productLocationGet;
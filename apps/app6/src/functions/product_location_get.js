/**
 * @module apps/app6/src/functions/product_location_get
 */
/**
 * @import {server_server_response, server_db_table_AppDataEntity} from '../../../../server/types.js'
 */
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
 * @returns {Promise.<server_server_response & {result?:{stock:{key_name:string, key_value:string, key_type:string}[][]}[] }>}
 */
const productLocationGet = async parameters =>{

    const AppDataEntity = await import('../../../../server/db/AppDataEntity.js');
    const AppDataResourceMaster = await import('../../../../server/db/AppDataResourceMaster.js');
    const AppDataResourceDetailData = await import('../../../../server/db/AppDataResourceDetailData.js');

    /**@type{server_db_table_AppDataEntity} */
    const Entity            = AppDataEntity.get({   app_id:parameters.app_id, 
                                                    resource_id:null, 
                                                    data:{data_app_id:parameters.data.data_app_id}}).result[0];

    const stock = [];
    const product_variant_location = AppDataResourceDetailData.get({    app_id:parameters.app_id, 
                                                                        resource_id:null, 
                                                                        data:{  app_data_resource_detail_id:parameters.data.resource_id,
                                                                                iam_user_id:null,
                                                                                data_app_id:parameters.data.data_app_id,
                                                                                resource_name:'PRODUCT_VARIANT',
                                                                                resource_name_master_attribute:'PRODUCT',
                                                                                resource_name_data_master_attribute:'LOCATION',
                                                                                app_data_entity_id:Entity.id
                                                                        }});
    const product_variant_location_metadata = AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                            resource_id:null, 
                                                                            data:{  iam_user_id:null,
                                                                                    data_app_id:parameters.data.data_app_id,
                                                                                    resource_name:'PRODUCT_VARIANT_LOCATION_METADATA',
                                                                                    app_data_entity_id:Entity.id
                                                                            }});
    for (const location of product_variant_location.result){
        //location, stock_text, stock
        stock.push([{key_name:'location',   key_value:location.adrm_attribute_master_json_data.name, key_type:'TEXT'},
                    {key_name:'stock_text', key_value:product_variant_location_metadata.result[0].json_data.stock.default_text, key_type:'TEXT'},
                    {key_name:'stock',      key_value:location.json_data.stock, key_type:'TEXT'}]);
    }

    return {result:[{stock:stock}], type:'JSON'};
};
export default productLocationGet;
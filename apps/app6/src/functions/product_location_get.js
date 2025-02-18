/**
 * @module apps/app6/src/functions/product_location_get
 */
/**
 * @import {server_server_response} from '../../../../server/types.js'
 */
/**
 * @name productLocationGet
 * @description Get product location
 * @function
 * @param {{app_id:number,
 *          data:*,
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:{stock:{key_name:string, key_value:string, key_type:string}[][]}[] }>}
 */
const productLocationGet = async parameters =>{

    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceDetailData.js')} */
    const dbModelAppDataResourceDetailData = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetailData.js`);

    const stock = [];
    const product_variant_location = await dbModelAppDataResourceDetailData.get({   app_id:parameters.app_id, 
                                                                                    resource_id:null, 
                                                                                    data:{  app_data_detail_id:parameters.data.resource_id,
                                                                                            user_account_id:parameters.data.user_account_id,
                                                                                            data_app_id:parameters.data.data_app_id,
                                                                                            resource_name_type:'RESOURCE_TYPE',
                                                                                            resource_name:'PRODUCT_VARIANT',
                                                                                            resource_name_master_attribute_type:'RESOURCE_TYPE',
                                                                                            resource_name_master_attribute:'PRODUCT',
                                                                                            resource_name_data_master_attribute_type:'RESOURCE_TYPE',
                                                                                            resource_name_data_master_attribute:'LOCATION',
                                                                                            entity_id:parameters.data.entity_id,
                                                                                            user_null:'1'
                                                                                    }});
    const product_variant_location_metadata = await dbModelAppDataResourceMaster.get({  app_id:parameters.app_id, 
                                                                                        resource_id:null, 
                                                                                        data:{  data_app_id:parameters.data.data_app_id,
                                                                                                resource_name:'PRODUCT_VARIANT_LOCATION_METADATA',
                                                                                                entity_id:parameters.data.entity_id,
                                                                                                user_null:'1'
                                                                                        }});
    for (const location of product_variant_location.result){
        //location, stock_text, stock
        stock.push([{key_name:'location', key_value:JSON.parse(location.adrm_attribute_master_json_data).name, key_type:'TEXT'},
                    {key_name:'stock_text', key_value:JSON.parse(product_variant_location_metadata.result[0].json_data).stock.default_text, key_type:'TEXT'},
                    {key_name:'stock', key_value:JSON.parse(location.json_data).stock, key_type:'TEXT'}]);
    }

    return {result:[{stock:stock}], type:'JSON'};
};
export default productLocationGet;
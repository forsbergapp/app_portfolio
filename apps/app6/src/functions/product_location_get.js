/**
 * @module apps/app6/src/functions/product_location_get
 */
/**
 * @param {number} app_id
 * @param {*} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<[{stock:[  {key_name:string, key_value:string, key_type:string}, 
 *                              {key_name:string, key_value:string, key_type:string}, 
 *                              {key_name:string, key_value:string, key_type:string}]}]>}
 */
const product_location_get = async (app_id, data, user_agent, ip, locale, res) =>{

    /**@type{import('../../../../server/db/dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);

    /**@type{import('../../../../server/db/dbModelAppDataResourceDetailData.js')} */
    const dbModelAppDataResourceDetailData = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetailData.js`);

    const stock = [];
    const product_variant_location = await dbModelAppDataResourceDetailData.get(app_id, null, 
        new URLSearchParams(`app_data_detail_id=${data.resource_id}&user_account_id=${data.user_account_id}&data_app_id=${data.data_app_id}&` + 
                            'resource_name_type=RESOURCE_TYPE&resource_name=PRODUCT_VARIANT&'+ 
                            'resource_name_master_attribute_type=RESOURCE_TYPE&resource_name_master_attribute=PRODUCT&'+ 
                            `resource_name_data_master_attribute_type=RESOURCE_TYPE&resource_name_data_master_attribute=LOCATION&entity_id=${data.entity_id}`),
        
        true);
    const product_variant_location_metadata = await dbModelAppDataResourceMaster.get(app_id, null, 
                                                        new URLSearchParams(`data_app_id=${data.data_app_id}&resource_name=PRODUCT_VARIANT_LOCATION_METADATA&entity_id=${data.entity_id}`),
                                                        true);
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
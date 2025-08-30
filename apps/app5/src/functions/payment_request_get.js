/**
 * @module apps/app5/src/functions/payment_request_get
 */

/**
 * @import {server_server_response, 
 *          server_db_table_AppDataResourceMaster,server_db_table_AppDataResourceDetail, server_db_table_AppDataEntity} from '../../../../server/types.js'
 * @import {payment_request, bank_account, merchant} from './types.js'
 */
const {server} = await import('../../../../server/server.js');
const {getToken} = await import('./payment_request_create.js');
/**
 * @name paymentRequestGet
 * @description Get payment request
 * @function
 * @param {{app_id:number,
 *          data:{  data_app_id:number,
 *                  iam_user_id:number,
 *                  token: string},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:{payment_request_message:string,
 *                                              token:                  string,
 *                                              exp:                    number|null,
 *                                              iat:                    number|null,
 *                                              payment_request_id:     string,
 *                                              status:                 string,
 *                                              merchant_name:          string,
 *                                              amount:			        number|null,
 *                                              currency_symbol:        string,
 *                                              countdown:              string}[]}>}
 */
const paymentRequestGet = async parameters =>{

    /**@type{server_db_table_AppDataEntity} */
    const Entity    = server.ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.data_app_id}}).result[0];

    const token = await getToken({app_id:parameters.app_id, authorization:parameters.data.token, ip:parameters.ip});

    //get payment request using app_custom_id that should be the payment request id
    /**@type{payment_request} */
    const payment_request = server.ORM.db.AppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                        all_users:true,
                                                        resource_id:null, 
                                                        data:{  iam_user_id:null,
                                                                data_app_id:parameters.data.data_app_id,
                                                                resource_name:'PAYMENT_REQUEST',
                                                                app_data_entity_id:Entity.id
                                                        }}).result
                                    .filter((/**@type{server_db_table_AppDataResourceMaster}*/payment_request)=>
                                        payment_request.json_data?.payment_request_id==token?.app_custom_id
                                    )[0];
    if (payment_request){
        /**@type{bank_account} */
        const account_payer = server.ORM.db.AppDataResourceDetail.get({   app_id:parameters.app_id, 
                                                            all_users:true,
                                                            resource_id:null, 
                                                            data:{  iam_user_id:parameters.data.iam_user_id,
                                                                    data_app_id:parameters.app_id,
                                                                    resource_name:'ACCOUNT',
                                                                    app_data_resource_master_id:null,
                                                                    app_data_entity_id:Entity.id
                                                            }}).result
                                .filter((/**@type{server_db_table_AppDataResourceDetail}*/result)=>
                                    result.json_data?.bank_account_vpa == payment_request.payerid
                                )[0];
        /**@type{merchant} */
        const merchant      = server.ORM.db.AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                            all_users:true,
                                                            resource_id:null, 
                                                            data:{  iam_user_id:null,
                                                                    data_app_id:parameters.app_id,
                                                                    resource_name:'MERCHANT',
                                                                    app_data_entity_id:Entity.id
                                                            }}).result
                                .filter((/**@type{server_db_table_AppDataResourceMaster}*/merchant)=>
                                    merchant.json_data?.merchant_id==payment_request.merchant_id
                                )[0];
        const currency      = server.ORM.db.AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                            resource_id:null, 
                                                            data:{  iam_user_id:null,
                                                                    data_app_id:parameters.data.data_app_id,
                                                                    resource_name:'CURRENCY',
                                                                    app_data_entity_id:Entity.id
                                                            }}).result[0];
        if (account_payer && merchant && currency){
            return  {result:[{   payment_request_message:'Authorize this payment',
                                token:                  parameters.data.token,
                                exp:                    token?.exp??null,
                                iat:                    token?.iat??null,
                                payment_request_id:     payment_request.json_data?.payment_request_id??'',
                                status:                 payment_request.json_data?.status??'',
                                merchant_name:          merchant.json_data?.merchant_name??'',
                                amount:			        server.ORM.UtilNumberValue(payment_request.json_data?.amount),
                                currency_symbol:        currency.json_data?.currency_symbol??'',
                                countdown:              ''}],
                    type:'JSON'};
            }
        else
            return {http:404,
                    code:'PAYMENT_REQUEST_GET',
                    text:server.iam.iamUtilMessageNotAuthorized(),
                    developerText:null,
                    moreInfo:null,
                    type:'JSON'
                };
    }
    else
        return {http:404,
                code:'PAYMENT_REQUEST_GET',
                text:server.iam.iamUtilMessageNotAuthorized(),
                developerText:null,
                moreInfo:null,
                type:'JSON'
            };
};
export default paymentRequestGet;
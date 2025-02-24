/**
 * @module apps/app5/src/functions/types
 */
/** 
 * @description merchant
 * @typedef {{  title:                  string,
 *              merchant_id:            string,
 *              merchant_name:          string,
 *              merchant_url:           string,
 *              merchant_email:         string,
 *              merchant_longitude:     string,
 *              merchant_latitude:      string,
 *              merchant_logo:          string,
 *              merchant_type:          string,
 *              merchant_api_url_payment_request_create:    string,
 *              merchant_api_url_payment_request_get_status:string,
 *              merchant_api_secret:    string,
 *              merchant_public_key:    string,
 *              merchant_private_key:   string,
 *              merchant_vpa:           string,
 *              json_data:              {[key:string]:string},
 *              id:                                 number,                 
 *              user_account_app_user_account_id:   number,
 *              user_account_app_app_id:            number}} merchant
 */
/**
 * @description payment_request
 * @typedef {{  merchant_id:    string,
 *              payment_request_id:string,
 *              reference:      string,
 *              payeeid:        string,
 *              payerid:        string,
 *              currency_code:  string,
 *              amount:         number|null,
 *              message:        string,
 *              json_data?:     {[key:string]:string},
 *              status:         string}} payment_request
 */

/** 
 * @description bank_account
 * @typedef {{title:string;
 *            bank_account_iban:string;
 *            bank_account_number:string;
 *            bank_account_balance:string;
 *            bank_account_secret:string;
 *            bank_account_vpa:string;
 *            currency:string;
 *            currency_name:string,
 *            json_data:{[key:string]:string}}} bank_account
 */
/**
 * @description bank_transaction
 * @typedef {{  timestamp:string, 
 *              logo:string, 
 *              origin:string, 
 *              amount_deposit:number|null, 
 *              amount_withdrawal:number|null}} bank_transaction
 */
export{};
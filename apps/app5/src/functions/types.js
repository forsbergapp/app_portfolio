/**
 * @module apps/app5/src/functions/types
 */
/** 
 * @description merchant
 * @typedef {{  Title:                 string,
 *              MerchantId:            number,
 *              MerchantName:          string,
 *              MerchantUrl:           string,
 *              MerchantLongitude:     string,
 *              MerchantLatitude:      string,
 *              MerchantLogo:          string,
 *              MerchantType:          string,
 *              MerchantApiUrlPaymentRequestCreate:    string,
 *              MerchantapiUrlPaymentRequestGetStatus:string,
 *              MerchantApiSecret:     string,
 *              MerchantPublicKey:     string,
 *              MerchantPrivateKey:    string,
 *              MerchantVpa:           string,
 *              Document:              {[key:string]:string},
 *              Id:                    number,                 
 *              IamUserAppId:          number}} merchant
 */
/**
 * @description payment_request
 * @typedef {{  MerchantId:         number,
 *              PaymentRequestId:  string,
 *              Reference:          string,
 *              PayeeId:            string,
 *              PayerId:            string,
 *              CurrencyCode:       string,
 *              Amount:             number|null,
 *              Message:            string,
 *              Document?:          {[key:string]:string},
 *              Status:             string}} payment_request
 */

/** 
 * @description bank_account
 * @typedef {{Title:string;
 *            BankAccountIban:string;
 *            BankAccountNumber:string;
 *            BankAccount_balance:string;
 *            BankAccount_secret:string;
 *            BankAccount_vpa:string;
 *            Currency:string;
 *            CurrencyName:string,
 *            Document:{[key:string]:string}}} bank_account
 */
/**
 * @description bank_transaction
 * @typedef {{  Timestamp:string, 
 *              Logo:string, 
 *              Origin:string, 
 *              AmountDeposit:number|null, 
 *              AmountWithdrawal:number|null}} bank_transaction
 */
export{};
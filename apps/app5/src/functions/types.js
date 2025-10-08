/**
 * @module apps/app5/src/functions/types
 */
/**
 * @description AppData Resource metadata
 * @typedef {{DefaultText: string, Length:number|null, Type:string, Lov:string|null}} resource_metadata
 */
/**
 * @description Account metadata
 * @typedef {{  Title:resource_metadata,
 *              CustomerType:resource_metadata,
 *              Name:resource_metadata,
 *              Address:resource_metadata,
 *              City:resource_metadata,
 *              Country:resource_metadata}} metadata_account
 */
/**
 * @description customer
 * @typedef {{CustomerType: string,
 *            Name:         string,
 *            Address:      string,
 *            City:         string,
 *            Country:      string}} customer
 */
/**
 * @description  currency
 * @typedef {{  ConversionRate: number,
 *              Created:        string,
 *              CurrencyCode:   string,
 *              CurenceName:    string,
 *              CurrencySymbol: string,
 *              DecimalPlaces:  string}} currency
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
 *              MerchantVpa:           string}} merchant
 */
/**
 * @description payment_request
 * @typedef {{  MerchantId:         number,
 *              PaymentRequestId:   string,
 *              Reference:          string,
 *              PayeeId:            string,
 *              PayerId:            string,
 *              CurrencyCode:       string,
 *              Amount:             number|null,
 *              Message:            string,
 *              Status:             string}} payment_request
 */

/** 
 * @description bank_account
 * @typedef {{BankAccountNumber:string,
 *            BankAccountSecret:string,
 *            BankAccountVpa:string}} bank_account
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
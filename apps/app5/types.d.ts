/**
 * @module apps/app5/types
 */
/**
 * @name resource_metadata
 * @description AppData Resource metadata
 */
type resource_metadata = {
        DefaultText: string, 
        Length:number|null, 
        Type:string, 
        Lov:string|null
}
/**
 * @name metadata_account
 * @description Account metadata
 */
type metadata_account = {
        Title:resource_metadata,
        CustomerType:resource_metadata,
        Name:resource_metadata,
        Address:resource_metadata,
        City:resource_metadata,
        Country:resource_metadata
}
/**
 * @name customer
 * @description customer
 */
type customer = {
        CustomerType: string,
        Name:         string,
        Address:      string,
        City:         string,
        Country:      string
}
/**
 * @name currency
 * @description  currency
 */
type currency = {
        ConversionRate: number,
        Created:        string,
        CurrencyCode:   string,
        CurenceName:    string,
        CurrencySymbol: string,
        DecimalPlaces:  string
}
/** 
 * @name merchant
 * @description merchant
 */
type merchant = {
        Title:                 string,
        MerchantId:            number,
        MerchantName:          string,
        MerchantUrl:           string,
        MerchantLongitude:     string,
        MerchantLatitude:      string,
        MerchantLogo:          string,
        MerchantType:          string,
        MerchantApiUrlPaymentRequestCreate:    string,
        MerchantapiUrlPaymentRequestGetStatus:string,
        MerchantApiSecret:     string,
        MerchantPublicKey:     string,
        MerchantPrivateKey:    string,
        MerchantVpa:           string
}
/**
 * @name payment_request
 * @description payment_request
 */
type payment_request = {
        MerchantId:         number,
        PaymentRequestId:   string,
        Reference:          string,
        PayeeId:            string,
        PayerId:            string,
        CurrencyCode:       string,
        Amount:             number|null,
        Message:            string,
        Status:             string
}
/** 
 * @name bank_account
 * @description bank_account
 */
type bank_account = {
        BankAccountNumber:string,
        BankAccountSecret:string,
        BankAccountVpa:string
}
/**
 * @name bank_transaction
 * @description bank_transaction
 */
type bank_transaction = {
        Timestamp:string, 
        Logo:string, 
        Origin:string, 
        AmountDeposit:number|null, 
        AmountWithdrawal:number|null
}
export{ resource_metadata, 
        metadata_account, 
        customer, 
        currency, 
        merchant, 
        payment_request, 
        bank_account,
        bank_transaction};
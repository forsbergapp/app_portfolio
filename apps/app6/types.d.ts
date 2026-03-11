/**
 * @module apps/app6/types
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
 * @name metadata_product_variant
 * @description product variant metadata
 */
type metadata_product_variant = {
        Sku:resource_metadata,
        Name:resource_metadata,
        ProductColor:resource_metadata,
        ProductSize:resource_metadata,
        Price:resource_metadata
}
/**
 * @name product
 * @description product
 */
type product = {
        Name:string, 
        Image:string, 
        Description:string, 
        Attributes:[{Key:"Length",  Value:"Normal"}, 
                    {Key:"Fit",     Value:"Regular fit"}, 
                    {Key:"Material",Value:"Cotton"}]
}
/**
 * @name product_return
 * @description product_return
 */
type product_return = 
        product &   { 
                    Sku:{
                        KeyName:string, 
                        KeyValue:string|number, 
                        KeyType:'TEXT'
                    }[][],
                    Stock:[
                        {KeyName:'Location', KeyValue:string|number, KeyType:'TEXT'},
                        {KeyName:'StockText', KeyValue:string|number, KeyType:'TEXT'},
                        {KeyName:'Stock', KeyValue:string|number, KeyType:'TEXT'}][]
                    }
/**
 * @name product_variant
 * @description product_variant
 */
type product_variant = {
        Sku:string, 
        Name:string, 
        ProductColor: string, 
        ProductSize: 'S'|'M'|'L'|'XL',
        Price:number
}
/**
 * @name product_variant_location
 * @description product_variant_location
 */
type product_variant_location = {
        Stock:number
}
/**
 * @name metadata_product_variant_location
 * @description product variant location_metadata
 */
type metadata_product_variant_location = {
        Stock:resource_metadata
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
 * @name AppDataEntityDocument
 * @description AppDataEntityDocument
 */
type AppDataEntityDocument = {
        Description:string, 
        Name:string, 
        EntityType:string, 
        StoreType:string,
        MerchantId:string|null,
        MerchantName:string|null,
        MerchantApiUrlPaymentRequestAppId:number, 
        MerchantApiUrlPaymentRequestCreate:string|null, 
        MerchantApiUrlPaymentRequestGetStatus:string|null,
        MerchantApiSecret:string|null, 
        MerchantPublicKey:string|null,
        MerchantPrivateKey:string|null,
        MerchantVpa:string|null,
        IamUserIdAnonymous:number|null
}
export {resource_metadata,
        metadata_product_variant,
        product,
        product_return,
        product_variant,
        product_variant_location,
        metadata_product_variant_location,
        currency,
        AppDataEntityDocument
}
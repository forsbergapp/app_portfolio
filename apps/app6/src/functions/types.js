/**
 * @module apps/app6/src/functions/types
 */
/**
 * @description AppData Resource metadata
 * @typedef {{DefaultText: string, Length:number|null, Type:string, Lov:string|null}} resource_metadata
 */
/**
 * @description product variant metadata
 * @typedef {{  Sku:resource_metadata,
 *              Name:resource_metadata,
 *              ProductColor:resource_metadata,
 *              ProductSize:resource_metadata,
 *              Price:resource_metadata}} metadata_product_variant
 */
/**
 * @description product
 * @typedef {{  Name:string, 
 *              Image:string, 
 *              Description:string, 
 *              Attributes:[{Key:"Length",  Value:"Normal"}, 
 *                          {Key:"Fit",     Value:"Regular fit"}, 
 *                          {Key:"Material",Value:"Cotton"}]}} product
 */
/**
 * @description product_variant
 * @typedef {{  Sku:string, 
 *              Name:string, 
 *              ProductColor: string, 
 *              ProductSize: 'S'|'M'|'L'|'XL',
 *              Price:number}} product_variant
 */
/**
 * @description product_variant_location
 * @typedef {{Stock:number}} product_variant_location
 */
/**
 * @description product variant location_metadata
 * @typedef {{  Stock:resource_metadata}} metadata_product_variant_location
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
 * @description AppDataEntityDocument
 * @typedef {{ Description:string, 
 *             Name:string, 
 *             EntityType:string, 
 *             StoreType:string,
 *             MerchantId:string|null,
 *             MerchantName:string|null,
 *             MerchantApiUrlPaymentRequestAppId:number, 
 *             MerchantApiUrlPaymentRequestCreate:string|null, 
 *             MerchantApiUrlPaymentRequestGetStatus:string|null,
 *             MerchantApiSecret:string|null, 
 *             MerchantPublicKey:string|null,
 *             MerchantPrivateKey:string|null,
 *             MerchantVpa:string|null,
 *             IamUserIdAnonymous:number|null}} AppDataEntityDocument
 */
export {}
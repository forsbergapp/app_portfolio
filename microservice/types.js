/**
 * @module microservice/types
 */
/**
 * @description Microservice - Request
 * @typedef {object}        microservice_req
 * @property {string}       url
 * @property {string}       method
 * 
 * @property {{ authorization:string,
 *              'accept-language':string}}       headers
 * 
 * @property {object}       query
 * @property {number|null}  query.app_id
 * @property {*}    query.data
 * @property {*}    body
 */

/** 
 * @description Microservice Config
 * @typedef {{  PATH_DATA                                   : string,
 *              CIRCUITBREAKER_FAILURETHRESHOLD_SECONDS     : number,
 *              CIRCUITBREAKER_COOLDOWNPERIOD_SECONDS       : number
 *              CIRCUITBREAKER_REQUESTTIMEOUT_SECONDS       : number
 *              CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN_MINUTES : number}|null} microservice_config
 */

/** 
 * @description Microservice config service record
 * @typedef {{NAME:string, 
 *            HOST:number, 
 *            PORT:number,
 *            HTTPS_ENABLE:number,
 *            HTTPS_KEY:string,
 *            HTTPS_CERT:string,
 *            HTTPS_SSL_VERIFICATION:number,
 *            HTTPS_SSL_VERIFICATION_PATH:string,
 *            HTTPS_PORT:number,
 *            STATUS: string,
 *            PATH:string,
 *            CONFIG:[*]}} microservice_config_service_record
 */

/** 
 * @description Microservice config service
 * @typedef {{['SERVICES']:microservice_config_service_record[]}} microservice_config_service
 */

/** 
 * @description Microservice - Response
 * @typedef {object}    microservice_res
 * @property {function} setHeader
 * @property {function} setEncoding
 * @property {number}   statusCode
 * @property {function} write
 * @property {function} end
 * @property {function} send
 * @property {object}   headers
 * @property {string}   headers.location
 */
/**
 * @description Registry services
 * @typedef {'GEOLOCATION'|'WORLDCITIES'|'MAIL'|string} microservice_registry_service
 */
export {};
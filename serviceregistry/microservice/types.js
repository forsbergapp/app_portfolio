/**
 * @module serviceregistry/microservice/types
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
 * @description DB DOCUMENT config_microservice_services
 * @memberof dbObjects
 * @typedef {{['SERVICES']:{NAME:string, 
 *                          HOST:number, 
 *                          PORT:number,
 *                          HTTPS_ENABLE:number,
 *                          HTTPS_KEY:string,
 *                          HTTPS_CERT:string,
 *                          HTTPS_SSL_VERIFICATION:number,
 *                          HTTPS_SSL_VERIFICATION_PATH:string,
 *                          HTTPS_PORT:number,
 *                          STATUS: string,
 *                          PATH:string,
 *                          PATH_DATA:string,
 *                          CONFIG:[*]}[]}} server_db_document_config_microservice_services
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
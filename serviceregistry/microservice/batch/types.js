/**
 * @module serviceregistry/microservice/batch/types
 */

/**
 * @description Type request
 * @typedef {object}        request
 * @property {string}       url
 * @property {string}       method
 * @property {{ authorization:string,
 *              'accept-language':string}}       headers
 * @property {object}       query
 * @property {number|null}  query.app_id
 * @property {*}    query.data
 * @property {*}    body
 */
/** 
 * @description Type response
 * @typedef {object}    response
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
 * @description config
 * @typedef {{
 *   name:                              string,
 *   server_protocol:	                string,
 *   server_host:		                string,
 *   server_port:                       number,
 *   server_https_key:                  string,
 *   server_https_cert:                 string,
 *   server_https_ssl_verification:     0|1,
 *   server_https_ssl_verification_path:string,
 *   path_data:                         string,
 *   service_registry_auth_url:		    string,
 *   service_registry_auth_method:      'POST',
 *   message_queue_url:	                string,
 *   message_queue_method:	            'POST',
 *   uuid:                              string,
 *   secret:                            string,
 *   config:{
 *          jobs:   { 
 *                  jobid:number, 
 *                  name:string, 
 *                  command_type:'OS', 
 *                  platform: string, 
 *                  path: string, 
 *                  command: string, 
 *                  argument: string, 
 *                  cron_expression:string, 
 *                  enabled:boolean}[]
 *          },
 *   server:                            import('node:http') ,
 *   port:                              number,
 *   options:                           {key?:string, cert?:string}}} config
 */
/**
 * @description jobs
 * @typedef {{  jobid:number,
 *           log_id: number, 
 *           timeId:NodeJS.Timeout, 
 *           command:string, 
 *           cron_expression:string, 
 *           milliseconds: number,
 *           scheduled_start: Date}[]}  jobs
 */

export{};
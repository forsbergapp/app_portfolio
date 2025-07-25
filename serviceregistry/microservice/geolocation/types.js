/**
 * @module serviceregistry/microservice/geolocation/types
 */
/** 
 * @description Type geolocation
 * @typedef  {object}       geolocation_data
 * @property {string}       latitude
 * @property {string}       longitude
 * @property {string|null}  ip
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
 *   path_data:                         string,
 *   service_registry_auth_url:		    string,
 *   service_registry_auth_method:      'POST',
 *   message_queue_url:	                string,
 *   message_queue_method:	            'POST',
 *   uuid:                              string,
 *   secret:                            string,
 *   config:                            {url_ip:string, url_place:string},
 *   server:                            import('node:http') ,
 *   port:                              number,
 *   options:                           {key?:string, cert?:string}}} config
 */
 

export{};
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
 * @typedef {{ commonConfig: (arg0:{service:string})=>Promise.<{
 *                                      name:                               string,
 *                                      server_protocol:	                string,
 *                                      server_host:		                string,
 *                                      server_port:                        number,
 *                                      server_https_key:                   string,
 *                                      server_https_cert:                  string,
 *                                      server_https_ssl_verification:      0|1,
 *                                      server_https_ssl_verification_path: string,
 *                                      path_data:                          string,
 *                                      service_registry_auth_url:		    string,
 *                                      service_registry_auth_method:      'POST',
 *                                      message_queue_url:	                string,
 *                                      message_queue_method:	            'POST',
 *                                      iam_auth_app_url:	                string,
 *                                      iam_auth_app_method:	            'POST',
 *                                      uuid:                               string,
 *                                      secret:                             string,
 *                                      config:                             *,
 *                                      server:                             import('node:http') ,
 *                                      port:                               number,
 *                                      options:                            {key?:string, cert?:string}}>,
 *          commonAuth:(arg0:{  service_registry_auth_url:string,
 *                              service_registry_auth_method:'POST'|'GET',
 *                              uuid:string,
 *                              secret:string})=>Promise.<{ token: string,
 *                                                          exp: number,
 *                                                          iat: number,
 *                                                          }|null>,
 *          commonServerReturn: (arg0:{ service:string,
 *                                      token:string,
 *                                      uuid:string,
 *                                      secret:string,
 *                                      message_queue_url:string,
 *                                      message_queue_method:'POST'|'GET',
 *                                      code:string,
 *                                      error:*,
 *                                      result:*,
 *                                      res:import('node:http')['IncomingMessage'] & {  statusCode:string, 
 *                                                          write:function, 
 *                                                          setHeader:function, 
 *                                                          end:function}}) => Promise.<void>,
 *          commonLog: (arg0:{  type:'MICROSERVICE_LOG'|'MICROSERVICE_ERROR',
 *                              service:string,
 *                              message:string,
 *                              token:string,
 *                              message_queue_url:string,
 *                              message_queue_method:'POST'|'GET',
 *                              uuid:string,
 *                              secret:string}) => void,
 *          commonIamAuthenticateApp: (arg0:{   app_id:number,
 *                                              token:string,
 *                                              iam_auth_app_url:string,
 *                                              iam_auth_app_method:'POST'|'GET',
 *                                              uuid:string,
 *                                              secret:string,
 *                                              'app-id':number,
 *                                              'app-signature':string}) =>Promise.<boolean>,
 *          commonRequestUrl: (arg0: {  url:string,
 *                                      external:boolean,
 *                                      encrypt:boolean,
 *                                      uuid:string|null,
 *                                      secret:string|null,
 *                                      'app-id'?:number|null,
 *                                      'app-signature'?:string|null,
 *                                      method:'GET'|'POST',
 *                                      authorization?:string|null,
 *                                      body:{}|null,
 *                                      language:string}) => Promise.<*>
 * }} common
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
 *   iam_auth_app_url:	                string,
 *   iam_auth_app_method:	            'POST',
 *   uuid:                              string,
 *   secret:                            string,
 *   config:                            {url_ip:string, url_place:string},
 *   server:                            import('node:http') ,
 *   port:                              number,
 *   options:                           {key?:string, cert?:string}}} config
 */
 

export{};
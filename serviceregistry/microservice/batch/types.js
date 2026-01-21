/**
 * @module serviceregistry/microservice/batch/types
 */

/**
 * @description config
 * @typedef {{
 *   name:                              string,
 *   environment:                       string,
 *   server_protocol:	                string,
 *   server_host:		                string,
 *   server_port:                       number,
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
 *                  command: string, 
 *                  cron_expression:string, 
 *                  enabled:boolean}[]
 *          },
 *   server:                            import('node:http')}} config
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
/** @module server/info */

/**
 * @import {server_server_response,server_info_result_Info} from './types.js'
 * @typedef {server_server_response & {result?:server_info_result_Info }} info
 */

/**
 * @name info
 * @description Info about operating system and process
 * @function
 * @memberof ROUTE_REST_API
 * @returns {Promise.<info>}
 */
 const info = async () => {
    const os = await import('node:os');
    const os_json = {
                    hostname: os.hostname(),
                    platform: os.platform(),
                    type: os.type(),
                    release: os.release(),
                    cpus: os.cpus(),
                    arch: os.arch(),
                    freemem: os.freemem(),
                    totalmem: os.totalmem(),
                    homedir: os.homedir(),
                    tmpdir: os.tmpdir(),
                    uptime: os.uptime(),
                    userinfo: os.userInfo(),
                    version: os.version()
                    };
    const process_json = { 
                            memoryusage_rss : process.memoryUsage().rss,
                            memoryusage_heaptotal : process.memoryUsage().heapTotal,
                            memoryusage_heapused : process.memoryUsage().heapUsed,
                            memoryusage_external : process.memoryUsage().external,
                            memoryusage_arraybuffers : process.memoryUsage().arrayBuffers,
                            uptime : process.uptime(),
                            version : process.version,
                            path : process.cwd(),
                            start_arg_0 : process.argv[0],
                            start_arg_1 : process.argv[1]
                        };
    return {result:{os: os_json,process: process_json}, type:'JSON'};
};
export{info};
/** @module server-info */

/**
 * @import {server_server_response,server_info_result_Info} from './types.js'
 */

/**
 * @name info
 * @description Info about operating system and process
 * @function
 * @memberof ROUTE_REST_API
 * @returns {Promise.<server_server_response & {result?:server_info_result_Info }>}
 */
 const info = async () => {
    const {serverProcess} = await import('./server.js');
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
                            memoryusage_rss : serverProcess.memoryUsage().rss,
                            memoryusage_heaptotal : serverProcess.memoryUsage().heapTotal,
                            memoryusage_heapused : serverProcess.memoryUsage().heapUsed,
                            memoryusage_external : serverProcess.memoryUsage().external,
                            memoryusage_arraybuffers : serverProcess.memoryUsage().arrayBuffers,
                            uptime : serverProcess.uptime(),
                            version : serverProcess.version,
                            path : serverProcess.cwd(),
                            start_arg_0 : serverProcess.argv[0],
                            start_arg_1 : serverProcess.argv[1]
                        };
    return {result:{os: os_json,process: process_json}, type:'JSON'};
};
export{info};
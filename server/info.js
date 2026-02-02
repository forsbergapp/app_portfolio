/** @module server-info */

/**
 * @import {server} from './types.js'
 */
const os = await import('node:os');

/**
 * @name ClassServerProcess
 * @description server process class
 * @class
 */
class ClassServerProcess {
    /**
     * @name cwd
     * @description current working directory
     * @method
     * @returns {string}
     */
    cwd = () => import.meta.dirname
                .replaceAll('\\','/')
                .replaceAll('/server','');
    /**
     * @name uptime
     * @description uptime
     * @method
     * @returns {number}
     */
    uptime = () => process.uptime();
    /**
     * @name memoryUsage
     * @description memory usage
     * @method
     * @returns {{rss:number,
     *           heapTotal:number,
     *           heapUsed:number,
     *           external:number,
     *           arrayBuffers:number
     *          }}
     */
    memoryUsage = () => {
        return {rss:process.memoryUsage().rss,
                heapTotal:process.memoryUsage().heapTotal,
                heapUsed:process.memoryUsage().heapUsed,
                external:process.memoryUsage().external,
                arrayBuffers:process.memoryUsage().arrayBuffers
        };
    };
    /**
     * @name on
     * @description on event
     * @method
     * @param {string|symbol} event
     * @param {(...args: any[]) => void} listener
     */
    on = (event, listener) => process.on(event, listener);
    /**
     * @name argv
     * @description process arguments
     *              0: node binary
     *              1: server start script
     *              first time used from IaC setup:
     *              2: terraform.workspace
     *              3: host 
     *              4: app_port
     *              5: admin_port
     * @method
     * @returns {string[]}
     */
    argv = process.argv;
    /**
     * @name env
     * @description process env
     * @method
     * @returns {NodeJS.ProcessEnv}
     */
    env = process.env;
    /**
     * @name version
     * @description process version
     * @method
     * @returns {string}
     */
    version = process.version;
}
const serverProcess = new ClassServerProcess();
/**
 * @name info
 * @description Info about operating system and process
 * @function
 * @memberof ROUTE_REST_API
 * @returns {Promise.<server['server']['response'] & {result?:server['info']['result_Info']}>}
 */
 const info = async () => {
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
export{info, serverProcess};
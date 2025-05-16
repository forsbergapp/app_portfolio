/** 
 * Test performance
 * @module test/performance.spec
 */
/**
 * @import {test_spec_result} from '../server/types.js'
 */

/**
 * @name test
 * @description describe: Performance test, calling main server url according to configured values
 *              it: should handle 100 concurrent requests without any error within 10 seconds
 * @function
 * @param {import('./test.js')} t
 * @returns {Promise.<test_spec_result['detail']>}
 */
const test = async t =>
    [await t.describe('Performance test, calling main server url according to configured values', async ()=> {
        return await new Promise(resolve=>
        t.it('should handle 100 concurrent requests without any error within 10 seconds', async () =>{ 
                const {serverUtilNumberValue} = await import('../server/server.js');
                const {serverProcess} = await import('../server/server.js');
                const Config = await import('../server/db/Config.js');

                /**@type{number} */
                let status;
                const HTTPS_ENABLE = Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVER',parameter:'HTTPS_ENABLE'}});
                const PROTOCOL = HTTPS_ENABLE =='1'?'https://':'http://';
                const HOST = Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVER', parameter:'HOST'}});
                const PORT = serverUtilNumberValue(HTTPS_ENABLE=='1'?
                                Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVER',parameter:'HTTPS_PORT'}}):
                                    Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVER',parameter:'HTTP_PORT'}}));
                const requests = [];
                const totalRequests = 100;
                //set parameter to avoid certificate errors
                const old = serverProcess.env.NODE_TLS_REJECT_UNAUTHORIZED;
                serverProcess.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
                let err=0;
                /**@type{number[]} */
                const request_status = [];
                for (let i=0; i<totalRequests; i++){
                    requests.push(new Promise(resolve=>{
                        fetch(PROTOCOL + HOST + ':' + PORT)
                        .then((response=>{
                            status = response.status;
                            return response.text();
                            }))
                        .then(()=>{
                            request_status.push(status);
                            resolve(null);
                        })
                        .catch(()=>{err++;});
                    }));
                }
                const start = Date.now();
                await Promise.all(requests);
                serverProcess.env.NODE_TLS_REJECT_UNAUTHORIZED=old;
                const total_time = (Date.now() -start)/1000;

                return [
                    /**@ts-ignore */
                    t.expect('Test url',                    PROTOCOL + HOST + ':' + PORT)['not.toBe'](null),
                    /**@ts-ignore */
                    t.expect('Requests',                    totalRequests).toBeGreaterThan(0),
                    /**@ts-ignore */
                    t.expect('Requests count status 200',   request_status.filter(status=>status==200).length).toBe(totalRequests),
                    /**@ts-ignore */
                    t.expect('Error',                       err).toBe(0),
                    /**@ts-ignore */
                    t.expect('Total time seconds',          total_time).toBeLessThan(10)
            ];
        //sets timeout for each request to 20000 ms
        }, 20000).then(result=>resolve(result)));
    })];
export default test;
/** 
 * Test performance
 * @module test/performance.spec
 */
/**
 * @import {server} from '../server/types.js'
 */
const {server} = await import('../server/server.js');

/**
 * @name test
 * @description describe: Performance test, calling main server url according to configured values
 *              it: should handle 100 concurrent requests without any error within 10 seconds
 * @function
 * @param {import('./test.js')} t
 * @returns {Promise.<server['test']['spec_result']['detail']>}
 */
const test = async t =>
    [await t.describe('Performance test, calling main server url according to configured values', async ()=> {
        return await new Promise(resolve=>
        t.it('should handle 100 concurrent requests without any error within 10 seconds', async () =>{                 
                /**@type{number} */
                let status;
                const PROTOCOL = 'http://';
                const HOST = server.ORM.db.OpenApi.getViewServers({app_id:0, data:{pathType:'APP'}}).result[0].variables.host.default
                const PORT = server.ORM.UtilNumberValue(server.ORM.db.OpenApi.getViewServers({app_id:0, data:{pathType:'APP'}}).result[0].variables.port.default);
                const requests = [];
                const totalRequests = 100;
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
/** 
 * Test performance
 * @module test/performance.spec
 */
/**
 * @name describe
 * @description describe: Performance test, calling main server url according to configured values
 *              it: should handle 100 concurrent requests without any error within 10 seconds
 * @function
 * @returns {void}
 */
describe('Performance test, calling main server url according to configured values', ()=> {
    it('should handle 100 concurrent requests without any error within 10 seconds', async () =>{ 
        /**@type{import('../server/server.js')} */
        const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
        /**@type{import('../server/db/Config.js')} */
        const Config = await import(`file://${process.cwd()}/server/db/Config.js`);

        /**@type{number} */
        let status;
        const HTTPS_ENABLE = Config.get('CONFIG_SERVER','SERVER','HTTPS_ENABLE');
        const PROTOCOL = HTTPS_ENABLE =='1'?'https://':'http://';
        const HOST = Config.get('CONFIG_SERVER','SERVER', 'HOST');
        const PORT = serverUtilNumberValue(HTTPS_ENABLE=='1'?
                        Config.get('CONFIG_SERVER','SERVER','HTTPS_PORT'):
                            Config.get('CONFIG_SERVER','SERVER','HTTP_PORT'));
        const requests = [];
        const totalRequests = 100;
        //set parameter to avoid certificate errors
        const old = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
        let err=0;
        for (let i=0; i<totalRequests; i++){
            requests.push(new Promise(resolve=>{
                fetch(PROTOCOL + HOST + ':' + PORT)
                .then((response=>{
                    status = response.status;
                    return response.text();
                    }))
                .then(()=>{
                    expect(status).toEqual(200);
                    resolve(null);
                })
                .catch(()=>{err++;});
            }));
        }
        const start = Date.now();
        await Promise.all(requests).catch(fail);
        process.env.NODE_TLS_REJECT_UNAUTHORIZED=old;
        const total_time = (Date.now() -start)/1000;
        const total_time_display = `${total_time.toFixed(3)} seconds`;
        console.log('Performance test url:',PROTOCOL + HOST + ':' + PORT);
        console.log('Performance test requests:',totalRequests);
        console.log('Performance test errors:',err);
        console.log('Performance test time:',total_time_display);
        expect(err).toBe(0);
        expect(total_time).toBeLessThan(1000*10); //less than 10 seconds
    //sets timeout for each request to 20000 ms
    }, 20000);
});

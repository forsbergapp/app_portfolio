/** 
 * Common test not belonging to any module
 * @module test 
 */
describe('FILE_DB cache test', ()=> {
    it('should return values', async () =>{
        /**@type{import('../server/server.js')} */
        const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
        /**@type{import('../server/db/fileModelConfig.js')} */
        const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
        /**@type{import('../server/db/file.js')} */
        const {fileFsCacheSet} = await import(`file://${process.cwd()}/server/db/file.js`);
        //sets file cache so test can be performed without server started
        await fileFsCacheSet();
    
        const HTTPS_ENABLE = fileModelConfig.get('CONFIG_SERVER','SERVER','HTTPS_ENABLE');
        const HOST = fileModelConfig.get('CONFIG_SERVER','SERVER', 'HOST');
        const PORT = serverUtilNumberValue(HTTPS_ENABLE=='1'?
                        fileModelConfig.get('CONFIG_SERVER','SERVER','HTTPS_PORT'):
                            fileModelConfig.get('CONFIG_SERVER','SERVER','HTTP_PORT'));
        expect(HTTPS_ENABLE).not.toBe(null);
        expect(HOST).not.toBe(null);
        expect(PORT).not.toBe(null);
    });
});

describe('Performance test', ()=> {
    beforeAll(()=>{
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });
    it('should handle 100 concurrent requests without any error within 10 seconds', async () =>{ 
        /**@type{import('../server/server.js')} */
        const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
        /**@type{import('../server/db/fileModelConfig.js')} */
        const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
        /**@type{import('../server/db/file.js')} */
        const {fileFsCacheSet} = await import(`file://${process.cwd()}/server/db/file.js`);
        //sets file cache so test can be performed without server started
        await fileFsCacheSet();
        /**@type{number} */
        let status;
        const HTTPS_ENABLE = fileModelConfig.get('CONFIG_SERVER','SERVER','HTTPS_ENABLE');
        console.log(HTTPS_ENABLE);
        const PROTOCOL = HTTPS_ENABLE =='1'?'https://':'http://';
        const HOST = fileModelConfig.get('CONFIG_SERVER','SERVER', 'HOST');
        const PORT = serverUtilNumberValue(HTTPS_ENABLE=='1'?
                        fileModelConfig.get('CONFIG_SERVER','SERVER','HTTPS_PORT'):
                            fileModelConfig.get('CONFIG_SERVER','SERVER','HTTP_PORT'));
        const requests = [];
        const totalRequests = 100;
        //set parameter to avoid certificate errors
        const old = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
        console.log('Test url', PROTOCOL + HOST + ':' + PORT);
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
        expect(err).toBe(0);
        expect(Date.now() -start).toBeLessThan(1000*10); //less than 10 seconds
    });
    afterAll(()=>{
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
    });
});

/** 
 * Test integration
 * @module test/integration.spec
 */
/**
 * @name describe
 * @description describe: Integration test, setting FILE_DB cache
 *              it: should return values when using ORM pattern for Config
 * @function
 * @returns {void}
 */
describe('Integration test, setting FILE_DB cache', ()=> {
    it('should return values when using ORM pattern for Config', async () =>{
        /**@type{import('../server/server.js')} */
        const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
        /**@type{import('../server/db/Config.js')} */
        const Config = await import(`file://${process.cwd()}/server/db/Config.js`);
    
        const HTTPS_ENABLE = Config.get('CONFIG_SERVER','SERVER','HTTPS_ENABLE');
        const HOST = Config.get('CONFIG_SERVER','SERVER', 'HOST');
        const PORT = serverUtilNumberValue(HTTPS_ENABLE=='1'?
                        Config.get('CONFIG_SERVER','SERVER','HTTPS_PORT'):
                            Config.get('CONFIG_SERVER','SERVER','HTTP_PORT'));
        console.log('Integration test FILE_DB cache HTTPS_ENABLE:', HTTPS_ENABLE);
        console.log('Integration test FILE_DB cache HOST:', HOST);
        console.log('Integration test FILE_DB cache POR:', PORT);
        expect(HTTPS_ENABLE).not.toBe(null);
        expect(HOST).not.toBe(null);
        expect(PORT).not.toBe(null);
    });
});
/**
 * @name describe
 * @description describe: Integration test, microservice geolocation IP cache (should exist before test) called from BFF and from all apps
 *              it: should return values
 * @function
 * @returns {void}
 */
describe('Integration test, microservice geolocation IP cache (should exist before test) called from BFF and from all apps', ()=> {
    it('should return values', async () =>{
        /**@type{import('../server/db/App.js')} */
        const App = await import(`file://${process.cwd()}/server/db/App.js`);

        /**@type{server_db_app[]}*/
        const apps = App.get({app_id:null, resource_id:null}).result;

        for (const app of apps){
            /**@type{import('../server/bff.js')} */
            const bff = await import(`file://${process.cwd()}/server/bff.js`);
            /**@type{server_bff_parameters}*/
            const parametersBFF = { endpoint:'SERVER',
                host:null,
                url:'/bff/app_id/v1/geolocation/ip',
                route_path:'/geolocation/ip',
                method:'GET', 
                query:'ip=127.0.0.1',
                body:{},
                authorization:null,
                ip:'127.0.0.1', 
                user_agent:'*', 
                accept_language:'',
                /**@ts-ignore */
                res:null};
            const result = await bff.bffServer(app.id, parametersBFF)
                                .catch(()=>{return {};});
            console.log('Integration test geolocation result:', result);
            console.log('Integration test geolocation app id:', app.id);
            console.log('Integration test geolocation latitude:', result.result.latitude);
            console.log('Integration test geolocation longitude:', result.result.longitude);
            expect(result.result.latitude).not.toBe(null);
            expect(result.result.longitude).not.toBe(null);
            expect(result.result.latitude).not.toBeUndefined();
            expect(result.result.longitude).not.toBeUndefined();
        }
    });
});
/**
 * @name describe
 * @description describe: Integration test, server function worldcities random city called from BFF and from all apps
 *              it: should return values
 * @function
 * @returns {void}
 */
describe('Integration test, server function worldcities random city called from BFF and from all apps', ()=> {    
    it('should return values ', async () =>{
        /**@type{import('../server/db/App.js')} */
        const App = await import(`file://${process.cwd()}/server/db/App.js`);
        /**@type{import('../server/db/Config.js')} */
        const Config = await import(`file://${process.cwd()}/server/db/Config.js`);
        /**@type{server_db_app[]}*/
        const apps = App.get({app_id:null, resource_id:null}).result;
        /**@type{import('../server/server.js')} */
        const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
        for (const app of apps){
            /**@type{import('../server/bff.js')} */
            const bff = await import(`file://${process.cwd()}/server/bff.js`);
            /**@type{server_bff_parameters}*/
            const parametersBFF = { endpoint:'APP_ID',
                host:null,
                url:'/bff/app_id/v1/app-module/COMMON_WORLDCITIES_CITY_RANDOM',
                route_path:'/app-module/COMMON_WORLDCITIES_CITY_RANDOM',
                method:'POST', 
                query:'',
                body:{type:'FUNCTION',IAM_data_app_id:serverUtilNumberValue(Config.get('CONFIG_SERVER','SERVER','APP_COMMON_APP_ID'))},
                authorization:null,
                ip:':1', 
                user_agent:'*', 
                accept_language:'',
                /**@ts-ignore */
                res:null};
            const result = await bff.bffServer(app.id, parametersBFF)
                                .then(result=>result.result)
                                .catch(()=>{return {};});
                                console.log('worldcites result:',result);
            console.log('Integration test worldcities app id:', app.id);
            console.log('Integration test worldcities lat:', result.lat);
            console.log('Integration test worldcities lng:', result.lng);
            console.log('Integration test worldcities city:', result.city);
            console.log('Integration test worldcities admin_name:', result.admin_name);
            console.log('Integration test worldcities country:', result.country);
            expect(result.lat).not.toBe(null);
            expect(result.lng).not.toBe(null);
            expect(result.city).not.toBe(null);
            expect(result.admin_name).not.toBe(null);
            expect(result.country).not.toBe(null);
            expect(result.lat).not.toBeUndefined();
            expect(result.lng).not.toBeUndefined();
            expect(result.city).not.toBeUndefined();
            expect(result.admin_name).not.toBeUndefined();
            expect(result.country).not.toBeUndefined();
        }
    });
});
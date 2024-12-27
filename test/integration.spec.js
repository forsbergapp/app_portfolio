/** 
 * Test integration
 * @module test/integration.spec
 */
/**
 * @name describe
 * @description describe: Integration test, setting FILE_DB cache
 *              it: should return values when using ORM pattern for fileModelConfig
 * @function
 * @returns {void}
 */
describe('Integration test, setting FILE_DB cache', ()=> {
    it('should return values when using ORM pattern for fileModelConfig', async () =>{
        /**@type{import('../server/server.js')} */
        const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
        /**@type{import('../server/db/fileModelConfig.js')} */
        const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
    
        const HTTPS_ENABLE = fileModelConfig.get('CONFIG_SERVER','SERVER','HTTPS_ENABLE');
        const HOST = fileModelConfig.get('CONFIG_SERVER','SERVER', 'HOST');
        const PORT = serverUtilNumberValue(HTTPS_ENABLE=='1'?
                        fileModelConfig.get('CONFIG_SERVER','SERVER','HTTPS_PORT'):
                            fileModelConfig.get('CONFIG_SERVER','SERVER','HTTP_PORT'));
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
        /**@type{import('../server/db/fileModelApp.js')} */
        const fileModelApp = await import(`file://${process.cwd()}/server/db/fileModelApp.js`);

        /**@type{server_db_file_app[]}*/
        const apps = fileModelApp.get(null, null, null);

        for (const app of apps){
            /**@type{import('../server/bff.service.js')} */
            const bff = await import(`file://${process.cwd()}/server/bff.service.js`);
            /**@type{server_bff_parameters}*/
            const parametersBFF = { endpoint:'SERVER_APP',
                host:null,
                url:'/bff/app_data/v1/geolocation/ip',
                route_path:'/geolocation/ip',
                method:'GET', 
                query:'',
                body:{},
                authorization:null,
                ip:'::1', 
                user_agent:'*', 
                accept_language:'',
                /**@ts-ignore */
                res:null};
            const result = await bff.bffServer(app.id, parametersBFF)
                                .catch(()=>{return {};});
            console.log('Integration test geolocation app id:', app.id);
            console.log('Integration test geolocation geoplugin_latitude:', result.geoplugin_latitude);
            console.log('Integration test geolocation geoplugin_longitude:', result.geoplugin_longitude);
            expect(result.geoplugin_latitude).not.toBe(null);
            expect(result.geoplugin_longitude).not.toBe(null);
            expect(result.geoplugin_latitude).not.toBeUndefined();
            expect(result.geoplugin_longitude).not.toBeUndefined();
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
        /**@type{import('../server/db/fileModelApp.js')} */
        const fileModelApp = await import(`file://${process.cwd()}/server/db/fileModelApp.js`);
        /**@type{import('../server/db/fileModelConfig.js')} */
        const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
        /**@type{server_db_file_app[]}*/
        const apps = fileModelApp.get(null, null, null);
        /**@type{import('../server/server.js')} */
        const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
        for (const app of apps){
            /**@type{import('../server/bff.service.js')} */
            const bff = await import(`file://${process.cwd()}/server/bff.service.js`);
            /**@type{server_bff_parameters}*/
            const parametersBFF = { endpoint:'APP_DATA',
                host:null,
                url:'/bff/app_data/v1/app-module-function/COMMON_WORLDCITIES_CITY_RANDOM',
                route_path:'/app-module-function/COMMON_WORLDCITIES_CITY_RANDOM',
                method:'POST', 
                query:'',
                body:{data_app_id:serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER','APP_COMMON_APP_ID'))},
                authorization:null,
                ip:':1', 
                user_agent:'*', 
                accept_language:'',
                /**@ts-ignore */
                res:null};
            const result = await bff.bffServer(app.id, parametersBFF)
                                .then(result=>result.rows)
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
/** 
 * Test integration
 * @module test/integration.spec
 */

/**
 * @import {test_spec_result} from '../server/types.js'
 */

/**
 * @name test
 * @description Integration test multplie
 * @function
 * @param {import('./test.js')} t
 * @returns {Promise.<test_spec_result['detail']>}
 */
const test = async t =>
    [await t.describe('Integration test, setting DB cache', async ()=> {
        return await new Promise(resolve=>
        t.it('should return values when using ORM pattern for Config', async () =>{
            /**@type{import('../server/server.js')} */
            const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
            /**@type{import('../server/db/Config.js')} */
            const Config = await import(`file://${process.cwd()}/server/db/Config.js`);
        
            const HTTPS_ENABLE = Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVER',parameter:'HTTPS_ENABLE'}});
            const HOST = Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVER', parameter:'HOST'}});
            const PORT = serverUtilNumberValue(HTTPS_ENABLE=='1'?
                            Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVER',parameter:'HTTPS_PORT'}}):
                                Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVER',parameter:'HTTP_PORT'}}));

            return [
                /**@ts-ignore */
                t.expect('HTTPS_ENABLE',    HTTPS_ENABLE)['not.toBe'](null),
                /**@ts-ignore */
                t.expect('HOST',            HOST)['not.toBe'](null),
                /**@ts-ignore */
                t.expect('PORT',            PORT)['not.toBe'](null)
        ];
        }).then(result=>resolve(result)));
    }),
    await t.describe('Integration test, microservice geolocation IP cache (should exist before test) called from BFF and from all apps', async ()=> {
        return await new Promise(resolve=>
        t.it('should return values', async () =>{
            /**@type{import('../server/db/App.js')} */
            const App = await import(`file://${process.cwd()}/server/db/App.js`);

            /**@type{server_db_table_App[]}*/
            const apps = App.get({app_id:0, resource_id:null}).result;

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
                if (result.http)
                    return [
                        /**@ts-ignore */
                        t.expect('Microservice Geolocation',    result.http)['toBe'](200),
                    ];
                else
                    return [
                        /**@ts-ignore */
                        t.expect('Latitude',    result.result.latitude)['not.toBe'](null),
                        /**@ts-ignore */
                        t.expect('Longitude',   result.result.longitude)['not.toBe'](null),
                        /**@ts-ignore */
                        t.expect('Latitude',    result.result.latitude)['not.toBeUndefined'](),
                        /**@ts-ignore */
                        t.expect('Longitude',   result.result.longitude)['not.toBeUndefined']()
                    ];
            }
        }).then(result=>resolve(result)));
    }),
    await t.describe('Integration test, server function worldcities random city called from BFF and from all apps', async ()=> {    
        return await new Promise(resolve=>
        t.it('should return values ', async () =>{
            /**@type{import('../server/db/App.js')} */
            const App = await import(`file://${process.cwd()}/server/db/App.js`);
            /**@type{import('../server/db/Config.js')} */
            const Config = await import(`file://${process.cwd()}/server/db/Config.js`);
            /**@type{server_db_table_App[]}*/
            const apps = App.get({app_id:0, resource_id:null}).result;
            /**@type{import('../server/server.js')} */
            const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
            for (const app of apps){
                /**@type{import('../server/bff.js')} */
                const bff = await import(`file://${process.cwd()}/server/bff.js`);
                /**@type{server_bff_parameters}*/
                const parametersBFF = { endpoint:'APP_ID',
                    host:null,
                    url:'/bff/app_id/v1/app-common-module/COMMON_WORLDCITIES_CITY_RANDOM',
                    route_path:'/app-common-module/COMMON_WORLDCITIES_CITY_RANDOM',
                    method:'POST', 
                    query:'',
                    body:{type:'FUNCTION',IAM_data_app_id:serverUtilNumberValue(Config.get({app_id:0, data:{object:'ConfigServer',config_group:'SERVER',parameter:'APP_COMMON_APP_ID'}}))},
                    authorization:null,
                    ip:':1', 
                    user_agent:'*', 
                    accept_language:'',
                    /**@ts-ignore */
                    res:null};
                const result = await bff.bffServer(app.id, parametersBFF)
                                    .then(result=>result.result)
                                    .catch(()=>{return {};});
                return [
                    /**@ts-ignore */
                    t.expect('Latitude',    result.lat)['not.toBe'](null),
                    /**@ts-ignore */
                    t.expect('Longitude',   result.lng)['not.toBe'](null),
                    /**@ts-ignore */
                    t.expect('City',        result.city)['not.toBe'](null),
                    /**@ts-ignore */
                    t.expect('Admin name',  result.admin_name)['not.toBe'](null),
                    /**@ts-ignore */
                    t.expect('Country',     result.country)['not.toBe'](null),
                    /**@ts-ignore */
                    t.expect('Latitude',    result.lat)['not.toBeUndefined'](),
                    /**@ts-ignore */
                    t.expect('Longitude',   result.lng)['not.toBeUndefined'](),
                    /**@ts-ignore */
                    t.expect('City',        result.city)['not.toBeUndefined'](),
                    /**@ts-ignore */
                    t.expect('Admin name',  result.admin_name)['not.toBeUndefined'](),
                    /**@ts-ignore */
                    t.expect('Country',     result.country)['not.toBeUndefined']()
                ];
            }
        }).then(result=>resolve(result)));
    })];
export default test;
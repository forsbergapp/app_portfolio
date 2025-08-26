/** 
 * Test integration
 * @module test/integration.spec
 */

/**
 * @import {test_spec_result, 
 *          server_db_table_App} from '../server/types.js'
 */
const {ORM} = await import('../server/server.js');
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
            const HOST = ORM.db.ConfigServer.get({app_id:0, data:{config_group:'SERVER', parameter:'HOST'}}).result;
            const PORT = ORM.UtilNumberValue(ORM.db.ConfigServer.get({app_id:0, data:{config_group:'SERVER',parameter:'HTTP_PORT'}}).result);

            return [
                /**@ts-ignore */
                t.expect('HOST',            HOST)['not.toBe'](null),
                /**@ts-ignore */
                t.expect('PORT',            PORT)['not.toBe'](null)
        ];
        }).then(result=>resolve(result)));
    }),
    await t.describe('Integration test, microservice geolocation IP cache (should exist before test) called from BFF and from all apps except common app id', async ()=> {
        return await new Promise(resolve=>
        t.it('should return values', async () =>{
            /**@type{server_db_table_App[]}*/
            const apps = ORM.db.App.get({app_id:0, resource_id:null})
                        .result.filter((/**@type{server_db_table_App}*/app)=>
                            app.id !=ORM.UtilNumberValue(ORM.db.ConfigServer.get({app_id:0, data:{config_group:'SERVICE_APP', parameter:'APP_COMMON_APP_ID'}}).result) ?? 0);
            const {microserviceRequest} = await import('../serviceregistry/microservice.js');
            //
            for (const app of apps) {
                //get GPS from IP
                const result = await microserviceRequest({  app_id:app.id,
                                                                microservice:'GEOLOCATION',
                                                                service:'IP', 
                                                                method:'GET',
                                                                data:{ip:'127.0.0.1'},
                                                                ip:'127.0.0.1',
                                                                user_agent:'*',
                                                                accept_language:'',
                                                                endpoint:'SERVER'
                                                            })
                                    .catch(error=>{return {http:error.http};});         
                if (result.http)
                    return [
                        /**@ts-ignore */
                        t.expect('Microservice Geolocation',    result.http)['toBe'](200),
                    ];
                else
                    return [
                        /**@ts-ignore */
                        t.expect('Latitude',    result.result?.latitude)['not.toBe'](null),
                        /**@ts-ignore */
                        t.expect('Longitude',   result.result?.longitude)['not.toBe'](null),
                        /**@ts-ignore */
                        t.expect('Latitude',    result.result?.latitude)['not.toBeUndefined'](),
                        /**@ts-ignore */
                        t.expect('Longitude',   result.result?.longitude)['not.toBeUndefined']()
                    ];
            }
        }).then(result=>resolve(result)));
    }),
    await t.describe('Integration test, server function worldcities random city called from BFF and from all apps', async ()=> {    
        return await new Promise(resolve=>
        t.it('should return values ', async () =>{
            const {default:worldcities} = await import('../apps/common/src/functions/common_worldcities_city_random.js');

            /**@type{server_db_table_App[]}*/
            const apps = ORM.db.App.get({app_id:0, resource_id:null}).result;
            
            for (const app of apps){ 
                const result = await worldcities({ app_id:app.id,
                                                        data:null,
                                                        user_agent:'*',
                                                        ip:'127.0.0.1',
                                                        host:'',
                                                        idToken:'', 
                                                        authorization:'',
                                                        locale:''})
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
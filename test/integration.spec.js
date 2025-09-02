/** 
 * Test integration
 * @module test/integration.spec
 */

/**
 * @import {test_spec_result, 
 *          server_db_table_App} from '../server/types.js'
 */
const {server} = await import('../server/server.js');
const {default:worldcities} = await import('../apps/common/src/functions/common_worldcities_city_random.js');
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
            const HOST = server.ORM.db.ConfigServer.get({app_id:0, data:{config_group:'SERVER', parameter:'HOST'}}).result;
            const PORT = server.ORM.UtilNumberValue(server.ORM.db.ConfigServer.get({app_id:0, data:{config_group:'SERVER',parameter:'HTTP_PORT'}}).result);

            return [
                /**@ts-ignore */
                t.expect('HOST',            HOST)['not.toBe'](null),
                /**@ts-ignore */
                t.expect('PORT',            PORT)['not.toBe'](null)
        ];
        }).then(result=>resolve(result)));
    }),
    await t.describe('Integration test, server function worldcities random city called from BFF and from all apps', async ()=> {    
        return await new Promise(resolve=>
        t.it('should return values ', async () =>{

            /**@type{server_db_table_App[]}*/
            const apps = server.ORM.db.App.get({app_id:0, resource_id:null}).result;
            
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
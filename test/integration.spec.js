/** 
 * Test integration
 * @module test/integration.spec
 */

/**
 * @import {server} from '../server/types.js'
 */
const {server} = await import('../server/server.js');
const {default:worldcities} = await import('../apps/common/src/functions/common_worldcities.js');
/**
 * @name test
 * @description Integration test multplie
 * @function
 * @param {import('./test.js')} t
 * @returns {Promise.<server['test']['spec_result']['detail']>}
 */
const test = async t =>
    [await t.describe('Integration test, setting DB cache', async ()=> {
        return await new Promise(resolve=>
        t.it('should return values when using ORM pattern for Config', async () =>{
            const HOST = server.ORM.db.OpenApi.getViewServers({app_id:0, data:{pathType:'APP'}}).result[0].variables.host.default;
            const PORT = server.ORM.UtilNumberValue(server.ORM.db.OpenApi.getViewServers({app_id:0, data:{pathType:'APP'}}).result[0].variables.port.default);

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

            /**@type{(server['ORM']['Object']['App'] & {Id:number})[]}*/
            const apps = server.ORM.db.App.get({app_id:0, resource_id:null}).result;
            
            for (const app of apps){ 
                const result = await worldcities({  app_id:app.Id,
                                                    data:{searchType:'RANDOM'},
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
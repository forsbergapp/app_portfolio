/** 
 * Test unit
 * @module server/db/db.spec
 */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import('../server.js');
/**
 * @name test
 * @description Unit test, test ORM post, update, get and delete
 *              should create a record, update the record, get correct value from updated record and delete the record
 * @function
 * @param {import('../../test/test.js')} t
 * @returns {Promise.<server['test']['spec_result']['detail']>}
 */
const test = async t =>
    [await t.describe('Unit test, test ORM post, update, get and delete', async ()=> {
        return await new Promise(resolve=>
        t.it('should create a record, update the record, get correct value from updated record and delete the record', async () =>{
            /**@type{server['ORM']['Object']['App']} */
            const app_data = {  Name:'ORM',
                                Path:'/apps/orm/public',
                                Logo:'/images/logo.png',
                                Js:'/js/app.js',
                                Css:'/css/app.css',
                                CssReport:'',
                                Favicon32x32:'/images/favicon-32x32.png',
                                Favicon192x192:'/images/favicon-192x192.png',
                                TextEdit:'1',
                                Copyright:'©',
                                LinkTitle:'',
                                LinkUrl:'',
                                Status:'ONLINE'};
            //test post, insert value 1
            const result_post = await server.ORM.db.App.post(0, app_data);
            //test update, update value
            app_data.Name='THE ORM';

            const result_update = await server.ORM.db.App.update({app_id:0, 
                                                    resource_id:result_post.result.InsertId, 
                                                    /**@ts-ignore} */
                                                    data:app_data});
            //test get from cache, get updated value
            const result_get = server.ORM.db.App.get({app_id:0,  resource_id:result_post.result.InsertId});
            //test delete, delete record
            const result_delete = await server.ORM.db.App.deleteRecord(0, result_post.result.InsertId);

                    
            return [
                    //expect one inserted record
                    /**@ts-ignore */
                    t.expect('insert affectedRows',  result_post.result.AffectedRows).toBe(1),
                    //expect id to be returned
                    /**@ts-ignore */
                    t.expect('insertid',             result_post.result.InsertId)['not.toBeUndefined'](),
                    //expect one updated record
                    /**@ts-ignore */
                    t.expect('update affectedRows',  result_update.result.AffectedRows).toBe(1),
                    //expect updated record to have the correct updated value
                    /**@ts-ignore */
                    t.expect('name',                 result_get.result[0].Name).toBe('THE ORM'),
                    //expect one deleted record
                    /**@ts-ignore */
                    t.expect('delete affectedRows',  result_delete.result.AffectedRows).toBe(1)
            ];
        }).then(result=>resolve(result)));
    })];

export default test;
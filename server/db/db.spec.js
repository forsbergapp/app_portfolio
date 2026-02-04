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
            /**@ts-ignore @type{server['ORM']['Object']['App']} */
            const app_data = {  Name:'ORM',
                                Path:'/apps/orm/public',
                                Logo:'<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\"><path fill=\"rgb(81,171,255)\" d=\"M10,2H3C2.4,2,2,2.4,2,3v7c0,0.6,0.4,1,1,1h7c0.6,0,1-0.4,1-1V3C11,2.4,10.6,2,10,2z M10,13H3c-0.6,0-1,0.4-1,1v7c0,0.6,0.4,1,1,1h7c0.6,0,1-0.4,1-1v-7C11,13.4,10.6,13,10,13z M21,2h-7c-0.6,0-1,0.4-1,1v7c0,0.6,0.4,1,1,1h7c0.6,0,1-0.4,1-1V3C22,2.4,21.6,2,21,2z M21,13h-7c-0.6,0-1,0.4-1,1v7c0,0.6,0.4,1,1,1h7c0.6,0,1-0.4,1-1v-7C22,13.4,21.6,13,21,13z\"/></svg>',
                                Js:'/js/app.js',
                                Css:'/css/app.css',
                                CssReport:'',
                                TextEdit:'1',
                                Copyright:'©',
                                LinkTitle:'',
                                LinkUrl:'',
                                Status:'ONLINE'};
            //test post, insert value 1
            const result_post = await server.ORM.db.App.post(0, app_data);
            //test update, update value
            app_data.Name='THE ORM';

            /**
             * @type {{ name:server['ORM']['Object']['App']['Name'],
             *          path:server['ORM']['Object']['App']['Path'],
             *          logo:server['ORM']['Object']['App']['Logo'],
             *          js:server['ORM']['Object']['App']['Js'],
             *          css:server['ORM']['Object']['App']['Css'],
             *          css_report:server['ORM']['Object']['App']['CssReport'],
             *          text_edit:server['ORM']['Object']['App']['TextEdit'],
             *          copyright:server['ORM']['Object']['App']['Copyright'],
             *          link_title:server['ORM']['Object']['App']['LinkTitle'],
             *          link_url:server['ORM']['Object']['App']['LinkUrl'],
             *          status:server['ORM']['Object']['App']['Status']}}
             */
            const data_update = {   name:app_data.Name,
                                    path:app_data.Path,
                                    logo:app_data.Logo,
                                    js:app_data.Js,
                                    css:app_data.Css,
                                    css_report:app_data.CssReport,
                                    text_edit:app_data.TextEdit,
                                    copyright:app_data.Copyright,
                                    link_title:app_data.LinkTitle,
                                    link_url:app_data.LinkUrl,
                                    status:app_data.Status};
            const result_update = await server.ORM.db.App.update({app_id:0, 
                                                    resource_id:result_post.result.InsertId, 
                                                    data:data_update});
            //test get from cache, get updated value
            const result_get = server.ORM.db.App.get({app_id:0,  resource_id:result_post.result.InsertId});
            //test delete, delete record
            const result_delete = await server.ORM.db.App.deleteRecord(0, result_post.result.InsertId);

                    
            return [
                    //expect one inserted record
                    t.expect('insert affectedRows',  result_post.result.AffectedRows).toBe(1),
                    //expect id to be returned
                    t.expect('insertid',             result_post.result.InsertId)['not.toBeUndefined'](),
                    //expect one updated record
                    t.expect('update affectedRows',  result_update.result.AffectedRows).toBe(1),
                    //expect updated record to have the correct updated value
                    t.expect('name',                 result_get.result[0].Name).toBe('THE ORM'),
                    //expect one deleted record
                    t.expect('delete affectedRows',  result_delete.result.AffectedRows).toBe(1)
            ];
        }).then(result=>resolve(result)));
    })];

export default test;
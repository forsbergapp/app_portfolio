/** 
 * Test unit
 * @module server/db/db.spec
 */
/**
 * @name describe
 * @description describe: Unit test, test ORM post, update, get and delete
 *              should create a record, update the record, get correct value from updated record and delete the record
 * @function
 * @returns {void}
 */
describe('Unit test, test ORM post, update, get and delete', ()=> {
    it('should create a record, update the record, get correct value from updated record and delete the record', async () =>{
        /**@type{import('./App.js')} */
        const App = await import(`file://${process.cwd()}/server/db/App.js`);
        
        const app_data = {  name:'ORM',
                            subdomain:'orm',
                            path:'/apps/orm/public',
                            logo:'/images/logo.png',
                            showparam:1,
                            manifest:'/common/manifest.json',
                            js:'/js/app.js',
                            css:'/css/app.css',css_report:'',
                            favicon_32x32:'/images/favicon-32x32.png',
                            favicon_192x192:'/images/favicon-192x192.png',
                            text_edit:'1',
                            copyright:'©',
                            email:'',
                            link_title:'',
                            link_url:'',
                            status:'ONLINE'};
        //test post, insert value 1
        const result_post = await App.post(0, app_data);
        //test update, update value
        app_data.name='THE ORM';

        const result_update = await App.update({app_id:0, 
                                                resource_id:result_post.result.insertId, 
                                                /**@ts-ignore} */
                                                data:app_data});
        //test get from cache, get updated value
        const result_get = App.get({app_id:0,  resource_id:result_post.result.insertId});
        //test delete, delete record
        const result_delete = await App.deleteRecord(0, result_post.result.insertId);
               
        
        console.log('Unit test DB POST:', result_post);
        console.log('Unit test DB UPDATE:', result_update);
        console.log('Unit test DB DELETE:', result_delete);
        //expect one inserted record
        /**@ts-ignore */
        expect(result_post.result.affectedRows).toBe(1);
        //expect id to be returned
        /**@ts-ignore */
        expect(result_post.result.insertId).not.toBeUndefined();
        //expect one updated record
        /**@ts-ignore */
        expect(result_update.result.affectedRows).toBe(1);
        //expect updated record to have the correct updated value
        /**@ts-ignore */
        expect(result_get.result[0].name).toBe('THE ORM');
        //expect one deleted record
        /**@ts-ignore */
        expect(result_delete.result.affectedRows).toBe(1);
    });
});
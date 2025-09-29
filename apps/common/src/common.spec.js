/** 
 * @module apps/common/src/common.spec 
 */

/**
 * @import {test_spec_result} from '../../../server/types.js'
 */

let test_running = false;
const app_common = await import('./common.js');
/**
 * @name test
 * @description describe: Spy test, commonApp as called from bff, will return expect false if test is already running
 *              it: should read IamAppIdToken at least 1 time each when requesting app
 *              beforeAll:  Modifies Array.prototype.filter and reviews what filter function is doing and if used with APP_TOKEN
 *              afterAll:   restores Array.prototype.filter
 * @function
 * @param {import('../../../test/test.js')} t
 * @returns {Promise.<test_spec_result['detail']>}
 */
const test = async t =>
[await t.describe('Spy test, commonApp as called from bff', async ()=> {
    //check if test is already running
    if (test_running)
        return [
                /**@ts-ignore */
                t.expect('Test is running',    test_running).toBe(false)
            ];
    else{
        test_running = true;
        const spyId = Date.now();
        /**@type{{id:number, caller?:string, object:string}[]} */
        const spyObject = [];
        //Save original filter function
        const ORIGINAL_FILTER = Array.prototype.filter;
        /**
         * @name beforeAll
         * @description helper beforeAll pattern that modifies Array.filter function checking what object is used
         * @function
         * @returns  {void}
         */
        const beforeAll = ()=>{
            /**
             * Custom filter function to count and log Error().stack when object is read 
             * @param {(value: any, index: number, array: any[])=>any} callBack
             * @param {*} thisArg
             */
            Array.prototype.filter = function (callBack, thisArg){
                const caller = (new Error().stack?.split('\n'))?.map(row=>row.trimStart().split(' ')[1])[2];
                if (spyId>0 && ORIGINAL_FILTER.call(this, callBack, thisArg)[0]?.name && caller=='ORM_class.getObjectRecord')
                    spyObject.push({id:spyId, caller:caller, object:ORIGINAL_FILTER.call(this, callBack, thisArg)[0]?.name});
                return ORIGINAL_FILTER.call(this, callBack, thisArg);  
            };
            
        };
        /**
         * @name afterAll
         * @description helper afterAll pattern that restores Array.filter function 
         * @function
         * @returns  {void}
         */
        const afterAll = ()=>{
            Array.prototype.filter = ORIGINAL_FILTER;
        };
    
        beforeAll();
        return await new Promise(resolve=>
        t.it('should read IamAppIdToken at least 1 time when requesting app', async () =>{
            //Solution to test if DB object is fetching the IamAppIdToken record is to create a custom filter function 
            //that is available in global scope in NodeJS since DB object uses Object.seal() so no getter can be added 
            //and module is using closure pattern.
                 
            /**
             * @description 
             * @type{{  app_id:number,
             *          ip:string,
             *          host:string,
             *          user_agent:string,
             *          accept_language:string,}}
             */
            const parameters = {
                app_id:0,
                ip:'::1',
                host:'localhost',
                user_agent:'BDD test',
                accept_language:'*'};
            await app_common.commonApp(parameters);
            
            test_running = false;
            return [
                /**@ts-ignore */
                t.expect(   'Count App',    
                            spyObject.filter(row=>row.id == spyId && row.object=='App').length).toBeGreaterThan(0),
                /**@ts-ignore */
                t.expect(   'Count ConfigServer',    
                            spyObject.filter(row=>row.id == spyId && row.object=='ConfigServer').length).toBeGreaterThan(0),
                /**@ts-ignore */
                t.expect(   'Count IamUser',    
                            spyObject.filter(row=>row.id == spyId && row.object=='IamUser').length).toBeGreaterThan(0)
            ];
        })
        .then(result=>{
            afterAll();
            resolve(result);
        })
        .catch(error=>{
            afterAll();
            test_running = false;
            return [
                /**@ts-ignore */
                t.expect('Error',    typeof error == 'string'?error:JSON.stringify(error.message ?? error)).toBe(null)
            ];
        }));
    }
})];
export default test;
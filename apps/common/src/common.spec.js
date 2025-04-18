/** 
 * @module apps/common/src/common.spec 
 */
let filterCount_AppSecret = 0;
let filterCount_IamAppIdToken = 0;
//Save original filter function
const ORIGINAL_FILTER = Array.prototype.filter;
/**
 * @name describe
 * @description describe: Spy test, commonApp as called from bff
 *              it: should call AppSecret.get and read AppSecret and IamAppIdToken at least 1 time each when requesting app
 *              beforeAll:  Modifies Array.prototype.filter and reviews what filter function is doing and if used with AppSecret and APP_TOKEN
 *              afterAll:   restores Array.prototype.filter
 * @function
 * @returns {void}
 */
describe('Spy test, commonApp as called from bff', ()=> {   
    beforeAll(()=>{
        /**
         * Custom filter function to count and log Error().stack when AppSecret is read 
         * @param {(value: any, index: number, array: any[])=>any} callBack
         * @param {*} thisArg
         */
        Array.prototype.filter = function (callBack, thisArg){
            if (ORIGINAL_FILTER.call(this, callBack, thisArg)[0]?.name=='AppSecret'){
                filterCount_AppSecret++;
                //Review Error().stack if necessary
                console.log('Spy test commonApp reading AppSecret using custom filter function');
            }
            if (ORIGINAL_FILTER.call(this, callBack, thisArg)[0]?.name=='IamAppIdToken'){
                filterCount_IamAppIdToken++;
                //Review Error().stack if necessary
                console.log('Spy test commonApp reading IamAppIdToken using custom filter function');
            }
            return ORIGINAL_FILTER.call(this, callBack, thisArg);  
        };
        
    });
    it('should call AppSecret.get and read AppSecret and IamAppIdToken at least 1 time each when requesting app', async () =>{
        //Solution to test if DB object is fetching the AppSecret or IamAppIdToken record is to create a custom filter function 
        //that is available in global scope in NodeJS since DB object uses Object.seal() so no getter can be added 
        //and module is using closure pattern.
        
        /**@type{import('./common.js')} */
        const app_common = await import(`file://${process.cwd()}/apps/common/src/common.js`);
             
        /**
         * @type{{  app_id:number,
         *          ip:string,
         *          host:string,
         *          user_agent:string,
         *          accept_language:string,
         *          url:string,
         *          query:*}}
         */
        const parameters = {
            app_id:app_common.commonAppHost('localhost') ?? 0,
            ip:'::1',
            host:'localhost',
            user_agent:'Jasmine test',
            accept_language:'*',
            url:'/',
            query:null};
        await app_common.commonApp(parameters);
        
        expect (filterCount_AppSecret).toBeGreaterThan(0);
        expect (filterCount_IamAppIdToken).toBeGreaterThan(0);
    });
    afterAll(()=>{
        Array.prototype.filter = ORIGINAL_FILTER;
    });
});
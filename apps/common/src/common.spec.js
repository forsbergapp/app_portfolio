/** 
 * Test
 * @module apps/common/src/common.spec 
 */
let filterCount_APP_SECRET = 0;
let filterCount_IAM_APP_TOKEN = 0;
//Save original filter function
const ORIGINAL_FILTER = Array.prototype.filter;

describe('Spy test, commonApp as called from bff', ()=> {   
    beforeAll(()=>{
        /**
         * Custom filter function to count and log Error().stack when APP_SECRET is read 
         * @param {(value: any, index: number, array: any[])=>any} callBack
         * @param {*} thisArg
         */
        Array.prototype.filter = function (callBack, thisArg){
            if (ORIGINAL_FILTER.call(this, callBack, thisArg)[0]?.NAME=='APP_SECRET'){
                filterCount_APP_SECRET++;
                //Review Error().stack if necessary
                console.log('Spy test commonApp reading APP_SECRET using custom filter function');
            }
            if (ORIGINAL_FILTER.call(this, callBack, thisArg)[0]?.NAME=='IAM_APP_TOKEN'){
                filterCount_IAM_APP_TOKEN++;
                //Review Error().stack if necessary
                console.log('Spy test commonApp reading IAM_APP_TOKEN using custom filter function');
            }
            return ORIGINAL_FILTER.call(this, callBack, thisArg);  
        };
        
    });
    it('should call fileModelAppSecret.get and read APP_SECRET and IAM_APP_TOKEN at least 1 time each when requesting app', async () =>{
        //Solution to test if FILE_DB object is fetching the APP_SECRET or IAM_APP_TOKEN record is to create a custom filter function 
        //that is available in global scope in NodeJS since FILE_DB object uses Object.seal() so no getter can be added 
        //and module is using closure pattern.
        
        /**@type{import('./common.js')} */
        const app_common = await import(`file://${process.cwd()}/apps/common/src/common.js`);
      
        //expected function calls:
        // app_common.commonApp() => 
        //  app_common.commonAppStart() => fileModelAppSecret.get   1 time =>
        //      file.fileDBGet() (APP_SECRET) => file.fileCache() => file.fileRecord() using filter function to read object file.FILE_DB
        //
        //  app_common.commonComponentCreate() => 
        //        iam_service.iamAuthorizeIdToken => fileModelAppSecret.get   2 times =>
        //          file.fileDBGet() (APP_SECRET) => file.fileCache() => file.fileRecord() using filter function to read object file.FILE_DB
        //        app_common.commonAppStart() => fileModelAppSecret.get   1 time =>
        //          file.fileDBGet() (APP_SECRET) => file.fileCache() => file.fileRecord() using filter function to read object file.FILE_DB
        

        /**
         * @type{{ip:string,
         *          host:string,
         *          user_agent:string,
         *          accept_language:string,
         *          url:string,
         *          query:*,
         *          res:server_server_res|null}}
         */
        const parameters = {ip:'::1',
              host:'localhost',
              user_agent:'Jasmine test',
              accept_language:'*',
              url:'/',
              query:null,
              /**@ts-ignore */
              res:{}};
        await app_common.commonApp(parameters);
        
        expect (filterCount_APP_SECRET).toBeGreaterThan(0);
        expect (filterCount_IAM_APP_TOKEN).toBeGreaterThan(0);
    });
    afterAll(()=>{
        Array.prototype.filter = ORIGINAL_FILTER;
    });
});
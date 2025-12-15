/** 
 * @module test/test.js
 */
/**
 * @import {server} from '../server/types.js'
 */
const {server} = await import('../server/server.js');
/**
 * @name describe
 * @description  description function for Behaviour Driven Development (BDD) test pattern
 * @function
 * @param {string} description
 * @param {function} fn
 * @returns {Promise.<{ describe:string,
 *                      it:{should:string,
 *                          expect:server['test']['expect_result'][]}}>}
 */
const describe = async (description, fn) =>{
    return {
        describe:description,
        it: await fn()
    };
    
};
/**
 * @name it
 * @description it function for Behaviour Driven Development (BDD) test pattern
 * @function
 * @param {string} itDescription
 * @param {function} fn
 * @param {number|null} timeout
 * @returns {Promise.<{ should:string,
*                       expect:Promise.<server['test']['expect_result'][]>}>}
*/
const it = async (itDescription, fn, timeout=null) =>{
   return {
       should:itDescription,
       expect: await Promise.race([ fn(), 
                                    new Promise((resolve, reject)=>
                                        setTimeout(()=>reject('TIMEOUT'), timeout||5000))
                                ])
                    .catch(error=>[expect('Error', error).toBe(null)])
                                
   };
   
};
/**
 * @name expect
 * @description expect class with methods for Behaviour Driven Development (BDD) test pattern
 * @class
 */
class Expect {
    /**
     * @param {string} desc
     * @param {*} actual 
     * @constructor
     */
    constructor(desc, actual){
        this.desc = desc;
        this.actual = actual;
    }
    /**
     * @name result
     * @description static method that returns expect result object
     * @method
     * @param {string} desc
     * @param {*} actual
     * @param {*} expect
     * @param {*} expect_result
     * @returns {server['test']['expect_result']}
     */
    static result = (desc, actual, expect, expect_result) => {
        return {
            //method/function name that calls this function
            method: (new Error().stack?.split('\n')[2].split(' ')[5])?.replace('Expect.',''),
            desc:desc,
            actual: actual,
            expected:expect,
            result:expect_result

        };
    };
    /**
     * @name toBe
     * @description toBe method simple comparison without array, object, function 
     *              or other complex data structure support
	 * @method
     * @param {*} expected
     * @returns {server['test']['expect_result']}
     */
    toBe = expected => Expect.result(this.desc, this.actual, expected, this.actual == expected);

    /**
     * @name not.toBe
     * @description not.toBe method 
	 * @method
     * @param {*} expected
     * @returns {server['test']['expect_result']}
     */
    'not.toBe' = expected => Expect.result(this.desc, this.actual, expected, this.actual != expected);
    
    /**
     * @name toBeUndefined
     * @description toBeUndefined method
	 * @method
     * @returns {server['test']['expect_result']}
     */
    toBeUndefined = () => Expect.result(this.desc, this.actual, undefined, this.actual == undefined);

    /**
     * @name not.toBeUndefined
     * @description not.toBeUndefined method 
	 * @method
     * @returns {server['test']['expect_result']}
     */
    'not.toBeUndefined' = () => Expect.result(this.desc, this.actual, '!=undefined', this.actual != undefined);

    /**
     * @name toBeLessThan
     * @description toBeLessThan method
     * @param {number} expected
	 * @method
     * @returns {server['test']['expect_result']}
     */
    toBeLessThan = expected => Expect.result(this.desc, this.actual, expected, this.actual < expected);

    /**
     * @name toBeGreaterThan
     * @description toBeGreaterThan method
     * @param {number} expected
	 * @method
     * @returns {server['test']['expect_result']}
     */
    toBeGreaterThan = expected => Expect.result(this.desc, this.actual, expected, this.actual > expected);
    
}
/**
 * @name
 * @description expect function for Behaviour Driven Development (BDD) test pattern
 *              calls class expect with methods available:
 *              toBe()
 *              'not.toBe'
 *              toBeUndefined()
 *              'not.toBeUndefined()'
 *              toBeLessThan()
 *              toBeGreaterThan()
 * @function
 * @param {string} desc
 * @param {*} actual
 */
const expect = (desc,actual) => new Expect(desc, actual);

/**
 * @description Server request to be used in tests
 *              with specific test request parameters
 * @param {{url:string}} parameters 
 * @returns {Promise <{ result:*, 
 *                      reqSize:number, 
 *                      resSize:number, 
 *                      status:server['server']['res']['statusCode']|undefined}>}
 */
const serverRequest = async parameters =>{
    const protocol = await import('node:http')
    return new Promise((resolve, reject)=>{
        /**
         * @param {import('node:http').IncomingMessage} res
         * @returns {void}
         */
        const response = res =>{
            let responseBody = '';
            res.setEncoding('utf8');
            res.on('data', (/**@type{*}*/chunk) =>{
                responseBody += chunk;
            });
            res.on('end', ()=>{
                resolve({result:responseBody,
                        reqSize: parameters.url.length,
                        resSize: responseBody.length,
                        status:res.statusCode})
            });
        };
        /**@type{Object.<string,string>} */
        const OpenApiKey = JSON.parse(server.ORM.OpenApiConfig.IAM_AUTHENTICATE_REQUEST_KEY_VALUES_APP.default);
        /**@type{import('node:http').RequestOptions}*/    
        const options = {
                        family: 4,
                        method: 'GET',
                        headers:{
                                'Accept-Language':  '*',
                                'Connection':   	'close',
                                //OWASP 3.2.1 requirement
                                'sec-fetch-dest':   OpenApiKey['sec-fetch-dest']??null,
                                'sec-fetch-mode':   OpenApiKey['sec-fetch-mode']??null,
                                'sec-fetch-site':   OpenApiKey['sec-fetch-site']??null,
                                'User-Agent':		server.UtilAppFilename(import.meta.url)
                                },
                        };
        const request =  protocol.request(new URL(parameters.url), options, response);
        request.on('error', error => {
                    reject({   
                                http:500,
                                code:'',
                                text:error,
                                developerText:'',
                                moreInfo:null,
                                type:'JSON'
                    })
        });
        request.end();
    })
}

export {describe, it, expect, serverRequest};
/** 
 * @module test/test.js
 */
/**
 * @import {test_expect_result} from '../server/types.js'
 */
/**
 * @name describe
 * @description  description function for Behaviour Driven Development (BDD) test pattern
 * @function
 * @param {string} description
 * @param {function} fn
 * @returns {Promise.<{ describe:string,
 *                      it:{should:string,
 *                          expect:test_expect_result[]}}>}
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
*                       expect:Promise.<test_expect_result[]>}>}
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
     * @returns {test_expect_result}
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
     * @returns {test_expect_result}
     */
    toBe = expected => Expect.result(this.desc, this.actual, expected, this.actual == expected);

    /**
     * @name not.toBe
     * @description not.toBe method 
	 * @method
     * @param {*} expected
     * @returns {test_expect_result}
     */
    'not.toBe' = expected => Expect.result(this.desc, this.actual, expected, this.actual != expected);
    
    /**
     * @name toBeUndefined
     * @description toBeUndefined method
	 * @method
     * @returns {test_expect_result}
     */
    toBeUndefined = () => Expect.result(this.desc, this.actual, undefined, this.actual == undefined);

    /**
     * @name not.toBeUndefined
     * @description not.toBeUndefined method 
	 * @method
     * @returns {test_expect_result}
     */
    'not.toBeUndefined' = () => Expect.result(this.desc, this.actual, '!=undefined', this.actual != undefined);

    /**
     * @name toBeLessThan
     * @description toBeLessThan method
     * @param {number} expected
	 * @method
     * @returns {test_expect_result}
     */
    toBeLessThan = expected => Expect.result(this.desc, this.actual, expected, this.actual < expected);

    /**
     * @name toBeGreaterThan
     * @description toBeGreaterThan method
     * @param {number} expected
	 * @method
     * @returns {test_expect_result}
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

export {describe, it, expect};
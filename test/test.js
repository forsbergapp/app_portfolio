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
 *                      result:*}>}
 */
const describe = async (description, fn) =>{
    return {
        describe:description,
        result: fn()
    };
    
};
/**
 * @name it
 * @description it function for Behaviour Driven Development (BDD) test pattern
 * @function
 * @param {string} itDescription
 * @param {function} fn
 * @param {number} timeout
 * @returns {Promise.<{ it:string,
*                      result:*}>}
*/
const it = async (itDescription, fn, timeout) =>{
   return {
       it:itDescription,
       result: Promise.race([   fn, 
                                new Promise((resolve, reject)=>
                                    setTimeout(()=>reject('TIMEOUT'), timeout||5000))
                            ])
                                
   };
   
};
/**
 * @name customExpect
 * @description expect class with methods for Behaviour Driven Development (BDD) test pattern
 * @class
 */
class customExpect {
    /**
     * @param {*} actual 
     * @constructor
     */
    constructor(actual){
        this.actual = actual;
    }
    /**
     * @name result
     * @description static method that returns expect result object
     * @method
     * @param {*} actual
     * @param {*} expect
     * @param {*} expect_result
     * @returns {test_expect_result}
     */
    static result = (actual, expect, expect_result) => {
        return {
            //method/function name that calls this function
            method: new Error().stack?.split('\n')[2].split(' ')[5],
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
    toBe = expected => customExpect.result(this.actual, expected, this.actual == expected);

    /**
     * @name not.toBe
     * @description not.toBe method 
	 * @method
     * @param {*} expected
     * @returns {test_expect_result}
     */
    'not.toBe' = expected => customExpect.result(this.actual, expected, !this.toBe(expected));
    
    /**
     * @name toBeUndefined
     * @description toBeUndefined method
	 * @method
     * @returns {test_expect_result}
     */
    toBeUndefined = () => customExpect.result(this.actual, undefined, this.actual == undefined);

    /**
     * @name not.toBeUndefined
     * @description not.toBeUndefined method 
	 * @method
     * @returns {test_expect_result}
     */
    'not.toBeUndefined' = () => customExpect.result(this.actual, null, !this.toBeUndefined());

    /**
     * @name toBeLessThan
     * @description toBeLessThan method
     * @param {number} expected
	 * @method
     * @returns {test_expect_result}
     */
    toBeLessThan = expected => customExpect.result(this.actual, expected, this.actual < expected);

    /**
     * @name toBeGreaterThan
     * @description toBeGreaterThan method
     * @param {number} expected
	 * @method
     * @returns {test_expect_result}
     */
    toBeGreaterThan = expected => customExpect.result(this.actual, expected, this.actual > expected);
    
}
/**
 * @name
 * @description expect function for Behaviour Driven Development (BDD) test pattern
 *              calls class customExpect with methods available:
 *              toBe()
 *              'not.toBe'
 *              toBeUndefined()
 *              'not.toBeUndefined()'
 *              toBeLessThan()
 *              toBeGreaterThan()
 * @function
 * @param {*} actual
 */
const expect = actual => new customExpect(actual);

export {describe, it, expect};
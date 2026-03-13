/** 
 * @module apps/app1/types
 */
/**
 * @name report_data
 * @description report_data
 * @typescript
 */
type report_data = {
        title:string,
        date:string,
        summary: [string, string|number|null, string][], 
        rt_ranges:[string,string,number,string][], //[start interval [ms],end interval [ms], count, rate %]
        rt_percent:[string,number][]//[percent %, time ms]
}
/**
 * @name test_function_result
 * @description test_function_result
 * @typescript
 */
type test_function_result = {
        result:string,
        reqSize:number,
        resSize:number,
        status:number
}
export{report_data, test_function_result};
/**
 * @typedef {{  title:string,
*              date:string,
*              summary: [string, string|number|null, string][], 
*              rt_ranges:[string,string,number,string][], //[start interval [ms],end interval [ms], count, rate %]
*              rt_percent:[string,number][]}} report_data  //[percent %, time ms]
*/
/**
* @typedef {{ result:string,
*             reqSize:number,
*             resSize:number,
*             status:number}} test_function_result
*/
export{};
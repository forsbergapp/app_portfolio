/**
 * @module apps/common/src/functions/common_worldcities
*/

/**
 * @import {server_server_response,commonWorldCitiesCity} from '../../../../server/types.js'
 */
const {getData} = await import('./common_data.js');
/**
 * @name appFunction
 * @description Get cities for given country from worldcities db
 *              Returns records in base64 format to avoid records limit
 *              Data key contains:
 *              commonWorldCitiesCity[]
 * @function
 * @param {{app_id:number,
 *          data:{country:string},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:{data:string}[]}>}
 */
const appFunction = async parameters =>{

    return {result:[{data:  Buffer.from (JSON.stringify(
                                    getData('WORLDCITIES')
                                    .filter((/**@type{commonWorldCitiesCity}*/cities)=>
                                        cities.iso2 == parameters.data.country)
                                    )
                            ).toString('base64')}], type:'JSON'};
    
};
export default appFunction;
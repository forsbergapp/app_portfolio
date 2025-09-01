/**
 * @module apps/common/src/functions/common_worldcities
*/

/**
 * @import {server_db_document_ConfigServer, server_server_response,commonWorldCitiesCity} from '../../../../server/types.js'
 */

const {getData} = await import('./common_data.js');
const {server} = await import('../../../../server/server.js');
/**
 * @name appFunction
 * @description Get random city from worldcities db
 * @function
 * @param {{app_id:number,
 *          data:null,
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string, 
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:commonWorldCitiesCity}>}
 */
const appFunction = async parameters =>{
    const APP_DEFAULT_RANDOM_COUNTRY = server.ORM.db.ConfigServer.get({app_id:parameters.app_id, data:{config_group:'SERVICE_APP'}}).result
                                        .filter((/**@type{server_db_document_ConfigServer['SERVICE_APP']}*/parameter)=>
                                            'APP_DEFAULT_RANDOM_COUNTRY' in parameter)[0].APP_DEFAULT_RANDOM_COUNTRY;
    const cities = getData('WORLDCITIES')
    .filter((/**@type{commonWorldCitiesCity}*/row)=> 
        row.iso2 == (APP_DEFAULT_RANDOM_COUNTRY==''?row.iso2:APP_DEFAULT_RANDOM_COUNTRY)
    );
    return {result: cities[Math.floor(Math.random() * (cities.length - 1))], type:'JSON'};
    
};
export default appFunction;
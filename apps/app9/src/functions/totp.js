/**
 * @module apps/app9/src/functions/totp
 */
/**
 * @import {server_server_response} from '../../../../server/types.js'
 */
const {server} = await import('../../../../server/server.js');
/**
 * @name getTOTP
 * @description Get TOTP
 * @function
 * @param {{app_id:number,
*          data:{  otp_key:string},
*          user_agent:string,
*          ip:string,
*          host:string,
*          idToken:string,
*          authorization:string,
*          locale:string}} parameters
* @returns {Promise.<server_server_response & {result?:{totp_value?:string, expire?:number}|null[]}>}
*/
const getTOTP = async parameters =>{

   const result_totp = await server.security.securityTOTPGenerate(parameters.data.otp_key);
   return {result: [{totp_value:result_totp?.totp_value,
                    expire:result_totp?.expire
                    }],
            type:'JSON'};
};
export default getTOTP;
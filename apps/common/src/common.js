/** @module apps/common/src/common */

/**@type{import('./common.service')} */
const service = await import(`file://${process.cwd()}/apps/common/src/common.service.js`);

/**
 * Router function - App: get app asset, common asset, app info page, app report, app module or app
 * @param {{ip:string,
 *          host:string,
 *          user_agent:string,
 *          accept_language:string,
 *          url:string,
 *          query:*,
 *          res:import('../../../server/types.js').server_server_res|null}} parameters
 */
const commonApp = async parameters =>   service.commonApp({ ip:parameters.ip, 
                                                            host:parameters.host, 
                                                            user_agent:parameters.user_agent, 
                                                            accept_language:parameters.accept_language,
                                                            url:parameters.url,
                                                            reportid:parameters.query?parameters.query.get('reportid'):null,
                                                            res:parameters.res
                                                        });
/**
 * Router function - run fcuntion
 * @param {{app_id:number,
 *          resource_id:string,
 *          data: *,
 *          user_agent:string,
 *          ip:string,
 *          locale:string,
 *          res:import('../../../server/types.js').server_server_res|null}} parameters
 */
 const commonFunctionRun = async parameters => service.commonFunctionRun({  app_id:parameters.app_id, 
                                                                            resource_id:parameters.resource_id, 
                                                                            data:parameters.data, 
                                                                            user_agent:parameters.user_agent, 
                                                                            ip:parameters.ip, 
                                                                            locale:parameters.locale, 
                                                                            res:parameters.res});

export {commonApp, commonFunctionRun};
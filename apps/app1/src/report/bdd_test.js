/**
 * Behaviour driven development test
 * Runs in report queue where progress is updated
 * 
 * Description
 * For each spec file defined in /test/specrunner.json
 *  MASTER
 *      type
 *      description
 *      path
 *      result
 *  DETAIL
 *      test:
 *      method          desc        actual      expected        result
 * 
 *      test (if many describe() and it() in same spec file):
 *      method          desc        actual      expected        result
 * @module apps/app1/src/report/bdd_test
 */
/**
 * @import {server_apps_module_metadata} from '../../../../server/types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{title:String, date:string}} props
 */
const template = props => ` <div id='report'>
                                <div id='report_title'>${props.title}</div>
                                <div id='report_date'>${props.date}</div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{app_id:number,
 *          queue_parameters:{
 *                              appModuleQueueId:number|null,
 *                              app_id:number,
 *                              mode:'REPORT'|'TEST'
 * 		    }}} props
 * @returns {Promise.<string>}
 */
const component = async props => {
    /**@type{import('../../../../server/db/AppModuleQueue.js')} */
    const AppModuleQueue = await import(`file://${process.cwd()}/server/db/AppModuleQueue.js`);
    /**@type{import('../../../common/src/common.js')} */
    const {commonRegistryAppModule} = await import(`file://${process.cwd()}/apps/common/src/common.js`);
    /**@type{import('../../../../server/db/Config.js')} */
    const Config = await import(`file://${process.cwd()}/server/db/Config.js`);
    
    const t = await import(`file://${process.cwd()}/test/test.js`);
    const params = Config.get({app_id:props.app_id,data:{object:'ConfigServer',config_group:'SERVICE_TEST'}});
    
    if (props.queue_parameters.appModuleQueueId)
        AppModuleQueue.update(props.app_id, props.queue_parameters.appModuleQueueId, {progress:(1 / 1)});

    const report = {title:commonRegistryAppModule(props.app_id, {type:'REPORT', name:'BDD_TEST', role:'ADMIN'}).common_name,
                    date:Date()};
    return template(report);
    
};
/**@type{server_apps_module_metadata[]}*/
const metadata = [{param:{name:'mode',text:'Mode', default:'REPORT'}}];
export {metadata};
export default component;
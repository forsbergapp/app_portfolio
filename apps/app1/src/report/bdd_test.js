/**
 * Behaviour driven development test
 * Runs in report queue where progress is updated
 * 
 * Description
 * For each spec file defined in /test/specrunner.json
 *  type
 *  path
 *  result
 *  DETAIL
 *      test:
 *      method          desc        actual      expected        result
 * 
 *      test (if many describe() and it() in same spec file):
 *      method          desc        actual      expected        result
 * @module apps/app1/src/report/bdd_test
 */
/**
 * @import {server_apps_module_metadata, server_db_config_server_service_test,
 *          test_specrunner, test_spec_result} from '../../../../server/types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{title:string, 
 *          date:string,
 *          specs:test_spec_result[]}} props
 */
const template = props => ` <div id='report'>
                                <div id='report_title'>${props.title}</div>
                                <div id='report_date'>${props.date}</div>
                                ${props.specs.map(spec=>
                                    `<div class='report_row report_row_2col report_row_title'>
                                       <div class='report_col1'>Type</div>
                                       <div class='report_col2'>${spec.type}</div>
                                    </div>
                                    <div class='report_row report_row_2col report_row_title'>
                                       <div class='report_col1'>Path</div>
                                       <div class='report_col2'>${spec.path}</div>
                                    </div>
                                    <div class='report_row report_row_2col report_row_title'>
                                       <div class='report_col1'>Result</div>
                                       <div class='report_col2'>${spec.result}</div>
                                    </div>
                                    ${spec.detail.map(detail=>
                                        `<div class='report_row report_row_2col'>
                                            <div class='report_col1'>Test<= </div>
                                            <div class='report_col2'>${detail.test}</div>
                                        </div>
                                        <div class='report_row report_row_5col report_row_title'>
                                                <div class='report_col1'>Method</div>
                                                <div class='report_col2'>Desc</div>
                                                <div class='report_col3'>Actual</div>
                                                <div class='report_col4'>Expected</div>
                                                <div class='report_col5'>Result</div>
                                        </div>
                                        ${detail.expect.map(expect=>
                                            `<div class='report_row report_row_5col'>
                                                <div class='report_col1'>${expect.method}</div>
                                                <div class='report_col2'>${expect.desc}</div>
                                                <div class='report_col3'>${expect.actual}</div>
                                                <div class='report_col4'>${expect.expected}</div>
                                                <div class='report_col5'>${expect.result}</div>
                                            </div>`
                                            ).join('')
                                        }`
                                        ).join('')
                                    }`
                                ).join('')
                                }
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
    
    const test_lib = await import(`file://${process.cwd()}/test/test.js`);
    /**@type{server_db_config_server_service_test[]} */
    const params = Config.get({app_id:props.app_id,data:{object:'ConfigServer',config_group:'SERVICE_TEST'}});
    const fs = await import('node:fs');
    let finished = 0;
    /**@type{test_spec_result[]} */
    const specs = [];
    /**@type {test_specrunner} */
    const specrunner = await fs.promises.readFile(`${process.cwd()}/test/specrunner.json`, 'utf8')
                        .then((/**@type{string}*/result)=>JSON.parse(result));
    //run in random order if RANDOM parameter = '1'
    if (params.filter(row=>'RANDOM' in row)[0].RANDOM=='1')
        specrunner.specFiles = specrunner.specFiles.sort(()=>Math.random() - 0.5);
    for (const spec of specrunner.specFiles){
        try {
            const {default:testResult} = await import(`file://${process.cwd()}${spec.path}`);
            /**@type{test_spec_result['detail']}*/
            const detail_result = await testResult(test_lib);
            //check if any test inside spec file has empty expect length
            const FAIL_SPEC_WITH_NO_EXPECTATIONS = 
                    detail_result.filter(describe=>describe.expect.length==0).length > 0 &&
                    params.filter(row=>'FAIL_SPEC_WITH_NO_EXPECTATIONS' in row)[0].FAIL_SPEC_WITH_NO_EXPECTATIONS=='1';
            //check if any expect has result false
            const ANY_EXPECT_FALSE = detail_result.filter(describe=>
                                            describe.expect.filter(expect=>expect.result==false)).length > 0;
            specs.push({type:spec.type, 
                        path:spec.path,
                        result: FAIL_SPEC_WITH_NO_EXPECTATIONS==false && ANY_EXPECT_FALSE == false,
                        detail:detail_result});
            finished++;
            if (props.queue_parameters.appModuleQueueId)
                AppModuleQueue.update(props.app_id, props.queue_parameters.appModuleQueueId, {progress:(finished / specrunner.specFiles.length)});
        } catch (/**@type{*}*/error) {
            if (params.filter(row=>'STOP_ON_SPEC_FAILURE' in row)[0].STOP_ON_SPEC_FAILURE=='1')
                throw spec.path + ', ' + (typeof error == 'string'?
                                            error:JSON.stringify(error.message ?? error));
        }   
    }
    const report = {title:commonRegistryAppModule(props.app_id, {type:'REPORT', name:'BDD_TEST', role:'ADMIN'}).common_name,
                    date:Date(),
                    specs:specs};
    return template(report);
    
};
/**@type{server_apps_module_metadata[]}*/
const metadata = [{param:{name:'mode',text:'Mode', default:'REPORT'}}];
export {metadata};
export default component;
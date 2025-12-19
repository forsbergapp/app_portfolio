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
 * @import {server} from '../../../../server/types.js'
 */
const {server} = await import('../../../../server/server.js');
const test_lib = await import('../../../../test/test.js');

/**
 * @name template
 * @description Template
 * @function
 * @param {{title:string, 
 *          date:string,
 *          specs:server['test']['spec_result'][]}} props
 */
const template = props => ` <div id='report'>
                                <div id='report_title'>${props.title}</div>
                                <div id='report_date'>${props.date}</div>
                                ${props.specs.map(spec=>
                                    `<div class='report_section'>
                                        <div class='report_row report_row_2col'>
                                        <div class='report_col1'>Type</div>
                                        <div class='report_col2'>${spec.type}</div>
                                        </div>
                                        <div class='report_row report_row_2col '>
                                        <div class='report_col1'>Path</div>
                                        <div class='report_col2'>${spec.path}</div>
                                        </div>
                                        <div class='report_row report_row_2col'>
                                        <div class='report_col1'>Result</div>
                                        <div class='report_col2'>${spec.result}</div>
                                        </div>
                                        ${spec.detail.map(detail=>
                                            `<div class='report_section_detail'>
                                                <div class='report_row report_row_2col'>
                                                    <div class='report_col1'>Describe</div>
                                                    <div class='report_col2'>${detail.describe}</div>
                                                </div>
                                                <div class='report_row report_row_2col'>
                                                    <div class='report_col1'>It</div>
                                                    <div class='report_col2'>${detail.it.should}</div>
                                                </div>
                                                <div class='report_row_5col'>
                                                    <div class='report_row report_row_title'>
                                                            <div class='report_col'>Desc</div>
                                                            <div class='report_col'>Actual</div>
                                                            <div class='report_col'>Method</div>
                                                            <div class='report_col'>Expected</div>
                                                            <div class='report_col'>Result</div>
                                                    </div>
                                                    ${detail.it.expect.map(expect=>
                                                        `<div class='report_row'>
                                                            <div class='report_col'>${expect.desc}</div>
                                                            <div class='report_col'>${expect.actual}</div>
                                                            <div class='report_col'>${expect.method}</div>
                                                            <div class='report_col'>${expect.expected}</div>
                                                            <div class='report_col'>${expect.result}</div>
                                                        </div>`
                                                        ).join('')
                                                    }
                                                </div>
                                            </div>`
                                            ).join('')
                                        }
                                    </div>`
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

    const fs = await import('node:fs');
    let finished = 0;
    /**@type{server['test']['spec_result'][]} */
    const specs = [];

    /**@type {server['test']['specrunner']} */
    const specrunner = await fs.promises.readFile(`${server.ORM.serverProcess.cwd()}/test/specrunner.json`, 'utf8')
                        .then((/**@type{string}*/result)=>JSON.parse(result));
    //run in random order if RANDOM parameter = '1'
    if (server.ORM.OpenApiComponentParameters.config.TEST_RANDOM.default=='1')
        specrunner.specFiles = specrunner.specFiles.sort(()=>Math.random() - 0.5);
    for (const spec of specrunner.specFiles){
        try {
            const {default:testResult} = await import('../../../..' + spec.path);
            /**@type{server['test']['spec_result']['detail']}*/
            const detail_result = await testResult(test_lib);
            //check if any test inside spec file has empty expect length
            const FAIL_SPEC_WITH_NO_EXPECTATIONS = 
                    detail_result.filter(detail=>detail.it.expect.length==0).length > 0 &&
                    server.ORM.OpenApiComponentParameters.config.TEST_FAIL_SPEC_WITH_NO_EXPECTATIONS.default=='1';
            //check if any expect has result false
            const ANY_EXPECT_FALSE = detail_result.filter(detail=>
                                            detail.it.expect.filter(expect=>expect.result==false).length > 0).length > 0;
            specs.push({type:spec.type, 
                        path:spec.path,
                        result: FAIL_SPEC_WITH_NO_EXPECTATIONS==false && ANY_EXPECT_FALSE == false,
                        detail:detail_result});
            finished++;
            if (props.queue_parameters.appModuleQueueId)
                server.ORM.db.AppModuleQueue.update(props.app_id, props.queue_parameters.appModuleQueueId, {progress:(finished / specrunner.specFiles.length)});
        } catch (/**@type{*}*/error) {
            if (server.ORM.OpenApiComponentParameters.config.TEST_STOP_ON_SPEC_FAILURE.default=='1')
                throw spec.path + ', ' + (typeof error == 'string'?
                                            error:JSON.stringify(error.message ?? error));
        }   
    }
    const report = {title:server.app_common.commonRegistryAppModule(props.app_id, {type:'REPORT', name:'BDD_TEST', role:'ADMIN'}).ModuleName,
                    date:Date(),
                    specs:specs};
    return template(report);
    
};
/**@type{server['app']['commonModuleMetadata'][]}*/
const metadata = [{param:{name:'mode',text:'Mode', default:'REPORT'}}];
export {metadata};
export default component;
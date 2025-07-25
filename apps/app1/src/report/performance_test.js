/**
 * Report performance test
 * Tests performance of requests to servers main host using configured protocol and port
 * Runs in report queue where progress is updated
 * 
 * Different test pattern can be used using this report
 * Data analysis        Report is submitted to a queue where result is saved so reports can be compared
 * Hardware             Test on different servers
 * Software             Test use different installation on server
 * Function scenario    Test changing server, iam, microservice or apps parameters
 * 
 * Steady load          Run report once
 * Ramp up              Submit this report to queue increasingly
 * Spike load           Increase concurrency and requests parameter values
 * 
 * Load test            Modify concurrency and requests parameter values
 * Performance test     See result in report
 * 
 * @module apps/app1/src/report/performance_test
 */
/**
 * @import {server_apps_module_metadata} from '../../../../server/types.js'
 * @import {report_data,test_function_result} from '../types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {report_data} props
 */
const template = props => ` <div id='report'>
                                <div id='report_title'>${props.title}</div>
                                <div id='report_date'>${props.date}</div>
                                ${props.summary.map(row=>
                                    `<div class='report_row report_row_3col'>
                                        <div class='report_col1'>${row[0]}</div>
                                        <div class='report_col2'>
                                            <div class='report_col2_1'>${row[1]}</div>
                                            <div class='report_col2_2'>${row[2]}</div>
                                        </div>
                                    </div>`
                                ).join('')
                                }
                                <div class='report_row report_row_4col report_row_title'>
                                    <div class='report_col1'>RT ranges [ms]</div>
                                    <div class='report_col2'>
                                    </div>
                                </div>
                                ${props.rt_ranges.map(row=>
                                    `<div class='report_row report_row_4col'>
                                        <div class='report_col1'>
                                            <div class='report_col1_1'>${row[0]} - </div>
                                            <div class='report_col1_2'>${row[1]}</div>
                                        </div>
                                        <div class='report_col2'>
                                            <div class='report_col2_1'>${row[2]}</div>
                                            <div class='report_col2_2'>(${row[3]}%)</div>
                                        </div>
                                        
                                     </div>`
                                ).join('')
                                }
                                <div class='report_row report_row_2col report_row_title'>
                                    <div class='report_col1'>Percent</div>
                                    <div class='report_col2'></div>
                                </div>
                                ${props.rt_percent.map(row=>
                                    `<div class='report_row report_row_2col'>
                                        <div class='report_col1'>${row[0]} <= </div>
                                        <div class='report_col2'>${row[1]} ms</div>
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
 *                              concurrency:number,
 * 			                    requests:number
 * 		    }}} props
 * @returns {Promise.<string>}
 */
const component = async props => {
    const {serverUtilNumberValue} = await import('../../../../server/server.js');
    const {commonRegistryAppModule} = await import('../../../common/src/common.js');
    const AppModuleQueue = await import('../../../../server/db/AppModuleQueue.js');
    const ConfigServer = await import('../../../../server/db/ConfigServer.js');
    const {serverProcess} = await import('../../../../server/server.js');

    const PROTOCOL = 'http://';
    const HOST = ConfigServer.get({app_id:props.app_id,data:{config_group:'SERVER', parameter:'HOST'}}).result;
    const PORT = serverUtilNumberValue(ConfigServer.get({app_id:props.app_id,data:{config_group:'SERVER',parameter:'HTTP_PORT'}}).result);

    class Benchmark {
        /**
         * @param {{concurrency: number,
         *          requests: number,
         *          name:string}} options
         */
        constructor (options){
            this._name = options.name;
            /**@type{number} */
            this.requests = options.requests ?? 100;
            /**@type{number} */
            this.concurrency = options.concurrency || 5;
            this._finished = 0;
            /**@type{number} */
            this._reqSize = 0;
            /**@type{number} */
            this._resSize = 0;
            /**@type{number} */
            this._fail = 0;
            /**@type{number} */
            this._errors = 0;
            /**@type{number[]} */
            this._rts = [];
            /**@type{number} */
            this._startTime = 0;
            /**@type{number} */
            this._totalRT = 0;
        }
        /**
         * @param {number} size
         */
        formatSize (size) {
            let unit = 'bytes';
            if (size >= 1024) {
                unit = 'KB';
                size /= 1024;
            }
            if (size >= 1024) {
                unit = 'MB';
                size /= 1024;
            }
            if (size >= 1024) {
                unit = 'GB';
                size /= 1024;
            }
            return size.toFixed(2) + ' ' + unit;
        }
        /**
         * @param {number} startTime
         * @returns {report_data}
         */
        done = (startTime) =>{
            const totalUse = Date.now() - startTime;
            let minRT = null;
            let maxRT = null;
            /**@type {Object.<string,number>} */
            const rtCounts = {'1000+': 0};
            const times = [
                0.5, 1, 1.5, 2, 2.5, 3, 3.5,
                4, 5, 6, 7, 8, 9, 10,
                15, 20, 30, 50, 100, 200, 500, 1000
            ];
            for (let i = 0; i < times.length; i++) {
                rtCounts[times[i]] = 0;
            }

            const rts = this._rts;
            let totalRT = 0;
            for (let i = 0; i < rts.length; i++) {
                const rt = rts[i] / 1000;
                totalRT += rt;
                if (minRT === null || minRT > rt) {
                minRT = rt;
                }
                if (maxRT === null || maxRT < rt) {
                maxRT = rt;
                }
                let hit = false;
                for (let j = 0; j < times.length; j++) {
                const t = times[j];
                if (rt <= t) {
                    rtCounts[t] = (rtCounts[t] || 0) + 1;
                    hit = true;
                    break;
                }
                }
                if (!hit) {
                rtCounts['1000+']++;
                }
            }

            const avgRT = (totalRT / (this.requests*this.concurrency)).toFixed(3);
            const qps = ((this.requests*this.concurrency) / totalUse * 1000).toFixed(3);
            const total = this._finished;
            /**@type {Object.<string,number>} */
            const rates = {};
            for (const t in rtCounts) {
                const r = rtCounts[t] / total * 100;
                rates[t] = r;
            }

            const rtRates = {};
            let totalRate = 0;
            for (let i = 0; i < times.length; i++) {
                const t = times[i];
                totalRate += (rates[t] || 0);
                if (totalRate >= 99.9 && !rtRates[99.9]) {
                    rtRates[99.9] = t;
                }
                if (totalRate >= 99.5 && !rtRates[99.5]) {
                    rtRates[99.5] = t;
                }
                if (totalRate >= 99 && !rtRates[99]) {
                    rtRates[99] = t;
                }
                if (totalRate >= 98 && !rtRates[98]) {
                    rtRates[98] = t;
                }
                if (totalRate >= 97 && !rtRates[97]) {
                    rtRates[97] = t;
                }
                if (totalRate >= 96 && !rtRates[96]) {
                    rtRates[96] = t;
                }
                if (totalRate >= 95 && !rtRates[95]) {
                    rtRates[95] = t;
                }
                if (totalRate >= 90 && !rtRates[90]) {
                    rtRates[90] = t;
                }
                if (totalRate >= 85 && !rtRates[85]) {
                    rtRates[85] = t;
                }
                if (totalRate >= 80 && !rtRates[80]) {
                    rtRates[80] = t;
                }
                if (totalRate >= 70 && !rtRates[70]) {
                    rtRates[70] = t;
                }
                if (totalRate >= 60 && !rtRates[60]) {
                    rtRates[60] = t;
                }
                if (totalRate >= 50 && !rtRates[50]) {
                    rtRates[50] = t;
                }
                if (totalRate >= 40 && !rtRates[40]) {
                    rtRates[40] = t;
                    }
                if (totalRate >= 30 && !rtRates[30]) {
                    rtRates[30] = t;
                }
                if (totalRate >= 20 && !rtRates[20]) {
                    rtRates[20] = t;
                }
                if (totalRate >= 10 && !rtRates[10]) {
                    rtRates[10] = t;
                }
                if (totalRate >= 5 && !rtRates[5]) {
                    rtRates[5] = t;
                }
                else
                    rtRates[0] = t;
            }

            const totalSize = this._reqSize + this._resSize;
            const totalSizeRate = (totalSize / totalUse).toFixed(2);
            const reqSizeRate= (this._reqSize / totalUse).toFixed(2);
            const resSizeRate = (this._resSize / totalUse).toFixed(2);

            return {title:this._name,
                    date:Date(),
                    summary:                   [
                                                ['Finished requests',      total, ''],
                                                ['Concurrency Level',      this.concurrency, ''],
                                                ['Time taken for tests',   (totalUse / 1000).toFixed(3), 'seconds'],
                                                ['Complete requests',      total, ''],
                                                ['Failed requests',        this._fail, ''],
                                                ['Errors',                 this._errors,''],
                                                ['Total transferred',      this.formatSize(totalSize)       + ', ' + totalSizeRate,'[Kbytes/sec]'],
                                                ['Sent transferred',       this.formatSize(this._reqSize)   + ', ' + reqSizeRate,'[Kbytes/sec]'],
                                                ['Receive transferred',    this.formatSize(this._resSize)   + ', ' + resSizeRate,'[Kbytes/sec]'],
                                                ['Requests per second',    qps,'[#/sec]'],
                                                ['Average RT',             avgRT,'[ms]'],
                                                ['Min RT',                 minRT,'[ms]'],
                                                ['Max RT',                 maxRT,'[ms]']
                                               ],
                    rt_ranges:                  [
                                                //[start interval [ms],end interval [ms], count, rate %]
                                                ['0',   '0.5',  rtCounts['0.5'],rates['0.5'].toFixed(1)],
                                                ['0.5', '1',    rtCounts['1'],  rates['1'].toFixed(1)],
                                                ['1',   '1.5',  rtCounts['1.5'],rates['1.5'].toFixed(1)],
                                                ['1.5', '2',    rtCounts['2'],  rates['2'].toFixed(1)],
                                                ['2',   '2.5',  rtCounts['2.5'],rates['2.5'].toFixed(1)],
                                                ['2.5', '3',    rtCounts['3'],  rates['3'].toFixed(1)],
                                                ['3',   '3.5',  rtCounts['3.5'],rates['3.5'].toFixed(1)],
                                                ['3.5', '4',    rtCounts['4'], rates['4'].toFixed(1)],
                                                ['4',   '5',    rtCounts['5'], rates['5'].toFixed(1)],
                                                ['5',   '6',    rtCounts['6'], rates['6'].toFixed(1)],
                                                ['6',   '7',    rtCounts['7'], rates['7'].toFixed(1)],
                                                ['7',   '8',    rtCounts['8'], rates['8'].toFixed(1)],
                                                ['8',   '9',    rtCounts['9'], rates['9'].toFixed(1)],
                                                ['9',   '10',   rtCounts['10'], rates['10'].toFixed(1)],
                                                ['10', '15',    rtCounts['15'], rates['15'].toFixed(1)],
                                                ['15', '20',    rtCounts['20'], rates['20'].toFixed(1)],
                                                ['20', '30',    rtCounts['30'], rates['30'].toFixed(1)],
                                                ['30', '50',    rtCounts['50'], rates['50'].toFixed(1)],
                                                ['50', '100',   rtCounts['100'], rates['100'].toFixed(1)],
                                                ['100', '200',  rtCounts['200'], rates['200'].toFixed(1)],
                                                ['200', '500',  rtCounts['500'], rates['500'].toFixed(1)],
                                                ['500', '1000', rtCounts['1000'], rates['1000'].toFixed(1)],
                                                ['1000+', '',   rtCounts['1000+'], rates['1000+'].toFixed(1)]
                                                ],
                                                
                    rt_percent:                 [
                                                //[percent %, time ms] ex 99.9%: <= %s ms
                                                ['99.9%',   rtRates[99.9]??0], 
                                                ['99.5%',   rtRates[99.5]??0],
                                                ['99%',     rtRates[99]??0],
                                                ['98%',     rtRates[98]??0],
                                                ['97%',     rtRates[97]??0],
                                                ['96%',     rtRates[96]??0],
                                                ['95%',     rtRates[95]??0],
                                                ['90%',     rtRates[90]??0],
                                                ['85%',     rtRates[85]??0],
                                                ['80%',     rtRates[80]??0],
                                                ['70%',     rtRates[70]??0],
                                                ['60%',     rtRates[60]??0],
                                                ['50%',     rtRates[50]??0],
                                                ['40%',     rtRates[40]??0],
                                                ['30%',     rtRates[30]??0],
                                                ['20%',     rtRates[20]??0],
                                                ['10%',     rtRates[10]??0],
                                                ['5%',      rtRates[5]??0],
                                                ['0%',      rtRates[0]??0]
                                                ]
            };
        };
        async run () {
            const startTime = this._startTime = Date.now();
            return await new Promise(resolve=>{
                const next = async () => {
                    const start = performance.now();
                    test_function()
                    .then((/**@type{test_function_result}*/result)=>{
                        if (result.status!=200) {
                            this._fail++;
                        }
                        const use = performance.now() - start;
                        this._rts.push(use);
                        this._totalRT += use;
                        this._finished++;
                        if (result) {
                            if (result.reqSize) {
                                this._reqSize += result.reqSize;
                            }
                            if (result.resSize) {
                                this._resSize += result.resSize;
                            }
                        }
                        if (this._finished % Math.min(Math.floor((this.requests * this.concurrency) / 10),10000) === 0) {
                            if (props.queue_parameters.appModuleQueueId)
                                AppModuleQueue.update(props.app_id, props.queue_parameters.appModuleQueueId, {progress:(this._finished / (this.requests * this.concurrency))});
                        }
                        if (this._finished >= (this.requests * this.concurrency)) 
                            return resolve(this.done(startTime));
                    })
                    .catch(()=>{
                        this._finished++;
                        this._errors++;
                    });
                };
                for (let concurrency_id = 0; concurrency_id < this.concurrency; concurrency_id++) {
                    for (let i = 0; i < this.requests; i++)
                        next();
                }
            });   
        }
    }

    /**
     * Fetches servers main host using configured protocol and port
     * and returns result and metadata
    * @returns {Promise.<test_function_result>}
    */
    const test_function = async () => {
        /**@type{number} */
        let status;
        return await fetch(PROTOCOL + HOST + ':' + PORT)
                    .then((response=>{
                            status = response.status;
                            return response.text();
                            }))
                    .then((result=>{ 
                                    return {   result:result,
                                                reqSize: (PROTOCOL + HOST + ':' + PORT).length,
                                                resSize: result.length,
                                                status:status};
                                    }))
                    .catch((err)=>{throw err;});
    };
    //set parameter to avoid certificate errors
    const old = serverProcess.env.NODE_TLS_REJECT_UNAUTHORIZED;
    serverProcess.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
    const report = await new Benchmark({  concurrency: Number(props.queue_parameters.concurrency),
                                    requests: Number(props.queue_parameters.requests),
                                    name:commonRegistryAppModule(props.app_id, {type:'REPORT', name:'PERFORMANCE_TEST', role:'ADMIN'}).common_name
                                    }).run();

    serverProcess.env.NODE_TLS_REJECT_UNAUTHORIZED=old;

    return template(report);
};
/**@type{server_apps_module_metadata[]}*/
const metadata = [{param:{name:'concurrency',text:'Concurrency', default:50}},
                    {param:{name:'requests',text:'Requests', default:50}}];
export {metadata};
export default component;
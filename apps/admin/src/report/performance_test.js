/**
 *  Report performance test
 *   Tests performance of requests to servers main host using configured protocol and port
 *  removed 
 *    EventEmitter
 *    debug
 *    dependencies to third party modules
 *    fs file management
 *  replaced
 *    microtime with performance.now()
 *    function prototypes with one class with methods
 *    callback with async promise function
 *    synchronous fs.readFileSync with fs.promises.readFile
 *    test function returns result, status, reqSize, resSize
 *    var with const or let
 *    return text report with component and html report with result in array
 *  added 
 *    types
 * @module apps/admin/src/report/performance_test
 */

/**
 * @typedef {{  summary: [string, string|number][], 
 *              rt_ranges:[string,string,number,number][], //[start interval [ms],end interval [ms], count, rate %]
 *              rt_percent:[string,number][]}} report_data  //[percent %, time ms]
 */
/**
 * @typedef {{ result:string,
 *             reqSize:number,
 *             resSize:number,
 *             status:number}} test_function_result
 */
/**
 * @param {report_data} props
 */
const template = props => ` <div>
                                ${props.summary.map(row=>
                                    `<div class='report_row'>
                                        <div class='report_col1'>${row[0]}</div>
                                        <div class='report_col2'>${row[1]}</div>
                                    </div>`
                                ).join('')
                                }
                                ${props.rt_ranges.map(row=>
                                    `<div class='report_row report_title'>
                                        <div class='report_col1'>RT ranges [ms]</div>
                                        <div class='report_col2'></div>
                                        <div class='report_col3'></div>
                                        <div class='report_col4'></div>
                                     </div>
                                     <div class='report_row'>
                                        <div class='report_col1'>${row[0]} - </div>
                                        <div class='report_col2'>${row[1]}</div>
                                        <div class='report_col3'>${row[2]}</div>
                                        <div class='report_col4'>(${row[3]}%)</div>
                                     </div>`
                                ).join('')
                                }
                                ${props.rt_percent.map(row=>
                                    `<div class='report_row report_title'>
                                        <div class='report_col1'>Percent</div>
                                        <div class='report_col2'></div>
                                     </div><div class='report_row'>
                                        <div class='report_col1'>${row[0]} <= </div>
                                        <div class='report_col2'>${row[1]} ms</div>
                                    </div>`
                                ).join('')
                                }
                            </div>`;
/**
 * @param {{data:       {
 *                      concurrency:number,
 * 						requests:number
 * 						}}} props
 * @returns {Promise.<string>}
 */
const component = async props => {
    /**@type{import('../../../../server/db/file.js')} */
    const {fileCache} = await import(`file://${process.cwd()}/server/db/file.js`);
    /**@type{import('../../../../server/server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
    const common_app_id = serverUtilNumberValue(fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/key)=>'APP_COMMON_APP_ID'in key)[0].APP_COMMON_APP_ID) ?? 0;
    /**@type{import('../../../common/src/common.js')} */
    const {commonRegistryAppModule} = await import(`file://${process.cwd()}/apps/common/src/common.js`);

    class Benchmark {
    /**
     * @param {function} fn
     * @param {{concurrency: number,
     *          requests: number,
     *          name:string}} options
     */
    constructor (fn, options){
        this.fn = fn;
        this._name = options.name;
        /**@type{number} */
        this.requests = options.requests ?? 100;
        /**@type{number} */
        this._stageCount = Math.floor(this.requests / 10);
        if (this._stageCount > 10000) {
        this._stageCount = 10000;
        }
        /**@type{number} */
        this.concurrency = options.concurrency || 5;
        this._finished = 0;
        /**@type{number} */
        this._sent = 0;
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
     * @param {number} id
     * @param {number} startTime
     * @returns {report_data|void}
     */
    done = (id, startTime) =>{
        //console.log('#%d done', id);
        if (this._finished !== this.requests) {
            return;
        }
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

        const avgRT = (totalRT / this.requests).toFixed(3);
        const qps = (this.requests / totalUse * 1000).toFixed(3);
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
        }

        for (const t in rates) {
            rates[t] = rates[t].toFixed(1);
        }

        const totalSize = this._reqSize + this._resSize;
        const totalSizeRate = (totalSize / totalUse).toFixed(2);
        const reqSizeRate= (this._reqSize / totalUse).toFixed(2);
        const resSizeRate = (this._resSize / totalUse).toFixed(2);

        return {summary:                   [
                                            ['Finished requests',      total],
                                            ['Date',                   Date()],
                                            ['Concurrency Level',      this.concurrency],
                                            ['Time taken for tests',   (totalUse / 1000).toFixed(3) + 'seconds'],
                                            ['Complete requests',      total],
                                            ['Failed requests',        this._fail],
                                            ['Errors',                 this._errors],
                                            ['Total transferred',      this.formatSize(totalSize)       + ', ' + totalSizeRate+ '[Kbytes/sec]'],
                                            ['Sent transferred',       this.formatSize(this._reqSize)   + ', ' + reqSizeRate + '[Kbytes/sec]'],
                                            ['Receive transferred',    this.formatSize(this._resSize)   + ', ' + resSizeRate + '[Kbytes/sec]'],
                                            ['Requests per second',    qps + '[#/sec]'],
                                            ['Average RT',             avgRT + '[ms]'],
                                            ['Min RT',                 minRT + '[ms]'],
                                            ['Max RT',                 maxRT + '[ms]']
                                            ],
                rt_ranges:                  [
                                            //[start interval [ms],end interval [ms], count, rate %]
                                            ['0',   '0.5',  rtCounts['0.5'],rates['0.5']],
                                            ['0.5', '1',    rtCounts['1'],  rates['1']],
                                            ['1',   '1.5',  rtCounts['1.5'],rates['1.5']],
                                            ['1.5', '2',    rtCounts['2'],  rates['2']],
                                            ['2',   '2.5',  rtCounts['2.5'],rates['2.5']],
                                            ['2.5', '3',    rtCounts['3'],  rates['3']],
                                            ['3',   '3.5',  rtCounts['3.5'],rates['3.5']],
                                            ['3.5', '4',    rtCounts['4'], rates['4']],
                                            ['4',   '5',    rtCounts['5'], rates['5']],
                                            ['5',   '6',    rtCounts['6'], rates['6']],
                                            ['6',   '7',    rtCounts['7'], rates['7']],
                                            ['7',   '8',    rtCounts['8'], rates['8']],
                                            ['8',   '9',    rtCounts['9'], rates['9']],
                                            ['9',   '10',   rtCounts['10'], rates['10']],
                                            ['10', '15',    rtCounts['15'], rates['15']],
                                            ['15', '20',    rtCounts['20'], rates['20']],
                                            ['20', '30',    rtCounts['30'], rates['30']],
                                            ['30', '50',    rtCounts['50'], rates['50']],
                                            ['50', '100',   rtCounts['100'], rates['100']],
                                            ['100', '200',  rtCounts['200'], rates['200']],
                                            ['200', '500',  rtCounts['500'], rates['500']],
                                            ['500', '1000', rtCounts['1000'], rates['1000']],
                                            ['1000+', '',   rtCounts['1000+'], rates['1000+']]
                                            ],
                                            
                rt_percent:                 [
                                            //[percent %, time ms] ex 99.9%: <= %s ms
                                            ['99.9%',   rtRates[99.9]], 
                                            ['99.5%',   rtRates[99.5]],
                                            ['99%',     rtRates[99]],
                                            ['98%',     rtRates[98]],
                                            ['97%',     rtRates[97]],
                                            ['96%',     rtRates[96]],
                                            ['95%',     rtRates[95]],
                                            ['90%',     rtRates[90]],
                                            ['85%',     rtRates[85]],
                                            ['80%',     rtRates[80]],
                                            ['70%',     rtRates[70]],
                                            ['60%',     rtRates[60]],
                                            ['50%',     rtRates[50]]
                                            ]
        };
    };
    run () {
        const startTime = this._startTime = Date.now();
        
        for (let i = 0; i < this.concurrency; i++) {
            this.next(i, startTime);
        }
        
        return this;
        }
        /**
         * @param {number} id
         * @param {number} startTime
         */
        next = async (id, startTime) => {
        const start = performance.now();
        if (this._sent === this.requests) {     
            return this.done(id, startTime);
        }
        this._sent++;
        await this.fn()
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
            if (this._finished % this._stageCount === 0) {
                const totalUse = Date.now() - this._startTime;
        
                console.log('%sCompleted %s%, %d requests, qps: %s, rt: %s ms, speed: %s (%s / %s) [Kbytes/sec]',
                this._name ? (this._name + ': ') : '',
                (this._finished / this.requests * 100).toFixed(0),
                this._finished, (this._finished / totalUse * 1000).toFixed(3),
                (this._totalRT / this._finished / 1000).toFixed(3),
                ((this._reqSize + this._resSize) / totalUse).toFixed(2),
                (this._reqSize / totalUse).toFixed(2),
                (this._resSize / totalUse).toFixed(2)
                );
            }})
        .catch((/**@type{Error}*/err)=>{
            this._errors++;
            console.log('ERROR', err);
            console.log('finished', this._finished);
            
            throw err;
        });      
        this.next(id, startTime);
        };
    }

    /**
     * Fetches servers main host using configured protocol and port
     * and returns result and metadata
    * @returns {Promise.<test_function_result>}
    */
    const test_function = async () => {
        /**@type{number} */
        let status;
        const HTTPS_ENABLE = fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/row)=>'HTTPS_ENABLE' in row)[0].HTTPS_ENABLE;
        const PROTOCOL = HTTPS_ENABLE =='1'?'https://':'http://';
        const HOST = fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/row)=>'HOST' in row)[0].HOST;
        const PORT = serverUtilNumberValue(HTTPS_ENABLE=='1'?
                        fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/row)=>'HTTPS_PORT' in row)[0].HTTPS_PORT:
                            fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/row)=>'HTTP_PORT' in row)[0].HTTP_PORT);
        return await fetch(PROTOCOL + HOST + ':' + PORT)
                    .then((response=>{
                            status = response.status;
                            return response.text();
                            }))
                    .then((result=>{ return {   result:result,
                                                reqSize: (PROTOCOL + HOST + ':' + PORT).length,
                                                resSize: result.length,
                                                status:status};
                                    }))
                    .catch((err)=>{throw err;});
    };
    //set parameter to avoid certificate errors
    const old = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';

    const report = new Benchmark(test_function, {
                                                    concurrency: props.data.concurrency,
                                                    requests: props.data.requests,
                                                    name:commonRegistryAppModule(common_app_id, {type:'REPORT', name:'PERFORMANCE_TEST', role:'ADMIN'}).common_name
                                                    }).run();

    process.env.NODE_TLS_REJECT_UNAUTHORIZED=old;

    return template(report);
};
export default component;
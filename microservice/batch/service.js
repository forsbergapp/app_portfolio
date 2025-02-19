/** 
 * Microservice batch service
 * @module microservice/batch/service 
 */

/**@type{import('../../microservice/registry.js')} */
const {registryConfigServices} = await import(`file://${process.cwd()}/microservice/registry.js`);
/**@type{{  jobid:number,
            log_id: number, 
            filename: string, 
            timeId:NodeJS.Timeout, 
            command:string, 
            cron_expression:string, 
            milliseconds: number,
            scheduled_start: Date}[]} */
const JOBS = [];

/**
 * @name getMonth
 * @description Get month string from number
 * @function
 * @param {string|number} month 
 * @returns {number}
 */
const getMonth = month => {
    /**@type{[index:any][*]} */
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    if (Number.isNaN(month))
        return months.findIndex(String(month).toLowerCase());
    else
        return  Number(month);  
};
/**
 * @name getDayOfWeek
 * @description Get day string of weekday number
 * @function
 * @param {string|number} weekday 
 * @returns {number}
 */
const getDayOfWeek = (weekday) => {
    /**@type{[index:any][*]} */
    const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    if (Number.isNaN(weekday))
        return weekdays.findIndex(String(weekday).toLowerCase());
    else
        return  Number(weekday);      
};
/**
 * @name validateCronExpression
 * @description Validate cron expression
 * @function
 * @param {string} expression 
 * @returns {boolean}
 */
const validateCronExpression = (expression) =>{
    /**@type{*[]} */
    const expression_array = expression.split(' ');
    if (expression_array.length!=5)
        return false;
    try{
        //minutes
        if (expression_array[0] !='*' && Number(expression_array[0]) <0 && Number(expression_array[0]) >59 )
            return false;
        //hours
        if (expression_array[1] !='*' && Number(expression_array[1]) <0 && Number(expression_array[1]) >23)
            return false;
        //day of month
        if (expression_array[2] !='*' && Number(expression_array[2]) <1 && Number(expression_array[2]) >31)
            return false;
        //month (validate text or numbers)
        if (expression_array[3] !='*' && ((Number.isNaN(expression_array[3]) && getMonth(expression_array[3]) ==-1) || 
                                            (!Number.isNaN(expression_array[3]) && Number(expression_array[3]) <1 && Number(expression_array[3]) >12)))
            return false;
        //day of week (validate text or numbers)
        if ((expression_array[4] !='*' && ((Number.isNaN(expression_array[4]) && getDayOfWeek(expression_array[4]) ==-1) || 
                                            (!Number.isNaN(expression_array[4]) && Number(expression_array[4]) <0 && Number(expression_array[4]) >7) || 
                                                (expression_array[2]!='*' && expression_array[4] !='*'))))
            return false;

        return true;
    }
    catch(error){
        return false;
    }
};	
/**
 * @name getBatchLogFilename
 * @description Get batchlog filename
 * @function
 * @returns {string}
 */
const getBatchLogFilename = () => {
    const configservice = registryConfigServices('BATCH');
    //new log every day, format YYYY-MM-DD_[file_batchlog]
    const logdate = new Date();
    const month   = logdate.toLocaleString('en-US', { month: '2-digit'});
    const day     = logdate.toLocaleString('en-US', { day: '2-digit'});
    return `${configservice.PATH_DATA}${configservice.NAME}_${new Date().getFullYear()}${month}${day}.log`; 
};
/**
 * @name jobLogAdd
 * @description Add job log
 * @function
 * @param {{log_id: number|null,
 *          jobid: number|null,
 *          scheduled_start: Date|null,
 *          start:string|null,
 *          end:string|null,
 *          status:'PENDING'|'RUNNING'|'CANCELED'|'FAILED'|'FINISHED',
 *          result:*
 *          }} joblog
 * @returns {Promise.<{log_id:number, filename:string}>}
 */
const jobLogAdd = async (joblog)=>{
    const fs = await import('node:fs');
    //add 10ms wait so log_id will be guaranteed unique on a fast server
    await new Promise ((resolve)=>{setTimeout(()=> resolve(null), 10);});
    joblog.log_id = joblog.log_id ?? Date.now();
    const log = JSON.stringify({log_id: joblog.log_id, 
                                jobid: joblog.jobid, 
                                scheduled_start: joblog.scheduled_start, 
                                start:joblog.start, 
                                end:joblog.end, 
                                status:joblog.status, 
                                result:joblog.result});
    const filename = getBatchLogFilename();
    await fs.promises.appendFile(`${process.cwd()}${filename}`, log + '\r\n', 'utf8');
    //return log_id and the filename where the joblog.log_id is found
    return {log_id: joblog.log_id, filename: filename};
};
/**
 * @name scheduleMilliseconds
 * @description Calculates scheduled time in milliseconds
 * 
 *              cron expressions:
 *
 *              supported:
 *              cron_expression[0] minutes       *, 0-59
 *              cron_expression[1] hours         *, 0-23
 *              cron_expression[2] day of month  *, 1-31
 *              cron_expression[3] month         *, 1-12 (jan-dec)
 *              cron_expression[4] day of week   0-7 (SUN, MON, TUE, WED, THU, FRI, SAT, SUN) (sun will return 0)
 *              if specifying day 29-31 not in current month, then next day will be scheduled
 *
 *              not supported: 
 *              L (last)
 *              ?
 *              - (range)
 *              / (increments)
 *              W(weekday)
 *              # (N-th occurrence)
 *              second
 *              year
 *              ~ (random)
 * @function
 * @param {string} cron_expression 
 * @returns {number}
 */
const scheduleMilliseconds = (cron_expression) =>{
    if (cron_expression== '* * * * *'){
        //every minute
        return 60*1000;
    }
    else{
        /**@type{*[]}*/
        const cron_expression_array = cron_expression.split(' ');
        /**@type{Date|Number|null} */
        let new_date = null;
        if (cron_expression_array[0]=='*' && cron_expression_array[1]=='*'){
            //every minute and every hour
            new_date = new Date().getTime() + (60*1000);
        }
        else
            if (cron_expression_array[0]!='*'){
                if (new Date().getMinutes()>=cron_expression_array[0]){
                    //next specific minute is next hour
                    //set next hour 
                    new_date = new Date().setHours(new Date().getHours()+1);
                    
                }
                //set specific minute
                if (new_date){
                    new_date = new Date(new_date).setMinutes(cron_expression_array[0]);
                }
                else
                    new_date = new Date().setMinutes(cron_expression_array[0]);
            }
            else
                new_date = new Date().getTime() + (60*1000);
            if (cron_expression_array[1]!='*'){
                if (new Date(new_date).getHours()>=cron_expression_array[1]){
                    //next specific hour is next day
                    if (cron_expression_array[3] == '*'){
                        //every month is specified
                        //set next day
                        new_date = new Date(new_date).setDate(new Date(new_date).getDate()+1);
                    }
                    else{
                        if (new Date(new_date).getMonth()>getMonth(cron_expression_array[3])-1){
                            //next specific hour will be next year since specific month is set and already passed
                            //set next year
                            new_date = new Date(new_date).setFullYear(new Date(new_date).getFullYear()+1);
                        }
                    }
                }
                //set specific hour
                new_date = new Date(new_date).setHours(cron_expression_array[1]);
            }

        //calculate day
        if (cron_expression_array[2]=='*' && cron_expression_array[4]=='*'){
            //every day and every weekday
            null;
        }
        else
            if (cron_expression_array[2]!='*'){
                if (new Date().getFullYear() == new Date(new_date).getFullYear() && new Date(new_date).getDate()>cron_expression_array[2]){
                    //next specific day is next month
                    new_date = new Date(new_date).setMonth(new Date(new_date).getMonth()+1);
                }
                //set specific day
                new_date = new Date(new_date).setDate(cron_expression_array[2]);
            }
            else{
                //set specific weekday
                /**@type{number} */
                const day_of_week = getDayOfWeek(cron_expression_array[4]);
                new_date = new Date(new_date).setDate(new Date(new_date).getDate() + (7 + day_of_week - new Date(new_date).getDay()) % 7);
            }
        //calculate month
        if (cron_expression_array[3]!='*'){
            const month = getMonth(cron_expression_array[3])-1;
            if (new Date().getFullYear() == new Date(new_date).getFullYear() && new Date(new_date).getMonth()>month){
                //next specific month next year
                //set next year
                new_date = new Date(new_date).setFullYear(new Date(new_date).getFullYear()+1);
            }
            //set specific month
            new_date = new Date(new_date).setMonth(month);
        }
        new_date = new Date(new_date).setSeconds(0);
        return new_date - Date.now();
    }
};
/**
 * @name scheduleJob
 * @description Schedule job
 * @function
 * @param {number} jobid 
 * @param {'OS'} command_type 
 * @param {string} path 
 * @param {string} command 
 * @param {string} argument 
 * @param {string} cron_expression 
 * @returns {Promise.<void>}
 */
const scheduleJob = async (jobid, command_type, path, command, argument, cron_expression) =>{
    const {exec} = await import('node:child_process');
    switch (command_type){
        case 'OS':{
            const milliseconds = scheduleMilliseconds(cron_expression);
            const scheduled_start = new Date(new Date().getTime() + milliseconds);
            //first log for jobid will get correlation log id
            //so all logs for this jobid can be traced
            const batchlog = await jobLogAdd({ log_id: null,
                                                jobid: jobid, 
                                                scheduled_start: scheduled_start, 
                                                start:null, 
                                                end:null, 
                                                status:'PENDING', 
                                                result:null});
            /**@type{NodeJS.Timeout} */
            let timeId = setTimeout(async () =>{
                    const start = new Date().toISOString();
                    await jobLogAdd({  log_id: batchlog.log_id,
                                        jobid: jobid, 
                                        scheduled_start: null, 
                                        start:start, 
                                        end:null, 
                                        status:'RUNNING', 
                                        result:null});
                    try{
                        let command_path;
                        if (path.includes('%HOMEPATH%')){
                            /**@ts-ignore */
                            command_path = path.replace('%HOMEPATH%', process.env.HOMEPATH);
                        }
                        if (path.includes('$HOME')){
                            /**@ts-ignore */
                            command_path = path.replace('$HOME', process.env.HOME);
                        }
                        exec(`${command} ${argument}`, {cwd: command_path}, (err, stdout, stderr) => {
                            jobLogAdd({log_id: batchlog.log_id,
                                        jobid: jobid, 
                                        scheduled_start: null, 
                                        start:start, 
                                        end:new Date().toISOString(), 
                                        status:err?'FAILED':'FINISHED', 
                                        result:err?err:`stdout: ${stdout}, stderr: ${stderr}`}).then(()=>{
                                //remove job
                                JOBS.forEach((job,index)=>{
                                    if (job.timeId == timeId)
                                        JOBS.splice(index,1);
                                });
                                clearTimeout(timeId);
                                /**@ts-ignore */
                                timeId = null;
                                //schedule job again, recursive call
                                scheduleJob(jobid, command_type, path, command, argument,cron_expression); 
                            });
                        });
                    }
                    catch(error){
                        await jobLogAdd({  log_id: batchlog.log_id,
                                            jobid: jobid, 
                                            scheduled_start: null, 
                                            start:start, 
                                            end:new Date().toISOString(), 
                                            status:'FAILED', 
                                            result:error});
                    }
                }, milliseconds);
            JOBS.push({ jobid:jobid, 
                        log_id: batchlog.log_id, 
                        filename: batchlog.filename, 
                        timeId:timeId, 
                        command:command, 
                        cron_expression:cron_expression, 
                        milliseconds: milliseconds,
                        scheduled_start: scheduled_start});
        }
    }		
};
/**
 * @name startJobs
 * @description Start jobs
 * @function
 * @returns {Promise.<void>}
 */
const startJobs = async () =>{
    const os = await import('node:os');
    //add server start in log, meaning all jobs were terminated
    await jobLogAdd({  log_id: null,
                        jobid: null, 
                        scheduled_start: null, 
                        start:new Date().toISOString(), 
                        end:null, 
                        status:'CANCELED', 
                        result:'SERVER RESTART'});
    /**@type{{  jobid:number,
     *          name:string,
     *          command_type:'OS',
     *          platform:string,
     *          path:string,
     *          command:string,
     *          argument:string,
     *          cron_expression:string,
     *          enabled:boolean}[]} 
     */
    const jobs = registryConfigServices('BATCH').CONFIG.filter(row=>'jobs' in row)[0].jobs;
    for (const job of jobs){
        //schedule enabled jobs and for current platform
        //use cron expression syntax
        if (job.enabled == true && job.platform == os.platform()){
            if (validateCronExpression(job.cron_expression))
                await scheduleJob(job.jobid, job.command_type, job.path, job.command, job.argument, job.cron_expression);
            else
                console.log('Not supported cron expression'); 
        }
    }
};
export {startJobs};
	
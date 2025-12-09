/** 
 * Microservice batch service
 * @module serviceregistry/microservice/batch/service 
 */


/**
 * @import {common, config, jobs} from './types.js'
 */

const {exec} = await import('node:child_process');
const os = await import('node:os');

/**@type{jobs} */
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
 * @returns {{milliseconds:number,
 *            scheduled_start:number}}
 */
const scheduleMilliseconds = (cron_expression) =>{
    const roundToNextMinute = milliseconds =>{
        //set to next minute and second to 0
         const roundUTC = UTC;
         roundUTC.setMinutes(roundUTC.getMinutes());
         roundUTC.setSeconds(0);
         return milliseconds + (roundUTC.valueOf() - UTC.valueOf() )
    };
    //Get current UTC time with seconds
    const UTC = new Date(   Number(new Date().toLocaleString('en', {timeZone: 'UTC', year:'numeric'})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', month:'numeric'}))-1,
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', day:'numeric'})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', hour:'numeric', hour12:false})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', minute:'numeric'})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', second:'numeric'})));
    

    
    if (cron_expression== '* * * * *'){
        //every minute
        return {
                milliseconds:roundToNextMinute(60*1000),
                scheduled_start:new Date(UTC.valueOf() + roundToNextMinute(60*1000))
                }
    }
    else{
        /**@type{*[]}*/
        const cron_expression_array = cron_expression.split(' ');
        /**@type{Date|Number|null} */
        let new_date = null;
        if (cron_expression_array[0]=='*' && cron_expression_array[1]=='*'){
            //every minute and every hour
            new_date = UTC.getTime() + (60*1000);
        }
        else
            if (cron_expression_array[0]!='*'){
                if (UTC.getMinutes()>=cron_expression_array[0]){
                    //next specific minute is next hour
                    //set next hour 
                    new_date = UTC.setHours(UTC.getHours()+1);
                    
                }
                //set specific minute
                if (new_date){
                    new_date = new Date(new_date).setMinutes(cron_expression_array[0]);
                }
                else
                    new_date = UTC.setMinutes(cron_expression_array[0]);
            }
            else
                new_date = UTC.getTime() + (60*1000);
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

        return {
                milliseconds:       roundToNextMinute(new_date - UTC.valueOf()),
                scheduled_start:    new Date(UTC.valueOf() + roundToNextMinute(new_date - UTC.valueOf()))
                } ;
    }
};
/**
 * @name scheduleJob
 * @description Schedule job
 * @function
 * @param {common['commonLog']}    commonLog
 * @param {config}      config
 * @param {string}      token
 * @param {number}      jobid 
 * @param {'OS'}        command_type 
 * @param {string}      command 
 * @param {string}      cron_expression 
 * @returns {Promise.<void>}
 */
const scheduleJob = async (commonLog, config, token, jobid, command_type, command, cron_expression) =>{
    /**
     * @param {{}} message
     * @param {'MICROSERVICE_LOG'|'MICROSERVICE_ERROR'|null} type
     */
    const log = async (message, type='MICROSERVICE_LOG') =>{
        commonLog({type:type,
                    service:'BATCH',
                    message:JSON.stringify(message),
                    token:token,
                    message_queue_method:config.message_queue_method,
                    message_queue_url:config.message_queue_url,
                    uuid:config.uuid,
                    secret:config.secret
        });
    };
    switch (command_type){
        case 'OS':{
            const schedule  = scheduleMilliseconds(cron_expression);
            //first log for jobid will get correlation log id
            //so all logs for this jobid can be traced
            const log_id = Date.now();
            await log({ log_id: log_id,
                        jobid: jobid, 
                        scheduled_start: schedule.scheduled_start, 
                        start:null, 
                        end:null, 
                        status:'PENDING', 
                        result:null});
            /**@type{NodeJS.Timeout} */
            let timeId = setTimeout(async () =>{
                    const start = new Date().toISOString();
                    await log({ log_id: log_id,
                                jobid: jobid, 
                                scheduled_start: null, 
                                start:start, 
                                end:null, 
                                status:'RUNNING', 
                                result:null});
                    try{
                        exec(command, (err, stdout, stderr) => {
                            log({
                                    log_id: log_id,
                                    jobid: jobid, 
                                    scheduled_start: null, 
                                    start:start, 
                                    end:new Date().toISOString(), 
                                    status:err?'FAILED':'FINISHED', 
                                    result:err?err:`stdout: ${stdout}, stderr: ${stderr}`
                                }).then(()=>{
                                //remove job
                                JOBS.forEach((job,index)=>{
                                    if (job.timeId == timeId)
                                        JOBS.splice(index,1);
                                });
                                clearTimeout(timeId);
                                /**@ts-ignore */
                                timeId = null;
                                //schedule job again, recursive call
                                scheduleJob(commonLog, config, token, jobid, command_type, command, cron_expression); 
                            });
                        });
                    }
                    catch(error){
                        await log({
                                    log_id: log_id,
                                    jobid: jobid, 
                                    scheduled_start: null, 
                                    start:start, 
                                    end:new Date().toISOString(), 
                                    status:'FAILED', 
                                    result:error
                                });
                    }
                }, schedule.milliseconds);
            JOBS.push({ jobid:jobid, 
                        log_id: log_id, 
                        timeId:timeId, 
                        command:command, 
                        cron_expression:cron_expression, 
                        milliseconds: schedule.milliseconds,
                        scheduled_start: schedule.scheduled_start});
            break;
        }
        default:{
            log( 
                {
                    error:'Command type:' + command_type
                }, 'MICROSERVICE_ERROR');
        }
    }		
};
/**
 * @name startJobs
 * @description Start jobs
 * @function
 * @param {common} common
 * @param {config} config
 * @param {string} token
 * @returns {Promise.<void>}
 */
const startJobs = async (common, config, token) =>{
    
    await common.commonLog({type:'MICROSERVICE_LOG', 
                            service:'BATCH',
                            message: JSON.stringify({ 
                                        log_id: null,
                                        jobid: null, 
                                        scheduled_start: null, 
                                        start:new Date().toISOString(), 
                                        end:null, 
                                        status:'CANCELED', 
                                        result:'SERVER RESTART'
                                    }),
                            token:token,
                            message_queue_url:config.message_queue_url,
                            message_queue_method:config.message_queue_method,
                            uuid:config.uuid,
                            secret:config.secret
                        });
    /**@type{config['config']['jobs']} */                        
    const jobs = config.config.filter(row=>'jobs' in row)[0].jobs;
    for (const job of jobs){
        //schedule enabled jobs and for current platform
        //use cron expression syntax
        if (job.enabled == true && job.platform == os.platform()){
            if (validateCronExpression(job.cron_expression))
                await scheduleJob(  common.commonLog, 
                                    config,
                                    token,
                                    job.jobid, 
                                    job.command_type, 
                                    job.command, 
                                    job.cron_expression);
            else
                await common.commonLog({type:'MICROSERVICE_ERROR', 
                                        service:'BATCH',
                                        message: 'Not supported cron expression',
                                        token:token,
                                        message_queue_url:config.message_queue_url,
                                        message_queue_method:config.message_queue_method,
                                        uuid:config.uuid,
                                        secret:config.secret}); 
        }
    }
};
export {startJobs};
	
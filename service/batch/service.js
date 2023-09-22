const JOBS = [];
const file_batch        = 'batch.json';
const log_path          = '/service/logs/';
const file_batchlog     = 'batch_log.json';

const get_month = (month) => {
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    if (isNaN(month))
        return months.findIndex(String(month).toLowerCase());
    else
        return  Number(month);  
};
const get_day_of_week = (weekday) => {
    const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    if (isNaN(weekday))
        return weekdays.findIndex(String(weekday).toLowerCase());
    else
        return  Number(weekday);      
};
const validate_cron_expression = (expression) =>{
    expression = expression.split(' ');
    if (expression.length!=5)
        return false;
    try{
        //minutes
        if (expression[0] !='*' && Number(expression[0]) <0 && Number(expression[0]) >59 )
            return false;
        //hours
        if (expression[1] !='*' && Number(expression[1]) <0 && Number(expression[1]) >23)
            return false;
        //day of month
        if (expression[2] !='*' && Number(expression[2]) <1 && Number(expression[2]) >31)
            return false;
        //month (validate text or numbers)
        if (expression[3] !='*' && ((Number(expression[3]) == 'NaN' && get_month(expression[3]) ==-1) || 
                                    (Number(expression[3]) != 'NaN' && Number(expression[3]) <1 && Number(expression[3]) >12)))
            return false;
        //day of week (validate text or numbers)
        if ((expression[4] !='*' && ((Number(expression[4]) == 'NaN' && get_day_of_week(expression[4]) ==-1) || 
                                     (Number(expression[4]) != 'NaN' && Number(expression[4]) <0 && Number(expression[4]) >7) || (expression[2]!='*' && expression[4] !='*'))))
            return false;

        return true;
    }
    catch(error){
        return false;
    }
};	
const get_batchlog_filename = () => {
    //new log every day, format YYYY-MM-DD_[file_batchlog]
    const logdate = new Date();
    const month   = logdate.toLocaleString('en-US', { month: '2-digit'});
    const day     = logdate.toLocaleString('en-US', { day: '2-digit'});
    return `${log_path}${new Date().getFullYear()}${month}${day}_${file_batchlog}`; 
};
/*
    joblog_add
  
    joblog
    {
    "log_id":           [id],
    "jobid":            [jobid],
    "scheduled_start":  [date],
    "start":            [date],
    "end":              [date],
    "status":           [status],
    "result":           [result]
    }
*/
const joblog_add = async (joblog)=>{
    const fs = await import('node:fs');
    //add 10ms wait so log_id will be guaranteed unique on a fast server
    await new Promise ((resolve)=>{setTimeout(()=> resolve(), 10);});
    joblog.log_id = joblog.log_id ?? Date.now();
    const log = JSON.stringify({log_id: joblog.log_id, 
                                jobid: joblog.jobid, 
                                scheduled_start: joblog.scheduled_start, 
                                start:joblog.start, 
                                end:joblog.end, 
                                status:joblog.status, 
                                result:joblog.result});
    const filename = get_batchlog_filename();
    await fs.promises.appendFile(`${process.cwd()}${filename}`, log + '\r\n', 'utf8');
    //return log_id and the filename where the joblog.log_id is found
    return {log_id: joblog.log_id, filename: filename};
};

const joblog_cancel_pending = async ()=>{
    for (const scheduled_job of JOBS){
        await joblog_add({  log_id: scheduled_job.log_id,
                            jobid: scheduled_job.jobid, 
                            scheduled_start: scheduled_job.scheduled_start, 
                            start:null, 
                            end:new Date().toISOString(), 
                            status:'CANCELED', 
                            result:'Server restart'});
    }
};

/*
scheduled_milliseconds
        cron expressions:

        supported:
        cron_expression[0] minutes       *, 0-59
        cron_expression[1] hours         *, 0-23
        cron_expression[2] day of month  *, 1-31
        cron_expression[3] month         *, 1-12 (jan-dec)
        cron_expression[4] day of week   0-7 (SUN, MON, TUE, WED, THU, FRI, SAT, SUN) (sun will return 0)
        if specifying day 29-31 not in current month, then next day will be scheduled

        not supported: 
            L (last)
            ?
            - (range)
            / (increments)
            W(weekday)
            # (N-th occurrence)
            second
            year
            ~ (random)
*/
const scheduled_milliseconds = (cron_expression) =>{
    if (cron_expression== '* * * * *'){
        //every minute
        return 60*1000;
    }
    else{
        cron_expression = cron_expression.split(' ');
        let new_date;
        if (cron_expression[0]=='*' && cron_expression[1]=='*'){
            //every minute and every hour
            new_date = new Date().getTime() + (60*1000);
        }
        else
            if (cron_expression[0]!='*'){
                if (new Date().getMinutes()>=cron_expression[0]){
                    //next specific minute is next hour
                    //set next hour 
                    new_date = new Date().setHours(new Date().getHours()+1);
                    
                }
                //set specific minute
                new_date = new Date(new_date).setMinutes(cron_expression[0]);
                
            }
            else
                new_date = new Date().getTime() + (60*1000);
            if (cron_expression[1]!='*'){
                if (new Date(new_date).getHours()>=cron_expression[1]){
                    //next specific hour is next day
                    if (cron_expression[3] == '*'){
                        //every month is specified
                        //set next day
                        new_date = new Date(new_date).setDate(new Date(new_date).getDate()+1);
                    }
                    else{
                        if (new Date(new_date).getMonth()>get_month(cron_expression[3])-1){
                            //next specific hour will be next year since specific month is set and already passed
                            //set next year
                            new_date = new Date(new_date).setFullYear(new Date(new_date).getFullYear()+1);
                        }
                    }
                }
                //set specific hour
                new_date = new Date(new_date).setHours(cron_expression[1]);
            }

        //calculate day
        if (cron_expression[2]=='*' && cron_expression[4]=='*'){
            //every day and every weekday
            null;
        }
        else
            if (cron_expression[2]!='*'){
                if (new Date().getFullYear() == new Date(new_date).getFullYear() && new Date(new_date).getDate()>cron_expression[2]){
                    //next specific day is next month
                    new_date = new Date(new_date).setMonth(new Date(new_date).getMonth()+1);
                }
                //set specific day
                new_date = new Date(new_date).setDate(cron_expression[2]);
            }
            else{
                //set specific weekday
                const day_of_week = get_day_of_week(cron_expression[4]);
                new_date = new Date(new_date).setDate(new Date(new_date).getDate() + (7 + day_of_week - new Date(new_date).getDay()) % 7);
            }
        //calculate month
        if (cron_expression[3]!='*'){
            const month = get_month(cron_expression[3])-1;
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

const schedule_job = async (jobid, command_type, path, command, argument, cron_expression) =>{
    const {exec} = await import('node:child_process');
    switch (command_type){
        case 'OS':{
            const milliseconds = scheduled_milliseconds(cron_expression);
            const scheduled_start = new Date(new Date().getTime() + milliseconds);
            //first log for jobid will get correlation log id
            //so all logs for this jobid can be traced
            const batchlog = await joblog_add({ log_id: null,
                                                jobid: jobid, 
                                                scheduled_start: scheduled_start, 
                                                start:null, 
                                                end:null, 
                                                status:'PENDING', 
                                                result:null});
            let timeId = setTimeout(async () =>{
                    const start = new Date().toISOString();
                    await joblog_add({  log_id: batchlog.log_id,
                                        jobid: jobid, 
                                        scheduled_start: null, 
                                        start:start, 
                                        end:null, 
                                        status:'RUNNING', 
                                        result:null});
                    try{
                        let command_path;
                        if (path.includes('%HOMEPATH%'))
                            command_path = path.replace('%HOMEPATH%', process.env.HOMEPATH);
                        if (path.includes('$HOME'))
                            command_path = path.replace('$HOME', process.env.HOME);

                        exec(`${command} ${argument}`, {cwd: command_path}, (err, stdout, stderr) => {
                            let new_status;
                            let message;
                            if (err){
                                new_status = 'FAILED';
                                message = err;
                            }
                            else{
                                new_status = 'FINISHED';
                                message = `stdout: ${stdout}, stderr: ${stderr}`;
                            }
                            joblog_add({log_id: batchlog.log_id,
                                        jobid: jobid, 
                                        scheduled_start: null, 
                                        start:start, 
                                        end:new Date().toISOString(), 
                                        status:new_status, 
                                        result:message}).then(()=>{
                                //remove job
                                JOBS.forEach((job,index)=>{
                                    if (job.timeId == timeId)
                                        JOBS.splice(index,1);
                                });
                                clearTimeout(timeId);
                                timeId = null;
                                //schedule job again, recursive call
                                schedule_job(jobid, command_type, path, command, argument,cron_expression); 
                            });
                        });
                    }
                    catch(error){
                        await joblog_add({  log_id: batchlog.log_id,
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
    
const start_jobs = async () =>{
    const fs = await import('node:fs');
    const os = await import('node:os');
    let jobs = await fs.promises.readFile(`${process.cwd()}${log_path}${file_batch}`, 'utf8');
    jobs = JSON.parse(jobs);
    for (const job of jobs){
        //schedule enabled jobs and for current platform
        //use cron expression syntax
        if (job.enabled == true && job.platform == os.platform()){
            if (validate_cron_expression(job.cron_expression))
                await schedule_job(job.jobid, job.command_type, job.path, job.command, job.argument, job.cron_expression);
            else
                console.log('Not supported cron expression'); 
        }
    }
};
export {joblog_cancel_pending, start_jobs};
	
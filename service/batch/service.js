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
const joblog_add = async (jobid, scheduled_start, start, end, status, result)=>{
    const fs = await import('node:fs');
    //add 10ms wait so log_id will be guaranteed unique on a fast server
    await new Promise ((resolve)=>{setTimeout(()=> resolve(), 10);});
    const log_id = Date.now();
    const log = JSON.stringify({log_id: log_id, jobid:jobid, scheduled_start: scheduled_start, start:start, end:end, status:status, result:result});
    const filename = get_batchlog_filename();
    await fs.promises.appendFile(`${process.cwd()}${filename}`, log + '\r\n', 'utf8');
    //return log_id and the filename where the log_id is found
    return {log_id: log_id, filename: filename};
};
const joblog_update = async (log_id, start, end, status, result)=>{
    const fs = await import('node:fs');
    const joblog_filename = JOBS.filter(row=>row.log_id==log_id)[0].filename;
    const joblog = await fs.promises.readFile(`${process.cwd()}${joblog_filename}`, 'utf8');
    let joblog_updated = '';
    joblog.split('\r\n').forEach(row=>{
        if (row!=''){
            const rowobj = JSON.parse(row);
            if (rowobj.log_id == log_id){
                rowobj.start = start;
                rowobj.end = end;
                rowobj.status = status;
                rowobj.result = result;
            }
            joblog_updated += JSON.stringify(rowobj) + '\r\n';
        }
    });
    await fs.promises.writeFile(`${process.cwd()}${joblog_filename}`, joblog_updated, 'utf8');
};
const joblog_cancel_pending = async ()=>{
    const fs = await import('node:fs');
    const files = await fs.promises.readdir(`${process.cwd()}${log_path}`);
    for (const file of files){
        if (file.endsWith(file_batchlog)){
            const joblog = await fs.promises.readFile(`${process.cwd()}${log_path}${file}`, 'utf8');
            let joblog_updated = '';
            joblog.split('\r\n').forEach(row=>{
                if (row!=''){
                    const rowobj = JSON.parse(row);
                    if (rowobj.status == 'PENDING' || rowobj.status == 'RUNNING'){
                        rowobj.end    = new Date().toISOString();
                        rowobj.status = 'CANCELED';
                        rowobj.result = 'Server restart';
                    }
                    joblog_updated += JSON.stringify(rowobj) + '\r\n';
                }
            });
            await fs.promises.writeFile(`${process.cwd()}${log_path}${file}`, joblog_updated, 'utf8');
        }
    }
};

const scheduled_milliseconds = (cron_expression) =>{
    if (cron_expression== '* * * * *'){
        //every minute
        return 60*1000;
    }
    else{
        cron_expression = cron_expression.split(' ');
        let new_date;
        /*
        not supported: L (last), ?, - (range), / (increments), W(weekday), # (N-th occurrence), second, year, ~ (random)
                                         supported:
        cron_expression[0] minutes       *, 0-59
        cron_expression[1] hours         *, 0-23
        cron_expression[2] day of month  *, 1-31
        cron_expression[3] month         *, 1-12 (jan-dec)
        cron_expression[4] day of week   0-7 (SUN, MON, TUE, WED, THU, FRI, SAT, SUN) (sun will return 0)
        if specifying day 29-31 not in current month, then next day will be scheduled
        */
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
            const batchlog = await joblog_add(jobid, new Date(new Date().getTime() + milliseconds), null,null, 'PENDING', null);
            let timeId = setTimeout(async () =>{
                    const start = new Date().toISOString();
                    await joblog_update(batchlog.log_id, start, null, 'RUNNING', null);
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
                                            joblog_update(batchlog.log_id, start, new Date().toISOString(), new_status, message).then(()=>{
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
                        await joblog_update(batchlog.log_id, start, new Date().toISOString(), 'FAILED', error);
                    }
                }, milliseconds);
            JOBS.push({jobid:jobid, log_id: batchlog.log_id, filename: batchlog.filename, timeId:timeId, command:command, cron_expression:cron_expression, milliseconds: milliseconds});
        }
    }		
};
    
const start_jobs = async () =>{
    const fs = await import('node:fs');
    const os = await import('node:os');
    let jobs = await fs.promises.readFile(`${process.cwd()}${log_path}${file_batch}`, 'utf8');
    jobs = JSON.parse(jobs);
    //cancel any pending job that was not finished after server restarted
    await joblog_cancel_pending();
    //schedule enabled jobs and for current platform
    //use cron expression syntax
    for (const job of jobs){
        if (job.enabled == true && job.platform == os.platform()){
            if (validate_cron_expression(job.cron_expression))
                await schedule_job(job.jobid, job.command_type, job.path, job.command, job.argument, job.cron_expression);
            else
                console.log('Not supported cron expression'); 
        }
    }
};
export {start_jobs};
	
/** @module server/dbapi/app_portfolio/user_account */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account.service.js`);

const { default: {compareSync} } = await import('bcryptjs');
const { ConfigGet } = await import(`file://${process.cwd()}/server/config.service.js`);
const { getMessage } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/message.service.js`);
const { getLastUserEvent, insertUserEvent } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_event.service.js`);
const { getParameter } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {string} emailtype 
 * @param {string} host 
 * @param {number} userid 
 * @param {string|null} verification_code 
 * @param {string} email 
 * @param {Types.callBack} callBack 
 */
const sendUserEmail = async (app_id, emailtype, host, userid, verification_code, email, callBack) => {
    const { createMail} = await import(`file://${process.cwd()}/apps/apps.service.js`);
    const { MessageQueue } = await import(`file://${process.cwd()}/service/service.service.js`);
    
    createMail(app_id, 
        {
            'emailtype':        emailtype,
            'host':             host,
            'app_user_id':      userid,
            'verificationCode': verification_code,
            'to':               email,
        }).then((/**@type{Types.email_return_data}*/email)=>{
            MessageQueue('MAIL', 'PUBLISH', email, null)
            .then(()=>{
                callBack(null, null);
            })
            .catch((/**@type{Types.error}*/error)=>{
                callBack(error, null);
            });
        })
        .catch((/**@type{Types.error}*/error)=>{
            callBack(error, null);
        });
};
/**
 * 
 * @param {number} app_id 
 * @param {string} lang_code 
 * @param {Types.error} err 
 * @param {Types.res} res 
 */
 const checked_error = (app_id, lang_code, err, res) =>{
    import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({ get_app_code }) => {
        const app_code = get_app_code(  err.errorNum, 
                                        err.message, 
                                        err.code, 
                                        err.errno, 
                                        err.sqlMessage);
        if (app_code != null){
            getMessage( app_id,
                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                        app_code, 
                        lang_code)
            .then((/**@type{Types.db_result_message_getMessage[]}*/result_message)=>{
                res.status(400).send(
                    result_message[0].text
                );
            })
            .catch((/**@type{Types.error}*/error)=>{
                res.status(500).send(
                    error
                );
            });
        }
        else
            res.status(500).send(
                err
            );
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getUserByUserId = (req, res) => {
    service.getUserByUserId(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
    .then((/**@type{Types.db_result_user_account_getUserByUserId[]}*/result)=>{
        if (result[0]) {
            //send without {} so the variablename is not sent
            res.status(200).json(
                result[0]
            );
        }
        else{
            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
            });
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const searchProfileUser = (req, res) => {
    service.searchProfileUser(getNumberValue(req.query.app_id), req.query.search)
    .then((/**@type{Types.db_result_user_account_searchProfileUser[]}*/result_search)=>{
        import(`file://${process.cwd()}/server/dbapi/app_portfolio/profile_search.service.js`).then(({ insertProfileSearch }) => {
            /**@type{Types.db_parameter_profile_search_insertProfileSearch} */
            const data = {  user_account_id:    req.body.user_account_id,
                            search:             req.query.search,
                            client_ip:          req.ip,
                            client_user_agent:  req.headers['user-agent'],
                            client_longitude:   req.body.client_longitude,
                            client_latitude:    req.body.client_latitude};
            insertProfileSearch(getNumberValue(req.query.app_id), data)
            .then(()=>{
                if (result_search.length>0)
                    res.status(200).json({
                        count: result_search.length,
                        items: result_search
                    });
                else {
                    //return silent message if not found, no popup message
                    res.status(200).json({
                        count: 0,
                        items: null
                    });
                }
            })
            .catch((/**@type{Types.error}*/error)=>{
                res.status(500).send(
                    error
                );
            });
        });
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getProfileDetail = (req, res) => {
    service.getProfileDetail(getNumberValue(req.query.app_id), getNumberValue(req.query.user_account_id), getNumberValue(req.query.detailchoice))
    .then((/**@type{Types.db_result_user_account_getProfileDetail[]}*/result)=>{
        if (result)
            res.status(200).send(result);
        else {
            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
            });
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const updateUserLocal = async (req, res) => {
    try{
        // get provider column used to validate and password to compare
        /**@type{Types.db_result_user_account_getUserByUserId[]}*/
        const result_user = await service.getUserByUserId(getNumberValue(req.query.app_id), getNumberValue(req.params.id));
        if (result_user[0]) {
            if (compareSync(req.body.password, result_user[0].password ?? '')){
                let send_email=false;
                if (req.body.new_email && req.body.new_email!=''){
                    /**@type{Types.db_result_user_account_event_getLastUserEvent[]}*/
                    const result_user_event = await getLastUserEvent(getNumberValue(req.query.app_id), getNumberValue(req.params.id), 'EMAIL_VERIFIED_CHANGE_EMAIL');
                    if ((result_user_event[0] && 
                        (+ new Date(result_user_event[0].current_timestamp) - + new Date(result_user_event[0].date_created))/ (1000 * 60 * 60 * 24) >= 1)||
                            result_user_event.length == 0)
                        send_email=true;
                }
                /**@type{Types.db_parameter_user_account_updateUserLocal} */
                const data = {  bio:                req.body.bio,
                                private:            req.body.private,
                                username:           req.body.username,
                                password:           req.body.password,
                                password_new:       (req.body.password_new && req.body.password_new!='')==true?req.body.password_new:null,
                                password_reminder:  (req.body.password_reminder && req.body.password_reminder!='')==true?req.body.password_reminder:null,
                                email:              req.body.email,
                                email_unverified:   (req.body.new_email && req.body.new_email!='')==true?req.body.new_email:null,
                                avatar:             req.body.avatar,
                                verification_code:  send_email==true?service.verification_code():null,
                                provider_id:        result_user[0].provider_id,
                                admin:              0
                            };
                service.updateUserLocal(getNumberValue(req.query.app_id), data, getNumberValue(req.params.id))
                .then((/**@type{Types.db_result_user_account_updateUserLocal}*/result_update)=>{
                    if (result_update){
                        if (send_email){
                            //no change email in progress or older than at least 1 day
                            /**@type{Types.db_parameter_user_account_event_insertUserEvent}*/
                            const eventData = {
                                user_account_id: getNumberValue(req.params.id),
                                event: 'EMAIL_VERIFIED_CHANGE_EMAIL',
                                event_status: 'INPROGRESS',
                                user_language: req.body.user_language,
                                user_timezone: req.body.user_timezone,
                                user_number_system: req.body.user_number_system,
                                user_platform: req.body.user_platform,
                                server_remote_addr : req.ip,
                                server_user_agent : req.headers['user-agent'],
                                server_http_host : req.headers.host,
                                server_http_accept_language : req.headers['accept-language'],
                                client_latitude : req.body.client_latitude,
                                client_longitude : req.body.client_longitude
                            };
                            insertUserEvent(getNumberValue(req.query.app_id), eventData)
                            .then(()=>{
                                getParameter(getNumberValue(req.query.app_id), getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),'SERVICE_MAIL_TYPE_CHANGE_EMAIL')
                                .then((/**@type{Types.db_result_app_parameter_getParameter[]}*/parameter)=>{
                                    //send email SERVICE_MAIL_TYPE_CHANGE_EMAIL
                                    sendUserEmail(  getNumberValue(req.query.app_id), 
                                                    parameter[0].parameter_value, 
                                                    req.headers.host, 
                                                    getNumberValue(req.params.id), 
                                                    data.verification_code, 
                                                    req.body.new_email, 
                                                    (/**@type{Types.error}*/err)=>{
                                        if (err)
                                            res.status(500).send(
                                                err
                                            );
                                        else
                                            res.status(200).json({
                                                sent_change_email: 1
                                            });
                                    });
                                });
                            });
                        }
                        else
                            res.status(200).json({
                                sent_change_email: 0
                            });
                    }
                    else{
                        import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                            record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                        });
                    }
                })
                .catch((/**@type{Types.error}*/error)=>{
                    checked_error(req.query.app_id, req.query.lang_code, error, res);
                });
            } 
            else {
                res.statusMessage = 'invalid password attempt for user id:' + req.params.id;
                //invalid password
                getMessage( getNumberValue(req.query.app_id),
                            getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                            '20401',
                            req.query.lang_code)
                .then((/**@type{Types.db_result_message_getMessage[]}*/result_message)=>{
                    res.status(400).send(
                        result_message[0].text
                    );
                });
            }
        } 
        else {
            //user not found
            getMessage( getNumberValue(req.query.app_id),
                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                        '20305',
                        req.query.lang_code)
            .then((/**@type{Types.db_result_message_getMessage[]}*/result_message)=>{
                res.status(404).send(
                    result_message[0].text
                );
            });
        }    
    }
    catch (/**@type{Types.error}*/error){
        res.status(500).send(
            error
        );
    }
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const updatePassword = (req, res) => {    
    /**@type{Types.db_parameter_user_account_updatePassword} */
    const data = {                  
                    password_new:   req.body.password_new,
                    auth:           req.body.auth};
    service.updatePassword(getNumberValue(req.query.app_id), getNumberValue(req.params.id), data)
    .then((/**@type{Types.db_result_user_account_updatePassword}*/result_update)=>{
        if (result_update) {
            /**@type{Types.db_parameter_user_account_event_insertUserEvent}*/
            const eventData = {
                user_account_id: getNumberValue(req.params.id),
                event: 'PASSWORD_RESET',
                event_status: 'SUCCESSFUL',
                user_language: req.body.user_language,
                user_timezone: req.body.user_timezone,
                user_number_system: req.body.user_number_system,
                user_platform: req.body.user_platform,
                server_remote_addr : req.ip,
                server_user_agent : req.headers['user-agent'],
                server_http_host : req.headers.host,
                server_http_accept_language : req.headers['accept-language'],
                client_latitude : req.body.client_latitude,
                client_longitude : req.body.client_longitude
            };
            insertUserEvent(getNumberValue(req.query.app_id), eventData)
            .then(()=>{
                res.status(200).send(
                    result_update
                );
            })
            .catch(()=> {
                res.status(200).json({
                    sent: 0
                });
            });
        }
        else{
            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
            });
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        checked_error(req.query.app_id, req.query.lang_code, error, res);
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const updateUserCommon = (req, res) => {
    /**@type{Types.db_parameter_user_account_updateUserCommon} */
    const data = {  username:   req.body.username,
                    bio:        req.body.bio,
                    private:    req.body.private};
    service.updateUserCommon(getNumberValue(req.query.app_id), data, getNumberValue(req.params.id))
    .then((/**@type{Types.db_result_user_account_updateUserCommon}*/result_update)=>{
        if (result_update) {
            res.status(200).send(
                result_update
            );
        }
        else{
            import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
            });
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        checked_error(req.query.app_id, req.query.lang_code, error, res);
    });
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const deleteUser = (req, res) => {
    service.getUserByUserId(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
    .then((/**@type{Types.db_result_user_account_getUserByUserId[]}*/result_user)=>{
        if (result_user[0]) {
            if (result_user[0].provider_id !=null){
                service.deleteUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
                .then((/**@type{Types.db_result_user_account_deleteUser}*/result_delete)=>{
                    if (result_delete) {
                        res.status(200).send(
                            result_delete
                        );
                    }
                    else{
                        import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                            record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                        });
                    }
                })
                .catch((/**@type{Types.error}*/error)=>{
                    res.status(500).send(
                        error
                    );
                });
            }
            else{
                service.checkPassword(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
                .then((/**@type{Types.db_result_user_account_checkPassword[]}*/result_password)=>{
                    if (result_password[0]) {
                        if (compareSync(req.body.password, result_password[0].password)){
                            service.deleteUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
                            .then((/**@type{Types.db_result_user_account_deleteUser}*/result_delete)=>{
                                if (result_delete) {
                                    res.status(200).send(
                                        result_delete
                                    );
                                }
                                else{
                                    import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                                        record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                                    });
                                }
                            })
                            .catch((/**@type{Types.error}*/error)=>{
                                res.status(500).send(
                                    error
                                );
                            });
                        }
                        else{
                            res.statusMessage = 'invalid password attempt for user id:' + req.params.id;
                            //invalid password
                            getMessage( getNumberValue(req.query.app_id),
                                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                        '20401',
                                        req.query.lang_code)
                            .then((/**@type{Types.db_result_message_getMessage[]}*/result_message)=>{
                                res.status(400).send(
                                    result_message[0].text
                                );
                            })
                            .catch((/**@type{Types.error}*/error)=>{
                                res.status(500).send(
                                    error
                                );
                            });
                        } 
                    }
                    else{
                        //user not found
                        getMessage( getNumberValue(req.query.app_id),
                                    getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                    '20305',
                                    req.query.lang_code)
                        .then((/**@type{Types.db_result_message_getMessage[]}*/result_message)=>{
                            res.status(404).send(
                                result_message[0].text
                            );
                        })
                        .catch((/**@type{Types.error}*/error)=>{
                            res.status(500).send(
                                error
                            );
                        });
                    }
                })
                .catch((/**@type{Types.error}*/error)=>{
                    res.status(500).send(
                        error
                    );
                });
            }
        }
        else{
            //user not found
            getMessage( getNumberValue(req.query.app_id),
                        getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                        '20305',
                        req.query.lang_code)
            .then((/**@type{Types.db_result_message_getMessage[]}*/result_message)=>{
                res.status(404).send(
                    result_message[0].text
                );
            })
            .catch((/**@type{Types.error}*/error)=>{
                res.status(500).send(
                    error
                );
            });
        }
    })
    .catch((/**@type{Types.error}*/error)=>{
        res.status(500).send(
            error
        );
    });
};
export{getUserByUserId, searchProfileUser, getProfileDetail,
       updateUserLocal, updatePassword, updateUserCommon,deleteUser};
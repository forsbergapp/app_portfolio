/** @module server/broadcast */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./broadcast.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * Broadcast send as system admin
 * @param {Types.req} req
 * @param {Types.res} res
 */
const BroadcastSendSystemAdmin = (req, res) => {
    service.BroadcastSendSystemAdmin(getNumberValue(req.body.app_id), getNumberValue(req.body.client_id), getNumberValue(req.body.client_id_current),
                                        req.body.broadcast_type, req.body.broadcast_message, (/**@type{Types.error}*/err, result) =>{
        res.status(200).json(
            result
        );
    });
};
/**
 * Broadcast send as admin
 * @param {Types.req} req
 * @param {Types.res} res
 */
const BroadcastSendAdmin = (req, res) => {
    service.BroadcastSendAdmin(getNumberValue(req.body.app_id), getNumberValue(req.body.client_id), getNumberValue(req.body.client_id_current),
                                req.body.broadcast_type, req.body.broadcast_message, (/**@type{Types.error}*/err, result) =>{
        res.status(200).json(
            result
        );
    });
};
/**
 * Broadcast connected list admin
 * @param {Types.req} req
 * @param {Types.res} res
 */
const ConnectedList = (req, res) => {
    service.ConnectedList(getNumberValue(req.query.app_id), getNumberValue(req.query.select_app_id), getNumberValue(req.query.limit), getNumberValue(req.query.year), getNumberValue(req.query.month), 
                            req.query.order_by, req.query.sort, 0, (/**@type{Types.error}*/err, result) => {
        if (err) {
            res.status(500).send({
                data: err
            });
        }
        else{
            if (result && result.length>0)
                res.status(200).json(result);
            else{
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
                });
            }
        }
    });
};
/**
 * Broadcast connected list system admin
 * @param {Types.req} req
 * @param {Types.res} res
 */
const ConnectedListSystemAdmin = (req, res) => {
    service.ConnectedList(getNumberValue(req.query.app_id), getNumberValue(req.query.select_app_id), getNumberValue(req.query.limit), getNumberValue(req.query.year), getNumberValue(req.query.month), 
                            req.query.order_by, req.query.sort,  1, (/**@type{Types.error}*/err, result) => {
        if (err) {
            res.status(500).send({
                data: err
            });
        }
        else{
            if (result && result.length>0)
                res.status(200).json(result);
            else{
                res.status(404).send(
                    'Record not found'
                );
            }
        }
    });
};
/**
 * Broadcast connected list count
 * @param {Types.req} req
 * @param {Types.res} res
 */
const ConnectedCount = (req, res) => {
    service.ConnectedCount(getNumberValue(req.query.identity_provider_id), getNumberValue(req.query.count_logged_in), (/**@type{Types.error}*/err, count_connected) => {
        res.status(200).json({
            data: count_connected
        });
    });
};
/**
 * Broadcast connected list update
 * @param {Types.req} req
 * @param {Types.res} res
 */
const ConnectedUpdate = (req, res) => {
    service.ConnectedUpdate(getNumberValue(req.query.client_id), getNumberValue(req.query.user_account_logon_user_account_id), getNumberValue(req.query.system_admin), getNumberValue(req.query.identity_provider_id), 
                            req.query.latitude, req.query.longitude,
                            (/**@type{Types.error}*/err, result) =>{
        res.status(200).json(
            err ?? result
        );
    });
};
/**
 * Broadcast check connected
 * @param {Types.req} req
 * @param {Types.res} res
 */
const ConnectedCheck = (req, res) => {
    service.ConnectedCheck(getNumberValue(req.params.user_account_id), (/**@type{Types.error}*/err, result_connected)=>{
        res.status(200).json({
            online: result_connected
        });
    });
};
export {BroadcastSendSystemAdmin, BroadcastSendAdmin, 
        ConnectedList, ConnectedListSystemAdmin, ConnectedCount, ConnectedUpdate, ConnectedCheck};
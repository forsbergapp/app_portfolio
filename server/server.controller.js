/** @module server */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import('./server.service.js');

/**
 * Config maintenance get
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const ConfigMaintenanceGet = (req, res) => {
    service.ConfigMaintenanceGet((err, result)=>{
        if (err){
            res.status(500).send(
                err
            );
        }
        else
            res.status(200).json(
                {value: result}
            );
    });
};
/**
 * Config maintenance set
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const ConfigMaintenanceSet = (req, res) => {
    service.ConfigMaintenanceSet(req.body.value, (err, result)=>{
        if (err){
            res.status(500).send(
                err
            );
        }
        else
            res.status(200).json(
                result
            );
    });
};
/**
 * Config get saved
 * @async
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const ConfigGetSaved = async (req, res) => {
    try {
        const result = await service.ConfigGetSaved(req.query.config_type_no);
        res.status(200).json(
            {
                data: result
            }
        );
    } catch (error) {
        res.status(500).send(
            error
        );   
    }
};
/**
 * Config save
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const ConfigSave = (req,res) => {
    service.ConfigSave(parseInt(req.body.config_no), req.body.config_json, false, (err, result)=>{
        if (err){
            res.status(500).send(
                err
            );
        }
        else
            res.status(200).json(
                result
            );
    });
};
/**
 * Config get
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const ConfigGet = (req,res) => {
    
    service.ConfigGetCallBack(req.query.config_group, req.query.parameter, (err, result)=>{
        if (err){
            res.status(500).send(
                err
            );
        }
        else
            res.status(200).json(
                {
                    data: result
                }
            );
    });
};
/**
 * Config get
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
 const ConfigGetApps = (req,res) => {
    res.status(200).json(
        {
            data: service.ConfigGetApps()
        }
    );
};

/**
 * Config info
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const ConfigInfo = (req,res) => {
    service.ConfigInfo((err, result)=>{
        if (err){
            res.status(500).send(
                err
            );
        }
        else
            res.status(200).json(
                {
                    data: result.info
                }
            );
    });
};
/**
 * Info
 * @param {Types.req} req - Request
 * @param {Types.res} res
 */
const Info = (req,res) => {
    service.Info((err, result)=>{
        if (err){
            res.status(500).send(
                err
            );
        }
        else
            res.status(200).json(
                    result
            );
    });
};
export{ConfigMaintenanceGet, ConfigMaintenanceSet, ConfigGetSaved, ConfigSave, ConfigGetApps, ConfigGet, ConfigInfo, Info};
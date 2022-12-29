const { createLogAppSE } = require(global.SERVER_ROOT + "/service/log/log.controller");
const { ConfigMaintenanceGet, ConfigMaintenanceSet, ConfigGetSaved, ConfigSave, ConfigGetCallBack, ConfigInfo, Info} = require ('./server.service');
module.exports = {
    ConfigMaintenanceGet:(req, res) =>{
        ConfigMaintenanceGet((err, result)=>{
            if (err){
                return res.status(500).send(
                    err
                );
            }
            else
                return res.status(200).json(
                    {value: result}
                );
        })
    },
    ConfigMaintenanceSet:(req, res) =>{
        ConfigMaintenanceSet(req.body.value, (err, result)=>{
            if (err){
                return res.status(500).send(
                    err
                );
            }
            else
                return res.status(200).json(
                    result
                );
        })
    },
    ConfigGetSaved:(req, res) =>{
        ConfigGetSaved(req.query.config_type_no, (err, result)=>{
            if (err){
                return res.status(500).send(
                    err
                );
            }
            else
                return res.status(200).json(
                    {
                        data: result
                    }
                );
        })
    },
    ConfigSave: (req,res) =>{
        ConfigSave(req.body.config_no, req.body.config_json, false, (err, result)=>{
            if (err){
                return res.status(500).send(
                    err
                );
            }
            else
                return res.status(200).json(
                    result
                );
        })
    },
    ConfigGet: (req,res) =>{
        ConfigGetCallBack(req.query.config_type_no, req.query.config_group, req.query.parameter, (err, result)=>{
            if (err){
                return res.status(500).send(
                    err
                );
            }
            else
                return res.status(200).json(
                    {
                        data: result
                    }
                );
        })
    },
    ConfigInfo:(req,res)=>{
        ConfigInfo((err, result)=>{
            if (err){
                return res.status(500).send(
                    err
                );
            }
            else
                return res.status(200).json(
                    {
                        data: result.info
                    }
                );
        })
    },
    Info:(req,res)=>{
        Info((err, result)=>{
            if (err){
                return res.status(500).send(
                    err
                );
            }
            else
                return res.status(200).json(
                        result
                );
        })
    }
};
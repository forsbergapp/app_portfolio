const { createLogAppSE } = require(global.SERVER_ROOT + "/service/log/log.controller");
const { ConfigMaintenanceGet, ConfigMaintenanceSet, ConfigServerParameterGet, ConfigSave, ConfigGetCallBack, DefaultConfig, Info} = require ('./server.service');
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
    ConfigServerParameterGet:(req, res) =>{
        ConfigServerParameterGet(req.query.config_type_no, (err, result)=>{
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
    ConfigSave: (req,res) =>{
        ConfigSave(req.query.app_id, req.body.config_no, req.body.config_json, (err, result)=>{
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
        ConfigGetCallBack(req.query.config_type_no, null, null, (err, result)=>{
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
    DefaultConfig:(req,res)=>{
        DefaultConfig(req.body.admin_name, req.body.admin_password, (err, result)=>{
            if (err){
                return res.status(500).send(
                    err
                );
            }
            else
                return res.status(200).json(
                    {
                        data: result.default_config
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
                    {
                        data: result.info
                    }
                );
        })
    }
};
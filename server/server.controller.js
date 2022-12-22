const { createLogAppSE } = require(global.SERVER_ROOT + "/service/log/log.controller");
const { ConfigGet, ConfigUpdateParameter, ConfigMaintenanceGet, ConfigMaintenanceSet, ConfigServerParameterGet, ConfigSave, DefaultConfig, Info} = require ('./server.service');
module.exports = {
	ConfigGet: (req, res) => {
        ConfigGet(req.query.config_no, req.query.parameter_name, (err, result)=>{
            if (err){
                return res.status(500).send(
                    err
                );
            }
            else
                return res.status(200).json({
                    data: result.config,
                    parameter_name:  result.parameter_name,
                    parameter_value : result.parameter_value
                });
        })
    },
    ConfigUpdateParameter: (req, res) => {
        ConfigUpdateParameter(req.body.parameter_name, req.body.parameter_value, (err, result)=>{
            if (err){
                return res.status(500).send(
                    err
                );
            }
            else
                return res.status(200).json({
                    parameter_name  : result.parameter_name,
                    parameter_value : result.parameter_value
                });
        })        
    },
    ConfigMaintenanceGet:(req, res) =>{
        ConfigMaintenanceGet((err, result)=>{
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
    ConfigMaintenanceSet:(req, res) =>{
        ConfigMaintenanceSet(req.query.value, (err, result)=>{
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
        ConfigServerParameterGet(req.query.config_type_no, req.query.parameter_name, (err, result)=>{
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
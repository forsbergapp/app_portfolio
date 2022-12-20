const { createLogAppSE } = require(global.SERVER_ROOT + "/service/log/log.controller");
const { ConfigGet, ConfigUpdateParameter, ConfigSave, DefaultConfig, Info} = require ('./server.service');
module.exports = {
	ConfigGet: (req, res) => {
        ConfigGet(req.query.parameter_name, (err, result)=>{
            if (err){
                return res.status(500).send(
                    err
                );
            }
            else
                return res.status(200).json({
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
    ConfigSave: (req,res) =>{
        ConfigSave(req.body.config_server, req.body.config_server, req.body.config_server, req.body.config_server, (err, result)=>{
            if (err){
                return res.status(500).send(
                    err
                );
            }
            else
                return res.status(200).json(
                    {
                        config_server: result.config_server,
                        config_blockip: result.config_blockip,
                        config_useragent: result.config_useragent,
                        config_policy: result.config_policy
                    }
                );
        })
    },
    DefaultConfig:(req,res)=>{
        DefaultConfig(admin_name, admin_password, (err, result)=>{
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
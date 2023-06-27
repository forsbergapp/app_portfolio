const service = await import('./server.service.js');

const ConfigMaintenanceGet = (req, res) => {
    service.ConfigMaintenanceGet((err, result)=>{
        if (err){
            return res.status(500).send(
                err
            );
        }
        else
            return res.status(200).json(
                {value: result}
            );
    });
};
const ConfigMaintenanceSet = (req, res) => {
    service.ConfigMaintenanceSet(req.body.value, (err, result)=>{
        if (err){
            return res.status(500).send(
                err
            );
        }
        else
            return res.status(200).json(
                result
            );
    });
};
const ConfigGetSaved = (req, res) => {
    service.ConfigGetSaved(req.query.config_type_no, (err, result)=>{
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
    });
};
const ConfigSave = (req,res) => {
    service.ConfigSave(req.body.config_no, req.body.config_json, false, (err, result)=>{
        if (err){
            return res.status(500).send(
                err
            );
        }
        else
            return res.status(200).json(
                result
            );
    });
};
const ConfigGet = (req,res) => {
    service.ConfigGetCallBack(req.query.config_type_no, req.query.config_group, req.query.parameter, (err, result)=>{
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
    });
};
const ConfigInfo = (req,res) => {
    service.ConfigInfo((err, result)=>{
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
    });
};
const Info = (req,res) => {
    service.Info((err, result)=>{
        if (err){
            return res.status(500).send(
                err
            );
        }
        else
            return res.status(200).json(
                    result
            );
    });
};
export{ConfigMaintenanceGet, ConfigMaintenanceSet, ConfigGetSaved, ConfigSave,ConfigGet, ConfigInfo, Info};
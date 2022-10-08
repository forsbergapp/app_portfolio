module.exports = {
	ConfigGet: (req, res) => {
        let parameter_value = eval(`process.env.${req.query.parameter_name}`);
        return res.status(200).json({
            parameter_name:  req.query.parameter_name,
            parameter_value : parameter_value
        });
    },
    ConfigUpdateParameter: (req, res) => {
        let parameter_value = eval(`process.env.${req.body.parameter_name}`);
        eval(` process.env.${req.body.parameter_name} = ${req.body.parameter_value}`);
        return res.status(200).json({
            parameter_name  : req.body.parameter_name,
            parameter_value : eval(`process.env.${req.body.parameter_name}`)
        });
    },
    ConfigUpdateAll: (req,res) =>{
        null;
    }
};